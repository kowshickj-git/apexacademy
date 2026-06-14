"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BottomCTA() {
  return (
    <section className="px-4 pt-4 pb-10 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Next lesson preview */}
        <div
          className="rounded-2xl border border-orange-500/18 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.07) 0%, rgba(16,185,129,0.04) 100%)" }}
        >
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-[10px] text-orange-400/55 uppercase tracking-widest font-semibold">Up Next</p>
            <h3 className="text-lg font-bold text-white mt-1">Lesson 4: Resistors</h3>
            <p className="text-sm text-white/45 mt-0.5">
              Discover the coloured bands on resistors, how to read them, and how to choose the right resistor for any circuit.
            </p>
          </div>
          <div className="px-5 py-3 flex flex-wrap gap-2">
            {["Colour Band Code", "Resistor Types", "Series & Parallel", "Circuit Calculator"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full border border-orange-400/18 text-orange-400/60"
                style={{ background: "rgba(249,115,22,0.07)" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="px-5 pb-5">
            <Link
              href="/electronics/resistors"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-primary text-background hover:opacity-90 transition-opacity"
            >
              Start Lesson 4: Resistors →
            </Link>
          </div>
        </div>

        {/* Back */}
        <Link
          href="/index.html"
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white/40 hover:text-white/65 transition-colors border border-white/6 hover:border-white/12"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to APEX Academy
        </Link>
      </motion.div>
    </section>
  );
}
