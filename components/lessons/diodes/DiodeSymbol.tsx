"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Part = "anode" | "cathode" | "triangle" | "bar" | null;

const info: Record<Exclude<Part, null>, { title: string; body: string; color: string }> = {
  anode: {
    title: "Anode (A) — Positive Terminal",
    body: "The anode is the positive (+) terminal. Connect it to the higher voltage side. Made from P-type semiconductor (P = Positive). Current enters here.",
    color: "#10B981",
  },
  cathode: {
    title: "Cathode (K) — Negative Terminal",
    body: "The cathode is the negative (−) terminal. Connect it to ground / lower voltage. Made from N-type semiconductor (N = Negative). Current exits here.",
    color: "#EF4444",
  },
  triangle: {
    title: "Triangle — Direction of Current Flow",
    body: "The triangle arrow points in the direction conventional current flows — from anode to cathode. Think of it as an arrow showing the allowed direction.",
    color: "#A78BFA",
  },
  bar: {
    title: "Bar — The Blocking Wall",
    body: "The vertical bar represents the cathode side and the 'wall' that blocks reverse current. It also marks the physical cathode band on a real diode.",
    color: "#F97316",
  },
};

export default function DiodeSymbol() {
  const [active, setActive] = useState<Part>(null);

  const toggle = (p: Part) => setActive(active === p ? null : p);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 2 · Symbol</p>
        <h2 className="text-xl font-bold mb-1">Anode, Cathode & the Circuit Symbol</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Every diode has two terminals. The symbol encodes which direction current flows. Click any part of the symbol to learn what it means.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
          {/* Interactive SVG symbol */}
          <div className="shrink-0">
            <svg width="220" height="100" viewBox="0 0 220 100">
              {/* Wire left (anode side) */}
              <line x1="0" y1="50" x2="60" y2="50" stroke="#A78BFA" strokeWidth="2.5" />
              <text x="10" y="45" fontSize="11" fill="rgba(167,139,250,0.5)" fontFamily="monospace">+</text>

              {/* Anode label */}
              <g className="cursor-pointer" onClick={() => toggle("anode")}>
                <rect x="0" y="58" width="55" height="18" rx="4" fill={active === "anode" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)"} />
                <text x="27.5" y="71" textAnchor="middle" fontSize="10" fill={active === "anode" ? "#10B981" : "rgba(255,255,255,0.35)"} fontFamily="monospace">Anode</text>
              </g>

              {/* Triangle (clickable) */}
              <g className="cursor-pointer" onClick={() => toggle("triangle")}>
                <polygon
                  points="60,22 60,78 110,50"
                  fill={active === "triangle" ? "rgba(167,139,250,0.35)" : "rgba(139,92,246,0.2)"}
                  stroke={active === "triangle" ? "#A78BFA" : "rgba(139,92,246,0.5)"}
                  strokeWidth="1.8"
                />
              </g>

              {/* Bar (clickable) */}
              <g className="cursor-pointer" onClick={() => toggle("bar")}>
                <rect x="108" y="20" width="5" height="60" rx="2"
                  fill={active === "bar" ? "#F97316" : "rgba(249,115,22,0.5)"}
                />
                <rect x="104" y="16" width="14" height="68" rx="4" fill="transparent" />
              </g>

              {/* Wire right (cathode side) */}
              <line x1="113" y1="50" x2="220" y2="50" stroke="#A78BFA" strokeWidth="2.5" />
              <text x="180" y="45" fontSize="11" fill="rgba(239,68,68,0.5)" fontFamily="monospace">−</text>

              {/* Cathode label */}
              <g className="cursor-pointer" onClick={() => toggle("cathode")}>
                <rect x="155" y="58" width="60" height="18" rx="4" fill={active === "cathode" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)"} />
                <text x="185" y="71" textAnchor="middle" fontSize="10" fill={active === "cathode" ? "#EF4444" : "rgba(255,255,255,0.35)"} fontFamily="monospace">Cathode</text>
              </g>

              {/* Current direction arrow */}
              <path d="M65 14 Q90 4 108 14" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" strokeDasharray="3,2" />
              <text x="87" y="10" textAnchor="middle" fontSize="8" fill="rgba(16,185,129,0.5)" fontFamily="monospace">I→</text>
            </svg>
            <p className="text-[10px] text-white/25 text-center mt-1">Click any part to learn about it</p>
          </div>

          {/* Info panel */}
          <div className="flex-1 w-full min-h-[120px]">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border p-5"
                  style={{ background: `${info[active].color}12`, borderColor: `${info[active].color}35` }}
                >
                  <p className="text-xs font-bold mb-2" style={{ color: info[active].color }}>{info[active].title}</p>
                  <p className="text-xs text-white/55 leading-relaxed">{info[active].body}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-white/6 p-5 text-center h-full flex flex-col items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-3xl mb-2">👆</p>
                  <p className="text-xs text-white/35">Click a part of the symbol to see what it means.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Real diode photo guide */}
        <div className="rounded-2xl border border-white/7 p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-xs font-bold text-white/50 mb-3">On a real diode: find the cathode</p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              {/* Real diode body illustration */}
              <svg width="80" height="30" viewBox="0 0 80 30">
                <rect x="2" y="5" width="76" height="20" rx="10" fill="rgba(100,100,120,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {/* Cathode band */}
                <rect x="58" y="5" width="8" height="20" rx="0" fill="rgba(200,200,220,0.6)" />
                {/* Legs */}
                <line x1="2" y1="15" x2="-8" y2="15" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="78" y1="15" x2="88" y2="15" stroke="#9CA3AF" strokeWidth="2" />
                {/* Labels */}
                <text x="30" y="19" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="monospace" textAnchor="middle">1N4007</text>
              </svg>
              <p className="text-[10px] text-white/35">Silver band = Cathode</p>
            </div>
            <div className="text-white/15">·</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/25" />
                <p className="text-[11px] text-white/45">Silver/white band = Cathode (−)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/25" />
                <p className="text-[11px] text-white/45">Unmarked end = Anode (+)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/25" />
                <p className="text-[11px] text-white/45">Most common: 1N4001 to 1N4007 silicon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
