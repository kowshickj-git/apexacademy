"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

function LightSwitchAnim() {
  const [on, setOn] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Room */}
      <div
        className="relative w-64 h-40 rounded-2xl border overflow-hidden transition-all duration-700 cursor-pointer"
        style={{
          background: on
            ? "rgba(251,191,36,0.12)"
            : "rgba(10,10,20,0.85)",
          borderColor: on ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)",
          boxShadow: on ? "0 0 40px rgba(251,191,36,0.15)" : "none",
        }}
        onClick={() => setOn((v) => !v)}
      >
        {/* Ceiling bulb */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Wire */}
          <div className="w-0.5 h-4" style={{ background: on ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.15)" }} />
          {/* Bulb */}
          <div
            className="relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500"
            style={{
              background: on ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.05)",
              borderColor: on ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.1)",
              boxShadow: on ? "0 0 20px 8px rgba(251,191,36,0.35), 0 0 60px 20px rgba(251,191,36,0.12)" : "none",
            }}
          >
            <span className="text-sm">{on ? "💡" : "⚫"}</span>
          </div>
        </div>

        {/* Room label */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <p className="text-xs font-mono" style={{ color: on ? "rgba(251,191,36,0.7)" : "rgba(255,255,255,0.2)" }}>
            {on ? "LIGHTS ON" : "LIGHTS OFF"}
          </p>
        </div>

        {/* Glow overlay */}
        <AnimatePresence>
          {on && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.18) 0%, transparent 70%)" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Switch plate */}
      <div
        className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border cursor-pointer select-none"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
        onClick={() => setOn((v) => !v)}
      >
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Wall Switch</p>
        {/* Toggle lever */}
        <div
          className="relative w-10 h-16 rounded-lg border-2 overflow-hidden transition-all duration-300"
          style={{
            background: on ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.05)",
            borderColor: on ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.2)",
          }}
        >
          <motion.div
            className="absolute left-1 right-1 h-7 rounded-md"
            animate={{ top: on ? "4px" : "calc(100% - 32px)" }}
            transition={{ type: "spring", damping: 18, stiffness: 280 }}
            style={{ background: on ? CYAN : "rgba(255,255,255,0.25)" }}
          />
        </div>
        <p className="text-xs font-bold mt-1" style={{ color: on ? CYAN : "rgba(255,255,255,0.3)" }}>
          {on ? "ON" : "OFF"}
        </p>
      </div>

      <p className="text-[11px] text-white/30 text-center">Click the switch or room to toggle</p>
    </div>
  );
}

const concepts = [
  {
    icon: "🔴",
    title: "Open Circuit",
    desc: "No path for current — electricity cannot flow. The switch is 'open', breaking the wire.",
    color: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.3)",
    textColor: "#EF4444",
  },
  {
    icon: "🟢",
    title: "Closed Circuit",
    desc: "Complete path — current flows freely. The switch is 'closed', completing the wire.",
    color: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    textColor: "#10B981",
  },
  {
    icon: "🔵",
    title: "Control",
    desc: "You decide when electricity flows. Switches give you power over the circuit.",
    color: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.3)",
    textColor: CYAN,
  },
];

export default function BigIdea() {
  return (
    <section className="px-4 sm:px-8 py-12 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 1 · Big Idea
        </p>
        <h2 className="text-2xl font-bold mb-8">The Gatekeeper of Every Circuit</h2>

        {/* Interactive animation */}
        <div className="flex justify-center mb-10">
          <LightSwitchAnim />
        </div>

        {/* Quote */}
        <div
          className="px-5 py-4 rounded-2xl border mb-8 max-w-2xl"
          style={{ background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.2)" }}
        >
          <p className="text-base font-medium italic leading-relaxed" style={{ color: "rgba(240,240,245,0.8)" }}>
            "A switch is a gatekeeper — it decides if electricity can pass or not."
          </p>
        </div>

        {/* Concept cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {concepts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-4 rounded-2xl border"
              style={{ background: c.color, borderColor: c.border }}
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="text-sm font-bold mb-1.5" style={{ color: c.textColor }}>{c.title}</p>
              <p className="text-xs leading-relaxed text-white/50">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
