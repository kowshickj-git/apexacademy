"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onVoltageUsed: () => void;
}

const VOLTAGE_STOPS = [1.5, 3, 5, 9, 12];

export default function VoltageSim({ onVoltageUsed }: Props) {
  const [batteryV, setBatteryV] = useState(5);
  const [probeCorrect, setProbeCorrect] = useState(true);
  const [used, setUsed] = useState(false);

  const handleInteract = () => {
    if (!used) {
      setUsed(true);
      onVoltageUsed();
    }
  };

  const sliderPct = ((batteryV - 1.5) / (12 - 1.5)) * 100;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 4 · Simulator 1
        </p>
        <h2 className="text-xl font-bold mb-1">Voltage Measurement Simulator</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          A voltmeter connects in PARALLEL. Adjust the battery voltage and try both probe placements.
        </p>

        {/* Probe placement toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setProbeCorrect(true); handleInteract(); }}
            className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all"
            style={
              probeCorrect
                ? { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)", color: "#10B981" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
            }
          >
            ✓ Correct (Parallel)
          </button>
          <button
            onClick={() => { setProbeCorrect(false); handleInteract(); }}
            className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all"
            style={
              !probeCorrect
                ? { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.4)", color: "#EF4444" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
            }
          >
            ✗ Incorrect (Series)
          </button>
        </div>

        {/* Circuit + Meter visual */}
        <div className="rounded-2xl border border-white/8 p-5 mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {/* Battery */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="relative w-14 h-24 rounded-xl border-2 flex flex-col items-center justify-between py-2"
                style={{ borderColor: "rgba(234,179,8,0.5)", background: "rgba(234,179,8,0.08)" }}
              >
                <span className="text-xs font-black text-yellow-400">+</span>
                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-yellow-400">{batteryV}V</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Battery</div>
                </div>
                <span className="text-xs font-black text-white/40">−</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-white/20 text-lg">→</div>

            {/* Multimeter display */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-28 h-16 rounded-xl border-2 flex items-center justify-center font-mono font-black text-xl transition-all duration-300"
                style={
                  probeCorrect
                    ? {
                        borderColor: "rgba(16,185,129,0.5)",
                        background: "rgba(16,185,129,0.08)",
                        color: "#10B981",
                        boxShadow: "0 0 16px rgba(16,185,129,0.2)",
                      }
                    : {
                        borderColor: "rgba(239,68,68,0.5)",
                        background: "rgba(239,68,68,0.08)",
                        color: "#EF4444",
                        boxShadow: "0 0 16px rgba(239,68,68,0.15)",
                      }
                }
              >
                {probeCorrect ? `${batteryV.toFixed(1)}V` : "ERROR"}
              </div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-gray-500 bg-black/50" />
                <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-black/50" />
              </div>
              <p className="text-[9px] font-mono text-white/30">Multimeter</p>
            </div>
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            <motion.div
              key={probeCorrect ? "correct" : "wrong"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-xs font-semibold"
              style={{ color: probeCorrect ? "#10B981" : "#EF4444" }}
            >
              {probeCorrect
                ? `✅ Reading: ${batteryV.toFixed(1)}V — Circuit is unaffected. Voltmeter has MΩ internal resistance.`
                : "⚠️ Probes in series — this is how you measure CURRENT, not voltage. Wrong mode!"}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Battery voltage slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>🔋 Battery Voltage</span>
            <span className="font-mono text-yellow-400">{batteryV.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            min={1.5}
            max={12}
            step={0.1}
            value={batteryV}
            onChange={(e) => { setBatteryV(Number(e.target.value)); handleInteract(); }}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #EAB308 ${sliderPct}%, rgba(255,255,255,0.08) ${sliderPct}%)`,
            }}
          />
          <div className="flex justify-between text-[9px] text-white/20 mt-1 font-mono">
            {VOLTAGE_STOPS.map((v) => (
              <span key={v}>{v}V</span>
            ))}
          </div>
        </div>

        {/* Key fact */}
        <div
          className="rounded-xl border border-white/8 p-3"
          style={{ background: "rgba(167,139,250,0.05)" }}
        >
          <p className="text-[10px] text-white/25 font-mono uppercase mb-1">Key Fact</p>
          <p className="text-xs text-white/55 leading-relaxed">
            <span style={{ color: "#A78BFA" }} className="font-bold">Voltmeter connects IN PARALLEL</span> — both probes
            touch the same two points simultaneously. The circuit does <span className="font-bold text-white/70">NOT</span> break.
            The meter&apos;s very high internal resistance (MΩ) ensures it draws almost no current from the circuit.
          </p>
        </div>
      </div>
    </section>
  );
}
