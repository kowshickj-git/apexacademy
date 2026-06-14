"use client";

import { motion } from "framer-motion";

const uses = [
  { task: "Choose the right resistor for an LED", how: "R = (V_supply − V_LED) ÷ I_LED", example: "(9V − 2V) ÷ 0.02A = 350Ω → use 470Ω" },
  { task: "Calculate current draw to size a battery", how: "I = V ÷ R_total", example: "I = 12V ÷ 24Ω = 0.5A → battery must handle 0.5A" },
  { task: "Find voltage drop across a component", how: "V = I × R", example: "0.02A × 220Ω = 4.4V drops across resistor" },
  { task: "Design a voltage divider for a sensor", how: "V_out = V_in × R2 ÷ (R1 + R2)", example: "Built from Ohm's Law applied twice in series" },
  { task: "Size a power supply for a product", how: "P = V × I = V² ÷ R = I² × R", example: "9V × 0.5A = 4.5W — pick a 5W supply" },
  { task: "Protect a microcontroller GPIO pin", how: "R = V ÷ I_max_pin", example: "5V ÷ 0.04A = 125Ω — use 150Ω series resistor" },
];

export default function EngineeringInsight() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 17 · Engineering</p>
        <h2 className="text-xl font-bold mb-1">How Engineers Use Ohm&apos;s Law</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Professional electronics engineers apply Ohm&apos;s Law dozens of times per day. Here are six tasks where it&apos;s the first tool they reach for.
        </p>

        <div className="space-y-2.5">
          {uses.map((u, i) => (
            <motion.div
              key={u.task}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="rounded-xl border border-white/6 p-4"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-primary">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white/75 mb-1">{u.task}</p>
                  <p className="text-xs font-mono text-primary/80 mb-1">{u.how}</p>
                  <p className="text-[11px] text-white/35 font-mono">{u.example}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-5 p-4 rounded-xl border border-primary/15 flex gap-3"
          style={{ background: "rgba(16,185,129,0.05)" }}
        >
          <span className="text-lg">🎓</span>
          <p className="text-xs text-white/50 leading-relaxed">
            <strong className="text-white/75">Engineering reality:</strong> Ohm&apos;s Law alone won&apos;t design a complete product — but without it, you can&apos;t start.
            It is the prerequisite for understanding capacitors, transistors, amplifiers, and power electronics.
            Everything in Lesson 6 onward builds directly on what you learned here.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
