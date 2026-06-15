"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  onStepDownUsed: () => void;
}

export default function StepDownSim({ onStepDownUsed }: Props) {
  const [vIn, setVIn] = useState(120);
  const [used, setUsed] = useState(false);
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  const NP = 12;
  const NS = 4;
  const ratio = NS / NP; // 1/3
  const vOut = Math.round((vIn * ratio) * 10) / 10;

  useEffect(() => {
    let running = true;
    const tick = (ts: number) => {
      if (!running) return;
      const delta = ts - lastRef.current;
      lastRef.current = ts;
      setPhase((p) => (p + delta * 0.3) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame((ts) => {
      lastRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    });
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleSlider = (v: number) => {
    setVIn(v);
    if (!used) {
      setUsed(true);
      onStepDownUsed();
    }
  };

  const makePath = (amplitude: number, phaseOff: number) => {
    let d = "";
    for (let i = 0; i <= 80; i++) {
      const x = i;
      const angle = ((i / 80) * 720 + phase + phaseOff) * (Math.PI / 180);
      const y = 25 - Math.sin(angle) * amplitude;
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  };

  // Normalize wave heights: primary is big, secondary is smaller
  const primaryAmp = 18;
  const secondaryAmp = primaryAmp * ratio;

  const safetyNote = vIn > 100;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 2 · Step-Down Transformer
        </p>
        <h2 className="text-xl font-bold mb-1">Step-Down Simulator</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Primary: <strong style={{ color: "#8B5CF6" }}>12 turns</strong>. Secondary: <strong style={{ color: "#A78BFA" }}>4 turns</strong>. Ratio 3:1 — output is ⅓ of input voltage.
        </p>

        {/* Main visual */}
        <div
          className="rounded-2xl border border-white/8 p-5 mb-5"
          style={{ background: "rgba(139,92,246,0.04)" }}
        >
          {/* House → Transformer → Device */}
          <div className="flex items-center justify-between gap-3 mb-5">
            {/* House / mains source */}
            <div className="flex flex-col items-center gap-1">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <polygon points="20,4 36,18 4,18" fill="rgba(139,92,246,0.2)" stroke="#8B5CF6" strokeWidth="1.2" />
                <rect x="12" y="18" width="16" height="16" fill="rgba(139,92,246,0.15)" stroke="#8B5CF6" strokeWidth="1.2" />
                <rect x="17" y="26" width="6" height="8" fill="rgba(139,92,246,0.3)" />
              </svg>
              <span className="text-[9px] font-mono" style={{ color: "#8B5CF6" }}>{vIn}V</span>
              <span className="text-[9px] text-white/25">Mains</span>
            </div>

            {/* Big wave */}
            <div className="flex-1 flex flex-col items-center">
              <svg width="100" height="50" viewBox="0 0 80 50">
                <path d={makePath(primaryAmp, 0)} stroke="#8B5CF6" strokeWidth="2" fill="none" />
                <text x="40" y="48" fill="rgba(255,255,255,0.25)" fontSize="7" textAnchor="middle">High V, Low I</text>
              </svg>
            </div>

            {/* Transformer box */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className="rounded-lg flex items-center justify-center text-[9px] font-mono font-bold"
                style={{ width: 44, height: 44, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#8B5CF6" }}
              >
                XFMR
              </div>
              <span className="text-[9px] text-white/20">3:1</span>
            </div>

            {/* Small wave */}
            <div className="flex-1 flex flex-col items-center">
              <svg width="100" height="50" viewBox="0 0 80 50">
                <path d={makePath(secondaryAmp, 30)} stroke="#A78BFA" strokeWidth="2" fill="none" />
                <text x="40" y="48" fill="rgba(255,255,255,0.25)" fontSize="7" textAnchor="middle">Low V, High I</text>
              </svg>
            </div>

            {/* Charger / device */}
            <div className="flex flex-col items-center gap-1">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <rect x="8" y="6" width="24" height="28" rx="3" fill="rgba(167,139,250,0.15)" stroke="#A78BFA" strokeWidth="1.2" />
                <line x1="16" y1="16" x2="24" y2="16" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="12" x2="20" y2="24" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-mono" style={{ color: "#A78BFA" }}>{vOut}V</span>
              <span className="text-[9px] text-white/25">Charger</span>
            </div>
          </div>

          {/* Formula */}
          <div
            className="rounded-xl p-3 text-center font-mono text-xs"
            style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.5)" }}
          >
            V_out = V_in × (N_s / N_p) = {vIn}V × ({NS}/{NP}) =&nbsp;
            <span style={{ color: "#A78BFA" }} className="font-bold">{vOut}V</span>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Input Voltage (V_in)</span>
            <span className="font-mono" style={{ color: "#8B5CF6" }}>{vIn}V</span>
          </div>
          <input
            type="range"
            min={12}
            max={240}
            step={12}
            value={vIn}
            onChange={(e) => handleSlider(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>12V</span>
            <span>240V</span>
          </div>
        </div>

        {/* Result */}
        <motion.div
          key={vOut}
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          className="rounded-xl border p-4 text-center mb-3"
          style={{ borderColor: "rgba(167,139,250,0.25)", background: "rgba(167,139,250,0.06)" }}
        >
          <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1">Output Voltage</p>
          <p className="text-3xl font-black" style={{ color: "#A78BFA" }}>{vOut}V</p>
          <p className="text-xs text-white/35 mt-1">Input {vIn}V ÷ 3 — step-down complete</p>
        </motion.div>

        {/* Safety note */}
        {safetyNote && (
          <div
            className="rounded-xl border p-3 text-xs text-white/50 leading-relaxed"
            style={{ borderColor: "rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.06)" }}
          >
            <span style={{ color: "#F59E0B" }} className="font-bold">Safety note:</span> At {vIn}V input, less current flows on the primary side. More current flows on the secondary at lower voltage. Total power stays the same (ideal transformer).
          </div>
        )}

        {!used && (
          <p className="text-[11px] text-white/30 mt-3 text-center">Move the slider to earn +20 XP</p>
        )}
        {used && (
          <p className="text-[11px] mt-3 text-center" style={{ color: "#8B5CF6" }}>+20 XP earned!</p>
        )}
      </div>
    </section>
  );
}
