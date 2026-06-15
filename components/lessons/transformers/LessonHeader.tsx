"use client";

import { motion } from "framer-motion";

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 pt-12 pb-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-3 font-mono">
          Lesson 16 · Electronics Fundamentals
        </p>
        <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
          Transformers{" "}
          <span style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Fundamentals
          </span>
        </h1>
        <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-6">
          Change voltage. Transfer power. Connect the world.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "⚡", label: "5 simulators" },
            { icon: "❓", label: "20 questions" },
            { icon: "🔮", label: "200 XP" },
            { icon: "⏱", label: "~12 min" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 text-xs text-white/40"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
