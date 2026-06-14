"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

type Solve = "V" | "I" | "R";

const info: Record<Solve, { formula: string; example: string; color: string; desc: string }> = {
  V: {
    formula: "V = I × R",
    example: "I = 2A, R = 5Ω → V = 2 × 5 = 10V",
    color: "#EAB308",
    desc: "Cover V in the triangle. You see I and R side by side — multiply them.",
  },
  I: {
    formula: "I = V ÷ R",
    example: "V = 12V, R = 4Ω → I = 12 ÷ 4 = 3A",
    color: "#0EA5E9",
    desc: "Cover I in the triangle. You see V on top and R below — divide V by R.",
  },
  R: {
    formula: "R = V ÷ I",
    example: "V = 9V, I = 3A → R = 9 ÷ 3 = 3Ω",
    color: "#F97316",
    desc: "Cover R in the triangle. You see V on top and I below — divide V by I.",
  },
};

export default function OhmsTriangle({ onSimUsed }: Props) {
  const [solving, setSolving] = useState<Solve | null>(null);
  const [used, setUsed] = useState(false);

  const select = (s: Solve) => {
    setSolving(solving === s ? null : s);
    if (!used) { setUsed(true); onSimUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 8 · Triangle</p>
        <h2 className="text-xl font-bold mb-1">The Ohm&apos;s Law Triangle</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          The triangle is a memory trick. Cover the variable you want to find — the remaining two show how to calculate it. Click any variable to see the formula.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
          {/* Triangle SVG */}
          <div className="shrink-0">
            <svg width="200" height="180" viewBox="0 0 200 180">
              {/* Triangle outline */}
              <polygon points="100,10 10,170 190,170" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" />

              {/* Dividing lines */}
              <line x1="100" y1="90" x2="10" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="100" y1="90" x2="190" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="55" y1="130" x2="145" y2="130" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* V - top */}
              <g
                className="cursor-pointer"
                onClick={() => select("V")}
                style={{ opacity: solving === "V" ? 1 : 0.7 }}
              >
                <polygon points="100,10 55,130 145,130" fill={solving === "V" ? "rgba(234,179,8,0.3)" : "rgba(234,179,8,0.08)"} />
                <text x="100" y="88" textAnchor="middle" fontSize="28" fontWeight="900" fill="#EAB308" fontFamily="monospace">V</text>
                <text x="100" y="105" textAnchor="middle" fontSize="9" fill="rgba(234,179,8,0.6)" fontFamily="sans-serif">click</text>
              </g>

              {/* I - bottom left */}
              <g
                className="cursor-pointer"
                onClick={() => select("I")}
                style={{ opacity: solving === "I" ? 1 : 0.7 }}
              >
                <polygon points="55,130 10,170 100,170" fill={solving === "I" ? "rgba(14,165,233,0.3)" : "rgba(14,165,233,0.08)"} />
                <text x="52" y="160" textAnchor="middle" fontSize="24" fontWeight="900" fill="#0EA5E9" fontFamily="monospace">I</text>
              </g>

              {/* R - bottom right */}
              <g
                className="cursor-pointer"
                onClick={() => select("R")}
                style={{ opacity: solving === "R" ? 1 : 0.7 }}
              >
                <polygon points="145,130 100,170 190,170" fill={solving === "R" ? "rgba(249,115,22,0.3)" : "rgba(249,115,22,0.08)"} />
                <text x="150" y="160" textAnchor="middle" fontSize="24" fontWeight="900" fill="#F97316" fontFamily="monospace">R</text>
              </g>
            </svg>
            <p className="text-[10px] text-white/25 text-center">Click a variable to reveal its formula</p>
          </div>

          {/* Info panel */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              {solving ? (
                <motion.div
                  key={solving}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl border p-5"
                  style={{ background: `${info[solving].color}0d`, borderColor: `${info[solving].color}35` }}
                >
                  <p className="text-[10px] text-white/30 mb-2 uppercase tracking-widest font-mono">Solving for {solving}</p>
                  <p className="text-2xl font-black font-mono mb-3" style={{ color: info[solving].color }}>{info[solving].formula}</p>
                  <p className="text-xs text-white/50 leading-relaxed mb-3">{info[solving].desc}</p>
                  <div className="p-3 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-[10px] text-white/25 mb-1 font-mono">EXAMPLE</p>
                    <p className="text-xs text-white/65 font-mono leading-relaxed">{info[solving].example}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-white/6 p-5 text-center"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-4xl mb-2">👈</p>
                  <p className="text-sm text-white/40">Click V, I, or R in the triangle to see the formula for solving it.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* All three formulas summary */}
        <div className="grid grid-cols-3 gap-2">
          {(["V", "I", "R"] as Solve[]).map((s) => (
            <button
              key={s}
              onClick={() => select(s)}
              className="rounded-xl border p-3 text-center transition-all hover:opacity-80"
              style={solving === s
                ? { background: `${info[s].color}15`, borderColor: info[s].color + "60" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }
              }
            >
              <p className="text-lg font-black font-mono mb-0.5" style={{ color: info[s].color }}>{info[s].formula}</p>
              <p className="text-[9px] text-white/30">Solve for {s}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
