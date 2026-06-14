"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

type Polarity = "correct" | "reversed";
type Mode = "without" | "with";

export default function BatteryProtection({ onSimUsed }: Props) {
  const [polarity, setPolarity] = useState<Polarity>("correct");
  const [mode, setMode] = useState<Mode>("without");
  const [used, setUsed] = useState(false);

  const handle = (p: Polarity, m: Mode) => {
    if (!used) { setUsed(true); onSimUsed(); }
    setPolarity(p);
    setMode(m);
  };

  const isProtected = mode === "with";
  const isDamaged = polarity === "reversed" && !isProtected;
  const isOk = polarity === "correct" || isProtected;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 6 · Simulator 4</p>
        <h2 className="text-xl font-bold mb-1">Battery Polarity Protection</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Connecting a battery backwards is the #1 mistake beginners make. A single diode in series can protect your circuit —
          it blocks reverse current entirely. Try reversing the battery with and without protection.
        </p>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <p className="text-[10px] text-white/30 font-mono mb-2 uppercase">Battery Polarity</p>
            <div className="flex gap-2">
              {(["correct", "reversed"] as Polarity[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handle(p, mode)}
                  className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all capitalize"
                  style={polarity === p
                    ? { background: p === "correct" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", borderColor: p === "correct" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)", color: p === "correct" ? "#10B981" : "#EF4444" }
                    : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
                  }
                >
                  {p === "correct" ? "✅ Correct" : "🔄 Reversed"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 font-mono mb-2 uppercase">Protection Diode</p>
            <div className="flex gap-2">
              {(["without", "with"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handle(polarity, m)}
                  className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all capitalize"
                  style={mode === m
                    ? { background: "rgba(14,165,233,0.15)", borderColor: "rgba(14,165,233,0.4)", color: "#0EA5E9" }
                    : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
                  }
                >
                  {m === "without" ? "No Diode" : "With Diode"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${polarity}-${mode}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-6 mb-5"
            style={{
              borderColor: isDamaged ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.25)",
              background: isDamaged ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.04)",
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* Battery */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-16 rounded-xl border border-white/15 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                  {polarity === "correct" ? (
                    <>
                      <span className="text-sm font-black text-primary">+</span>
                      <div className="w-6 h-px bg-white/20" />
                      <span className="text-sm font-black text-red-400/50">−</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-black text-red-400/60">−</span>
                      <div className="w-6 h-px bg-white/20" />
                      <span className="text-sm font-black text-primary/50">+</span>
                    </>
                  )}
                </div>
                <p className="text-[9px] text-white/25 font-mono">{polarity === "correct" ? "Correct" : "Reversed!"}</p>
              </div>

              {/* Wire */}
              <div className="flex-1 h-1 rounded" style={{ background: isOk && !isDamaged ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)" }} />

              {/* Protection diode (shown only in "with" mode) */}
              {mode === "with" && (
                <>
                  <svg width="50" height="32" viewBox="0 0 50 32">
                    <polygon
                      points="8,4 8,28 34,16"
                      fill={polarity === "correct" ? "rgba(14,165,233,0.35)" : "rgba(14,165,233,0.15)"}
                      stroke={polarity === "correct" ? "#0EA5E9" : "rgba(14,165,233,0.4)"}
                      strokeWidth="1.8"
                    />
                    <rect x="33" y="3" width="4" height="26" rx="1" fill={polarity === "correct" ? "#0EA5E9" : "rgba(14,165,233,0.4)"} />
                    <line x1="0" y1="16" x2="8" y2="16" stroke={polarity === "correct" ? "#0EA5E9" : "rgba(14,165,233,0.3)"} strokeWidth="2" />
                    <line x1="37" y1="16" x2="50" y2="16" stroke={polarity === "correct" ? "#0EA5E9" : "rgba(14,165,233,0.3)"} strokeWidth="2" />
                  </svg>
                  <div className="flex-1 h-1 rounded" style={{ background: polarity === "correct" ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)" }} />
                </>
              )}

              {/* Circuit / component */}
              <div
                className="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xl transition-all duration-500"
                style={{
                  borderColor: isDamaged ? "#EF4444" : isOk ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.1)",
                  background: isDamaged ? "rgba(239,68,68,0.12)" : isOk ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                }}
              >
                {isDamaged ? "💥" : isOk ? "✅" : "⚠️"}
              </div>
            </div>

            <p className="text-center text-xs font-bold" style={{ color: isDamaged ? "#EF4444" : "#10B981" }}>
              {isDamaged
                ? "Circuit DAMAGED — reverse current destroyed the component!"
                : polarity === "reversed" && isProtected
                ? "Circuit SAFE — protection diode blocked reverse current"
                : "Circuit OPERATING — correct polarity, current flows normally"}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="p-4 rounded-xl border border-secondary/20" style={{ background: "rgba(14,165,233,0.07)" }}>
          <p className="text-xs font-bold text-secondary mb-1">Real-world tip</p>
          <p className="text-[11px] text-white/45 leading-relaxed">
            Add a 1N4001 diode in series with your power input on any project. Cost: ~$0.02. Protection: saves a $50 Arduino from a backwards battery. The diode forward voltage drop of 0.7V is the only downside.
          </p>
        </div>
      </div>
    </section>
  );
}
