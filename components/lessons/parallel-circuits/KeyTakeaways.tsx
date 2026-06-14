"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    q: "What voltage do components in parallel share?",
    a: "All branches receive the SAME voltage as the supply. V₁ = V₂ = V₃ = V_supply. This is why home appliances all work at 120V/230V independently.",
  },
  {
    q: "How does current behave in parallel?",
    a: "Current splits. I_total = I₁ + I₂ + I₃. Each branch draws current based on its own resistance: I_branch = V_supply / R_branch. Lower resistance = more current in that branch.",
  },
  {
    q: "What is the equivalent resistance formula?",
    a: "1/R_eq = 1/R₁ + 1/R₂ + 1/R₃. R_eq is ALWAYS less than the smallest branch resistor. Two 100Ω in parallel = 50Ω. Three 60Ω in parallel = 20Ω.",
  },
  {
    q: "What happens when one branch opens (fails)?",
    a: "Only that branch stops. All other branches continue working at the same current and voltage. This is why home circuits are parallel — one appliance blowing a fuse doesn't kill your whole house!",
  },
  {
    q: "For two resistors in parallel, is there a simpler formula?",
    a: "Yes: R_eq = (R₁ × R₂) / (R₁ + R₂). Called the 'product over sum' formula. Example: 100Ω ‖ 100Ω = 10000/200 = 50Ω. Works only for two resistors at a time.",
  },
  {
    q: "How is total current calculated?",
    a: "I_total = V / R_eq, OR sum all branch currents: I_total = V/R₁ + V/R₂ + V/R₃. Both give the same answer — pick whichever is easier given the problem.",
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

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
            Key Takeaways
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">6 Things to Remember</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Click each question to reveal the answer.
        </p>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden transition-colors duration-300"
                style={{
                  borderColor: isOpen ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)",
                  background: isOpen ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.03)",
                }}
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left gap-3"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{
                        background: isOpen ? "#6366F1" : "rgba(99,102,241,0.15)",
                        color: isOpen ? "#fff" : "#818CF8",
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: isOpen ? "#fff" : "rgba(240,240,245,0.7)" }}
                    >
                      {item.q}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 6l4 4 4-4"
                        stroke={isOpen ? "#6366F1" : "rgba(255,255,255,0.25)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4 pt-0 text-sm leading-relaxed"
                        style={{ color: "rgba(240,240,245,0.65)" }}
                      >
                        <div className="pl-9">{item.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
