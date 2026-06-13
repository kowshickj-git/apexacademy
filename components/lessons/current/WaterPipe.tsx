"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function flowDesc(v: number) {
  if (v === 0) return "No flow → No current → Circuit is OFF";
  if (v <= 30) return "Slow trickle → Low current → Dim light";
  if (v <= 65) return "Steady flow → Moderate current → Normal";
  if (v <= 85) return "Fast flow → High current → Bright light!";
  return "Maximum flow → Peak current → Full power!";
}

interface WaterPipeProps {
  onSimUsed: () => void;
}

export default function WaterPipe({ onSimUsed }: WaterPipeProps) {
  const [flow, setFlow] = useState(50);
  const [triggered, setTriggered] = useState(false);
  const level = flow / 100;

  const handleChange = (v: number) => {
    setFlow(v);
    if (!triggered) { setTriggered(true); onSimUsed(); }
  };

  const dropSpeed = flow === 0 ? 0 : Math.max(0.55, 3 - level * 2.5);
  const bulbBrightness = level;

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#02</p>
        <h2 className="text-2xl font-bold text-white">Water Pipe Analogy</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* 3-col analogy map */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { elec: "Voltage", water: "Pressure", col: "primary" },
            { elec: "Current", water: "Flow Rate", col: "secondary" },
            { elec: "Resistance", water: "Pipe Size", col: "muted" },
          ].map(({ elec, water, col }) => (
            <div key={elec} className="rounded-xl border border-white/6 p-3" style={{ background: "#18181B" }}>
              <p className={`text-xs font-bold mb-0.5 ${col === "primary" ? "text-primary" : col === "secondary" ? "text-secondary" : "text-white/35"}`}>
                {elec}
              </p>
              <p className="text-[9px] text-white/20 mb-0.5">=</p>
              <p className="text-[11px] text-white/45">{water}</p>
            </div>
          ))}
        </div>

        {/* Pipe visualization */}
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "#18181B" }}>
          <div className="flex items-end justify-center gap-6 py-4">
            {/* Tank */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-14 h-24 rounded-xl border-2 overflow-hidden" style={{ borderColor: "#1F2937", background: "#0F172A" }}>
                <motion.div
                  className="absolute bottom-0 left-0 right-0"
                  animate={{ height: `${50 + level * 45}%` }}
                  transition={{ type: "spring", stiffness: 70, damping: 16 }}
                  style={{ background: "rgba(14,165,233,0.55)" }}
                />
              </div>
              <p className="text-[10px] text-white/28">Tank</p>
              <p className="text-[9px] text-secondary/45 font-mono">= Battery</p>
            </div>

            {/* Pipe + drops */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-36 h-8 rounded-full border-2 overflow-hidden" style={{ borderColor: "#1F2937", background: "#0F172A" }}>
                {flow > 0 && [0, 1, 2].map((i) => (
                  <motion.div
                    key={`${flow.toString()}-${i}`}
                    className="absolute top-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: 9, height: 9, background: "#0EA5E9", opacity: 0.75 }}
                    initial={{ left: -10 }}
                    animate={{ left: "calc(100% + 10px)" }}
                    transition={{ duration: dropSpeed, delay: i * (dropSpeed / 3), repeat: Infinity, ease: "linear" }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-white/28">Pipe</p>
              <p className="text-[9px] text-secondary/45 font-mono">= Wire</p>
            </div>

            {/* Bulb */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                style={{
                  borderColor: flow > 0 ? `rgba(14,165,233,${0.3 + bulbBrightness * 0.7})` : "#1F2937",
                  background: flow > 0 ? `rgba(14,165,233,${0.05 + bulbBrightness * 0.22})` : "#0F172A",
                  boxShadow: flow > 0 ? `0 0 ${Math.round(bulbBrightness * 28)}px rgba(14,165,233,${bulbBrightness * 0.55})` : "none",
                }}
              >
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                  <path
                    d="M10 1C5.58 1 2 4.58 2 9c0 2.7 1.34 5.09 3.38 6.56V17h9.24v-1.44C16.66 14.09 18 11.7 18 9c0-4.42-3.58-8-8-8Z"
                    fill={flow > 0 ? `rgba(14,165,233,${0.2 + bulbBrightness * 0.65})` : "#1F2937"}
                    stroke={flow > 0 ? "#0EA5E9" : "#374151"}
                    strokeWidth="1.4"
                  />
                  <rect x="6.5" y="17" width="7" height="3" rx="1" fill="#374151" />
                  {flow > 0 && <circle cx="7" cy="7" r="3" fill="white" opacity={bulbBrightness * 0.28} />}
                </svg>
              </div>
              <p className="text-[10px] text-white/28">Load</p>
              <p className="text-[9px] text-secondary/45 font-mono">= Device</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={Math.round(flow / 15)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-center text-white/40 pt-3 border-t border-white/5"
            >
              {flowDesc(flow)}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Slider */}
        <div className="rounded-2xl border border-white/6 p-4 space-y-3" style={{ background: "#18181B" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Flow Rate</p>
            <motion.span
              key={flow}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-xl font-extrabold text-secondary tabular-nums"
            >
              {flow}%
            </motion.span>
          </div>
          <input
            type="range"
            min={0} max={100} step={5}
            value={flow}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="slider-secondary"
            style={{
              background: `linear-gradient(to right, #0EA5E9 0%, #0EA5E9 ${flow}%, rgba(255,255,255,0.07) ${flow}%, rgba(255,255,255,0.07) 100%)`,
            }}
          />
          <div className="flex justify-between text-[11px] text-white/20 font-mono">
            <span>0% — No flow</span>
            <span>100% — Max flow</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
