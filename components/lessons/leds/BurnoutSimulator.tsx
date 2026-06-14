"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onResistorUsed: () => void; }

type Stage = "normal" | "hot" | "critical" | "dead";

export default function BurnoutSimulator({ onResistorUsed }: Props) {
  const [current, setCurrent] = useState(5);
  const [used, setUsed] = useState(false);
  const [stage, setStage] = useState<Stage>("normal");
  const [burnedOut, setBurnedOut] = useState(false);

  const handle = (v: number) => {
    if (!used) { setUsed(true); onResistorUsed(); }
    setCurrent(v);
    if (v > 40 && !burnedOut) {
      setStage("dead");
      setBurnedOut(true);
    } else if (v > 30) {
      setStage("critical");
    } else if (v > 22) {
      setStage("hot");
    } else {
      setStage("normal");
    }
  };

  const reset = () => {
    setCurrent(5);
    setStage("normal");
    setBurnedOut(false);
    setUsed(true);
  };

  const stageInfo: Record<Stage, { color: string; glow: string; label: string; detail: string; icon: string }> = {
    normal: { color: "#10B981", glow: "rgba(16,185,129,0.6)", label: "Normal operation", detail: "LED is happy. Current within 10–20mA range.", icon: "✅" },
    hot: { color: "#F97316", glow: "rgba(249,115,22,0.7)", label: "Running hot", detail: "Current above 25mA. LED junction heating up. Reduce current immediately.", icon: "♨️" },
    critical: { color: "#EF4444", glow: "rgba(239,68,68,0.8)", label: "CRITICAL — burning", detail: "Junction temperature rising dangerously. Luminous efficiency dropping. Failure imminent.", icon: "🔥" },
    dead: { color: "#4B5563", glow: "none", label: "LED destroyed", detail: "P-N junction melted. Open circuit — no light, no current. Non-recoverable.", icon: "💀" },
  };

  const info = stageInfo[stage];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Simulator 4</p>
        <h2 className="text-xl font-bold mb-1">LED Burnout Simulator</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          See what happens when too much current flows through an LED. Drag the slider past 40mA to simulate burnout. Standard 5mm LEDs are rated for 20mA continuous — some can handle 30mA briefly.
        </p>

        {/* Main visual */}
        <div
          className="rounded-2xl border p-6 mb-5 text-center"
          style={{
            borderColor: stage === "normal" ? "rgba(16,185,129,0.3)" : stage === "hot" ? "rgba(249,115,22,0.4)" : stage === "critical" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)",
            background: stage === "normal" ? "rgba(16,185,129,0.04)" : stage === "hot" ? "rgba(249,115,22,0.06)" : stage === "critical" ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              {/* LED visual */}
              <div
                className="w-24 h-24 rounded-full border-2 flex items-center justify-center text-4xl transition-all duration-500"
                style={{
                  borderColor: stage === "dead" ? "#374151" : info.color,
                  background: stage === "dead" ? "rgba(0,0,0,0.4)" : `${info.color}${Math.min(99, Math.round((current / 40) * 60) + 20).toString(16).padStart(2, "0")}`,
                  boxShadow: stage === "dead" ? "none" : `0 0 ${(current / 40) * 40}px ${info.glow}`,
                }}
              >
                {stage === "dead" ? "💀" : stage === "critical" ? "🔥" : stage === "hot" ? "♨️" : ""}
              </div>

              <div>
                <p className="text-base font-bold" style={{ color: info.color }}>{info.icon} {info.label}</p>
                <p className="text-xs text-white/45 mt-1">{info.detail}</p>
              </div>

              {/* Temperature bar */}
              <div className="w-full">
                <div className="flex justify-between text-[10px] text-white/30 mb-1 font-mono">
                  <span>Junction temp</span>
                  <span style={{ color: stage === "dead" ? "#EF4444" : info.color }}>
                    {stage === "dead" ? "DESTROYED" : `~${Math.round(25 + (current / 40) * 125)}°C`}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${Math.min(100, (current / 40) * 100)}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: stage === "normal" ? "#10B981" : stage === "hot" ? "#F97316" : "#EF4444",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-white/15 mt-0.5 font-mono">
                  <span>25°C</span>
                  <span>75°C max</span>
                  <span>150°C = dead</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider */}
        {!burnedOut ? (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Current through LED</span>
              <span className="font-mono font-bold" style={{ color: info.color }}>{current}mA</span>
            </div>
            <input
              type="range" min={0} max={60} step={1} value={current}
              onChange={(e) => handle(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, ${info.color} ${(current / 60) * 100}%, rgba(255,255,255,0.08) ${(current / 60) * 100}%)` }}
            />
            <div className="flex justify-between text-[9px] text-white/20 mt-1 font-mono">
              <span>0mA</span>
              <span style={{ color: "#10B981" }}>20mA safe</span>
              <span style={{ color: "#EF4444" }}>40mA+ burnout</span>
            </div>
          </div>
        ) : (
          <div className="mb-5 text-center">
            <p className="text-sm text-red-400 font-bold mb-3">🔴 LED is permanently destroyed</p>
            <button
              onClick={reset}
              className="px-6 py-2 rounded-xl border border-white/15 text-xs font-semibold text-white/50 hover:bg-white/5 transition-colors"
            >
              ↩ Replace LED (reset)
            </button>
          </div>
        )}

        {/* Safe zone marker */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { range: "0–20mA", label: "Safe zone", color: "#10B981" },
            { range: "20–30mA", label: "Caution", color: "#F97316" },
            { range: "30mA+", label: "Danger zone", color: "#EF4444" },
          ].map(({ range, label, color }) => (
            <div key={range} className="rounded-xl border border-white/6 p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs font-mono font-bold" style={{ color }}>{range}</p>
              <p className="text-[9px] text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
