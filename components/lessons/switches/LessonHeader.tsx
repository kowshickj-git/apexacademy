"use client";

import { motion } from "framer-motion";

const CYAN = "#06B6D4";

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 pt-12 pb-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="text-[10px] font-mono uppercase tracking-widest mb-3 font-semibold"
          style={{ color: CYAN }}
        >
          Lesson 13
        </p>

        <h1
          className="text-4xl sm:text-5xl font-black mb-3 leading-tight"
          style={{
            background: `linear-gradient(135deg, ${CYAN} 0%, #0891b2 60%, #06b6d4 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Switches &amp; Push Buttons
        </h1>

        <p className="text-base text-white/50 mb-7 max-w-xl leading-relaxed">
          Open. Close. Control. The gatekeepers of every circuit.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: "⏱", label: "~10 min" },
            { icon: "📚", label: "14 topics" },
            { icon: "🎯", label: "200 XP" },
            { icon: "🔥", label: "Beginner → Engineering" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{ background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.18)", color: "rgba(240,240,245,0.65)" }}
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
