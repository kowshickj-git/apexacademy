"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onSimUsed: () => void; }

export default function ACToDC({ onSimUsed }: Props) {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [used, setUsed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (!used) { setUsed(true); onSimUsed(); }
    setRunning(true);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTick((t) => t + 1), 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const W = 280;
  const H = 60;
  const cx = W / 2;
  const amplitude = 22;
  const phase = (tick / 20) * Math.PI;

  // AC sine wave points
  const acPoints = Array.from({ length: W }, (_, x) => {
    const t = (x / W) * 4 * Math.PI + phase;
    const y = (H / 2) - amplitude * Math.sin(t);
    return `${x},${y}`;
  }).join(" ");

  // DC half-wave rectified points (only positive half)
  const dcPoints = Array.from({ length: W }, (_, x) => {
    const t = (x / W) * 4 * Math.PI + phase;
    const raw = Math.sin(t);
    const y = H / 2 - amplitude * Math.max(0, raw);
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 5 · Simulator 3</p>
        <h2 className="text-xl font-bold mb-1">AC to DC — Rectification</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          AC (alternating current) from your wall socket swings positive and negative 50/60 times per second.
          A diode passes only the positive half, converting AC to pulsed DC. Every phone charger uses this trick.
        </p>

        {/* Animated waveform display */}
        <div className="rounded-2xl border border-white/8 overflow-hidden mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="grid grid-cols-2 divide-x divide-white/5">
            {/* AC input */}
            <div className="p-4">
              <p className="text-[10px] text-white/30 font-mono mb-2 uppercase">AC Input (from wall)</p>
              <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
                <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <polyline points={acPoints} fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-[9px] text-secondary/50 font-mono mt-1">60Hz sine wave</p>
            </div>

            {/* DC output */}
            <div className="p-4">
              <p className="text-[10px] text-white/30 font-mono mb-2 uppercase">DC Output (after diode)</p>
              <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
                <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                {running ? (
                  <polyline points={dcPoints} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" strokeDasharray="4,4" />
                )}
              </svg>
              <p className="text-[9px] text-primary/50 font-mono mt-1">Pulsed DC (half-wave)</p>
            </div>
          </div>

          {/* Center: diode symbol */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-center gap-4">
            <div className="text-[10px] text-secondary/50 font-mono">AC →</div>
            <svg width="50" height="26" viewBox="0 0 50 26">
              <polygon points="6,4 6,22 30,13" fill={running ? "rgba(16,185,129,0.3)" : "rgba(139,92,246,0.2)"} stroke={running ? "#10B981" : "#A78BFA"} strokeWidth="1.5" />
              <rect x="29" y="3" width="3" height="20" rx="1" fill={running ? "#10B981" : "#A78BFA"} />
              <line x1="0" y1="13" x2="6" y2="13" stroke={running ? "#10B981" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />
              <line x1="32" y1="13" x2="50" y2="13" stroke={running ? "#10B981" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />
            </svg>
            <div className="text-[10px] text-primary/50 font-mono">→ DC</div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={running ? () => setRunning(false) : start}
          className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all"
          style={running
            ? { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", color: "#FCA5A5" }
            : { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)", color: "#10B981" }
          }
        >
          {running ? "⏸ Pause" : "▶ Animate Rectification"}
        </motion.button>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          {[
            { label: "Half-wave rectifier", body: "1 diode. Only passes positive half of AC. Simple but inefficient — wastes half the energy." },
            { label: "Full-wave rectifier", body: "4 diodes in a bridge. Passes both halves. Used in all modern chargers." },
            { label: "Smoothing", body: "After rectification, a capacitor smooths the pulsed DC into steady DC — what your device needs." },
          ].map(({ label, body }) => (
            <div key={label} className="rounded-xl border border-white/7 p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10px] font-bold text-white/55 mb-1">{label}</p>
              <p className="text-[10px] text-white/35 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
