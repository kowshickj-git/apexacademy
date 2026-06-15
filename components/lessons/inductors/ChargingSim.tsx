"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onChargingUsed: () => void;
}

export default function ChargingSim({ onChargingUsed }: Props) {
  const [L, setL] = useState(10); // mH
  const [R, setR] = useState(100); // Ω
  const [isPlaying, setIsPlaying] = useState(false);
  const [t, setT] = useState(0); // current time in ms
  const [triggered, setTriggered] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const V = 5; // fixed supply voltage
  const tau = (L / 1000) / R; // seconds
  const tauMs = tau * 1000;
  const Ifinal = V / R; // A
  const totalTime = tau * 6; // seconds to show

  const getCurrentAt = useCallback((timeS: number) => {
    return Ifinal * (1 - Math.exp(-timeS / tau));
  }, [Ifinal, tau]);

  const play = () => {
    if (!triggered) { setTriggered(true); onChargingUsed(); }
    setT(0);
    setIsPlaying(true);
    startRef.current = performance.now();
  };

  useEffect(() => {
    if (!isPlaying) return;
    const animate = (now: number) => {
      const elapsed = (now - startRef.current) / 1000; // seconds
      setT(elapsed * 1000); // store in ms
      if (elapsed >= totalTime) {
        setIsPlaying(false);
        setT(totalTime * 1000);
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, totalTime]);

  const tSec = t / 1000;
  const Icurrent = getCurrentAt(tSec);
  const IpercFinal = Ifinal > 0 ? (Icurrent / Ifinal) * 100 : 0;

  // Graph points
  const GRAPH_W = 260;
  const GRAPH_H = 100;
  const points: string[] = [];
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const ts = (i / steps) * totalTime;
    const I = getCurrentAt(ts);
    const x = (ts / totalTime) * GRAPH_W;
    const y = GRAPH_H - (I / Ifinal) * GRAPH_H;
    if (i === 0) points.push(`M ${x} ${y}`);
    else points.push(`L ${x} ${y}`);
  }
  const fullCurve = points.join(" ");

  // Progress up to current t
  const tRatio = Math.min(tSec / totalTime, 1);
  const clipWidth = tRatio * GRAPH_W;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Simulator 1 · Inductor Charging
        </p>
        <h2 className="text-xl font-bold mb-1">RL Charging Curve</h2>
        <p className="text-white/45 text-sm mb-6">
          Watch current rise exponentially from 0 → V/R following I(t) = (V/R)(1 - e<sup>-Rt/L</sup>).
        </p>

        <div
          className="rounded-2xl border border-white/8 p-5"
          style={{ background: "rgba(236,72,153,0.03)" }}
        >
          {/* Sliders */}
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs text-white/50 font-mono">Inductance (L)</label>
                <span className="text-xs font-bold" style={{ color: "#EC4899" }}>{L} mH</span>
              </div>
              <input
                type="range" min={1} max={100} step={1} value={L}
                onChange={e => { setL(Number(e.target.value)); setIsPlaying(false); setT(0); }}
                className="w-full accent-pink-500 h-1.5 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-white/20 font-mono mt-0.5">
                <span>1 mH</span><span>100 mH</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs text-white/50 font-mono">Resistance (R)</label>
                <span className="text-xs font-bold" style={{ color: "#EC4899" }}>{R} Ω</span>
              </div>
              <input
                type="range" min={10} max={1000} step={10} value={R}
                onChange={e => { setR(Number(e.target.value)); setIsPlaying(false); setT(0); }}
                className="w-full accent-pink-500 h-1.5 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-white/20 font-mono mt-0.5">
                <span>10 Ω</span><span>1 kΩ</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "τ = L/R", value: tauMs < 1 ? `${(tauMs * 1000).toFixed(1)} µs` : `${tauMs.toFixed(2)} ms` },
              { label: "I_final = V/R", value: Ifinal < 0.1 ? `${(Ifinal * 1000).toFixed(1)} mA` : `${Ifinal.toFixed(3)} A` },
              { label: "V supply", value: `${V} V` },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-xl border border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[9px] text-white/25 font-mono">{s.label}</p>
                <p className="text-sm font-black" style={{ color: "#EC4899" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Graph */}
          <div
            className="rounded-xl border border-white/8 p-3 mb-4"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <p className="text-[9px] text-white/25 font-mono mb-2">CURRENT vs TIME</p>
            <svg viewBox={`0 0 ${GRAPH_W + 30} ${GRAPH_H + 20}`} className="w-full">
              {/* Grid lines */}
              {[0.25, 0.5, 0.632, 0.75, 1].map(frac => (
                <g key={frac}>
                  <line
                    x1="25" y1={GRAPH_H - frac * GRAPH_H}
                    x2={GRAPH_W + 25} y2={GRAPH_H - frac * GRAPH_H}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    strokeDasharray={frac === 0.632 ? "4 3" : "2 4"}
                  />
                  <text x="2" y={GRAPH_H - frac * GRAPH_H + 3} fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">
                    {(frac * 100).toFixed(0)}%
                  </text>
                </g>
              ))}
              {/* 63.2% label */}
              <text x="30" y={GRAPH_H - 0.632 * GRAPH_H - 3} fill="rgba(236,72,153,0.5)" fontSize="6" fontFamily="monospace">63.2% at τ</text>

              {/* Axes */}
              <line x1="25" y1="0" x2="25" y2={GRAPH_H} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="25" y1={GRAPH_H} x2={GRAPH_W + 25} y2={GRAPH_H} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Full curve (dim) */}
              <g transform="translate(25,0)">
                <path d={fullCurve} fill="none" stroke="rgba(236,72,153,0.15)" strokeWidth="1.5" />
              </g>

              {/* Animated clip */}
              <defs>
                <clipPath id="chargeClip">
                  <rect x="0" y="0" width={clipWidth} height={GRAPH_H + 5} />
                </clipPath>
              </defs>
              <g transform="translate(25,0)" clipPath="url(#chargeClip)">
                <path d={fullCurve} fill="none" stroke="#EC4899" strokeWidth="2.5" />
              </g>

              {/* Current position dot */}
              {tRatio > 0 && (
                <circle
                  cx={25 + tRatio * GRAPH_W}
                  cy={GRAPH_H - (Icurrent / Ifinal) * GRAPH_H}
                  r="4"
                  fill="#EC4899"
                />
              )}

              {/* τ marker */}
              <line
                x1={25 + (1 / 6) * GRAPH_W} y1="0"
                x2={25 + (1 / 6) * GRAPH_W} y2={GRAPH_H}
                stroke="rgba(236,72,153,0.3)" strokeWidth="1" strokeDasharray="3 3"
              />
              <text x={25 + (1 / 6) * GRAPH_W - 2} y={GRAPH_H + 12} fill="rgba(236,72,153,0.4)" fontSize="7" fontFamily="monospace">1τ</text>
              <text x={25 + (5 / 6) * GRAPH_W - 5} y={GRAPH_H + 12} fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">5τ</text>
            </svg>
          </div>

          {/* Current readout */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/30 font-mono">CURRENT NOW</p>
              <p className="text-lg font-black" style={{ color: "#EC4899" }}>
                {(Icurrent * 1000).toFixed(1)} mA
              </p>
              <p className="text-[10px] text-white/25">{IpercFinal.toFixed(1)}% of final value</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/30 font-mono">TIME ELAPSED</p>
              <p className="text-lg font-black text-white/60">{t < 1000 ? `${t.toFixed(0)} µs` : `${(t/1000).toFixed(2)} ms`}</p>
              <p className="text-[10px] text-white/25">{(tSec / tau).toFixed(2)}τ</p>
            </div>
          </div>

          {/* Milestone labels */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="p-2 rounded-lg border border-white/5 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="text-white/30">At t=τ → </span>
              <span style={{ color: "#EC4899" }}>63.2%</span>
            </div>
            <div className="p-2 rounded-lg border border-white/5 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="text-white/30">At t=5τ → </span>
              <span style={{ color: "#EC4899" }}>99.3%</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={play}
            disabled={isPlaying}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border"
            style={{
              background: "rgba(236,72,153,0.15)",
              borderColor: "rgba(236,72,153,0.4)",
              color: "#EC4899",
            }}
          >
            {isPlaying ? "Charging…" : t > 0 ? "▶ Replay Simulation" : "▶ Start Charging Simulation"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
