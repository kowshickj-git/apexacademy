"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const qaPairs = [
  {
    q: "What is the turns ratio formula?",
    a: "V_p/V_s = N_p/N_s = I_s/I_p. Voltage ratio equals turns ratio. Current ratio is the INVERSE of turns ratio. Power is conserved (ideal): V_p × I_p = V_s × I_s. Double the secondary turns → double the output voltage and half the output current.",
  },
  {
    q: "Step-up vs step-down?",
    a: "Step-up: N_s > N_p → V_out > V_in, I_out < I_in. Voltage rises, current falls, power stays constant. Step-down: N_p > N_s → V_out < V_in, I_out > I_in. Voltage falls, current rises, power stays constant. Power (V × I) is always conserved in an ideal transformer.",
  },
  {
    q: "Why does the power grid use high voltage?",
    a: "P_loss = I²R. High voltage → low current → much less I²R loss. 1000W at 230V: I = 4.35A. P_loss = 4.35² × R = 18.9R. At 400kV: I = 0.0025A. P_loss = 0.0025² × R = 0.00000625R. Losses are 3,000,000× lower at 400kV. Transformers make this possible.",
  },
  {
    q: "Why do transformers only work with AC?",
    a: "A transformer needs changing magnetic flux (dΦ/dt ≠ 0). AC continuously changes direction → continuously changing flux → continuous induction in the secondary. DC is constant → dΦ/dt = 0 → zero induced EMF → transformer does nothing (just sees winding resistance and heats up).",
  },
  {
    q: "What is an isolation transformer?",
    a: "A 1:1 turns ratio transformer. Same voltage in and out. Purpose: break the electrical connection to earth ground. The secondary has no direct path to earth. Used in medical equipment (prevents shock if device faults), oscilloscope probes, and lab power supplies. Safety isolation, not voltage conversion.",
  },
  {
    q: "Real-world transformer efficiency?",
    a: "Large power transformers: 95–99% efficient. Losses: (1) Core losses — eddy currents (mitigated by thin laminated silicon steel sheets) and hysteresis (mitigated by silicon steel). (2) Copper losses — I²R heating in primary and secondary windings. Ferrite cores for switching power supplies run at kHz, where thin lamination is impractical — ferrite is inherently high-resistance.",
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
                      style={{ background: "rgba(139,92,246,0.05)" }}
                    >
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(139,92,246,0.85)" }}>
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
