# APEX Circuit Lab — Technical Design Document

> A browser-based electronics laboratory for the APEX robotics learning platform.
> Inspired by Tinkercad Circuits, architected to surpass it for education and robotics.

**Status:** v0.1 — MVP vertical slice shipped (`/lab`). This document is the source of
truth for architecture and the forward roadmap.

---

## 1. Goals & Non-Goals

### Goals
- A real, graph-based circuit **simulation engine** (not a fake/animation). Solves node
  voltages and branch currents via **Modified Nodal Analysis (MNA)** with **Newton–Raphson**
  for nonlinear devices (diodes/LEDs).
- A modern editor: infinite canvas, pan/zoom, drag-place components, click-to-wire,
  live property editing, real-time visual feedback (LED glow scales with actual current).
- **Zero new runtime dependencies.** The host repo intentionally ships only `next`,
  `react`, `framer-motion`. We keep it that way; the engine is dependency-free TypeScript.
- An **extensible component model** so adding a part (relay, motor, Arduino) is a data +
  small-model change, not an architectural one.
- Save/Load as JSON; a clear path to cloud persistence, code simulation, and 3D robotics.

### Non-Goals (for MVP)
- Full SPICE transient/AC analysis (we do DC operating-point; transient is roadmapped).
- 1000-component WebGL rendering (SVG MVP is correct for educational circuit sizes;
  the renderer is abstracted so Canvas/WebGL is a localized swap — see §7).
- Microcontroller code execution (architecture reserves a hook; see §12).

---

## 2. Recommended Tech Stack & Rationale

| Concern | Choice | Why | Tradeoff / Mitigation |
|---|---|---|---|
| Framework | **Next.js 15 App Router + React 19** | Already the platform; full-screen client route at `/lab`. | Sim must run outside React render — solved with an external store. |
| Language | **TypeScript (strict)** | Engine correctness; component models are typed contracts. | None material. |
| Rendering | **SVG (MVP)** behind a renderer boundary | Crisp at any zoom, trivial hit-testing, accessible (focusable nodes, ARIA), React-friendly. Educational circuits are <100 parts. | Caps ~1–2k nodes. Mitigation: renderer is isolated; Canvas2D/PixiJS swap is localized (§7). |
| Simulation | **Custom MNA solver** (pure TS) | "Do not fake simulation." MNA is how SPICE/CircuitJS work. Dependency-free, testable, portable. | We implement linear algebra ourselves (dense LU). Fine at MVP sizes; sparse path roadmapped. |
| State | **Framework-agnostic store + `useSyncExternalStore`** | Engine stays pure; React subscribes granularly → minimal re-renders; sim loop mutates outside React. | Less batteries-included than Zustand. Zustand is a drop-in upgrade if desired (1 KB). |
| Styling | **Tailwind + inline tokens** | Matches host conventions and dark theme. | None. |
| Persistence | **localStorage + JSON import/export** | Offline-first, zero backend. | Cloud save schema designed (§4) for later. |
| Math | **Hand-rolled `linalg.ts`** | Avoid `mathjs` (heavy). Dense Gaussian elimination w/ partial pivoting. | O(n³); acceptable < ~300 unknowns. Sparse roadmapped. |

**Why not React Three Fiber / Three.js for MVP?** 3D is for *future* robot/digital-twin
models. A 2D schematic editor in 3D is friction without benefit. R3F is reserved for the
robotics-visualization module (§12), kept behind the same renderer boundary.

