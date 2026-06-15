"use client";

import { motion } from "framer-motion";

const cards = [
  {
    icon: "📡",
    title: "Why Floating Pins Cause Problems",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.2)",
    content: [
      "Input pin impedance is very high (~1MΩ or more)",
      "Acts like an antenna — picks up RF interference, 50/60Hz mains hum",
      "Capacitive coupling from adjacent traces changes voltage",
      "Even human touch can drive a floating pin from LOW to HIGH",
      "Result: completely unpredictable digital reads",
    ],
  },
  {
    icon: "🔧",
    title: "Embedded Best Practices",
    color: "#10B981",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.2)",
    content: [
      "ALWAYS define pin state — never leave inputs floating",
      "Prefer `INPUT_PULLUP` for most button inputs (one line, no BOM cost)",
      "Use external pull-down for active-high signals from sensors",
      "Document logic polarity in comments: // pressed = LOW",
      "Review all GPIO during bring-up: check each pin has a defined default",
    ],
  },
  {
    icon: "🏭",
    title: "Industrial Applications",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.2)",
    content: [
      "Factory PLCs use pull-ups on ALL digital inputs by default",
      "Industrial standard: normally-closed (NC) contacts with pull-ups",
      "NC + pull-up = wire break detection (fail-safe to LOW)",
      "Emergency stop buttons are NC — opens on press = safer",
      "IEC 61131-3 standard requires defined input states",
    ],
  },
  {
    icon: "📐",
    title: "PCB Design Rule",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    content: [
      "10kΩ is the sweet spot for most applications",
      "Too low (100Ω): wastes 33–50mA when button pressed — heats up",
      "Too high (1MΩ): slow rise times, more susceptible to noise",
      "At 3.3V: 10kΩ draws only 0.33mA when button pressed",
      "Rule of thumb: pull strength < 1/10 of MCU GPIO source/sink current",
    ],
  },
];

export default function EngineeringSection() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 6 · Engineering Insights
        </p>
        <h2 className="text-xl font-bold mb-5">Engineering Perspective</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-4 rounded-2xl border"
              style={{ background: card.bg, borderColor: card.border }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{card.icon}</span>
                <h3 className="text-sm font-bold" style={{ color: card.color }}>{card.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {card.content.map((line, li) => (
                  <li key={li} className="flex items-start gap-2 text-xs text-white/50 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: card.color }}>›</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
