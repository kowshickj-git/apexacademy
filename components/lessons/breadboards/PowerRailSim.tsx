"use client";

import { useState, useEffect, useRef } from "react";

const DOT_COUNT = 4;
const RAIL_WIDTH = 480;

export default function PowerRailSim() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTick((t) => t + 1);
      }, 60);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const getDotX = (i: number, direction: "right" | "left") => {
    const speed = 2;
    const spacing = RAIL_WIDTH / DOT_COUNT;
    const offset = (tick * speed + i * spacing) % RAIL_WIDTH;
    return direction === "right" ? offset : RAIL_WIDTH - offset;
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 4 · Simulator 3
        </p>
        <h2 className="text-xl font-bold mb-1">Power Rail Visualiser</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Watch how current flows from the battery through the power rails. The + rail distributes positive voltage; the − rail returns current to ground.
        </p>

        <div
          className="rounded-2xl border border-white/8 p-5 mb-5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* Main layout */}
          <div className="flex items-center gap-4">
            {/* Battery */}
            <div className="shrink-0 flex flex-col items-center gap-1">
              <div
                className="w-14 h-20 rounded-xl border-2 border-white/15 flex flex-col items-center justify-center gap-1"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-base font-black text-red-400">+</span>
                <div className="w-8 h-px bg-white/15" />
                <span className="text-xs font-mono text-white/40">9V</span>
                <div className="w-8 h-px bg-white/15" />
                <span className="text-base font-black text-blue-400">−</span>
              </div>
              <span className="text-[9px] text-white/20 font-mono">Battery</span>
            </div>

            {/* Rails */}
            <div className="flex-1 flex flex-col gap-3">
              {/* + Rail */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-red-400/70 w-4">+</span>
                  <div
                    className="relative flex-1 h-5 rounded-full overflow-hidden"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    {/* Dots moving right */}
                    {Array.from({ length: DOT_COUNT }).map((_, i) => {
                      const x = getDotX(i, "right");
                      const pct = (x / RAIL_WIDTH) * 100;
                      return (
                        <div
                          key={i}
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                          style={{
                            left: `${Math.min(Math.max(pct, 0), 96)}%`,
                            background: running ? "rgba(255,255,255,0.9)" : "transparent",
                            boxShadow: running ? "0 0 6px rgba(239,68,68,0.8)" : "none",
                            transition: "background 0.3s, box-shadow 0.3s",
                          }}
                        />
                      );
                    })}
                    {/* Rail holes */}
                    <div className="absolute inset-0 flex items-center justify-around px-2 pointer-events-none">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/40" />
                      ))}
                    </div>
                  </div>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M2 6h12M9 2l4 4-4 4" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[9px] text-white/20 pl-6">
                  Positive rail — all holes connected, distributes V+
                </p>
              </div>

              {/* − Rail */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-blue-400/70 w-4">−</span>
                  <div
                    className="relative flex-1 h-5 rounded-full overflow-hidden"
                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}
                  >
                    {/* Dots moving left (return current) */}
                    {Array.from({ length: DOT_COUNT }).map((_, i) => {
                      const x = getDotX(i, "left");
                      const pct = (x / RAIL_WIDTH) * 100;
                      return (
                        <div
                          key={i}
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                          style={{
                            left: `${Math.min(Math.max(pct, 0), 96)}%`,
                            background: running ? "rgba(255,255,255,0.55)" : "transparent",
                            boxShadow: running ? "0 0 5px rgba(59,130,246,0.6)" : "none",
                            transition: "background 0.3s, box-shadow 0.3s",
                          }}
                        />
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-around px-2 pointer-events-none">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/40" />
                      ))}
                    </div>
                  </div>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M14 6H2M7 2L3 6l4 4" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[9px] text-white/20 pl-6">
                  Ground rail — current returns to battery − terminal
                </p>
              </div>
            </div>
          </div>

          {/* Play/Pause */}
          <div className="flex justify-center mt-5">
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{
                background: running ? "rgba(239,68,68,0.15)" : "rgba(20,184,166,0.15)",
                border: `1px solid ${running ? "rgba(239,68,68,0.35)" : "rgba(20,184,166,0.35)"}`,
                color: running ? "#F87171" : "#14B8A6",
              }}
            >
              {running ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border border-white/8 text-xs text-white/40 leading-relaxed"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <span className="font-bold text-white/60">Key insight: </span>
          Power rails are like a shared bus. Every component connected to the + rail gets the same voltage. Every component connected to the − rail shares the same ground. No jumper wires needed — the rail is the wire.
        </div>
      </div>
    </section>
  );
}
