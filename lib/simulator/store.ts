// External store for the Circuit Lab (design doc §5).
// Zero dependencies: a tiny observable + React's useSyncExternalStore.
//
// Simulation runs as a state machine (EDIT → RUNNING → PAUSED → …). Structural
// edits are locked during RUNNING and auto-pause the simulation; value changes
// (voltage, pot, switches) are allowed live and re-solve immediately.

import { useSyncExternalStore } from "react";
import type { Part, PartType, Schematic, TerminalRef, Wire, SimResult, PartProps } from "./types";
import { EMPTY_RESULT } from "./types";
import { CATALOG, LED_DAMAGE_CURRENT } from "./catalog";
import { simulate } from "./engine/solver";

export const GRID = 20;
export const SCHEMA_VERSION = 1;
const STORAGE_KEY = "apex.circuitlab.autosave";

export type Tool = "select" | "wire";

/** Simulation state machine. */
export type SimMode = "edit" | "running" | "paused" | "error";

export interface LogEntry {
  level: string;
  message: string;
}

export interface LabState {
  schematic: Schematic;
  selectedId: string | null;
  tool: Tool;
  pendingWire: TerminalRef | null;
  view: { panX: number; panY: number; zoom: number };
  mode: SimMode;
  result: SimResult;
  grid: boolean;
  wireColor: string;
  log: LogEntry[];
}

const snap = (v: number) => Math.round(v / GRID) * GRID;
const li = (level: string, message: string): LogEntry => ({ level, message });

let counter = 0;
const nid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

// ── Starter circuit: a lit LED (demonstrates the solver on load) ──
function starterSchematic(): Schematic {
  const supply: Part = { id: "supply1", type: "supply", x: 180, y: 240, rotation: 0, props: { voltage: 5, currentLimit: 1, on: true } };
  const r1: Part = { id: "r1", type: "resistor", x: 360, y: 160, rotation: 0, props: { resistance: 220 } };
  const led1: Part = { id: "led1", type: "led", x: 540, y: 160, rotation: 0, props: { color: "red" } };
  const gnd1: Part = { id: "gnd1", type: "ground", x: 540, y: 320, rotation: 0, props: {} };
  return {
    parts: [supply, r1, led1, gnd1],
    wires: [
      { id: "w1", a: { partId: "supply1", terminalId: "pos" }, b: { partId: "r1", terminalId: "1" }, color: "#ef4444" },
      { id: "w2", a: { partId: "r1", terminalId: "2" }, b: { partId: "led1", terminalId: "a" }, color: "#10b981" },
      { id: "w3", a: { partId: "led1", terminalId: "c" }, b: { partId: "gnd1", terminalId: "g" }, color: "#10b981" },
      { id: "w4", a: { partId: "supply1", terminalId: "neg" }, b: { partId: "gnd1", terminalId: "g" }, color: "#3b82f6" },
    ],
  };
}

const initialState: LabState = {
  schematic: starterSchematic(),
  selectedId: null,
  tool: "select",
  pendingWire: null,
  view: { panX: 0, panY: 0, zoom: 1 },
  mode: "edit",
  result: EMPTY_RESULT,
  grid: true,
  wireColor: "#10b981",
  log: [],
};

// ── Observable ────────────────────────────────────────────────────────

let state: LabState = initialState;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function getState(): LabState {
  return state;
}
function set(partial: Partial<LabState>) {
  state = { ...state, ...partial };
  emit();
}
function pushLog(entries: LogEntry[]) {
  state = { ...state, log: [...entries, ...state.log].slice(0, 60) };
  emit();
}

// ── Simulation helpers ────────────────────────────────────────────────

/** Solve, then permanently burn out any LED past its damage current, and re-solve. */
function simulateRun(sc: Schematic): { schematic: Schematic; result: SimResult; damagedIds: string[] } {
  let result = simulate(sc);
  const damagedIds: string[] = [];
  const parts = sc.parts.map((p) => {
    if (p.type === "led" && !p.props.damaged) {
      const r = result.parts[p.id];
      if (r && r.current > LED_DAMAGE_CURRENT) {
        damagedIds.push(p.id);
        return { ...p, props: { ...p.props, damaged: true } };
      }
    }
    return p;
  });
  if (damagedIds.length) {
    sc = { ...sc, parts };
    result = simulate(sc);
  }
  return { schematic: sc, result, damagedIds };
}

