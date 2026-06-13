"use client";

import { motion } from "framer-motion";

const takeaways = [
  "Current is the flow of electrons through a conductor",
  "Measured in Amperes (A), symbolised by I",
  "More electrons per second = Higher current",
  "Current flows from positive to negative terminal (conventional)",
  "Without current, no device can function",
];

export default function KeyTakeaways() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#10</p>
        <h2 className="text-2xl font-bold text-white">Key Takeaways</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        {takeaways.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09, duration: 0.35 }}
            className="flex items-start gap-3 rounded-xl border border-white/5 p-3.5"
            style={{ background: "#18181B" }}
          >
            <div
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: "rgba(16,185,129,0.15)", border: "1.5px solid rgba(16,185,129,0.35)" }}
            >
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 7L9 1" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-white/75 leading-snug">{t}</p>
          </motion.div>
        ))}

        {/* Bonus formula card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-primary/22 p-5 text-center"
          style={{ background: "rgba(16,185,129,0.06)" }}
        >
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">
            Remember
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-white mb-1">
            I = Q / t
          </p>
          <p className="text-xs text-white/42">
            Current (A) = Charge (coulombs) ÷ Time (seconds)
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
