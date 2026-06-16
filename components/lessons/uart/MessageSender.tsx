"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#10B981";

interface EncodedChar {
  char: string;
  ascii: number;
  hex: string;
  binary: string;
  frameBits: number[]; // start + 8 data (LSB first) + stop
}

function encodeMessage(msg: string): EncodedChar[] {
  return msg.split("").map(ch => {
    const ascii = ch.charCodeAt(0);
    const binary = ascii.toString(2).padStart(8, "0");
    // LSB first: reverse the bits
    const lsbFirst = binary.split("").reverse();
    const frameBits = [0, ...lsbFirst.map(Number), 1]; // start + 8 data + stop
    return {
      char: ch,
      ascii,
      hex: "0x" + ascii.toString(16).toUpperCase().padStart(2, "0"),
      binary,
      frameBits,
    };
  });
}

export default function MessageSender({ onUsed }: Props) {
  const [message, setMessage] = useState("UART");
  const [encoded, setEncoded] = useState<EncodedChar[]>([]);
  const [animating, setAnimating] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentBitIndex, setCurrentBitIndex] = useState(0);
  const [sent, setSent] = useState(false);
  const calledOnUsed = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAnimating(false);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function handleSend() {
    if (!message.trim() || animating) return;
    if (!calledOnUsed.current) {
      calledOnUsed.current = true;
      onUsed();
    }
    const enc = encodeMessage(message.slice(0, 8));
    setEncoded(enc);
    setSent(false);
    setAnimating(true);
    setCurrentCharIndex(0);
    setCurrentBitIndex(0);

    let charIdx = 0;
    let bitIdx = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      bitIdx++;
      if (bitIdx >= 10) {
        // 10 bits per char (start + 8 data + stop)
        bitIdx = 0;
        charIdx++;
        if (charIdx >= enc.length) {
          clearInterval(intervalRef.current!);
          setAnimating(false);
          setSent(true);
          return;
        }
      }
      setCurrentCharIndex(charIdx);
      setCurrentBitIndex(bitIdx);
    }, 80);
  }

  const BIT_COLORS = ["#EF4444", COLOR, COLOR, COLOR, COLOR, COLOR, COLOR, COLOR, COLOR, "#3B82F6"];
  const BIT_LABELS = ["START", "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "STOP"];

  const totalBits = encoded.reduce((a, c) => a + c.frameBits.length, 0);
  const transmissionMs = ((totalBits / 9600) * 1000).toFixed(2);

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 04 · Message Sender</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Send a Message via UART</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
          Type a message and watch it get encoded into UART frames, bit by bit.
        </p>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
        className="flex gap-3 mb-6"
      >
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value.slice(0, 8))}
          placeholder="Type up to 8 chars..."
          disabled={animating}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-mono border outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(16,185,129,0.3)",
            color: "#F0F0F5",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || animating}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${COLOR}, #34D399)`, color: "white" }}
        >
          {animating ? "Sending…" : "Send →"}
        </button>
        {animating && (
          <button
            onClick={stopAnimation}
            className="px-3 py-2.5 rounded-xl text-xs border"
            style={{ borderColor: "rgba(239,68,68,0.3)", color: "#EF4444" }}
          >
            ■ Stop
          </button>
        )}
      </motion.div>

      {/* Encoding breakdown for current char */}
      {encoded.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-5 mb-5"
          style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.18)" }}
        >
          <h3 className="text-xs font-bold mb-3" style={{ color: COLOR }}>
            Character Breakdown — &quot;{encoded[Math.min(currentCharIndex, encoded.length - 1)]?.char}&quot;
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {(() => {
              const ch = encoded[Math.min(currentCharIndex, encoded.length - 1)];
              if (!ch) return null;
              return [
                { label: "Character", value: ch.char, color: COLOR },
                { label: "ASCII Dec", value: ch.ascii.toString(), color: "#34D399" },
                { label: "Hex", value: ch.hex, color: "#6EE7B7" },
                { label: "Binary (MSB)", value: ch.binary, color: "#A7F3D0" },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>{item.label}</div>
                </div>
              ));
            })()}
          </div>

          {/* Wire visualization */}
          <div className="mb-3">
            <div className="flex items-center gap-0.5 flex-wrap">
              {encoded[Math.min(currentCharIndex, encoded.length - 1)]?.frameBits.map((bit, bi) => {
                const isCurrentBit = animating && bi === currentBitIndex;
                const isPast = animating ? bi < currentBitIndex : true;
                return (
                  <div
                    key={bi}
                    className="flex flex-col items-center gap-0.5 transition-all duration-100"
                    style={{ opacity: animating ? (isPast ? 0.5 : isCurrentBit ? 1 : 0.15) : 0.6 }}
                  >
                    <div
                      className="rounded transition-all duration-100"
                      style={{
                        width: "20px",
                        height: bit === 1 ? "20px" : "10px",
                        background: isCurrentBit ? BIT_COLORS[bi] : BIT_COLORS[bi] + "60",
                        border: isCurrentBit ? `1px solid ${BIT_COLORS[bi]}` : "1px solid transparent",
                        boxShadow: isCurrentBit ? `0 0 6px ${BIT_COLORS[bi]}60` : "none",
                      }}
                    />
                    <div className="text-[7px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>{bit}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-2 flex-wrap">
              <span className="text-[10px] flex items-center gap-1"><span className="w-3 h-1.5 rounded inline-block" style={{ background: "#EF4444" }} /> Start</span>
              <span className="text-[10px] flex items-center gap-1"><span className="w-3 h-1.5 rounded inline-block" style={{ background: COLOR }} /> Data</span>
              <span className="text-[10px] flex items-center gap-1"><span className="w-3 h-1.5 rounded inline-block" style={{ background: "#3B82F6" }} /> Stop</span>
            </div>
          </div>

          {/* Progress */}
          {animating && (
            <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.5)" }}>
              Sending char <span style={{ color: COLOR }}>{currentCharIndex + 1}</span> of {encoded.length}
              {" "}· bit <span style={{ color: COLOR }}>{currentBitIndex + 1}</span> of 10
              {" "}· <span style={{ color: "#6EE7B7" }}>{BIT_LABELS[currentBitIndex]}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Full raw bit stream */}
      {encoded.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4 mb-5"
          style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <h3 className="text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.4)" }}>Raw Bit Stream</h3>
          <div className="font-mono text-[10px] break-all" style={{ color: "rgba(240,240,245,0.5)" }}>
            {encoded.map((ch, ci) => (
              <span key={ci}>
                <span style={{ color: "rgba(240,240,245,0.25)" }}>[</span>
                <span style={{ color: "#EF4444" }}>0</span>
                <span style={{ color: COLOR }}>{ch.frameBits.slice(1, 9).join("")}</span>
                <span style={{ color: "#3B82F6" }}>1</span>
                <span style={{ color: "rgba(240,240,245,0.25)" }}>]</span>
                {" "}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Transmission info */}
      {encoded.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs font-mono font-bold" style={{ color: COLOR }}>{encoded.length} chars</div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>characters</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs font-mono font-bold" style={{ color: "#34D399" }}>{totalBits} bits</div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>total (8N1)</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs font-mono font-bold" style={{ color: "#6EE7B7" }}>{transmissionMs} ms</div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>at 9600 baud</div>
          </div>
        </div>
      )}

      {/* Transmission complete */}
      {sent && !animating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-5 rounded-2xl border p-4 text-center"
          style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)" }}
        >
          <div className="text-lg mb-1">✅</div>
          <div className="text-sm font-bold" style={{ color: COLOR }}>Transmission Complete!</div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
            &quot;{message.slice(0, 8)}&quot; sent successfully · {totalBits} bits · {transmissionMs} ms at 9600 baud
          </div>
        </motion.div>
      )}
    </section>
  );
}
