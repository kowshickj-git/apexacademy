"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onSimUsed: () => void; }

const presets = [
  { label: "100Ω",  ohms: 100,   note: "Slightly bright – OK for 3.3V" },
  { label: "220Ω",  ohms: 220,   note: "Ideal for 5V supply – classic choice" },
  { label: "470Ω",  ohms: 470,   note: "Good for 9V supply – safe glow" },
  { label: "1KΩ",   ohms: 1000,  note: "Dim but safe – low power mode" },
  { label: "10KΩ",  ohms: 10000, note: "Very dim – barely visible" },
];

const SUPPLY = 9; // volts
const VF = 2.0;  // LED forward voltage (red LED)

export default function LEDDemo({ onSimUsed }: Props) {
  const [ohms, setOhms] = useState(220);
  const [used, setUsed] = useState(false);

  const current_mA = ((SUPPLY - VF) / ohms) * 1000;
  const isSafe = current_mA <= 20 && current_mA >= 1;
  const isDim = current_mA < 5 && current_mA >= 1;
  const isBright = current_mA > 15 && current_mA <= 20;
  const isBurned = current_mA > 20;

  const ledGlow = Math.min(1, current_mA / 20);
  const ledColor = isBurned ? "#EF4444" : current_mA > 10 ? "#10B981" : "#0EA5E9";

  const handleChange = (val: number) => {
    setOhms(val);
    if (!used) { setUsed(true); onSimUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Simulator</p>
        <h2 className="text-xl font-bold mb-1">LED Protection Simulator</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          A 9V battery powers this LED. Choose a resistor value. If the current stays below 20mA, the LED survives.
          Too much? It burns out instantly.
        </p>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => handleChange(p.ohms)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={ohms === p.ohms
                ? { background: "rgba(16,185,129,0.15)", borderColor: "#10B981", color: "#10B981" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Resistor value</span>
            <span className="font-mono text-primary">{ohms >= 1000 ? `${ohms / 1000}KΩ` : `${ohms}Ω`}</span>
          </div>
          <input
            type="range"
            min={10}
            max={10000}
            step={10}
            value={ohms}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full"
            style={{ background: `linear-gradient(to right, #10B981 ${(ohms / 10000) * 100}%, rgba(255,255,255,0.08) ${(ohms / 10000) * 100}%)` }}
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>10Ω (danger!)</span>
            <span>10KΩ (very dim)</span>
          </div>
        </div>

        {/* Circuit visual */}
        <div
          className="rounded-2xl border p-6 mb-4"
          style={{
            background: isBurned ? "rgba(239,68,68,0.06)" : isSafe ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
            borderColor: isBurned ? "rgba(239,68,68,0.3)" : isSafe ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"
          }}
        >
          <div className="flex items-center justify-center gap-3">
            {/* Battery */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-16 rounded border-2 border-secondary/40 flex flex-col items-center justify-center" style={{ background: "rgba(14,165,233,0.08)" }}>
                <span className="text-secondary text-xs font-bold">9V</span>
                <div className="mt-1 space-y-0.5">
                  <div className="w-6 h-0.5 bg-secondary/50" />
                  <div className="w-4 h-0.5 bg-secondary/30 mx-auto" />
                </div>
              </div>
              <span className="text-[9px] text-white/25">Battery</span>
            </div>

            {/* Wire */}
            <div className="h-0.5 w-4" style={{ background: isBurned ? "#EF4444" : "#10B981" }} />

            {/* Resistor */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-7 rounded border-2 border-orange-400/50 flex items-center justify-center gap-0.5" style={{ background: "rgba(249,115,22,0.1)" }}>
                <div className="w-2 h-4 rounded-sm bg-orange-500/70" />
                <div className="w-2 h-4 rounded-sm bg-red-500/70" />
                <div className="w-2 h-4 rounded-sm bg-orange-700/70" />
              </div>
              <span className="text-[9px] text-orange-400">{ohms >= 1000 ? `${ohms / 1000}KΩ` : `${ohms}Ω`}</span>
            </div>

            {/* Wire */}
            <div className="h-0.5 w-4" style={{ background: isBurned ? "#EF4444" : "#10B981" }} />

            {/* LED */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <polygon points="8,6 30,20 8,34" fill={ledColor} opacity={isBurned ? 0.3 : ledGlow * 0.7 + 0.3} />
                  <line x1="30" y1="12" x2="30" y2="28" stroke={ledColor} strokeWidth="3" opacity={isBurned ? 0.2 : 0.8} />
                  <line x1="30" y1="20" x2="40" y2="20" stroke={ledColor} strokeWidth="1.5" opacity={0.5} />
                  <line x1="8" y1="20" x2="0" y2="20" stroke={ledColor} strokeWidth="1.5" opacity={0.5} />
                </svg>
                {isSafe && !isBurned && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${ledColor}${Math.round(ledGlow * 80).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
                      animation: "pulse-glow 1.5s ease-in-out infinite",
                    }}
                  />
                )}
                {isBurned && (
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    💥
                  </div>
                )}
              </div>
              <span className="text-[9px] text-white/25">LED</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <motion.div
          key={isBurned ? "burned" : isSafe ? "safe" : "dim"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border p-4"
          style={{
            background: isBurned ? "rgba(239,68,68,0.08)" : isSafe ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.03)",
            borderColor: isBurned ? "rgba(239,68,68,0.3)" : isSafe ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{isBurned ? "💥" : isBright ? "🔆" : isDim ? "🔅" : isSafe ? "✅" : "⚠️"}</span>
            <p className="text-sm font-bold" style={{ color: isBurned ? "#EF4444" : isSafe ? "#10B981" : "rgba(255,255,255,0.6)" }}>
              {isBurned ? "LED BURNED! Too much current." : isBright ? "LED glowing brightly — safe!" : isDim ? "LED very dim — needs lower resistance." : "LED on and safe."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2 text-center">
            <div>
              <p className="text-base font-bold font-mono" style={{ color: isBurned ? "#EF4444" : "#10B981" }}>{current_mA.toFixed(1)}mA</p>
              <p className="text-[10px] text-white/30">Current</p>
            </div>
            <div>
              <p className="text-base font-bold font-mono text-secondary">{VF}V</p>
              <p className="text-[10px] text-white/30">LED voltage</p>
            </div>
            <div>
              <p className="text-base font-bold font-mono text-orange-400">{(SUPPLY - VF).toFixed(1)}V</p>
              <p className="text-[10px] text-white/30">Across resistor</p>
            </div>
          </div>
          {!isBurned && (
            <p className="text-[10px] text-white/25 mt-2 font-mono text-center">
              I = (9V − 2V) / {ohms}Ω = {current_mA.toFixed(2)}mA
            </p>
          )}
          {presets.find((p) => p.ohms === ohms) && (
            <p className="text-xs text-white/40 mt-2 text-center italic">&quot;{presets.find((p) => p.ohms === ohms)!.note}&quot;</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
