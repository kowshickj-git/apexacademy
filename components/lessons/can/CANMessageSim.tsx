"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#EF4444";

type MessageType = "rpm" | "speed" | "voltage" | "temp";

interface MessageConfig {
  label: string;
  id: string;
  unit: string;
  min: number;
  max: number;
  encode: (v: number) => number[];
}

const MESSAGES: Record<MessageType, MessageConfig> = {
  rpm: {
    label: "Engine RPM",
    id: "0CF00400",
    unit: "RPM",
    min: 0,
    max: 8000,
    encode: (v) => {
      const raw = Math.round(v / 0.125);
      return [
        (raw >> 8) & 0xff,
        raw & 0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
      ];
    },
  },
  speed: {
    label: "Vehicle Speed",
    id: "18FEF100",
    unit: "km/h",
    min: 0,
    max: 200,
    encode: (v) => {
      const raw = Math.round(v / 0.00390625);
      return [
        (raw >> 8) & 0xff,
        raw & 0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
      ];
    },
  },
  voltage: {
    label: "Battery Voltage",
    id: "18FF0700",
    unit: "V",
    min: 0,
    max: 100,
    encode: (v) => {
      const raw = Math.round(v / 0.05);
      return [raw & 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
    },
  },
  temp: {
    label: "Temperature",
    id: "18FF0800",
    unit: "°C",
    min: -40,
    max: 120,
    encode: (v) => {
      const raw = Math.round((v + 40) / 0.03125);
      return [
        (raw >> 8) & 0xff,
        raw & 0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
      ];
    },
  },
};

const BYTE_COLORS = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E",
  "#14B8A6", "#3B82F6", "#8B5CF6", "#EC4899",
];

function toHex(n: number) {
  return n.toString(16).toUpperCase().padStart(2, "0");
}

export default function CANMessageSim({ onUsed }: Props) {
  const [type, setType] = useState<MessageType>("rpm");
  const [value, setValue] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const usedRef = useRef(false);

  const cfg = MESSAGES[type];
  const bytes = cfg.encode(value);

  const handleSend = useCallback(() => {
    if (!usedRef.current) {
      usedRef.current = true;
      onUsed();
    }
    setSending(true);
    setSent(false);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 2000);
    }, 800);
  }, [onUsed]);

  const handleTypeChange = (t: MessageType) => {
    setType(t);
    setValue(MESSAGES[t].min);
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
          CAN Message Simulator
        </h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.45)" }}>
          Build a real CAN frame and see the hex encoding
        </p>

        {/* Message type selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(Object.keys(MESSAGES) as MessageType[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: type === t ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${type === t ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: type === t ? COLOR : "rgba(240,240,245,0.5)",
              }}
            >
              {MESSAGES[t].label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "rgba(240,240,245,0.55)" }}>{cfg.label}</span>
            <span className="font-bold font-mono" style={{ color: COLOR }}>
              {value} {cfg.unit}
            </span>
          </div>
          <input
            type="range"
            min={cfg.min}
            max={cfg.max}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-red-500"
            style={{ accentColor: COLOR }}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>
            <span>{cfg.min} {cfg.unit}</span>
            <span>{cfg.max} {cfg.unit}</span>
          </div>
        </div>

        {/* CAN Frame display */}
        <div
          className="rounded-xl p-4 mb-5 font-mono text-xs"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
            <div>
              <span style={{ color: "rgba(240,240,245,0.35)" }}>ID: </span>
              <span className="font-bold" style={{ color: COLOR }}>0x{cfg.id}</span>
            </div>
            <div>
              <span style={{ color: "rgba(240,240,245,0.35)" }}>DLC: </span>
              <span className="font-bold" style={{ color: "#F0F0F5" }}>8</span>
            </div>
            <div>
              <span style={{ color: "rgba(240,240,245,0.35)" }}>Type: </span>
              <span style={{ color: "#22C55E" }}>Data Frame</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {bytes.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    background: `${BYTE_COLORS[i]}20`,
                    border: `1px solid ${BYTE_COLORS[i]}50`,
                    color: b === 0xff ? "rgba(240,240,245,0.25)" : BYTE_COLORS[i],
                  }}
                >
                  {toHex(b)}
                </div>
                <span style={{ color: "rgba(240,240,245,0.2)", fontSize: "9px" }}>B{i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Send button */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleSend}
            disabled={sending}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: sending ? "rgba(239,68,68,0.2)" : `linear-gradient(135deg, ${COLOR}, #DC2626)`,
              color: sending ? "rgba(240,240,245,0.4)" : "#fff",
              border: "none",
              cursor: sending ? "not-allowed" : "pointer",
              boxShadow: sending ? "none" : `0 4px 20px rgba(239,68,68,0.35)`,
            }}
          >
            {sending ? "Transmitting..." : "Send Frame →"}
          </motion.button>

          <AnimatePresence>
            {sending && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: COLOR }}
                  animate={{ x: [0, 80, 160], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 0.8, ease: "linear" }}
                />
                <span className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>
                  On CAN bus...
                </span>
              </motion.div>
            )}
            {sent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "#10B981" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#10B981" strokeWidth="1.5" />
                  <path d="M4.5 7l2 2 3-3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                ACK received
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