/** Blocking pre-run checks (lenient: open/short circuits are allowed teaching states). */
function validateForRun(sc: Schematic): string[] {
  const errs: string[] = [];
  if (sc.parts.length === 0) errs.push("Workspace is empty — add components before running.");
  else if (!sc.parts.some((p) => p.type === "supply")) errs.push("No power source — add a Power Supply to run the circuit.");
  return errs;
}

/** Re-solve live when running; otherwise just update the document. */
function commit(schematic: Schematic, log?: LogEntry[]) {
  if (state.mode === "running") {
    const r = simulateRun(schematic);
    state = { ...state, schematic: r.schematic, result: r.result };
    const dmg = r.damagedIds.map(() => li("error", "LED damaged due to excessive current. Add a resistor to limit current."));
    const warn = r.result.warnings.map((w) => li(w.level, w.message));
    state = { ...state, log: [...(log ?? []), ...dmg, ...warn].slice(0, 60) };
  } else {
    state = { ...state, schematic };
    if (state.mode === "error") state = { ...state, mode: "edit" }; // editing clears the error
    if (log?.length) state = { ...state, log: [...log, ...state.log].slice(0, 60) };
  }
  emit();
}

/**
 * Guard for structural edits. While RUNNING, any structural change auto-pauses
 * the simulation (and is itself blocked) — the user then edits safely in PAUSED.
 * Returns true if the caller must abort.
 */
function blockedByRun(): boolean {
  if (state.mode === "running") {
    set({ mode: "paused" });
    pushLog([li("warn", "Circuit modification detected. Simulation paused — press Run to re-simulate.")]);
    return true;
  }
  return false;
}

// ── React binding ─────────────────────────────────────────────────────

