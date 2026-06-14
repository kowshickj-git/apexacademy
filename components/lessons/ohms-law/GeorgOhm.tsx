"use client";

import { motion } from "framer-motion";

const contributions = [
  "Proved that current is proportional to voltage",
  "Proved that current is inversely proportional to resistance",
  "Developed mathematical framework for circuit analysis",
  "Introduced the concept of electrical resistance as a measurable quantity",
  "His unit (Ohm, Ω) is now international standard",
  "Enabled systematic design of telegraph, radio, and computer circuits",
];

export default function GeorgOhm() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 5 · Scientist</p>
        <h2 className="text-xl font-bold mb-6">Meet Georg Simon Ohm</h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-5 p-6 border-b border-white/5" style={{ background: "rgba(16,185,129,0.05)" }}>
            {/* Illustrated portrait */}
            <div
              className="w-20 h-20 rounded-2xl border-2 border-primary/30 flex items-center justify-center shrink-0 text-4xl"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              🧑‍🔬
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-0.5">Georg Simon Ohm</h3>
              <p className="text-xs text-white/40 mb-2">German Physicist · 1789 – 1854</p>
              <div className="flex flex-wrap gap-1.5">
                {["Physicist", "Mathematician", "Teacher", "Pioneer"].map((tag) => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border border-primary/25 text-primary/70" style={{ background: "rgba(16,185,129,0.08)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-5 border-b border-white/5">
            <p className="text-xs text-white/50 leading-relaxed mb-3">
              Georg Ohm grew up as the son of a locksmith in Bavaria, Germany. With no formal university education in his early years, he taught himself advanced mathematics — an extraordinary achievement in the 1800s.
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              Working as a school teacher with limited resources, he spent years running careful experiments with simple batteries and wires, measuring how current changed with different materials and lengths.
              His results were so precise and reproducible that — even though they were initially dismissed — they became the foundation of electrical engineering.
            </p>
          </div>

          {/* Quote */}
          <div className="p-5 border-b border-white/5" style={{ background: "rgba(16,185,129,0.04)" }}>
            <p className="text-sm italic text-white/60 leading-relaxed mb-1">
              &ldquo;The galvanic current is everywhere the same in magnitude throughout the entire circuit.&rdquo;
            </p>
            <p className="text-[10px] text-white/25">— Georg Ohm, 1827</p>
          </div>

          {/* Contributions */}
          <div className="p-5">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 font-semibold">Key Contributions</p>
            <div className="space-y-2">
              {contributions.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-4 h-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/50 leading-relaxed">{c}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Symbol */}
          <div className="px-5 py-4 border-t border-white/5 flex items-center gap-3" style={{ background: "rgba(16,185,129,0.03)" }}>
            <div className="text-3xl font-black text-primary font-mono">Ω</div>
            <p className="text-xs text-white/40 leading-relaxed">
              The <strong className="text-white/70">Ohm (Ω)</strong> was adopted as the international unit of electrical resistance in 1864 — ten years after his death — as a permanent tribute to his legacy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
