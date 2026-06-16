"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#EF4444";

interface ErrorType {
  name: string;
  desc: string;
  cause: string;
  effect: string;
}

const ERROR_TYPES: Record<string, ErrorType> = {
  crc: {
    name: "CRC Error",
    desc: "The CRC checksum calculated by the receiver does not match the transmitted CRC.",
    cause: "Bit corruption during transmission, noise on the bus.",
    effect: "Node sends error frame. Transmitter re-sends the frame.",
  },
  bit: {
    name: "Bit Error",
    desc: "A node monitoring its own transmission reads a bit value different from what it transmitted.",
    cause: "External noise overrides a recessive bit to dominant (or vice versa).",
    effect: "Transmitter immediately sends error frame and retries.",
  },
  stuff: {
    name: "Stuff Error",
    desc: "After 5 consecutive bits of the same value, the 6th bit must be opposite (stuffed bit). If not found, a stuff error occurs.",
    cause: "Bus corruption or faulty transmitter not inserting stuff bits correctly.",
    effect: "Any detecting node sends error frame.",
  },
  form: {
    name: "Form Error",
    desc: "A fixed-format bit field (CRC delimiter, ACK delimiter, EOF) contains an illegal bit value.",
    cause: "Protocol violation, incorrect framing by transmitter.",
    effect: "Receiver sends error frame.",
  },
  ack: {
    name: "ACK Error",
    desc: "The transmitter finds the ACK slot still recessive after transmission — no receiver acknowledged the frame.",
    cause: "No other nodes on bus, all receivers have errors, address mismatch.",
    effect: "Transmitter considers frame not received and will retransmit.",
  },
};

const STATES = [
  { name: "Error Active", tec: "0–127", rCount: "Normal operation. Node sends active error frames (6 dominant bits)." },
  { name: "Error Passive", tec: "128–255", rCount: "Node sends passive error frames (6 recessive bits). Less disruptive." },
  { name: "Bus-Off", tec: ">255", rCount: "Node disconnects from bus. Requires 128×11 recessive bits to re-enter." },
];

