"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onCurrentUsed: () => void;
}

export default function CurrentSim({ onCurrentUsed }: Props) {
  const [circuitBroken, setCircuitBroken] = useState(false);
  const [showWrongWay, setShowWrongWay] = useState(false);
  const [used, setUsed] = useState(false);

  const handleToggle = () => {
    const next = !circuitBroken;
    setCircuitBroken(next);
    setShowWrongWay(false);
    if (!used) {
      setUsed(true);
      onCurrentUsed();
    }
  };

  // 9V / 470Ω ≈ 19.1mA
  const currentReading = "19.1";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 5 · Simulator 2
        </p>
        <h2 className="text-xl font-bold mb-1">Current Measurement Simulator</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          An ammeter goes IN SERIES — you must break the circuit to insert the meter. Try it below.
        </p>

        {/* Main toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleToggle}
            className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all"
            style={
              circuitBroken
                ? { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)", color: "#10B981" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
            }
          >
            {circuitBroken ? "✓ Meter In Series (Remove Meter)" : "Break Circuit & Insert Meter"}
          </button>
          <button
            onClick={() => { setShowWrongWay(!showWrongWay); if (!used) { setUsed(true); onCurrentUsed(); } }}
            className="px-3 py-2.5 rounded-xl border text-xs font-bold transition-all"
            style={
              showWrongWay
                ? { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.4)", color: "#EF4444" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
            }
          >
            Wrong Way
          </button>
        </div>

        {/* Circuit diagram */}
        <div
          className="rounded-2xl border border-white/8 p-5 mb-5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* Simple circuit SVG */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 280 160" width="100%" className="max-w-xs">
              {/* Battery */}
              <rect x="10" y="55" width="30" height="50" rx="4" fill="rgba(234,179,8,0.15)" stroke="rgba(234,179,8,0.5)" strokeWidth="1.5" />
              <text x="25" y="75" textAnchor="middle" fill="#EAB308" fontSize="9" fontWeight="bold">9V</text>
              <text x="25" y="88" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7">Bat</text>

              {/* Top wire: battery+ → resistor */}
              <line x1="40" y1="65" x2="120" y2="65" stroke={circuitBroken ? "rgba(255,255,255,0.15)" : "rgba(16,185,129,0.6)"} strokeWidth="2.5" strokeLinecap="round" />

              {/* Break point or meter */}
              {circuitBroken ? (
                <>
                  {/* Break gap */}
                  <line x1="120" y1="65" x2="152" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Meter in gap */}
                  <rect x="130" y="50" width="40" height="30" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
                  <text x="150" y="62" textAnchor="middle" fill="#10B981" fontSize="7" fontWeight="bold">A</text>
                  <text x="150" y="73" textAnchor="middle" fill="#10B981" fontSize="7">{currentReading}mA</text>
                  <line x1="130" y1="65" x2="120" y2="65" stroke="rgba(16,185,129,0.6)" strokeWidth="2" />
                  <line x1="170" y1="65" x2="180" y2="65" stroke="rgba(16,185,129,0.6)" strokeWidth="2" />
                </>
              ) : (
                <line x1="120" y1="65" x2="180" y2="65" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* Resistor */}
              <rect x="180" y="56" width="50" height="18" rx="4" fill="rgba(234,88,12,0.15)" stroke="rgba(234,88,12,0.45)" strokeWidth="1.5" />
              <text x="205" y="68" textAnchor="middle" fill="#EA580C" fontSize="8" fontWeight="bold">470Ω</text>

              {/* Right wire down */}
              <line x1="230" y1="65" x2="260" y2="65" stroke={circuitBroken ? "rgba(16,185,129,0.6)" : "rgba(16,185,129,0.6)"} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="260" y1="65" x2="260" y2="95" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Bottom wire */}
              <line x1="10" y1="95" x2="260" y2="95" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="10" y1="95" x2="10" y2="65" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Wrong way parallel meter */}
              {showWrongWay && (
                <>
                  <rect x="180" y="100" width="50" height="30" rx="6" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
                  <text x="205" y="112" textAnchor="middle" fill="#EF4444" fontSize="7" fontWeight="bold">A</text>
                  <text x="205" y="122" textAnchor="middle" fill="#EF4444" fontSize="6">WRONG!</text>
                  <line x1="180" y1="115" x2="170" y2="95" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="3,2" />
                  <line x1="230" y1="115" x2="240" y2="95" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="3,2" />
                </>
              )}
            </svg>
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            {showWrongWay ? (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 rounded-xl border border-red-500/30 p-3 text-center"
                style={{ background: "rgba(239,68,68,0.08)" }}
              >
                <p className="text-xs font-bold text-red-400">
                  ⚠️ DANGER: Connecting ammeter IN PARALLEL creates a near short circuit —
                  may damage the meter or battery with a huge current spike!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={circuitBroken ? "series" : "open"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center"
              >
                {circuitBroken ? (
                  <div className="rounded-xl border border-green-500/25 p-3" style={{ background: "rgba(16,185,129,0.06)" }}>
                    <p className="text-xs font-bold text-green-400">
                      ✅ CORRECT — Meter in series. Reading: {currentReading} mA
                    </p>
                    <p className="text-[10px] text-white/35 mt-1">Circuit is broken and current flows through the meter</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/8 p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="text-xs text-white/30 font-mono">-- mA (not measuring)</p>
                    <p className="text-[10px] text-white/25 mt-1">Meter not in circuit</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key fact */}
        <div
          className="rounded-xl border border-white/8 p-3"
          style={{ background: "rgba(14,165,233,0.04)" }}
        >
          <p className="text-[10px] text-white/25 font-mono uppercase mb-1">Key Fact</p>
          <p className="text-xs text-white/55 leading-relaxed">
            <span className="font-bold text-blue-400">Current is always measured IN SERIES</span> — you must break the
            circuit at one point and insert the ammeter into the gap. The meter&apos;s very low internal resistance
            (mΩ) ensures minimal voltage drop across it.
          </p>
        </div>
      </div>
    </section>
  );
}
