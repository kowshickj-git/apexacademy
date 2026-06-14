"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onContinuityUsed: () => void;
}

type WireState = "connected" | "broken" | null;

export default function ContinuitySim({ onContinuityUsed }: Props) {
  const [wireState, setWireState] = useState<WireState>(null);
  const [used, setUsed] = useState(false);

  const handleTest = (state: WireState) => {
    setWireState(state);
    if (!used) {
      setUsed(true);
      onContinuityUsed();
    }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 7 · Simulator 4
        </p>
        <h2 className="text-xl font-bold mb-1">Continuity Tester</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Continuity tests whether current can flow between two points. Select a wire to test it.
        </p>

        {/* Wire selection */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleTest("connected")}
            className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all"
            style={
              wireState === "connected"
                ? { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.5)", color: "#10B981" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
            }
          >
            🟢 Test Connected Wire
          </button>
          <button
            onClick={() => handleTest("broken")}
            className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all"
            style={
              wireState === "broken"
                ? { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.5)", color: "#EF4444" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
            }
          >
            🔴 Test Broken Wire
          </button>
        </div>

        {/* Result panel */}
        <AnimatePresence mode="wait">
          {wireState ? (
            <motion.div
              key={wireState}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border p-5 mb-5"
              style={
                wireState === "connected"
                  ? { borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.06)" }
                  : { borderColor: "rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.06)" }
              }
            >
              {/* Wire graphic */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {/* Probe dot */}
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{ borderColor: wireState === "connected" ? "#10B981" : "#EF4444", background: "#050507" }}
                />
                {/* Wire or break */}
                {wireState === "connected" ? (
                  <div
                    className="h-1.5 rounded-full flex-1 max-w-[120px]"
                    style={{ background: "linear-gradient(to right, #10B981, #34D399)" }}
                  />
                ) : (
                  <div className="flex items-center gap-1 flex-1 max-w-[120px]">
                    <div className="h-1.5 rounded-full flex-1" style={{ background: "rgba(239,68,68,0.6)" }} />
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg viewBox="0 0 16 16" width="12" height="12">
                        <line x1="2" y1="2" x2="14" y2="14" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                        <line x1="14" y1="2" x2="2" y2="14" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="h-1.5 rounded-full flex-1" style={{ background: "rgba(239,68,68,0.6)" }} />
                  </div>
                )}
                {/* Probe dot */}
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{ borderColor: wireState === "connected" ? "#10B981" : "#EF4444", background: "#050507" }}
                />
              </div>

              {/* DMM display + beep */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <div
                  className="w-24 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-black text-base"
                  style={
                    wireState === "connected"
                      ? { borderColor: "rgba(16,185,129,0.5)", background: "rgba(16,185,129,0.08)", color: "#10B981" }
                      : { borderColor: "rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.08)", color: "#EF4444" }
                  }
                >
                  {wireState === "connected" ? "0.2 Ω" : "OL"}
                </div>

                {wireState === "connected" ? (
                  <motion.div
                    key="beep"
                    animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-2xl"
                  >
                    🔊
                  </motion.div>
                ) : (
                  <div className="text-2xl opacity-30">🔇</div>
                )}
              </div>

              <p className="text-center text-xs font-semibold leading-relaxed"
                style={{ color: wireState === "connected" ? "#10B981" : "#EF4444" }}>
                {wireState === "connected"
                  ? "🔊 BEEP! Continuity found — wire is intact, current can flow"
                  : "🔇 No beep — broken connection, current cannot flow"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/6 p-6 mb-5 text-center"
              style={{ background: "rgba(255,255,255,0.01)" }}
            >
              <p className="text-xs text-white/25">Select a wire above to test continuity</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key fact */}
        <div
          className="rounded-xl border border-white/8 p-3"
          style={{ background: "rgba(167,139,250,0.04)" }}
        >
          <p className="text-[10px] text-white/25 font-mono uppercase mb-1">Key Fact</p>
          <p className="text-xs text-white/55 leading-relaxed">
            <span style={{ color: "#A78BFA" }} className="font-bold">Continuity test</span> checks if electricity can
            flow between two points. Resistance{" "}
            <span className="font-bold text-white/70">&lt;30Ω</span> typically triggers the beep = connected.
            &ldquo;OL&rdquo; (Open Line) = broken connection.
          </p>
        </div>
      </div>
    </section>
  );
}
