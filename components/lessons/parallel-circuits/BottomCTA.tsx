"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BottomCTA() {
  return (
    <section className="px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/8 p-8"
        style={{ background: "rgba(99,102,241,0.05)" }}
      >
        {/* Course complete badge */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎓</div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-3 text-xs font-bold"
            style={{
              background: "rgba(16,185,129,0.1)",
              borderColor: "rgba(16,185,129,0.3)",
              color: "#34D399",
            }}
          >
            Course Complete · 12/12 Lessons
          </div>
          <h2 className="text-xl font-black text-white mb-2">
            You&apos;ve finished Electronics Fundamentals!
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            You now understand voltage, current, resistance, components, and circuits — both series and parallel.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {/* Prev */}
          <Link
            href="/electronics/series-circuits"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/12 text-sm font-bold text-white/60 hover:border-white/22 hover:text-white/80 transition-all"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Series Circuits
          </Link>

          {/* Next (disabled) */}
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/5 text-sm font-bold text-white/20 cursor-not-allowed select-none"
            style={{ background: "rgba(255,255,255,0.02)" }}
            title="Coming soon"
          >
            Switches
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
              Soon
            </span>
          </div>
        </div>

        {/* Back to academy */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm font-bold transition-colors hover:opacity-80"
            style={{ color: "#6366F1" }}
          >
            ← Back to APEX Academy
          </Link>
        </div>

        {/* What you learned */}
        <div
          className="mt-6 rounded-2xl p-4 border border-white/6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
            What you mastered in Lesson 12
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Parallel voltage rule",
              "Kirchhoff's Current Law",
              "Reciprocal resistance formula",
              "Branch independence",
              "Series vs Parallel",
              "Real-world applications",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
                <span style={{ color: "#6366F1" }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
