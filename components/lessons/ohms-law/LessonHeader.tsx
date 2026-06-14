"use client";

import { motion } from "framer-motion";

const objectives = [
  "Understand what Ohm's Law is and why it matters",
  "Know the formula V = I × R by heart",
  "Calculate Voltage, Current, or Resistance given the other two",
  "Use the Ohm's Law triangle to rearrange the formula",
  "See how the law applies in real circuits and products",
  "Solve guided step-by-step circuit problems",
  "Avoid the most common beginner formula mistakes",
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
            style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.25)", color: "#10B981" }}
          >
            Lesson 05 · Electronics
          </span>
          <span className="text-[10px] text-white/25">Beginner–Intermediate · ~12 min · 165 XP</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2"
        >
          What is{" "}
          <span style={{ color: "#10B981" }}>Ohm&apos;s Law?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-white/50 text-base mb-6 leading-relaxed"
        >
          The most powerful equation in electronics. Three variables — Voltage, Current, and Resistance —
          are always connected by one simple law: <strong className="text-white">V = I × R</strong>.
          Once you understand this, you can analyze any circuit.
        </motion.p>

        {/* Formula preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.13 }}
          className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl border border-primary/25 mb-6"
          style={{ background: "rgba(16,185,129,0.07)" }}
        >
          <div className="text-center">
            <p className="text-2xl font-black text-primary font-mono">V = I × R</p>
            <p className="text-[10px] text-white/30 mt-0.5">Volts = Amperes × Ohms</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex gap-4 text-center text-xs">
            <div><p className="font-bold text-yellow-400">V</p><p className="text-white/30">Voltage</p></div>
            <div><p className="font-bold text-secondary">I</p><p className="text-white/30">Current</p></div>
            <div><p className="font-bold text-orange-400">R</p><p className="text-white/30">Resistance</p></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3 font-semibold">What you&apos;ll learn</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="rgba(16,185,129,0.3)" />
                  <path d="M3.5 6L5.5 8L8.5 4" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-white/50 leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20"
          style={{ background: "rgba(16,185,129,0.06)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#10B981">
            <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
          </svg>
          <span className="text-xs text-primary font-semibold">Complete to earn 165 XP + Ohm&apos;s Law Badge</span>
        </motion.div>
      </div>
    </section>
  );
}
