"use client";

import { motion } from "framer-motion";

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 py-14 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-3 font-mono">
          Lesson 10 · Electronics Fundamentals
        </p>

        <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
          <span className="text-white">Multimeter</span>{" "}
          <span style={{ color: "#A78BFA" }}>Fundamentals</span>
        </h1>

        <p className="text-white/50 text-base sm:text-lg mb-8 leading-relaxed">
          Measure voltage, current, and resistance like a pro — the essential tool of every electronics engineer.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "🔬", label: "5 Simulators" },
            { icon: "❓", label: "20 Questions" },
            { icon: "⚡", label: "200 XP" },
            { icon: "⏱", label: "~10 min" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 text-xs text-white/45"
              style={{ background: "rgba(167,139,250,0.05)" }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Purple accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-8 h-px origin-left"
          style={{ background: "linear-gradient(to right, #A78BFA, transparent)" }}
        />
      </motion.div>
    </section>
  );
}
