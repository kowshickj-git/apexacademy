"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Part {
  id: string;
  label: string;
  description: string;
}

const parts: Part[] = [
  {
    id: "display",
    label: "Display",
    description:
      "Shows the measured value. Digital multimeters show a 3–4 digit reading with decimal point and unit (V, A, Ω).",
  },
  {
    id: "dial",
    label: "Rotary Dial",
    description:
      "Select the measurement mode. Turn to V for voltage, A for current, Ω for resistance, ))) for continuity.",
  },
  {
    id: "com",
    label: "COM Port",
    description:
      "Always connect the BLACK probe here. COM = Common = Ground reference for all measurements.",
  },
  {
    id: "vo",
    label: "VΩ Port",
    description:
      "Connect RED probe here for voltage and resistance measurements. The most-used input port.",
  },
  {
    id: "ma",
    label: "mA Port",
    description:
      "Connect RED probe here for current measurements. WARNING: never use this port for voltage — it may blow the internal fuse!",
  },
];

export default function AnatomyExplorer() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const selected = parts.find((p) => p.id === selectedPart);

  const isActive = (id: string) => selectedPart === id;

  const partStyle = (id: string) => ({
    cursor: "pointer",
    opacity: selectedPart && !isActive(id) ? 0.5 : 1,
    transition: "opacity 0.2s",
  });

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 3 · Interactive
        </p>
        <h2 className="text-xl font-bold mb-2">Anatomy Explorer</h2>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          Click any part of the multimeter to learn what it does.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* SVG Multimeter Diagram */}
          <div className="shrink-0">
            <svg
              viewBox="0 0 200 320"
              width="180"
              height="290"
              className="block"
              style={{ filter: "drop-shadow(0 4px 24px rgba(167,139,250,0.15))" }}
            >
              {/* Main body */}
              <rect x="20" y="10" width="160" height="280" rx="18" fill="#1C1C2E" stroke="rgba(167,139,250,0.25)" strokeWidth="1.5" />

              {/* Display screen */}
              <rect
                x="35" y="24" width="130" height="70" rx="8"
                fill={isActive("display") ? "rgba(167,139,250,0.18)" : "#0D0D1A"}
                stroke={isActive("display") ? "#A78BFA" : "rgba(255,255,255,0.08)"}
                strokeWidth={isActive("display") ? 2 : 1}
                style={partStyle("display")}
                onClick={() => setSelectedPart(selectedPart === "display" ? null : "display")}
              />
              <text
                x="100" y="55" textAnchor="middle"
                fill="#10B981" fontSize="18" fontFamily="monospace" fontWeight="bold"
                style={{ pointerEvents: "none" }}
              >
                12.34V
              </text>
              <text
                x="100" y="80" textAnchor="middle"
                fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace"
                style={{ pointerEvents: "none" }}
              >
                DC VOLTAGE
              </text>

              {/* Dial circle */}
              <circle
                cx="100" cy="165" r="42"
                fill={isActive("dial") ? "rgba(167,139,250,0.12)" : "#141428"}
                stroke={isActive("dial") ? "#A78BFA" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive("dial") ? 2 : 1.5}
                style={partStyle("dial")}
                onClick={() => setSelectedPart(selectedPart === "dial" ? null : "dial")}
              />
              <circle cx="100" cy="165" r="28" fill="#0D0D1A" stroke="rgba(255,255,255,0.06)" strokeWidth="1" style={{ pointerEvents: "none" }} />
              {/* Dial notch indicator */}
              <line x1="100" y1="130" x2="100" y2="140" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" style={{ pointerEvents: "none" }} />
              {/* Mode labels around dial */}
              <text x="100" y="127" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>V~</text>
              <text x="135" y="145" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>V-</text>
              <text x="138" y="175" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>A</text>
              <text x="65" y="175" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>Ω</text>
              <text x="65" y="145" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>)))</text>
              <text x="100" y="170" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace" style={{ pointerEvents: "none" }}>SELECT</text>

              {/* Port labels row */}
              <text x="48" y="244" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>COM</text>
              <text x="100" y="244" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>VΩ</text>
              <text x="152" y="244" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace" style={{ pointerEvents: "none" }}>mA</text>

              {/* COM port */}
              <circle
                cx="48" cy="256" r="10"
                fill={isActive("com") ? "rgba(100,100,100,0.4)" : "#111"}
                stroke={isActive("com") ? "#9CA3AF" : "rgba(255,255,255,0.15)"}
                strokeWidth={isActive("com") ? 2 : 1.5}
                style={partStyle("com")}
                onClick={() => setSelectedPart(selectedPart === "com" ? null : "com")}
              />
              <circle cx="48" cy="256" r="4" fill="#1A1A1A" style={{ pointerEvents: "none" }} />

              {/* VΩ port */}
              <circle
                cx="100" cy="256" r="10"
                fill={isActive("vo") ? "rgba(239,68,68,0.25)" : "#111"}
                stroke={isActive("vo") ? "#EF4444" : "rgba(255,255,255,0.15)"}
                strokeWidth={isActive("vo") ? 2 : 1.5}
                style={partStyle("vo")}
                onClick={() => setSelectedPart(selectedPart === "vo" ? null : "vo")}
              />
              <circle cx="100" cy="256" r="4" fill="#1A1A1A" style={{ pointerEvents: "none" }} />

              {/* mA port */}
              <circle
                cx="152" cy="256" r="10"
                fill={isActive("ma") ? "rgba(234,88,12,0.25)" : "#111"}
                stroke={isActive("ma") ? "#EA580C" : "rgba(255,255,255,0.15)"}
                strokeWidth={isActive("ma") ? 2 : 1.5}
                style={partStyle("ma")}
                onClick={() => setSelectedPart(selectedPart === "ma" ? null : "ma")}
              />
              <circle cx="152" cy="256" r="4" fill="#1A1A1A" style={{ pointerEvents: "none" }} />

              {/* Probe lines */}
              <line x1="48" y1="266" x2="48" y2="295" stroke="#444" strokeWidth="2" strokeDasharray="3,2" style={{ pointerEvents: "none" }} />
              <line x1="100" y1="266" x2="100" y2="295" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,2" opacity="0.5" style={{ pointerEvents: "none" }} />
              <circle cx="48" cy="296" r="3" fill="#555" style={{ pointerEvents: "none" }} />
              <circle cx="100" cy="296" r="3" fill="#EF4444" opacity="0.6" style={{ pointerEvents: "none" }} />
            </svg>
          </div>

          {/* Info panel */}
          <div className="flex-1 min-w-0">
            {/* Part buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {parts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPart(selectedPart === p.id ? null : p.id)}
                  className="text-xs px-3 py-1.5 rounded-xl border font-medium transition-all"
                  style={
                    selectedPart === p.id
                      ? { background: "rgba(167,139,250,0.15)", borderColor: "#A78BFA", color: "#C4B5FD" }
                      : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Description */}
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border p-4"
                  style={{
                    background: "rgba(167,139,250,0.06)",
                    borderColor: "rgba(167,139,250,0.25)",
                  }}
                >
                  <p className="text-xs font-bold mb-1" style={{ color: "#A78BFA" }}>
                    {selected.label}
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed">{selected.description}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-white/6 p-4"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-xs text-white/25 leading-relaxed">
                    Click any part of the multimeter to learn about it
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
