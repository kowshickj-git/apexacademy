"use client";
// Toolbar, Component Library, Properties panel, and Simulation Console.

import { useRef, useState } from "react";
import { useLab, actions, getState } from "@/lib/simulator/store";
import { CATALOG, CATALOG_LIST, LED_GLOW } from "@/lib/simulator/catalog";
import type { Part, PartResult } from "@/lib/simulator/types";
import { fmtA, fmtV, fmtW, fmtOhm } from "@/lib/simulator/format";

const WIRE_COLORS = ["#10b981", "#ef4444", "#3b82f6", "#eab308", "#f8fafc", "#a855f7"];

// ── Toolbar ───────────────────────────────────────────────────────────

export function Toolbar() {
  const mode = useLab((s) => s.mode);
  const grid = useLab((s) => s.grid);
  const zoom = useLab((s) => s.view.zoom);
  const wireColor = useLab((s) => s.wireColor);
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    const blob = new Blob([actions.exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apex-circuit.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => actions.importJSON(String(reader.result));
    reader.readAsText(file);
    e.target.value = "";
  };

  const zoomBy = (f: number) => {
    const v = getState().view;
    actions.setView({ zoom: Math.min(3, Math.max(0.3, v.zoom * f)) });
  };

  return (
    <div className="flex items-center gap-2 px-3 h-14 border-b border-white/10 bg-[#0d0d12] shrink-0 overflow-x-auto">
      <span className="font-bold text-sm text-white whitespace-nowrap mr-1">
        ⚡ Circuit <span className="text-primary">Lab</span>
      </span>

      <ModeBadge mode={mode} />
      {mode === "running" ? (
        <button onClick={() => actions.stop()} className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-red-500/15 text-red-400 hover:bg-red-500/25">
          ■ Stop
        </button>
      ) : (
        <button onClick={() => actions.run()} className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25">
          {mode === "paused" ? "▶ Resume" : "▶ Run"}
        </button>
      )}
      {mode === "paused" && <ToolBtn label="■ Stop" onClick={() => actions.stop()} />}
      <ToolBtn label="↺ Reset" onClick={() => actions.reset()} />
      <ToolBtn label="🗑 New" onClick={() => actions.clearAll()} />

      <Divider />
      <ToolBtn label="Save" onClick={() => actions.save()} />
      <ToolBtn label="Load" onClick={() => actions.load()} />
      <ToolBtn label="Export" onClick={doExport} />
      <ToolBtn label="Import" onClick={() => fileRef.current?.click()} />
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={doImport} />

      <Divider />
      <ToolBtn label="–" onClick={() => zoomBy(1 / 1.2)} />
      <span className="text-[11px] text-white/50 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
      <ToolBtn label="+" onClick={() => zoomBy(1.2)} />
      <ToolBtn label="Fit" onClick={() => actions.setView({ panX: 0, panY: 0, zoom: 1 })} />
      <button
        onClick={() => actions.toggleGrid()}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${grid ? "bg-white/10 text-white" : "bg-white/5 text-white/40"}`}
      >
        Grid
      </button>

      <Divider />
      <span className="text-[10px] text-white/40 whitespace-nowrap">Wire</span>
      {WIRE_COLORS.map((c) => (
        <button
          key={c}
          onClick={() => actions.setWireColor(c)}
          className="w-5 h-5 rounded-full border-2 shrink-0"
          style={{ background: c, borderColor: wireColor === c ? "#fff" : "transparent" }}
          aria-label={`Wire color ${c}`}
        />
      ))}
    </div>
  );
}

function ToolBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 whitespace-nowrap transition-colors">
      {label}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-6 bg-white/10 shrink-0" />;
}

const MODE_META: Record<string, { label: string; color: string }> = {
  edit: { label: "EDIT", color: "#fbbf24" },
  running: { label: "RUN", color: "#34d399" },
  paused: { label: "PAUSED", color: "#fb923c" },
  error: { label: "ERROR", color: "#f87171" },
};

function ModeBadge({ mode }: { mode: string }) {
  const m = MODE_META[mode] ?? MODE_META.edit;
  return (
    <span
      className="px-2 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider whitespace-nowrap shrink-0"
      style={{ color: m.color, background: `${m.color}1f`, border: `1px solid ${m.color}55` }}
    >
      ● {m.label}
    </span>
  );
}

// ── Component Library ─────────────────────────────────────────────────

export function Library() {
  const categories = ["Power", "Output", "Passive", "Switch", "Meter"] as const;
  const locked = useLab((s) => s.mode === "running");
  return (
    <div className="w-52 shrink-0 border-r border-white/10 bg-[#0d0d12] overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-white/10">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Components</p>
      </div>
      <div className={`p-2 space-y-3 ${locked ? "opacity-40 pointer-events-none" : ""}`}>
        {categories.map((cat) => {
          const items = CATALOG_LIST.filter((m) => m.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat}>
              <p className="text-[9px] uppercase tracking-wider text-white/30 px-1 mb-1 font-mono">{cat}</p>
              <div className="space-y-1">
                {items.map((m) => (
                  <button
                    key={m.type}
                    draggable={!locked}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/x-apex-part", m.type);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => actions.addPart(m.type, 260, 200)}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-primary/40 transition-colors cursor-grab active:cursor-grabbing"
                  >
                    <span className="block text-xs font-semibold text-white">{m.label}</span>
                    <span className="block text-[10px] text-white/40 mt-0.5">{m.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-white/30 px-3 pb-3 leading-relaxed">
        {locked ? "Stop the simulation to edit the circuit." : "Drag onto the canvas, or click to drop. Click a pin then another to wire."}
      </p>
    </div>
  );
}

// ── Properties Panel ──────────────────────────────────────────────────

export function Properties() {
  const selectedId = useLab((s) => s.selectedId);
  const part = useLab((s) => s.schematic.parts.find((p) => p.id === s.selectedId));
  const result = useLab((s) => (s.selectedId ? s.result.parts[s.selectedId] : undefined));
  const energized = useLab((s) => s.mode === "running" || s.mode === "paused");

  return (
    <div className="w-64 shrink-0 border-l border-white/10 bg-[#0d0d12] overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-white/10">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Properties</p>
      </div>
      {!part ? (
        <p className="p-4 text-xs text-white/40 leading-relaxed">Select a component to edit its properties. Scroll to zoom, drag the background to pan.</p>
      ) : (
        <div className="p-3 space-y-4">
          <div>
            <p className="text-sm font-bold text-white">{CATALOG[part.type].label}</p>
            <p className="text-[10px] text-white/40 font-mono">{part.id}</p>
          </div>

          <PartEditors part={part} />

          <div className="flex gap-2">
            <button onClick={() => actions.rotatePart(part.id)} className="flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white/70 hover:bg-white/10">
              ⟳ Rotate
            </button>
            <button onClick={() => actions.deletePart(part.id)} className="flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20">
              Delete
            </button>
          </div>

          {energized && result && <Readouts part={part} result={result} />}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider text-white/40 mb-1 font-mono">{label}</span>
      {children}
    </label>
  );
}

const numInput = "w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:border-primary focus:outline-none";

function PartEditors({ part }: { part: Part }) {
  switch (part.type) {
    case "supply":
      return <SupplyEditor part={part} />;
    case "resistor":
      return <ResistorEditor part={part} />;
    case "potentiometer":
      return <PotentiometerEditor part={part} />;
    case "led":
      return <LedEditor part={part} />;
    case "button":
    case "switch":
      return (
        <Field label="State">
          <button
            onClick={() => actions.setProp(part.id, "closed", !part.props.closed)}
            className={`w-full px-3 py-2 rounded-lg text-xs font-bold ${part.props.closed ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/60"}`}
          >
            {part.props.closed ? "● Closed (conducting)" : "○ Open"}
          </button>
        </Field>
      );
    default:
      return <p className="text-[11px] text-white/40">No editable properties.</p>;
  }
}

function SupplyEditor({ part }: { part: Part }) {
  const v = Number(part.props.voltage ?? 5);
  const i = Number(part.props.currentLimit ?? 1);
  const on = part.props.on !== false;
  return (
    <div className="space-y-3">
      <Field label={`Voltage — ${v.toFixed(1)} V`}>
        <input type="range" min={0} max={12} step={0.1} value={v} onChange={(e) => actions.setProp(part.id, "voltage", Number(e.target.value))} />
        <input type="number" min={0} max={12} step={0.1} value={v} onChange={(e) => actions.setProp(part.id, "voltage", Number(e.target.value))} className={`${numInput} mt-1.5`} />
      </Field>
      <Field label={`Current limit — ${i.toFixed(2)} A`}>
        <input type="range" className="slider-secondary" min={0} max={5} step={0.05} value={i} onChange={(e) => actions.setProp(part.id, "currentLimit", Number(e.target.value))} />
      </Field>
      <button onClick={() => actions.setProp(part.id, "on", !on)} className={`w-full px-3 py-2 rounded-lg text-xs font-bold ${on ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/50"}`}>
        {on ? "⏻ Output ON" : "⏻ Output OFF"}
      </button>
    </div>
  );
}

function ResistorEditor({ part }: { part: Part }) {
  const ohms = Number(part.props.resistance ?? 1000);
  const [unit, setUnit] = useState(ohms >= 1e6 ? 1e6 : ohms >= 1e3 ? 1e3 : 1);
  const display = ohms / unit;
  return (
    <Field label="Resistance">
      <div className="flex gap-1.5">
        <input
          type="number"
          min={0}
          step="any"
          value={Number.isFinite(display) ? Number(display.toFixed(3)) : 0}
          onChange={(e) => actions.setProp(part.id, "resistance", Math.max(0, Number(e.target.value) * unit))}
          className={numInput}
        />
        <select value={unit} onChange={(e) => setUnit(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-2 text-xs text-white">
          <option value={1}>Ω</option>
          <option value={1e3}>kΩ</option>
          <option value={1e6}>MΩ</option>
        </select>
      </div>
      <p className="text-[10px] text-white/40 mt-1 font-mono">= {fmtOhm(ohms)}</p>
    </Field>
  );
}

function LedEditor({ part }: { part: Part }) {
  const colors: Array<"red" | "green" | "blue" | "yellow" | "white"> = ["red", "green", "blue", "yellow", "white"];
  const current = String(part.props.color ?? "red");
  return (
    <div className="space-y-3">
      <Field label="Color">
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => actions.setProp(part.id, "color", c)}
              className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
              style={{ background: LED_GLOW[c], borderColor: current === c ? "#fff" : "transparent" }}
              aria-label={c}
            />
          ))}
        </div>
      </Field>
      {part.props.damaged && (
        <button
          onClick={() => actions.setProp(part.id, "damaged", false)}
          className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
        >
          🔧 Replace burnt LED
        </button>
      )}
    </div>
  );
}

