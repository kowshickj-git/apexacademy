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
          <div className="p-6 border-b border-white/5">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3 font-mono">Next Lesson</p>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl shrink-0"
                style={{ background: "rgba(20,184,166,0.08)", borderColor: "rgba(20,184,166,0.25)" }}
              >
                🧩
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold" style={{ color: "#14B8A6" }}>Lesson 09: Breadboards</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: "rgba(20,184,166,0.3)", color: "#14B8A6", background: "rgba(20,184,166,0.08)" }}>LIVE ⚡</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  Build real circuits without soldering. Learn breadboard anatomy, internal connections, power rails, and build your first complete LED circuit.
                </p>
              </div>
            </div>
            <Link
              href="/electronics/breadboards"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.35)", color: "#14B8A6" }}
            >
              Continue to Breadboards →
            </Link>
          </div>

          <div className="p-6 flex items-center justify-between gap-4">
            <Link
              href="/electronics/diodes"
              className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ← Diodes
            </Link>
            <Link
              href="/electronics/breadboards"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors shrink-0"
              style={{ borderColor: "rgba(20,184,166,0.3)", color: "#14B8A6" }}
            >
              Breadboards →
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
