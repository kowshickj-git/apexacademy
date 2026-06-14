"use client";

import { motion } from "framer-motion";

const insights = [
  {
    icon: "⚡",
    title: "Why Breadboards Beat Soldering (for prototypes)",
    body: "Mistakes cost 5 seconds to fix, not 20 minutes of desoldering. The fastest path from idea to working circuit. Engineers prototype on breadboards before ever touching a soldering iron.",
    accent: "#14B8A6",
  },
  {
    icon: "🔄",
    title: "The Professional Workflow",
    body: "Breadboard prototype → Stripboard verification → PCB design → Final product. Each stage confirms the design before committing to permanent or expensive manufacturing.",
    accent: "#0EA5E9",
  },
  {
    icon: "⚠️",
    title: "When NOT to Use a Breadboard",
    body: "High-frequency circuits (>1MHz) — internal clips have parasitic capacitance. High-current circuits (>1A) — clips can't handle it. Final products — vibration loosens connections. But for learning? Always breadboard first.",
    accent: "#F59E0B",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 7 · Engineering Insights
        </p>
        <h2 className="text-xl font-bold mb-5">Engineering Insights</h2>

        <div className="space-y-3">
          {insights.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-4 rounded-2xl border border-white/8"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: `${ins.accent}18`, border: `1px solid ${ins.accent}30` }}
                >
                  {ins.icon}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1.5" style={{ color: ins.accent }}>{ins.title}</p>
                  <p className="text-xs text-white/45 leading-relaxed">{ins.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
