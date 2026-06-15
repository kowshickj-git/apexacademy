"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

interface Props {
  onPushButtonUsed: () => void;
}

type Mode = "NO" | "NC";

export default function PushButtonSim({ onPushButtonUsed }: Props) {
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<Mode>("NO");
  const [triggered, setTriggered] = useState(false);

  // For NO: circuit closed when pressed. For NC: circuit closed when NOT pressed.
  const circuitClosed = mode === "NO" ? pressed : !pressed;

  const handlePress = () => {
    setPressed(true);
    if (!triggered) { setTriggered(true); onPushButtonUsed(); }
  };
  const handleRelease = () => setPressed(false);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 5 · Simulation 2
        </p>
        <h2 className="text-xl font-bold mb-1">Push Button Simulator</h2>
        <p className="text-sm text-white/40 mb-6">Press the button and watch the circuit respond. Switch between NO and NC modes.</p>

        <div className="max-w-xl">
          {/* Mode selector */}
          <div className="flex gap-3 mb-6">
            {(["NO", "NC"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all"
                style={{
                  background: mode === m ? (m === "NO" ? "rgba(245,158,11,0.15)" : "rgba(6,182,212,0.15)") : "rgba(255,255,255,0.03)",
                  borderColor: mode === m ? (m === "NO" ? "rgba(245,158,11,0.4)" : "rgba(6,182,212,0.4)") : "rgba(255,255,255,0.08)",
                  color: mode === m ? (m === "NO" ? "#F59E0B" : CYAN) : "rgba(255,255,255,0.3)",
                }}
              >
                {m} — {m === "NO" ? "Normally Open" : "Normally Closed"}
              </button>
            ))}
          </div>

          {/* Mode explanation */}
          <div
            className="p-3 rounded-xl border mb-6 text-xs text-white/50"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            {mode === "NO"
              ? "NO (Normally Open): Contacts are OPEN at rest. Pressing the button CLOSES the circuit — current flows only while held."
              : "NC (Normally Closed): Contacts are CLOSED at rest. Pressing the button OPENS the circuit — current stops while held."}
          </div>

          {/* Main sim area */}
          <div
            className="rounded-2xl border p-6 mb-4 transition-all duration-500"
            style={{
              background: circuitClosed ? "rgba(16,185,129,0.06)" : "rgba(10,10,18,0.6)",
              borderColor: circuitClosed ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Big push button */}
              <div className="flex flex-col items-center gap-3 select-none">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Push Button</p>
                <div className="relative" style={{ width: 80, height: 96 }}>
                  {/* Base */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-xl border-2"
                    style={{
                      height: 40,
                      background: "rgba(40,40,60,0.9)",
                      borderColor: "rgba(255,255,255,0.15)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    }}
                  />
                  {/* Contact gap indicator */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-200"
                    style={{
                      bottom: 38,
                      width: 40,
                      height: 4,
                      background: circuitClosed ? "#10B981" : "rgba(239,68,68,0.6)",
                      borderRadius: 2,
                      boxShadow: circuitClosed ? "0 0 8px #10B981" : "none",
                    }}
                  />
                  {/* Button cap */}
                  <motion.div
                    onMouseDown={handlePress}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease}
                    onTouchStart={handlePress}
                    onTouchEnd={handleRelease}
                    animate={{ y: pressed ? 18 : 0 }}
                    transition={{ type: "spring", damping: 22, stiffness: 400 }}
                    className="absolute left-0 right-0 top-0 rounded-xl border-2 cursor-pointer"
                    style={{
                      height: 52,
                      background: pressed
                        ? (mode === "NO" ? "rgba(16,185,129,0.8)" : "rgba(239,68,68,0.7)")
                        : (mode === "NO" ? "rgba(245,158,11,0.7)" : "rgba(6,182,212,0.7)"),
                      borderColor: "rgba(255,255,255,0.2)",
                      boxShadow: pressed
                        ? "0 2px 4px rgba(0,0,0,0.4)"
                        : "0 6px 0 rgba(0,0,0,0.4), 0 8px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div className="h-full flex items-center justify-center">
                      <span className="text-white font-black text-sm select-none">
                        {pressed ? "▼" : "●"}
                      </span>
                    </div>
                  </motion.div>
                </div>
                <p className="text-[10px] text-white/30">{pressed ? "PRESSED" : "Hold to press"}</p>
              </div>

              {/* Status + LED */}
              <div className="flex-1 flex flex-col gap-4">
                {/* LED */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      background: circuitClosed ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.05)",
                      borderColor: circuitClosed ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.1)",
                      boxShadow: circuitClosed ? "0 0 20px rgba(251,191,36,0.5)" : "none",
                    }}
                  >
                    <span className="text-lg">{circuitClosed ? "💡" : "⚫"}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: circuitClosed ? "#10B981" : "#EF4444" }}>
                      {circuitClosed ? "LED ON" : "LED OFF"}
                    </p>
                    <p className="text-xs text-white/35">{circuitClosed ? "Current flowing" : "No current"}</p>
                  </div>
                </div>

                {/* Circuit state */}
                <div
                  className="p-3 rounded-xl border text-center"
                  style={{
                    background: circuitClosed ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.08)",
                    borderColor: circuitClosed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)",
                  }}
                >
                  <p className="text-xs font-black" style={{ color: circuitClosed ? "#10B981" : "#EF4444" }}>
                    {circuitClosed ? "CLOSED — Current Flowing" : "OPEN — No Current"}
                  </p>
                </div>

                {/* Internal contact diagram */}
                <div className="p-3 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-[9px] font-mono text-white/25 mb-2 uppercase tracking-widest">Internal Contact</p>
                  <svg width="140" height="32" viewBox="0 0 140 32">
                    <line x1="5" y1="16" x2="45" y2="16" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="45" cy="16" r="3" fill={circuitClosed ? "#10B981" : "rgba(255,255,255,0.2)"} />
                    <circle cx="95" cy="16" r="3" fill={circuitClosed ? "#10B981" : "rgba(255,255,255,0.2)"} />
                    <AnimatePresence mode="wait">
                      {circuitClosed ? (
                        <motion.line
                          key="closed"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          exit={{ pathLength: 0 }}
                          x1="45" y1="16" x2="95" y2="16"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      ) : (
                        <motion.g key="open">
                          <line x1="45" y1="16" x2="65" y2="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                          <text x="70" y="8" fontSize="8" fill="rgba(239,68,68,0.7)" fontFamily="monospace">GAP</text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                    <line x1="95" y1="16" x2="135" y2="16" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {!triggered && (
            <p className="text-center text-xs text-white/30">Press the button to earn XP</p>
          )}
          {triggered && (
            <p className="text-center text-xs" style={{ color: CYAN }}>+15 XP earned! Try both NO and NC modes.</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
