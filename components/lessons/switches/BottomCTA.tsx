"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CYAN = "#06B6D4";

export default function BottomCTA() {
  return (
    <section className="px-4 sm:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        {/* Continue card */}
        <div
          className="p-6 rounded-3xl border mb-6"
          style={{ background: "rgba(6,182,212,0.05)", borderColor: "rgba(6,182,212,0.18)" }}
        >
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1">What comes next</p>
          <h3 className="text-lg font-bold text-white/85 mb-2">Pull-Up &amp; Pull-Down Resistors</h3>
          <p className="text-xs text-white/40 leading-relaxed mb-4">
            Now that you understand switches, learn how pull-up and pull-down resistors keep digital inputs from floating — essential knowledge for every Arduino and microcontroller project.
          </p>
          <Link
            href="/electronics/pullup-pulldown"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{ background: "rgba(6,182,212,0.15)", border: `1px solid rgba(6,182,212,0.35)`, color: CYAN }}
          >
            Pull-Up/Down Resistors
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Nav row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/electronics/parallel-circuits"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all text-sm"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ← Parallel Circuits
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/8 text-white/30 hover:text-white/50 transition-all text-sm"
            style={{ background: "rgba(255,255,255,0.01)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2L2 6.5h2V12h2.5V9h1V12H10V6.5h2L7 2z" fill="currentColor" opacity="0.6" />
            </svg>
            Back to APEX Academy
          </Link>

          <Link
            href="/electronics/pullup-pulldown"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all ml-auto"
            style={{ background: "rgba(6,182,212,0.1)", borderColor: "rgba(6,182,212,0.3)", color: CYAN }}
          >
            Pull-Up/Down →
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
