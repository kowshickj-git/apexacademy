"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const examples = [
  {
    title: "Find the Current",
    given: { V: "10V", R: "5Ω" },
    find: "I",
    color: "#0EA5E9",
    steps: [
      { text: "Start with Ohm's Law", code: "V = I × R" },
      { text: "We need I, so rearrange", code: "I = V ÷ R" },
      { text: "Substitute the values", code: "I = 10V ÷ 5Ω" },
      { text: "Calculate the result", code: "I = 2A" },
    ],
    answer: "2A",
    check: "Verify: V = I × R → 2A × 5Ω = 10V ✓",
  },
  {
    title: "Find the Voltage",
    given: { I: "2A", R: "10Ω" },
    find: "V",
    color: "#EAB308",
    steps: [
      { text: "Start with Ohm's Law", code: "V = I × R" },
      { text: "V is already alone — just substitute", code: "V = 2A × 10Ω" },
      { text: "Calculate the result", code: "V = 20V" },
    ],
    answer: "20V",
    check: "Verify: I = V ÷ R → 20V ÷ 10Ω = 2A ✓",
  },
  {
    title: "Find the Resistance",
    given: { V: "12V", I: "3A" },
    find: "R",
    color: "#F97316",
    steps: [
      { text: "Start with Ohm's Law", code: "V = I × R" },
      { text: "We need R, so rearrange", code: "R = V ÷ I" },
      { text: "Substitute the values", code: "R = 12V ÷ 3A" },
      { text: "Calculate the result", code: "R = 4Ω" },
    ],
    answer: "4Ω",
    check: "Verify: V = I × R → 3A × 4Ω = 12V ✓",
  },
];

export default function GuidedExamples() {
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(0);
  const ex = examples[selected];

  const reset = (i: number) => { setSelected(i); setStep(0); };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Worked Examples</p>
        <h2 className="text-xl font-bold mb-1">Step-by-Step Solutions</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Three worked examples — one for each variable. Click &quot;Next Step&quot; to walk through the solution.
        </p>

        {/* Example selector */}
        <div className="flex gap-2 mb-5">
          {examples.map((ex, i) => (
            <button
              key={ex.find}
              onClick={() => reset(i)}
              className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all"
              style={selected === i
                ? { background: `${ex.color}16`, borderColor: ex.color + "55", color: ex.color }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }
              }
            >
              Find {ex.find}
            </button>
          ))}
        </div>

        {/* Problem */}
        <div
          className="rounded-2xl border p-5 mb-4"
          style={{ background: `${ex.color}0c`, borderColor: `${ex.color}25` }}
        >
          <p className="text-[10px] text-white/30 mb-3 uppercase tracking-widest font-mono">Given</p>
          <div className="flex gap-4 flex-wrap mb-3">
            {Object.entries(ex.given).map(([k, v]) => (
              <div key={k} className="text-center">
                <p className="text-2xl font-black font-mono" style={{ color: ex.color }}>{v}</p>
                <p className="text-[10px] text-white/30">{k === "V" ? "Voltage" : k === "I" ? "Current" : "Resistance"}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/60">
            <strong className="text-white" style={{ color: ex.color }}>Find:</strong> {ex.find === "V" ? "Voltage" : ex.find === "I" ? "Current" : "Resistance"} = ?
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-2 mb-4">
          {ex.steps.map((s, i) => (
            <AnimatePresence key={i}>
              {step >= i && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3 items-start p-3 rounded-xl border border-white/6"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ background: `${ex.color}18`, color: ex.color }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs text-white/45 mb-1">{s.text}</p>
                    <p className="text-sm font-bold font-mono" style={{ color: ex.color }}>{s.code}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {step < ex.steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: ex.color, color: "#050507" }}
            >
              Next Step →
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 p-3 rounded-xl border border-primary/25 text-center"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <p className="text-sm font-black text-primary">Answer: {ex.answer}</p>
              <p className="text-xs text-white/40 mt-1">{ex.check}</p>
            </motion.div>
          )}
          <button
            onClick={() => setStep(0)}
            className="px-4 py-2.5 rounded-xl text-xs border border-white/10 text-white/40 hover:border-white/20 transition-all"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
