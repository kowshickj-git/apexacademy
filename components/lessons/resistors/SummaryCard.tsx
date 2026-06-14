"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const revision = [
  { label: "What is a resistor?", answer: "A component that opposes current flow, measured in Ohms (Ω)" },
  { label: "Color code formula?", answer: "(Digit1 × 10 + Digit2) × Multiplier = Value in Ω" },
  { label: "220Ω bands?", answer: "Red · Red · Brown · Gold" },
  { label: "LED protection at 5V?", answer: "Use 220Ω series resistor — limits current to safe 18mA" },
  { label: "Thermistor?", answer: "Resistance changes with temperature (NTC/PTC types)" },
  { label: "SMD vs through-hole?", answer: "SMD = flat chip for PCB; Through-hole = leaded, for breadboards" },
];

export default function SummaryCard() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 16</p>
        <h2 className="text-xl font-bold mb-1">30-Second Revision Card</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Scan this before your next session to lock in what you&apos;ve learned.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 overflow-hidden"
          style={{ background: "rgba(16,185,129,0.04)" }}
        >
          <div className="px-5 py-3 border-b border-primary/10 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#10B981">
              <polygon points="7,1 8.5,5 13,5.5 10,8.5 10.5,13 7,11 3.5,13 4,8.5 1,5.5 5.5,5" />
            </svg>
            <span className="text-xs font-bold text-primary">Resistors — Lesson 04 Summary</span>
          </div>

          <div className="divide-y divide-white/4">
            {revision.map((r) => (
              <div key={r.label} className="px-5 py-3 flex gap-4">
                <span className="text-xs text-white/35 w-36 shrink-0 font-medium">{r.label}</span>
                <span className="text-xs text-white/65 leading-relaxed">{r.answer}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next lesson teaser */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 rounded-2xl border border-white/8 p-5 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div
            className="w-12 h-12 rounded-xl border border-secondary/25 flex items-center justify-center text-xl shrink-0"
            style={{ background: "rgba(14,165,233,0.1)" }}
          >
            🔢
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/30 mb-0.5">Up Next — Lesson 05</p>
            <h3 className="text-sm font-bold text-white/80 mb-0.5">Ohm&apos;s Law</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Combine voltage, current, and resistance into the most important equation in electronics: V = I × R.
            </p>
          </div>
          <Link
            href="/electronics/ohms-law"
            className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border border-primary/35 text-primary hover:bg-primary/10 transition-colors"
          >
            Start →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
