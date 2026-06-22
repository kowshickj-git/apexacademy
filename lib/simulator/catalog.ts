// Component catalog — the extensibility core (design doc §8).
// Each entry is DATA + a small electrical model ("stamp") + a measurement.
// Adding a new component = adding an entry here. The editor, wiring, solver,
// and panels all read from this catalog; none of them hard-code component types.

import type { Part, PartProps, PartType, Terminal, PartResult } from "./types";

// ── Stamp / measure contexts (provided by the solver) ─────────────────

export interface StampContext {
  /** Node index for a terminal; -1 means the reference (ground) node. */
  nodeOf(partId: string, terminalId: string): number;
  /** Previous-iteration voltage at a node (0 for reference / first pass). */
  voltageOf(node: number): number;
  /** Stamp a conductance g (siemens) between two nodes. */
  addConductance(a: number, b: number, g: number): void;
  /** Inject a current (A) into a node (RHS). */
  addCurrent(node: number, amps: number): void;
  /** Stamp an independent voltage source (volts) from p(+) to n(-), owned by a part. */
  addVoltageSource(p: number, n: number, volts: number, ownerId: string): void;
  /** Per-device stored junction voltage (Newton voltage-limiting). */
  prevVd(partId: string): number;
  setVd(partId: string, vd: number): void;
  /** Numerical floor conductance for stability. */
  gmin: number;
}

export interface MeasureContext {
  /** Solved voltage at a terminal (relative to ground). */
  termV(partId: string, terminalId: string): number;
  /** Solved current delivered by a voltage source part (A). */
  sourceCurrent(partId: string): number;
}

export interface ComponentModel {
  type: PartType;
  label: string;
  category: "Power" | "Output" | "Passive" | "Switch" | "Meter";
  /** Short hint shown in the library. */
  hint: string;
  defaultProps: PartProps;
  terminals: Terminal[];
  /** Marks a terminal-bearing reference part (ground). */
  isReference?: boolean;
  /** Nonlinear devices trigger the Newton–Raphson loop. */
  nonlinear?: boolean;
  /** If the part is an ideal closed connection (switch/button), the two bridged terminals. */
  bridge?: (part: Part) => [string, string] | null;
  stamp?: (ctx: StampContext, part: Part) => void;
  measure?: (ctx: MeasureContext, part: Part) => PartResult;
}

// ── Physical constants & helpers ──────────────────────────────────────

const VT = 0.025852; // thermal voltage at ~300 K
const LED_N = 2; // LED emission coefficient
const LED_IF = 0.018; // reference forward current used to fit Is to Vf
export const LED_IRATED = 0.02; // 20 mA → full brightness

export const LED_VF: Record<string, number> = { red: 1.8, yellow: 2.1, green: 2.4, blue: 3.0, white: 3.1 };
export const LED_GLOW: Record<string, string> = {
  red: "#ff3b30",
  yellow: "#ffd60a",
  green: "#30d158",
  blue: "#0a84ff",
  white: "#f8fafc",
};
/** LED current (A) above which the LED burns out permanently. Rated ~20 mA. */
export const LED_DAMAGE_CURRENT = 0.05;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

function ledIs(color: string): number {
  const vf = LED_VF[color] ?? LED_VF.red;
  return LED_IF / (Math.exp(vf / (LED_N * VT)) - 1);
}

/** SPICE-style pn-junction voltage limiting to keep Newton–Raphson stable. */
function limitVjunction(vnew: number, vold: number, vt: number, vcrit: number): number {
  if (vnew > vcrit && Math.abs(vnew - vold) > 2 * vt) {
    if (vold > 0) {
      const arg = 1 + (vnew - vold) / vt;
      vnew = arg > 0 ? vold + vt * Math.log(arg) : vcrit;
    } else {
      vnew = vt * Math.log(Math.max(vnew / vt, 1e-12));
    }
  }
  return vnew;
}

// ── Geometry (shared by solver + view) ────────────────────────────────

export function rotateLocal(dx: number, dy: number, rotDeg: number): { x: number; y: number } {
  const r = (rotDeg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: dx * c - dy * s, y: dx * s + dy * c };
}

