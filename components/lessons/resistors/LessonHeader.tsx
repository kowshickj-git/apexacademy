"use client";

import { motion } from "framer-motion";

const objectives = [
  "Understand what a resistor is and why it exists",
  "Learn the difference between resistance and a resistor",
  "Read resistor color codes to find their values",
  "Identify 7 types of resistors and their uses",
  "See how resistors protect components like LEDs",
  "Explore where resistors appear in everyday devices",
  "Avoid common beginner mistakes with resistors",
  "Feel confident naming, reading, and using resistors",
];

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 pt-10 pb-8 border-b border-white/5">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-4"
        >
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-mono"
            style={{ background: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.25)", color: "#0EA5E9" }}
          >
            Lesson 04 · Electronics
          </span>
          <span className="text-[10px] text-white/25">Beginner · ~10 min · 120 XP</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2"
        >
          What is a{" "}
          <span style={{ color: "#0EA5E9" }}>Resistor?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-white/50 text-base mb-6 leading-relaxed"
        >
          Resistors are the most common component in electronics. Every circuit has them.
          They control current, set voltage levels, and protect fragile components from burning out.
        </motion.p>

        {/* Reward badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
          style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#10B981">
            <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
          </svg>
          <span className="text-xs text-primary font-semibold">Complete to earn 120 XP + Resistor Badge</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3 font-semibold">What you&apos;ll learn</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="rgba(14,165,233,0.3)" />
                  <path d="M3.5 6L5.5 8L8.5 4" stroke="#0EA5E9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-white/50 leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
