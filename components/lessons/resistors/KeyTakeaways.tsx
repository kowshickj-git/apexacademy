"use client";

import { motion } from "framer-motion";

const takeaways = [
  { text: "A resistor is a physical component that opposes current flow, measured in Ohms (Ω)", color: "#10B981" },
  { text: "Resistance is the property; a resistor is the physical device — they are different things", color: "#0EA5E9" },
  { text: "Color bands encode resistance value: Digit 1 · Digit 2 · Multiplier · Tolerance", color: "#8B5CF6" },
  { text: "Always use a resistor to protect LEDs — 220Ω for 5V, 470Ω for 9V is a safe starting point", color: "#F97316" },
  { text: "7 types exist: Fixed, Variable, Potentiometer, Thermistor, LDR, SMD, and Power resistors", color: "#EC4899" },
  { text: "Resistors are in every device you own — your phone alone has 400–600 of them", color: "#EAB308" },
];

export default function KeyTakeaways() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 14</p>
        <h2 className="text-xl font-bold mb-6">Key Takeaways</h2>

        <div className="space-y-2.5">
          {takeaways.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${t.color}18`, borderColor: `${t.color}45` }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke={t.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-white/55 leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
