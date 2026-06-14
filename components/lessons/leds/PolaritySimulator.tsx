"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPolarityUsed: () => void; }

type Connection = "correct" | "reversed" | "none";

export default function PolaritySimulator({ onPolarityUsed }: Props) {
  const [connection, setConnection] = useState<Connection>("none");
  const [used, setUsed] = useState(false);

  const connect = (c: Connection) => {
    if (!used) { setUsed(true); onPolarityUsed(); }
    setConnection(c);
  };

  const isOn = connection === "correct";
  const isReversed = connection === "reversed";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 5 · Simulator 1</p>
        <h2 className="text-xl font-bold mb-1">LED Polarity Simulator</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Try connecting the LED both ways. In the real world, a backwards LED simply doesn&apos;t light — it won&apos;t break from polarity alone (as long as the reverse voltage is low). Try all three states.
        </p>

        {/* Connection buttons */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {([
            { id: "none" as const, label: "Disconnected", icon: "○" },
            { id: "correct" as const, label: "Correct (+A −K)", icon: "✓" },
            { id: "reversed" as const, label: "Reversed (−A +K)", icon: "↕" },
          ]).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => connect(id)}
              className="py-2.5 rounded-xl border text-xs font-semibold transition-all"
              style={connection === id
                ? {
                    background: id === "correct" ? "rgba(16,185,129,0.15)" : id === "reversed" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
                    borderColor: id === "correct" ? "rgba(16,185,129,0.4)" : id === "reversed" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.2)",
                    color: id === "correct" ? "#10B981" : id === "reversed" ? "#EF4444" : "rgba(255,255,255,0.7)",
                  }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }
              }
            >
              <div className="text-base mb-0.5">{icon}</div>
              <div className="text-[9px] leading-tight">{label}</div>
            </button>
          ))}
        </div>

        {/* Circuit visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={connection}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-6 mb-5 text-center"
            style={{
              borderColor: isOn ? "rgba(16,185,129,0.3)" : isReversed ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)",
              background: isOn ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)",
            }}
          >
            {/* Battery + LED circuit */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Battery */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-16 rounded-xl border border-white/15 flex flex-col items-center justify-center gap-1 text-xs font-black" style={{ background: "rgba(255,255,255,0.04)" }}>
                  {isReversed ? (
                    <><span className="text-red-400/60">−</span><div className="w-6 h-px bg-white/15" /><span className="text-primary/60">+</span></>
                  ) : (
                    <><span className="text-primary">+</span><div className="w-6 h-px bg-white/15" /><span className="text-red-400/50">−</span></>
                  )}
                </div>
                <p className="text-[9px] text-white/25 mt-1 font-mono">5V</p>
              </div>

              {/* Wire */}
              <div className="w-8 h-0.5 rounded" style={{ background: isOn ? "rgba(16,185,129,0.5)" : connection !== "none" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)" }} />

              {/* LED body */}
              <div className="flex flex-col items-center">
                <svg width="50" height="80" viewBox="0 0 50 80">
                  {/* LED dome */}
                  <ellipse cx="25" cy="25" rx="20" ry="20"
                    fill={isOn ? "rgba(239,68,68,0.6)" : "rgba(239,68,68,0.12)"}
                    stroke={isOn ? "#FCA5A5" : "rgba(239,68,68,0.3)"}
                    strokeWidth="1.5"
                    style={isOn ? { filter: "drop-shadow(0 0 8px rgba(239,68,68,0.8))" } : {}}
                  />
                  <path d="M5 38 Q5 50 25 50 Q45 50 45 38"
                    fill={isOn ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.1)"}
                    stroke={isOn ? "#FCA5A5" : "rgba(239,68,68,0.25)"}
                    strokeWidth="1.5"
                  />
                  {/* Flat edge */}
                  <rect x="34" y="36" width="11" height="3" fill={isOn ? "#FCA5A5" : "rgba(239,68,68,0.3)"} />
                  {/* Legs */}
                  <line x1="20" y1="50" x2="20" y2="78" stroke="#9CA3AF" strokeWidth="2" />
                  <line x1="30" y1="50" x2="30" y2="74" stroke="#9CA3AF" strokeWidth="2" />
                  <line x1="20" y1="70" x2="30" y2="70" stroke="#9CA3AF" strokeWidth="1" />
                  {/* A/K labels */}
                  <text x="11" y="78" fontSize="8" fill="rgba(16,185,129,0.6)" fontFamily="monospace">+</text>
                  <text x="32" y="76" fontSize="8" fill="rgba(239,68,68,0.6)" fontFamily="monospace">−</text>
                </svg>
                {isOn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-lg"
                    style={{ filter: "drop-shadow(0 0 6px rgba(239,68,68,0.9))" }}
                  >
                    ✨
                  </motion.div>
                )}
              </div>

              {/* Wire */}
              <div className="w-8 h-0.5 rounded" style={{ background: isOn ? "rgba(16,185,129,0.5)" : connection !== "none" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)" }} />
            </div>

            <p className="text-sm font-bold" style={{ color: isOn ? "#10B981" : isReversed ? "#EF4444" : "rgba(255,255,255,0.3)" }}>
              {isOn ? "✅ Forward biased — LED glows!" : isReversed ? "🔄 Reversed — no current, no light" : "○ Disconnected"}
            </p>
            <p className="text-xs text-white/35 mt-1">
              {isOn
                ? "Current flows from anode (+) to cathode (−). Electron-hole recombination emits red photons."
                : isReversed
                ? "The P-N junction is reverse biased. Depletion region blocks current. LED is unharmed but dark."
                : "Connect the LED to see what happens."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
