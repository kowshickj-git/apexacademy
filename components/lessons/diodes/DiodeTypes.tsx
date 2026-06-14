"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const types = [
  {
    name: "Rectifier Diode",
    icon: "⚡",
    example: "1N4007",
    color: "#A78BFA",
    use: "Converts AC to DC in power supplies. Most common general-purpose diode.",
    vf: "0.6–0.7V",
    note: "Handles up to 1A current, 1000V reverse voltage. Found in every charger.",
  },
  {
    name: "Zener Diode",
    icon: "🎯",
    example: "1N4733",
    color: "#0EA5E9",
    use: "Regulates voltage at a precise level. Conducts in reverse at its 'breakdown' voltage.",
    vf: "Varies (3.3V–100V)",
    note: "Used in voltage regulators. The Zener symbol has bent bar ends (like a Z).",
  },
  {
    name: "Schottky Diode",
    icon: "🚀",
    example: "1N5819",
    color: "#F97316",
    use: "Ultra-fast switching, very low forward voltage. Used in high-speed digital circuits.",
    vf: "0.15–0.45V",
    note: "Metal-semiconductor junction. No P-N junction = faster, lower drop. Great for solar panels.",
  },
  {
    name: "LED",
    icon: "💡",
    example: "Standard 5mm",
    color: "#EAB308",
    use: "Emits light when forward biased. The most visible diode in everyday electronics.",
    vf: "1.8–3.6V (colour-dependent)",
    note: "Not used for rectification — optimised for light output. You'll study this in Lesson 08.",
  },
  {
    name: "Photodiode",
    icon: "📷",
    example: "BPW34",
    color: "#10B981",
    use: "Converts light into electric current. Used in cameras, solar cells, and remote controls.",
    vf: "Reverse biased for sensing",
    note: "Works opposite to an LED — instead of current in → light out, it's light in → current out.",
  },
  {
    name: "Bridge Rectifier",
    icon: "🌉",
    example: "W10M (4 diodes)",
    color: "#EF4444",
    use: "Four diodes arranged to convert full AC waveform to DC (full-wave rectification).",
    vf: "Two diode drops = ~1.4V",
    note: "Used inside every mains power supply. More efficient than half-wave rectification.",
  },
];

export default function DiodeTypes() {
  const [active, setActive] = useState(0);
  const t = types[active];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7 · Types</p>
        <h2 className="text-xl font-bold mb-1">Types of Diodes</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          The diode family has many specialised members. Each is optimised for a different job — speed, voltage regulation, light, or brute-force current handling.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {types.map((tp, i) => (
            <button
              key={tp.name}
              onClick={() => setActive(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all"
              style={active === i
                ? { background: `${tp.color}18`, borderColor: tp.color + "50", color: tp.color }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {tp.icon} {tp.name}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-6"
            style={{ background: `${t.color}0c`, borderColor: t.color + "30" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${t.color}18`, border: `1px solid ${t.color}35` }}
              >
                {t.icon}
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: t.color }}>{t.name}</p>
                <p className="text-xs text-white/35 font-mono">e.g. {t.example}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-white/30 uppercase font-mono mb-1">Primary Use</p>
                <p className="text-sm text-white/65 leading-relaxed">{t.use}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-mono mb-1">Forward Voltage</p>
                  <p className="text-sm font-mono" style={{ color: t.color }}>{t.vf}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[10px] text-white/30 uppercase font-mono mb-1">Key Insight</p>
                <p className="text-xs text-white/50 leading-relaxed">{t.note}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