**Why not Redux?** Boilerplate and action-dispatch overhead fight a 60 Hz sim loop. An
external store with selective subscriptions is leaner and faster here.

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  app/lab/page.tsx  (full-screen Next.js client route)             │
│                                                                    │
│  components/simulator/ (React — VIEW + INTERACTION)                │
│   ┌────────────┬──────────────────────────┬───────────────────┐   │
│   │ Toolbar    │ Workspace (SVG canvas)    │ PropertiesPanel   │   │
│   │ run/stop…  │  pan/zoom, parts, wires   │ edit selection    │   │
│   ├────────────┤  drag-place, click-wire   ├───────────────────┤   │
│   │ Library    │                           │ Console (logs)    │   │
│   └────────────┴──────────────────────────┴───────────────────┘   │
│            │  subscribe (useSyncExternalStore)   ▲ actions          │
│            ▼                                     │                  │
│  lib/simulator/store.ts   (STATE — document + UI + results)        │
│   - schematic: parts[], wires[], selection, view (pan/zoom)        │
│   - results: node voltages, branch currents, warnings              │
│   - actions: addPart, movePart, wire, setProp, run, stop, save…    │
│            │  build netlist                       ▲ results         │
│            ▼                                       │                │
│  lib/simulator/engine/   (SIMULATION — pure, framework-agnostic)   │
│   netlist  →  solver (MNA + Newton–Raphson)  →  linalg (LU solve)  │
│   catalog.ts: component electrical models ("stamps")               │
└──────────────────────────────────────────────────────────────────┘
```

Three strictly separated layers. The **engine** imports nothing from React. The **store**
owns the document and orchestrates solve. The **view** only reads state and dispatches
actions. This separation is what makes the engine testable and the renderer swappable.

---

## 4. Data Architecture

### 4.1 In-memory document model (`types.ts`)
```ts
Part   { id, type, x, y, rotation, props:{...}, terminals:[{id, dx, dy}] }
Wire   { id, a:TerminalRef, b:TerminalRef, color }
TerminalRef { partId, terminalId }
Schematic { parts: Part[], wires: Wire[] }
```
A **terminal** is a named pin with a local offset; its world position is derived from the
part transform. Electrical identity is *not* stored on terminals — it is **derived** each
solve by union-find over wires (and closed switches). This keeps the document declarative
and the netlist always consistent.

### 4.2 Serialization format (JSON, versioned)
```jsonc
{
  "version": 1,
  "meta": { "name": "RC blink", "createdAt": "...", "app": "apex-circuit-lab" },
  "schematic": { "parts": [...], "wires": [...] },
  "view": { "panX": 0, "panY": 0, "zoom": 1 }
}
```
Versioned so migrations are mechanical. Stored in `localStorage` under
`apex.circuitlab.*`; export/import as `.json`.

### 4.3 Future cloud schema (PostgreSQL — roadmap, not built)
```sql
users(id, email, created_at)
projects(id, owner_id→users, name, is_public, created_at, updated_at)
circuit_versions(id, project_id→projects, version, doc_jsonb, author_id, created_at)
shares(id, project_id, token, role)          -- view/edit links
-- doc_jsonb stores the exact v1 JSON above; versions are append-only (history).
```
Append-only `circuit_versions` gives free version history and a base for CRDT/collab.

---

## 5. State Architecture

- **Single store object** holding `schematic`, `ui` (selection, tool, view), `results`,
  `console`. Immutable-ish updates: actions produce a new top-level reference for the
  slices that changed, then notify subscribers.
- **Granular subscriptions** via `useSyncExternalStore(subscribe, () => selector(state))`
  + equality check, so a part re-renders only when *its* data or sim result changes.
- **Undo/Redo** (roadmap, designed-in): the store keeps `past[]`/`future[]` snapshots of
  `schematic`. Because the document is plain serializable data, snapshots are `structuredClone`.
- **Sim loop**: `run()` solves once on every document/prop change (DC operating point is
  instantaneous). For animated parts (future capacitor charge, motor spin) a `requestAnimationFrame`
  loop advances time and re-solves; results are pushed to the store, not through React props.

---

## 6. Simulation Architecture (the core)

### 6.1 Netlist construction
1. Collect all terminals from all parts.
2. **Union-find** merge terminals joined by a wire, and by any **closed** switch/button.
3. Each resulting set = one electrical **node**. Choose the **reference (ground)**:
   ground part if present, else a power-supply negative terminal, else node 0.
4. Index non-reference nodes `1..N`.

### 6.2 Modified Nodal Analysis
Solve `A·x = z` where `x = [v₁..v_N, i₁..i_M]` (node voltages + voltage-source currents):
- `A = [[G, B],[Bᵀ, 0]]` — `G` is the N×N conductance matrix; `B` the N×M source incidence.
- **Resistor** (g = 1/R) stamps into `G`. **Voltage source** stamps `B/Bᵀ` and `z`.
- **`gmin`** (1e-9 S) added node→ground prevents singular matrices for floating nodes.

### 6.3 Nonlinear devices (LED/diode) — Newton–Raphson
Diode law `I = Is·(e^(V/(nVt)) − 1)`. Each iteration linearizes to a **companion model**:
conductance `g = dI/dV` in parallel with current source `Ieq = I − g·V`, stamped like a
resistor + current source. Iterate with **voltage limiting** (damping) until `ΔV < 1e-6`
or 100 iters. This yields a physically correct knee (~1.8 V red … ~3.0 V blue) and current.

### 6.4 Results & derived quantities
Per node: voltage. Per part: terminal voltages → device current, power `P=V·I`, and
**LED brightness** = clamp(I / I_rated). Warnings: floating net, **short circuit** &
**overcurrent** (source current > its current limit → flag; CC-mode re-solve roadmapped).

### 6.5 Supported topologies
Series, parallel, mixed, open, short — all emerge from MNA automatically; nothing is
special-cased. This is the dividend of a real solver.

### 6.6 Complexity & limits
Dense LU is O(n³). Educational circuits (n < ~100) solve in well under 1 ms. Scale plan:
sparse matrix + LU reuse, and only re-solving on topology/value change.

---

## 7. Rendering Architecture

- **SVG scene** inside a pan/zoom `<svg>` with a single root `<g transform="translate(pan) scale(zoom)">`.
- **World vs screen** coords: pointer events are converted via the inverse transform; grid
  snapping in world space.
- **Renderer boundary:** parts draw through a `Part` view that only takes `(part, result)`.
  Swapping SVG→Canvas means replacing `Workspace`/`Part` rendering, not the store/engine.
- **Performance levers (designed-in):** layered repaint (wires vs parts), `will-change`
  transforms, virtualization by viewport cull (roadmap), and rAF-batched result pushes.

---

## 8. Component Architecture (extensibility)

A component type is a **catalog entry** — pure data + a small electrical model:
```ts
{
  type, label, category, defaultProps,
  terminals: (props) => Terminal[],          // pin geometry
  stamp: (ctx, part, nodeOf) => void,         // contribute to MNA matrices
  measure?: (part, voltageOf) => Readout,     // current/power for UI
  view: ReactComponent                        // SVG art (presentation only)
}
```
Adding a **relay** or **motor** = new catalog entry. The editor, wiring, properties panel,
and solver need **no changes** — they read the catalog. This is the central extensibility
guarantee.

---

## 9. UI / UX Design

Four-zone professional layout (matches the spec):
- **Top toolbar:** Run/Stop, Reset, Save/Load/Export, Undo/Redo*, Zoom, Grid toggle.
- **Left library:** categorized, drag-to-canvas parts.
- **Center workspace:** infinite canvas, pan (space/drag), zoom (wheel/pinch), grid snap,
  selection, click-to-wire with live preview, per-part live readouts.
- **Right properties panel:** dynamic editors for the selected part (LED color, R value+unit,
  supply V & current-limit, switch state).
- **Bottom console:** nodes solved, currents, warnings (short/overcurrent/floating).

Accessibility: keyboardable toolbar, focusable terminals, ARIA labels, reduced-motion
respected, high-contrast theme tokens. Mobile: touch pan/zoom, large hit targets,
collapsible side panels. (*Undo/Redo wired in store; UI button roadmapped.)

---

## 10. API Design (future backend — not built in MVP)
```
POST   /api/projects                 → create
GET    /api/projects/:id             → load latest version (doc_jsonb)
POST   /api/projects/:id/versions    → save new version (history)
GET    /api/projects/:id/versions    → list history
POST   /api/projects/:id/share       → create share token (view/edit)
```
All payloads are the v1 JSON document. Stateless, cache-friendly, collab-ready.

---

## 11. Folder Structure
```
lib/simulator/
  types.ts                 # domain model + result types
  engine/
    linalg.ts              # dense matrix solve (LU, partial pivot)
    solver.ts              # netlist build + MNA + Newton–Raphson
  catalog.ts               # component definitions (data + stamps + measure)
  store.ts                 # external store, actions, serialization
