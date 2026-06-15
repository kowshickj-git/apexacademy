"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onTurnsRatioUsed: () => void;
}

const VOLTAGE_OPTIONS = [5, 12, 24, 120, 230];

export default function TurnsRatioSim({ onTurnsRatioUsed }: Props) {
  const [np, setNp] = useState(10);
  const [ns, setNs] = useState(5);
  const [vIn, setVIn] = useState(12);
  const [used, setUsed] = useState(false);

  const turnsRatio = np / ns;
  const vOut = (vIn * ns) / np;
  const iIn = 1; // Assume 1A primary for demo
  const iOut = iIn * (np / ns);
  const pIn = vIn * iIn;
  const pOut = vOut * iOut;

  const handleChange = (setter: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value));
    if (!used) {
      setUsed(true);
      onTurnsRatioUsed();
    }
  };

  // Build coil dots for visual
  const maxVisible = 20;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 3 · Turns Ratio
        </p>
        <h2 className="text-xl font-bold mb-1">Turns Ratio Calculator</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Adjust primary turns, secondary turns, and input voltage. All values update live.
        </p>

        {/* Coil visual */}
        <div
          className="rounded-2xl border border-white/8 p-5 mb-5"
          style={{ background: "rgba(139,92,246,0.04)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            {/* Primary coil */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-white/30 font-mono uppercase">Primary (Np={np})</span>
              <svg width="100%" height="50" viewBox={`0 0 ${Math.min(np * 12 + 20, 160)} 50`} style={{ maxWidth: 160 }}>
                {Array.from({ length: Math.min(np, maxVisible) }).map((_, i) => (
                  <ellipse
                    key={i}
                    cx={10 + i * (Math.min(np * 12 + 20, 160) / Math.min(np, maxVisible) * 0.85)}
                    cy={25}
                    rx={4}
                    ry={16}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="1.8"
                    opacity={0.7}
                  />
                ))}
              </svg>
            </div>

            {/* Core */}
            <div
              className="shrink-0 rounded-xl flex items-center justify-center text-[9px] font-mono text-white/20"
              style={{ width: 24, height: 60, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
            >
              Fe
            </div>

            {/* Secondary coil */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-white/30 font-mono uppercase">Secondary (Ns={ns})</span>
              <svg width="100%" height="50" viewBox={`0 0 ${Math.min(ns * 12 + 20, 160)} 50`} style={{ maxWidth: 160 }}>
                {Array.from({ length: Math.min(ns, maxVisible) }).map((_, i) => (
                  <ellipse
                    key={i}
                    cx={10 + i * (Math.min(ns * 12 + 20, 160) / Math.min(ns, maxVisible) * 0.85)}
                    cy={25}
                    rx={4}
                    ry={16}
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="1.8"
                    opacity={0.6}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Turns Ratio (a)", value: `${turnsRatio.toFixed(2)}:1`, color: "#8B5CF6" },
              { label: "V_out", value: `${vOut.toFixed(2)}V`, color: "#A78BFA" },
              { label: "I_out (if I_in=1A)", value: `${iOut.toFixed(3)}A`, color: "#C4B5FD" },
              { label: "P_in = P_out", value: `${pIn.toFixed(1)}W`, color: "#10B981" },
            ].map((item) => (
              <motion.div
                key={item.label}
                layout
                className="rounded-xl p-3 text-center border border-white/6"
                style={{ background: "rgba(0,0,0,0.25)" }}
              >
                <p className="text-[9px] text-white/25 font-mono uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-base font-black font-mono" style={{ color: item.color }}>{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-4">
          {/* Np slider */}
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Primary Turns (N_p)</span>
              <span className="font-mono" style={{ color: "#8B5CF6" }}>{np} turns</span>
            </div>
            <input
              type="range" min={1} max={20} step={1} value={np}
              onChange={handleChange(setNp)}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-white/20 mt-0.5"><span>1</span><span>20</span></div>
          </div>

          {/* Ns slider */}
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Secondary Turns (N_s)</span>
              <span className="font-mono" style={{ color: "#A78BFA" }}>{ns} turns</span>
            </div>
            <input
              type="range" min={1} max={20} step={1} value={ns}
              onChange={handleChange(setNs)}
              className="w-full accent-violet-400"
            />
            <div className="flex justify-between text-[10px] text-white/20 mt-0.5"><span>1</span><span>20</span></div>
          </div>

          {/* Voltage selector */}
          <div>
            <p className="text-xs text-white/40 mb-2">Input Voltage (V_in)</p>
            <div className="flex gap-2 flex-wrap">
              {VOLTAGE_OPTIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => { setVIn(v); if (!used) { setUsed(true); onTurnsRatioUsed(); } }}
                  className="px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all"
                  style={{
                    background: vIn === v ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                    borderColor: vIn === v ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)",
                    color: vIn === v ? "#8B5CF6" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Type indicator */}
        <div
          className="rounded-xl border p-3 text-sm text-center font-medium"
          style={{
            borderColor: ns > np ? "rgba(245,158,11,0.3)" : ns < np ? "rgba(139,92,246,0.3)" : "rgba(16,185,129,0.3)",
            background: ns > np ? "rgba(245,158,11,0.06)" : ns < np ? "rgba(139,92,246,0.06)" : "rgba(16,185,129,0.06)",
            color: ns > np ? "#F59E0B" : ns < np ? "#8B5CF6" : "#10B981",
          }}
        >
          {ns > np ? "Step-Up Transformer (N_s > N_p)" : ns < np ? "Step-Down Transformer (N_p > N_s)" : "Isolation Transformer (1:1)"}
        </div>

        {!used && (
          <p className="text-[11px] text-white/30 mt-3 text-center">Adjust any slider to earn +20 XP</p>
        )}
        {used && (
          <p className="text-[11px] mt-3 text-center" style={{ color: "#8B5CF6" }}>+20 XP earned!</p>
        )}
      </div>
    </section>
  );
}
