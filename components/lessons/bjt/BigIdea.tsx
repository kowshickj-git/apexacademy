"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function WaterValveAnalogy() {
  const [tick, setTick] = useState(0);
  const [valveOpen, setValveOpen] = useState(0.5); // 0-1

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 100), 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let v = 0;
    let dir = 1;
    const id = setInterval(() => {
      v += dir * 0.012;
      if (v >= 1) { v = 1; dir = -1; }
      if (v <= 0.1) { v = 0.1; dir = 1; }
      setValveOpen(v);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const baseFlow = valveOpen * 1; // 0-1 mA
  const collectorFlow = valveOpen * 100; // 0-100 mA (beta=100)
  const dotPos = (tick / 100);

  // Pipe colors
  const tinyPipeColor = `rgba(239,68,68,${0.3 + valveOpen * 0.5})`;
  const bigPipeColor = `rgba(239,68,68,${0.15 + valveOpen * 0.6})`;

  return (
    <div className="w-full">
      <svg viewBox="0 0 600 280" className="w-full max-w-2xl mx-auto" style={{ display: "block" }}>
        {/* Background */}
        <rect x="0" y="0" width="600" height="280" rx="16" fill="rgba(255,255,255,0.02)" />

        {/* === SMALL PIPE (Base current) === */}
        {/* Label: "Base (control)" */}
        <text x="20" y="55" fill="rgba(240,240,245,0.5)" fontSize="10" fontWeight="600">BASE CURRENT</text>
        <text x="20" y="67" fill="#EF4444" fontSize="9">{(baseFlow).toFixed(2)} mA</text>

        {/* Small pipe body */}
        <rect x="20" y="75" width="180" height="16" rx="8" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.25)" strokeWidth="1" />

        {/* Flowing dots in small pipe */}
        {[0, 0.33, 0.66].map((offset, i) => {
          const pos = ((dotPos + offset) % 1);
          const cx = 20 + pos * 180;
          return (
            <circle
              key={i}
              cx={cx}
              cy={83}
              r={3}
              fill="#EF4444"
              opacity={valveOpen * 0.8}
            />
          );
        })}

        {/* Valve handle (small) */}
        <rect x="200" y="68" width="30" height="30" rx="6" fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth="1.5" />
        <text x="215" y="87" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="700">B</text>

        {/* Arrow down to main valve */}
        <line x1="215" y1="98" x2="215" y2="130" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
        <polygon points="211,128 215,136 219,128" fill="#EF4444" opacity="0.6" />

        {/* === MAIN PIPE (Collector → Emitter) === */}
        <text x="20" y="155" fill="rgba(240,240,245,0.5)" fontSize="10" fontWeight="600">COLLECTOR CURRENT</text>
        <text x="20" y="167" fill="#EF4444" fontSize="9">{collectorFlow.toFixed(0)} mA</text>

        {/* Big pipe body */}
        <rect x="20" y="175" width="560" height="40" rx="12" fill={`rgba(239,68,68,${0.05 + valveOpen * 0.08})`} stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" />

        {/* Main valve in center */}
        <rect x="195" y="155" width="80" height="80" rx="10" fill="rgba(239,68,68,0.12)" stroke="#EF4444" strokeWidth="2" />
        <text x="235" y="190" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="800">BJT</text>
        <text x="235" y="204" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="8">NPN</text>

        {/* Valve opening indicator */}
        <rect
          x="205"
          y="210"
          width={60 * valveOpen}
          height="8"
          rx="3"
          fill="#EF4444"
          opacity="0.5"
        />
        <rect x="205" y="210" width="60" height="8" rx="3" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />

        {/* Flowing dots in big pipe - left side (before BJT) */}
        {[0, 0.5].map((offset, i) => {
          const pos = ((dotPos + offset) % 1);
          const cx = 20 + pos * 175;
          return (
            <circle
              key={`pre-${i}`}
              cx={cx}
              cy={195}
              r={5}
              fill="#EF4444"
              opacity={valveOpen * 0.7}
            />
          );
        })}

        {/* Flowing dots in big pipe - right side (after BJT) */}
        {[0, 0.33, 0.66].map((offset, i) => {
          const pos = ((dotPos + offset) % 1);
          const cx = 275 + pos * 305;
          return (
            <circle
              key={`post-${i}`}
              cx={cx}
              cy={195}
              r={5}
              fill="#EF4444"
              opacity={valveOpen * 0.7}
            />
          );
        })}

        {/* Labels: C and E */}
        <text x="30" y="172" fill="rgba(240,240,245,0.4)" fontSize="9">C</text>
        <text x="565" y="172" fill="rgba(240,240,245,0.4)" fontSize="9">E</text>

        {/* === Ratio display === */}
        <rect x="20" y="235" width="560" height="34" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <text x="300" y="249" textAnchor="middle" fill="rgba(240,240,245,0.5)" fontSize="9">AMPLIFICATION RATIO (β = 100)</text>
        <text x="300" y="263" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="800">
          {`I_B = ${(baseFlow).toFixed(2)}mA  →  I_C = β × I_B = ${collectorFlow.toFixed(0)}mA`}
        </text>
      </svg>
    </div>
  );
}

const CONCEPTS = [
  {
    title: "Current-Controlled",
    desc: "A small base current (I_B) controls a large collector current (I_C). This is current amplification.",
    icon: "⚡",
    color: "#EF4444",
  },
  {
    title: "β = I_C / I_B",
    desc: "The DC current gain β (beta or hFE) is typically 50-300. A β of 100 means 1mA base controls 100mA collector.",
    icon: "✕",
    color: "#F87171",
  },
  {
    title: "NPN & PNP Types",
    desc: "NPN: current INTO base enables C→E flow. PNP: current OUT OF base enables E→C flow. NPN is most common.",
    icon: "⇄",
    color: "#FCA5A5",
  },
];

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
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div className="text-3xl mb-4">🔩</div>
          <h2
            className="text-xl sm:text-2xl font-black mb-2 leading-snug"
            style={{ color: "#F0F0F5" }}
          >
            "A BJT is a{" "}
            <span style={{ color: "#EF4444" }}>current-controlled</span>{" "}
            current amplifier — like a water valve where a tiny handle controls a massive flow."
          </h2>
          <p className="text-sm mt-3" style={{ color: "rgba(240,240,245,0.45)" }}>
            1mA into the base controls 100mA through the collector. That&apos;s a 100x amplification.
          </p>
        </div>

        {/* Water valve animation */}
        <div
          className="rounded-2xl p-4 mb-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-xs text-center mb-3 font-mono" style={{ color: "rgba(240,240,245,0.35)" }}>
            LIVE SIMULATION — base current automatically modulating →
          </p>
          <WaterValveAnalogy />
          <div className="flex justify-center gap-8 mt-3">
            <div className="text-center">
              <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.4)" }}>NPN BJT</div>
              <div className="text-xs" style={{ color: "rgba(240,240,245,0.25)" }}>current into base → C→E flow</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.4)" }}>PNP BJT</div>
              <div className="text-xs" style={{ color: "rgba(240,240,245,0.25)" }}>current out of base → E→C flow</div>
            </div>
          </div>
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
