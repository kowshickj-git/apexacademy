"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const concepts = [
  {
    icon: "⚡",
    title: "Multiple Paths",
    desc: "Current has many routes to travel. Each branch is a separate path for electricity to flow.",
  },
  {
    icon: "🔋",
    title: "Same Voltage",
    desc: "Every branch sees the full supply voltage. All components receive the same potential difference.",
  },
  {
    icon: "〰️",
    title: "Split Current",
    desc: "Total current equals the sum of all branch currents. More branches = more total current drawn.",
  },
];

export default function BigIdea() {
  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/8 overflow-hidden"
        style={{ background: "rgba(99,102,241,0.05)" }}
      >
        {/* Road analogy header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "rgba(99,102,241,0.2)" }}
            >
              💡
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6366F1" }}>
              The Big Idea
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">The Road Analogy</h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.55)" }}>
            One road causes traffic jams. Multiple roads split the traffic.
          </p>
        </div>

        {/* Visual comparison */}
        <div className="p-6 border-b border-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Single road (series-like) */}
            <div className="rounded-2xl p-4 border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-xs font-bold text-white/40 mb-3 uppercase tracking-widest">Single Path (Series)</p>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-2 h-10 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #F97316, rgba(249,115,22,0.3))" }}
                />
                <div
                  className="flex items-center justify-center w-16 h-8 rounded-lg text-xs font-bold text-orange-400 border border-orange-500/30"
                  style={{ background: "rgba(249,115,22,0.1)" }}
                >
                  BLOCKED
                </div>
                <div
                  className="w-2 h-10 rounded-full opacity-20"
                  style={{ background: "#F97316" }}
                />
              </div>
              <p className="text-xs text-center mt-2" style={{ color: "rgba(240,240,245,0.4)" }}>
                One path fails → everything stops
              </p>
            </div>

            {/* Multiple roads (parallel) */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: "rgba(99,102,241,0.08)",
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <p className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "#6366F1" }}>
                Multiple Paths (Parallel)
              </p>
              <div className="flex items-start justify-center gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{ scaleY: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                      className="w-2 h-10 rounded-full"
                      style={{ background: "linear-gradient(to bottom, #6366F1, rgba(99,102,241,0.3))" }}
                    />
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: "rgba(99,102,241,0.2)", color: "#818CF8" }}
                    >
                      ➜
                    </div>
                    <motion.div
                      animate={{ scaleY: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 + 0.2 }}
                      className="w-2 h-10 rounded-full"
                      style={{ background: "linear-gradient(to bottom, rgba(99,102,241,0.3), #6366F1)" }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-center mt-2" style={{ color: "rgba(99,102,241,0.9)" }}>
                Each path flows freely!
              </p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="px-6 py-4 border-b border-white/5">
          <blockquote
            className="text-base sm:text-lg font-semibold leading-relaxed text-center"
            style={{ color: "rgba(240,240,245,0.85)" }}
          >
            &ldquo;In a parallel circuit, electricity splits into multiple paths —
            each branch operates{" "}
            <span style={{ color: "#6366F1" }}>independently</span>.&rdquo;
          </blockquote>
        </div>

        {/* 3 concept cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {concepts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="rounded-2xl p-4 border border-white/6"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.5)" }}>
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
