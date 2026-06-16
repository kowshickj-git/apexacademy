"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#10B981";

const BAUD_OPTIONS = [9600, 19200, 38400, 57600, 115200, 230400];

function garbledText(): string {
  const chars = "?ÿ¿¡§©®¬÷×±√∞≈ΩΔΣπ∂∇∈∉∩∪";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function msPerBit(baud: number): string {
  const us = (1 / baud) * 1_000_000;
  if (us >= 1000) return `${(us / 1000).toFixed(2)} ms`;
  return `${us.toFixed(1)} µs`;
}

function helloMs(baud: number): string {
  // "Hello" = 5 chars = 50 bits at 8N1
  const ms = (50 / baud) * 1000;
  return ms < 1 ? `${(ms * 1000).toFixed(0)} µs` : `${ms.toFixed(3)} ms`;
}

export default function BaudRateSim({ onUsed }: Props) {
  const [senderBaud, setSenderBaud] = useState(115200);
  const [receiverBaud, setReceiverBaud] = useState(115200);
  const [garbled, setGarbled] = useState("");
  const calledRef = useRef(false);
  const garbleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const matched = senderBaud === receiverBaud;

  function handleChange(type: "sender" | "receiver", val: number) {
    if (!calledRef.current) {
      calledRef.current = true;
      onUsed();
    }
    if (type === "sender") setSenderBaud(val);
    else setReceiverBaud(val);
  }

  useEffect(() => {
    if (!matched) {
      setGarbled(garbledText());
      garbleTimerRef.current = setInterval(() => {
        setGarbled(garbledText());
      }, 800);
    } else {
      if (garbleTimerRef.current) clearInterval(garbleTimerRef.current);
    }
    return () => { if (garbleTimerRef.current) clearInterval(garbleTimerRef.current); };
  }, [matched, senderBaud, receiverBaud]);

  const senderUsPerBit = (1 / senderBaud) * 1_000_000;
  const receiverUsPerBit = (1 / receiverBaud) * 1_000_000;
  const skewRatio = matched ? 1 : Math.max(senderBaud, receiverBaud) / Math.min(senderBaud, receiverBaud);

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 05 · Baud Rate Simulator</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Baud Rate Mismatch Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
          Change sender and receiver baud rates to see what happens when they don't match.
        </p>
      </motion.div>

      {/* Dropdowns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div>
          <label className="block text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.6)" }}>Sender Baud Rate</label>
          <select
            value={senderBaud}
            onChange={e => handleChange("sender", Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-mono border outline-none"
            style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.3)", color: "#F0F0F5" }}
          >
            {BAUD_OPTIONS.map(b => (
              <option key={b} value={b} style={{ background: "#050507" }}>{b.toLocaleString()} baud</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.6)" }}>Receiver Baud Rate</label>
          <select
            value={receiverBaud}
            onChange={e => handleChange("receiver", Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-mono border outline-none"
            style={{ background: matched ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)", borderColor: matched ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)", color: "#F0F0F5" }}
          >
            {BAUD_OPTIONS.map(b => (
              <option key={b} value={b} style={{ background: "#050507" }}>{b.toLocaleString()} baud</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Status */}
      <motion.div
        key={matched ? "match" : "mismatch"}
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border p-5 mb-5"
        style={{
          background: matched ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
          borderColor: matched ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${matched ? "" : "animate-pulse"}`} style={{ background: matched ? COLOR : "#EF4444" }} />
          <span className="text-sm font-black" style={{ color: matched ? COLOR : "#EF4444" }}>
            {matched ? "MATCH — Communication OK!" : "MISMATCH — Garbled Data!"}
          </span>
        </div>

        {matched ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-mono font-bold" style={{ color: COLOR }}>{msPerBit(senderBaud)}</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>per bit</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-mono font-bold" style={{ color: "#34D399" }}>{Math.round(senderBaud / 10 * 0.8)} bytes/s</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>effective (8N1)</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-mono font-bold" style={{ color: "#6EE7B7" }}>{helloMs(senderBaud)}</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>&quot;Hello&quot; (50 bits)</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-mono text-sm px-4 py-3 rounded-xl mb-3" style={{ background: "rgba(0,0,0,0.3)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              Received: {garbled}
            </div>
            <p className="text-xs mb-2" style={{ color: "rgba(240,240,245,0.55)" }}>
              <strong>Why?</strong> Receiver samples bits at wrong time intervals.
            </p>
            <p className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
              At {senderBaud.toLocaleString()} baud, sender sends bits every <strong style={{ color: "#EF4444" }}>{senderUsPerBit.toFixed(1)} µs</strong>.
              Receiver at {receiverBaud.toLocaleString()} samples every <strong style={{ color: "#F59E0B" }}>{receiverUsPerBit.toFixed(1)} µs</strong> —
              by the time receiver samples, approximately <strong style={{ color: "#EF4444" }}>{skewRatio.toFixed(1)}×</strong> the number of bits expected have passed.
            </p>
          </div>
        )}
      </motion.div>

      {/* Waveform visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
        className="rounded-2xl border p-5"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-xs font-bold mb-4" style={{ color: "rgba(240,240,245,0.5)" }}>Bit Timing Visualization</h3>
        <div className="relative h-20 mb-2">
          <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
            {/* Sender waveform — fixed timing */}
            <polyline
              points="0,20 30,20 30,60 60,60 90,20 90,60 120,60 150,20 180,20 210,60 240,60 270,20 300,20"
              fill="none" stroke={COLOR} strokeWidth="2"
            />
            {/* Receiver sampling points */}
            {matched ? (
              // Sampling at same rate — hits bit centers
              [15, 45, 75, 105, 135, 165, 195, 225, 255, 285].map((x, i) => {
                const y = [20, 60, 20, 60, 20, 60, 20, 60, 20, 20][i] || 20;
                return (
                  <g key={i}>
                    <line x1={x} y1={y - 10} x2={x} y2={y + 10} stroke={COLOR} strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx={x} cy={y} r="3" fill={COLOR} />
                  </g>
                );
              })
            ) : (
              // Sampling at different rate — hits random positions
              Array.from({ length: 8 }, (_, i) => {
                const x = (i + 1) * (300 / 9) * (senderBaud / receiverBaud);
                const clampedX = Math.min(x, 295);
                return (
                  <g key={i}>
                    <line x1={clampedX} y1="10" x2={clampedX} y2="70" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx={clampedX} cy={Math.random() > 0.5 ? 20 : 60} r="3" fill="#EF4444" />
                  </g>
                );
              })
            )}
          </svg>
        </div>
        <div className="flex gap-4 text-[10px] flex-wrap">
          <span className="flex items-center gap-1"><span className="w-4 h-0.5 rounded inline-block" style={{ background: COLOR }} /> Sender signal</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: matched ? COLOR : "#EF4444" }} />
            {matched ? "Receiver samples (aligned ✓)" : "Receiver samples (misaligned ✗)"}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
