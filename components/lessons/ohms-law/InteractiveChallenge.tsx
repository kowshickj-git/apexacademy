"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

export default function InteractiveChallenge({ onSimUsed }: Props) {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(1000);
  const [used, setUsed] = useState(false);
  const [achieved, setAchieved] = useState(false);

  const current_mA = (voltage / resistance) * 1000;
  const brightness = Math.min(1, current_mA / 20);
  const isSafe = current_mA <= 20 && current_mA >= 15;
  const isWin = isSafe && brightness >= 0.75;

  const handle = (v: number, r: number) => {
    if (!used) { setUsed(true); onSimUsed(); }
    setVoltage(v);
    setResistance(r);
    if (isSafe && brightness >= 0.75 && !achieved) setAchieved(true);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 13 · Challenge</p>
        <h2 className="text-xl font-bold mb-1">Make the LED Shine Brightest</h2>
        <p className="text-white/45 text-sm mb-4 leading-relaxed">
          <strong className="text-white/75">Goal:</strong> Get the LED current between 15–20mA to reach maximum safe brightness.
          Adjust voltage and resistance using what you know about V = I × R.
        </p>

        {/* Target indicator */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl border mb-5"
          style={isWin
            ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }
            : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }
          }
        >
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: isWin ? "#10B981" : current_mA > 20 ? "#EF4444" : "#F97316", animation: "pulse-glow 1s ease-in-out infinite" }}
          />
          <p className="text-xs" style={{ color: isWin ? "#10B981" : current_mA > 20 ? "#EF4444" : "rgba(255,255,255,0.45)" }}>
            {isWin ? "🏆 Perfect! LED at maximum brightness within safe limits." : current_mA > 20 ? "⚠️ Overcurrent — LED would burn! Reduce voltage or increase resistance." : `Current: ${current_mA.toFixed(1)}mA — Target: 15–20mA`}
          </p>
        </div>

        {/* LED visual */}
        <div className="flex items-center justify-center py-8 mb-6 rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.01)" }}>
          <div className="relative">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon points="12,9 48,30 12,51"
                fill="#10B981"
                opacity={current_mA > 20 ? 0.15 : 0.2 + brightness * 0.8}
              />
              <line x1="48" y1="18" x2="48" y2="42" stroke="#10B981" strokeWidth="4"
                opacity={current_mA > 20 ? 0.1 : 0.2 + brightness * 0.8}
              />
            </svg>
            {current_mA > 20
              ? <div className="absolute inset-0 flex items-center justify-center text-2xl">💥</div>
              : brightness > 0.05 && (
                <div
                  className="absolute inset-0 -m-4 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(16,185,129,${(brightness * 0.7).toFixed(2)}) 0%, transparent 70%)`,
                    animation: "pulse-glow 1.2s ease-in-out infinite",
                  }}
                />
              )
            }
          </div>

          <div className="ml-8 text-center">
            <p className="text-3xl font-black font-mono" style={{ color: current_mA > 20 ? "#EF4444" : "#10B981" }}>
              {current_mA.toFixed(1)}mA
            </p>
            <p className="text-xs text-white/30">Current</p>
            <div className="mt-2 h-2 w-28 rounded-full overflow-hidden mx-auto" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (current_mA / 20) * 100)}%`,
                  background: current_mA > 20 ? "#EF4444" : current_mA >= 15 ? "#10B981" : "#0EA5E9",
                }}
              />
            </div>
            <p className="text-[9px] text-white/20 mt-1">0 ━━━━━ 15mA ━ 20mA</p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-5">
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>🔋 Voltage</span>
              <span className="font-mono text-yellow-400">{voltage}V</span>
            </div>
            <input
              type="range" min={1} max={20} value={voltage}
              onChange={(e) => handle(Number(e.target.value), resistance)}
              className="w-full"
              style={{ background: `linear-gradient(to right, #EAB308 ${(voltage / 20) * 100}%, rgba(255,255,255,0.08) ${(voltage / 20) * 100}%)` }}
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>🚧 Resistance</span>
              <span className="font-mono text-orange-400">{resistance >= 1000 ? `${resistance / 1000}KΩ` : `${resistance}Ω`}</span>
            </div>
            <input
              type="range" min={100} max={5000} step={50} value={resistance}
              onChange={(e) => handle(voltage, Number(e.target.value))}
              className="w-full slider-orange"
              style={{ background: `linear-gradient(to right, #F97316 ${(resistance / 5000) * 100}%, rgba(255,255,255,0.08) ${(resistance / 5000) * 100}%)` }}
            />
          </div>
        </div>

        {/* Formula live */}
        <div className="p-3 rounded-xl border border-white/6 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-xs font-mono text-white/50">
            I = V ÷ R = <span className="text-yellow-400">{voltage}V</span> ÷ <span className="text-orange-400">{resistance}Ω</span> = <span style={{ color: current_mA > 20 ? "#EF4444" : "#0EA5E9" }}>{current_mA.toFixed(2)}mA</span>
          </p>
        </div>

        <AnimatePresence>
          {isWin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-2xl border border-primary/30 text-center"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <p className="text-lg mb-1">🏆</p>
              <p className="text-sm font-black text-primary">Challenge Complete!</p>
              <p className="text-xs text-white/50 mt-1">You used Ohm&apos;s Law to find the sweet spot: {current_mA.toFixed(1)}mA at {voltage}V with {resistance}Ω.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
