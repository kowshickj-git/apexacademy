"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    title: "No flyback diode on relay or motor",
    problem: "Transistor/MOSFET driving a relay or motor without a flyback diode.",
    consequence: "Back-EMF spike (can be 100s of volts) instantly destroys the switching transistor or MOSFET.",
    fix: "Always place a diode in parallel with the inductive load. Anode to GND, cathode to the positive rail.",
    code: "D1: parallel with L, anode→GND, cathode→V+",
  },
  {
    title: "Wrong inductance value in filter",
    problem: "Using a different-value inductor than the design calls for in an LC filter or power supply.",
    consequence: "Cutoff frequency shifts (f = 1/2π√LC). The filter no longer attenuates at the right frequency, causing noise or ripple.",
    fix: "Match inductance values precisely. Even a 2× difference shifts the cutoff frequency by √2 (41%).",
    code: "f_c = 1 / (2π × √(L × C))",
  },
  {
    title: "Ignoring DC resistance (DCR) of inductor",
    problem: "Treating the inductor as a purely ideal component in current calculations.",
    consequence: "Real inductors have series resistance (DCR). At high currents, this drops voltage, generates heat, and limits the true current rating.",
    fix: "Check the datasheet for DCR. Include it in series resistance calculations: I_max × DCR = voltage drop across DCR.",
    code: "I_real = V / (R + DCR_inductor)",
  },
  {
    title: "Inductor saturation from too much current",
    problem: "Running more current through an inductor than its saturation current rating.",
    consequence: "The magnetic core saturates — inductance drops drastically (sometimes by 80%), destroying converter efficiency and causing overheating.",
    fix: "Choose an inductor with I_sat > peak current in your circuit. Add ~20–30% safety margin for peaks.",
    code: "I_peak < I_sat (from datasheet)",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 7 · Watch Out
        </p>
        <h2 className="text-xl font-bold mb-1">Common Mistakes</h2>
        <p className="text-white/45 text-sm mb-5">
          These errors damage hardware or cause mysterious failures. Learn them now, avoid them always.
        </p>

        <div className="space-y-3">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}
            >
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
                  >
                    ✕
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white/85 mb-2">{m.title}</p>
                    <div className="space-y-1.5">
                      <p className="text-xs text-white/40">
                        <span className="font-semibold text-white/55">Mistake: </span>{m.problem}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(239,68,68,0.75)" }}>
                        <span className="font-semibold">Consequence: </span>{m.consequence}
                      </p>
                      <p className="text-xs text-white/50">
                        <span className="font-semibold text-white/65">Fix: </span>{m.fix}
                      </p>
                    </div>
                    <div
                      className="mt-2 px-2.5 py-1 rounded-lg font-mono text-[10px] inline-block"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      {m.code}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
