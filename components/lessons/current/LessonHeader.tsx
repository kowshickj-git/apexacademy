"use client";

import { motion } from "framer-motion";

const objectives = [
  "Understand what electric current is",
  "Learn how electrons flow through a circuit",
  "Discover where current is used every day",
  "Visualize electron flow with interactive simulations",
  "Understand the unit Ampere and its history",
];

export default function LessonHeader() {
  return (
    <section className="px-4 pt-8 pb-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
      >
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-primary/25 font-medium text-primary" style={{ background: "rgba(16,185,129,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Beginner
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/35" style={{ background: "rgba(255,255,255,0.04)" }}>
            5 min read
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full border border-secondary/22 text-secondary" style={{ background: "rgba(14,165,233,0.08)" }}>
            Electronics
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/25 font-mono" style={{ background: "rgba(255,255,255,0.03)" }}>
            Lesson 02 / 10
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-1.5">
          What is Current?
        </h1>
        <p className="text-sm text-white/45 mb-1">
          Learn how electricity flows through a circuit.
        </p>
        <p className="text-xs text-white/25 mb-6 font-mono">
          Electronics Fundamentals · Lesson 2
        </p>

        <div className="h-px mb-5" style={{ background: "linear-gradient(to right, rgba(14,165,233,0.3), rgba(255,255,255,0.04), transparent)" }} />

        {/* Learning Objectives */}
        <div className="rounded-2xl border border-white/5 p-4" style={{ background: "#18181B" }}>
          <p className="text-[10px] text-white/28 uppercase tracking-widest font-semibold mb-3.5">
            Learning Objectives
          </p>
          <div className="space-y-2.5">
            {objectives.map((obj, i) => (
              <motion.div
                key={obj}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 + i * 0.07, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border border-secondary/30" style={{ background: "rgba(14,165,233,0.12)" }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3 6L8 1" stroke="#0EA5E9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm text-white/70 leading-tight">{obj}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
