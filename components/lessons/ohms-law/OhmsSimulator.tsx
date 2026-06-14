"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onSimUsed: () => void; }

const electrons = Array.from({ length: 10 }, (_, i) => i);

export default function OhmsSimulator({ onSimUsed }: Props) {
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(470);
  const [used, setUsed] = useState(false);

  const current_mA = (voltage / resistance) * 1000;
  const current_display = current_mA < 1 ? `${(current_mA * 1000).toFixed(1)}µA` : `${current_mA.toFixed(1)}mA`;
  const isSafe = current_mA <= 20;
  const brightness = Math.min(1, current_mA / 20);
  const ledColor = current_mA > 20 ? "#EF4444" : "#10B981";
  const electronSpeed = isSafe ? 0.5 + (1 - brightness) * 2 : 0.3;

  const handleV = (v: number) => { setVoltage(v); if (!used) { setUsed(true); onSimUsed(); } };
  const handleR = (r: number) => { setResistance(r); if (!used) { setUsed(true); onSimUsed(); } };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9 · Simulator ★</p>
        <h2 className="text-xl font-bold mb-1">Ohm&apos;s Law Live Simulator</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Drag the sliders. Watch voltage, current, and resistance change in real time.
          See how the LED reacts — and feel Ohm&apos;s Law in action.
        </p>

        {/* Live formula display */}
        <div
          className="flex items-center justify-center gap-2 sm:gap-4 p-4 rounded-2xl border border-primary/20 mb-6 flex-wrap"
          style={{ background: "rgba(16,185,129,0.06)" }}
        >
          <div className="text-center">
            <p className="text-2xl font-black font-mono text-yellow-400">{voltage}V</p>
            <p className="text-[10px] text-white/30">Voltage (V)</p>
          </div>
          <p className="text-white/20 text-xl font-light">=</p>
          <div className="text-center">
            <p className="text-2xl font-black font-mono text-secondary">{current_display}</p>
            <p className="text-[10px] text-white/30">Current (I)</p>
          </div>
          <p className="text-white/20 text-xl font-light">×</p>
          <div className="text-center">
            <p className="text-2xl font-black font-mono text-orange-400">{resistance >= 1000 ? `${resistance / 1000}K` : resistance}Ω</p>
            <p className="text-[10px] text-white/30">Resistance (R)</p>
          </div>
        </div>

        {/* Circuit animation */}
        <div
          className="relative rounded-2xl border border-white/6 overflow-hidden mb-6"
          style={{ background: "rgba(255,255,255,0.015)", height: 140 }}
        >
          {/* Battery */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div
              className="w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center"
              style={{ background: "rgba(234,179,8,0.1)", borderColor: "rgba(234,179,8,0.4)" }}
            >
              <span className="text-yellow-400 text-xs font-black font-mono">{voltage}V</span>
              <div className="mt-1 space-y-0.5">
                <div className="w-6 h-0.5 bg-yellow-400/50 mx-auto" />
                <div className="w-4 h-0.5 bg-yellow-400/30 mx-auto" />
              </div>
            </div>
            <span className="text-[8px] text-white/25">Battery</span>
          </div>

          {/* Top wire */}
          <div className="absolute h-0.5 top-8" style={{ left: 64, right: 60, background: isSafe ? "#10B981" : "#EF4444" }}>
            {electrons.map((i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{
                  background: "#0EA5E9",
                  boxShadow: "0 0 5px rgba(14,165,233,0.9)",
                  animation: `ant-march ${electronSpeed + i * 0.18}s linear infinite`,
                  animationDelay: `${i * (electronSpeed / 10)}s`,
                  left: "-8px",
                }}
              />
            ))}
          </div>

          {/* Resistor */}
          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: "50%", transform: "translate(-50%, -70%)" }}>
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="w-14 h-6 rounded border-2 flex items-center gap-0.5 justify-center px-1.5"
                style={{ background: "rgba(249,115,22,0.12)", borderColor: "rgba(249,115,22,0.45)" }}
              >
                <div className="w-2 h-4 rounded-sm bg-orange-500/70" />
                <div className="w-2 h-4 rounded-sm bg-yellow-500/70" />
                <div className="w-2 h-4 rounded-sm bg-violet-500/70" />
              </div>
              <span className="text-[9px] text-orange-400/70 font-mono">{resistance >= 1000 ? `${resistance / 1000}KΩ` : `${resistance}Ω`}</span>
            </div>
          </div>

          {/* Bottom wire */}
          <div className="absolute h-0.5 bottom-8" style={{ left: 64, right: 60, background: isSafe ? "#10B981" : "#EF4444" }} />

          {/* LED */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <polygon points="8,6 30,20 8,34" fill={ledColor} opacity={0.3 + brightness * 0.7} />
                <line x1="30" y1="12" x2="30" y2="28" stroke={ledColor} strokeWidth="3" opacity={0.5 + brightness * 0.5} />
                <line x1="30" y1="20" x2="40" y2="20" stroke={ledColor} strokeWidth="1.5" opacity={0.4} />
                <line x1="8" y1="20" x2="0" y2="20" stroke={ledColor} strokeWidth="1.5" opacity={0.4} />
              </svg>
              {isSafe && brightness > 0.05 && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${ledColor}${Math.round(brightness * 70).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
                    animation: "pulse-glow 1.5s ease-in-out infinite",
                  }}
                />
              )}
              {!isSafe && <div className="absolute inset-0 flex items-center justify-center text-lg">💥</div>}
            </div>
            <span className="text-[8px] text-white/25">LED</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>🔋 Voltage (V)</span>
              <span className="font-mono text-yellow-400">{voltage}V</span>
            </div>
            <input
              type="range" min={1} max={20} value={voltage}
              onChange={(e) => handleV(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, #EAB308 ${(voltage / 20) * 100}%, rgba(255,255,255,0.08) ${(voltage / 20) * 100}%)` }}
            />
            <div className="flex justify-between text-[10px] text-white/20 mt-1"><span>1V</span><span>20V</span></div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>🚧 Resistance (R)</span>
              <span className="font-mono text-orange-400">{resistance >= 1000 ? `${resistance / 1000}KΩ` : `${resistance}Ω`}</span>
            </div>
            <input
              type="range" min={10} max={10000} step={10} value={resistance}
              onChange={(e) => handleR(Number(e.target.value))}
              className="w-full slider-orange"
              style={{ background: `linear-gradient(to right, #F97316 ${(resistance / 10000) * 100}%, rgba(255,255,255,0.08) ${(resistance / 10000) * 100}%)` }}
            />
            <div className="flex justify-between text-[10px] text-white/20 mt-1"><span>10Ω</span><span>10KΩ</span></div>
          </div>
        </div>

        {/* Status */}
        <motion.div
          key={`${Math.round(current_mA * 10)}`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border p-4"
          style={{
            background: current_mA > 20 ? "rgba(239,68,68,0.07)" : brightness > 0.7 ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.02)",
            borderColor: current_mA > 20 ? "rgba(239,68,68,0.3)" : brightness > 0.7 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"
          }}
        >
          <div className="flex flex-wrap gap-4 justify-center text-center mb-3">
            <div>
              <p className="text-xl font-black font-mono text-yellow-400">{voltage}V</p>
              <p className="text-[10px] text-white/30">Voltage</p>
            </div>
            <div className="flex items-center text-white/20 text-xl">÷</div>
            <div>
              <p className="text-xl font-black font-mono text-orange-400">{resistance}Ω</p>
              <p className="text-[10px] text-white/30">Resistance</p>
            </div>
            <div className="flex items-center text-white/20 text-xl">=</div>
            <div>
              <p className="text-xl font-black font-mono" style={{ color: current_mA > 20 ? "#EF4444" : "#0EA5E9" }}>{current_display}</p>
              <p className="text-[10px] text-white/30">Current (I = V/R)</p>
            </div>
          </div>
          <p className="text-xs text-center" style={{ color: current_mA > 20 ? "#EF4444" : brightness > 0.6 ? "#10B981" : "rgba(255,255,255,0.4)" }}>
            {current_mA > 20
              ? "⚠️ Overcurrent! LED would burn. Increase resistance or lower voltage."
              : brightness > 0.7 ? "✅ LED glowing bright — ideal current range!"
              : brightness > 0.2 ? "💡 LED on but dim — try increasing voltage or reducing resistance."
              : "🔅 LED barely lit — very low current."}
          </p>
        </motion.div>

        {/* Quick presets */}
        <div className="mt-4">
          <p className="text-[10px] text-white/25 mb-2 uppercase tracking-widest font-mono">Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "LED @ 5V", v: 5, r: 220 },
              { label: "LED @ 9V", v: 9, r: 470 },
              { label: "High R", v: 12, r: 5000 },
              { label: "Danger!", v: 9, r: 10 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => { handleV(p.v); setResistance(p.r); }}
                className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
