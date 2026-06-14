"use client";

import { motion } from "framer-motion";

const facts = [
  {
    icon: "📱",
    headline: "Your phone has ~500 resistors",
    detail: "A modern smartphone contains 400–600 resistors in its tiny PCB. They manage everything from display brightness to microphone bias.",
    color: "#10B981",
  },
  {
    icon: "💻",
    headline: "A laptop has over 1,000 resistors",
    detail: "Laptop motherboards use thousands of resistors for power delivery, data signal integrity, and protecting sensitive components from voltage spikes.",
    color: "#0EA5E9",
  },
  {
    icon: "🌍",
    headline: "1 trillion resistors made per year",
    detail: "The world produces over 1,000,000,000,000 resistors annually — more than any other electronic component on the planet.",
    color: "#8B5CF6",
  },
  {
    icon: "💡",
    headline: "A resistor can save your LED in 0.001s",
    detail: "Without a resistor, a 5V LED circuit pushes 500mA — 25× the safe limit. The LED fails in under 1 millisecond. A 220Ω resistor drops it to a safe 18mA.",
    color: "#F97316",
  },
  {
    icon: "❄️",
    headline: "Superconductors have 0Ω resistance",
    detail: "At near absolute zero (−273°C), some materials become superconductors with exactly 0Ω resistance. Electrons flow forever with no energy loss.",
    color: "#06B6D4",
  },
];

export default function FunFacts() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 12</p>
        <h2 className="text-xl font-bold mb-6">Fun Facts About Resistors</h2>

        <div className="space-y-3">
          {facts.map((f, i) => (
            <motion.div
              key={f.headline}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="flex gap-4 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0"
                style={{ background: `${f.color}15`, borderColor: `${f.color}30` }}
              >
                {f.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5" style={{ color: f.color }}>{f.headline}</p>
                <p className="text-xs text-white/40 leading-relaxed">{f.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
