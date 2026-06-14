"use client";

import { motion } from "framer-motion";

const objectives = [
  "Understand what an LED is and how it differs from a regular diode",
  "Identify the anode (+) and cathode (−) legs of a real LED",
  "Explain what forward bias means and why it makes an LED glow",
  "Calculate the correct resistor value for any LED + power supply combination",
  "Understand how different semiconductor materials produce different LED colors",
  "Mix red, green, and blue LEDs to produce any visible color",
  "Identify common LED failure modes and how to avoid them",
  "Apply LEDs safely in breadboard circuits with proper current limiting",
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
              style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.25)", color: "#FCA5A5" }}
            >
              Lesson 08
            </span>
            <span className="text-[10px] text-white/25 font-mono uppercase tracking-widest">Electronics Fundamentals</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
            LED{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #EF4444, #8B5CF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fundamentals
            </span>
          </h1>

          <p className="text-white/50 text-base leading-relaxed mb-6">
            LEDs (Light Emitting Diodes) are the most visible component in electronics.
            From your phone screen to traffic lights to the ISS — they run on a beautiful quantum trick at a P-N junction.
          </p>

          {/* LED preview */}
          <div
            className="inline-flex items-center gap-5 px-5 py-3 rounded-2xl border border-red-500/20 mb-6"
            style={{ background: "rgba(239,68,68,0.07)" }}
          >
            <svg width="36" height="56" viewBox="0 0 36 56">
              {/* LED body */}
              <ellipse cx="18" cy="20" rx="14" ry="14" fill="rgba(239,68,68,0.3)" stroke="#FCA5A5" strokeWidth="1.5" />
              <ellipse cx="18" cy="12" rx="8" ry="6" fill="rgba(239,68,68,0.15)" />
              {/* Flat edge */}
              <path d="M4 24 Q4 34 18 34 Q32 34 32 24" fill="rgba(239,68,68,0.3)" stroke="#FCA5A5" strokeWidth="1.5" />
              {/* Legs */}
              <line x1="15" y1="34" x2="15" y2="56" stroke="#9CA3AF" strokeWidth="2" />
              <line x1="21" y1="34" x2="21" y2="56" stroke="#9CA3AF" strokeWidth="2" />
              {/* Anode longer */}
              <line x1="15" y1="50" x2="21" y2="50" stroke="#9CA3AF" strokeWidth="1" />
            </svg>
            <div>
              <p className="text-xs font-bold text-red-300">Standard 5mm LED</p>
              <p className="text-[10px] text-white/35 mt-0.5">Long leg = Anode (+)</p>
              <p className="text-[10px] text-white/35">Short leg = Cathode (−)</p>
              <p className="text-[10px] text-white/35">Flat side = Cathode side</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { icon: "🎓", label: "Beginner" },
              { icon: "⏱", label: "~15 min" },
              { icon: "⚡", label: "180 XP" },
              { icon: "🔬", label: "4 Simulators" },
              { icon: "❓", label: "20 Quiz Q's" },
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
                  <div className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
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
