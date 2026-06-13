"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LEVELS = [
  { amps: 0, label: "0 A", desc: "No current — circuit is open, electrons don't move", speed: 0 },
  { amps: 0.5, label: "0.5 A", desc: "Very low current — electrons drift slowly", speed: 4.5 },
  { amps: 1, label: "1 A", desc: "Normal current — steady electron flow", speed: 2.8 },
  { amps: 2, label: "2 A", desc: "High current — fast electron movement", speed: 1.6 },
  { amps: 5, label: "5 A", desc: "Peak current — electrons rushing at full speed!", speed: 0.9 },
];

interface ElectronFlowProps {
  onSimUsed: () => void;
}

export default function ElectronFlow({ onSimUsed }: ElectronFlowProps) {
  const [idx, setIdx] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const lv = LEVELS[idx];
  const brightness = lv.amps / 5;
  const electronCount = lv.amps === 0 ? 0 : Math.round(lv.amps * 1.4) + 1;

  const handle = (i: number) => {
    setIdx(i);
    if (!triggered) { setTriggered(true); onSimUsed(); }
  };

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#03</p>
        <h2 className="text-2xl font-bold text-white">Electron Flow</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Circuit diagram */}
        <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: "#18181B" }}>
          <svg viewBox="0 0 320 130" className="w-full h-auto">
            <defs>
              <filter id="ef-glow">
                <feGaussianBlur stdDeviation={2 + brightness * 4} result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Wire */}
            <line x1="84" y1="65" x2="236" y2="65" stroke="#2D3748" strokeWidth="5" strokeLinecap="round" />
            {lv.amps > 0 && (
              <line x1="84" y1="65" x2="236" y2="65" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" opacity={0.18 + brightness * 0.35} />
            )}

            {/* Battery */}
            <g filter={lv.amps > 0 ? "url(#ef-glow)" : undefined}>
              <rect x="12" y="36" width="72" height="58" rx="7" fill="#111827" stroke={lv.amps > 0 ? "#0EA5E9" : "#374151"} strokeWidth="1.5" />
              <rect x="84" y="48" width="10" height="20" rx="3" fill={lv.amps > 0 ? "#0EA5E9" : "#4B5563"} />
              <rect x="2" y="54" width="10" height="12" rx="2" fill="#4B5563" />
              <text x="48" y="62" textAnchor="middle" fill={lv.amps > 0 ? "#0EA5E9" : "#6B7280"} fontSize="10" fontWeight="bold">{lv.label}</text>
              <text x="48" y="75" textAnchor="middle" fill="#4B5563" fontSize="7">BATTERY</text>
              <text x="81" y="60" textAnchor="middle" fill={lv.amps > 0 ? "#0EA5E9" : "#6B7280"} fontSize="13" fontWeight="bold">+</text>
              <text x="16" y="62" textAnchor="middle" fill="#6B7280" fontSize="11">−</text>
            </g>

            {/* Bulb glow aura */}
            {lv.amps > 0 && <>
              <circle cx="263" cy="65" r={24 + brightness * 20} fill="#0EA5E9" opacity={brightness * 0.06} />
              <circle cx="263" cy="65" r={17 + brightness * 10} fill="#0EA5E9" opacity={brightness * 0.09} />
            </>}
            {/* Bulb glass */}
            <circle cx="263" cy="65" r="17"
              fill={lv.amps > 0 ? `rgba(14,165,233,${0.06 + brightness * 0.3})` : "#111827"}
              stroke={lv.amps > 0 ? "#0EA5E9" : "#374151"}
              strokeWidth="1.5"
            />
            {/* Filament */}
            <path d="M257 63 Q260 58 263 63 Q266 68 269 63" stroke={lv.amps > 0 ? "#0EA5E9" : "#374151"} strokeWidth={lv.amps > 0 ? 1.8 : 1} fill="none" strokeLinecap="round" />
            {/* Highlight */}
            {lv.amps > 0 && <circle cx="257" cy="60" r="3.5" fill="white" opacity={brightness * 0.28} />}
            {/* Rays */}
            {lv.amps > 0 && [[-15,-18],[0,-22],[15,-18]].map(([dx, dy], ri) => (
              <line key={ri}
                x1={263 + dx * 0.45} y1={65 + dy * 0.45}
                x2={263 + dx} y2={65 + dy}
                stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round"
                opacity={brightness * 0.8}
              >
                <animate attributeName="opacity"
                  values={`${brightness * 0.35};${brightness * 0.85};${brightness * 0.35}`}
                  dur="1.3s" begin={`${ri * 0.43}s`} repeatCount="indefinite"
                />
              </line>
            ))}
            {/* Leads */}
            <line x1="236" y1="65" x2="246" y2="65" stroke="#6B7280" strokeWidth="2" />
            <line x1="280" y1="65" x2="286" y2="65" stroke="#6B7280" strokeWidth="2" />

            {/* Labels */}
            <text x="263" y="100" textAnchor="middle" fill="#4B5563" fontSize="8">BULB</text>
            <text x="155" y="53" textAnchor="middle" fill="#374151" fontSize="7">WIRE</text>

            {/* Electrons */}
            {Array.from({ length: electronCount }).map((_, i) => (
              <circle key={i} r="5" fill="#0EA5E9">
                <animateMotion
                  path="M 94 65 L 236 65"
                  dur={`${lv.speed}s`}
                  begin={`${(i * lv.speed) / electronCount}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  keyTimes="0;0.07;0.93;1"
                  dur={`${lv.speed}s`}
                  begin={`${(i * lv.speed) / electronCount}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>

          {/* Current readout */}
          <div className="flex justify-center pb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/20" style={{ background: "rgba(14,165,233,0.07)" }}>
              <div
                className="w-2 h-2 rounded-full transition-all duration-400"
                style={{
                  background: lv.amps > 0 ? "#0EA5E9" : "#4B5563",
                  boxShadow: lv.amps > 0 ? "0 0 6px #0EA5E9" : "none",
                }}
              />
              <span className="text-sm font-bold text-secondary tabular-nums">I = {lv.label}</span>
            </div>
          </div>
        </div>

        {/* Current buttons */}
        <div className="rounded-2xl border border-white/6 p-4 space-y-3" style={{ background: "#18181B" }}>
          <p className="text-sm font-semibold text-white">Select Current</p>
          <div className="grid grid-cols-5 gap-1.5">
            {LEVELS.map((l, i) => (
              <button
                key={l.label}
                onClick={() => handle(i)}
                className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  idx === i ? "bg-secondary text-background" : "text-white/38 hover:text-white/60"
                }`}
                style={idx !== i ? { background: "rgba(255,255,255,0.04)" } : {}}
              >
                {l.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-center text-white/40"
            >
              {lv.desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
