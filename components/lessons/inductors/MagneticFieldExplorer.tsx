"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "idle" | "increase" | "steady" | "decrease";

export default function MagneticFieldExplorer() {
  const [mode, setMode] = useState<Mode>("idle");
  const [fieldLevel, setFieldLevel] = useState(0.3);
  const [backEmfVisible, setBackEmfVisible] = useState(false);

  const handleIncrease = () => {
    setMode("increase");
    setBackEmfVisible(false);
    let level = fieldLevel;
    const interval = setInterval(() => {
      level = Math.min(level + 0.04, 1);
      setFieldLevel(level);
      if (level >= 1) {
        clearInterval(interval);
        setMode("steady");
      }
    }, 60);
  };

  const handleDecrease = () => {
    setMode("decrease");
    setBackEmfVisible(true);
    let level = fieldLevel;
    const interval = setInterval(() => {
      level = Math.max(level - 0.04, 0.05);
      setFieldLevel(level);
      if (level <= 0.05) {
        clearInterval(interval);
        setMode("idle");
        setTimeout(() => setBackEmfVisible(false), 1500);
      }
    }, 60);
  };

  const modeLabel: Record<Mode, string> = {
    idle: "Field at rest — click Increase Current to see expansion",
    increase: "Current increasing — field lines expanding outward (energy being stored)",
    steady: "Current steady — field stable. Click Decrease to see back-EMF",
    decrease: "Current decreasing — field collapsing inward — back-EMF generated!",
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 2 · Interactive Explorer
        </p>
        <h2 className="text-xl font-bold mb-1">Magnetic Field Explorer</h2>
        <p className="text-white/45 text-sm mb-6">
          Interact with the coil to see magnetic field lines expand and collapse.
        </p>

        <div
          className="rounded-2xl border border-white/8 p-6"
          style={{ background: "rgba(236,72,153,0.03)" }}
        >
          {/* Status */}
          <div
            className="mb-4 px-3 py-2 rounded-xl text-xs text-center"
            style={{
              background: mode === "decrease" ? "rgba(251,146,60,0.1)" : "rgba(236,72,153,0.08)",
              color: mode === "decrease" ? "#FB923C" : "rgba(236,72,153,0.85)",
              border: `1px solid ${mode === "decrease" ? "rgba(251,146,60,0.2)" : "rgba(236,72,153,0.15)"}`,
            }}
          >
            {modeLabel[mode]}
          </div>

          {/* Coil + field visualization */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                {/* Magnetic field ovals — N-S poles */}
                {[1, 2, 3, 4, 5].map(n => {
                  const opacity = fieldLevel * (0.75 - n * 0.1);
                  const rx = 12 + n * 22;
                  const ry = 8 + n * 14;
                  const isExpanding = mode === "increase";
                  const isCollapsing = mode === "decrease";
                  return (
                    <motion.ellipse
                      key={n}
                      cx="100"
                      cy="100"
                      rx={rx}
                      ry={ry}
                      fill="none"
                      stroke={isCollapsing ? "#FB923C" : "#EC4899"}
                      strokeWidth={1.8 - n * 0.2}
                      strokeDasharray={isCollapsing ? "4 6" : "8 4"}
                      opacity={Math.max(0, opacity)}
                      animate={isExpanding
                        ? { rx: [rx - 8, rx], ry: [ry - 5, ry], opacity: [opacity * 0.3, opacity] }
                        : isCollapsing
                        ? { rx: [rx, rx - 8], ry: [ry, ry - 5], opacity: [opacity, opacity * 0.3] }
                        : {}}
                      transition={{ duration: 0.6, delay: n * 0.05, repeat: (isExpanding || isCollapsing) ? Infinity : 0 }}
                    />
                  );
                })}

                {/* Back-EMF arrows when collapsing */}
                <AnimatePresence>
                  {backEmfVisible && mode === "decrease" && (
                    <>
                      {[30, 90, 150, 210, 270, 330].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const r = 55;
                        const x = 100 + r * Math.cos(rad);
                        const y = 100 + r * Math.sin(rad);
                        return (
                          <motion.g key={angle}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 0.8, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="#FB923C"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              ←
                            </text>
                          </motion.g>
                        );
                      })}
                    </>
                  )}
                </AnimatePresence>

                {/* Core/Coil */}
                <rect x="64" y="86" width="72" height="28" rx="4" fill="rgba(236,72,153,0.08)" stroke="rgba(236,72,153,0.3)" strokeWidth="1.5" />
                {/* Coil turns */}
                {[0, 1, 2, 3].map(i => (
                  <g key={i}>
                    <path
                      d={`M ${72 + i * 14} 86 Q ${65 + i * 14} 76 ${72 + i * 14} 70 Q ${79 + i * 14} 64 ${79 + i * 14} 70 Q ${86 + i * 14} 76 ${79 + i * 14} 86`}
                      fill="none" stroke="#EC4899" strokeWidth="2" opacity="0.7"
                    />
                    <path
                      d={`M ${72 + i * 14} 114 Q ${65 + i * 14} 124 ${72 + i * 14} 130 Q ${79 + i * 14} 136 ${79 + i * 14} 130 Q ${86 + i * 14} 124 ${79 + i * 14} 114`}
                      fill="none" stroke="#EC4899" strokeWidth="2" opacity="0.7"
                    />
                  </g>
                ))}

                {/* Pole labels */}
                <text x="38" y="98" fill="#EC4899" fontSize="11" fontWeight="bold" opacity={fieldLevel * 0.9} fontFamily="monospace">N</text>
                <text x="155" y="98" fill="#F43F5E" fontSize="11" fontWeight="bold" opacity={fieldLevel * 0.9} fontFamily="monospace">S</text>

                {/* Current direction */}
                <text x="100" y="98" textAnchor="middle" fill="rgba(236,72,153,0.6)" fontSize="8" fontFamily="monospace">COIL</text>

                {/* Field strength indicator */}
                <rect x="20" y="170" width="160" height="5" rx="2.5" fill="rgba(255,255,255,0.05)" />
                <rect x="20" y="170" width={160 * fieldLevel} height="5" rx="2.5" fill="#EC4899" opacity="0.7" />
                <text x="100" y="186" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace">
                  B FIELD: {(fieldLevel * 100).toFixed(0)}%
                </text>
              </svg>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleIncrease}
              disabled={mode === "increase" || mode === "steady"}
              className="px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(236,72,153,0.12)", borderColor: "rgba(236,72,153,0.3)", color: "#EC4899" }}
            >
              Increase Current ↑
            </button>
            <button
              onClick={handleDecrease}
              disabled={mode === "idle" || mode === "decrease" || mode === "increase"}
              className="px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(251,146,60,0.08)", borderColor: "rgba(251,146,60,0.25)", color: "#FB923C" }}
            >
              Decrease Current ↓
            </button>
          </div>

          {/* Back-EMF callout */}
          <AnimatePresence>
            {backEmfVisible && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 p-3 rounded-xl border text-xs text-center"
                style={{ background: "rgba(251,146,60,0.08)", borderColor: "rgba(251,146,60,0.25)", color: "#FB923C" }}
              >
                Back-EMF! Collapsing field induces opposing voltage — this is Lenz&apos;s Law in action.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
