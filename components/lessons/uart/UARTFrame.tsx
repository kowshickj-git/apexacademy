"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COLOR = "#10B981";

// 'A' = ASCII 65 = 0x41 = 01000001
// LSB first: bit0=1, bit1=0, bit2=0, bit3=0, bit4=0, bit5=0, bit6=1, bit7=0
const LETTER_A_FRAME = [
  { label: "IDLE", value: 1, type: "idle" },
  { label: "START", value: 0, type: "start" },
  { label: "D0", value: 1, type: "data" },
  { label: "D1", value: 0, type: "data" },
  { label: "D2", value: 0, type: "data" },
  { label: "D3", value: 0, type: "data" },
  { label: "D4", value: 0, type: "data" },
  { label: "D5", value: 0, type: "data" },
  { label: "D6", value: 1, type: "data" },
  { label: "D7", value: 0, type: "data" },
  { label: "STOP", value: 1, type: "stop" },
  { label: "IDLE", value: 1, type: "idle" },
];

const BIT_COLORS: Record<string, string> = {
  idle: "rgba(255,255,255,0.15)",
  start: "#EF4444",
  data: COLOR,
  stop: "#3B82F6",
};

const BIT_TEXT_COLORS: Record<string, string> = {
  idle: "rgba(240,240,245,0.4)",
  start: "#FCA5A5",
  data: "#6EE7B7",
  stop: "#93C5FD",
};

