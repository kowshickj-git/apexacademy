"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#0891B2";

const BAUDS = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

export default function UARTSim({ onUse }: Props) {
  const [baud, setBaud] = useState(115200);
  const [message, setMessage] = useState("Hello STM32");
  const [parity, setParity] = useState<"None" | "Even" | "Odd">("None");
  const [stopBits, setStopBits] = useState<1 | 2>(1);
  const [transmitting, setTransmitting] = useState(false);
  const [txByte, setTxByte] = useState<number | null>(null);
  const [called, setCalled] = useState(false);

  function handle() { if (!called) { setCalled(true); onUse(); } }

  const charToTransmit = message.charCodeAt(0) || 72; // 'H'
  const bits = charToTransmit.toString(2).padStart(8, "0");
  const bitTime = (1 / baud) * 1_000_000;
  const frameTime = (1 + 8 + (parity !== "None" ? 1 : 0) + stopBits) * bitTime;
  const totalTime = frameTime * message.length;

  function parityBit(val: number, type: "Even" | "Odd"): number {
    const ones = val.toString(2).split("1").length - 1;
    return type === "Even" ? (ones % 2 === 0 ? 0 : 1) : (ones % 2 === 0 ? 1 : 0);
  }

  function transmit() {
    handle();
    setTransmitting(true);
    setTxByte(null);
    setTimeout(() => {
      setTxByte(charToTransmit);
      setTimeout(() => { setTransmitting(false); }, 800);
    }, 600);
  }

  const frameDisplay = [
    { label: "START", val: "0", color: "#EF4444" },
    ...bits.split("").reverse().map((b, i) => ({ label: `D${i}`, val: b, color: "#F0F0F5" })),
    ...(parity !== "None" ? [{ label: "PAR", val: String(parityBit(charToTransmit, parity as "Even" | "Odd")), color: "#F59E0B" }] : []),
    ...Array.from({ length: stopBits }, (_, i) => ({ label: `STOP${stopBits > 1 ? i + 1 : ""}`, val: "1", color: "#10B981" })),
  ];

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 07 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>UART Frame Builder</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          Visualize UART framing: start bit, 8 data bits (LSB first), optional parity, stop bits.
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.2)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Message */}
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>Message</div>
                <input
                  value={message}
                  onChange={e => { setMessage(e.target.value); handle(); }}
                  maxLength={32}
                  className="w-full rounded-lg px-3 py-2 text-sm font-mono"
                  style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(8,145,178,0.25)", color: "#F0F0F5", outline: "none" }}
                  placeholder="Type message..."
                />
              </div>

              {/* Baud rate */}
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>Baud Rate</div>
                <div className="grid grid-cols-4 gap-1">
                  {BAUDS.map(b => (
                    <button
                      key={b}
                      onClick={() => { setBaud(b); handle(); }}
                      className="py-1.5 rounded-lg text-[9px] font-bold transition-all"
                      style={{
                        background: baud === b ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${baud === b ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: baud === b ? COLOR : "rgba(240,240,245,0.3)",
                      }}
                    >
                      {b >= 1000 ? `${b / 1000}k` : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parity */}
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>Parity</div>
                <div className="flex gap-2">
                  {(["None", "Even", "Odd"] as const).map(p => (
                    <button key={p} onClick={() => { setParity(p); handle(); }}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: parity === p ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${parity === p ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: parity === p ? COLOR : "rgba(240,240,245,0.35)",
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stop bits */}
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>Stop Bits</div>
                <div className="flex gap-2">
                  {([1, 2] as const).map(s => (
                    <button key={s} onClick={() => { setStopBits(s); handle(); }}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: stopBits === s ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${stopBits === s ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: stopBits === s ? COLOR : "rgba(240,240,245,0.35)",
                      }}>
                      {s} Stop
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={transmit}
                disabled={transmitting || !message}
                className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all disabled:opacity-40"
                style={{ borderColor: "rgba(8,145,178,0.4)", background: "rgba(8,145,178,0.12)", color: COLOR }}
              >
                {transmitting ? "Transmitting..." : "Transmit First Byte"}
              </button>
            </div>

            <div>
              {/* Frame diagram */}
              <div className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.5)" }}>
                Frame for {message[0] ? `'${message[0]}'` : "?"} (0x{charToTransmit.toString(16).toUpperCase().padStart(2, "0")})
              </div>
              <div className="flex gap-1 flex-wrap mb-4">
                {frameDisplay.map((bit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-md border px-2 py-3 text-center"
                    style={{ background: `${bit.color}10`, borderColor: `${bit.color}30`, minWidth: "36px" }}
                  >
                    <div className="text-[8px] font-mono mb-1" style={{ color: bit.color }}>{bit.label}</div>
                    <div className="text-sm font-black font-mono" style={{ color: bit.color }}>{bit.val}</div>
                  </motion.div>
                ))}
              </div>

              {/* Waveform */}
              <div className="mb-4 rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.5)", height: "64px" }}>
                <svg width="100%" height="64" viewBox={`0 0 ${frameDisplay.length * 28} 64`} preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={COLOR}
                    strokeWidth="2"
                    points={frameDisplay.reduce((acc, bit, i) => {
                      const x = i * 28;
                      const y = bit.val === "1" ? 12 : 52;
                      const prevY = i === 0 ? 12 : (frameDisplay[i - 1].val === "1" ? 12 : 52);
                      return acc + (i === 0 ? "" : ` ${x},${prevY} ${x},${y}`) + ` ${x + 28},${y}`;
                    }, `0,12`)}
                  />
                </svg>
              </div>

              {/* Stats */}
              <div className="space-y-1.5 mb-4">
                {[
                  { label: "Bit Time", val: `${bitTime.toFixed(2)} µs` },
                  { label: "Frame Time", val: `${frameTime.toFixed(2)} µs` },
                  { label: "Total TX Time", val: totalTime < 1000 ? `${totalTime.toFixed(1)} µs` : `${(totalTime / 1000).toFixed(2)} ms` },
                  { label: "Throughput", val: `${(message.length / (totalTime / 1_000_000)).toFixed(0)} bytes/s` },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-xs">
                    <span style={{ color: "rgba(240,240,245,0.4)" }}>{r.label}</span>
                    <span className="font-mono" style={{ color: "#F0F0F5" }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* HAL code */}
              <div className="p-3 rounded-xl text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.55)" }}>
                <div>huart2.Init.BaudRate = {baud};</div>
                <div>huart2.Init.WordLength = UART_WORDLENGTH_8B;</div>
                <div>huart2.Init.Parity = UART_PARITY_{parity === "None" ? "NONE" : parity.toUpperCase()};</div>
                <div>huart2.Init.StopBits = UART_STOPBITS_{stopBits};</div>
                <div className="mt-1">HAL_UART_Transmit(&huart2, (uint8_t*)"{message}", {message.length}, 1000);</div>
              </div>

              <AnimatePresence>
                {txByte !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-2.5 rounded-xl border text-center text-xs font-mono"
                    style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)", color: "#10B981" }}
                  >
                    Sent: 0x{txByte.toString(16).toUpperCase().padStart(2, "0")} ('{String.fromCharCode(txByte)}')
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
