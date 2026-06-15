"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BigIdea() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const sinVal = Math.sin((phase * Math.PI) / 180);
  const primaryCurrentIntensity = Math.abs(sinVal);
  const ledOn = primaryCurrentIntensity > 0.3;

  // Generate sine wave path
  const makeSinePath = (width: number, height: number, amplitude: number, freq: number, phaseOffset: number, steps = 60) => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const angle = (i / steps) * Math.PI * 2 * freq + phaseOffset;
      const y = height / 2 - Math.sin(angle) * amplitude;
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  };

  const primaryPath = makeSinePath(80, 40, 14, 2, (phase * Math.PI) / 180);
  const secondaryPath = makeSinePath(80, 40, 14, 2, (phase * Math.PI) / 180 + Math.PI * 0.1);

  return (
    <section className="px-4 sm:px-8 py-12 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 1 · Big Idea
        </p>
        <h2 className="text-xl font-bold mb-2">How Transformers Work</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Two coils, one magnetic core — energy flows through magnetism alone. No electrical connection needed.
        </p>

        {/* Main animation */}
        <div
          className="rounded-2xl border border-white/8 p-6 mb-6 overflow-hidden"
          style={{ background: "rgba(139,92,246,0.04)" }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Primary coil */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Primary</span>
              <div className="relative">
                <svg width="100" height="80" viewBox="0 0 100 80">
                  {/* AC source */}
                  <circle cx="12" cy="40" r="10" fill="none" stroke="rgba(139,92,246,0.4)" strokeWidth="1.2" />
                  <path d={`M 7 40 Q 9.5 ${40 - sinVal * 8} 12 40 Q 14.5 ${40 + sinVal * 8} 17 40`} stroke="#8B5CF6" strokeWidth="1.5" fill="none" />
                  {/* Wire */}
                  <line x1="22" y1="40" x2="32" y2="40" stroke="rgba(139,92,246,0.5)" strokeWidth="1.2" />
                  {/* Coil loops (3 loops) */}
                  {[0, 1, 2].map((i) => (
                    <ellipse
                      key={i}
                      cx={42 + i * 12}
                      cy={40}
                      rx={5}
                      ry={14}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="1.8"
                      opacity={0.7 + primaryCurrentIntensity * 0.3}
                    />
                  ))}
                  {/* Current flow dots */}
                  <motion.circle
                    cx={22 + ((phase % 60) / 60) * 44}
                    cy={40}
                    r={2}
                    fill="#8B5CF6"
                    opacity={primaryCurrentIntensity * 0.9}
                  />
                </svg>
              </div>
              {/* Sine wave display */}
              <div className="rounded-lg border border-white/6 px-2 py-1" style={{ background: "rgba(0,0,0,0.3)" }}>
                <svg width="80" height="40" viewBox="0 0 80 40">
                  <path d={primaryPath} stroke="#8B5CF6" strokeWidth="1.5" fill="none" opacity="0.8" />
                </svg>
              </div>
              <span className="text-[10px] font-mono" style={{ color: "#8B5CF6" }}>AC Input</span>
            </div>

            {/* Core (magnetic) */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-white/25 font-mono">Core</span>
              <div
                className="relative flex flex-col items-center justify-center rounded-lg"
                style={{
                  width: 32,
                  height: 80,
                  background: `rgba(139,92,246,${0.08 + primaryCurrentIntensity * 0.18})`,
                  border: `1px solid rgba(139,92,246,${0.2 + primaryCurrentIntensity * 0.3})`,
                }}
              >
                {/* Field lines pulsing */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      background: "#8B5CF6",
                      top: `${15 + i * 17}%`,
                      opacity: primaryCurrentIntensity * 0.7,
                    }}
                    animate={{ scale: [1, 1.3, 1], opacity: [primaryCurrentIntensity * 0.5, primaryCurrentIntensity * 0.9, primaryCurrentIntensity * 0.5] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
                <span className="text-[8px] text-white/20 font-mono mt-1 writing-mode-vertical">Fe</span>
              </div>
              <span className="text-[9px] text-white/20 font-mono">Magnetic</span>
              <div
                className="text-[8px] font-mono text-center"
                style={{ color: `rgba(139,92,246,${0.3 + primaryCurrentIntensity * 0.6})` }}
              >
                {primaryCurrentIntensity > 0.5 ? "Flux ↑" : "Flux ↓"}
              </div>
            </div>

            {/* Secondary coil */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Secondary</span>
              <div className="relative">
                <svg width="100" height="80" viewBox="0 0 100 80">
                  {/* 9 coil loops */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ellipse
                      key={i}
                      cx={10 + i * 8}
                      cy={40}
                      rx={3.5}
                      ry={14}
                      fill="none"
                      stroke="#A78BFA"
                      strokeWidth="1.5"
                      opacity={0.6 + primaryCurrentIntensity * 0.4}
                    />
                  ))}
                  {/* Wire to LED */}
                  <line x1="82" y1="40" x2="92" y2="40" stroke="rgba(167,139,250,0.5)" strokeWidth="1.2" />
                  {/* LED symbol */}
                  <polygon
                    points="92,34 100,40 92,46"
                    fill={ledOn ? "rgba(167,139,250,0.8)" : "rgba(255,255,255,0.1)"}
                    stroke={ledOn ? "#A78BFA" : "rgba(255,255,255,0.2)"}
                    strokeWidth="1"
                  />
                  <line x1="100" y1="34" x2="100" y2="46" stroke={ledOn ? "#A78BFA" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />
                  {/* LED glow when on */}
                  {ledOn && (
                    <circle cx="96" cy="40" r="8" fill="rgba(167,139,250,0.15)" />
                  )}
                </svg>
              </div>
              {/* Secondary sine wave */}
              <div className="rounded-lg border border-white/6 px-2 py-1" style={{ background: "rgba(0,0,0,0.3)" }}>
                <svg width="80" height="40" viewBox="0 0 80 40">
                  <path d={secondaryPath} stroke="#A78BFA" strokeWidth="1.5" fill="none" opacity={0.6 + primaryCurrentIntensity * 0.4} />
                </svg>
              </div>
              <span className="text-[10px] font-mono" style={{ color: "#A78BFA" }}>
                {ledOn ? "LED ON" : "AC Output"}
              </span>
            </div>
          </div>

          <div
            className="mt-4 text-center text-[10px] text-white/25 font-mono"
          >
            No electrical connection between coils — only magnetism transfers energy
          </div>
        </div>

        {/* Quote */}
        <div
          className="rounded-2xl p-5 mb-6 border"
          style={{ borderColor: "rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.06)" }}
        >
          <p className="text-base font-semibold text-white/80 leading-relaxed italic">
            "A transformer changes voltage through magnetism alone — no electrical connection needed."
          </p>
        </div>

        {/* Concept cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "Mutual Induction",
              icon: "🔄",
              desc: "AC in primary creates changing magnetic field. Changing field induces voltage in secondary — Faraday's Law in action.",
            },
            {
              title: "Step-Up",
              icon: "⬆",
              desc: "More secondary turns than primary. Voltage increases, current decreases. Power stays constant.",
            },
            {
              title: "Step-Down",
              icon: "⬇",
              desc: "Fewer secondary turns than primary. Voltage decreases, current increases. Power stays constant.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl p-4 border border-white/8"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="text-xl mb-2">{card.icon}</div>
              <h3 className="text-sm font-bold text-white/80 mb-1">{card.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
