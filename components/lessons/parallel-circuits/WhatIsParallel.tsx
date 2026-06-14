"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const rules = [
  {
    num: "1",
    title: "Voltage is the Same Across All Branches",
    formula: "V₁ = V₂ = V₃ = V_supply",
    desc: "Every branch is directly connected across the supply. So each branch sees the full voltage — not a divided portion.",
    color: "#6366F1",
  },
  {
    num: "2",
    title: "Total Current = Sum of Branch Currents",
    formula: "I_total = I₁ + I₂ + I₃",
    desc: "Current splits at each junction. Each branch draws its own current based on its resistance. The total current is the sum of all branch currents (Kirchhoff's Current Law).",
    color: "#0EA5E9",
  },
  {
    num: "3",
    title: "Total Resistance is Less Than the Smallest Branch",
    formula: "1/R_eq = 1/R₁ + 1/R₂ + 1/R₃",
    desc: "Adding more parallel branches creates more paths for current, reducing total resistance. R_eq is ALWAYS less than the smallest individual branch resistor.",
    color: "#10B981",
  },
];

export default function WhatIsParallel() {
  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6366F1" }}>
            Core Concept
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mb-6">What Is a Parallel Circuit?</h2>

        {/* Branch diagram */}
        <div
          className="rounded-2xl p-5 border border-white/6 mb-6"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4 font-bold">
            Current Flow Diagram
          </p>

          {/* Visual circuit */}
          <div className="flex items-stretch gap-0 overflow-x-auto">
            {/* Left side: source + incoming current */}
            <div className="flex flex-col items-center justify-center shrink-0 mr-2">
              <div
                className="rounded-xl px-3 py-2 text-center border text-xs font-bold"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  borderColor: "rgba(99,102,241,0.35)",
                  color: "#818CF8",
                }}
              >
                <div>🔋</div>
                <div>V_s</div>
              </div>
              <div className="text-[10px] text-white/40 mt-1">Supply</div>
            </div>

            {/* Arrow in */}
            <div className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-xs font-bold"
                  style={{ color: "#6366F1" }}
                >
                  I_total →
                </motion.div>
                <div
                  className="h-[2px] w-8 rounded"
                  style={{ background: "rgba(99,102,241,0.5)" }}
                />
              </div>
            </div>

            {/* Branches */}
            <div className="flex-1 flex flex-col justify-around gap-1 min-w-[160px]">
              {["I₁ → R₁ → LED₁", "I₂ → R₂ → LED₂", "I₃ → R₃ → LED₃"].map((branch, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div
                    className="h-[2px] w-2 rounded"
                    style={{ background: "rgba(99,102,241,0.3)" }}
                  />
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                    className="flex-1 rounded-lg px-2 py-1.5 text-xs font-mono text-center border"
                    style={{
                      background: "rgba(99,102,241,0.07)",
                      borderColor: "rgba(99,102,241,0.2)",
                      color: "#A5B4FC",
                    }}
                  >
                    {branch}
                  </motion.div>
                  <div
                    className="h-[2px] w-2 rounded"
                    style={{ background: "rgba(99,102,241,0.3)" }}
                  />
                </div>
              ))}
            </div>

            {/* Arrow out */}
            <div className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                  className="text-xs font-bold"
                  style={{ color: "#10B981" }}
                >
                  → rejoins
                </motion.div>
                <div
                  className="h-[2px] w-8 rounded"
                  style={{ background: "rgba(16,185,129,0.5)" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>
            Current splits at the junction, flows through each branch independently, then rejoins
          </div>
        </div>

        {/* 3 key rules */}
        <div className="flex flex-col gap-4">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="rounded-2xl p-5 border border-white/6"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{ background: `${rule.color}22`, color: rule.color }}
                >
                  {rule.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1">{rule.title}</h3>
                  <div
                    className="inline-block font-mono text-xs px-2 py-1 rounded-lg mb-2"
                    style={{ background: `${rule.color}15`, color: rule.color }}
                  >
                    {rule.formula}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>
                    {rule.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Home wiring example */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-4 rounded-2xl p-4 border"
          style={{
            background: "rgba(99,102,241,0.07)",
            borderColor: "rgba(99,102,241,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏠</span>
            <span className="text-sm font-bold text-white">Real World: Home Wiring</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.6)" }}>
            Every outlet in your home is wired in parallel. Your TV, fridge, and lights all receive
            the same 120V (US) or 230V (Europe) independently. Turning off the TV does not affect
            the fridge — because they are on separate parallel branches!
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["📺 TV — 120V", "❄️ Fridge — 120V", "💡 Lights — 120V", "🔌 All independent"].map((item) => (
              <span
                key={item}
                className="text-[11px] px-2 py-0.5 rounded-full border"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  borderColor: "rgba(99,102,241,0.25)",
                  color: "#A5B4FC",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
