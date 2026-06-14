"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onVisualView: () => void; }

export default function WhyResistorInvented({ onVisualView }: Props) {
  const [mode, setMode] = useState<"without" | "with">("without");
  const [burning, setBurning] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) { setTriggered(true); onVisualView(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered, onVisualView]);

  const handleConnect = () => {
    if (mode === "without") {
      setBurning(true);
      setTimeout(() => setBurning(false), 2500);
    }
  };

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 3</p>
        <h2 className="text-xl font-bold mb-1">Why Was the Resistor Invented?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Early electronics engineers kept burning out components. They needed a way to control how much current flowed to fragile parts — so they invented the resistor.
        </p>

        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          {(["without", "with"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setBurning(false); }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={mode === m
                ? { background: m === "without" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", borderColor: m === "without" ? "#EF4444" : "#10B981", color: m === "without" ? "#EF4444" : "#10B981" }
                : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {m === "without" ? "Without Resistor" : "With Resistor"}
            </button>
          ))}
        </div>

        {/* Circuit diagram */}
        <div
          className="relative rounded-2xl border p-6 overflow-hidden"
          style={{ background: mode === "without" ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)", borderColor: mode === "without" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)" }}
        >
          <div className="flex items-center justify-center gap-4">
            {/* Battery */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-14 rounded border-2 border-secondary/50 flex flex-col items-center justify-center gap-0.5" style={{ background: "rgba(14,165,233,0.1)" }}>
                <span className="text-secondary text-xs font-bold">9V</span>
                <div className="w-5 h-px bg-secondary/60" />
                <div className="w-3 h-px bg-secondary/40" />
              </div>
              <span className="text-[9px] text-white/30">Battery</span>
            </div>

            {/* Wire */}
            <div className="flex-1 h-px" style={{ background: mode === "without" ? "#EF4444" : "#10B981" }} />

            {/* Resistor (only in "with" mode) */}
            {mode === "with" && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-5 rounded border-2 border-orange-400/60 flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)" }}>
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-3 rounded-sm" style={{ background: "#F97316" }} />
                    <div className="w-1.5 h-3 rounded-sm" style={{ background: "#EF4444" }} />
                    <div className="w-1.5 h-3 rounded-sm" style={{ background: "#8B4513" }} />
                  </div>
                </div>
                <span className="text-[9px] text-orange-400">220Ω</span>
              </div>
            )}

            {/* Second wire */}
            <div className="flex-1 h-px" style={{ background: mode === "without" ? "#EF4444" : "#10B981" }} />

            {/* LED */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <polygon points="8,6 28,18 8,30" fill={mode === "without" ? "#EF4444" : "#10B981"} opacity={burning ? 0.9 : 0.6} />
                  <line x1="28" y1="10" x2="28" y2="26" stroke={mode === "without" ? "#EF4444" : "#10B981"} strokeWidth="2.5" />
                  <line x1="28" y1="18" x2="36" y2="18" stroke={mode === "without" ? "#EF4444" : "#10B981"} strokeWidth="1.5" />
                  <line x1="8" y1="18" x2="0" y2="18" stroke={mode === "without" ? "#EF4444" : "#10B981"} strokeWidth="1.5" />
                </svg>

                {/* Glow */}
                {!burning && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${mode === "without" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"} 0%, transparent 70%)`,
                      animation: "pulse-glow 2s ease-in-out infinite",
                    }}
                  />
                )}

                {/* Burn animation */}
                <AnimatePresence>
                  {burning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center text-lg"
                      style={{ animation: "led-burn 2.5s ease-in forwards" }}
                    >
                      💥
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[9px] text-white/30">LED</span>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-4 text-center">
            {mode === "without" && !burning && (
              <div>
                <p className="text-xs text-red-400 mb-2">Too much current! The LED is at risk.</p>
                <button
                  onClick={handleConnect}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  Connect Circuit →
                </button>
              </div>
            )}
            {mode === "without" && burning && (
              <p className="text-xs text-red-400 font-semibold animate-pulse">LED burned out! 💥 Too much current with no protection.</p>
            )}
            {mode === "with" && (
              <p className="text-xs text-primary">LED glowing safely. The 220Ω resistor limits current to ~14mA.</p>
            )}
          </div>
        </div>

        <p className="text-xs text-white/35 mt-4 leading-relaxed">
          Without a resistor, connecting an LED to 9V sends ~90mA through it — 6× too much. The LED overheats and burns in milliseconds.
          A 220Ω resistor drops the current to a safe 14mA, and the LED glows reliably for years.
        </p>
      </div>
    </section>
  );
}
