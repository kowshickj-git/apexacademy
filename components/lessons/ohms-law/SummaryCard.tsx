"use client";

import { motion } from "framer-motion";

const revision = [
  { label: "V = ?", answer: "V = I × R (Voltage = Current × Resistance)" },
  { label: "I = ?", answer: "I = V ÷ R (Current = Voltage ÷ Resistance)" },
  { label: "R = ?", answer: "R = V ÷ I (Resistance = Voltage ÷ Current)" },
  { label: "V increases →", answer: "I increases (directly proportional)" },
  { label: "R increases →", answer: "I decreases (inversely proportional)" },
  { label: "I = ?, V=10V, R=5Ω", answer: "I = 10÷5 = 2A" },
  { label: "V = ?, I=2A, R=10Ω", answer: "V = 2×10 = 20V" },
  { label: "R = ?, V=12V, I=3A", answer: "R = 12÷3 = 4Ω" },
];

export default function SummaryCard() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 20</p>
        <h2 className="text-xl font-bold mb-6">30-Second Revision Card</h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 overflow-hidden"
          style={{ background: "rgba(16,185,129,0.04)" }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-primary/10 flex items-center gap-3">
            <div className="text-2xl font-black font-mono text-primary">V=IR</div>
            <div>
              <p className="text-xs font-bold text-primary">Ohm&apos;s Law — Lesson 05</p>
              <p className="text-[10px] text-white/30">30-second revision</p>
            </div>
          </div>

          {/* Formula visual */}
          <div className="px-5 py-4 border-b border-primary/8 flex items-center justify-center gap-8 bg-primary/3">
            {[
              { sym: "V", label: "Voltage", unit: "Volts", color: "#EAB308" },
              { sym: "I", label: "Current", unit: "Amps", color: "#0EA5E9" },
              { sym: "R", label: "Resistance", unit: "Ohms", color: "#F97316" },
            ].map((v) => (
              <div key={v.sym} className="text-center">
                <p className="text-2xl font-black font-mono" style={{ color: v.color }}>{v.sym}</p>
                <p className="text-[10px] text-white/40">{v.label}</p>
                <p className="text-[9px] text-white/20">{v.unit}</p>
              </div>
            ))}
          </div>

          {/* Q&A */}
          <div className="divide-y divide-white/4">
            {revision.map((r) => (
              <div key={r.label} className="px-5 py-2.5 flex gap-4">
                <span className="text-xs text-white/30 w-36 shrink-0 font-mono">{r.label}</span>
                <span className="text-xs text-white/65 font-mono leading-relaxed">{r.answer}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next lesson teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-5 rounded-2xl border border-white/8 p-5 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="w-12 h-12 rounded-xl border border-secondary/25 flex items-center justify-center text-2xl shrink-0" style={{ background: "rgba(14,165,233,0.1)" }}>
            ⚡
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/30 mb-0.5">Up Next — Lesson 06</p>
            <h3 className="text-sm font-bold text-white/80 mb-0.5">Capacitors</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Learn how capacitors store and release electrical energy — and how Ohm&apos;s Law extends into the world of reactive components.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border border-white/10 text-white/30 cursor-not-allowed">
            Soon
          </div>
        </motion.div>
      </div>
    </section>
  );
}
