"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#8B5CF6";

type Mode = "simplex" | "half" | "full";

const MODES: { id: Mode; label: string; short: string }[] = [
  { id: "simplex", label: "Simplex", short: "One direction only" },
  { id: "half", label: "Half Duplex", short: "Both directions, not simultaneous" },
  { id: "full", label: "Full Duplex", short: "Both directions simultaneously" },
];

function PacketDot({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="w-4 h-4 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 60, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.4, delay, repeat: Infinity, repeatDelay: 0.3, ease: "linear" }}
    />
  );
}

function PacketDotReverse({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="w-4 h-4 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: -60, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.4, delay, repeat: Infinity, repeatDelay: 0.3, ease: "linear" }}
    />
  );
}

export default function DuplexSim({ onUsed }: Props) {
  const [mode, setMode] = useState<Mode>("simplex");
  const usedRef = useRef(false);

  function handleMode(m: Mode) {
    setMode(m);
    if (!usedRef.current) { usedRef.current = true; onUsed(); }
  }

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 06 · Duplex Modes</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Communication Duplex Modes</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          Select a mode to see how data flows between two devices.
        </p>

        {/* Mode buttons */}
        <div className="flex gap-2 flex-wrap mb-7">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => handleMode(m.id)}
              className="px-4 py-2 rounded-xl font-semibold text-sm border transition-all"
              style={{
                background: mode === m.id ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: mode === m.id ? "rgba(139,92,246,0.45)" : "rgba(255,255,255,0.08)",
                color: mode === m.id ? COLOR : "rgba(240,240,245,0.4)",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === "simplex" && (
            <motion.div
              key="simplex"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📺</span>
                <h3 className="text-base font-bold" style={{ color: "#EF4444" }}>Simplex — One Direction Only</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.6)" }}>
                Data flows in <strong style={{ color: "#EF4444" }}>one direction only</strong>. Like a TV broadcast — you receive the signal but can&apos;t send anything back.
                Simple wiring, but no feedback possible.
              </p>

              {/* Animation */}
              <div className="flex items-center justify-center gap-6 my-5 overflow-hidden">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-2" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}>📡</div>
                  <div className="text-xs font-bold" style={{ color: "#EF4444" }}>Transmitter</div>
                  <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>Only sends</div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1 relative h-8 overflow-hidden">
                  <PacketDot color="#EF4444" delay={0} />
                  <PacketDot color="#EF4444" delay={0.5} />
                  <PacketDot color="#EF4444" delay={1} />
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-2" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}>📺</div>
                  <div className="text-xs font-bold" style={{ color: "#EF4444" }}>Receiver</div>
                  <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>Only receives</div>
                </div>
              </div>

              <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-bold" style={{ color: "#F0F0F5" }}>Examples: </span>
                <span style={{ color: "rgba(240,240,245,0.5)" }}>TV broadcast, FM radio, IR remote control (TV remote), smoke detector siren</span>
              </div>
            </motion.div>
          )}

          {mode === "half" && (
            <motion.div
              key="half"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📻</span>
                <h3 className="text-base font-bold" style={{ color: "#F59E0B" }}>Half Duplex — Take Turns</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.6)" }}>
                Both directions possible but <strong style={{ color: "#F59E0B" }}>NOT simultaneously</strong>. Like a walkie-talkie — you say &quot;Over!&quot; when done, then listen.
                Devices share the same wire and must coordinate turns.
              </p>

              {/* Animation — alternating */}
              <div className="flex items-center justify-center gap-6 my-5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-2" style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" }}>🤖</div>
                  <div className="text-xs font-bold" style={{ color: "#F59E0B" }}>Device A</div>
                </div>

                <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                  {/* A to B */}
                  <div className="flex items-center gap-1 h-5 overflow-hidden">
                    <PacketDot color="#F59E0B" delay={0} />
                    <PacketDot color="#F59E0B" delay={0.4} />
                  </div>
                  {/* B to A (delayed) */}
                  <div className="flex items-center gap-1 h-5 overflow-hidden">
                    <PacketDotReverse color="#8B5CF6" delay={1.2} />
                    <PacketDotReverse color="#8B5CF6" delay={1.6} />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-2" style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" }}>📟</div>
                  <div className="text-xs font-bold" style={{ color: "#F59E0B" }}>Device B</div>
                </div>
              </div>
              <div className="text-center text-xs mb-4" style={{ color: "rgba(245,158,11,0.6)" }}>One direction at a time — devices take turns</div>

              <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-bold" style={{ color: "#F0F0F5" }}>Examples: </span>
                <span style={{ color: "rgba(240,240,245,0.5)" }}>I2C, CAN bus, RS485 (MODBUS), walkie-talkie radio, old Ethernet (half-duplex mode)</span>
              </div>
            </motion.div>
          )}

          {mode === "full" && (
            <motion.div
              key="full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📞</span>
                <h3 className="text-base font-bold" style={{ color: "#10B981" }}>Full Duplex — Simultaneous Both Ways</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.6)" }}>
                Data flows in <strong style={{ color: "#10B981" }}>both directions simultaneously</strong>. Like a telephone call — you can talk and listen at the same time.
                Requires separate TX and RX lines.
              </p>

              {/* Animation — both at once */}
              <div className="flex items-center justify-center gap-6 my-5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-2" style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }}>🤖</div>
                  <div className="text-xs font-bold" style={{ color: "#10B981" }}>Device A</div>
                </div>

                <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                  {/* A to B */}
                  <div className="flex items-center gap-1 h-5 overflow-hidden">
                    <PacketDot color="#10B981" delay={0} />
                    <PacketDot color="#10B981" delay={0.4} />
                    <PacketDot color="#10B981" delay={0.8} />
                  </div>
                  <div className="text-center text-[9px] font-mono" style={{ color: "rgba(240,240,245,0.2)" }}>TX ↑ / RX ↓</div>
                  {/* B to A simultaneously */}
                  <div className="flex items-center gap-1 h-5 overflow-hidden">
                    <PacketDotReverse color="#8B5CF6" delay={0.2} />
                    <PacketDotReverse color="#8B5CF6" delay={0.6} />
                    <PacketDotReverse color="#8B5CF6" delay={1.0} />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-2" style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }}>📟</div>
                  <div className="text-xs font-bold" style={{ color: "#10B981" }}>Device B</div>
                </div>
              </div>
              <div className="text-center text-xs mb-4" style={{ color: "rgba(16,185,129,0.6)" }}>Both directions at the same time — separate TX/RX wires</div>

              <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-bold" style={{ color: "#F0F0F5" }}>Examples: </span>
                <span style={{ color: "rgba(240,240,245,0.5)" }}>UART (TX pin + RX pin), SPI (MOSI + MISO), telephone, full-duplex Ethernet, USB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