export function useLab<T>(selector: (s: LabState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

export const selectPartById = (id: string) => (s: LabState) => s.schematic.parts.find((p) => p.id === id);
export const selectResultFor = (id: string) => (s: LabState) => s.result.parts[id];

// ── Actions ───────────────────────────────────────────────────────────

export const actions = {
  addPart(type: PartType, x: number, y: number): string | null {
    if (blockedByRun()) return null;
    const id = nid(type);
    const part: Part = { id, type, x: snap(x), y: snap(y), rotation: 0, props: { ...CATALOG[type].defaultProps } };
    set({ selectedId: id });
    commit({ ...state.schematic, parts: [...state.schematic.parts, part] }, [li("info", `Added ${CATALOG[type].label}.`)]);
    return id;
  },

  movePart(id: string, x: number, y: number) {
    if (blockedByRun()) return;
    const parts = state.schematic.parts.map((p) => (p.id === id ? { ...p, x: snap(x), y: snap(y) } : p));
    commit({ ...state.schematic, parts });
  },

  rotatePart(id: string) {
    if (blockedByRun()) return;
    const parts = state.schematic.parts.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
    commit({ ...state.schematic, parts });
  },

  deletePart(id: string) {
    if (blockedByRun()) return;
    const parts = state.schematic.parts.filter((p) => p.id !== id);
    const wires = state.schematic.wires.filter((w) => w.a.partId !== id && w.b.partId !== id);
    set({ selectedId: state.selectedId === id ? null : state.selectedId });
    commit({ parts, wires }, [li("info", "Deleted component.")]);
  },

  /** Value changes are allowed live in RUNNING (re-solve); they never auto-pause. */
  setProp(id: string, propKey: keyof PartProps, value: number | string | boolean) {
    const parts = state.schematic.parts.map((p) => (p.id === id ? { ...p, props: { ...p.props, [propKey]: value } } : p));
    commit({ ...state.schematic, parts });
  },

  selectPart(id: string | null) {
    set({ selectedId: id, pendingWire: null });
  },

  setTool(tool: Tool) {
    set({ tool, pendingWire: null });
  },

  terminalClick(ref: TerminalRef) {
    if (blockedByRun()) return;
    const pending = state.pendingWire;
    if (!pending) {
      set({ pendingWire: ref, tool: "wire" });
      return;
    }
    if (pending.partId === ref.partId && pending.terminalId === ref.terminalId) {
      set({ pendingWire: null });
      return;
    }
    const wire: Wire = { id: nid("w"), a: pending, b: ref, color: state.wireColor };
    set({ pendingWire: null });
    commit({ ...state.schematic, wires: [...state.schematic.wires, wire] }, [li("info", "Wire connected.")]);
  },

  cancelWire() {
    set({ pendingWire: null });
  },

  deleteWire(id: string) {
    if (blockedByRun()) return;
    commit({ ...state.schematic, wires: state.schematic.wires.filter((w) => w.id !== id) }, [li("info", "Wire removed.")]);
  },

  setWireColor(color: string) {
    set({ wireColor: color });
  },

  setView(view: Partial<LabState["view"]>) {
    set({ view: { ...state.view, ...view } });
  },

  toggleGrid() {
    set({ grid: !state.grid });
  },

  // ── Simulation control (state machine) ──
  run() {
    const errors = validateForRun(state.schematic);
    if (errors.length) {
      set({ mode: "error", result: EMPTY_RESULT });
      pushLog([...errors.map((e) => li("error", e)), li("info", "Fix the issue above, then press Run.")]);
      return;
    }
    const { schematic, result, damagedIds } = simulateRun(state.schematic);
    set({ mode: "running", schematic, result });
    const dmg = damagedIds.map(() => li("error", "LED damaged due to excessive current. Add a resistor to limit current."));
    pushLog([li("info", `Simulation running — ${result.nodeCount} nodes solved in ${result.iterations} iteration(s).`), ...dmg, ...result.warnings.map((w) => li(w.level, w.message))]);
  },

  stop() {
    set({ mode: "edit", result: EMPTY_RESULT, pendingWire: null });
    pushLog([li("info", "Simulation stopped — back to Edit mode.")]);
  },

  /** Reset Circuit: un-burn LEDs and return to a clean Edit state (keeps layout). */
  reset() {
    const parts = state.schematic.parts.map((p) => (p.props.damaged ? { ...p, props: { ...p.props, damaged: false } } : p));
    set({ schematic: { ...state.schematic, parts }, mode: "edit", result: EMPTY_RESULT, selectedId: null, pendingWire: null });
    pushLog([li("info", "Circuit reset — components restored.")]);
  },

  /** New Project: empty the workspace. */
  clearAll() {
    set({ schematic: { parts: [], wires: [] }, mode: "edit", selectedId: null, pendingWire: null, result: EMPTY_RESULT, log: [li("info", "New project — workspace cleared.")] });
  },

  loadStarter() {
    set({ schematic: starterSchematic(), mode: "edit", selectedId: null, pendingWire: null, result: EMPTY_RESULT, log: [li("info", "Loaded starter circuit.")] });
  },

  // ── Persistence ──
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, serialize(state));
      pushLog([li("info", "Saved to browser storage.")]);
    } catch {
      pushLog([li("error", "Save failed (storage unavailable).")]);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        pushLog([li("warn", "No saved circuit found.")]);
        return;
      }
      const doc = deserialize(raw);
      if (!doc) throw new Error("bad");
      set({ schematic: doc.schematic, view: doc.view, mode: "edit", selectedId: null, pendingWire: null, result: EMPTY_RESULT, log: [li("info", "Loaded saved circuit.")] });
    } catch {
      pushLog([li("error", "Load failed (corrupt data).")]);
    }
  },

  exportJSON(): string {
    return serialize(state);
  },

  importJSON(raw: string): boolean {
    if (blockedByRun()) return false;
    const doc = deserialize(raw);
    if (!doc) {
      pushLog([li("error", "Import failed — invalid file.")]);
      return false;
    }
    set({ schematic: doc.schematic, view: doc.view, mode: "edit", selectedId: null, pendingWire: null, result: EMPTY_RESULT, log: [li("info", "Imported circuit.")] });
    return true;
  },
};

// ── Serialization (design doc §4.2) ───────────────────────────────────

interface CircuitDoc {
  version: number;
  meta: { name: string; createdAt: string; app: string };
  schematic: Schematic;
  view: LabState["view"];
}

function serialize(s: LabState): string {
  const doc: CircuitDoc = {
    version: SCHEMA_VERSION,
    meta: { name: "Untitled circuit", createdAt: new Date().toISOString(), app: "apex-circuit-lab" },
    schematic: s.schematic,
    view: s.view,
  };
  return JSON.stringify(doc, null, 2);
}

function deserialize(raw: string): { schematic: Schematic; view: LabState["view"] } | null {
  try {
    const doc = JSON.parse(raw) as Partial<CircuitDoc>;
    if (!doc || typeof doc !== "object" || !doc.schematic) return null;
    const sc = doc.schematic;
    if (!Array.isArray(sc.parts) || !Array.isArray(sc.wires)) return null;
    const parts = sc.parts.filter((p) => p && typeof p.id === "string" && p.type in CATALOG);
    const wires = sc.wires.filter((w) => w && w.a && w.b);
    const view = doc.view && typeof doc.view.zoom === "number" ? doc.view : { panX: 0, panY: 0, zoom: 1 };
    return { schematic: { parts, wires }, view };
  } catch {
    return null;
  }
}
