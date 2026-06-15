"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WhatIsInductor() {
  const [showField, setShowField] = useState(false);
  const [fieldStrength, setFieldStrength] = useState(0);

  useEffect(() => {
    let raf: number;
    const target = showField ? 1 : 0;
    const animate = () => {
      setFieldStrength(f => {
        const next = f + (target - f) * 0.06;
        if (Math.abs(next - target) < 0.001) return target;
        raf = requestAnimationFrame(animate);
        return next;
      });
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [showField]);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 1 · Definition
        </p>
        <h2 className="text-xl font-bold mb-1">What is an Inductor?</h2>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          A coil of wire that stores energy in a magnetic field when current flows through it. The coiled geometry concentrates the magnetic field and greatly amplifies the inductive effect.
        </p>

        {/* Animated coil SVG */}
        <div
          className="rounded-2xl border border-white/8 p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-[10px] text-white/25 font-mono uppercase tracking-widest mb-4">
            Interactive Coil — click to toggle current
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-72 h-48 flex items-center justify-center">
              <svg viewBox="0 0 280 180" className="w-full h-full overflow-visible">
                {/* Magnetic field lines (ovals) */}
                {[1, 2, 3, 4].map(n => (
                  <ellipse
                    key={n}
                    cx="140"
                    cy="90"
                    rx={30 + n * 26}
                    ry={20 + n * 18}
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth={1.5 - n * 0.2}
                    strokeDasharray="6 4"
                    opacity={fieldStrength * (0.7 - n * 0.12)}
                  />
                ))}

                {/* Core rectangle */}
                <rect x="80" y="78" width="120" height="24" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <text x="140" y="93" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">IRON CORE</text>

                {/* Coil turns */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                  const x = 90 + i * 14;
                  return (
                    <g key={i}>
                      <path
                        d={`M ${x} 78 Q ${x - 7} 62 ${x} 55 Q ${x + 7} 48 ${x + 7} 55 Q ${x + 14} 62 ${x + 7} 78`}
                        fill="none"
                        stroke="#EC4899"
                        strokeWidth="2.5"
                        opacity={0.8 + fieldStrength * 0.2}
                      />
                      <path
                        d={`M ${x} 102 Q ${x - 7} 118 ${x} 125 Q ${x + 7} 132 ${x + 7} 125 Q ${x + 14} 118 ${x + 7} 102`}
                        fill="none"
                        stroke="#EC4899"
                        strokeWidth="2.5"
                        opacity={0.8 + fieldStrength * 0.2}
                      />
                    </g>
                  );
                })}

                {/* Lead wires */}
                <line x1="40" y1="90" x2="85" y2="90" stroke="#EC4899" strokeWidth="2" opacity="0.6" />
                <line x1="195" y1="90" x2="240" y2="90" stroke="#EC4899" strokeWidth="2" opacity="0.6" />

                {/* Current flow arrows */}
                {showField && (
                  <>
                    <motion.circle
                      cx="40" cy="90" r="4" fill="#EC4899"
                      animate={{ cx: [40, 85] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle
                      cx="195" cy="90" r="4" fill="#EC4899"
                      animate={{ cx: [195, 240] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                  </>
                )}

                {/* N/S pole labels */}
                <text x="48" y="72" fill="#EC4899" fontSize="10" fontWeight="bold" opacity={fieldStrength * 0.9} fontFamily="monospace">N</text>
                <text x="224" y="72" fill="#F43F5E" fontSize="10" fontWeight="bold" opacity={fieldStrength * 0.9} fontFamily="monospace">S</text>

                {/* Field strength bar */}
                <rect x="10" y="140" width="260" height="6" rx="3" fill="rgba(255,255,255,0.05)" />
                <rect x="10" y="140" width={260 * fieldStrength} height="6" rx="3" fill="url(#fieldGrad)" />
                <text x="140" y="162" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
                  FIELD STRENGTH: {(fieldStrength * 100).toFixed(0)}%
                </text>
                <defs>
                  <linearGradient id="fieldGrad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <button
              onClick={() => setShowField(f => !f)}
              className="px-5 py-2 rounded-xl text-sm font-bold border transition-all"
              style={{
                background: showField ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: showField ? "rgba(236,72,153,0.4)" : "rgba(255,255,255,0.1)",
                color: showField ? "#EC4899" : "rgba(255,255,255,0.4)",
              }}
            >
              {showField ? "Current ON — Magnetic field active" : "Apply Current →"}
            </button>
          </div>
        </div>

        {/* Key info grid */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {/* Formula */}
          <div
            className="p-4 rounded-2xl border border-white/8"
            style={{ background: "rgba(236,72,153,0.04)" }}
          >
            <p className="text-[10px] text-white/25 font-mono uppercase tracking-widest mb-2">Key Formula</p>
            <div
              className="text-2xl font-black font-mono mb-2"
              style={{ color: "#EC4899" }}
            >
              V = L × dI/dt
            </div>
            <p className="text-xs text-white/45 leading-relaxed">
              Voltage across inductor is proportional to the <em>rate of change</em> of current — not the current itself.
            </p>
          </div>

          {/* Units */}
          <div
            className="p-4 rounded-2xl border border-white/8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <p className="text-[10px] text-white/25 font-mono uppercase tracking-widest mb-2">Unit: Henry (H)</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">1 H</span>
                <span className="text-white/25">Large — power electronics</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">1 mH</span>
                <span className="text-white/25">Medium — audio, filters</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">1 µH</span>
                <span className="text-white/25">Small — RF, DC-DC converters</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">1 nH</span>
                <span className="text-white/25">Tiny — PCB trace inductance</span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-4 rounded-2xl border border-white/6"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
              style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)" }}
            >
              📜
            </div>
            <div>
              <p className="text-sm font-bold text-white/70 mb-1">Michael Faraday · 1831</p>
              <p className="text-xs text-white/35 leading-relaxed">
                Faraday discovered electromagnetic induction — that a changing magnetic field induces a voltage in a nearby conductor. This fundamental principle underlies inductors, transformers, generators, and motors. The unit of capacitance (Farad) also bears his name.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
