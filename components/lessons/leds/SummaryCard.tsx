"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const revision = [
  { label: "LED stands for?", answer: "Light Emitting Diode — a P-N junction that emits photons when forward biased" },
  { label: "Anode vs Cathode?", answer: "Anode (+) = longer leg; Cathode (−) = shorter leg + flat side" },
  { label: "Red LED forward voltage?", answer: "~2.0–2.2V (Blue/White = 3.0–3.4V, different semiconductor material)" },
  { label: "Resistor formula?", answer: "R = (Vs − Vf) / If  e.g. (5−2)/0.02 = 150Ω → use 220Ω" },
  { label: "RGB colour mixing?", answer: "Additive — R+G+B = White. Opposite of paint (subtractive mixing)" },
  { label: "PWM dimming?", answer: "Switch LED on/off 1000x/sec at variable duty cycle — avoids colour shift" },
  { label: "Why does colour = material?", answer: "E=hν — photon energy matches semiconductor band gap; wider gap = higher energy = bluer colour" },
];

export default function SummaryCard() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 18</p>
        <h2 className="text-xl font-bold mb-1">30-Second Revision Card</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Scan this before your next session to lock in what you&apos;ve learned about LEDs.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-red-500/20 overflow-hidden"
          style={{ background: "rgba(239,68,68,0.04)" }}
        >
          <div className="px-5 py-3 border-b border-red-500/10 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#FCA5A5">
              <polygon points="7,1 8.5,5 13,5.5 10,8.5 10.5,13 7,11 3.5,13 4,8.5 1,5.5 5.5,5" />
            </svg>
            <span className="text-xs font-bold text-red-300">LED Fundamentals — Lesson 08 Summary</span>
          </div>
          <div className="divide-y divide-white/4">
            {revision.map((r) => (
              <div key={r.label} className="px-5 py-3 flex gap-4">
                <span className="text-xs text-white/35 w-40 shrink-0 font-medium">{r.label}</span>
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
            className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            🧩
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/30 mb-0.5">Up Next — Lesson 09</p>
            <h3 className="text-sm font-bold text-white/80 mb-0.5">Breadboards</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Put everything together on a breadboard. Build real circuits with no soldering — just plug and play.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border border-white/10 text-white/25">
            Coming Soon
          </div>
        </motion.div>
      </div>
    </section>
  );
}
