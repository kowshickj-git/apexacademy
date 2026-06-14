"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const units = [
  {
    sym: "V",
    name: "Volt",
    quantity: "Voltage",
    named: "Alessandro Volta (1745–1827)",
    color: "#EAB308",
    def: "One Volt is the potential difference that drives one Ampere of current through one Ohm of resistance.",
    common: ["1.5V — AA battery", "3.3V — microcontroller logic", "5V — USB power", "12V — car battery", "230V — mains socket (UK/EU)"],
    formula: "V = I × R",
    sub: "mV (millivolts) = 0.001V · kV = 1000V",
  },
  {
    sym: "A",
    name: "Ampere",
    quantity: "Current",
    named: "André-Marie Ampère (1775–1836)",
    color: "#0EA5E9",
    def: "One Ampere is a flow of one Coulomb of charge per second — approximately 6.24 × 10¹⁸ electrons per second.",
    common: ["1–20mA — LEDs", "50mA — small sensors", "500mA–2A — phone charging", "3–5A — laptop", "10–100A — electric motor"],
    formula: "I = V / R",
    sub: "µA (microamps) = 0.000001A · mA = 0.001A",
  },
  {
    sym: "Ω",
    name: "Ohm",
    quantity: "Resistance",
    named: "Georg Simon Ohm (1789–1854)",
    color: "#F97316",
    def: "One Ohm is the resistance between two points when one Volt of potential difference drives one Ampere of current.",
    common: ["0.01–1Ω — wire/cable", "100–470Ω — LED protection", "1–10KΩ — signal pull-up", "100KΩ–1MΩ — bias/filter", "∞ — insulator (open circuit)"],
    formula: "R = V / I",
    sub: "KΩ = 1,000Ω · MΩ = 1,000,000Ω",
  },
];

export default function UnitsExplained() {
  const [selected, setSelected] = useState(0);
  const u = units[selected];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 15 · Units</p>
        <h2 className="text-xl font-bold mb-1">Units Explained</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Every quantity in Ohm&apos;s Law has a named unit. Click to explore each one.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {units.map((unit, i) => (
            <button
              key={unit.sym}
              onClick={() => setSelected(i)}
              className="rounded-2xl border py-4 text-center transition-all"
              style={selected === i
                ? { background: `${unit.color}18`, borderColor: unit.color + "55" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }
              }
            >
              <p className="text-3xl font-black font-mono mb-0.5" style={{ color: unit.color }}>{unit.sym}</p>
              <p className="text-[11px] text-white/50">{unit.name}</p>
              <p className="text-[9px] text-white/25">{unit.quantity}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: `${u.color}25` }}
          >
            <div className="px-5 py-4 border-b border-white/5" style={{ background: `${u.color}0d` }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-mono" style={{ color: u.color }}>{u.sym}</span>
                    <h3 className="text-base font-bold text-white/85">The {u.name}</h3>
                  </div>
                  <p className="text-[10px] text-white/25 mt-0.5">Named after: {u.named}</p>
                </div>
                <p className="text-sm font-black font-mono" style={{ color: u.color }}>{u.formula}</p>
              </div>
            </div>

            <div className="p-5 border-b border-white/5" style={{ background: "rgba(255,255,255,0.015)" }}>
              <p className="text-[10px] text-white/25 mb-1.5 uppercase tracking-widest font-semibold">Definition</p>
              <p className="text-xs text-white/55 leading-relaxed">{u.def}</p>
            </div>

            <div className="p-5 border-b border-white/5">
              <p className="text-[10px] text-white/25 mb-2.5 uppercase tracking-widest font-semibold">Common values</p>
              <div className="space-y-1.5">
                {u.common.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: u.color }} />
                    <span className="text-white/45">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3" style={{ background: "rgba(255,255,255,0.01)" }}>
              <p className="text-[10px] text-white/25 mb-1 font-semibold">Prefix shortcuts</p>
              <p className="text-xs text-white/40 font-mono">{u.sub}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
