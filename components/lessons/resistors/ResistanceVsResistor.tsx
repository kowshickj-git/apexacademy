"use client";

import { motion } from "framer-motion";

const items = [
  {
    label: "Resistance",
    color: "#F97316",
    icon: "🧠",
    subtitle: "A Property / Concept",
    desc: "Resistance is the opposition to current flow. It is a property that a material can have. You cannot hold resistance in your hand — it is invisible.",
    examples: ["Rubber has high resistance", "Copper has low resistance", "A 47Ω resistor has 47 ohms of resistance"],
    unit: "Ohms (Ω)",
  },
  {
    label: "Resistor",
    color: "#0EA5E9",
    icon: "🔩",
    subtitle: "A Physical Component",
    desc: "A resistor is the actual physical device you place in a circuit. It is manufactured to have a specific resistance value. You can pick it up.",
    examples: ["A 220Ω resistor (striped cylinder)", "A potentiometer (variable dial)", "An SMD resistor (tiny surface chip)"],
    unit: "Value printed or color-coded",
  },
];

export default function ResistanceVsResistor() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 2</p>
        <h2 className="text-xl font-bold mb-1">Resistance vs. Resistor</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          These two words sound almost the same, but they mean very different things. Confusing them is the #1 beginner mistake.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.1 }}
              className="rounded-2xl border p-5"
              style={{ background: `rgba(${item.color === "#F97316" ? "249,115,22" : "14,165,233"},0.06)`, borderColor: `rgba(${item.color === "#F97316" ? "249,115,22" : "14,165,233"},0.2)` }}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold" style={{ color: item.color }}>{item.label}</h3>
                <span className="text-[10px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded-full">{item.subtitle}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-3">{item.desc}</p>
              <div className="space-y-1">
                {item.examples.map((ex) => (
                  <div key={ex} className="flex items-start gap-1.5">
                    <span className="text-white/20 text-xs mt-px">→</span>
                    <span className="text-xs text-white/40">{ex}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
                <span className="text-[10px] text-white/25">Measured as:</span>
                <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-4 p-3 rounded-xl border border-primary/15 flex items-center gap-3"
          style={{ background: "rgba(16,185,129,0.05)" }}
        >
          <span className="text-lg">💡</span>
          <p className="text-xs text-white/50 leading-relaxed">
            <strong className="text-white/80">Analogy:</strong> Resistance is like &quot;stickiness&quot; — a property of glue.
            A resistor is like a tube of glue — the physical object with that property.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
