"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const qaPairs = [
  {
    q: "What connects holes A–E in a row?",
    a: "Internal metal clips — they share one electrical node. All 5 holes (A1, B1, C1, D1, E1) are the same electrical point.",
  },
  {
    q: "Are A1 and F1 connected?",
    a: "NO — the center gap separates the left side (A–E) from the right side (F–J). They are completely different electrical nodes.",
  },
  {
    q: "What are power rails for?",
    a: "Distributing V+ and GND across the entire board. Connect your power supply once; every hole in that rail gets the same voltage.",
  },
  {
    q: "Why use a breadboard?",
    a: "Solderless — build fast, change instantly, reuse forever. The ideal tool for testing circuit ideas before committing to permanent construction.",
  },
  {
    q: "What component type sits across the center gap?",
    a: "DIP ICs (Dual Inline Package) — integrated circuits with two parallel rows of pins. Each side goes into rows on the left and right, keeping all pins separate.",
  },
  {
    q: "How many holes share a connection per row section?",
    a: "5 holes — A, B, C, D, E on the left; F, G, H, I, J on the right. Each group of 5 is one electrical node.",
  },
];

export default function KeyTakeaways() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 8 · Revision
        </p>
        <h2 className="text-xl font-bold mb-1">Key Takeaways</h2>
        <p className="text-white/45 text-sm mb-5">
          Click each question to reveal the answer.
        </p>

        <div className="space-y-2">
          {qaPairs.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 hover:bg-white/3 transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="text-sm text-white/75 font-medium">{item.q}</span>
                <motion.span
                  animate={{ rotate: openIdx === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/30 shrink-0 text-lg leading-none"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 pb-4 pt-1 border-t border-white/5"
                      style={{ background: "rgba(20,184,166,0.05)" }}
                    >
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(20,184,166,0.85)" }}>
                        {item.a}
                      </p>
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
