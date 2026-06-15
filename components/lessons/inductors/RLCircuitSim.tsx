"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  onRLCircuitUsed: () => void;
}

export default function RLCircuitSim({ onRLCircuitUsed }: Props) {
  const [V, setV] = useState(5);
  const [R, setR] = useState(100);
  const [Lmh, setLmh] = useState(10);
  const [tSlider, setTSlider] = useState(0); // 0–100% of 5τ
  const [triggered, setTriggered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animT, setAnimT] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const L = Lmh / 1000;
  const tau = L / R; // seconds
  const tauDisplay = tau < 0.001 ? `${(tau * 1e6).toFixed(1)} µs` : tau < 1 ? `${(tau * 1000).toFixed(2)} ms` : `${tau.toFixed(3)} s`;
  const Ifinal = V / R;
  const IfinalDisplay = Ifinal < 0.1 ? `${(Ifinal * 1000).toFixed(1)} mA` : `${Ifinal.toFixed(3)} A`;

  const tSeconds = (tSlider / 100) * tau * 5;
  const Inow = Ifinal * (1 - Math.exp(-tSeconds / tau));
  const InowDisplay = Inow < 0.1 ? `${(Inow * 1000).toFixed(2)} mA` : `${Inow.toFixed(4)} A`;
  const energyNow = 0.5 * L * Inow * Inow;
  const energyDisplay = energyNow < 0.001 ? `${(energyNow * 1e6).toFixed(2)} µJ` : `${(energyNow * 1000).toFixed(3)} mJ`;

  const handleChange = (setter: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value));
    if (!triggered) { setTriggered(true); onRLCircuitUsed(); }
  };

  const handleAnimate = () => {
    setAnimT(0);
    setTSlider(0);
    setIsAnimating(true);
    startRef.current = performance.now();
  };

  useEffect(() => {
    if (!isAnimating) return;
    const animDuration = 3000; // 3 seconds real time = 5τ sim
    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / animDuration) * 100, 100);
      setTSlider(pct);
      setAnimT(pct);
      if (pct >= 100) {
        setIsAnimating(false);
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  // Graph
  const GW = 240;
  const GH = 90;

  const buildPath = () => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const ts = (i / 80) * tau * 5;
      const ratio = 1 - Math.exp(-ts / tau);
      const x = (i / 80) * GW;
      const y = GH - ratio * GH;
      if (i === 0) pts.push(`M ${x} ${y}`);
      else pts.push(`L ${x} ${y}`);
    }
    return pts.join(" ");
  };

  const fullPath = buildPath();
  const clipW = (tSlider / 100) * GW;
  const dotX = clipW;
  const dotY = GH - (Inow / Ifinal) * GH;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Simulator 5 · Full RL Circuit
        </p>
        <h2 className="text-xl font-bold mb-1">RL Circuit Simulator</h2>
        <p className="text-white/45 text-sm mb-6">
          Set voltage, resistance, and inductance. Explore current at any time point.
        </p>

        <div
          className="rounded-2xl border border-white/8 p-5"
          style={{ background: "rgba(236,72,153,0.03)" }}
        >
          {/* Parameter sliders */}
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-white/40 font-mono">V Supply</label>
                <span className="text-xs font-bold" style={{ color: "#EC4899" }}>{V} V</span>
              </div>
              <input type="range" min={1} max={24} step={1} value={V}
                onChange={handleChange(setV)}
                className="w-full accent-pink-500 h-1.5 rounded-full cursor-pointer" />
              <div className="flex justify-between text-[9px] text-white/15 font-mono mt-0.5"><span>1V</span><span>24V</span></div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-white/40 font-mono">R (Ohms)</label>
                <span className="text-xs font-bold" style={{ color: "#EC4899" }}>{R >= 1000 ? `${R/1000}kΩ` : `${R}Ω`}</span>
              </div>
              <input type="range" min={10} max={1000} step={10} value={R}
                onChange={handleChange(setR)}
                className="w-full accent-pink-500 h-1.5 rounded-full cursor-pointer" />
              <div className="flex justify-between text-[9px] text-white/15 font-mono mt-0.5"><span>10Ω</span><span>1kΩ</span></div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-white/40 font-mono">L (inductance)</label>
                <span className="text-xs font-bold" style={{ color: "#EC4899" }}>{Lmh >= 1000 ? `${Lmh/1000}H` : `${Lmh}mH`}</span>
              </div>
              <input type="range" min={1} max={1000} step={1} value={Lmh}
                onChange={handleChange(setLmh)}
                className="w-full accent-pink-500 h-1.5 rounded-full cursor-pointer" />
              <div className="flex justify-between text-[9px] text-white/15 font-mono mt-0.5"><span>1mH</span><span>1H</span></div>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { label: "τ = L/R", value: tauDisplay, sub: "time constant" },
              { label: "I_final = V/R", value: IfinalDisplay, sub: "max current" },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl border border-white/6 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[9px] text-white/25 font-mono">{s.label}</p>
                <p className="text-lg font-black" style={{ color: "#EC4899" }}>{s.value}</p>
                <p className="text-[9px] text-white/25">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Time slider */}
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-white/40 font-mono">Time (t)</label>
              <span className="text-xs font-bold text-white/60">
                {tSeconds < 0.001 ? `${(tSeconds * 1e6).toFixed(1)} µs` : tSeconds < 1 ? `${(tSeconds * 1000).toFixed(2)} ms` : `${tSeconds.toFixed(3)} s`}
                {" "}({(tSlider / 100 * 5).toFixed(2)}τ)
              </span>
            </div>
            <input type="range" min={0} max={100} step={0.5} value={tSlider}
              onChange={e => { setTSlider(Number(e.target.value)); if (!triggered) { setTriggered(true); onRLCircuitUsed(); } }}
              className="w-full accent-pink-500 h-2 rounded-full cursor-pointer" />
            <div className="flex justify-between text-[9px] text-white/15 font-mono mt-0.5">
              <span>0</span><span>1τ</span><span>2τ</span><span>3τ</span><span>4τ</span><span>5τ</span>
            </div>
          </div>

          {/* Graph */}
          <div
            className="rounded-xl border border-white/8 p-3 mb-4"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            <p className="text-[9px] text-white/20 font-mono mb-2">CURRENT vs TIME — I(t) = I_f × (1-e^(-t/τ))</p>
            <svg viewBox={`0 0 ${GW + 30} ${GH + 20}`} className="w-full">
              {/* Grid */}
              {[0.25, 0.5, 0.632, 0.75, 1].map(f => (
                <g key={f}>
                  <line x1="25" y1={GH - f * GH} x2={GW + 25} y2={GH - f * GH}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="0.8"
                    strokeDasharray={f === 0.632 ? "3 3" : "2 4"} />
                  <text x="2" y={GH - f * GH + 3} fill="rgba(255,255,255,0.18)" fontSize="6" fontFamily="monospace">
                    {(f * 100).toFixed(0)}%
                  </text>
                </g>
              ))}
              <line x1="25" y1="0" x2="25" y2={GH} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="25" y1={GH} x2={GW + 25} y2={GH} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              {/* τ markers */}
              {[1, 2, 3, 4, 5].map(n => (
                <g key={n}>
                  <line x1={25 + (n / 5) * GW} y1="0" x2={25 + (n / 5) * GW} y2={GH}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
                  <text x={25 + (n / 5) * GW - 3} y={GH + 12} fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="monospace">{n}τ</text>
                </g>
              ))}
              {/* Full dim */}
              <g transform="translate(25,0)">
                <path d={fullPath} fill="none" stroke="rgba(236,72,153,0.12)" strokeWidth="1.5" />
              </g>
              {/* Animated fill */}
              <defs><clipPath id="rlClip"><rect x="0" y="0" width={clipW} height={GH + 2} /></clipPath></defs>
              <g transform="translate(25,0)" clipPath="url(#rlClip)">
                <path d={fullPath} fill="none" stroke="#EC4899" strokeWidth="2.5" />
              </g>
              {/* Dot */}
              {tSlider > 0 && (
                <circle cx={25 + dotX} cy={dotY} r="4.5" fill="#EC4899" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
              )}
              {/* 63.2% line label */}
              <text x="28" y={GH - 0.632 * GH - 3} fill="rgba(236,72,153,0.4)" fontSize="6" fontFamily="monospace">63.2%</text>
            </svg>
          </div>

          {/* Current and energy readout */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl border border-white/6 text-center" style={{ background: "rgba(236,72,153,0.05)" }}>
              <p className="text-[9px] text-white/25 font-mono">I(t) NOW</p>
              <p className="text-xl font-black" style={{ color: "#EC4899" }}>{InowDisplay}</p>
              <p className="text-[9px] text-white/30">{Ifinal > 0 ? ((Inow / Ifinal) * 100).toFixed(1) : 0}% of final</p>
            </div>
            <div className="p-3 rounded-xl border border-white/6 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[9px] text-white/25 font-mono">E = ½LI²</p>
              <p className="text-xl font-black text-white/70">{energyDisplay}</p>
              <p className="text-[9px] text-white/30">energy stored</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnimate}
            disabled={isAnimating}
            className="w-full py-3 rounded-xl font-bold text-sm border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "rgba(236,72,153,0.15)", borderColor: "rgba(236,72,153,0.4)", color: "#EC4899" }}
          >
            {isAnimating ? "Animating charge curve…" : "▶ Animate Charging (0 → 5τ)"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
