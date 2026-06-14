"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const CONCEPTS = [
  {
    title: "One Path",
    desc: "Current must travel through every component — there is no shortcut or alternate route.",
    icon: "→",
    color: "#F97316",
  },
  {
    title: "Same Current",
    desc: "Identical current flows through all parts of the circuit. I₁ = I₂ = I₃ = I_total",
    icon: "≡",
    color: "#10B981",
  },
  {
    title: "Divided Voltage",
    desc: "Voltage splits across components proportionally to their resistance. V_total = V₁+V₂+V₃",
    icon: "÷",
    color: "#0EA5E9",
  },
];

function TrainDiagram() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 60), 60);
    return () => clearInterval(id);
  }, []);

  const dotPos = (tick / 60) * 100;

  const nodes = [
    { x: 60, label: "🔋", sublabel: "9V" },
    { x: 210, label: "R1", sublabel: "220Ω", isComp: true },
    { x: 360, label: "LED1", sublabel: "2V", isLed: true },
    { x: 510, label: "LED2", sublabel: "2V", isLed: true },
  ];

  const pathLength = 600;
  const dotX = (dotPos / 100) * pathLength;

  return (
    <div className="w-full overflow-x-auto py-4">
      <svg width="660" height="100" viewBox="0 0 660 100" className="mx-auto max-w-full">
        {/* Wire top */}
        <line x1="60" y1="40" x2="600" y2="40" stroke="rgba(249,115,22,0.3)" strokeWidth="2" strokeDasharray="4 3" />
        {/* Wire bottom */}
        <line x1="60" y1="70" x2="600" y2="70" stroke="rgba(249,115,22,0.3)" strokeWidth="2" strokeDasharray="4 3" />
        {/* Left close */}
        <line x1="60" y1="40" x2="60" y2="70" stroke="rgba(249,115,22,0.3)" strokeWidth="2" />
        {/* Right close */}
        <line x1="600" y1="40" x2="600" y2="70" stroke="rgba(249,115,22,0.3)" strokeWidth="2" />

        {/* Battery */}
        <rect x="30" y="28" width="60" height="26" rx="6" fill="rgba(249,115,22,0.12)" stroke="#F97316" strokeWidth="1.5" />
        <text x="60" y="43" textAnchor="middle" fill="#F97316" fontSize="11" fontWeight="700">🔋 9V</text>

        {/* R1 box */}
        <rect x="180" y="28" width="60" height="26" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
        <text x="210" y="39" textAnchor="middle" fill="rgba(240,240,245,0.7)" fontSize="9" fontWeight="600">R1</text>
        <text x="210" y="50" textAnchor="middle" fill="rgba(240,240,245,0.4)" fontSize="8">220Ω</text>

        {/* LED1 */}
        <circle cx="360" cy="41" r="15" fill="rgba(249,115,22,0.12)" stroke="#F97316" strokeWidth="1.5" />
        <text x="360" y="38" textAnchor="middle" fill="#FB923C" fontSize="9" fontWeight="700">LED</text>
        <text x="360" y="49" textAnchor="middle" fill="rgba(249,115,22,0.6)" fontSize="8">2V</text>

        {/* LED2 */}
        <circle cx="510" cy="41" r="15" fill="rgba(249,115,22,0.12)" stroke="#F97316" strokeWidth="1.5" />
        <text x="510" y="38" textAnchor="middle" fill="#FB923C" fontSize="9" fontWeight="700">LED</text>
        <text x="510" y="49" textAnchor="middle" fill="rgba(249,115,22,0.6)" fontSize="8">2V</text>

        {/* Return label */}
        <text x="330" y="86" textAnchor="middle" fill="rgba(240,240,245,0.3)" fontSize="9">return path</text>

        {/* Moving dot on top wire */}
        <circle
          cx={30 + (dotX / pathLength) * 570}
          cy="40"
          r="4"
          fill="#F97316"
          opacity="0.9"
        >
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Arrow labels */}
        <text x="145" y="33" fill="rgba(249,115,22,0.5)" fontSize="10">→</text>
        <text x="295" y="33" fill="rgba(249,115,22,0.5)" fontSize="10">→</text>
        <text x="445" y="33" fill="rgba(249,115,22,0.5)" fontSize="10">→</text>
        <text x="560" y="33" fill="rgba(249,115,22,0.5)" fontSize="10">→</text>
      </svg>
    </div>
  );
}

export default function BigIdea() {
  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Quote card */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-8 text-center"
          style={{
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.2)",
          }}
        >
          <div className="text-3xl mb-4">💡</div>
          <h2
            className="text-xl sm:text-2xl font-black mb-2 leading-snug"
            style={{ color: "#F0F0F5" }}
          >
            "In a series circuit, electricity has only{" "}
            <span style={{ color: "#F97316" }}>ONE path</span> to follow —
            like a train on a single track."
          </h2>
          <p className="text-sm mt-3" style={{ color: "rgba(240,240,245,0.45)" }}>
            Every component must share the same track. If the track breaks anywhere, the whole train stops.
          </p>
        </div>

        {/* Train diagram */}
        <div
          className="rounded-2xl p-4 mb-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-xs text-center mb-3 font-mono" style={{ color: "rgba(240,240,245,0.35)" }}>
            LIVE CIRCUIT SIMULATION — current flowing →
          </p>
          <TrainDiagram />
        </div>

        {/* 3 concept cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {CONCEPTS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${c.color}22`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black mb-3"
                style={{ background: `${c.color}15`, color: c.color }}
              >
                {c.icon}
              </div>
              <h3 className="font-bold mb-1.5" style={{ color: c.color }}>
                {c.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
