"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const qaList = [
  {
    q: "What does a multimeter measure?",
    a: "Voltage, current, resistance, continuity, and diode voltage drop.",
  },
  {
    q: "How is voltage measured?",
    a: "IN PARALLEL — both probes touch the two ends of a component simultaneously. Circuit does NOT break.",
  },
  {
    q: "How is current measured?",
    a: "IN SERIES — the circuit must be broken at one point to insert the ammeter in the gap.",
  },
  {
    q: "When do you measure resistance?",
    a: "Only with power OFF — the meter uses its own internal battery to push a tiny current through the component.",
  },
  {
    q: 'What does "OL" on a multimeter mean?',
    a: "Overload (Open Line) — resistance is too high to measure. Indicates a broken wire or reverse-biased diode.",
  },
  {
    q: "Which probe always goes in COM?",
    a: "The BLACK probe — COM = Common = Ground reference for all measurements.",
  },
];

export default function KeyTakeaways() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 10 · Review
        </p>
        <h2 className="text-xl font-bold mb-2">Key Takeaways</h2>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          Click each question to reveal the answer. A quick mental test before the quiz.
        </p>

        <div className="space-y-2">
          {qaList.map((qa, i) => (
            <div key={i} className="rounded-2xl border border-white/8 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors"
              >
                <span className="text-xs font-semibold text-white/70 pr-3">{qa.q}</span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-white/30"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 py-3 border-t border-white/6"
                      style={{ background: "rgba(167,139,250,0.05)" }}
                    >
                      <p className="text-xs text-white/60 leading-relaxed">{qa.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
