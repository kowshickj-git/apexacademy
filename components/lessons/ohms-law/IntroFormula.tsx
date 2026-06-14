"use client";

import { motion } from "framer-motion";

export default function IntroFormula() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 6 · The Formula</p>
        <h2 className="text-xl font-bold mb-1">Introducing Ohm&apos;s Law</h2>
        <p className="text-white/45 text-sm mb-8 leading-relaxed">
          You&apos;ve already felt the relationship through the water analogy and your guesses. Now here&apos;s the exact mathematical law that ties Voltage, Current, and Resistance together.
        </p>

        {/* Big formula reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
          className="relative rounded-3xl border border-primary/25 p-8 mb-6 text-center overflow-hidden"
          style={{ background: "rgba(16,185,129,0.06)" }}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 70%)" }} />

          <p className="text-[10px] text-primary/60 uppercase tracking-widest font-semibold mb-4">Ohm&apos;s Law</p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl font-black tracking-tight font-mono mb-4"
            style={{ color: "#10B981" }}
          >
            V = I × R
          </motion.p>

          <div className="flex justify-center gap-8">
            {[
              { sym: "V", name: "Voltage", unit: "Volts", color: "#EAB308" },
              { sym: "I", name: "Current", unit: "Amperes", color: "#0EA5E9" },
              { sym: "R", name: "Resistance", unit: "Ohms (Ω)", color: "#F97316" },
            ].map((v) => (
              <div key={v.sym} className="text-center">
                <p className="text-2xl font-black font-mono mb-0.5" style={{ color: v.color }}>{v.sym}</p>
                <p className="text-[11px] text-white/60 font-semibold">{v.name}</p>
                <p className="text-[9px] text-white/25">{v.unit}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What it means in plain English */}
        <div className="space-y-3">
          {[
            { emoji: "📈", text: "Double the voltage → Double the current (if resistance stays the same)" },
            { emoji: "📉", text: "Double the resistance → Half the current (if voltage stays the same)" },
            { emoji: "⚡", text: "To get more current: increase voltage OR decrease resistance — or both" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <span className="text-base shrink-0">{item.emoji}</span>
              <p className="text-sm text-white/60 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-5 p-4 rounded-xl border border-secondary/15"
          style={{ background: "rgba(14,165,233,0.05)" }}
        >
          <p className="text-xs text-secondary font-semibold mb-1">Why is it called Ohm&apos;s <em>Law</em>?</p>
          <p className="text-xs text-white/45 leading-relaxed">
            A law in physics means it always holds true — no exceptions. In every circuit ever built, at every voltage and every resistance, current always equals V ÷ R.
            It is as reliable as gravity.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
