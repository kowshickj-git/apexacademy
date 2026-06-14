"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onRgbUsed: () => void; }

const PRESETS: { label: string; r: number; g: number; b: number }[] = [
  { label: "White", r: 255, g: 255, b: 255 },
  { label: "Red", r: 255, g: 0, b: 0 },
  { label: "Green", r: 0, g: 255, b: 0 },
  { label: "Blue", r: 0, g: 0, b: 255 },
  { label: "Cyan", r: 0, g: 255, b: 255 },
  { label: "Magenta", r: 255, g: 0, b: 255 },
  { label: "Yellow", r: 255, g: 255, b: 0 },
  { label: "Orange", r: 255, g: 100, b: 0 },
];

function toHex(r: number, g: number, b: number) {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function RGBMixer({ onRgbUsed }: Props) {
  const [r, setR] = useState(255);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [used, setUsed] = useState(false);

  const color = toHex(r, g, b);
  const brightness = (r + g + b) / (3 * 255);

  const handle = (setter: (v: number) => void, v: number) => {
    if (!used) { setUsed(true); onRgbUsed(); }
    setter(v);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    if (!used) { setUsed(true); onRgbUsed(); }
    setR(p.r); setG(p.g); setB(p.b);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 12 · Simulator 3</p>
        <h2 className="text-xl font-bold mb-1">RGB LED Colour Mixer</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          An RGB LED has three diodes inside — red, green, and blue — with a common cathode. By controlling how much current flows through each, you can produce any visible colour.
          This is <strong className="text-white/70">additive colour mixing</strong> — opposite to paint (subtractive).
        </p>

        {/* Main mixer */}
        <div className="rounded-2xl border border-white/8 p-5 mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* LED output */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <motion.div
                className="w-28 h-28 rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: brightness > 0.1 ? color : "rgba(255,255,255,0.1)",
                  background: `${color}${Math.round(brightness * 200 + 55).toString(16).padStart(2, "0")}`,
                  boxShadow: brightness > 0.05 ? `0 0 ${brightness * 40}px ${color}99` : "none",
                }}
                animate={{ scale: brightness > 0 ? 1 + brightness * 0.05 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="text-center">
                <p className="text-sm font-mono font-bold" style={{ color: brightness > 0.1 ? color : "rgba(255,255,255,0.3)" }}>
                  {color.toUpperCase()}
                </p>
                <p className="text-[9px] text-white/25 font-mono">rgb({r}, {g}, {b})</p>
              </div>
            </div>

            {/* RGB sliders */}
            <div className="flex-1 space-y-4">
              {[
                { label: "Red", value: r, setter: setR, color: "#EF4444" },
                { label: "Green", value: g, setter: setG, color: "#10B981" },
                { label: "Blue", value: b, setter: setB, color: "#0EA5E9" },
              ].map(({ label, value, setter, color: c }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: c }}>{label}</span>
                    <span className="font-mono text-white/40">{value}</span>
                  </div>
                  <input
                    type="range" min={0} max={255} value={value}
                    onChange={(e) => handle(setter, Number(e.target.value))}
                    className="w-full"
                    style={{ background: `linear-gradient(to right, ${c} ${(value / 255) * 100}%, rgba(255,255,255,0.08) ${(value / 255) * 100}%)` }}
                  />
                  <div className="flex justify-between text-[8px] text-white/15 mt-0.5 font-mono">
                    <span>0 (off)</span>
                    <span>255 (max)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-white/45 hover:bg-white/5 transition-all"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: toHex(p.r, p.g, p.b) }} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Additive mixing explanation */}
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="rounded-xl border border-white/6 p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex justify-center gap-1 mb-1">
              <div className="w-5 h-5 rounded-full bg-red-500/70" />
              <div className="w-5 h-5 rounded-full bg-green-500/70 -ml-2" />
            </div>
            <p className="text-[9px] text-yellow-400 font-mono">R + G = Yellow</p>
          </div>
          <div className="rounded-xl border border-white/6 p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex justify-center gap-1 mb-1">
              <div className="w-5 h-5 rounded-full bg-green-500/70" />
              <div className="w-5 h-5 rounded-full bg-blue-500/70 -ml-2" />
            </div>
            <p className="text-[9px] text-cyan-400 font-mono">G + B = Cyan</p>
          </div>
          <div className="rounded-xl border border-white/6 p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex justify-center gap-1 mb-1">
              <div className="w-5 h-5 rounded-full bg-red-500/70" />
              <div className="w-5 h-5 rounded-full bg-blue-500/70 -ml-2" />
            </div>
            <p className="text-[9px] text-purple-400 font-mono">R + B = Magenta</p>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-white/6 text-xs text-white/40 leading-relaxed" style={{ background: "rgba(255,255,255,0.02)" }}>
          <strong className="text-white/60">Additive vs Subtractive:</strong> RGB light mixing adds energy — Red + Green + Blue = White (all photons combined). Paint subtracts light — mix all pigments and you get black (all light absorbed). LEDs use additive mixing.
        </div>
      </div>
    </section>
  );
}
