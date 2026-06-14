"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onSimUsed: () => void; }

const presets = [
  { label: "0 Ω", value: 0 },
  { label: "100 Ω", value: 100 },
  { label: "220 Ω", value: 220 },
  { label: "1 KΩ", value: 1000 },
  { label: "10 KΩ", value: 10000 },
];

function formatR(r: number) {
  if (r === 0) return "0 Ω";
  if (r >= 1000) return `${(r / 1000).toFixed(r % 1000 === 0 ? 0 : 1)} KΩ`;
  return `${r} Ω`;
}

export default function ResistanceSimulator({ onSimUsed }: Props) {
  const [resistance, setResistance] = useState(220);
  const [triggered, setTriggered] = useState(false);

  const handleChange = (v: number) => {
    setResistance(v);
    if (!triggered) { setTriggered(true); onSimUsed(); }
  };

  const safeR = Math.max(resistance, 1);
  const voltage = 5;
  const currentMa = (voltage / safeR) * 1000;
  const brightness = Math.min(1, Math.max(0.05, 1 - Math.log10(safeR + 1) / 4.15));
  const electronSpeed = 0.4 + (resistance / 10000) * 4.5;

  const getLEDColor = () => {
    if (brightness > 0.7) return "#10B981";
    if (brightness > 0.4) return "#34D399";
    if (brightness > 0.2) return "#FCD34D";
    return "#6B7280";
  };

  const getLabel = () => {
    if (resistance === 0) return { text: "Maximum Current — LED Extremely Bright", color: "#10B981" };
    if (resistance <= 150) return { text: "Very Bright — High Current", color: "#10B981" };
    if (resistance <= 350) return { text: "Normal — Ideal for LED", color: "#34D399" };
    if (resistance <= 1500) return { text: "Dim — Reduced Current", color: "#FCD34D" };
    return { text: "Very Dim — Minimal Current", color: "#FB923C" };
  };

  const lc = getLEDColor();
  const ll = getLabel();

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="07" title="Resistance Simulator" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-primary/15 overflow-hidden"
        style={{ background: "rgba(16,185,129,0.03)" }}
      >
        <div className="p-5">
          <p className="text-sm text-white/65 leading-relaxed mb-5">
            Drag the slider to change resistance and watch how it affects LED brightness and current flow. This is exactly how resistors protect LEDs in real circuits.
          </p>

          {/* Circuit visualization */}
          <div className="relative rounded-xl border border-white/5 overflow-hidden mb-5" style={{ background: "rgba(0,0,0,0.3)", height: 100 }}>
            <svg width="100%" height="100" viewBox="0 0 320 100" preserveAspectRatio="xMidYMid meet">
              {/* Battery */}
              <rect x="8" y="32" width="34" height="36" rx="4" fill="#18181B" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
              <line x1="18" y1="40" x2="18" y2="60" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="28" y1="44" x2="28" y2="56" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
              <text x="21" y="77" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontFamily="monospace">5V</text>

              {/* Wire */}
              <line x1="42" y1="50" x2="90" y2="50" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="155" y1="50" x2="260" y2="50" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />

              {/* Resistor symbol */}
              <rect x="90" y="40" width="65" height="20" rx="3" fill="#18181B" stroke="rgba(249,115,22,0.45)" strokeWidth="1.5" />
              <text x="122" y="49" fill="#F97316" fontSize="8" textAnchor="middle" fontFamily="monospace">{formatR(resistance)}</text>
              <text x="122" y="58" fill="rgba(249,115,22,0.5)" fontSize="6" textAnchor="middle" fontFamily="monospace">Resistor</text>

              {/* LED */}
              <circle cx="278" cy="50" r="14" fill={`${lc}22`} stroke={lc} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 ${brightness * 10}px ${lc})` }} />
              <circle cx="278" cy="50" r={7 * brightness} fill={lc} opacity={brightness} />
              <text x="278" y="74" fill="rgba(255,255,255,0.3)" fontSize="6.5" textAnchor="middle">LED</text>

              {/* Electrons */}
              {[0, 1, 2].map((i) => (
                <circle key={i} cy="50" r="4" fill="#0EA5E9" opacity={brightness * 0.9}>
                  <animateMotion
                    path="M 42 0 L 218 0"
                    dur={`${electronSpeed}s`}
                    begin={`${i * (electronSpeed / 3)}s`}
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values={`0;${brightness * 0.9};${brightness * 0.9};0`} keyTimes="0;0.08;0.92;1" dur={`${electronSpeed}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-3 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Resistance</p>
              <p className="text-base font-extrabold" style={{ color: "#F97316" }}>{formatR(resistance)}</p>
            </div>
            <div className="text-center p-3 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Current</p>
              <p className="text-base font-extrabold" style={{ color: "#0EA5E9" }}>
                {resistance === 0 ? "∞" : currentMa >= 1000 ? `${(currentMa / 1000).toFixed(1)}A` : `${currentMa.toFixed(1)}mA`}
              </p>
            </div>
            <div className="text-center p-3 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Brightness</p>
              <p className="text-base font-extrabold" style={{ color: lc }}>{Math.round(brightness * 100)}%</p>
            </div>
          </div>

          {/* Status label */}
          <div
            className="text-center py-2 rounded-xl border mb-4 text-xs font-semibold"
            style={{ background: `${ll.color}12`, borderColor: `${ll.color}30`, color: ll.color }}
          >
            {ll.text}
          </div>

          {/* Presets */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => handleChange(p.value)}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all"
                style={resistance === p.value
                  ? { background: "rgba(249,115,22,0.18)", borderColor: "rgba(249,115,22,0.4)", color: "#F97316" }
                  : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                }
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div>
            <div className="flex justify-between text-[10px] text-white/35 mb-2">
              <span>0 Ω (No resistance)</span>
              <span>10 KΩ (High resistance)</span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={10}
              value={resistance}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="slider-orange w-full"
              style={{ background: `linear-gradient(to right, #F97316 0%, #F97316 ${(resistance / 10000) * 100}%, rgba(255,255,255,0.1) ${(resistance / 10000) * 100}%, rgba(255,255,255,0.1) 100%)` }}
            />
          </div>
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
