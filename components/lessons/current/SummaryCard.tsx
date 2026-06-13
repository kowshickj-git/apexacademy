"use client";

import { motion } from "framer-motion";

const points = [
  { label: "What", text: "Flow of electrons through a conductor" },
  { label: "Unit", text: "Amperes (A), symbol I" },
  { label: "Formula", text: "I = Q ÷ t (charge per second)" },
  { label: "Direction", text: "Conventional: + to − | Actual: − to +" },
  { label: "Key rule", text: "More electrons/second = Higher current" },
];

export default function SummaryCard() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#12</p>
        <h2 className="text-2xl font-bold text-white">30-Second Revision</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="rounded-2xl border border-secondary/20 overflow-hidden" style={{ background: "#18181B" }}>
          {/* Header */}
          <div
            className="px-5 py-3 flex items-center gap-2 border-b border-secondary/12"
            style={{ background: "rgba(14,165,233,0.06)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#0EA5E9" strokeWidth="1.5" />
              <path d="M8 5v3.5l2.5 2.5" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-xs font-semibold text-secondary">Current Fundamentals — Quick Summary</p>
          </div>

          {/* Points */}
          <div className="divide-y divide-white/4">
            {points.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-3 px-5 py-3"
              >
                <span
                  className="flex-shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded self-start mt-0.5"
                  style={{
                    background: "rgba(14,165,233,0.12)",
                    color: "#0EA5E9",
                  }}
                >
                  {p.label}
                </span>
                <p className="text-sm text-white/70 leading-snug">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-white/28 pb-2">
          Lesson 2 complete! Up next: Resistance →
        </p>
      </motion.div>
    </section>
  );
}
