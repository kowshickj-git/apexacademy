"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OpenCircuitSimProps {
  onOpenCircuitUsed: () => void;
}

export default function OpenCircuitSim({ onOpenCircuitUsed }: OpenCircuitSimProps) {
  const [brokenWires, setBrokenWires] = useState<{ A: boolean; B: boolean; C: boolean }>({
    A: false,
    B: false,
    C: false,
  });
  const usedRef = useRef(false);

  const isOpen = brokenWires.A || brokenWires.B || brokenWires.C;

  const toggleWire = (wire: "A" | "B" | "C") => {
    setBrokenWires((prev) => {
      const next = { ...prev, [wire]: !prev[wire] };
      if (!usedRef.current && !prev[wire]) {
        usedRef.current = true;
        onOpenCircuitUsed();
      }
      return next;
    });
  };

  const ledStyle = (active: boolean) => ({
    background: active ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.04)",
    border: active ? "1.5px solid #F97316" : "1.5px solid rgba(255,255,255,0.12)",
    boxShadow: active ? "0 0 16px rgba(249,115,22,0.4)" : "none",
    color: active ? "#FB923C" : "rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
  });

  const wireStyle = (broken: boolean, label: string) => (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => toggleWire(label as "A" | "B" | "C")}
        className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
        style={{
          background: broken ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.08)",
          border: broken ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(249,115,22,0.2)",
          color: broken ? "#ef4444" : "rgba(249,115,22,0.7)",
        }}
      >
        {broken ? "✕ Broken" : "Wire " + label}
      </button>
    </div>
  );

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}
            >
              3
            </div>
            <h2 className="text-xl font-black" style={{ color: "#F0F0F5" }}>
              Open Circuit Simulator
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(249,115,22,0.1)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
            >
              +20 XP
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
            Break any wire to see what happens to the entire circuit. This is the most critical property of series circuits.
          </p>

          {/* Circuit diagram */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: "rgba(5,5,7,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Status badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "open" : "closed"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center mb-4"
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black"
                  style={{
                    background: isOpen ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
                    border: isOpen ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(16,185,129,0.35)",
                    color: isOpen ? "#ef4444" : "#10B981",
                  }}
                >
                  {isOpen ? (
                    <>
                      <span>✗</span>
                      <span>OPEN CIRCUIT — No current flows</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>CLOSED CIRCUIT — Current flowing normally</span>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Visual circuit row */}
            <div className="flex items-center justify-center gap-2 flex-wrap py-2">
              {/* Battery */}
              <div
                className="px-3 py-3 rounded-xl text-xs font-bold text-center flex-shrink-0"
                style={{
                  background: "rgba(249,115,22,0.1)",
                  border: "1.5px solid #F97316",
                  color: "#F97316",
                  minWidth: 48,
                }}
              >
                🔋
                <div style={{ fontSize: 9 }}>9V</div>
              </div>

              {/* Wire A segment */}
              <div className="flex flex-col items-center gap-1">
                {brokenWires.A ? (
                  <div className="flex items-center gap-1">
                    <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.2)" }} />
                    <div className="text-xs font-black text-red-400">✕</div>
                    <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.2)" }} />
                  </div>
                ) : (
                  <motion.div
                    style={{ width: 44, height: 2, background: "#F97316" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
                <span className="text-xs" style={{ color: brokenWires.A ? "#ef4444" : "rgba(249,115,22,0.5)" }}>
                  Wire A
                </span>
              </div>

              {/* Resistor */}
              <div
                className="px-2 py-2 rounded-lg text-xs font-bold text-center flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(240,240,245,0.6)",
                  minWidth: 44,
                }}
              >
                ⊟⊟
                <div style={{ fontSize: 8 }}>220Ω</div>
              </div>

              {/* Wire B segment */}
              <div className="flex flex-col items-center gap-1">
                {brokenWires.B ? (
                  <div className="flex items-center gap-1">
                    <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.2)" }} />
                    <div className="text-xs font-black text-red-400">✕</div>
                    <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.2)" }} />
                  </div>
                ) : (
                  <motion.div
                    style={{ width: 44, height: 2, background: "#F97316" }}
                    animate={{ opacity: isOpen ? 0.15 : [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: isOpen ? 0 : Infinity }}
                  />
                )}
                <span className="text-xs" style={{ color: brokenWires.B ? "#ef4444" : "rgba(249,115,22,0.5)" }}>
                  Wire B
                </span>
              </div>

              {/* LED1 */}
              <div
                className="px-2 py-2 rounded-xl text-xs font-bold text-center flex-shrink-0"
                style={{ ...ledStyle(!isOpen), minWidth: 44 }}
              >
                💡
                <div style={{ fontSize: 8 }}>LED1</div>
              </div>

              {/* LED2 */}
              <div
                className="px-2 py-2 rounded-xl text-xs font-bold text-center flex-shrink-0"
                style={{ ...ledStyle(!isOpen), minWidth: 44 }}
              >
                💡
                <div style={{ fontSize: 8 }}>LED2</div>
              </div>

              {/* Wire C segment */}
              <div className="flex flex-col items-center gap-1">
                {brokenWires.C ? (
                  <div className="flex items-center gap-1">
                    <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.2)" }} />
                    <div className="text-xs font-black text-red-400">✕</div>
                    <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.2)" }} />
                  </div>
                ) : (
                  <motion.div
                    style={{ width: 44, height: 2, background: "#F97316" }}
                    animate={{ opacity: isOpen ? 0.15 : [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: isOpen ? 0 : Infinity }}
                  />
                )}
                <span className="text-xs" style={{ color: brokenWires.C ? "#ef4444" : "rgba(249,115,22,0.5)" }}>
                  Wire C
                </span>
              </div>

              {/* Battery return */}
              <div style={{ color: "rgba(249,115,22,0.4)", fontSize: 16 }}>↵</div>
            </div>

            {/* Current display */}
            <div className="text-center mt-4">
              <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.35)" }}>Circuit Current</div>
              <div className="text-2xl font-black" style={{ color: isOpen ? "#ef4444" : "#F97316" }}>
                {isOpen ? "0 mA" : "23.4 mA"}
              </div>
            </div>
          </div>

          {/* Wire break buttons */}
          <div className="mb-6">
            <p className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>
              CLICK A WIRE TO BREAK IT:
            </p>
            <div className="flex gap-3 flex-wrap">
              {(["A", "B", "C"] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => toggleWire(w)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: brokenWires[w] ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.08)",
                    border: brokenWires[w] ? "1.5px solid #ef4444" : "1.5px solid rgba(249,115,22,0.3)",
                    color: brokenWires[w] ? "#ef4444" : "#F97316",
                  }}
                >
                  {brokenWires[w] ? (
                    <>
                      <span className="text-base">✕</span>
                      <span>Wire {w} — BROKEN</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base">⚡</span>
                      <span>Break Wire {w}</span>
                    </>
                  )}
                </button>
              ))}

              {/* Reset */}
              {isOpen && (
                <button
                  onClick={() => setBrokenWires({ A: false, B: false, C: false })}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1.5px solid rgba(16,185,129,0.3)",
                    color: "#10B981",
                  }}
                >
                  ↺ Repair All Wires
                </button>
              )}
            </div>
          </div>

          {/* Key lesson */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: "#F97316" }}>
              🔑 The Critical Series Circuit Rule:
            </p>
            <p className="text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>
              One open fault anywhere in a series loop kills the entire circuit. Every component
              depends on the same single current path. This is why old Christmas lights went fully
              dark when one bulb burned out.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
