"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

type Mode = "forward" | "reverse";

export default function ReverseBiasSimulator({ onSimUsed }: Props) {
  const [mode, setMode] = useState<Mode>("forward");
  const [used, setUsed] = useState(false);

  const isForward = mode === "forward";

  const toggle = (m: Mode) => {
    if (!used) { setUsed(true); onSimUsed(); }
    setMode(m);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 4 · Simulator 2</p>
        <h2 className="text-xl font-bold mb-1">Reverse Bias — Current Blocked</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Flip the battery around. The cathode is now more positive than the anode — <strong className="text-white/70">reverse bias</strong>.
          The depletion region widens and no current flows. Toggle to see the difference.
        </p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-5">
          {(["forward", "reverse"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => toggle(m)}
              className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all capitalize"
              style={mode === m
                ? { background: m === "forward" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", borderColor: m === "forward" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)", color: m === "forward" ? "#10B981" : "#EF4444" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
              }
            >
              {m === "forward" ? "⚡ Forward Bias" : "🚫 Reverse Bias"}
            </button>
          ))}
        </div>

        {/* Visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-6 mb-5"
            style={{
              borderColor: isForward ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)",
              background: isForward ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)",
            }}
          >
            {/* Circuit */}
            <div className="flex items-center justify-center gap-3">
              {/* Battery */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-16 rounded-xl border border-white/15 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                  {isForward ? (
                    <>
                      <span className="text-sm font-black text-primary">+</span>
                      <div className="w-6 h-px bg-white/20" />
                      <span className="text-sm font-black text-red-400/50">−</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-black text-red-400/50">−</span>
                      <div className="w-6 h-px bg-white/20" />
                      <span className="text-sm font-black text-primary">+</span>
                    </>
                  )}
                </div>
                <p className="text-[9px] text-white/25 font-mono">5V</p>
              </div>

              {/* Wire */}
              <div className="flex-1 h-1 rounded" style={{ background: isForward ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)" }}>
                {isForward && (
                  <div className="w-full h-full relative overflow-hidden">
                    <div className="absolute w-2 h-full bg-primary/60 rounded-full" style={{ animation: "ant-march 0.7s linear infinite" }} />
                  </div>
                )}
              </div>

              {/* Diode */}
              <svg width="64" height="44" viewBox="0 0 64 44">
                <polygon
                  points="10,6 10,38 44,22"
                  fill={isForward ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.15)"}
                  stroke={isForward ? "#10B981" : "rgba(239,68,68,0.5)"}
                  strokeWidth="1.8"
                />
                <rect x="42" y="5" width="5" height="34" rx="2"
                  fill={isForward ? "#10B981" : "rgba(239,68,68,0.5)"}
                />
                <line x1="0" y1="22" x2="10" y2="22" stroke={isForward ? "#10B981" : "rgba(239,68,68,0.5)"} strokeWidth="2" />
                <line x1="47" y1="22" x2="64" y2="22" stroke={isForward ? "#10B981" : "rgba(239,68,68,0.5)"} strokeWidth="2" />
                <text x="3" y="43" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="monospace">A</text>
                <text x="47" y="43" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="monospace">K</text>
              </svg>

              {/* Wire */}
              <div className="flex-1 h-1 rounded" style={{ background: isForward ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)" }}>
                {isForward && (
                  <div className="w-full h-full relative overflow-hidden">
                    <div className="absolute w-2 h-full bg-primary/60 rounded-full" style={{ animation: "ant-march 0.7s linear infinite 0.35s" }} />
                  </div>
                )}
              </div>

              {/* LED */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center"
                  style={{
                    borderColor: isForward ? "#10B981" : "rgba(239,68,68,0.3)",
                    background: isForward ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.03)",
                    boxShadow: isForward ? "0 0 20px rgba(16,185,129,0.6)" : "none",
                  }}
                >
                  {!isForward && <span className="text-xs text-red-400/50">OFF</span>}
                </div>
                <p className="text-[9px] text-white/25 font-mono">LED</p>
              </div>
            </div>

            <p className="text-center text-xs mt-4 font-semibold" style={{ color: isForward ? "#10B981" : "#EF4444" }}>
              {isForward ? "✅ Forward Bias: current flows, LED glows" : "🚫 Reverse Bias: current blocked, LED off"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Explanation cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-primary/20 p-4" style={{ background: "rgba(16,185,129,0.06)" }}>
            <p className="text-xs font-bold text-primary mb-1">Forward Bias</p>
            <p className="text-[11px] text-white/45 leading-relaxed">Anode (+) connected to positive supply. Cathode (−) to ground. Voltage ≥ 0.7V. Current flows freely.</p>
          </div>
          <div className="rounded-xl border border-red-500/20 p-4" style={{ background: "rgba(239,68,68,0.06)" }}>
            <p className="text-xs font-bold text-red-400 mb-1">Reverse Bias</p>
            <p className="text-[11px] text-white/45 leading-relaxed">Anode connected to negative supply. The P-N junction barrier widens. Nearly zero current flows. LED stays off.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
