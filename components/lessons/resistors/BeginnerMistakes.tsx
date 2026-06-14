"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    mistake: "Connecting an LED without a resistor",
    why: "Without a current-limiting resistor, an LED will draw too much current and burn out in milliseconds — sometimes dramatically.",
    fix: "Always use a resistor in series with an LED. Use 220Ω for 5V, 470Ω for 9V.",
    icon: "💥",
    color: "#EF4444",
  },
  {
    mistake: "Reading color bands from the wrong end",
    why: "Resistor color codes are read left to right, with the tolerance band (gold/silver) on the right. Starting from the wrong end gives a completely wrong value.",
    fix: "Hold the resistor so the gold or silver band is on your right. Read left to right.",
    icon: "🔄",
    color: "#F97316",
  },
  {
    mistake: "Confusing KΩ and Ω on schematics",
    why: "A 10KΩ resistor is 10,000× bigger than a 10Ω resistor. Swapping them can destroy a component or make a circuit completely non-functional.",
    fix: "Always double-check the unit. K means ×1,000. M means ×1,000,000.",
    icon: "⚠️",
    color: "#EAB308",
  },
  {
    mistake: "Ignoring power rating",
    why: "Every resistor has a power rating (usually 1/4W for common types). If too much current flows, the resistor overheats and can catch fire.",
    fix: "Calculate power: P = I² × R. If result exceeds 0.25W, use a higher-rated resistor.",
    icon: "🔥",
    color: "#F97316",
  },
];

export default function BeginnerMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 13</p>
        <h2 className="text-xl font-bold mb-1">Common Beginner Mistakes</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          These four mistakes account for 80% of beginner circuit failures involving resistors. Know them before you make them.
        </p>

        <div className="space-y-4">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.mistake}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: `${m.color}25` }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: `${m.color}0d`, borderColor: `${m.color}18` }}>
                <span className="text-lg">{m.icon}</span>
                <p className="text-sm font-semibold" style={{ color: m.color }}>{m.mistake}</p>
              </div>
              <div className="p-4 space-y-2" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="flex gap-2">
                  <span className="text-[10px] text-white/25 font-semibold uppercase tracking-widest mt-0.5 w-8 shrink-0">Why</span>
                  <p className="text-xs text-white/45 leading-relaxed">{m.why}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] text-primary font-semibold uppercase tracking-widest mt-0.5 w-8 shrink-0">Fix</span>
                  <p className="text-xs text-white/60 leading-relaxed">{m.fix}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
