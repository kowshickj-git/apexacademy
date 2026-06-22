"use client";
// Breadboard view.
//  Stage 1: Arduino + breadboard graphic + device blocks + suggested wiring.
//  Stage 2: hand-draw wires (click pin → click pin), delete, clear, colour pick.
// Hand-drawn wires are stored as anchor-id pairs so Stage 3 can netlist them.

import { useRef, useState } from "react";
import { SENSOR_MAP, type SensorInstance } from "@/lib/playground/sensors";
import type { ManualWire, DeviceNet } from "@/lib/playground/netlist";

interface XY {
  x: number;
  y: number;
}

const COL = {
  vcc: "#ef4444",
  gnd: "#64748b",
  i2c: "#a855f7",
  analog: "#38bdf8",
  digital: "#34d399",
  output: "#f59e0b",
};

export const WIRE_COLORS = ["#fbbf24", "#ef4444", "#3b82f6", "#22c55e", "#e2e8f0", "#a855f7"];

const ARD = { x: 40, y: 36, w: 380, h: 150 };
const DIGITAL = ["13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
const BOTTOM = ["A0", "A1", "A2", "A3", "A4", "A5", "5V", "3V3", "GND", "VIN"];

function arduinoAnchors(): Record<string, XY> {
  const a: Record<string, XY> = {};
  DIGITAL.forEach((p, i) => {
    a[p] = { x: ARD.x + 20 + (i * (ARD.w - 40)) / (DIGITAL.length - 1), y: ARD.y };
  });
  BOTTOM.forEach((p, i) => {
    a[p] = { x: ARD.x + 20 + (i * (ARD.w - 40)) / (BOTTOM.length - 1), y: ARD.y + ARD.h };
  });
  return a;
}

interface DevicePin {
  key: string;
  label: string;
  target: string;
  color: string;
}

function devicePins(inst: SensorInstance): DevicePin[] {
  const def = SENSOR_MAP[inst.defId];
  const pins: DevicePin[] = [];
  const sig = def.kind === "output" ? COL.output : def.kind === "analog" ? COL.analog : def.kind === "i2c" ? COL.i2c : COL.digital;
  if (def.kind === "i2c") {
    pins.push({ key: "SDA", label: "SDA", target: "A4", color: COL.i2c });
    pins.push({ key: "SCL", label: "SCL", target: "A5", color: COL.i2c });
  } else {
    for (const slot of def.slots) pins.push({ key: slot.key, label: slot.label, target: inst.pins[slot.key] ?? "?", color: sig });
  }
  pins.push({ key: "VCC", label: "VCC", target: "5V", color: COL.vcc });
  pins.push({ key: "GND", label: "GND", target: "GND", color: COL.gnd });
  return pins;
}

interface Props {
  sensors: SensorInstance[];
  manualWires: ManualWire[];
  wireColor: string;
  showSuggested: boolean;
  wiredMode: boolean;
  netlist: Record<string, DeviceNet>;
  onAddWire: (a: string, b: string) => void;
  onDeleteWire: (id: string) => void;
  onClearWires: () => void;
  onSetWireColor: (c: string) => void;
  onToggleSuggested: () => void;
  onToggleWired: () => void;
}

export default function Breadboard({ sensors, manualWires, wireColor, showSuggested, wiredMode, netlist, onAddWire, onDeleteWire, onClearWires, onSetWireColor, onToggleSuggested, onToggleWired }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [cursor, setCursor] = useState<XY | null>(null);

  const ard = arduinoAnchors();
  const DX = 660;
  const DW = 220;
  const DH = 96;
  const DGAP = 34;
  const height = Math.max(600, ARD.y + 40 + sensors.length * (DH + DGAP) + 40);
  const width = 940;

  // Build device blocks + a unified anchor map (id → position) for wiring.
  const anchors: Record<string, XY> = {};
  for (const p of [...DIGITAL, ...BOTTOM]) anchors[`arduino:${p}`] = ard[p];

  const blocks = sensors.map((inst, i) => {
    const def = SENSOR_MAP[inst.defId];
    const y = ARD.y + i * (DH + DGAP);
    const pins = devicePins(inst);
    const pinAnchors: Record<string, XY> = {};
    pins.forEach((p, j) => {
      const a = { x: DX, y: y + 18 + (j * (DH - 30)) / Math.max(1, pins.length - 1) };
      pinAnchors[p.key] = a;
      anchors[`dev:${inst.instanceId}:${p.key}`] = a;
    });
    return { inst, def, y, pins, pinAnchors };
  });

  const toSvg = (e: React.PointerEvent): XY => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const clickPin = (id: string) => {
    if (!pending) {
      setPending(id);
    } else if (pending === id) {
      setPending(null);
    } else {
      onAddWire(pending, id);
      setPending(null);
    }
  };

  const wirePath = (a: XY, b: XY) => {
    const dx = Math.max(60, Math.abs(b.x - a.x) / 2);
    return `M ${a.x} ${a.y} C ${a.x - dx} ${a.y}, ${b.x + dx} ${b.y}, ${b.x} ${b.y}`;
  };

  return (
    <div className="relative w-full h-full overflow-auto bg-[#0a0a0e]">
      {/* Overlay toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0e]/90 backdrop-blur border-b border-white/10">
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Breadboard</span>
        <span className="text-[10px] text-white/40">{pending ? "click another pin to finish the wire" : "click a pin to start a wire"}</span>
        <span className="w-px h-5 bg-white/10" />
        <span className="text-[10px] text-white/40">Wire</span>
        {WIRE_COLORS.map((c) => (
          <button key={c} onClick={() => onSetWireColor(c)} className="w-4 h-4 rounded-full border-2 shrink-0" style={{ background: c, borderColor: wireColor === c ? "#fff" : "transparent" }} aria-label={`Wire ${c}`} />
        ))}
        <span className="w-px h-5 bg-white/10" />
        <button
          onClick={onToggleWired}
          title="When on, the simulation follows the wires you drew (not the dropdown pins)."
          className={`px-2 py-1 rounded text-[10px] font-bold ${wiredMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-white/5 text-white/50"}`}
        >
          ⚡ Wiring drives sim
        </button>
        <button onClick={onToggleSuggested} className={`px-2 py-1 rounded text-[10px] font-semibold ${showSuggested ? "bg-white/10 text-white" : "bg-white/5 text-white/40"}`}>
          Suggested
        </button>
        <button onClick={onClearWires} className="px-2 py-1 rounded text-[10px] font-semibold text-red-400 hover:bg-red-500/10">
          Clear wires
        </button>
        {pending && (
          <button onClick={() => setPending(null)} className="px-2 py-1 rounded text-[10px] font-semibold text-white/50 hover:bg-white/10 ml-auto">
            Cancel
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: 760 }}
        onPointerMove={(e) => pending && setCursor(toSvg(e))}
        onPointerDown={() => setPending(null)}
      >
        {/* Suggested (auto) wiring — faded guide */}
        {showSuggested &&
          blocks.map((b) =>
            b.pins.map((p) => {
              const from = b.pinAnchors[p.key];
              const to = ard[p.target];
              if (!from || !to) return null;
              return <path key={`sg-${b.inst.instanceId}-${p.key}`} d={wirePath(from, to)} fill="none" stroke={p.color} strokeWidth={2} strokeDasharray="3 4" opacity={0.22} />;
            }),
          )}

        {/* Hand-drawn wires */}
        {manualWires.map((w) => {
          const a = anchors[w.a];
          const b = anchors[w.b];
          if (!a || !b) return null;
          return (
            <g key={w.id}>
              <path d={wirePath(a, b)} fill="none" stroke={w.color} strokeWidth={3} strokeLinecap="round" />
              <path
                d={wirePath(a, b)}
                fill="none"
                stroke="transparent"
                strokeWidth={12}
                style={{ cursor: "pointer" }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onDeleteWire(w.id);
                }}
              >
                <title>Click to delete wire</title>
              </path>
            </g>
          );
        })}

        {/* Wire preview */}
        {pending && cursor && anchors[pending] && (
          <line x1={anchors[pending].x} y1={anchors[pending].y} x2={cursor.x} y2={cursor.y} stroke={wireColor} strokeWidth={2.5} strokeDasharray="5 4" />
        )}

        {/* Arduino Uno */}
        <g>
          <rect x={ARD.x} y={ARD.y} width={ARD.w} height={ARD.h} rx={10} fill="#0f3a4d" stroke="#1d6f8f" strokeWidth={1.5} />
          <text x={ARD.x + ARD.w / 2} y={ARD.y + ARD.h / 2 - 6} textAnchor="middle" fontSize={15} fontWeight={700} fill="#7dd3fc" fontFamily="monospace">
            ARDUINO UNO
          </text>
          <text x={ARD.x + ARD.w / 2} y={ARD.y + ARD.h / 2 + 12} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">
            ATmega328P · 16 MHz
          </text>
          {DIGITAL.map((p) => (
            <g key={`dt${p}`}>
              <circle cx={ard[p].x} cy={ard[p].y} r={3.2} fill="#0a0a0e" stroke="#cbd5e1" strokeWidth={1} />
              <text x={ard[p].x} y={ard[p].y - 7} textAnchor="middle" fontSize={7.5} fill="#94a3b8" fontFamily="monospace">
                {p}
              </text>
            </g>
          ))}
          {BOTTOM.map((p) => (
            <g key={`bt${p}`}>
              <circle cx={ard[p].x} cy={ard[p].y} r={3.2} fill="#0a0a0e" stroke={p === "5V" ? COL.vcc : p === "GND" ? COL.gnd : "#cbd5e1"} strokeWidth={1} />
              <text x={ard[p].x} y={ard[p].y + 14} textAnchor="middle" fontSize={7.5} fill="#94a3b8" fontFamily="monospace">
                {p}
              </text>
            </g>
          ))}
        </g>

        {/* Breadboard graphic */}
        <Breadboardgfx x={ARD.x} y={ARD.y + ARD.h + 70} w={ARD.w + 180} />

        {/* Device blocks */}
        {blocks.map((b) => {
          const accent = b.def.kind === "output" ? COL.output : b.def.kind === "i2c" ? COL.i2c : b.def.kind === "analog" ? COL.analog : COL.digital;
          return (
            <g key={b.inst.instanceId}>
              <rect x={DX} y={b.y} width={DW} height={DH} rx={8} fill="#15151c" stroke={accent} strokeWidth={1.3} opacity={0.95} />
              <rect x={DX} y={b.y} width={4} height={DH} rx={2} fill={accent} />
              <text x={DX + DW / 2} y={b.y + DH / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
                {b.def.name}
              </text>
              {wiredMode &&
                (() => {
                  const dn = netlist[b.inst.instanceId];
                  const ok = b.def.kind === "i2c" ? !!dn?.i2cOk : !!dn?.powered && (dn?.issues.length ?? 1) === 0;
                  return (
                    <text x={DX + DW / 2} y={b.y + DH - 9} textAnchor="middle" fontSize={8} fill={ok ? "#34d399" : "#fbbf24"} fontFamily="monospace">
                      {ok ? "✓ wired & powered" : `⚠ ${dn?.issues[0] ?? "not wired"}`}
                    </text>
                  );
                })()}
              {b.pins.map((p) => {
                const an = b.pinAnchors[p.key];
                return (
                  <g key={p.key}>
                    <line x1={an.x} y1={an.y} x2={an.x - 10} y2={an.y} stroke={p.color} strokeWidth={2} />
                    <text x={an.x + 7} y={an.y + 3} fontSize={8} fill="#94a3b8" fontFamily="monospace">
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Clickable pin targets (on top) */}
        {Object.entries(anchors).map(([id, a]) => {
          const isPending = pending === id;
          return (
            <g key={`hit-${id}`}>
              {isPending && <circle cx={a.x} cy={a.y} r={7} fill="none" stroke="#fff" strokeWidth={1.5} />}
              <circle
                cx={a.x}
                cy={a.y}
                r={9}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  clickPin(id);
                }}
              >
                <title>{id}</title>
              </circle>
            </g>
          );
        })}

        {sensors.length === 0 && (
          <text x={DX + 20} y={ARD.y + 40} fontSize={12} fill="#64748b" fontFamily="monospace">
            Add devices in the Sensors panel — then wire them here by clicking pins.
          </text>
        )}
      </svg>
    </div>
  );
}

function Breadboardgfx({ x, y, w }: { x: number; y: number; w: number }) {
  const cols = 30;
  const colStep = (w - 24) / cols;
  const holes = (rowY: number, color: string) =>
    Array.from({ length: cols }, (_, c) => <circle key={`${rowY}-${c}`} cx={x + 14 + c * colStep} cy={rowY} r={2.4} fill={color} opacity={0.5} />);
  const railY1 = y + 14;
  const railY2 = y + 26;
  const bankTop = y + 52;
  const bankBot = y + 150;
  return (
    <g>
      <rect x={x} y={y} width={w} height={188} rx={8} fill="#1c1c22" stroke="#33333d" strokeWidth={1.2} />
      <line x1={x + 10} y1={railY1 - 6} x2={x + w - 10} y2={railY1 - 6} stroke={COL.vcc} strokeWidth={1} opacity={0.5} />
      <line x1={x + 10} y1={railY2 + 6} x2={x + w - 10} y2={railY2 + 6} stroke={COL.analog} strokeWidth={1} opacity={0.5} />
      {holes(railY1, "#ef4444")}
      {holes(railY2, "#3b82f6")}
      {[0, 1, 2, 3, 4].map((r) => holes(bankTop + r * 11, "#52525b"))}
      <rect x={x + 8} y={bankTop + 49} width={w - 16} height={8} fill="#121217" />
      {[0, 1, 2, 3, 4].map((r) => holes(bankBot - 44 + r * 11, "#52525b"))}
      <text x={x + 10} y={y + 184} fontSize={8} fill="#52525b" fontFamily="monospace">
        breadboard · prototyping area
      </text>
    </g>
  );
}
