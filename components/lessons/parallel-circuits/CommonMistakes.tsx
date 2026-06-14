"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const mistakes = [
  {
    wrong: "\"Voltage divides in parallel\"",
    reality: "Voltage is SAME across all branches",
    detail:
      "This is series circuits! In parallel, every branch is directly connected across the supply. V₁ = V₂ = V₃ = V_supply. No voltage dividing happens.",
    icon: "⚡",
  },
  {
    wrong: "\"Current is the same in all branches\"",
    reality: "Current SPLITS based on each branch's resistance",
    detail:
      "Same current everywhere is true for SERIES circuits. In parallel, each branch independently draws I = V_supply / R_branch. Lower resistance = MORE current.",
    icon: "〰️",
  },
  {
    wrong: "\"Adding branches doesn't affect other branches\"",
    reality: "Partially correct — but total current increases!",
    detail:
      "Each existing branch is unaffected (same V, same I). But the TOTAL current drawn from the supply increases. You add load to your source. This can trip a fuse!",
    icon: "⚠️",
  },
  {
    wrong: "\"Parallel resistance formula is R₁+R₂+R₃\"",
    reality: "Use the RECIPROCAL formula: 1/R_eq = 1/R₁+1/R₂+1/R₃",
    detail:
      "R₁+R₂+R₃ is the SERIES formula. For parallel, you add conductances (1/R). R_eq is always LESS than the smallest resistor — not more!",
    icon: "🔢",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">
            Common Mistakes
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Don&apos;t Fall Into These Traps</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          These errors trip up beginners — and even some experienced engineers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mistakes.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 border border-red-500/15 overflow-hidden relative"
              style={{ background: "rgba(239,68,68,0.05)" }}
            >
              {/* Red top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(to right, #EF4444, rgba(239,68,68,0))" }}
              />

              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: "rgba(239,68,68,0.12)" }}
                >
                  {m.icon}
                </div>
                <div className="flex-1">
                  {/* Wrong belief */}
                  <div
                    className="text-xs font-mono mb-2 line-through opacity-60"
                    style={{ color: "#F87171" }}
                  >
                    {m.wrong}
                  </div>

                  {/* Reality */}
                  <div className="text-sm font-bold text-white mb-2">{m.reality}</div>

                  {/* Detail */}
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>
                    {m.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
