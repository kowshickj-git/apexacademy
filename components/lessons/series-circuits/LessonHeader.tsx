"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const STATS = [
  { icon: "⏱", label: "~12 min" },
  { icon: "📚", label: "14 topics" },
  { icon: "🎯", label: "200 XP" },
  { icon: "🔥", label: "Beginner → Engineering" },
];

export default function LessonHeader() {
  return (
    <section className="px-4 pt-10 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase"
          style={{
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.25)",
            color: "#F97316",
          }}
        >
          Lesson 11
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight"
          style={{
            background: "linear-gradient(135deg, #F97316 0%, #FB923C 40%, #FDBA74 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Series Circuits
          <br />
          Fundamentals
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.4 }}
          className="text-lg mb-8"
          style={{ color: "rgba(240,240,245,0.55)" }}
        >
          One path. Total current. Every component counts.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(240,240,245,0.7)",
              }}
            >
              <span>{stat.icon}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
