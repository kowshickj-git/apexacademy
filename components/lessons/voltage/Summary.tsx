"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const summaryItems = [
  {
    label: "Definition",
    value: "Electrical pressure that pushes electrons through a circuit",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1v12M1 7h12" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Unit",
    value: "Volts (V) — named after Alessandro Volta",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 2l3 10 3-6 3 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Source",
    value: "Batteries, power supplies, generators",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="4" width="9" height="6" rx="1.5" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <rect x="11" y="6" width="2" height="2" rx="0.5" fill="#10B981" />
      </svg>
    ),
  },
  {
    label: "Key Rule",
    value: "More voltage = stronger push = more current",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 10L7 4l5 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Analogy",
    value: "Like water pressure in a pipe system",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2C5 5 2 7 2 9.5a5 5 0 0 0 10 0C12 7 9 5 7 2Z" stroke="#10B981" strokeWidth="1.4" fill="none" />
      </svg>
    ),
  },
];

const voltageExamples = [
  { label: "AA", value: "1.5V" },
  { label: "USB", value: "5V" },
  { label: "9V", value: "9V" },
  { label: "Car", value: "12V" },
];

export default function Summary() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="07" title="Summary" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        {/* Revision card */}
        <div className="relative bg-surface rounded-2xl border border-primary/15 overflow-hidden">
          {/* Top accent */}
          <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-primary" />

          <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l2.4 5.2L18 8l-4 4 1 5.5-5-2.8-5 2.8L6 12 2 8l5.6-.8L10 2z" stroke="#10B981" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-white">Voltage Fundamentals</p>
                <p className="text-xs text-white/35">30-second revision</p>
              </div>
            </div>

            {/* Summary items */}
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
                  <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-primary/60 font-semibold uppercase tracking-wider">
                      {label}
                    </span>
                    <p className="text-sm text-white/75 leading-snug">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Voltage scale strip */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2.5">
                Common Examples
              </p>
              <div className="grid grid-cols-4 gap-2">
                {voltageExamples.map(({ label, value }) => (
                  <div
                    key={label}
                    className="text-center py-2.5 rounded-xl bg-white/4 border border-white/5"
                  >
                    <p className="text-lg font-extrabold text-primary tabular-nums">{value}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">{label}</p>
                  </div>
                ))}
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
          className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="#10B981" strokeWidth="1.8" />
              <path d="M7 11.5L9.5 14L15 8" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-base font-bold text-white mb-1">Lesson Complete!</p>
          <p className="text-xs text-white/45 mb-4">
            You now understand what voltage is. Ready for the next lesson?
          </p>
          <div className="flex flex-col items-center gap-2">
          <Link
            href="/lessons/current"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-background font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all"
          >
            Next: Current Fundamentals
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/index.html"
            className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors mt-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
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
