// APEX Circuit Lab — domain model & result types.
// Pure data. No React, no rendering. See docs/CIRCUIT-LAB-DESIGN.md §4.

/** A named electrical pin on a part, positioned in the part's local space. */
export interface Terminal {
  id: string;
  /** Local offset from the part origin, in world units (before rotation). */
  dx: number;
  dy: number;
}

export type PartType =
  | "supply"
  | "ground"
  | "resistor"
  | "potentiometer"
  | "led"
  | "button"
  | "switch"
  | "voltmeter";

/** Editable, serializable per-part parameters. Loosely typed by design (catalog validates). */
export interface PartProps {
  // supply
  voltage?: number; // V
  currentLimit?: number; // A
  on?: boolean;
  // resistor
  resistance?: number; // ohms (base unit)
  // potentiometer
  position?: number; // 0..1 wiper position
  maxResistance?: number; // ohms
  // led
  color?: "red" | "green" | "blue" | "yellow" | "white";
  damaged?: boolean; // burnt out by overcurrent
  // switch / button
  closed?: boolean;
  [key: string]: number | string | boolean | undefined;
}

/** A placed component instance. */
export interface Part {
  id: string;
  type: PartType;
  x: number;
  y: number;
  /** Degrees, clockwise. Only 0/90/180/270 used by the editor. */
  rotation: number;
  props: PartProps;
}

export interface TerminalRef {
  partId: string;
  terminalId: string;
}

export interface Wire {
  id: string;
  a: TerminalRef;
  b: TerminalRef;
  color: string;
}

export interface Schematic {
  parts: Part[];
  wires: Wire[];
}

// ── Simulation results ────────────────────────────────────────────────

/** Per-part computed electrical readout for the UI. */
export interface PartResult {
  /** Voltage at each terminal id (relative to ground). */
  terminalV: Record<string, number>;
  /** Current through the device (A), sign per the catalog's convention. */
  current: number;
  /** Power dissipated/delivered (W). */
  power: number;
  /** 0..1 — LED only. */
  brightness?: number;
  /** Meter reading (e.g. voltmeter volts) — meters only. */
  reading?: number;
  /** True if the device is actively conducting / on. */
  active?: boolean;
}

export type WarningLevel = "info" | "warn" | "error";

export interface SimWarning {
  level: WarningLevel;
  message: string;
  partId?: string;
}

export interface SimResult {
  ok: boolean;
  /** node index (after ground=0) → voltage. */
  nodeVoltages: number[];
  /** partId → result. */
  parts: Record<string, PartResult>;
  warnings: SimWarning[];
  /** Number of electrical nodes (excluding ground). */
  nodeCount: number;
  /** Newton iterations used (0 for purely linear). */
  iterations: number;
}

export const EMPTY_RESULT: SimResult = {
  ok: false,
  nodeVoltages: [],
  parts: {},
  warnings: [],
  nodeCount: 0,
  iterations: 0,
};
