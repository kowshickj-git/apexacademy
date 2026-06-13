"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const analogies = [
  {
    electrical: "Voltage",
    water: "Water Pressure",
    desc: "How hard electrons are pushed",
    color: "primary" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v14M6 7l4-4 4 4" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    electrical: "Current",
    water: "Water Flow",
    desc: "How many electrons pass through",
    color: "secondary" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10h14M13 6l4 4-4 4" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    electrical: "Resistance",
    water: "Pipe Width",
    desc: "How much the wire opposes flow",
    color: "muted" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="8" width="14" height="4" rx="1" stroke="#9CA3AF" strokeWidth="1.8" />
        <line x1="7" y1="8" x2="7" y2="12" stroke="#9CA3AF" strokeWidth="1.5" />
        <line x1="10" y1="8" x2="10" y2="12" stroke="#9CA3AF" strokeWidth="1.5" />
        <line x1="13" y1="8" x2="13" y2="12" stroke="#9CA3AF" strokeWidth="1.5" />
      </svg>
    ),
  },
];

function getDescription(v: number): string {
  if (v === 0) return "No voltage — no pressure — electrons stand still";
  if (v <= 2) return "Very low voltage — faint pressure — electrons barely move";
  if (v <= 5) return "Low voltage — gentle pressure — slow electron flow";
  if (v <= 8) return "Medium voltage — steady pressure — moderate flow";
  if (v <= 10) return "High voltage — strong pressure — fast electron flow";
  return "Maximum voltage — maximum pressure — very fast flow!";
}

function getPressureLabel(v: number): string {
  if (v === 0) return "Empty";
  if (v <= 3) return "Low";
  if (v <= 7) return "Medium";
  if (v <= 10) return "High";
  return "Maximum";
}

export default function WaterAnalogy() {
  const [voltage, setVoltage] = useState(6);

  const level = voltage / 12; // 0–1
  const colorClass = voltage <= 3 ? "#0EA5E9" : voltage <= 8 ? "#0EA5E9" : "#0EA5E9";

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="02" title="Real World Analogy" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Analogy cards */}
        <div className="grid grid-cols-3 gap-2">
          {analogies.map(({ electrical, water, desc, color, icon }) => (
            <div
              key={electrical}
              className="bg-surface rounded-xl p-3 border border-white/5 flex flex-col items-center text-center gap-1.5"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                {icon}
              </div>
              <p
                className={`text-xs font-semibold ${
                  color === "primary"
                    ? "text-primary"
                    : color === "secondary"
                    ? "text-secondary"
                    : "text-white/50"
                }`}
              >
                {electrical}
              </p>
              <p className="text-[10px] text-white/30 leading-tight">=</p>
              <p className="text-[11px] text-white/55 leading-tight">{water}</p>
            </div>
          ))}
        </div>

        {/* Tank + Visualization */}
        <div className="bg-surface rounded-2xl border border-white/5 p-4">
          <div className="flex items-end justify-center gap-6">
            {/* Water tank */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <svg width="80" height="120" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
                  {/* Tank outline */}
                  <rect x="10" y="8" width="60" height="100" rx="5" fill="none" stroke="#374151" strokeWidth="2" />
                  {/* Tank background */}
                  <rect x="11" y="9" width="58" height="98" rx="4" fill="#111827" />

                  {/* Clip path for water */}
                  <clipPath id="tankMask">
                    <rect x="11" y="9" width="58" height="98" rx="4" />
                  </clipPath>

                  {/* Water fill */}
                  <motion.rect
                    x={11}
                    width={58}
                    height={98 * level}
                    fill={colorClass}
                    opacity={0.5}
                    clipPath="url(#tankMask)"
                    animate={{
                      y: 9 + 98 * (1 - level),
                      height: 98 * level,
                    }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  />

                  {/* Water shine */}
                  {level > 0 && (
                    <motion.rect
                      x={14}
                      width={16}
                      height={98 * level * 0.6}
                      fill="white"
                      opacity={0.04}
                      rx={3}
                      clipPath="url(#tankMask)"
                      animate={{
                        y: 9 + 98 * (1 - level) + 4,
                        height: 98 * level * 0.6,
                      }}
                      transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    />
                  )}

                  {/* Pressure label */}
                  <text
                    x="40" y="60"
                    textAnchor="middle"
                    fill={level > 0.45 ? "#ffffff" : "#6B7280"}
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {getPressureLabel(voltage)}
                  </text>

                  {/* Pipe outlet */}
                  <rect x="30" y="108" width="20" height="12" rx="3" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/40">Water Tank</p>
                <p className="text-xs text-secondary font-medium">= Battery</p>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex flex-col items-center gap-1 pb-8">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 20 L32 20 M24 12 L32 20 L24 28" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="space-y-1 text-center">
                <p className="text-[10px] text-white/25">pushes</p>
              </div>
            </div>

            {/* Pipe / wire */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative overflow-hidden" style={{ width: 48, height: 120 }}>
                {/* Pipe body */}
                <div
                  className="absolute inset-0 rounded-xl border-2 border-[#374151]"
                  style={{ background: "#111827" }}
                />
                {/* Flow droplets */}
                {voltage > 0 &&
                  [0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        width: 10,
                        height: 14,
                        background: "#0EA5E9",
                        opacity: 0.75,
                      }}
                      initial={{ top: -14 }}
                      animate={{ top: 120 }}
                      transition={{
                        duration: Math.max(0.6, 3 - (voltage / 12) * 2.4),
                        repeat: Infinity,
                        delay: i * (Math.max(0.6, 3 - (voltage / 12) * 2.4) / 3),
                        ease: "linear",
                      }}
                    />
                  ))}
                {voltage === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[9px] text-white/20 rotate-90 whitespace-nowrap">no flow</p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-white/40">Pipe</p>
                <p className="text-xs text-secondary font-medium">= Wire</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="bg-surface rounded-2xl border border-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Voltage</p>
            <motion.span
              key={voltage}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-extrabold text-primary tabular-nums"
            >
              {voltage}V
            </motion.span>
          </div>

          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            aria-label="Voltage slider"
            style={{
              background: `linear-gradient(to right, #10B981 0%, #10B981 ${(voltage / 12) * 100}%, rgba(255,255,255,0.08) ${(voltage / 12) * 100}%, rgba(255,255,255,0.08) 100%)`,
            }}
          />

          <div className="flex justify-between text-[11px] text-white/25 font-mono">
            <span>0V</span>
            <span>3V</span>
            <span>6V</span>
            <span>9V</span>
            <span>12V</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={getDescription(voltage)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-white/50 text-center pt-1 border-t border-white/5"
            >
              {getDescription(voltage)}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
