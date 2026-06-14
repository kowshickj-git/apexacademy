"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS = [
  {
    q: "What happens to current in a series circuit?",
    a: "Current is identical through every component. I_total = I₁ = I₂ = I₃. This is Kirchhoff's Current Law for series circuits. If 15mA flows through R1, the same 15mA flows through R2 and R3 — no exceptions.",
  },
  {
    q: "How does voltage behave?",
    a: "Voltage drops across each component proportional to its resistance. V_total = V₁ + V₂ + V₃ (Kirchhoff's Voltage Law). A higher resistance component 'claims' a larger share of the total voltage.",
  },
  {
    q: "How do I calculate total resistance?",
    a: "Simply add them all together: R_total = R₁ + R₂ + R₃. Example: 100Ω + 200Ω + 300Ω = 600Ω. Every component you add increases total resistance and decreases current.",
  },
  {
    q: "What happens if one component fails open?",
    a: "The entire circuit stops working immediately. Current path is broken, so NO current flows anywhere in the loop. All components go dark/off. This is why one Christmas light can kill the whole string.",
  },
  {
    q: "What's the voltage divider formula?",
    a: "V_Rx = V_total × (Rx / R_total). Example: With 12V supply and R_total = 600Ω, V_R1(100Ω) = 12V × (100/600) = 2V. Larger resistors capture proportionally more voltage.",
  },
  {
    q: "Where are series circuits used in real life?",
    a: "Christmas lights (old style — series flaw), battery packs (voltages add in series), industrial safety sensor chains (E-stops, door interlocks), emergency stop circuits, and current-limiting resistors for LEDs.",
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

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
          <div
            className="inline-block px-2 py-1 rounded-lg text-xs font-mono font-bold mb-2"
            style={{ background: "rgba(249,115,22,0.1)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            REVIEW
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            Key Takeaways
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Click each question to reveal the answer. These are the core concepts for the quiz.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  border: isOpen
                    ? "1px solid rgba(249,115,22,0.35)"
                    : "1px solid rgba(255,255,255,0.07)",
                  background: isOpen ? "rgba(249,115,22,0.05)" : "rgba(255,255,255,0.03)",
                  transition: "background 0.25s, border-color 0.25s",
                }}
              >
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      background: isOpen ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.07)",
                      color: isOpen ? "#F97316" : "rgba(240,240,245,0.4)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="text-sm font-semibold flex-1"
                    style={{ color: isOpen ? "#F0F0F5" : "rgba(240,240,245,0.7)" }}
                  >
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs flex-shrink-0"
                    style={{ color: isOpen ? "#F97316" : "rgba(240,240,245,0.3)" }}
                  >
                    ▾
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="px-5 pb-4 ml-9 text-sm leading-relaxed"
                        style={{ color: "rgba(240,240,245,0.65)" }}
                      >
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
