"use client";

import { motion } from "framer-motion";

const objectives = [
  "Understand what a diode is and why it only allows one-way current flow",
  "Identify the anode (+) and cathode (−) terminals and the circuit symbol",
  "Explain the difference between forward bias and reverse bias",
  "Use a diode to convert AC to DC (rectification)",
  "Build a polarity-protection circuit using a diode",
  "Recognise common diode types: LED, Zener, Schottky",
  "Read a diode symbol in a schematic and know the current direction",
  "Apply diodes safely in your own beginner circuits",
];

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 py-12 border-b border-white/5">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
              style={{ background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.25)", color: "#A78BFA" }}
            >
              Lesson 07
            </span>
            <span className="text-[10px] text-white/25 font-mono uppercase tracking-widest">Electronics Fundamentals</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
            Diodes{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fundamentals
            </span>
          </h1>

          <p className="text-white/50 text-base leading-relaxed mb-6">
            A diode is electronics&apos; traffic cop — it lets current flow one way and blocks it in the other.
            Inside every charger, radio, and LED is at least one diode doing its job silently.
          </p>

          {/* Symbol preview */}
          <div
            className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl border border-purple-500/20 mb-6"
            style={{ background: "rgba(139,92,246,0.08)" }}
          >
            <svg width="70" height="32" viewBox="0 0 70 32">
              <line x1="0" y1="16" x2="18" y2="16" stroke="#A78BFA" strokeWidth="2" />
              <polygon points="18,6 18,26 38,16" fill="rgba(139,92,246,0.4)" stroke="#A78BFA" strokeWidth="1.5" />
              <line x1="38" y1="6" x2="38" y2="26" stroke="#A78BFA" strokeWidth="2" />
              <line x1="38" y1="16" x2="70" y2="16" stroke="#A78BFA" strokeWidth="2" />
              <text x="10" y="30" fontSize="8" fill="rgba(167,139,250,0.6)" fontFamily="monospace">A</text>
              <text x="34" y="30" fontSize="8" fill="rgba(167,139,250,0.6)" fontFamily="monospace">K</text>
            </svg>
            <div>
              <p className="text-xs font-bold" style={{ color: "#A78BFA" }}>Diode Symbol</p>
              <p className="text-[10px] text-white/35">A = Anode (+) · K = Cathode (−)</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { icon: "🎓", label: "Beginner" },
              { icon: "⏱", label: "~12 min" },
              { icon: "⚡", label: "130 XP" },
              { icon: "🔬", label: "4 Simulators" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-white/45 px-3 py-1.5 rounded-full border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Objectives */}
          <div
            className="rounded-2xl border border-white/7 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="px-5 py-3 border-b border-white/5">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">What you&apos;ll learn</p>
            </div>
            <div className="p-4 grid sm:grid-cols-2 gap-2">
              {objectives.map((obj) => (
                <div key={obj} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
