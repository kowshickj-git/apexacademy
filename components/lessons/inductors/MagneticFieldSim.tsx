"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onMagneticUsed: () => void;
}

export default function MagneticFieldSim({ onMagneticUsed }: Props) {
  const [current, setCurrent] = useState(0.5); // 0 to 1 A (can be negative for reverse)
  const [triggered, setTriggered] = useState(false);

  const L = 0.01; // 10 mH
  const energy = 0.5 * L * current * current;
  const fieldStrength = Math.abs(current);
  const isReverse = current < 0;

  const handleSlider = (val: number) => {
    setCurrent(val);
    if (!triggered && val !== 0.5) {
      setTriggered(true);
      onMagneticUsed();
    }
  };

  const numFieldLines = Math.round(fieldStrength * 5);
  const fieldColor = isReverse ? "#F59E0B" : "#EC4899";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Simulator 3 · Magnetic Field
        </p>
        <h2 className="text-xl font-bold mb-1">Magnetic Field vs Current</h2>
        <p className="text-white/45 text-sm mb-6">
          Drag the current slider to see magnetic field strength change. Reverse current flips the poles.
        </p>

        <div
          className="rounded-2xl border border-white/8 p-5"
          style={{ background: "rgba(236,72,153,0.03)" }}
        >
          {/* Current slider */}
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-white/50 font-mono">Current (I)</label>
              <span className="text-sm font-black" style={{ color: fieldColor }}>
                {current >= 0 ? "+" : ""}{current.toFixed(2)} A
              </span>
            </div>
            <div className="relative">
              <input
                type="range" min={-1} max={1} step={0.01} value={current}
                onChange={e => handleSlider(Number(e.target.value))}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{ accentColor: fieldColor }}
              />
              <div className="flex justify-between text-[9px] text-white/20 font-mono mt-1">
                <span>-1 A (reverse)</span>
                <span>0</span>
                <span>+1 A</span>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="flex justify-center mb-5">
            <svg viewBox="0 0 280 200" className="w-full max-w-xs">
              {/* Field lines */}
              {Array.from({ length: numFieldLines }).map((_, i) => {
                const scale = (i + 1) / numFieldLines;
                const rx = 20 + scale * 60;
                const ry = 12 + scale * 40;
                return (
                  <motion.ellipse
                    key={i}
                    cx="140"
                    cy="100"
                    rx={rx}
                    ry={ry}
                    fill="none"
                    stroke={fieldColor}
                    strokeWidth={1.5}
                    strokeDasharray="7 5"
                    opacity={fieldStrength * (0.8 - scale * 0.15)}
                    animate={{ rx, ry }}
                    transition={{ duration: 0.2 }}
                  />
                );
              })}

              {/* Coil core */}
              <rect x="90" y="88" width="100" height="24" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

              {/* Coil turns */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                  <path
                    d={`M ${98 + i * 16} 88 Q ${91 + i * 16} 78 ${98 + i * 16} 72 Q ${105 + i * 16} 66 ${105 + i * 16} 72 Q ${112 + i * 16} 78 ${105 + i * 16} 88`}
                    fill="none" stroke={fieldColor} strokeWidth="2" opacity={0.6 + fieldStrength * 0.3}
                  />
                  <path
                    d={`M ${98 + i * 16} 112 Q ${91 + i * 16} 122 ${98 + i * 16} 128 Q ${105 + i * 16} 134 ${105 + i * 16} 128 Q ${112 + i * 16} 122 ${105 + i * 16} 112`}
                    fill="none" stroke={fieldColor} strokeWidth="2" opacity={0.6 + fieldStrength * 0.3}
                  />
                </g>
              ))}

              {/* Lead wires with current arrows */}
              <line x1="30" y1="100" x2="88" y2="100" stroke={fieldColor} strokeWidth="2" opacity="0.5" />
              <line x1="192" y1="100" x2="250" y2="100" stroke={fieldColor} strokeWidth="2" opacity="0.5" />
              {fieldStrength > 0.1 && (
                <>
                  <motion.polygon
                    points={isReverse ? "58,96 50,100 58,104" : "50,96 58,100 50,104"}
                    fill={fieldColor}
                    opacity="0.8"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.polygon
                    points={isReverse ? "222,96 230,100 222,104" : "230,96 222,100 230,104"}
                    fill={fieldColor}
                    opacity="0.8"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 0.4 }}
                  />
                </>
              )}

              {/* Pole labels */}
              {!isReverse ? (
                <>
                  <text x="30" y="90" fill="#EC4899" fontSize="12" fontWeight="bold" opacity={fieldStrength * 0.9} fontFamily="monospace">N</text>
                  <text x="248" y="90" fill="#F43F5E" fontSize="12" fontWeight="bold" opacity={fieldStrength * 0.9} fontFamily="monospace">S</text>
                </>
              ) : (
                <>
                  <text x="30" y="90" fill="#F59E0B" fontSize="12" fontWeight="bold" opacity={fieldStrength * 0.9} fontFamily="monospace">S</text>
                  <text x="248" y="90" fill="#F59E0B" fontSize="12" fontWeight="bold" opacity={fieldStrength * 0.9} fontFamily="monospace">N</text>
                </>
              )}

              {/* Energy display */}
              <rect x="80" y="158" width="120" height="28" rx="6" fill="rgba(236,72,153,0.06)" stroke="rgba(236,72,153,0.15)" strokeWidth="1" />
              <text x="140" y="170" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">ENERGY STORED</text>
              <text x="140" y="181" textAnchor="middle" fill={fieldColor} fontSize="9" fontWeight="bold" fontFamily="monospace">
                E = ½LI² = {(energy * 1000).toFixed(3)} mJ
              </text>
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Current", value: `${Math.abs(current).toFixed(2)} A`, sub: isReverse ? "Reversed" : "Forward" },
              { label: "B Field", value: `${(fieldStrength * 100).toFixed(0)}%`, sub: "of max" },
              { label: "Energy", value: `${(energy * 1000).toFixed(3)} mJ`, sub: "E = ½LI²" },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-xl border border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[9px] text-white/25 font-mono">{s.label}</p>
                <p className="text-sm font-black" style={{ color: fieldColor }}>{s.value}</p>
                <p className="text-[9px] text-white/20">{s.sub}</p>
              </div>
            ))}
          </div>

          {isReverse && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2 rounded-xl text-xs text-center border"
              style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)", color: "#F59E0B" }}
            >
              Reversed current — N and S poles flip! Field direction reversed.
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
