"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

interface Props {
  onSwitchUsed: () => void;
}

interface Dot {
  id: number;
  progress: number;
}

export default function SwitchOnOffSim({ onSwitchUsed }: Props) {
  const [on, setOn] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [dots, setDots] = useState<Dot[]>([]);
  const dotCounter = useRef(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (on) {
      animRef.current = setInterval(() => {
        dotCounter.current += 1;
        const id = dotCounter.current;
        setDots((prev) => [...prev.slice(-6), { id, progress: 0 }]);
      }, 280);
    } else {
      if (animRef.current) clearInterval(animRef.current);
      setDots([]);
    }
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const iv = setInterval(() => {
      setDots((prev) => prev.map((d) => ({ ...d, progress: d.progress + 0.04 })).filter((d) => d.progress < 1));
    }, 30);
    return () => clearInterval(iv);
  }, [on]);

  const handleToggle = () => {
    setOn((v) => {
      if (!v && !triggered) { setTriggered(true); onSwitchUsed(); }
      return !v;
    });
  };

  // Wire path: battery (left) -> switch (middle) -> bulb (right)
  // Approximate SVG coordinates for a room scene
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 4 · Simulation 1
        </p>
        <h2 className="text-xl font-bold mb-1">Switch ON/OFF Simulator</h2>
        <p className="text-sm text-white/40 mb-6">Toggle the switch to control the light bulb. Watch current flow as animated dots.</p>

        <div className="max-w-2xl">
          {/* Room scene */}
          <div
            className="relative rounded-2xl border overflow-hidden mb-4 transition-all duration-700"
            style={{
              background: on ? "rgba(251,191,36,0.07)" : "rgba(10,10,18,0.8)",
              borderColor: on ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.08)",
              height: 260,
            }}
          >
            {/* Room glow */}
            <AnimatePresence>
              {on && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(251,191,36,0.2) 0%, transparent 65%)" }}
                />
              )}
            </AnimatePresence>

            {/* SVG Circuit diagram */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet">
              {/* Wire segments: battery (40,180) -> switch (180,180) -> bulb (340,180) */}
              {/* Battery */}
              <rect x="20" y="155" width="14" height="50" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <text x="27" y="145" fontSize="9" fill="rgba(255,255,255,0.3)" textAnchor="middle" fontFamily="monospace">+</text>
              <text x="27" y="218" fontSize="9" fill="rgba(255,255,255,0.3)" textAnchor="middle" fontFamily="monospace">-</text>
              <text x="27" y="240" fontSize="8" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">9V</text>

              {/* Wire: battery top -> switch left */}
              <path d="M 34 162 L 34 90 L 180 90" stroke={on ? CYAN : "rgba(255,255,255,0.18)"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Wire: switch right -> bulb */}
              <path d="M 220 90 L 340 90" stroke={on ? CYAN : "rgba(255,255,255,0.18)"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Wire: bulb -> battery bottom (return) */}
              <path d="M 340 130 L 340 180 L 34 180 L 34 205" stroke={on ? CYAN : "rgba(255,255,255,0.18)"} strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Switch body */}
              <circle cx="180" cy="90" r="5" fill={on ? CYAN : "rgba(255,255,255,0.2)"} />
              <circle cx="220" cy="90" r="5" fill={on ? CYAN : "rgba(255,255,255,0.2)"} />
              <motion.line
                x1="180" y1="90"
                animate={{ x2: on ? 220 : 205, y2: on ? 90 : 72 }}
                transition={{ type: "spring", damping: 18, stiffness: 300 }}
                stroke={on ? CYAN : "rgba(255,255,255,0.4)"}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Bulb */}
              <circle cx="340" cy="100" r="26" fill={on ? "rgba(251,191,36,0.85)" : "rgba(255,255,255,0.05)"} stroke={on ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.12)"} strokeWidth="2" />
              {on && <circle cx="340" cy="100" r="38" fill="rgba(251,191,36,0.12)" />}
              <text x="340" y="106" fontSize="22" textAnchor="middle">💡</text>

              {/* Labels */}
              <text x="200" y="82" fontSize="9" fill="rgba(255,255,255,0.25)" textAnchor="middle" fontFamily="monospace">SWITCH</text>
              <text x="340" y="145" fontSize="9" fill="rgba(255,255,255,0.25)" textAnchor="middle" fontFamily="monospace">BULB</text>

              {/* Animated current dots */}
              {dots.map((dot) => {
                // Path: 34,162 -> 34,90 -> 180,90 -> 220,90 -> 340,90 -> 340,130 -> 340,180 -> 34,180 -> 34,205
                // Simplified: move along top wire when on
                const totalLen = 620;
                const pos = dot.progress * totalLen;
                let x = 34, y = 162;
                // Segment 1: 34,162 -> 34,90 (len 72)
                if (pos < 72) { x = 34; y = 162 - pos; }
                // Segment 2: 34,90 -> 180,90 (len 146)
                else if (pos < 218) { x = 34 + (pos - 72); y = 90; }
                // Segment 3: 220,90 -> 340,90 (len 120, skip switch)
                else if (pos < 338) { x = 220 + (pos - 218); y = 90; }
                // Segment 4: 340,90 -> 340,130 (len 40)
                else if (pos < 378) { x = 340; y = 90 + (pos - 338); }
                // Segment 5: 340,130 -> 340,180 (len 50)
                else if (pos < 428) { x = 340; y = 130 + (pos - 378); }
                // Segment 6: 340,180 -> 34,180 (len 306)
                else if (pos < 734) { x = 340 - (pos - 428); y = 180; }
                // Segment 7: 34,180 -> 34,205 (len 25)
                else { x = 34; y = 180 + (pos - 734); }

                return (
                  <circle
                    key={dot.id}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={CYAN}
                    opacity={1 - dot.progress * 0.6}
                  />
                );
              })}
            </svg>

            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <div
                className="px-3 py-1.5 rounded-full text-xs font-bold border"
                style={{
                  background: on ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)",
                  borderColor: on ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.3)",
                  color: on ? "#10B981" : "#EF4444",
                }}
              >
                {on ? "CLOSED — Current Flowing" : "OPEN — No Current"}
              </div>
            </div>
          </div>

          {/* Toggle switch control */}
          <div className="flex items-center justify-center gap-6">
            <p className="text-sm text-white/40">Switch:</p>
            <button
              onClick={handleToggle}
              className="relative w-16 h-8 rounded-full border-2 transition-all duration-300 focus:outline-none"
              style={{
                background: on ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.06)",
                borderColor: on ? CYAN : "rgba(255,255,255,0.15)",
              }}
              aria-label="Toggle switch"
            >
              <motion.div
                animate={{ x: on ? 32 : 2 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="absolute top-0.5 w-6 h-6 rounded-full shadow-md"
                style={{ background: on ? CYAN : "rgba(255,255,255,0.3)" }}
              />
            </button>
            <p className="text-sm font-bold w-12" style={{ color: on ? CYAN : "rgba(255,255,255,0.3)" }}>
              {on ? "ON" : "OFF"}
            </p>
          </div>

          {!triggered && (
            <p className="text-center text-xs text-white/30 mt-3">Toggle the switch to earn XP</p>
          )}
          {triggered && (
            <p className="text-center text-xs mt-3" style={{ color: CYAN }}>+15 XP earned! Keep exploring.</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
