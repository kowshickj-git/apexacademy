"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const MISTAKES = [
  {
    id: 1,
    wrong: "Current changes between components in a series circuit.",
    right: "Current is identical everywhere. I₁ = I₂ = I₃ = I_total. Every ampere that leaves the battery flows through every single component.",
    wrongLabel: "Common Belief",
    rightLabel: "Reality",
  },
  {
    id: 2,
    wrong: "Voltage stays the same across every component.",
    right: "Voltage drops across each component proportionally to its resistance. A 300Ω resistor gets 3× the voltage of a 100Ω resistor (voltage divider rule).",
    wrongLabel: "Common Belief",
    rightLabel: "Reality",
  },
  {
    id: 3,
    wrong: "Adding a component to a series circuit only affects that component.",
    right: "Adding any component increases total resistance, which decreases current for the ENTIRE circuit. Every component is affected.",
    wrongLabel: "Common Belief",
    rightLabel: "Reality",
  },
  {
    id: 4,
    wrong: "A single broken wire in one small section doesn't affect other parts.",
    right: "One open circuit anywhere = zero current everywhere. The entire circuit goes dead. There is only ONE path, so any break stops all current.",
    wrongLabel: "Common Belief",
    rightLabel: "Reality",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            Common Mistakes
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            These misconceptions trip up beginners and even experienced engineers.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {MISTAKES.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {/* Wrong belief */}
              <div
                className="px-5 py-4 flex gap-3"
                style={{ background: "rgba(239,68,68,0.07)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}
                >
                  ✕
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "rgba(239,68,68,0.6)" }}>
                    {m.wrongLabel}
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>
                    {m.wrong}
                  </p>
                </div>
              </div>

              {/* Correct fact */}
              <div
                className="px-5 py-4 flex gap-3"
                style={{ background: "rgba(16,185,129,0.05)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
                >
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "rgba(16,185,129,0.6)" }}>
                    {m.rightLabel}
                  </div>
                  <p className="text-sm" style={{ color: "rgba(240,240,245,0.7)" }}>
                    {m.right}
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
