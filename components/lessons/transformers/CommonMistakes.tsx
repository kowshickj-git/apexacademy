"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    num: "01",
    title: "Connecting DC to the Primary",
    problem: "DC voltage on primary → constant magnetic flux → dΦ/dt = 0 → zero induced EMF in secondary.",
    consequence: "Transformer doesn't transfer power. Primary winding heats up (just a resistor to DC). Can damage insulation and burn out.",
    fix: "Transformers only work with AC. For DC applications, use a DC-DC converter (switching power supply).",
  },
  {
    num: "02",
    title: "Overloading the Secondary",
    problem: "Drawing more current from secondary than the transformer is rated for.",
    consequence: "Exceeds current rating → I²R copper losses spike → heat builds up → insulation degrades → core may saturate → transformer fails.",
    fix: "Always check the VA (volt-amp) rating. Never exceed it. Add a fuse on the secondary for protection.",
  },
  {
    num: "03",
    title: "Confusing Turns Ratio Direction",
    problem: "Mixing up N_p/N_s vs N_s/N_p when calculating voltage. Turns ratio a = N_p/N_s (primary/secondary).",
    consequence: "Calculation errors: expecting 24V output, getting 0.04V. Can lead to selecting the wrong transformer or designing circuits that fail.",
    fix: "Remember: V_out = V_in × (N_s/N_p). The secondary turns go on TOP when calculating output voltage.",
  },
  {
    num: "04",
    title: "Assuming 100% Efficiency",
    problem: "Treating ideal transformer equations (P_in = P_out exactly) as real-world truth.",
    consequence: "Undersizing power supplies by ignoring losses. Real transformers lose 1–5%. A 100W load needs a 104–105W rated transformer minimum.",
    fix: "Always add 10–20% margin. Check efficiency rating (η). Account for core and copper losses in thermal design.",
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
          Errors that engineers and students make with transformers — and how to avoid them.
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
