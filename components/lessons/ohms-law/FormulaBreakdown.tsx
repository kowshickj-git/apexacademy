"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variables = [
  {
    sym: "V",
    name: "Voltage",
    unit: "Volts (V)",
    color: "#EAB308",
    emoji: "🔋",
    def: "The electrical pressure that pushes electrons through a circuit. Produced by batteries, power supplies, or generators.",
    range: "Common ranges: 1.5V (AA battery) → 5V (USB) → 12V (car) → 230V (mains)",
    examples: ["AA battery: 1.5V", "USB port: 5V", "Car battery: 12V", "Mains socket: 230V"],
    formula: "V = I × R",
    mnemonic: "V is the push — how hard electrons are shoved",
  },
  {
    sym: "I",
    name: "Current",
    unit: "Amperes (A) or milliamps (mA)",
    color: "#0EA5E9",
    emoji: "⚡",
    def: "The flow rate of electric charge — how many electrons pass a point per second. 1 Ampere = 6.24 × 10¹⁸ electrons per second.",
    range: "Common ranges: 1mA (LED) → 500mA (phone charging) → 10A (laptop) → 100A (car starter)",
    examples: ["LED: 10–20mA", "Phone charger: 500mA–2A", "Laptop: 3–5A", "Electric car: 100–500A"],
    formula: "I = V / R",
    mnemonic: "I is the flow — how many electrons are moving",
  },
  {
    sym: "R",
    name: "Resistance",
    unit: "Ohms (Ω)",
    color: "#F97316",
    emoji: "🚧",
    def: "Opposition to current flow. Caused by atoms in the material colliding with electrons. All materials except superconductors have resistance.",
    range: "Common ranges: 0.01Ω (wire) → 220Ω (LED resistor) → 10KΩ (pull-up) → 1MΩ (high impedance)",
    examples: ["Wire: 0.01–1Ω", "LED resistor: 220Ω", "Pull-up: 10KΩ", "Sensor bias: 100KΩ"],
    formula: "R = V / I",
    mnemonic: "R is the fight — how hard the material resists flow",
  },
];

export default function FormulaBreakdown() {
  const [selected, setSelected] = useState(0);
  const v = variables[selected];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7 · Deep Dive</p>
        <h2 className="text-xl font-bold mb-1">What Does Each Variable Mean?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Click each variable to explore its full meaning, units, real-world ranges, and how to solve for it.
        </p>

        {/* Variable selector */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {variables.map((vr, i) => (
            <button
              key={vr.sym}
              onClick={() => setSelected(i)}
              className="rounded-2xl border p-4 text-center transition-all"
              style={selected === i
                ? { background: `${vr.color}18`, borderColor: vr.color + "60" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }
              }
            >
              <p className="text-3xl font-black font-mono mb-1" style={{ color: vr.color }}>{vr.sym}</p>
              <p className="text-[11px] text-white/50">{vr.name}</p>
              <p className="text-[9px] text-white/25 mt-0.5 font-mono">{vr.unit.split(" ")[0]}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: `${v.color}25` }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-white/5" style={{ background: `${v.color}0c` }}>
              <div className="text-3xl">{v.emoji}</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-2xl font-black font-mono" style={{ color: v.color }}>{v.sym}</span>
                  <h3 className="text-base font-bold text-white/85">{v.name}</h3>
                </div>
                <p className="text-[10px] text-white/30 font-mono">{v.unit}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-white/25 mb-0.5">Solve for {v.sym}</p>
                <p className="text-base font-black font-mono" style={{ color: v.color }}>{v.formula}</p>
              </div>
            </div>

            {/* Definition */}
            <div className="p-5 border-b border-white/5" style={{ background: "rgba(255,255,255,0.015)" }}>
              <p className="text-xs text-white/55 leading-relaxed mb-3">{v.def}</p>
              <div
                className="text-xs px-3 py-2 rounded-xl border"
                style={{ background: `${v.color}0d`, borderColor: `${v.color}25`, color: v.color }}
              >
                💡 {v.mnemonic}
              </div>
            </div>

            {/* Examples */}
            <div className="p-5 border-b border-white/5">
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3 font-semibold">Real-world values</p>
              <div className="grid grid-cols-2 gap-2">
                {v.examples.map((ex) => (
                  <div key={ex} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: v.color }} />
                    <span className="text-white/45">{ex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Range */}
            <div className="p-5">
              <p className="text-xs text-white/35 leading-relaxed">{v.range}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