export default function UARTFrame() {
  const [animating, setAnimating] = useState(false);
  const [currentBitIndex, setCurrentBitIndex] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startAnimation() {
    if (animating) return;
    setAnimating(true);
    setCurrentBitIndex(0);
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= LETTER_A_FRAME.length) {
        clearInterval(intervalRef.current!);
        setAnimating(false);
        setCurrentBitIndex(-1);
      } else {
        setCurrentBitIndex(idx);
      }
    }, 280);
  }

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 02 · UART Frame Structure</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>The UART Frame</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
          Every byte of UART data is wrapped in a frame with start and stop bits so the receiver knows when data begins and ends.
        </p>
      </motion.div>

      {/* Frame visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
        className="rounded-2xl border p-5 mb-6 overflow-x-auto"
        style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.18)" }}
      >
        <h3 className="text-xs font-bold mb-3" style={{ color: COLOR }}>8N1 Frame (10 bits total)</h3>
        <div className="flex items-end gap-1 min-w-max">
          {[
            { label: "IDLE", w: 32, color: "rgba(255,255,255,0.08)", textColor: "rgba(240,240,245,0.3)", h: 32 },
            { label: "START\n(LOW)", w: 36, color: "#EF444420", textColor: "#EF4444", h: 16 },
            { label: "D0", w: 30, color: "rgba(16,185,129,0.15)", textColor: COLOR, h: 32 },
            { label: "D1", w: 30, color: "rgba(16,185,129,0.08)", textColor: COLOR, h: 16 },
            { label: "D2", w: 30, color: "rgba(16,185,129,0.08)", textColor: COLOR, h: 16 },
            { label: "D3", w: 30, color: "rgba(16,185,129,0.08)", textColor: COLOR, h: 16 },
            { label: "D4", w: 30, color: "rgba(16,185,129,0.08)", textColor: COLOR, h: 16 },
            { label: "D5", w: 30, color: "rgba(16,185,129,0.08)", textColor: COLOR, h: 16 },
            { label: "D6", w: 30, color: "rgba(16,185,129,0.08)", textColor: COLOR, h: 16 },
            { label: "D7", w: 30, color: "rgba(16,185,129,0.08)", textColor: COLOR, h: 16 },
            { label: "STOP\n(HIGH)", w: 36, color: "rgba(59,130,246,0.15)", textColor: "#3B82F6", h: 32 },
            { label: "IDLE", w: 32, color: "rgba(255,255,255,0.08)", textColor: "rgba(240,240,245,0.3)", h: 32 },
          ].map((seg, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="rounded border flex items-center justify-center text-[9px] font-bold text-center"
                style={{ width: seg.w, height: seg.h + 8, background: seg.color, borderColor: seg.textColor + "40", color: seg.textColor, fontSize: "8px", lineHeight: "1.2", whiteSpace: "pre-line" }}
              >
                {seg.label}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 flex-wrap">
          <span className="text-[10px] flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: "rgba(255,255,255,0.15)" }} /> Idle (HIGH)</span>
          <span className="text-[10px] flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: "rgba(239,68,68,0.3)" }} /> Start Bit (LOW)</span>
          <span className="text-[10px] flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: "rgba(16,185,129,0.3)" }} /> Data Bits (D0-D7)</span>
          <span className="text-[10px] flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: "rgba(59,130,246,0.3)" }} /> Stop Bit (HIGH)</span>
        </div>
      </motion.div>

      {/* Frame anatomy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
      >
        {[
          { title: "Idle State (HIGH)", color: "rgba(240,240,245,0.4)", desc: "Line sits at logic HIGH when no data is being sent. The 'mark' state." },
          { title: "Start Bit — LOW", color: "#EF4444", desc: "Always LOW (0), 1 bit. Falling edge from IDLE wakes up receiver — 'data coming!'" },
          { title: "Data Bits (8 bits)", color: COLOR, desc: "5–9 bits, typically 8 bits, sent LSB first (least significant bit first)." },
          { title: "Parity Bit (optional)", color: "#F59E0B", desc: "8N1 = no parity. 8E1 = even parity. 8O1 = odd parity. Most use 8N1." },
          { title: "Stop Bit — HIGH", color: "#3B82F6", desc: "Always HIGH (1), 1 or 2 bits. Returns line to idle, signals 'frame complete'." },
          { title: "8N1 Notation", color: "#8B5CF6", desc: "8 data bits, No parity, 1 stop bit — the most common UART format worldwide." },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: item.color }} />
            <div>
              <div className="text-xs font-bold mb-0.5" style={{ color: item.color }}>{item.title}</div>
              <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Voltage levels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
        className="rounded-2xl border p-4 mb-6"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.6)" }}>Voltage Levels</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-16 text-right text-xs font-mono font-bold" style={{ color: COLOR }}>HIGH (1)</div>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.3)" }} />
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>3.3V or 5V depending on device</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 text-right text-xs font-mono font-bold" style={{ color: "#EF4444" }}>LOW (0)</div>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.3)" }} />
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>0V (GND)</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 text-right text-xs font-mono font-bold" style={{ color: "rgba(240,240,245,0.4)" }}>IDLE</div>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>HIGH ("mark" state)</div>
          </div>
        </div>
      </motion.div>

      {/* Interactive animation — Send letter 'A' */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        className="rounded-2xl border p-5"
        style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.2)" }}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#F0F0F5" }}>Animate: Send Letter &apos;A&apos;</h3>
            <p className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>A = ASCII 65 = 0x41 = 01000001 (binary) → sent LSB first</p>
          </div>
          <button
            onClick={startAnimation}
            disabled={animating}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
            style={{ background: animating ? "rgba(16,185,129,0.1)" : `linear-gradient(135deg, ${COLOR}, #34D399)`, color: animating ? COLOR : "white", border: `1px solid rgba(16,185,129,0.3)` }}
          >
            {animating ? "Transmitting…" : "▶ Send 'A'"}
          </button>
        </div>

        {/* Bit visualization */}
        <div className="flex gap-1 flex-wrap mb-4">
          {LETTER_A_FRAME.map((bit, i) => {
            const isActive = i === currentBitIndex;
            const isPast = currentBitIndex >= 0 && i < currentBitIndex;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-1 transition-all duration-200"
                style={{ opacity: currentBitIndex === -1 ? 0.5 : isPast ? 0.4 : isActive ? 1 : 0.2 }}
              >
                {/* Bit level indicator */}
                <div
                  className="w-8 rounded transition-all duration-200"
                  style={{
                    height: bit.value === 1 ? "28px" : "12px",
                    background: isActive ? BIT_COLORS[bit.type] : BIT_COLORS[bit.type] + "60",
                    border: isActive ? `1px solid ${BIT_COLORS[bit.type]}` : "1px solid transparent",
                    boxShadow: isActive ? `0 0 8px ${BIT_COLORS[bit.type]}60` : "none",
                  }}
                />
                <div className="text-[8px] font-mono text-center" style={{ color: isActive ? BIT_TEXT_COLORS[bit.type] : "rgba(240,240,245,0.25)" }}>
                  {bit.label}
                </div>
                <div className="text-[9px] font-bold font-mono" style={{ color: isActive ? BIT_TEXT_COLORS[bit.type] : "rgba(240,240,245,0.2)" }}>
                  {bit.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current bit info */}
        {currentBitIndex >= 0 && currentBitIndex < LETTER_A_FRAME.length && (
          <motion.div
            key={currentBitIndex}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-2 text-xs text-center"
            style={{ background: `${BIT_COLORS[LETTER_A_FRAME[currentBitIndex].type]}15`, border: `1px solid ${BIT_COLORS[LETTER_A_FRAME[currentBitIndex].type]}30`, color: BIT_TEXT_COLORS[LETTER_A_FRAME[currentBitIndex].type] }}
          >
            Transmitting: <strong>{LETTER_A_FRAME[currentBitIndex].label}</strong> = {LETTER_A_FRAME[currentBitIndex].value} ({LETTER_A_FRAME[currentBitIndex].type})
          </motion.div>
        )}

        {currentBitIndex === -1 && !animating && (
          <div className="text-xs text-center" style={{ color: "rgba(240,240,245,0.3)" }}>
            Press ▶ to animate the UART frame for letter &apos;A&apos;
          </div>
        )}

        {/* Timing info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs font-mono font-bold" style={{ color: COLOR }}>104.17 µs</div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>Per bit at 9600 baud</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs font-mono font-bold" style={{ color: "#F59E0B" }}>25% overhead</div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>10 bits for 8 data bits (8N1)</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
