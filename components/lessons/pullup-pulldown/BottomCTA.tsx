"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BottomCTA() {
  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-2xl">
        {/* Next lesson card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border p-6 mb-6"
          style={{ borderColor: "rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.04)" }}
        >
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1 font-mono">Up Next</p>
          <h3 className="text-lg font-bold text-white/85 mb-1">Lesson 15: Inductors</h3>
          <p className="text-sm text-white/40 mb-4 leading-relaxed">
            Discover how coils store energy in magnetic fields — the foundation of motors, transformers, and switching power supplies.
          </p>
          <Link
            href="/electronics/inductors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", color: "#F59E0B" }}
          >
            Continue to Inductors
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between border-t border-white/5 pt-5">
          <Link
            href="/electronics/switches"
            className="flex items-center gap-2 text-sm text-white/35 hover:text-white/55 transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="group-hover:underline underline-offset-2">Switches</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/15 font-mono">L14 of 36</span>
            <div className="flex gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: i < 14 ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)" }}
                />
              ))}
            </div>
          </div>

          <Link
            href="/electronics/inductors"
            className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: "#F59E0B" }}
          >
            <span>Inductors</span>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
