"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    title: "Confusing Voltage and Current",
    wrong: "\"The voltage flowing through the resistor is 2A\"",
    right: "\"The current flowing through the resistor is 2A\" and \"The voltage across it is 10V\"",
    rule: "Voltage is measured ACROSS components. Current flows THROUGH components.",
    icon: "⚡",
    color: "#EF4444",
  },
  {
    title: "Using the wrong formula",
    wrong: "If R = 10Ω and I = 2A, writing: V = R ÷ I = 5V",
    right: "V = I × R = 2A × 10Ω = 20V",
    rule: "Use the triangle: cover V → you see I × R underneath. Always multiply.",
    icon: "📐",
    color: "#F97316",
  },
  {
    title: "Mixing milliamps with amps",
    wrong: "V = I × R = 20mA × 220Ω = 4,400V (wrong!)",
    right: "Convert first: 20mA = 0.020A → V = 0.020 × 220 = 4.4V ✓",
    rule: "Always convert mA to A before calculating. 1A = 1000mA, so 1mA = 0.001A.",
    icon: "🔢",
    color: "#EAB308",
  },
  {
    title: "Confusing Resistance and Resistor",
    wrong: "\"Resistance is 220Ω\" when holding a 220Ω carbon film resistor",
    right: "\"The resistor has a resistance of 220Ω\" — the component has the property.",
    rule: "Resistance is the property. A Resistor is the physical component with that property.",
    icon: "🔩",
    color: "#8B5CF6",
  },
  {
    title: "Forgetting units in the answer",
    wrong: "V = 5, I = 2 (no units!)",
    right: "V = 5V (Volts), I = 2A (Amperes), R = 2.5Ω (Ohms)",
    rule: "Always include units. A number without a unit is meaningless in electronics.",
    icon: "🏷️",
    color: "#0EA5E9",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 14</p>
        <h2 className="text-xl font-bold mb-1">Common Mistakes</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          These five mistakes cause 90% of Ohm&apos;s Law errors for beginners. Know them before you make them.
        </p>

        <div className="space-y-3">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: `${m.color}20` }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: `${m.color}0d`, borderColor: `${m.color}15` }}>
                <span className="text-lg">{m.icon}</span>
                <p className="text-sm font-semibold" style={{ color: m.color }}>{m.title}</p>
              </div>
              <div className="p-4 space-y-2" style={{ background: "rgba(255,255,255,0.01)" }}>
                <div className="flex gap-2">
                  <span className="text-[10px] text-red-400 font-semibold uppercase tracking-widest mt-px w-10 shrink-0">✗ Bad</span>
                  <p className="text-xs text-white/40 font-mono leading-relaxed italic">{m.wrong}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] text-primary font-semibold uppercase tracking-widest mt-px w-10 shrink-0">✓ Good</span>
                  <p className="text-xs text-white/60 font-mono leading-relaxed">{m.right}</p>
                </div>
                <div className="flex gap-2 pt-1 border-t border-white/4">
                  <span className="text-[10px] text-white/20 font-semibold uppercase tracking-widest mt-px w-10 shrink-0">Rule</span>
                  <p className="text-xs text-white/40 leading-relaxed">{m.rule}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
