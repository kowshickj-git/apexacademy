"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  onStepUpUsed: () => void;
}

export default function StepUpSim({ onStepUpUsed }: Props) {
  const [vIn, setVIn] = useState(6);
  const [used, setUsed] = useState(false);
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  const NP = 3;
  const NS = 9;
  const ratio = NS / NP; // 3
  const vOut = vIn * ratio;

  useEffect(() => {
    let running = true;
    const tick = (ts: number) => {
      if (!running) return;
      const delta = ts - lastRef.current;
      lastRef.current = ts;
      setPhase((p) => (p + delta * 0.36) % 360);
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
      onStepUpUsed();
    }
  };

  const makePath = (amplitude: number, phaseOff: number) => {
    let d = "";
    for (let i = 0; i <= 80; i++) {
      const x = i;
      const angle = ((i / 80) * 720 + phase + phaseOff) * (Math.PI / 180);
      const y = 30 - Math.sin(angle) * amplitude;
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  };

  const primaryAmp = 8;
  const secondaryAmp = Math.min(22, primaryAmp * ratio * 0.7);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 1 · Step-Up Transformer
        </p>
        <h2 className="text-xl font-bold mb-1">Step-Up Simulator</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Primary: <strong style={{ color: "#8B5CF6" }}>3 turns</strong>. Secondary: <strong style={{ color: "#A78BFA" }}>9 turns</strong>. Ratio 1:3 — output is 3× the input voltage.
        </p>

        {/* Visual coil display */}
        <div
          className="rounded-2xl border border-white/8 p-5 mb-5"
          style={{ background: "rgba(139,92,246,0.04)" }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Primary side */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Primary (Np=3)</span>
              <svg width="90" height="60" viewBox="0 0 90 60">
                {[0, 1, 2].map((i) => (
                  <ellipse key={i} cx={15 + i * 18} cy={30} rx={7} ry={18} fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.75" />
                ))}
                <line x1="2" y1="30" x2="8" y2="30" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.5" />
                <line x1="69" y1="30" x2="78" y2="30" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.5" />
              </svg>
              {/* Primary wave */}
              <div className="rounded-lg border border-white/6 p-1" style={{ background: "rgba(0,0,0,0.3)" }}>
                <svg width="80" height="60" viewBox="0 0 80 60">
                  <text x="40" y="10" fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle">{vIn}V</text>
                  <path d={makePath(primaryAmp, 0)} stroke="#8B5CF6" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: "#8B5CF6" }}>{vIn}V</span>
            </div>

            {/* Core */}
            <div
              className="flex flex-col items-center justify-center rounded-xl shrink-0"
              style={{ width: 28, height: 80, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}
            >
              <span className="text-[8px] text-white/20 font-mono">Fe</span>
            </div>

            {/* Secondary side */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Secondary (Ns=9)</span>
              <svg width="90" height="60" viewBox="0 0 90 60">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ellipse key={i} cx={8 + i * 9} cy={30} rx={4} ry={18} fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.65" />
                ))}
                <line x1="2" y1="30" x2="4" y2="30" stroke="#A78BFA" strokeWidth="1.5" opacity="0.5" />
                <line x1="80" y1="30" x2="88" y2="30" stroke="#A78BFA" strokeWidth="1.5" opacity="0.5" />
              </svg>
              {/* Secondary wave — taller */}
              <div className="rounded-lg border border-white/6 p-1" style={{ background: "rgba(0,0,0,0.3)" }}>
                <svg width="80" height="60" viewBox="0 0 80 60">
                  <text x="40" y="10" fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle">{vOut}V</text>
                  <path d={makePath(secondaryAmp, 15)} stroke="#A78BFA" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: "#A78BFA" }}>{vOut}V</span>
            </div>
          </div>

          {/* Formula display */}
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
            min={1}
            max={12}
            step={1}
            value={vIn}
            onChange={(e) => handleSlider(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>1V</span>
            <span>12V</span>
          </div>
        </div>

        {/* Result card */}
        <motion.div
          key={vOut}
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          className="rounded-xl border p-4 text-center"
          style={{ borderColor: "rgba(167,139,250,0.25)", background: "rgba(167,139,250,0.06)" }}
        >
          <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1">Output Voltage</p>
          <p className="text-3xl font-black" style={{ color: "#A78BFA" }}>{vOut}V</p>
          <p className="text-xs text-white/35 mt-1">3× the input — step-up at work</p>
        </motion.div>

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