export function terminalWorld(part: Part, terminal: Terminal): { x: number; y: number } {
  const p = rotateLocal(terminal.dx, terminal.dy, part.rotation);
  return { x: part.x + p.x, y: part.y + p.y };
}

export function getModel(type: PartType): ComponentModel {
  return CATALOG[type];
}

// ── Catalog ───────────────────────────────────────────────────────────

export const CATALOG: Record<PartType, ComponentModel> = {
  supply: {
    type: "supply",
    label: "Power Supply",
    category: "Power",
    hint: "0–24 V variable bench supply",
    defaultProps: { voltage: 5, currentLimit: 1, on: true },
    terminals: [
      { id: "pos", dx: 40, dy: -20 },
      { id: "neg", dx: 40, dy: 20 },
    ],
    stamp(ctx, part) {
      if (part.props.on === false) return;
      const v = clamp(Number(part.props.voltage ?? 5), 0, 12);
      ctx.addVoltageSource(ctx.nodeOf(part.id, "pos"), ctx.nodeOf(part.id, "neg"), v, part.id);
    },
    measure(ctx, part) {
      const vp = ctx.termV(part.id, "pos");
      const vn = ctx.termV(part.id, "neg");
      const i = ctx.sourceCurrent(part.id);
      return {
        terminalV: { pos: vp, neg: vn },
        current: Math.abs(i),
        power: Math.abs((vp - vn) * i),
        active: part.props.on !== false,
      };
    },
  },

  ground: {
    type: "ground",
    label: "Ground",
    category: "Power",
    hint: "0 V circuit reference",
    isReference: true,
    defaultProps: {},
    terminals: [{ id: "g", dx: 0, dy: -40 }],
    measure(ctx, part) {
      return { terminalV: { g: ctx.termV(part.id, "g") }, current: 0, power: 0, active: true };
    },
  },

  resistor: {
    type: "resistor",
    label: "Resistor",
    category: "Passive",
    hint: "Ohm's law • editable Ω/kΩ/MΩ",
    defaultProps: { resistance: 1000 },
    terminals: [
      { id: "1", dx: -40, dy: 0 },
      { id: "2", dx: 40, dy: 0 },
    ],
    stamp(ctx, part) {
      const R = Math.max(1e-6, Number(part.props.resistance ?? 1000));
      ctx.addConductance(ctx.nodeOf(part.id, "1"), ctx.nodeOf(part.id, "2"), 1 / R);
    },
    measure(ctx, part) {
      const v1 = ctx.termV(part.id, "1");
      const v2 = ctx.termV(part.id, "2");
      const R = Math.max(1e-6, Number(part.props.resistance ?? 1000));
      const i = (v1 - v2) / R;
      return {
        terminalV: { "1": v1, "2": v2 },
        current: Math.abs(i),
        power: i * i * R,
        active: Math.abs(i) > 1e-9,
      };
    },
  },

  potentiometer: {
    type: "potentiometer",
    label: "Potentiometer",
    category: "Passive",
    hint: "Slider-controlled variable resistor",
    defaultProps: { position: 0.5, maxResistance: 10000 },
    terminals: [
      { id: "1", dx: -40, dy: 0 },
      { id: "2", dx: 40, dy: 0 },
    ],
    stamp(ctx, part) {
      const max = Math.max(1, Number(part.props.maxResistance ?? 10000));
      const pos = clamp(Number(part.props.position ?? 0.5), 0, 1);
      const R = Math.max(1, pos * max);
      ctx.addConductance(ctx.nodeOf(part.id, "1"), ctx.nodeOf(part.id, "2"), 1 / R);
    },
    measure(ctx, part) {
      const v1 = ctx.termV(part.id, "1");
      const v2 = ctx.termV(part.id, "2");
      const max = Math.max(1, Number(part.props.maxResistance ?? 10000));
      const pos = clamp(Number(part.props.position ?? 0.5), 0, 1);
      const R = Math.max(1, pos * max);
      const i = (v1 - v2) / R;
      return { terminalV: { "1": v1, "2": v2 }, current: Math.abs(i), power: i * i * R, active: Math.abs(i) > 1e-9 };
    },
  },

  led: {
    type: "led",
    label: "LED",
    category: "Output",
    hint: "Diode • lights with real current",
    nonlinear: true,
    defaultProps: { color: "red" },
    terminals: [
      { id: "a", dx: -40, dy: 0 },
      { id: "c", dx: 40, dy: 0 },
    ],
    stamp(ctx, part) {
      if (part.props.damaged) return; // burnt out → open circuit
      const color = String(part.props.color ?? "red");
      const Is = ledIs(color);
      const nVt = LED_N * VT;
      const aN = ctx.nodeOf(part.id, "a");
      const cN = ctx.nodeOf(part.id, "c");
      const vcrit = nVt * Math.log(nVt / (Math.SQRT2 * Is));
      let vd = ctx.voltageOf(aN) - ctx.voltageOf(cN);
      vd = limitVjunction(vd, ctx.prevVd(part.id), nVt, vcrit);
      ctx.setVd(part.id, vd);
      const evd = Math.exp(vd / nVt);
      const Id = Is * (evd - 1);
      const gd = (Is / nVt) * evd + ctx.gmin;
      const Ieq = Id - gd * vd;
      ctx.addConductance(aN, cN, gd);
      ctx.addCurrent(aN, -Ieq);
      ctx.addCurrent(cN, Ieq);
    },
    measure(ctx, part) {
      const va = ctx.termV(part.id, "a");
      const vc = ctx.termV(part.id, "c");
      if (part.props.damaged) {
        return { terminalV: { a: va, c: vc }, current: 0, power: 0, brightness: 0, active: false };
      }
      const color = String(part.props.color ?? "red");
      const Is = ledIs(color);
      const nVt = LED_N * VT;
      const vd = va - vc;
      const Id = Math.max(0, Is * (Math.exp(Math.min(vd, 6) / nVt) - 1));
      return {
        terminalV: { a: va, c: vc },
        current: Id,
        power: vd * Id,
        brightness: clamp(Id / LED_IRATED, 0, 1),
        active: Id > 1e-4,
      };
    },
  },

  button: {
    type: "button",
    label: "Push Button",
    category: "Switch",
    hint: "Momentary — hold to close",
    defaultProps: { closed: false },
    terminals: [
      { id: "1", dx: -40, dy: 0 },
      { id: "2", dx: 40, dy: 0 },
    ],
    bridge: (part) => (part.props.closed ? ["1", "2"] : null),
    measure(ctx, part) {
      return {
        terminalV: { "1": ctx.termV(part.id, "1"), "2": ctx.termV(part.id, "2") },
        current: 0,
        power: 0,
        active: !!part.props.closed,
      };
    },
  },

  switch: {
    type: "switch",
    label: "Toggle Switch",
    category: "Switch",
    hint: "Latching open/closed",
    defaultProps: { closed: false },
    terminals: [
      { id: "1", dx: -40, dy: 0 },
      { id: "2", dx: 40, dy: 0 },
    ],
    bridge: (part) => (part.props.closed ? ["1", "2"] : null),
    measure(ctx, part) {
      return {
        terminalV: { "1": ctx.termV(part.id, "1"), "2": ctx.termV(part.id, "2") },
        current: 0,
        power: 0,
        active: !!part.props.closed,
      };
    },
  },

  voltmeter: {
    type: "voltmeter",
    label: "Voltmeter",
    category: "Meter",
    hint: "High-impedance V probe",
    defaultProps: {},
    terminals: [
      { id: "p", dx: -40, dy: 0 },
      { id: "n", dx: 40, dy: 0 },
    ],
    stamp(ctx, part) {
      // 10 MΩ internal resistance: measures without loading the circuit.
      ctx.addConductance(ctx.nodeOf(part.id, "p"), ctx.nodeOf(part.id, "n"), 1e-7);
    },
    measure(ctx, part) {
      const vp = ctx.termV(part.id, "p");
      const vn = ctx.termV(part.id, "n");
      return { terminalV: { p: vp, n: vn }, current: 0, power: 0, reading: vp - vn, active: true };
    },
  },
};

/** Ordered list for the component library UI. */
export const CATALOG_LIST: ComponentModel[] = [
  CATALOG.supply,
  CATALOG.ground,
  CATALOG.resistor,
  CATALOG.potentiometer,
  CATALOG.led,
  CATALOG.button,
  CATALOG.switch,
  CATALOG.voltmeter,
];
