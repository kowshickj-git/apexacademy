"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CurrentSimulatorProps {
  onSimUsed: () => void;
}

export default function CurrentSimulator({ onSimUsed }: CurrentSimulatorProps) {
  const [current, setCurrent] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const b = current / 5; // brightness 0-1
  const voltage = 9;
  const resistance = current > 0 ? (voltage / current).toFixed(1) : "∞";
  const electronCount = current === 0 ? 0 : Math.round(current * 1.6) + 1;
  const speed = current === 0 ? 0 : Math.max(0.75, 3.5 - current * 0.55);

  const handleChange = (v: number) => {
    setCurrent(v);
    if (!triggered && v > 0) { setTriggered(true); onSimUsed(); }
  };

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#08</p>
        <h2 className="text-2xl font-bold text-white">Current Simulator</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Circuit */}
        <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: "#18181B" }}>
          <svg viewBox="0 0 320 120" className="w-full h-auto">
            <defs>
              <filter id="cs-glow">
                <feGaussianBlur stdDeviation={b * 6} result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Wire path */}
            <polyline points="84,60 260,60" fill="none" stroke="#2D3748" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {current > 0 && (
              <polyline points="84,60 260,60" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" opacity={0.15 + b * 0.35} />
            )}

            {/* Battery */}
            <g filter={current > 0 ? "url(#cs-glow)" : undefined}>
              <rect x="10" y="32" width="74" height="56" rx="8" fill="#111827" stroke={current > 0 ? "#10B981" : "#374151"} strokeWidth="1.6" />
              <rect x="84" y="44" width="10" height="22" rx="3" fill={current > 0 ? "#10B981" : "#4B5563"} />
              <rect x="0" y="50" width="10" height="12" rx="2" fill="#4B5563" />
              <text x="47" y="57" textAnchor="middle" fill={current > 0 ? "#10B981" : "#6B7280"} fontSize="8" fontWeight="bold">9V · {current}A</text>
              <text x="47" y="68" textAnchor="middle" fill="#4B5563" fontSize="6.5">BATTERY</text>
              <text x="81" y="57" textAnchor="middle" fill={current > 0 ? "#10B981" : "#6B7280"} fontSize="13" fontWeight="bold">+</text>
              <text x="14" y="58" textAnchor="middle" fill="#6B7280" fontSize="11">−</text>
            </g>

            {/* LED glow aura */}
            {current > 0 && <>
              <circle cx="276" cy="60" r={22 + b * 22} fill="#10B981" opacity={b * 0.06} />
              <circle cx="276" cy="60" r={16 + b * 12} fill="#10B981" opacity={b * 0.08} />
            </>}

            {/* LED body */}
            <polygon
              points="260,45 260,75 290,60"
              fill={current > 0 ? `rgba(16,185,129,${0.15 + b * 0.7})` : "#1F2937"}
              stroke={current > 0 ? "#10B981" : "#374151"}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <line x1="290" y1="45" x2="290" y2="75" stroke={current > 0 ? "#10B981" : "#374151"} strokeWidth="2.5" strokeLinecap="round" />
            {/* Light rays */}
            {current > 0 && [[-15,-15],[0,-18],[15,-15]].map(([dx, dy], ri) => (
              <line key={ri}
                x1={296 + dx * 0.4} y1={56 + dy * 0.4}
                x2={296 + dx} y2={56 + dy}
                stroke="#10B981" strokeWidth="2" strokeLinecap="round"
                opacity={b * 0.85}
              >
                <animate attributeName="opacity"
                  values={`${b * 0.3};${b * 0.9};${b * 0.3}`}
                  dur="1.2s" begin={`${ri * 0.4}s`} repeatCount="indefinite"
                />
              </line>
            ))}
            <line x1="290" y1="60" x2="300" y2="60" stroke="#6B7280" strokeWidth="2" />

            {/* LED label */}
            <text x="275" y="98" textAnchor="middle" fill="#4B5563" fontSize="7.5">LED</text>

            {/* Electrons */}
            {Array.from({ length: electronCount }).map((_, i) => (
              <circle key={i} r="5" fill="#10B981">
                <animateMotion
                  path="M 94 60 L 260 60"
                  dur={`${speed}s`}
                  begin={`${(i * speed) / electronCount}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  keyTimes="0;0.07;0.93;1"
                  dur={`${speed}s`}
                  begin={`${(i * speed) / electronCount}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>

          {/* Readings */}
          <div className="grid grid-cols-3 gap-2 px-4 pb-4">
            {[
              { label: "Current", value: `${current} A`, color: "primary" },
              { label: "Voltage", value: `${voltage} V`, color: "secondary" },
              { label: "Resistance", value: `${resistance} Ω`, color: "muted" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border border-white/5 p-2.5 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={value}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-base font-extrabold tabular-nums ${color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-white/45"}`}
                  >
                    {value}
                  </motion.p>
                </AnimatePresence>
                <p className="text-[9px] text-white/25 font-mono uppercase mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="rounded-2xl border border-white/6 p-4 space-y-3" style={{ background: "#18181B" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Adjust Current</p>
            <span className="text-xl font-extrabold text-primary tabular-nums">{current} A</span>
          </div>
          <input
            type="range"
            min={0} max={5} step={0.5}
            value={current}
            onChange={(e) => handleChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #10B981 0%, #10B981 ${(current / 5) * 100}%, rgba(255,255,255,0.07) ${(current / 5) * 100}%, rgba(255,255,255,0.07) 100%)`,
            }}
          />
          <div className="flex justify-between text-[11px] text-white/20 font-mono">
            <span>0 A</span>
            <span>5 A (Max)</span>
          </div>
          <p className="text-xs text-center text-white/35">
            {current === 0 ? "Circuit OFF — no electrons moving" :
             current <= 1 ? "Low current — dim LED" :
             current <= 3 ? "Medium current — LED glowing" :
             "High current — LED at full brightness!"}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
