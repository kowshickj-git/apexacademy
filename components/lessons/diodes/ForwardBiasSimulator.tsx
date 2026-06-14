"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

export default function ForwardBiasSimulator({ onSimUsed }: Props) {
  const [voltage, setVoltage] = useState(0);
  const [used, setUsed] = useState(false);

  const THRESHOLD = 0.7;
  const conducting = voltage >= THRESHOLD;
  const current_mA = conducting ? Math.round((voltage - THRESHOLD) * 30) : 0;
  const brightness = Math.min(1, current_mA / 20);

  const handle = (v: number) => {
    if (!used) { setUsed(true); onSimUsed(); }
    setVoltage(v);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 3 · Simulator 1</p>
        <h2 className="text-xl font-bold mb-1">Forward Bias — Current Flows</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          A diode is <strong className="text-white/70">forward biased</strong> when the anode is more positive than the cathode.
          Once voltage exceeds ~0.7V (silicon threshold), current rushes through. Drag the slider to see it happen.
        </p>

        {/* Circuit diagram */}
        <div
          className="rounded-2xl border p-5 mb-5 transition-all duration-500"
          style={{
            borderColor: conducting ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
            background: conducting ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)",
          }}
        >
          <div className="flex items-center justify-center gap-2 relative">
            {/* Battery */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="text-[10px] text-white/35 font-mono">{voltage.toFixed(1)}V</div>
              <div className="w-10 h-14 rounded-xl border border-white/15 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                <span className="text-xs font-black" style={{ color: "#10B981" }}>+</span>
                <div className="w-6 h-px bg-white/20" />
                <span className="text-xs font-black text-white/30">−</span>
              </div>
              <div className="text-[9px] text-white/25 font-mono">Battery</div>
            </div>

            {/* Wire + current animation */}
            <div className="relative h-1 flex-1 mx-1" style={{ background: conducting ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)", borderRadius: 1 }}>
              {conducting && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
                  style={{ animation: "ant-march 0.8s linear infinite" }}
                />
              )}
            </div>

            {/* Diode symbol */}
            <svg width="60" height="40" viewBox="0 0 60 40">
              <polygon
                points="10,5 10,35 40,20"
                fill={conducting ? "rgba(16,185,129,0.4)" : "rgba(139,92,246,0.2)"}
                stroke={conducting ? "#10B981" : "#A78BFA"}
                strokeWidth="1.8"
              />
              <rect x="38" y="4" width="4" height="32" rx="1"
                fill={conducting ? "#10B981" : "#A78BFA"}
              />
              <line x1="0" y1="20" x2="10" y2="20" stroke={conducting ? "#10B981" : "rgba(255,255,255,0.2)"} strokeWidth="2" />
              <line x1="42" y1="20" x2="60" y2="20" stroke={conducting ? "#10B981" : "rgba(255,255,255,0.2)"} strokeWidth="2" />
              <text x="5" y="38" fontSize="7" fill="rgba(16,185,129,0.6)" fontFamily="monospace">A</text>
              <text x="40" y="38" fontSize="7" fill="rgba(16,185,129,0.6)" fontFamily="monospace">K</text>
            </svg>

            <div className="relative h-1 flex-1 mx-1" style={{ background: conducting ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)", borderRadius: 1 }}>
              {conducting && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
                  style={{ animation: "ant-march 0.8s linear infinite 0.4s" }}
                />
              )}
            </div>

            {/* LED indicator */}
            <div className="relative flex flex-col items-center gap-0.5">
              <div
                className="w-10 h-10 rounded-full border-2 transition-all duration-500"
                style={{
                  borderColor: conducting ? "#10B981" : "rgba(255,255,255,0.1)",
                  background: conducting ? `rgba(16,185,129,${brightness * 0.6})` : "rgba(255,255,255,0.04)",
                  boxShadow: conducting ? `0 0 ${brightness * 24}px rgba(16,185,129,${brightness * 0.8})` : "none",
                }}
              />
              <div className="text-[9px] text-white/25 font-mono">LED</div>
              {conducting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-5 text-[9px] text-primary font-mono"
                >
                  {current_mA}mA
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Voltage applied (anode to cathode)</span>
            <span className="font-mono" style={{ color: conducting ? "#10B981" : "#F97316" }}>{voltage.toFixed(1)}V</span>
          </div>
          <input
            type="range" min={0} max={3} step={0.1} value={voltage}
            onChange={(e) => handle(Number(e.target.value))}
            className="w-full"
            style={{ background: `linear-gradient(to right, ${conducting ? "#10B981" : "#F97316"} ${(voltage / 3) * 100}%, rgba(255,255,255,0.08) ${(voltage / 3) * 100}%)` }}
          />
          <div className="flex justify-between text-[9px] text-white/20 mt-1 font-mono">
            <span>0V</span>
            <span style={{ color: voltage >= 0.7 ? "#10B981" : "#F97316" }}>0.7V threshold</span>
            <span>3V</span>
          </div>
        </div>

        {/* Status */}
        <AnimatePresence mode="wait">
          <motion.div
            key={conducting ? "on" : "off"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border p-4"
            style={{
              background: conducting ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
              borderColor: conducting ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">{conducting ? "✅" : "🔴"}</div>
              <div>
                <p className="text-xs font-bold" style={{ color: conducting ? "#10B981" : "rgba(255,255,255,0.5)" }}>
                  {conducting ? `Conducting — ${current_mA}mA flowing` : `Not conducting — below 0.7V threshold`}
                </p>
                <p className="text-[11px] text-white/35 leading-relaxed mt-0.5">
                  {conducting
                    ? "Forward voltage exceeded. The P-N junction is open. Current flows from anode through the diode to cathode."
                    : `At ${voltage.toFixed(1)}V, not enough energy to push through the junction. Raise to 0.7V to start conduction.`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
