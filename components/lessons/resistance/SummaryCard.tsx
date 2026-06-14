"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const summaryItems = [
  { label: "Definition", value: "Opposition to the flow of electric current", icon: "⚡" },
  { label: "Unit", value: "Ohms (Ω) — named after Georg Simon Ohm", icon: "Ω" },
  { label: "Cause", value: "Electron collisions with atoms inside materials", icon: "💥" },
  { label: "Low Example", value: "Copper — very few obstacles for electrons", icon: "🔶" },
  { label: "High Example", value: "Rubber — billions of obstacles block electrons", icon: "⬛" },
  { label: "Key Rule", value: "More resistance → less current for same voltage", icon: "📉" },
];

export default function SummaryCard() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="12" title="Summary" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="relative rounded-2xl border border-primary/15 overflow-hidden bg-surface">
          <div className="h-[3px] bg-gradient-to-r from-primary via-orange-400 to-secondary" />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">Ω</div>
              <div>
                <p className="text-sm font-bold text-white">Resistance Fundamentals</p>
                <p className="text-xs text-white/35">30-second revision</p>
              </div>
            </div>

            <div className="space-y-3">
              {summaryItems.map(({ label, value, icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-primary/60 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-white/75 leading-snug">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Resistance scale */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2.5">Resistance Scale</p>
              <div className="relative h-6 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="absolute inset-y-0 left-0 right-0 rounded-full" style={{ background: "linear-gradient(to right, #10B981, #FCD34D, #F97316, #EF4444)" }} />
              </div>
              <div className="flex justify-between text-[9px] text-white/30">
                <span>Copper (near 0)</span>
                <span>Aluminium</span>
                <span>Iron</span>
                <span>Rubber (∞)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson complete card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-2xl border border-primary/20 p-5 text-center"
          style={{ background: "rgba(16,185,129,0.05)" }}
        >
          <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="#10B981" strokeWidth="1.8" />
              <path d="M7 11.5L9.5 14L15 8" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-base font-bold text-white mb-1">Lesson Complete!</p>
          <p className="text-xs text-white/45 mb-4">You now understand what Resistance is. Ready for the next step?</p>
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/electronics/resistors"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/35 text-sm text-primary font-bold hover:bg-primary/10 transition-colors"
            >
              🔓 Continue to Resistors →
            </Link>
            <Link
              href="/lessons/current"
              className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors mt-1"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Current Lesson
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
