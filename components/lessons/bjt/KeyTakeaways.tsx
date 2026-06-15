"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const qaPairs = [
  {
    q: "What is a BJT and how does it work?",
    a: "A Bipolar Junction Transistor (BJT) is a current-controlled device with three terminals: Base (B), Collector (C), and Emitter (E). A small base current (I_B) controls a much larger collector current (I_C). The relationship: I_C = β × I_B, where β (hFE) is the current gain, typically 50–500. Current flows through both holes and electrons (bipolar).",
  },
  {
    q: "NPN vs PNP — what's the difference?",
    a: "NPN: current flows into base and collector, out of emitter. Turns on with V_BE > 0.7V (base higher than emitter). Most common. PNP: current flows into emitter, out of base and collector. Turns on with V_EB > 0.7V (emitter higher than base). Used for high-side switching. NPN symbol: arrow points OUT from emitter. PNP: arrow points IN.",
  },
  {
    q: "What are the three operating regions?",
    a: "Cutoff: V_BE < 0.7V → no base current → I_C ≈ 0 → transistor OFF. Active: V_BE ≈ 0.7V → I_C = β × I_B → linear amplification. Saturation: I_B > I_C/β → fully ON → V_CE ≈ 0.1–0.3V. For a switch: operate between Cutoff (off) and Saturation (on). For amplifier: stay in Active region.",
  },
  {
    q: "How do you design a BJT switch?",
    a: "1. Know your load current I_C. 2. Choose a transistor with I_C(max) > load current and β ≥ 50. 3. Calculate I_B needed: I_B = I_C / (β/10) — overdrive by 10× to guarantee saturation. 4. R_B = (V_control − 0.7V) / I_B. 5. Add base resistor. 6. Add flyback diode if switching inductive loads (relay/motor).",
  },
  {
    q: "How does the BJT work as an amplifier?",
    a: "In common-emitter configuration: small AC signal at base modulates I_B, which controls I_C = β × I_B. The voltage gain A_v = −β × R_C / (r_e), where r_e ≈ 26mV/I_C (thermal voltage / quiescent current). Output at collector is amplified and inverted. Q-point must be in active region for undistorted amplification.",
  },
  {
    q: "Why β varies and why it matters?",
    a: "β varies with: temperature (increases with heat), collector current (peaks at medium I_C), manufacturing (same part number: β can range 50–400×). Use voltage divider bias to stabilize Q-point against β. Rule: design for β_min. Add emitter degeneration resistor R_E to further stabilize. Never assume β is exactly the datasheet typical value.",
  },
];

export default function KeyTakeaways() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 11 · Revision
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
                      style={{ background: "rgba(239,68,68,0.05)" }}
                    >
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(239,68,68,0.85)" }}>
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