export default function ErrorDetectionSim({ onUsed }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [tec, setTec] = useState(0);
  const [injecting, setInjecting] = useState(false);
  const [errorFrameVisible, setErrorFrameVisible] = useState(false);
  const usedRef = useRef(false);

  const handleSelect = useCallback((key: string) => {
    if (!usedRef.current) {
      usedRef.current = true;
      onUsed();
    }
    setSelected(key);
  }, [onUsed]);

  const handleInject = () => {
    if (!selected) return;
    setInjecting(true);
    setErrorFrameVisible(false);
    setTimeout(() => {
      setErrorFrameVisible(true);
      setTec((t) => Math.min(t + 8, 270));
      setInjecting(false);
    }, 700);
    setTimeout(() => setErrorFrameVisible(false), 3000);
  };

  const errState =
    tec > 255 ? STATES[2] : tec >= 128 ? STATES[1] : STATES[0];
  const stateColor =
    tec > 255 ? "#EF4444" : tec >= 128 ? "#F59E0B" : "#10B981";

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
          CAN Error Detection
        </h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          Select an error type, then inject it to see how CAN handles it
        </p>

        {/* Error type buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(ERROR_TYPES).map(([key, e]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  selected === key
                    ? "rgba(239,68,68,0.18)"
                    : "rgba(255,255,255,0.05)",
                border: `1px solid ${
                  selected === key
                    ? "rgba(239,68,68,0.5)"
                    : "rgba(255,255,255,0.08)"
                }`,
                color:
                  selected === key ? COLOR : "rgba(240,240,245,0.5)",
                cursor: "pointer",
              }}
            >
              {e.name}
            </button>
          ))}
        </div>

        {/* Error explanation */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-4 mb-5"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.18)",
              }}
            >
              <div className="font-bold mb-2" style={{ color: COLOR }}>
                {ERROR_TYPES[selected].name}
              </div>
              <p className="text-sm mb-2" style={{ color: "rgba(240,240,245,0.7)" }}>
                {ERROR_TYPES[selected].desc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div
                  className="rounded-lg p-2"
                  style={{ background: "rgba(239,68,68,0.08)" }}
                >
                  <span style={{ color: "rgba(240,240,245,0.4)" }}>Cause: </span>
                  <span style={{ color: "rgba(240,240,245,0.7)" }}>
                    {ERROR_TYPES[selected].cause}
                  </span>
                </div>
                <div
                  className="rounded-lg p-2"
                  style={{ background: "rgba(239,68,68,0.08)" }}
                >
                  <span style={{ color: "rgba(240,240,245,0.4)" }}>Effect: </span>
                  <span style={{ color: "rgba(240,240,245,0.7)" }}>
                    {ERROR_TYPES[selected].effect}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error frame visualization */}
        <AnimatePresence>
          {errorFrameVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-4 mb-5"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(240,240,245,0.4)" }}>
                Error Frame on bus:
              </div>
              <div className="flex gap-1 flex-wrap">
                {/* 6 dominant error flag */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`dom-${i}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{
                      background: "rgba(239,68,68,0.2)",
                      border: "1px solid rgba(239,68,68,0.5)",
                      color: COLOR,
                    }}
                  >
                    0
                  </motion.div>
                ))}
                {/* 8 recessive error delimiter */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`rec-${i}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 + i * 0.07 }}
                    className="w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(240,240,245,0.45)",
                    }}
                  >
                    1
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <span style={{ color: COLOR }}>6× dominant = Error Flag</span>
                <span style={{ color: "rgba(240,240,245,0.35)" }}>8× recessive = Error Delimiter</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TEC counter and state */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="text-xs mb-2" style={{ color: "rgba(240,240,245,0.35)" }}>
              Transmit Error Counter (TEC)
            </div>
            <div className="flex items-end gap-2">
              <motion.span
                className="text-3xl font-black"
                style={{ color: stateColor }}
                key={tec}
                animate={{ scale: [1.2, 1] }}
                transition={{ duration: 0.2 }}
              >
                {tec}
              </motion.span>
              <span className="text-sm mb-1" style={{ color: "rgba(240,240,245,0.3)" }}>
                / 255
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: stateColor }}
                animate={{ width: `${Math.min((tec / 255) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {tec > 0 && (
              <button
                onClick={() => setTec(0)}
                className="mt-2 text-xs px-2 py-1 rounded"
                style={{
                  color: "rgba(240,240,245,0.35)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  cursor: "pointer",
                  background: "transparent",
                }}
              >
                Reset counter
              </button>
            )}
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: `${stateColor}10`,
              border: `1px solid ${stateColor}30`,
            }}
          >
            <div className="text-xs mb-2" style={{ color: "rgba(240,240,245,0.35)" }}>
              Error Confinement State
            </div>
            <div className="font-bold mb-1" style={{ color: stateColor }}>
              {errState.name}
            </div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
              TEC: {errState.tec}
            </div>
            <div className="text-xs mt-1" style={{ color: "rgba(240,240,245,0.4)" }}>
              {errState.rCount}
            </div>
          </div>
        </div>

        {/* State progression */}
        <div className="flex items-center gap-2 mb-5 text-xs">
          {STATES.map((s, i) => (
            <div key={s.name} className="flex items-center gap-2">
              <div
                className="px-2 py-1 rounded-lg font-semibold"
                style={{
                  background:
                    errState.name === s.name
                      ? i === 0 ? "rgba(16,185,129,0.15)" : i === 1 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)"
                      : "rgba(255,255,255,0.04)",
                  color:
                    errState.name === s.name
                      ? i === 0 ? "#10B981" : i === 1 ? "#F59E0B" : "#EF4444"
                      : "rgba(240,240,245,0.3)",
                  border: `1px solid ${
                    errState.name === s.name
                      ? i === 0 ? "rgba(16,185,129,0.3)" : i === 1 ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"
                      : "rgba(255,255,255,0.06)"
                  }`,
                }}
              >
                {s.name}
              </div>
              {i < STATES.length - 1 && (
                <span style={{ color: "rgba(240,240,245,0.2)" }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* Inject button */}
        <motion.button
          onClick={handleInject}
          disabled={!selected || injecting}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 rounded-xl font-bold text-sm"
          style={{
            background:
              !selected || injecting
                ? "rgba(239,68,68,0.08)"
                : `linear-gradient(135deg, ${COLOR}, #DC2626)`,
            color: !selected || injecting ? "rgba(239,68,68,0.3)" : "#fff",
            border: "none",
            cursor: !selected || injecting ? "not-allowed" : "pointer",
            boxShadow:
              !selected || injecting ? "none" : `0 4px 16px rgba(239,68,68,0.3)`,
          }}
        >
          {injecting ? "Injecting error..." : "Inject Error →"}
        </motion.button>
        {!selected && (
          <span className="ml-3 text-xs" style={{ color: "rgba(240,240,245,0.3)" }}>
            Select an error type first
          </span>
        )}
      </div>
    </motion.section>
  );
}
