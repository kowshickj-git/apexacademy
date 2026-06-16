"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#8B5CF6";

interface BitInfo {
  value: number;
  type: "start" | "data" | "stop";
  label: string;
}

function charToUartFrame(char: string): BitInfo[] {
  const code = char.charCodeAt(0);
  const bits: BitInfo[] = [];
  // Start bit
  bits.push({ value: 0, type: "start", label: "START" });
  // 8 data bits (LSB first)
  for (let i = 0; i < 8; i++) {
    bits.push({ value: (code >> i) & 1, type: "data", label: `D${i}` });
  }
  // Stop bit
  bits.push({ value: 1, type: "stop", label: "STOP" });
  return bits;
}

export default function SerialSim({ onUsed }: Props) {
  const [message, setMessage] = useState("Hi");
  const [bits, setBits] = useState<BitInfo[]>([]);
  const [animating, setAnimating] = useState(false);
  const [currentBit, setCurrentBit] = useState(-1);
  const [currentChar, setCurrentChar] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [charCode, setCharCode] = useState(0);
  const [charHex, setCharHex] = useState("");
  const [charBin, setCharBin] = useState("");
  const usedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTransmit() {
    if (animating || !message.trim()) return;
    if (!usedRef.current) { usedRef.current = true; onUsed(); }

    const char = message[0];
    const code = char.charCodeAt(0);
    const frame = charToUartFrame(char);

    setCurrentChar(char);
    setCharIndex(0);
    setCharCode(code);
    setCharHex("0x" + code.toString(16).toUpperCase().padStart(2, "0"));
    setCharBin(code.toString(2).padStart(8, "0"));
    setBits(frame);
    setCurrentBit(0);
    setAnimating(true);
  }

  useEffect(() => {
    if (!animating || bits.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentBit(prev => {
        if (prev >= bits.length - 1) {
          setAnimating(false);
          clearInterval(intervalRef.current!);
          return -1;
        }
        return prev + 1;
      });
    }, 120);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [animating, bits]);

  const bitsPerChar = 10;
  const baud = 9600;
  const timePerBit = 1 / baud * 1000; // ms
  const totalTime = (bitsPerChar * timePerBit).toFixed(3);

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 04 · Serial Simulator</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Serial Transmission Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.45)" }}>
          Watch a character travel as a UART serial frame at 9600 baud.
        </p>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            maxLength={10}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type up to 10 chars..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#F0F0F5",
            }}
          />
          <button
            onClick={startTransmit}
            disabled={animating || !message.trim()}
            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${COLOR}, #A78BFA)`, color: "white" }}
          >
            {animating ? "Sending…" : "Send over Serial"}
          </button>
        </div>

        {/* Encoding panel */}
        <AnimatePresence>
          {currentChar && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 border mb-5"
              style={{ background: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.2)" }}
            >
              <div className="text-xs font-mono mb-3" style={{ color: "rgba(139,92,246,0.6)" }}>Character encoding: &apos;{currentChar}&apos;</div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-center px-4 py-2 rounded-xl border" style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.1)" }}>
                  <div className="text-[10px] mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Character</div>
                  <div className="text-xl font-black" style={{ color: COLOR }}>&apos;{currentChar}&apos;</div>
                </div>
                <div className="text-lg" style={{ color: "rgba(139,92,246,0.4)" }}>→</div>
                <div className="text-center px-4 py-2 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="text-[10px] mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>ASCII Dec</div>
                  <div className="text-lg font-bold font-mono" style={{ color: "#F0F0F5" }}>{charCode}</div>
                </div>
                <div className="text-lg" style={{ color: "rgba(139,92,246,0.4)" }}>→</div>
                <div className="text-center px-4 py-2 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="text-[10px] mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Hex</div>
                  <div className="text-lg font-bold font-mono" style={{ color: "#F0F0F5" }}>{charHex}</div>
                </div>
                <div className="text-lg" style={{ color: "rgba(139,92,246,0.4)" }}>→</div>
                <div className="text-center px-4 py-2 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="text-[10px] mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Binary</div>
                  <div className="text-sm font-bold font-mono" style={{ color: "#F0F0F5" }}>{charBin}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wire visualization */}
        {bits.length > 0 && (
          <div className="rounded-2xl p-5 border mb-4" style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="text-[10px] font-mono mb-3" style={{ color: "rgba(240,240,245,0.3)" }}>UART Frame — 8N1 (10 bits total)</div>

            {/* Bit visualization */}
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {bits.map((bit, i) => {
                const isActive = currentBit === i;
                const isPast = currentBit > i && currentBit >= 0;
                const bgColor = bit.type === "start" ? "rgba(239,68,68,0.2)" : bit.type === "stop" ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.15)";
                const borderColor = bit.type === "start" ? "#EF4444" : bit.type === "stop" ? "#10B981" : COLOR;
                const textColor = bit.type === "start" ? "#EF4444" : bit.type === "stop" ? "#10B981" : COLOR;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <motion.div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm border"
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        background: isActive ? `rgba(139,92,246,0.35)` : isPast ? bgColor : "rgba(255,255,255,0.03)",
                        borderColor: isActive ? COLOR : isPast ? borderColor : "rgba(255,255,255,0.08)",
                      }}
                      transition={{ duration: 0.1 }}
                      style={{ color: isActive || isPast ? textColor : "rgba(240,240,245,0.2)" }}
                    >
                      {bit.value}
                    </motion.div>
                    <span className="text-[8px] font-mono" style={{ color: bit.type === "start" ? "#EF4444" : bit.type === "stop" ? "#10B981" : "rgba(139,92,246,0.5)" }}>
                      {bit.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="flex gap-4 flex-wrap text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>
              <div>Bit <span className="font-mono font-bold" style={{ color: COLOR }}>{Math.max(0, currentBit) + 1}</span> / {bits.length}</div>
              <div>Baud rate: <span className="font-mono" style={{ color: "rgba(240,240,245,0.7)" }}>9600</span></div>
              <div>Time/bit: <span className="font-mono" style={{ color: "rgba(240,240,245,0.7)" }}>{timePerBit.toFixed(3)} ms</span></div>
              <div>Frame time: <span className="font-mono" style={{ color: "rgba(240,240,245,0.7)" }}>{totalTime} ms</span></div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-3 flex-wrap text-xs">
          {[
            { color: "#EF4444", label: "Start bit (always 0)" },
            { color: COLOR, label: "Data bits (LSB first)" },
            { color: "#10B981", label: "Stop bit (always 1)" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: item.color + "30", border: `1px solid ${item.color}` }} />
              <span style={{ color: "rgba(240,240,245,0.45)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
