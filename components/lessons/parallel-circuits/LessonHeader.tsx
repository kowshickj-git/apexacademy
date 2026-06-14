"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const stats = [
  { icon: "⏱", label: "~12 min" },
  { icon: "📚", label: "13 topics" },
  { icon: "🎯", label: "200 XP" },
  { icon: "🔥", label: "Beginner → Engineering" },
];

export default function LessonHeader() {
  return (
    <section className="px-4 pt-10 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded-full border"
            style={{
              color: "#6366F1",
              borderColor: "rgba(99,102,241,0.3)",
              background: "rgba(99,102,241,0.08)",
              letterSpacing: "0.1em",
            }}
          >
            LESSON 12
          </span>
          <span className="text-xs text-white/25">Final Lesson · Electronics Fundamentals</span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-black mb-3 leading-tight"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #A5B4FC 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Parallel Circuits
          <br />
          Fundamentals
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium mb-6" style={{ color: "rgba(240,240,245,0.55)" }}>
          Multiple paths. Split current. Independent branches.
        </p>

        {/* Stat badges */}
        <div className="flex flex-wrap gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 text-sm"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(240,240,245,0.7)" }}
            >
              <span>{stat.icon}</span>
              <span className="font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
