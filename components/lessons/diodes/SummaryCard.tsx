"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const revision = [
  { label: "What is a diode?", answer: "A two-terminal semiconductor that allows current to flow in one direction only" },
  { label: "Forward voltage (Si)?", answer: "~0.6–0.7V — minimum voltage for conduction in a silicon diode" },
  { label: "Anode vs Cathode?", answer: "Anode (+) = current IN; Cathode (−) = current OUT; band marks cathode" },
  { label: "Reverse bias?", answer: "Cathode more positive than anode → junction blocks current → circuit off" },
  { label: "Rectification?", answer: "Diode converts AC to pulsed DC by passing only one half of the waveform" },
  { label: "Schottky advantage?", answer: "Lower Vf (~0.3V) and faster switching than silicon — ideal for switching supplies" },
];

export default function SummaryCard() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 13</p>
        <h2 className="text-xl font-bold mb-1">30-Second Revision Card</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Scan this before your next session to lock in what you&apos;ve learned about diodes.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-purple-500/20 overflow-hidden"
          style={{ background: "rgba(139,92,246,0.04)" }}
        >
          <div className="px-5 py-3 border-b border-purple-500/10 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#A78BFA">
              <polygon points="7,1 8.5,5 13,5.5 10,8.5 10.5,13 7,11 3.5,13 4,8.5 1,5.5 5.5,5" />
            </svg>
            <span className="text-xs font-bold text-purple-400">Diodes — Lesson 07 Summary</span>
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
            className="w-12 h-12 rounded-xl border border-red-500/25 flex items-center justify-center text-xl shrink-0"
            style={{ background: "rgba(239,68,68,0.1)" }}
          >
            💡
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/30 mb-0.5">Up Next — Lesson 08</p>
            <h3 className="text-sm font-bold text-white/80 mb-0.5">LED Fundamentals</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Diodes that glow. Learn polarity, resistors, colours, RGB mixing and why your LED needs that resistor.
            </p>
          </div>
          <Link
            href="/electronics/leds"
            className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border border-primary/35 text-primary hover:bg-primary/10 transition-colors"
          >
            Start →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
