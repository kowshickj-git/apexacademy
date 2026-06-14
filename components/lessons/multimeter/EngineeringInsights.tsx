"use client";

import { motion } from "framer-motion";

const insights = [
  {
    icon: "🔍",
    title: "How Engineers Debug Circuits",
    body: "First, check power (voltage). Then check current. Then check resistance. Start from the source and work toward the load — this systematic approach finds faults in minutes instead of hours.",
  },
  {
    icon: "⚖️",
    title: "DMM vs Analog Meter",
    body: "Digital (DMM) is more accurate and reads to 4 decimal places. Analog meters are useful for observing rapid fluctuations where a needle gives instant visual feedback. Most engineers use DMMs.",
  },
  {
    icon: "💰",
    title: "The €15 vs €150 Multimeter",
    body: "A budget DMM is fine for learning and hobbyist work. Pro-grade meters (Fluke, Keysight) handle 1000V CAT III, go to 6 significant figures, and are built to survive industrial environments. Both measure the same things.",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 9 · Pro Knowledge
        </p>
        <h2 className="text-xl font-bold mb-6">Engineering Insights</h2>

        <div className="space-y-3">
          {insights.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/8 p-4 flex gap-4"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="text-2xl shrink-0">{ins.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-white/80 mb-1" style={{ color: "#A78BFA" }}>
                  {ins.title}
                </h3>
                <p className="text-xs text-white/45 leading-relaxed">{ins.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
