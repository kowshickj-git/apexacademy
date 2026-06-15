"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  onCurrentChangeUsed: () => void;
}

export default function CurrentChangeSim({ onCurrentChangeUsed }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [t, setT] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const V = 5;
  const R = 100;
  const L = 0.05; // 50mH
  const tau = L / R; // 0.5ms
  const duration = tau * 7;

  const Ifinal = V / R;

  const getResistorI = (timeS: number) => timeS >= 0 ? Ifinal : 0;
  const getInductorI = (timeS: number) => timeS >= 0 ? Ifinal * (1 - Math.exp(-timeS / tau)) : 0;

  const handleStart = () => {
    if (!triggered) { setTriggered(true); onCurrentChangeUsed(); }
    setT(0);
    setIsRunning(true);
    startRef.current = performance.now();
  };

  useEffect(() => {
    if (!isRunning) return;
    const animate = (now: number) => {
      const elapsed = (now - startRef.current) / 1000;
      setT(elapsed);
      if (elapsed >= duration) {
        setIsRunning(false);
        setT(duration);
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, duration]);

  const tRatio = Math.min(t / duration, 1);
  const rI = getResistorI(t);
  const lI = getInductorI(t);

  // Graph
  const GW = 110;
  const GH = 80;

  const buildResistorPath = () => {
    const pts = [`M 0 ${GH}`];
    for (let i = 1; i <= 60; i++) {
      const ts = (i / 60) * duration;
      const ratio = 1; // instant step
      const y = GH - ratio * GH;
      const x = (ts / duration) * GW;
      if (i === 1) pts.push(`L 0 ${GH} L 0 ${y}`);
      pts.push(`L ${x} ${y}`);
    }
    return pts.join(" ");
  };

  const buildInductorPath = () => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const ts = (i / 60) * duration;
      const ratio = 1 - Math.exp(-ts / tau);
      const x = (ts / duration) * GW;
      const y = GH - ratio * GH;
      if (i === 0) pts.push(`M ${x} ${y}`);
      else pts.push(`L ${x} ${y}`);
    }
    return pts.join(" ");
  };

  const rPath = buildResistorPath();
  const lPath = buildInductorPath();
  const clipW = tRatio * GW;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Simulator 4 · Opposition to Change
        </p>
        <h2 className="text-xl font-bold mb-1">Resistor vs Inductor Response</h2>
        <p className="text-white/45 text-sm mb-6">
          Apply a step voltage to both circuits simultaneously. See the key difference.
        </p>

        <div
          className="rounded-2xl border border-white/8 p-5"
          style={{ background: "rgba(236,72,153,0.03)" }}
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {/* Resistor panel */}
            <div
              className="p-4 rounded-xl border border-white/8"
              style={{ background: "rgba(14,165,233,0.04)" }}
            >
              <p className="text-[9px] text-white/25 font-mono uppercase mb-2">Pure Resistor Circuit</p>
              <div
                className="rounded-lg border border-white/6 p-2 mb-3"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <svg viewBox={`-2 -4 ${GW + 8} ${GH + 12}`} className="w-full">
                  {/* Grid */}
                  {[0.5, 1].map(f => (
                    <line key={f} x1="0" y1={GH - f * GH} x2={GW} y2={GH - f * GH}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
                  ))}
                  <line x1="0" y1="0" x2="0" y2={GH} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                  <line x1="0" y1={GH} x2={GW} y2={GH} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                  {/* Full dim curve */}
                  <path d={rPath} fill="none" stroke="rgba(14,165,233,0.15)" strokeWidth="1.5" />
                  {/* Clip */}
                  <defs><clipPath id="rClip"><rect x="0" y="0" width={clipW} height={GH + 2} /></clipPath></defs>
                  <path d={rPath} fill="none" stroke="#0EA5E9" strokeWidth="2" clipPath="url(#rClip)" />
                  <text x="2" y={GH - 2} fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">0A</text>
                  <text x="2" y="8" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">I_f</text>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-white/25 font-mono">CURRENT NOW</p>
                <p className="text-base font-black" style={{ color: "#0EA5E9" }}>
                  {(rI * 1000).toFixed(1)} mA
                </p>
                <p className="text-[9px] text-white/30">Instant step response</p>
              </div>
            </div>

            {/* Inductor panel */}
            <div
              className="p-4 rounded-xl border border-white/8"
              style={{ background: "rgba(236,72,153,0.04)" }}
            >
              <p className="text-[9px] text-white/25 font-mono uppercase mb-2">RL Circuit (with Inductor)</p>
              <div
                className="rounded-lg border border-white/6 p-2 mb-3"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <svg viewBox={`-2 -4 ${GW + 8} ${GH + 12}`} className="w-full">
                  {[0.5, 0.632, 1].map(f => (
                    <line key={f} x1="0" y1={GH - f * GH} x2={GW} y2={GH - f * GH}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="0.8"
                      strokeDasharray={f === 0.632 ? "3 2" : "none"} />
                  ))}
                  <line x1="0" y1="0" x2="0" y2={GH} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                  <line x1="0" y1={GH} x2={GW} y2={GH} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                  <path d={lPath} fill="none" stroke="rgba(236,72,153,0.15)" strokeWidth="1.5" />
                  <defs><clipPath id="lClip"><rect x="0" y="0" width={clipW} height={GH + 2} /></clipPath></defs>
                  <path d={lPath} fill="none" stroke="#EC4899" strokeWidth="2" clipPath="url(#lClip)" />
                  <text x="2" y={GH - 2} fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">0A</text>
                  <text x="2" y="8" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">I_f</text>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-white/25 font-mono">CURRENT NOW</p>
                <p className="text-base font-black" style={{ color: "#EC4899" }}>
                  {(lI * 1000).toFixed(1)} mA
                </p>
                <p className="text-[9px] text-white/30">Slow exponential rise</p>
              </div>
            </div>
          </div>

          {/* Insight box */}
          <div
            className="mb-4 p-3 rounded-xl border text-xs"
            style={{ background: "rgba(236,72,153,0.06)", borderColor: "rgba(236,72,153,0.2)" }}
          >
            <span className="text-white/50">Key insight: </span>
            <span style={{ color: "#EC4899" }}>
              The resistor reaches full current <em>instantly</em>. The inductor rises slowly over ~5τ.
              This is because the inductor generates a back-EMF (V = L×dI/dt) that opposes the current change.
            </span>
          </div>

          {/* τ info */}
          <div className="flex gap-2 mb-4 text-xs">
            <div className="flex-1 p-2 rounded-xl border border-white/6 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-white/25 font-mono">τ = L/R</p>
              <p className="font-black" style={{ color: "#EC4899" }}>
                {tau < 0.001 ? `${(tau * 1000000).toFixed(0)} µs` : `${(tau * 1000).toFixed(2)} ms`}
              </p>
            </div>
            <div className="flex-1 p-2 rounded-xl border border-white/6 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-white/25 font-mono">Progress</p>
              <p className="font-black" style={{ color: "#EC4899" }}>{(tRatio * 100).toFixed(0)}%</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            disabled={isRunning}
            className="w-full py-3 rounded-xl font-bold text-sm border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "rgba(236,72,153,0.15)", borderColor: "rgba(236,72,153,0.4)", color: "#EC4899" }}
          >
            {isRunning ? "Simulating…" : t > 0 ? "▶ Apply Step Voltage Again" : "▶ Apply Step Voltage to Both Circuits"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
