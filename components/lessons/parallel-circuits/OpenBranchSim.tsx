"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onOpenBranchUsed: () => void;
}

const SUPPLY = 12; // V
const BRANCH_R = [330, 470, 680]; // Ohms per branch LED circuit
const V_LED = 2.0;

export default function OpenBranchSim({ onOpenBranchUsed }: Props) {
  const [connected, setConnected] = useState([true, true, true]);
  const [used, setUsed] = useState(false);

  const handleDisconnect = (i: number) => {
    if (!used) {
      setUsed(true);
      onOpenBranchUsed();
    }
    setConnected((c) => c.map((v, j) => (j === i ? !v : v)));
  };

  const branchCurrents = connected.map((on, i) => {
    if (!on) return 0;
    const vR = SUPPLY - V_LED;
    return vR / BRANCH_R[i];
  });

  const totalCurrent = branchCurrents.reduce((a, b) => a + b, 0);

  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/8 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5" style={{ background: "rgba(16,185,129,0.05)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="text-xs font-bold px-2 py-0.5 rounded-full border"
              style={{ color: "#10B981", borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)" }}
            >
              SIMULATOR 3
            </div>
          </div>
          <h2 className="text-lg font-bold text-white">Open Branch Simulator</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(240,240,245,0.5)" }}>
            Disconnect any branch — only THAT LED goes dark. Other branches keep working. This is the
            key advantage of parallel circuits!
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LED visual */}
          <div
            className="rounded-2xl p-5 border border-white/6 flex flex-col items-center gap-4"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-sm font-bold text-white/60 mb-1">12V Parallel LED Circuit</div>

            <div className="flex gap-6">
              {[0, 1, 2].map((i) => {
                const on = connected[i];
                const currentMA = (branchCurrents[i] * 1000).toFixed(1);
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    {/* LED */}
                    <motion.div
                      animate={
                        on
                          ? {
                              boxShadow: [
                                "0 0 8px rgba(99,102,241,0.6)",
                                "0 0 18px rgba(99,102,241,0.9)",
                                "0 0 8px rgba(99,102,241,0.6)",
                              ],
                            }
                          : { boxShadow: "none" }
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2 text-xl transition-all duration-500"
                      style={{
                        background: on ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.04)",
                        borderColor: on ? "#6366F1" : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {on ? "💡" : "○"}
                    </motion.div>

                    {/* Label */}
                    <div className="text-[10px] font-bold text-white/50">LED {i + 1}</div>

                    {/* Current */}
                    <div
                      className="text-[10px] font-mono"
                      style={{ color: on ? "#818CF8" : "rgba(255,255,255,0.2)" }}
                    >
                      {on ? `${currentMA}mA` : "0 mA"}
                    </div>

                    {/* Resistor */}
                    <div
                      className="text-[9px] px-1.5 py-0.5 rounded border"
                      style={{
                        background: "rgba(251,191,36,0.08)",
                        borderColor: "rgba(251,191,36,0.2)",
                        color: "rgba(251,191,36,0.7)",
                      }}
                    >
                      {BRANCH_R[i]}Ω
                    </div>

                    {/* Disconnect button */}
                    <button
                      onClick={() => handleDisconnect(i)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all"
                      style={{
                        background: on ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                        borderColor: on ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)",
                        color: on ? "#F87171" : "#34D399",
                      }}
                    >
                      {on ? "Disconnect" : "Reconnect"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total current */}
            <div
              className="w-full rounded-xl p-3 border border-white/6 text-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="text-xl font-black" style={{ color: "#10B981" }}>
                {(totalCurrent * 1000).toFixed(1)} mA
              </div>
              <div className="text-xs text-white/40 mt-0.5">Total circuit current</div>
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-3">
            {/* Status cards */}
            {[0, 1, 2].map((i) => {
              const on = connected[i];
              return (
                <div
                  key={i}
                  className="rounded-xl p-3 border transition-all duration-500"
                  style={{
                    background: on ? "rgba(99,102,241,0.07)" : "rgba(239,68,68,0.05)",
                    borderColor: on ? "rgba(99,102,241,0.2)" : "rgba(239,68,68,0.2)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: on ? "#818CF8" : "#F87171" }}>
                      Branch {i + 1}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: on ? "rgba(99,102,241,0.2)" : "rgba(239,68,68,0.15)",
                        color: on ? "#818CF8" : "#F87171",
                      }}
                    >
                      {on ? "CONNECTED" : "OPEN"}
                    </span>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: "rgba(240,240,245,0.45)" }}>
                    {on
                      ? `V = 12V | I = ${(branchCurrents[i] * 1000).toFixed(1)}mA | Normal operation`
                      : "Branch disconnected → no current. Other branches unaffected."}
                  </p>
                </div>
              );
            })}

            {/* Key contrast */}
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "rgba(99,102,241,0.08)",
                borderColor: "rgba(99,102,241,0.25)",
              }}
            >
              <div className="text-xs font-bold text-white mb-2">Key Contrast vs. Series</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className="rounded-lg p-2 border"
                  style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}
                >
                  <div className="font-bold text-red-400 mb-1">Series Circuit</div>
                  <div className="text-white/50">One fail → ALL stop</div>
                  <div className="text-white/30 text-[10px] mt-0.5">Old Christmas lights</div>
                </div>
                <div
                  className="rounded-lg p-2 border"
                  style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}
                >
                  <div className="font-bold text-emerald-400 mb-1">Parallel Circuit</div>
                  <div className="text-white/50">One fail → others keep going</div>
                  <div className="text-white/30 text-[10px] mt-0.5">Home wiring ✓</div>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-3 border text-xs"
              style={{
                background: "rgba(16,185,129,0.06)",
                borderColor: "rgba(16,185,129,0.2)",
                color: "#6EE7B7",
              }}
            >
              {connected.every(Boolean)
                ? "All 3 branches active. Try disconnecting one to see the magic of parallel circuits!"
                : connected.filter(Boolean).length === 0
                ? "All branches disconnected. No current flows. Reconnect a branch!"
                : `${connected.filter(Boolean).length} branch(es) active. The others continue at full voltage and current!`}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
