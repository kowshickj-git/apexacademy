"use client";
// Sensor & actuator control panel: add/remove devices, assign each pin, drive
// real-world inputs, and read live values. Inputs show their modelled value;
// outputs (servo/buzzer/relay/RGB) show what your code is actually driving.

import { useEffect, useRef, useState } from "react";
import {
  SENSORS,
  SENSOR_MAP,
  SENSOR_CATEGORIES,
  pinsFor,
  type SensorInstance,
  type OutputState,
} from "@/lib/playground/sensors";

interface Props {
  sensors: SensorInstance[];
  outputs: Record<string, OutputState>;
  onAdd: (defId: string) => void;
  onRemove: (instanceId: string) => void;
  onPin: (instanceId: string, slot: string, pin: string) => void;
  onConfig: (instanceId: string, key: string, value: number | boolean) => void;
  onUseExample: (instanceId: string) => void;
  onSetLive: (instanceId: string, live: boolean) => void;
}

export default function SensorPanel({ sensors, outputs, onAdd, onRemove, onPin, onConfig, onUseExample, onSetLive }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Sensors &amp; Modules</p>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onAdd(e.target.value);
            e.target.value = "";
          }}
          className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg px-2 py-1 text-xs font-semibold"
        >
          <option value="">+ Add device</option>
          {SENSOR_CATEGORIES.map((cat) => (
            <optgroup key={cat} label={cat}>
              {SENSORS.filter((s) => s.category === cat).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {sensors.length === 0 ? (
        <p className="text-[11px] text-white/35 leading-relaxed border border-dashed border-white/10 rounded-lg p-3">
          No devices yet. Add a sensor or actuator, assign its pin(s), then read or drive it from your code
          (<span className="font-mono text-white/55">analogRead</span>, <span className="font-mono text-white/55">digitalRead</span>,{" "}
          <span className="font-mono text-white/55">pulseIn</span>, <span className="font-mono text-white/55">Servo</span>, …).
        </p>
      ) : (
        <div className="space-y-2">
          {sensors.map((s) => {
            const def = SENSOR_MAP[s.defId];
            if (!def) return null;
            const out = outputs[s.instanceId];
            const inputReading = def.compute ? def.compute(s.config).display : undefined;
            const headline = inputReading ?? out?.display ?? (def.kind === "protocol" ? "read via your code" : "—");
            const open = expanded === s.instanceId;
            const accent = def.kind === "output" ? "#f59e0b" : def.kind === "protocol" ? "#a855f7" : def.kind === "digital" ? "#34d399" : "#38bdf8";
            return (
              <div key={s.instanceId} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0" style={{ background: `${accent}22`, color: accent }}>
                    {def.category}
                  </span>
                  <span className="text-xs font-semibold text-white truncate flex-1">{def.name}</span>
                  <button onClick={() => onRemove(s.instanceId)} className="text-white/30 hover:text-red-400 text-sm leading-none px-1" aria-label="Remove">
                    ✕
                  </button>
                </div>

                {/* Pin slots */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                  {def.slots.map((slot) => (
                    <span key={slot.key} className="inline-flex items-center gap-1">
                      <label className="text-[10px] text-white/40 font-mono">{slot.label}</label>
                      <select
                        value={s.pins[slot.key]}
                        onChange={(e) => onPin(s.instanceId, slot.key, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[11px] text-white font-mono"
                      >
                        {pinsFor(s.pins[slot.key], slot.pinClass).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </span>
                  ))}
                </div>

                {/* Live readout */}
                <div className="flex items-center gap-2 mt-2">
                  <OutputVisual out={out} kind={def.kind} />
                  <span className="text-[10px] font-mono ml-auto text-right" style={{ color: accent }}>
                    {headline}
                  </span>
                </div>

                {/* Rich displays */}
                {out?.text && <LcdDisplay rows={out.text} />}
                {out?.pixels && <OledDisplay fb={out.pixels} />}
                {out?.lines && !out.text && !out.pixels && (
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] text-white/60">
                    {out.lines.map((l, i) => (
                      <span key={i}>{l}</span>
                    ))}
                  </div>
                )}

                {/* Manual / Live input switch */}
                {def.liveInput && (
                  <div className="mt-2">
                    <div className="flex rounded-lg overflow-hidden border border-white/10 text-[10px]">
                      <button onClick={() => onSetLive(s.instanceId, false)} className={`flex-1 px-2 py-1 font-semibold ${!s.live ? "bg-white/15 text-white" : "text-white/40"}`}>
                        ✋ Manual
                      </button>
                      <button onClick={() => onSetLive(s.instanceId, true)} className={`flex-1 px-2 py-1 font-semibold ${s.live ? "bg-emerald-500/20 text-emerald-300" : "text-white/40"}`}>
                        📡 Live
                      </button>
                    </div>
                    {s.live && (
                      <p className="text-[10px] text-emerald-300/70 mt-1 leading-snug">
                        {def.liveInput === "motion"
                          ? "Move your mouse or touch the screen → registers as motion."
                          : "Tilt / rotate your phone to drive the sensor (on a laptop, use Manual)."}
                      </p>
                    )}
                  </div>
                )}

                {/* Input controls (hidden while Live) */}
                {def.controls.length > 0 && !(def.liveInput && s.live) && (
                  <div className="mt-2 space-y-2">
                    {def.controls.map((c) =>
                      c.kind === "slider" ? (
                        <label key={c.key} className="block">
                          <span className="block text-[10px] text-white/40 mb-0.5 font-mono">
                            {c.label}: {String(s.config[c.key])}
                            {c.unit ?? ""}
                          </span>
                          <input
                            type="range"
                            className="slider-secondary"
                            min={c.min}
                            max={c.max}
                            step={c.step}
                            value={Number(s.config[c.key])}
                            onChange={(e) => onConfig(s.instanceId, c.key, Number(e.target.value))}
                          />
                        </label>
                      ) : (
                        <button
                          key={c.key}
                          onClick={() => onConfig(s.instanceId, c.key, !s.config[c.key])}
                          className={`w-full px-2 py-1.5 rounded-lg text-[11px] font-bold ${s.config[c.key] ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/50"}`}
                        >
                          {s.config[c.key] ? `● ${c.label} (active)` : `○ ${c.label}`}
                        </button>
                      ),
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => onUseExample(s.instanceId)} className="text-[10px] font-semibold text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded bg-emerald-500/10">
                    ⤵ Use example code
                  </button>
                  <button onClick={() => setExpanded(open ? null : s.instanceId)} className="text-[10px] font-semibold text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/5 ml-auto">
                    {open ? "Hide info" : "How it works"}
                  </button>
                </div>

                {open && (
                  <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5 text-[11px] leading-relaxed">
                    <p className="text-white/70">{def.howItWorks}</p>
                    <p>
                      <span className="text-white/40 font-mono text-[10px]">USES </span>
                      <span className="text-white/55">{def.applications}</span>
                    </p>
                    <p>
                      <span className="text-amber-400/70 font-mono text-[10px]">WATCH OUT </span>
                      <span className="text-white/55">{def.commonMistakes}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LcdDisplay({ rows }: { rows: string[] }) {
  return (
    <div className="mt-2 rounded-md p-2 font-mono text-[11px] leading-tight" style={{ background: "#0b3b2e", color: "#7CFFB2", border: "1px solid #14543f", letterSpacing: "1.5px" }}>
      {[0, 1].map((i) => (
        <div key={i} className="whitespace-pre">
          {(rows[i] ?? "").padEnd(16, " ").slice(0, 16)}
        </div>
      ))}
    </div>
  );
}

function OledDisplay({ fb }: { fb: { data: Uint8Array; w: number; h: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const { data, w, h } = fb;
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const on = (data[x + (y >> 3) * w] >> (y & 7)) & 1;
        const idx = (y * w + x) * 4;
        img.data[idx] = on ? 56 : 8;
        img.data[idx + 1] = on ? 189 : 12;
        img.data[idx + 2] = on ? 248 : 20;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [fb]);
  return (
    <canvas
      ref={ref}
      width={fb.w}
      height={fb.h}
      className="mt-2 w-full rounded-md border border-white/10"
      style={{ imageRendering: "pixelated", aspectRatio: `${fb.w}/${fb.h}`, background: "#06080f" }}
    />
  );
}

function OutputVisual({ out, kind }: { out?: OutputState; kind: string }) {
  if ((kind !== "output" && kind !== "i2c") || !out) return <span className="w-9 h-9" />;
  if (out.percent !== undefined) {
    return (
      <span className="w-9 h-9 rounded-full border border-white/15 grid place-items-center shrink-0" title="motor speed">
        <span className="text-[9px] font-mono font-bold" style={{ color: out.percent > 2 ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>
          {out.percent}%
        </span>
      </span>
    );
  }
  if (out.angle !== undefined) {
    return (
      <span className="relative w-9 h-9 rounded-full border border-white/15 bg-white/5 shrink-0" title="servo angle">
        <span
          className="absolute left-1/2 top-1/2 w-[14px] h-0.5 bg-amber-400 origin-left"
          style={{ transform: `translate(0,-50%) rotate(${out.angle - 90}deg)` }}
        />
      </span>
    );
  }
  if (out.color) {
    return <span className="w-9 h-9 rounded-full border border-white/15 shrink-0" style={{ background: out.color, boxShadow: `0 0 10px ${out.color}` }} />;
  }
  if (out.on !== undefined) {
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 ${out.on ? "bg-emerald-500/25 text-emerald-300" : "bg-white/5 text-white/40"}`}>
        {out.on ? "ON" : "OFF"}
      </span>
    );
  }
  if (out.freq !== undefined) {
    return <span className={`text-lg shrink-0 ${out.freq > 0 ? "text-amber-400" : "text-white/25"}`}>♪</span>;
  }
  return <span className="w-9 h-9" />;
}
