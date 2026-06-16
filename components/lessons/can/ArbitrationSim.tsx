"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#EF4444";

// Node A ID: 0x100 = 0001 0000 0000 (binary)
// Node B ID: 0x050 = 0000 0101 0000 (binary)
const NODE_A_ID = 0x100;
const NODE_B_ID = 0x050;

function toBin(n: number, bits: number): string {
  return n.toString(2).padStart(bits, "0");
}

const A_BITS = toBin(NODE_A_ID, 11).split("");
const B_BITS = toBin(NODE_B_ID, 11).split("");

// Find first difference (bit position where A=1 and B=0)
const CONFLICT_BIT = A_BITS.findIndex((b, i) => b !== B_BITS[i]);

type Phase = "idle" | "running" | "done";

export default function ArbitrationSim({ onUsed }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(-1);
  const usedRef = useRef(false);

  const handleRun = useCallback(() => {
    if (!usedRef.current) {
      usedRef.current = true;
      onUsed();
    }
    setPhase("running");
    setStep(-1);

    // Animate bit-by-bit through the arbitration
    let s = 0;
    const tick = setInterval(() => {
      setStep(s);
      if (s >= CONFLICT_BIT) {
        clearInterval(tick);
        setTimeout(() => setPhase("done"), 400);
      }
      s++;
    }, 350);
  }, [onUsed]);

  const handleReset = () => {
    setPhase("idle");
    setStep(-1);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>
          CAN Bus Arbitration
        </h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          Non-destructive arbitration: lower ID wins, higher ID backs off automatically
        </p>

        {/* Nodes */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: "Node A", id: "0x100", binId: "0001 0000 000", wins: false },
            { label: "Node B", id: "0x050", binId: "0000 0101 000", wins: true },
          ].map((node) => (
            <div
              key={node.label}
              className="rounded-xl p-4"
              style={{
                background: phase === "done"
                  ? node.wins
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(239,68,68,0.05)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  phase === "done"
                    ? node.wins
                      ? "rgba(16,185,129,0.3)"
                      : "rgba(239,68,68,0.2)"
                    : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              <div className="font-bold text-sm mb-1" style={{ color: "#F0F0F5" }}>
                {node.label}
              </div>
              <div
                className="font-mono text-lg font-black mb-1"
                style={{ color: node.wins ? "#10B981" : COLOR }}
              >
                {node.id}
              </div>
              <div
                className="font-mono text-xs"
                style={{ color: "rgba(240,240,245,0.35)", letterSpacing: 2 }}
              >
                {node.binId}
              </div>
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs font-bold"
                  style={{ color: node.wins ? "#10B981" : "rgba(239,68,68,0.7)" }}
                >
                  {node.wins ? "✓ WINS — continues transmitting" : "✗ BACKS OFF — will retry"}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Bit comparison */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.35)" }}>
            Bit-by-bit arbitration (bit 10 = MSB):
          </div>
          <div className="flex gap-1 flex-wrap">
            {A_BITS.map((aBit, i) => {
              const bBit = B_BITS[i];
              const isConflict = i === CONFLICT_BIT;
              const isRevealed = step >= i;
              const busBit = isRevealed ? (aBit === "0" || bBit === "0" ? "0" : "1") : "?";

              return (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{
                      background: isRevealed
                        ? aBit === "1" && i === CONFLICT_BIT
                          ? "rgba(239,68,68,0.2)"
                          : "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.03)",
                      color: isRevealed
                        ? aBit === "1" && i === CONFLICT_BIT
                          ? COLOR
                          : "rgba(240,240,245,0.6)"
                        : "rgba(240,240,245,0.2)",
                      border: `1px solid ${
                        isConflict && isRevealed
                          ? "rgba(239,68,68,0.5)"
                          : "rgba(255,255,255,0.08)"
                      }`,
                    }}
                  >
                    {isRevealed ? aBit : "?"}
                  </div>
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{
                      background: isRevealed ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.03)",
                      color: isRevealed ? "#3B82F6" : "rgba(240,240,245,0.2)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    {isRevealed ? bBit : "?"}
                  </div>
                  <div
                    className="w-7 h-5 rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{
                      background:
                        isRevealed && isConflict
                          ? "rgba(16,185,129,0.12)"
                          : isRevealed
                          ? "rgba(255,255,255,0.04)"
                          : "transparent",
                      color:
                        isRevealed && isConflict
                          ? "#10B981"
                          : isRevealed
                          ? "rgba(240,240,245,0.4)"
                          : "rgba(240,240,245,0.15)",
                      border:
                        isRevealed && isConflict
                          ? "1px solid rgba(16,185,129,0.3)"
                          : "1px solid transparent",
                    }}
                  >
                    {isRevealed ? busBit : ""}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(240,240,245,0.2)", fontSize: "8px" }}>
                    {10 - i}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <span style={{ color: COLOR }}>■ Node A bits</span>
            <span style={{ color: "#3B82F6" }}>■ Node B bits</span>
            <span style={{ color: "#10B981" }}>■ Bus (dominant wins)</span>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 mb-5"
              style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <div className="font-bold mb-1" style={{ color: "#10B981" }}>
                Node B wins! (0x050 &lt; 0x100 → Higher Priority)
              </div>
              <div className="text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>
                At bit 8, Node A transmitted recessive (1) but the bus showed dominant (0) from
                Node B. Node A detected the mismatch and immediately stopped transmitting. The
                frame is not corrupted — Node A will retry after the current frame ends.
              </div>
              <div
                className="mt-2 text-xs font-semibold"
                style={{ color: "rgba(240,240,245,0.4)" }}
              >
                Non-destructive: Bus data is valid. No message was lost.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3">
          {phase !== "running" && (
            <motion.button
              onClick={handleRun}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 rounded-xl font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${COLOR}, #DC2626)`,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 4px 16px rgba(239,68,68,0.3)`,
              }}
            >
              ▶ Run Arbitration
            </motion.button>
          )}
          {phase !== "idle" && (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-sm transition-colors"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(240,240,245,0.55)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          )}
          {phase === "running" && (
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "rgba(240,240,245,0.45)" }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: COLOR }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              Comparing bits...
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
