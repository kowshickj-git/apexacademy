"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

interface Props {
  onOpenClosedUsed: () => void;
}

interface Dot {
  id: number;
  progress: number;
}

function CircuitPanel({ closed, onClick }: { closed: boolean; onClick: () => void }) {
  const [dots, setDots] = useState<Dot[]>([]);
  const dotCounter = useRef(0);
  const addRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (closed) {
      addRef.current = setInterval(() => {
        dotCounter.current += 1;
        setDots((prev) => [...prev.slice(-5), { id: dotCounter.current, progress: 0 }]);
      }, 320);
      moveRef.current = setInterval(() => {
        setDots((prev) => prev.map((d) => ({ ...d, progress: d.progress + 0.05 })).filter((d) => d.progress < 1));
      }, 30);
    } else {
      if (addRef.current) clearInterval(addRef.current);
      if (moveRef.current) clearInterval(moveRef.current);
      setDots([]);
    }
    return () => {
      if (addRef.current) clearInterval(addRef.current);
      if (moveRef.current) clearInterval(moveRef.current);
    };
  }, [closed]);

  return (
    <div
      onClick={onClick}
      className="relative flex-1 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500 select-none"
      style={{
        background: closed ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.05)",
        borderColor: closed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)",
        minHeight: 200,
      }}
    >
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ background: closed ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)" }}
          >
            {closed ? "✓" : "✗"}
          </div>
          <p className="text-xs font-bold" style={{ color: closed ? "#10B981" : "#EF4444" }}>
            {closed ? "CLOSED Circuit" : "OPEN Circuit"}
          </p>
        </div>

        {/* SVG */}
        <svg width="100%" height="100" viewBox="0 0 160 100">
          {/* Battery */}
          <rect x="8" y="38" width="10" height="24" rx="2" fill={closed ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"} stroke={closed ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.15)"} strokeWidth="1" />
          {/* Wire top */}
          <path d="M 18 44 L 18 22 L 130 22" stroke={closed ? "#10B981" : "rgba(255,255,255,0.15)"} strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Wire bottom */}
          <path d="M 130 78 L 18 78 L 18 62" stroke={closed ? "#10B981" : "rgba(255,255,255,0.15)"} strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Gap / connection */}
          {closed ? (
            <line x1="70" y1="22" x2="90" y2="22" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <>
              <line x1="60" y1="22" x2="72" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
              <line x1="88" y1="22" x2="100" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
              <line x1="72" y1="18" x2="88" y2="26" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
              <line x1="72" y1="26" x2="88" y2="18" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
            </>
          )}
          {/* LED bulb */}
          <circle cx="130" cy="50" r="22" fill={closed ? "rgba(251,191,36,0.85)" : "rgba(255,255,255,0.04)"} stroke={closed ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" />
          <text x="130" y="56" fontSize="18" textAnchor="middle">{closed ? "💡" : "⚫"}</text>

          {/* Current dots */}
          {dots.map((dot) => {
            const p = dot.progress;
            // Path approximation
            let x = 18, y = 44;
            const seg1 = 0.18, seg2 = 0.48, seg3 = 0.65, seg4 = 0.85;
            if (p < seg1) { x = 18; y = 44 - (p / seg1) * 22; }
            else if (p < seg2) { x = 18 + ((p - seg1) / (seg2 - seg1)) * 112; y = 22; }
            else if (p < seg3) { x = 130; y = 22 + ((p - seg2) / (seg3 - seg2)) * 56; }
            else if (p < seg4) { x = 130 - ((p - seg3) / (seg4 - seg3)) * 112; y = 78; }
            else { x = 18; y = 78 - ((p - seg4) / (1 - seg4)) * 16; }

            return <circle key={dot.id} cx={x} cy={y} r="3.5" fill={CYAN} opacity={0.9 - dot.progress * 0.5} />;
          })}
        </svg>

        <p className="text-[10px] text-white/30 mt-1 text-center">
          {closed ? "Current dots flowing →" : "No current — gap blocks flow"}
        </p>
      </div>
    </div>
  );
}

export default function OpenClosedSim({ onOpenClosedUsed }: Props) {
  const [state, setState] = useState<"open" | "closed">("open");
  const [triggered, setTriggered] = useState(false);

  const interact = (newState: "open" | "closed") => {
    setState(newState);
    if (!triggered) { setTriggered(true); onOpenClosedUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 6 · Simulation 3
        </p>
        <h2 className="text-xl font-bold mb-1">Open vs Closed Circuit</h2>
        <p className="text-sm text-white/40 mb-6">Click either panel to switch between states. Observe how current behaves.</p>

        <div className="max-w-2xl">
          {/* Side-by-side panels */}
          <div className="flex gap-4 mb-5">
            <CircuitPanel closed={false} onClick={() => interact("open")} />
            <CircuitPanel closed={true} onClick={() => interact("closed")} />
          </div>

          {/* Break/Connect toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => interact("open")}
              className="px-5 py-2.5 rounded-xl border text-xs font-bold transition-all"
              style={{
                background: state === "open" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: state === "open" ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.08)",
                color: state === "open" ? "#EF4444" : "rgba(255,255,255,0.35)",
              }}
            >
              Break Circuit
            </button>
            <div className="w-px h-6 bg-white/10" />
            <button
              onClick={() => interact("closed")}
              className="px-5 py-2.5 rounded-xl border text-xs font-bold transition-all"
              style={{
                background: state === "closed" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: state === "closed" ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)",
                color: state === "closed" ? "#10B981" : "rgba(255,255,255,0.35)",
              }}
            >
              Connect Circuit
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-xl border text-center text-xs"
              style={{
                background: state === "closed" ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.06)",
                borderColor: state === "closed" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)",
                color: state === "closed" ? "#10B981" : "#EF4444",
              }}
            >
              {state === "closed"
                ? "Circuit CLOSED — Continuous path exists, current flows, LED lights up."
                : "Circuit OPEN — Path is broken, no current can flow, LED stays dark."}
            </motion.div>
          </AnimatePresence>

          {triggered && (
            <p className="text-center text-xs mt-3" style={{ color: CYAN }}>+15 XP earned!</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
