"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    num: "01",
    title: "Connecting Base Directly to Supply",
    problem: "Driving the base without a current-limiting resistor from a voltage source.",
    consequence: "I_B can reach hundreds of milliamps. Base-emitter junction burns out instantly. Transistor destroyed within milliseconds.",
    fix: "Always use a base resistor. R_B = (V_in − V_BE) / I_B. For 5V logic and β=100: R_B = (5 − 0.7) / (I_C/100). Typical: 1kΩ–10kΩ.",
  },
  {
    num: "02",
    title: "Treating β as a Fixed Constant",
    problem: "Designing circuits assuming β is exactly 100 and doesn't vary.",
    consequence: "β varies 3×–10× across units, temperature, and operating point. A circuit designed for β=100 may fail when β=30 or β=300.",
    fix: "Design for the minimum specified β. Voltage divider bias (not fixed-base bias) stabilizes Q-point against β variation. Emitter degeneration helps too.",
  },
  {
    num: "03",
    title: "Ignoring Saturation V_CE",
    problem: "Assuming V_CE(sat) = 0V when transistor is fully on.",
    consequence: "Real V_CE(sat) ≈ 0.1–0.3V. In power circuits this causes unexpected I²R losses and heat. Motor/relay drivers can misbehave.",
    fix: "Check V_CE(sat) in the datasheet. For hard saturation: use I_B = I_C / (β/10) — drive 10× harder than needed to guarantee saturation.",
  },
  {
    num: "04",
    title: "Wrong NPN/PNP Orientation",
    problem: "Swapping NPN for PNP without changing the circuit topology.",
    consequence: "NPN switches on high side (wrong), PNP on low side (wrong). Circuit draws wrong current, may damage transistor or load.",
    fix: "NPN: emitter → GND, collector → load → V+. PNP: emitter → V+, collector → load → GND. Base control voltage polarity flips too.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 10 · Pitfalls
        </p>
        <h2 className="text-xl font-bold mb-1">Common Mistakes</h2>
        <p className="text-white/45 text-sm mb-5">
          Errors engineers and students make with BJT transistors — and how to avoid them.
        </p>

        <div className="space-y-3">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.num}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="rounded-xl border p-4"
              style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                >
                  {m.num}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white/80 mb-2">{m.title}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-white/25 tracking-wider">Problem</span>
                      <p className="text-xs text-white/45 leading-relaxed mt-0.5">{m.problem}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-red-400/40 tracking-wider">Consequence</span>
                      <p className="text-xs text-red-400/60 leading-relaxed mt-0.5">{m.consequence}</p>
                    </div>
                    <div
                      className="rounded-lg p-2.5"
                      style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}
                    >
                      <span className="text-[9px] font-mono uppercase text-green-400/50 tracking-wider">Fix</span>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "rgba(16,185,129,0.7)" }}>{m.fix}</p>
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
