"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BrightnessInfo {
  label: string;
  color: string;
  bg: string;
}

function getBrightnessInfo(v: number): BrightnessInfo {
  if (v === 0) return { label: "LED OFF", color: "#6B7280", bg: "bg-white/5" };
  if (v <= 1.5) return { label: "Very Dim", color: "#FCD34D", bg: "bg-yellow-500/10" };
  if (v <= 4) return { label: "Dim", color: "#FBBF24", bg: "bg-yellow-400/10" };
  if (v <= 7) return { label: "Medium", color: "#10B981", bg: "bg-primary/10" };
  if (v <= 10) return { label: "Bright", color: "#10B981", bg: "bg-primary/15" };
  return { label: "Maximum!", color: "#34D399", bg: "bg-emerald-400/15" };
}

export default function InteractiveDemo() {
  const [voltage, setVoltage] = useState(0);

  const brightness = voltage / 12; // 0–1
  const ledOpacity = voltage === 0 ? 0 : 0.12 + brightness * 0.88;
  const glowRadius = brightness * 28;
  const glowOpacity = brightness * 0.9;
  const batteryGlow = brightness * 14;
  const info = getBrightnessInfo(voltage);

  // LED SVG color channels - greenish at low voltage, bright emerald at high
  const ledFill = voltage === 0 ? "#1F2937" : "#10B981";

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="03" title="Interactive Voltage Demo" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Circuit visualization */}
        <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
          <div className="relative">
            <svg
              viewBox="0 0 320 140"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Interactive circuit with battery and LED"
            >
              <defs>
                <radialGradient id="ledGrad" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="white" stopOpacity={ledOpacity * 0.9} />
                  <stop offset="60%" stopColor={ledFill} stopOpacity={ledOpacity} />
                  <stop offset="100%" stopColor={ledFill} stopOpacity={ledOpacity * 0.6} />
                </radialGradient>
                <filter id="battGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation={batteryGlow * 0.4} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="ledMainGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation={glowRadius * 0.5 + 1} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ── Wires (circuit loop) ── */}
              {/* Top wire */}
              <path
                d="M 92 45 L 240 45"
                fill="none"
                stroke="#2D3748"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Bottom wire */}
              <path
                d="M 92 95 L 240 95"
                fill="none"
                stroke="#2D3748"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Right side connector */}
              <path
                d="M 240 45 L 240 95"
                fill="none"
                stroke="#2D3748"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Wire glow when voltage > 0 */}
              {voltage > 0 && (
                <>
                  <path
                    d="M 92 45 L 240 45"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={brightness * 0.35}
                  />
                  <path
                    d="M 92 95 L 240 95"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={brightness * 0.25}
                  />
                </>
              )}

              {/* ── Battery ── */}
              <g filter={voltage > 0 ? "url(#battGlow)" : undefined}>
                {/* Battery body */}
                <rect x="16" y="36" width="76" height="68" rx="7" fill="#111827" stroke={voltage > 0 ? "#10B981" : "#374151"} strokeWidth="1.5" />
                {/* Cell stripes */}
                <line x1="44" y1="46" x2="44" y2="94" stroke="#1F2937" strokeWidth="1.5" />
                <line x1="60" y1="46" x2="60" y2="94" stroke="#1F2937" strokeWidth="1.5" />
                <line x1="76" y1="46" x2="76" y2="94" stroke="#1F2937" strokeWidth="1.5" />
                {/* + terminal (top) */}
                <rect x="40" y="28" width="20" height="10" rx="3" fill={voltage > 0 ? "#10B981" : "#374151"} />
                {/* - terminal (bottom, smaller) */}
                <rect x="46" y="102" width="14" height="8" rx="2" fill="#4B5563" />
                {/* Voltage readout */}
                <text x="52" y="66" textAnchor="middle" fill={voltage > 0 ? "#10B981" : "#4B5563"} fontSize="14" fontWeight="bold">
                  {voltage}V
                </text>
                <text x="52" y="80" textAnchor="middle" fill="#6B7280" fontSize="7">BATTERY</text>
                {/* + / - symbols */}
                <text x="50" y="25" textAnchor="middle" fill={voltage > 0 ? "#10B981" : "#4B5563"} fontSize="10" fontWeight="bold">+</text>
                <text x="50" y="116" textAnchor="middle" fill="#6B7280" fontSize="10">−</text>
              </g>

              {/* ── Animated electrons ── */}
              {voltage > 0 &&
                [0, 1, 2, 3].map((i) => (
                  <circle key={i} r="4" fill="#10B981" opacity={0.9}>
                    <animateMotion
                      dur={`${Math.max(0.6, 2.8 - brightness * 2.1)}s`}
                      begin={`${i * (Math.max(0.6, 2.8 - brightness * 2.1) / 4)}s`}
                      repeatCount="indefinite"
                      path="M 92 45 L 220 45"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.9;0.9;0"
                      keyTimes="0;0.1;0.9;1"
                      dur={`${Math.max(0.6, 2.8 - brightness * 2.1)}s`}
                      begin={`${i * (Math.max(0.6, 2.8 - brightness * 2.1) / 4)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}

              {/* ── LED ── */}
              <g filter="url(#ledMainGlow)" transform="translate(240, 70)">
                {/* Outer glow rings */}
                {voltage > 0 && (
                  <>
                    <circle cx="0" cy="0" r={30 + glowRadius * 0.8} fill={ledFill} opacity={glowOpacity * 0.04} />
                    <circle cx="0" cy="0" r={22 + glowRadius * 0.5} fill={ledFill} opacity={glowOpacity * 0.08} />
                  </>
                )}
                {/* LED body */}
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="url(#ledGrad)"
                  stroke={voltage > 0 ? "#10B981" : "#374151"}
                  strokeWidth="1.5"
                />
                {/* Inner highlight */}
                {voltage > 0 && (
                  <circle cx="-5" cy="-6" r="5" fill="white" opacity={brightness * 0.35} />
                )}
                {/* LED symbol lines */}
                <line x1="-6" y1="-6" x2="6" y2="6" stroke={voltage > 0 ? "rgba(16,185,129,0.5)" : "#1F2937"} strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="-6" x2="-6" y2="6" stroke={voltage > 0 ? "rgba(16,185,129,0.5)" : "#1F2937"} strokeWidth="2" strokeLinecap="round" />
                {/* Light emission rays */}
                {voltage > 0 &&
                  [[-14, -20], [0, -24], [14, -20]].map(([dx, dy], i) => (
                    <line
                      key={i}
                      x1={dx * 0.55}
                      y1={dy * 0.55}
                      x2={dx}
                      y2={dy}
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity={ledOpacity * 0.9}
                    >
                      <animate
                        attributeName="opacity"
                        values={`${ledOpacity * 0.4};${ledOpacity};${ledOpacity * 0.4}`}
                        dur="1.2s"
                        begin={`${i * 0.4}s`}
                        repeatCount="indefinite"
                      />
                    </line>
                  ))}
              </g>

              {/* ── Labels ── */}
              <text x="52" y="130" textAnchor="middle" fill="#4B5563" fontSize="8">BATTERY</text>
              <text x="240" y="130" textAnchor="middle" fill="#4B5563" fontSize="8">LED</text>
            </svg>
          </div>

          {/* Status badge */}
          <div className="px-4 pb-4 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={info.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${info.bg} border border-white/10`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: info.color, boxShadow: `0 0 6px ${info.color}` }}
                />
                <span className="text-sm font-semibold" style={{ color: info.color }}>
                  {info.label}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slider */}
        <div className="bg-surface rounded-2xl border border-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Voltage</p>
            <motion.span
              key={voltage}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-extrabold text-primary tabular-nums"
            >
              {voltage}V
            </motion.span>
          </div>

          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            aria-label={`Voltage: ${voltage} volts`}
            style={{
              background: `linear-gradient(to right, #10B981 0%, #10B981 ${(voltage / 12) * 100}%, rgba(255,255,255,0.08) ${(voltage / 12) * 100}%, rgba(255,255,255,0.08) 100%)`,
            }}
          />

          {/* Voltage reference marks */}
          <div className="grid grid-cols-5 text-center">
            {[
              { v: 0, label: "0V", sub: "OFF" },
              { v: 3, label: "3V", sub: "Dim" },
              { v: 6, label: "6V", sub: "Med" },
              { v: 9, label: "9V", sub: "Bright" },
              { v: 12, label: "12V", sub: "Max" },
            ].map(({ v, label, sub }) => (
              <button
                key={v}
                onClick={() => setVoltage(v)}
                className={`py-1 rounded-lg transition-colors ${
                  voltage === v ? "bg-primary/15 text-primary" : "text-white/25 hover:text-white/50"
                }`}
              >
                <p className="text-[11px] font-mono font-medium">{label}</p>
                <p className="text-[9px]">{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info callout */}
        <div className="bg-surface rounded-xl border border-white/5 p-3 flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#0EA5E9" strokeWidth="1.5" />
              <line x1="8" y1="7" x2="8" y2="12" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="4.5" r="0.75" fill="#0EA5E9" />
            </svg>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Try dragging the slider from 0 to 12V. Notice how the LED gets brighter as voltage increases — that's electrical pressure at work!
          </p>
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
