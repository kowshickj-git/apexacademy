// Netlist: turn hand-drawn breadboard wires into electrical connections.
// Union-find over wire endpoints → for each device pin, which Arduino pin it
// reaches. Powers Stage 3: wiring (not the dropdowns) drives the simulation.

import { SENSOR_MAP, type SensorInstance } from "./sensors";

export interface ManualWire {
  id: string;
  a: string; // anchor id: "arduino:D9" | "dev:<instanceId>:<pinKey>"
  b: string;
  color: string;
}

export interface DeviceNet {
  /** slotKey → Arduino pin label, as actually wired. */
  pins: Record<string, string>;
  /** VCC wired to 5V/3V3 AND GND wired to GND. */
  powered: boolean;
  /** I²C device: SDA→A4, SCL→A5, and powered. */
  i2cOk: boolean;
  /** Human-readable wiring problems for UI feedback. */
  issues: string[];
}

const ARD = "arduino:";

export function buildNetlist(sensors: SensorInstance[], wires: ManualWire[]): Record<string, DeviceNet> {
  // ── union-find over anchor ids that appear in wires ──
  const parent: Record<string, string> = {};
  const find = (x: string): string => {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  const wired = new Set<string>();
  for (const w of wires) {
    wired.add(w.a);
    wired.add(w.b);
    union(w.a, w.b);
  }

  // root → set of Arduino pins in that electrical node
  const rootArduino: Record<string, Set<string>> = {};
  for (const id of wired) {
    if (id.startsWith(ARD)) {
      const r = find(id);
      (rootArduino[r] ??= new Set()).add(id.slice(ARD.length));
    }
  }

  const result: Record<string, DeviceNet> = {};

  for (const inst of sensors) {
    const def = SENSOR_MAP[inst.defId];
    const issues: string[] = [];

    // Which Arduino pin does this device pin reach? (null = not wired)
    const arduinoFor = (key: string): string | null => {
      const id = `dev:${inst.instanceId}:${key}`;
      if (!wired.has(id)) return null;
      const ards = rootArduino[find(id)];
      if (!ards || ards.size === 0) return null;
      return [...ards][0];
    };

    const pins: Record<string, string> = {};
    const slotKeys = def.kind === "i2c" ? [] : def.slots.map((s) => s.key);
    for (const key of slotKeys) {
      const a = arduinoFor(key);
      if (a) pins[key] = a;
      else issues.push(`${key} not connected`);
    }

    // Power
    const vcc = arduinoFor("VCC");
    const gnd = arduinoFor("GND");
    if (!vcc) issues.push("VCC not connected");
    else if (vcc !== "5V" && vcc !== "3V3") issues.push(`VCC on ${vcc}, expected 5V`);
    if (gnd !== "GND") issues.push("GND not connected");
    const powered = (vcc === "5V" || vcc === "3V3") && gnd === "GND";

    // I²C
    let i2cOk = false;
    if (def.kind === "i2c") {
      const sda = arduinoFor("SDA");
      const scl = arduinoFor("SCL");
      if (sda !== "A4") issues.push("SDA must go to A4");
      if (scl !== "A5") issues.push("SCL must go to A5");
      i2cOk = sda === "A4" && scl === "A5" && powered;
    }

    result[inst.instanceId] = { pins, powered, i2cOk, issues };
  }

  return result;
}
