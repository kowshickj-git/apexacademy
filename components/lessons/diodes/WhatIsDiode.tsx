"use client";

import { motion } from "framer-motion";

export default function WhatIsDiode() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 1 · Concept</p>
        <h2 className="text-xl font-bold mb-1">What Is a Diode?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          A diode is a two-terminal semiconductor component that acts like a one-way valve for electrical current.
          Current can flow through it in one direction — and is blocked in the other. That&apos;s its entire job. And that simple trick is used billions of times per second, everywhere.
        </p>

        {/* One-way door analogy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/8 overflow-hidden mb-6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="px-5 py-3 border-b border-white/6">
            <p className="text-xs font-bold text-white/50">Analogy: The One-Way Door</p>
          </div>
          <div className="p-5">
            {/* Visual */}
            <div className="flex items-center justify-center gap-2 mb-4 py-4 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.01)" }}>
              {/* Person A going through */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-2xl" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>🚶</div>
                <p className="text-[9px] text-primary/60 font-mono">current</p>
              </div>
              {/* Arrow right */}
              <svg width="32" height="12" viewBox="0 0 32 12" className="text-primary">
                <path d="M0 6h28M22 1l8 5-8 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              {/* Door */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-14 rounded border-2 relative flex items-center justify-center"
                  style={{ borderColor: "rgba(139,92,246,0.5)", background: "rgba(139,92,246,0.1)" }}
                >
                  <span className="text-xl">🚪</span>
                  <div
                    className="absolute -right-2 top-3 bottom-3 w-1 rounded-full"
                    style={{ background: "#A78BFA" }}
                  />
                </div>
                <p className="text-[9px] text-purple-400/60 font-mono">diode</p>
              </div>
              {/* Arrow right - passes */}
              <svg width="32" height="12" viewBox="0 0 32 12" className="text-primary">
                <path d="M0 6h28M22 1l8 5-8 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              <div className="text-2xl">🚶</div>

              {/* Divider */}
              <div className="w-px h-14 bg-white/8 mx-2" />

              {/* Person B blocked */}
              <div className="text-2xl opacity-40">🚶</div>
              <svg width="32" height="12" viewBox="0 0 32 12">
                <path d="M30 6H2M8 1l-8 5 8 5" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              <div className="text-lg">🚫</div>
              <div
                className="w-10 h-14 rounded border-2 relative flex items-center justify-center"
                style={{ borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)" }}
              >
                <span className="text-xl">🚪</span>
              </div>
            </div>
            <p className="text-xs text-white/40 text-center">
              Current flows freely forward (green arrows) — but is blocked in reverse (red).
            </p>
          </div>
        </motion.div>

        {/* Key facts */}
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: "⚡", title: "Two terminals", body: "Anode (+) and Cathode (−). Current enters at the anode and exits at the cathode." },
            { icon: "🧱", title: "Semiconductor", body: "Made from silicon. A P-type layer meets an N-type layer, creating the famous P-N junction." },
            { icon: "🔁", title: "Rectifier", body: "Diodes convert AC (alternating) to DC (direct) current — essential in every power supply." },
            { icon: "🛡️", title: "Protector", body: "A single reverse-wired diode protects circuits from battery polarity mistakes." },
          ].map(({ icon, title, body }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-white/7 p-4"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-lg mb-1">{icon}</p>
              <p className="text-xs font-bold text-white/70 mb-1">{title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
