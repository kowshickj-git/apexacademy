"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForwardReverseBias() {
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
  const isForward = mode === "forward";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 6 · Bias</p>
        <h2 className="text-xl font-bold mb-1">Forward Bias vs Reverse Bias in LEDs</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          LEDs behave exactly like regular diodes for bias — but add light output. Forward bias = light. Reverse bias = no light. The depletion region at the P-N junction is the key.
        </p>

        <div className="flex gap-2 mb-5">
          {(["forward", "reverse"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all capitalize"
              style={mode === m
                ? { background: m === "forward" ? "rgba(239,68,68,0.15)" : "rgba(14,165,233,0.1)", borderColor: m === "forward" ? "rgba(239,68,68,0.4)" : "rgba(14,165,233,0.3)", color: m === "forward" ? "#FCA5A5" : "#38BDF8" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
              }
            >
              {m === "forward" ? "⚡ Forward Bias" : "🚫 Reverse Bias"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-6"
            style={{
              borderColor: isForward ? "rgba(239,68,68,0.3)" : "rgba(14,165,233,0.2)",
              background: isForward ? "rgba(239,68,68,0.05)" : "rgba(14,165,233,0.04)",
            }}
          >
            {/* P-N junction diagram */}
            <svg width="100%" height="80" viewBox="0 0 300 80" className="mb-4">
              {/* N-type */}
              <rect x="0" y="10" width="120" height="60" rx="6" fill="rgba(14,165,233,0.15)" stroke="rgba(14,165,233,0.3)" strokeWidth="1" />
              <text x="60" y="44" textAnchor="middle" fontSize="13" fill="rgba(14,165,233,0.7)" fontFamily="monospace" fontWeight="bold">N-type</text>
              <text x="60" y="57" textAnchor="middle" fontSize="8" fill="rgba(14,165,233,0.4)" fontFamily="monospace">electrons (e⁻)</text>

              {/* Depletion region */}
              <rect x="120" y="10" width="60" height="60" rx="0"
                fill={isForward ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)"}
                stroke={isForward ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}
                strokeWidth="1" strokeDasharray="3,2"
              />
              <text x="150" y="44" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="monospace">
                {isForward ? "narrow!" : "wide"}
              </text>

              {/* P-type */}
              <rect x="180" y="10" width="120" height="60" rx="6" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
              <text x="240" y="44" textAnchor="middle" fontSize="13" fill="rgba(239,68,68,0.7)" fontFamily="monospace" fontWeight="bold">P-type</text>
              <text x="240" y="57" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.4)" fontFamily="monospace">holes (+)</text>

              {/* Current flow indicator */}
              {isForward && (
                <>
                  <text x="150" y="7" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.6)" fontFamily="monospace">I →→→</text>
                  <circle cx="100" cy="40" r="4" fill="#0EA5E9" style={{ animation: "ant-march 0.6s linear infinite" }} />
                  <circle cx="200" cy="40" r="4" fill="#EF4444" opacity="0.6" />
                </>
              )}
              {!isForward && (
                <text x="150" y="7" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.2)" fontFamily="monospace">← blocked →</text>
              )}
            </svg>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-white/30 uppercase font-mono mb-1">What happens</p>
                <p className="text-xs text-white/60 leading-relaxed">
                  {isForward
                    ? "Anode (+) repels holes toward junction. Cathode (−) repels electrons toward junction. They meet and recombine → photons emitted."
                    : "Anode (−) attracts holes away from junction. Cathode (+) attracts electrons away. Depletion region widens. No recombination → no light."}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase font-mono mb-1">Result</p>
                <p className="text-sm font-bold" style={{ color: isForward ? "#FCA5A5" : "#38BDF8" }}>
                  {isForward ? "💡 LED GLOWS" : "⚫ LED is OFF"}
                </p>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  {isForward
                    ? `Threshold: ~${mode === "forward" ? "2.0" : ""}V (red) to 3.4V (blue/white). Current: 10–20mA.`
                    : "No damage if reverse voltage stays below LED's PIV (typically 5–6V)."}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