components/simulator/
  CircuitLab.tsx           # layout + interaction orchestration
  Workspace.tsx            # SVG canvas: pan/zoom/grid, parts, wires, wiring
  Parts.tsx                # SVG art per component (presentation)
  Panels.tsx               # Toolbar, Library, Properties, Console
app/lab/page.tsx           # mounts CircuitLab full-screen
docs/CIRCUIT-LAB-DESIGN.md # this document
```

---

## 12. Future Roadmap (architecture reserves these hooks)

**Components** (each = one catalog entry): Potentiometer (3-term), Ammeter (0 V source),
Multimeter, Relay, MOSFET, DC/Servo motor, sensors (ultrasonic/temp), LCD/OLED, full
breadboard electrical model (rows/rails as pre-wired node groups).

**Engine:** transient analysis (companion models for C/L + time step), sparse solver,
constant-current supply mode, fault detection.

**Platform:** cloud save + history + real-time collab (CRDT over the JSON doc),
**microcontroller code simulation** (Arduino/ESP32 — a part whose `stamp` is driven by an
interpreted program loop; GPIO pins are terminals), **3D robotics / digital twin** (R3F
module reading the same document), **AI circuit assistant** (auto-wiring suggestions, fault
explanation) operating on the netlist graph.

**Why this scales:** the document is declarative JSON; electrical behavior lives in small
per-component models; the engine is pure and testable; the renderer is behind a boundary.
New capability is additive, not invasive.
