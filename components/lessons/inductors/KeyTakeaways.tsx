"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const qaPairs = [
  {
    q: "What is an inductor?",
    a: "A coil of wire that stores energy in a magnetic field when current flows through it. Crucially, it opposes any changes in current — whether increases or decreases. More turns and a ferromagnetic core increase inductance.",
  },
  {
    q: "What is the key inductor formula?",
    a: "V = L × dI/dt. The voltage across an inductor is proportional to the rate of change of current — not the current itself. Unit: Henry (H). 1 Henry produces 1 volt when current changes at 1 A/s. Typical values: 1 µH (RF) to 100 mH (audio/power).",
  },
  {
    q: "What is the time constant τ?",
    a: "τ = L/R (seconds). At t = 1τ: current reaches 63.2% of final value. At t = 5τ: current reaches 99.3% — considered 'fully charged'. Larger L = longer time constant. Smaller R = longer time constant.",
  },
  {
    q: "What is back-EMF?",
    a: "When current through an inductor suddenly stops (e.g., switch opens), the collapsing magnetic field induces a large voltage spike in the opposite direction — sometimes hundreds of volts. Solution: place a flyback diode in parallel with the inductor. The diode clamps the spike to ~0.7V.",
  },
  {
    q: "Where are inductors used?",
    a: "Power supplies (buck/boost DC-DC converters), EMI/RF filters, motors, relays, solenoids, transformers, radio tuning circuits (LC tanks), wireless charging coils, and speakers. Any time you need energy storage or resistance to current change.",
  },
  {
    q: "How does an inductor compare to a capacitor?",
    a: "They are dual components. Capacitor: stores charge in an electric field, opposes voltage changes, charges/discharges through current. Inductor: stores energy in a magnetic field, opposes current changes, charged/discharged through voltage. V↔I and C↔L are duals in circuit equations.",
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
                      style={{ background: "rgba(236,72,153,0.05)" }}
                    >
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(236,72,153,0.85)" }}>
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
