"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

const timeline = [
  { year: "1800s", label: "Relay Switches", desc: "Electromagnetically operated, used in telegraphs. A current in one coil moved a metal arm to close another circuit." },
  { year: "1900s", label: "Toggle Switches", desc: "Mechanical latching switches. Flip up = ON, flip down = OFF. Standard in industrial equipment and home wiring." },
  { year: "1970s", label: "Push Buttons", desc: "Momentary switches spring back when released. Keyboards, calculators, and arcade machines popularised them." },
  { year: "Today", label: "Smart Switches", desc: "Push button + microcontroller + relay = Wi-Fi controllable switches. Touch panels, capacitive sensors, voice control." },
];

const terms = [
  { label: "OPEN", color: "#EF4444", bg: "rgba(239,68,68,0.12)", desc: "No connection — current cannot flow" },
  { label: "CLOSED", color: "#10B981", bg: "rgba(16,185,129,0.12)", desc: "Connected — current can flow" },
  { label: "NO", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", desc: "Normally Open — open at rest" },
  { label: "NC", color: CYAN, bg: "rgba(6,182,212,0.12)", desc: "Normally Closed — closed at rest" },
];

function WireAnim() {
  const [closed, setClosed] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-4 p-6 rounded-2xl border cursor-pointer select-none"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
      onClick={() => setClosed((v) => !v)}
    >
      <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Click to toggle</p>
      <svg width="240" height="60" viewBox="0 0 240 60">
        {/* Left wire */}
        <line x1="10" y1="30" x2="80" y2="30" stroke={closed ? CYAN : "rgba(255,255,255,0.3)"} strokeWidth="3" strokeLinecap="round" />
        {/* Battery symbol */}
        <rect x="4" y="22" width="6" height="16" rx="1" fill={closed ? CYAN : "rgba(255,255,255,0.3)"} />
        {/* Left contact */}
        <circle cx="80" cy="30" r="4" fill={closed ? CYAN : "rgba(255,255,255,0.2)"} />
        {/* Right contact */}
        <circle cx="160" cy="30" r="4" fill={closed ? CYAN : "rgba(255,255,255,0.2)"} />
        {/* Gap / bridge */}
        <AnimatePresence mode="wait">
          {closed ? (
            <motion.line
              key="closed"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              x1="80" y1="30" x2="160" y2="30"
              stroke={CYAN}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : (
            <motion.g key="open">
              <line x1="80" y1="30" x2="100" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
              <text x="115" y="12" fontSize="11" fill="rgba(239,68,68,0.8)" textAnchor="middle" fontFamily="monospace">GAP</text>
            </motion.g>
          )}
        </AnimatePresence>
        {/* Right wire */}
        <line x1="160" y1="30" x2="220" y2="30" stroke={closed ? CYAN : "rgba(255,255,255,0.3)"} strokeWidth="3" strokeLinecap="round" />
        {/* LED bulb */}
        <circle cx="228" cy="30" r="8" fill={closed ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.07)"} stroke={closed ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" />
        <text x="228" y="34" fontSize="8" textAnchor="middle" fill={closed ? "#fff" : "rgba(255,255,255,0.3)"}>💡</text>
        {/* Labels */}
        <text x="120" y="52" fontSize="10" fill={closed ? "#10B981" : "#EF4444"} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
          {closed ? "CLOSED — Current flows" : "OPEN — No current"}
        </text>
      </svg>
    </div>
  );
}

export default function WhatIsSwitch() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 2 · What Is a Switch?
        </p>
        <h2 className="text-xl font-bold mb-4">Understanding Switches</h2>

        <p className="text-sm text-white/55 leading-relaxed mb-7 max-w-2xl">
          A switch is a mechanical device with two states: <strong className="text-white/80">OPEN</strong> (circuit broken, no current) and{" "}
          <strong className="text-white/80">CLOSED</strong> (circuit complete, current flows). It controls whether electricity can travel through a wire.
        </p>

        {/* Interactive wire */}
        <div className="mb-8 max-w-lg">
          <WireAnim />
        </div>

        {/* Water valve analogy */}
        <div
          className="p-4 rounded-2xl border mb-8 max-w-2xl"
          style={{ background: "rgba(6,182,212,0.05)", borderColor: "rgba(6,182,212,0.18)" }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: CYAN }}>💧 Water Valve Analogy</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Think of a switch as a water valve. <span className="text-white/70">Valve open = water flows</span> through the pipe (closed circuit).{" "}
            <span className="text-white/70">Valve closed = no water</span> (open circuit). The naming seems backwards but refers to the <em>circuit</em> state, not the switch mechanism.
          </p>
        </div>

        {/* Key terms */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-white/40 mb-3">Key Terms</p>
          <div className="flex flex-wrap gap-2">
            {terms.map((t) => (
              <div key={t.label} className="group relative">
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-bold border cursor-default"
                  style={{ background: t.bg, borderColor: t.color + "55", color: t.color }}
                  title={t.desc}
                >
                  {t.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {terms.map((t) => (
              <div key={t.label} className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono shrink-0" style={{ background: t.bg, color: t.color }}>
                  {t.label}
                </span>
                <p className="text-[11px] text-white/40 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-xs font-semibold text-white/40 mb-4">History of Switches</p>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: "rgba(6,182,212,0.2)" }} />
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 pl-4"
                >
                  <div className="shrink-0 w-9 h-9 rounded-full border flex items-center justify-center z-10" style={{ background: "rgba(6,182,212,0.12)", borderColor: "rgba(6,182,212,0.3)" }}>
                    <span className="text-[8px] font-bold font-mono text-center leading-tight" style={{ color: CYAN }}>{t.year.replace("Today", "Now")}</span>
                  </div>
                  <div className="pb-4 flex-1">
                    <p className="text-sm font-bold text-white/80 mb-0.5">{t.label}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