function PotentiometerEditor({ part }: { part: Part }) {
  const pos = Number(part.props.position ?? 0.5);
  const max = Number(part.props.maxResistance ?? 10000);
  return (
    <div className="space-y-3">
      <Field label={`Wiper — ${Math.round(pos * 100)}%`}>
        <input type="range" className="slider-orange" min={0} max={1} step={0.01} value={pos} onChange={(e) => actions.setProp(part.id, "position", Number(e.target.value))} />
      </Field>
      <Field label="Max resistance (Ω)">
        <input
          type="number"
          min={1}
          step="any"
          value={max}
          onChange={(e) => actions.setProp(part.id, "maxResistance", Math.max(1, Number(e.target.value)))}
          className={numInput}
        />
      </Field>
      <p className="text-[10px] text-white/40 font-mono">R now = {fmtOhm(Math.max(1, pos * max))}</p>
    </div>
  );
}

function Readouts({ part, result }: { part: Part; result: PartResult }) {
  const rows: Array<[string, string]> = [];
  if (part.type === "voltmeter" && result.reading !== undefined) rows.push(["Reading", fmtV(result.reading)]);
  if (part.type === "led") {
    rows.push(["Current", fmtA(result.current)]);
    rows.push(["Brightness", `${Math.round((result.brightness ?? 0) * 100)}%`]);
    const vd = (result.terminalV.a ?? 0) - (result.terminalV.c ?? 0);
    rows.push(["V drop", fmtV(vd)]);
  } else if (part.type === "resistor" || part.type === "potentiometer") {
    rows.push(["Current", fmtA(result.current)]);
    rows.push(["Power", fmtW(result.power)]);
  } else if (part.type === "supply") {
    rows.push(["Current", fmtA(result.current)]);
    rows.push(["Power", fmtW(result.power)]);
  }
  if (!rows.length) return null;
  return (
    <div className="border-t border-white/10 pt-3 space-y-1.5">
      <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-mono mb-1">Live measurement</p>
      {rows.map(([k, val]) => (
        <div key={k} className="flex justify-between text-xs">
          <span className="text-white/50">{k}</span>
          <span className="text-white font-mono font-semibold">{val}</span>
        </div>
      ))}
    </div>
  );
}

// ── Simulation Console ────────────────────────────────────────────────

export function Console() {
  const log = useLab((s) => s.log);
  const mode = useLab((s) => s.mode);
  const result = useLab((s) => s.result);
  const color = (lvl: string) => (lvl === "error" ? "#f87171" : lvl === "warn" ? "#fbbf24" : "#94a3b8");
  const meta = MODE_META[mode] ?? MODE_META.edit;
  const energized = mode === "running" || mode === "paused";
  return (
    <div className="h-28 shrink-0 border-t border-white/10 bg-[#0a0a0e] flex flex-col">
      <div className="flex items-center gap-3 px-3 py-1.5 border-b border-white/5">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Console</p>
        <span className="text-[10px] font-mono" style={{ color: meta.color }}>● {meta.label}</span>
        {energized && <span className="text-[10px] font-mono text-white/40">{result.nodeCount} nodes · {result.iterations} iter</span>}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-1.5 font-mono text-[11px] space-y-0.5">
        {log.length === 0 ? (
          <p className="text-white/30">Press ▶ Run to solve the circuit…</p>
        ) : (
          log.map((e, idx) => (
            <p key={idx} style={{ color: color(e.level) }}>
              <span className="text-white/25">›</span> {e.message}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
