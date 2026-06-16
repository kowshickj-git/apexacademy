"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#8B5CF6";

type Tab = "sync" | "async";

// SVG waveform for sync: clock + data aligned
function SyncWaveform() {
  const W = 320; const H = 100;
  const clkY = 22; const dataY = 72;
  const period = 40;
  const bits = [1, 0, 1, 1, 0, 1, 0, 0];

  // Build clock path
  let clkPath = `M 0 ${clkY + 12}`;
  for (let i = 0; i < 8; i++) {
    const x = i * period;
    clkPath += ` L ${x} ${clkY + 12} L ${x} ${clkY - 12} L ${x + period / 2} ${clkY - 12} L ${x + period / 2} ${clkY + 12}`;
  }
  clkPath += ` L ${8 * period} ${clkY + 12}`;

  // Build data path (changes on falling edge of clock)
  let dataPath = `M 0 ${dataY + (bits[0] ? -12 : 12)}`;
  for (let i = 0; i < bits.length; i++) {
    const x = i * period;
    const y = dataY + (bits[i] ? -12 : 12);
    dataPath += ` L ${x + period} ${y}`;
    if (i < bits.length - 1 && bits[i] !== bits[i + 1]) {
      const nx = (i + 1) * period;
      const ny = dataY + (bits[i + 1] ? -12 : 12);
      dataPath += ` L ${nx} ${ny}`;
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      {/* CLK label */}
      <text x="2" y={clkY} fontSize="9" fill="rgba(240,240,245,0.4)" fontFamily="monospace">CLK</text>
      {/* DATA label */}
      <text x="2" y={dataY + 4} fontSize="9" fill="rgba(240,240,245,0.4)" fontFamily="monospace">DATA</text>
      {/* Clock waveform */}
      <path d={clkPath} stroke="#06B6D4" strokeWidth="1.5" fill="none" />
      {/* Data waveform */}
      <path d={dataPath} stroke={COLOR} strokeWidth="1.5" fill="none" />
      {/* Bit labels */}
      {bits.map((b, i) => (
        <text key={i} x={i * period + period / 2} y={dataY + (b ? -16 : 24)} fontSize="8" fill={`${COLOR}80`} fontFamily="monospace" textAnchor="middle">{b}</text>
      ))}
      {/* Rising edge markers */}
      {bits.map((_, i) => (
        <line key={i} x1={i * period} y1={clkY - 14} x2={i * period} y2={dataY + 14} stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" strokeDasharray="3,3" />
      ))}
    </svg>
  );
}

// SVG waveform for async: start bit + data bits + stop bit
function AsyncWaveform() {
  const W = 320; const H = 70;
  const y = 35; const period = 28;
  const frame = [0, 0, 1, 0, 0, 0, 1, 1, 0, 1]; // start + 8N1 for 'A' (0x41) + stop

  let path = `M 0 ${y + 14}`;
  for (let i = 0; i < frame.length; i++) {
    const x = i * period;
    const yVal = frame[i] ? y - 14 : y + 14;
    if (i === 0 || frame[i] !== frame[i - 1]) {
      path += ` L ${x} ${yVal}`;
    }
    path += ` L ${x + period} ${yVal}`;
  }

  const labels = ["START", "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "STOP"];
  const colors = ["#EF4444", COLOR, COLOR, COLOR, COLOR, COLOR, COLOR, COLOR, COLOR, "#10B981"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      <path d={path} stroke={COLOR} strokeWidth="1.5" fill="none" />
      {frame.map((b, i) => (
        <g key={i}>
          <line x1={i * period} y1={y - 20} x2={i * period} y2={y + 20} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <text x={i * period + period / 2} y={b ? y - 18 : y + 26} fontSize="7" fill={colors[i]} fontFamily="monospace" textAnchor="middle">{labels[i]}</text>
          <text x={i * period + period / 2} y={b ? y - 8 : y + 18} fontSize="8" fill={`${colors[i]}90`} fontFamily="monospace" textAnchor="middle">{b}</text>
        </g>
      ))}
    </svg>
  );
}

export default function SyncAsyncSim({ onUsed }: Props) {
  const [tab, setTab] = useState<Tab>("sync");
  const usedRef = useRef(false);

  function handleTab(t: Tab) {
    setTab(t);
    if (!usedRef.current) { usedRef.current = true; onUsed(); }
  }

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 05 · Synchronous vs Asynchronous</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Sync vs Async Communication</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          How do two devices stay in sync when exchanging bits? Two very different answers.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["sync", "async"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => handleTab(t)}
              className="px-5 py-2 rounded-xl font-semibold text-sm border transition-all"
              style={{
                background: tab === t ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: tab === t ? "rgba(139,92,246,0.45)" : "rgba(255,255,255,0.08)",
                color: tab === t ? COLOR : "rgba(240,240,245,0.4)",
              }}
            >
              {t === "sync" ? "Synchronous" : "Asynchronous"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "sync" ? (
            <motion.div
              key="sync"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="rounded-2xl p-5 border mb-4" style={{ background: "rgba(6,182,212,0.05)", borderColor: "rgba(6,182,212,0.2)" }}>
                <h3 className="text-base font-bold mb-2" style={{ color: "#06B6D4" }}>Synchronous — Shared Clock Line</h3>
                <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.6)" }}>
                  A dedicated <strong style={{ color: "#06B6D4" }}>clock line (CLK/SCL/SCK)</strong> is shared between master and slave.
                  Data bits are sampled at clock edges — no need to agree on timing in advance.
                  The clock signal tells the receiver exactly when to read each bit.
                </p>

                {/* Waveform */}
                <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-[10px] font-mono mb-2" style={{ color: "rgba(240,240,245,0.3)" }}>Waveform — data aligned to clock edges</div>
                  <SyncWaveform />
                </div>

                <div className="flex gap-4 flex-wrap text-xs">
                  {[{ label: "Clock line", color: "#06B6D4" }, { label: "Data line", color: COLOR }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-6 h-0.5 rounded" style={{ background: l.color }} />
                      <span style={{ color: "rgba(240,240,245,0.45)" }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)" }}>
                  <span className="font-bold" style={{ color: "#06B6D4" }}>Examples: </span>
                  <span style={{ color: "rgba(240,240,245,0.55)" }}>I2C (SDA + SCL), SPI (MOSI/MISO + SCK), CAN — all use a clock line or bit timing derived from the bus.</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border text-sm" style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)", color: "rgba(240,240,245,0.6)" }}>
                <span className="font-bold" style={{ color: "#10B981" }}>Advantage: </span>
                Clock ensures receiver never misses a bit. Works at variable speeds — just slow the clock and receiver adapts automatically.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="async"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="rounded-2xl p-5 border mb-4" style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}>
                <h3 className="text-base font-bold mb-2" style={{ color: COLOR }}>Asynchronous — Agreed Baud Rate</h3>
                <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.6)" }}>
                  <strong style={{ color: COLOR }}>No clock line.</strong> Instead, both sides are configured with the same baud rate (bits per second).
                  A <strong style={{ color: "#EF4444" }}>START bit</strong> signals the beginning of a frame — the receiver starts its internal timer and samples each bit at the agreed interval.
                </p>

                {/* Waveform */}
                <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-[10px] font-mono mb-2" style={{ color: "rgba(240,240,245,0.3)" }}>UART frame for &apos;A&apos; (0x41) at 9600 baud, 8N1</div>
                  <AsyncWaveform />
                </div>

                <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
                  <span className="font-bold" style={{ color: COLOR }}>Examples: </span>
                  <span style={{ color: "rgba(240,240,245,0.55)" }}>UART, RS232, RS485 — all asynchronous. No clock wire means simpler wiring, longer distances.</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border text-sm mb-4" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)", color: "rgba(240,240,245,0.6)" }}>
                <span className="font-bold" style={{ color: "#EF4444" }}>Baud Rate Mismatch: </span>
                If sender uses 115200 baud and receiver uses 9600, the receiver samples bits at the wrong times.
                Result: <strong style={{ color: "#EF4444" }}>garbled data like &quot;?ÿÿÿ&quot;</strong> or random characters in the serial monitor.
                Always configure <strong>identical</strong> baud rate on both sides.
              </div>

              <div className="rounded-xl p-3 border text-xs" style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
                <span className="font-bold" style={{ color: "#F59E0B" }}>Common baud rates: </span>
                <span className="font-mono" style={{ color: "rgba(240,240,245,0.55)" }}>9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
