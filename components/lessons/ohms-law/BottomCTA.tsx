"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BottomCTA() {
  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/8 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          {/* Next lesson — skip L06 Capacitors (coming soon), go straight to L07 Diodes */}
          <div className="p-6 border-b border-white/5">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3 font-mono">Next Lesson</p>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl shrink-0"
                style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.25)" }}
              >
                ⚡
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold" style={{ color: "#A78BFA" }}>Lesson 07: Diodes</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: "rgba(167,139,250,0.3)", color: "#A78BFA", background: "rgba(167,139,250,0.08)" }}>LIVE ⚡</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  Learn how diodes act as one-way valves — forward bias, reverse bias, and AC-to-DC rectification. (L06 Capacitors coming soon)
                </p>
              </div>
            </div>
            <Link
              href="/electronics/diodes"
              className="mt-4 block w-full py-2.5 rounded-xl text-sm font-bold text-center transition-all hover:opacity-90"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)", color: "#A78BFA" }}
            >
              Continue to Diodes →
            </Link>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 divide-x divide-white/5">
            <Link
              href="/electronics/resistors"
              className="flex items-center justify-center gap-2 px-4 py-4 text-xs text-white/40 hover:text-white/65 hover:bg-white/3 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ← Resistors
            </Link>
            <Link
              href="/electronics/diodes"
              className="flex items-center justify-center gap-2 px-4 py-4 text-xs font-semibold hover:bg-white/3 transition-all"
              style={{ color: "#A78BFA" }}
            >
              Diodes →
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
