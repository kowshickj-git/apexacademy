"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onDischargeUsed: () => void;
}

type Phase = "connected" | "disconnecting" | "spike" | "diode" | "idle";

export default function DischargeSim({ onDischargeUsed }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showDiode, setShowDiode] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const connect = () => {
    setPhase("connected");
  };

  const disconnect = () => {
    if (!triggered) { setTriggered(true); onDischargeUsed(); }
    setPhase("disconnecting");
    setTimeout(() => setPhase("spike"), 300);
    setTimeout(() => setPhase("connected"), 2200);
  };

  const phaseLabel: Record<Phase, string> = {
    idle: "Press Connect to start current flowing through inductor",
    connected: "Current flowing steadily — inductor has stored magnetic energy",
    disconnecting: "Switch opened — but inductor refuses to stop!",
    spike: "BACK-EMF SPIKE! Inductor generates huge voltage to maintain current flow",
    diode: "Flyback diode clamps the spike — transistor is protected",
  };

  const phaseColor: Record<Phase, string> = {
    idle: "rgba(255,255,255,0.3)",
    connected: "#10B981",
    disconnecting: "#F59E0B",
    spike: "#EF4444",
    diode: "#10B981",
  };

  // Oscilloscope waveform points
  const oscWidth = 240;
  const oscHeight = 80;

  const buildWaveform = () => {
    if (phase === "idle" || phase === "connected") {
      // flat line at 5V (40% from top)
      return `M 0 ${oscHeight * 0.6} L ${oscWidth} ${oscHeight * 0.6}`;
    }
    if (phase === "disconnecting") {
      return `M 0 ${oscHeight * 0.6} L ${oscWidth * 0.6} ${oscHeight * 0.6}`;
    }
    if (phase === "spike") {
      const midX = oscWidth * 0.65;
      return (
        `M 0 ${oscHeight * 0.6} ` +
        `L ${midX - 4} ${oscHeight * 0.6} ` +
        `L ${midX} ${oscHeight * 0.03} ` +
        `L ${midX + 2} ${oscHeight * 0.9} ` +
        `L ${midX + 6} ${oscHeight * 0.6} ` +
        `L ${oscWidth} ${oscHeight * 0.6}`
      );
    }
    return `M 0 ${oscHeight * 0.6} L ${oscWidth} ${oscHeight * 0.6}`;
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Simulator 2 · Back-EMF / Discharge
        </p>
        <h2 className="text-xl font-bold mb-1">Inductor Discharge &amp; Back-EMF</h2>
        <p className="text-white/45 text-sm mb-6">
          See what happens when current through an inductor is suddenly interrupted.
        </p>

        <div
          className="rounded-2xl border border-white/8 p-5"
          style={{ background: "rgba(236,72,153,0.03)" }}
        >
          {/* Status */}
          <div
            className="mb-4 px-3 py-2.5 rounded-xl text-xs text-center font-medium transition-all duration-300"
            style={{
              background: phase === "spike" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
              borderColor: phase === "spike" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)",
              border: "1px solid",
              color: phaseColor[phase],
            }}
          >
            {phaseLabel[phase]}
          </div>

          {/* Circuit diagram */}
          <div className="flex justify-center mb-5">
            <svg viewBox="0 0 300 180" className="w-full max-w-xs">
              {/* Battery */}
              <rect x="10" y="70" width="30" height="40" rx="4" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
              <text x="25" y="87" textAnchor="middle" fill="#10B981" fontSize="7" fontWeight="bold" fontFamily="monospace">+5V</text>
              <line x1="25" y1="110" x2="25" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <line x1="25" y1="70" x2="25" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

              {/* Top wire */}
              <line x1="25" y1="30" x2="120" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <line x1="200" y1="30" x2="280" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

              {/* Switch */}
              <circle cx="120" cy="30" r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              {(phase === "connected" || phase === "idle") ? (
                <line x1="124" y1="30" x2="196" y2="30" stroke="#10B981" strokeWidth="2" />
              ) : (
                <line x1="124" y1="30" x2="185" y2="15" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2" />
              )}
              <circle cx="200" cy="30" r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <text x="160" y="22" textAnchor="middle" fill={phase === "connected" ? "#10B981" : "#F59E0B"} fontSize="7" fontFamily="monospace">SW</text>

              {/* Resistor */}
              <path d="M 240 30 L 248 30 L 250 22 L 254 38 L 258 22 L 262 38 L 266 22 L 270 30 L 280 30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <text x="260" y="20" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace">R</text>

              {/* Right wire down */}
              <line x1="280" y1="30" x2="280" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

              {/* Bottom wire */}
              <line x1="25" y1="150" x2="280" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

              {/* Inductor coils */}
              {[0, 1, 2, 3].map(i => (
                <path
                  key={i}
                  d={`M ${100 + i * 20} 150 Q ${108 + i * 20} 138 ${110 + i * 20} 130 Q ${112 + i * 20} 122 ${120 + i * 20} 130 Q ${128 + i * 20} 138 ${120 + i * 20} 150`}
                  fill="none" stroke="#EC4899" strokeWidth="2" opacity="0.7"
                />
              ))}
              <text x="160" y="168" textAnchor="middle" fill="rgba(236,72,153,0.5)" fontSize="7" fontFamily="monospace">INDUCTOR L</text>

              {/* Flyback diode */}
              {showDiode && (
                <g>
                  <path d="M 90 60 L 90 40 L 100 50 L 90 60 Z" fill="rgba(16,185,129,0.3)" stroke="#10B981" strokeWidth="1" />
                  <line x1="100" y1="40" x2="100" y2="60" stroke="#10B981" strokeWidth="2" />
                  <line x1="90" y1="60" x2="100" y2="60" stroke="#10B981" strokeWidth="1.5" />
                  <line x1="90" y1="40" x2="100" y2="40" stroke="#10B981" strokeWidth="1.5" />
                  <text x="108" y="52" fill="#10B981" fontSize="6" fontFamily="monospace">D1</text>
                </g>
              )}

              {/* Spike animation */}
              <AnimatePresence>
                {phase === "spike" && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.line
                      x1="160" y1="150" x2="160" y2="10"
                      stroke="#EF4444"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                      animate={{ opacity: [1, 0.3, 1, 0.3, 1] }}
                      transition={{ duration: 0.4, repeat: 4 }}
                    />
                    <motion.text
                      x="168" y="40"
                      fill="#EF4444"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.3, repeat: 6 }}
                    >
                      V_spike!
                    </motion.text>
                    <motion.text
                      x="168" y="52"
                      fill="#EF4444"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      -L×dI/dt
                    </motion.text>
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </div>

          {/* Oscilloscope */}
          <div
            className="rounded-xl border border-white/8 p-3 mb-4"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <p className="text-[9px] text-white/25 font-mono mb-2">OSCILLOSCOPE — VOLTAGE ACROSS INDUCTOR</p>
            <svg viewBox={`0 0 ${oscWidth + 20} ${oscHeight + 20}`} className="w-full">
              {/* Grid */}
              {[0.25, 0.5, 0.75].map(f => (
                <line key={f} x1="10" y1={f * oscHeight} x2={oscWidth + 10} y2={f * oscHeight}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              <line x1="10" y1="0" x2="10" y2={oscHeight} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="10" y1={oscHeight} x2={oscWidth + 10} y2={oscHeight} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Waveform */}
              <motion.path
                d={buildWaveform()}
                fill="none"
                stroke={phase === "spike" ? "#EF4444" : "#F59E0B"}
                strokeWidth="2"
                transform="translate(10,0)"
                key={phase}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <text x="12" y="12" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="monospace">HIGH</text>
              <text x="12" y={oscHeight - 4} fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="monospace">0V</text>
              <AnimatePresence>
                {phase === "spike" && (
                  <motion.text
                    x={oscWidth * 0.65 + 10}
                    y="16"
                    fill="#EF4444"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    SPIKE!
                  </motion.text>
                )}
              </AnimatePresence>
            </svg>
          </div>

          {/* Warning banner */}
          <div
            className="mb-4 p-3 rounded-xl border text-xs"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.8)" }}
          >
            ⚠ Back-EMF spike can reach 100s of volts! This destroys transistors, MOSFETs, and ICs.{" "}
            <strong>Always use a flyback diode</strong> in parallel with any inductive load (relay, motor, solenoid).
          </div>

          {/* Controls */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={connect}
              disabled={phase === "connected" || phase === "spike" || phase === "disconnecting"}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", color: "#10B981" }}
            >
              Connect Switch
            </button>
            <button
              onClick={disconnect}
              disabled={phase !== "connected"}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", color: "#EF4444" }}
            >
              Open Switch (Disconnect!)
            </button>
            <button
              onClick={() => setShowDiode(d => !d)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border transition-all"
              style={{
                background: showDiode ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                borderColor: showDiode ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)",
                color: showDiode ? "#10B981" : "rgba(255,255,255,0.4)",
              }}
            >
              {showDiode ? "Diode ON" : "Add Flyback Diode"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
