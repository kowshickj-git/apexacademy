"use client";

import { motion } from "framer-motion";

const objectives = [
  "Understand what Resistance is",
  "Learn why resistance exists",
  "Visualize resistance with analogies",
  "Understand conductors and insulators",
  "Learn real-world applications of resistance",
];

export default function LessonHeader() {
  return (
    <section className="px-4 pt-8 pb-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-primary/30 text-primary"
            style={{ background: "rgba(16,185,129,0.1)" }}
          >
            L03 · Electronics
          </span>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 text-white/40">
            Beginner
          </span>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 text-white/40">
            7 min read
          </span>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-500/30 text-orange-400"
            style={{ background: "rgba(249,115,22,0.1)" }}
          >
            Ω Ohms
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          What is{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(to right, #10B981, #F97316)" }}
          >
            Resistance?
          </span>
        </h1>

        <p className="text-base text-white/55 mb-6 leading-relaxed">
          Learn why electricity sometimes flows easily and sometimes struggles to move — and why that struggle matters.
        </p>

        <div className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">
            Learning Objectives
          </p>
          <div className="space-y-2">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-4 h-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-white/65">{obj}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
