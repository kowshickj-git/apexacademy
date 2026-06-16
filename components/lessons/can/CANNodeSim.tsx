"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#EF4444";

interface LogEntry {
  id: number;
  from: string;
  to: string;
  msgId: string;
  data: string;
  time: number;
}

const MSG_DEFS = [
  { from: "Engine ECU", to: "Dashboard",  msgId: "0x0CF00400", data: "RPM data" },
  { from: "Engine ECU", to: "ABS",        msgId: "0x18FF0100", data: "Throttle pos" },
  { from: "ABS",        to: "Dashboard",  msgId: "0x18FF0200", data: "Wheel speed" },
  { from: "ABS",        to: "Engine ECU", msgId: "0x18FF0201", data: "Brake pressure" },
  { from: "Dashboard",  to: "Engine ECU", msgId: "0x18FEF100", data: "Speed display" },
];

const NODE_COLORS: Record<string, string> = {
  "Engine ECU": "#EF4444",
  "ABS":        "#3B82F6",
  "Dashboard":  "#F59E0B",
};

export default function CANNodeSim({ onUsed }: Props) {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [activeMsg, setActiveMsg] = useState<number | null>(null);
  const usedRef = useRef(false);
  const counterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStart = useCallback(() => {
    if (!usedRef.current) {
      usedRef.current = true;
      onUsed();
    }
    setRunning((r) => {
      if (r) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return false;
      }
      return true;
    });
  }, [onUsed]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    let msgIdx = 0;
    intervalRef.current = setInterval(() => {
      const def = MSG_DEFS[msgIdx % MSG_DEFS.length];
      const entry: LogEntry = {
        id: counterRef.current++,
        from: def.from,
        to: def.to,
        msgId: def.msgId,
        data: def.data,
        time: Date.now(),
      };
      setLog((prev) => [entry, ...prev].slice(0, 8));
      setActiveMsg(entry.id);
      setTimeout(() => setActiveMsg(null), 500);
      msgIdx++;
    }, 900);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const nodes = ["Engine ECU", "Dashboard", "ABS"];
  const nodePositions: Record<string, { x: number; y: number }> = {
    "Engine ECU": { x: 80,  y: 60 },
    "Dashboard":  { x: 280, y: 60 },
    "ABS":        { x: 180, y: 160 },
  };

  const lastMsg = log[0];

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
          CAN Node Simulation
        </h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          Watch ECUs exchange messages on a shared CAN bus
        </p>

        {/* Network diagram */}
        <div className="relative mb-5">
          <svg viewBox="0 0 380 240" width="100%" style={{ maxWidth: 380, display: "block", margin: "0 auto" }}>
            {/* Bus line */}
            <line x1="40" y1="120" x2="340" y2="120" stroke="rgba(239,68,68,0.4)" strokeWidth="2.5" strokeLinecap="round" />
            <text x="190" y="116" textAnchor="middle" fill="rgba(240,240,245,0.25)" fontSize="8">CAN Bus (shared medium)</text>

            {/* Stubs to bus */}
            {nodes.map((n) => {
              const pos = nodePositions[n];
              return (
                <line
                  key={n}
                  x1={pos.x + 40}
                  y1={pos.y + 30}
                  x2={pos.x + 40}
                  y2={120}
                  stroke={`${NODE_COLORS[n]}60`}
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                />
              );
            })}

            {/* Active message arrow */}
            <AnimatePresence>
              {lastMsg && activeMsg === lastMsg.id && (
                <motion.line
                  key={lastMsg.id}
                  x1={nodePositions[lastMsg.from].x + 40}
                  y1={nodePositions[lastMsg.from].y + 15}
                  x2={nodePositions[lastMsg.to].x + 40}
                  y2={nodePositions[lastMsg.to].y + 15}
                  stroke={COLOR}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>

            {/* Animated packet on bus */}
            <AnimatePresence>
              {activeMsg !== null && (
                <motion.rect
                  key={`pkt-${activeMsg}`}
                  x={0}
                  y={115}
                  width={18}
                  height={10}
                  rx={3}
                  fill={COLOR}
                  initial={{ x: 40 }}
                  animate={{ x: 320 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "linear" }}
                />
              )}
            </AnimatePresence>

            {/* Node boxes */}
            {nodes.map((n) => {
              const pos = nodePositions[n];
              const isActive = lastMsg && activeMsg === lastMsg.id &&
                (lastMsg.from === n || lastMsg.to === n);
              return (
                <g key={n}>
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={80}
                    height={40}
                    rx={8}
                    fill={isActive ? `${NODE_COLORS[n]}25` : `${NODE_COLORS[n]}10`}
                    stroke={isActive ? NODE_COLORS[n] : `${NODE_COLORS[n]}40`}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <text
                    x={pos.x + 40}
                    y={pos.y + 24}
                    textAnchor="middle"
                    fill={isActive ? "#F0F0F5" : "rgba(240,240,245,0.55)"}
                    fontSize="9"
                    fontWeight={isActive ? "bold" : "normal"}
                  >
                    {n}
                  </text>
                </g>
              );
            })}

            {/* Termination */}
            <rect x="34" y="113" width="6" height="14" rx="1.5" fill="#F59E0B" />
            <rect x="340" y="113" width="6" height="14" rx="1.5" fill="#F59E0B" />
            <text x="20" y="138" fill="rgba(240,240,245,0.3)" fontSize="7">120Ω</text>
            <text x="330" y="138" fill="rgba(240,240,245,0.3)" fontSize="7">120Ω</text>
          </svg>
        </div>

        {/* Start/Stop button */}
        <div className="flex items-center gap-3 mb-5">
          <motion.button
            onClick={handleStart}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 rounded-xl font-bold text-sm"
            style={{
              background: running
                ? "rgba(239,68,68,0.12)"
                : `linear-gradient(135deg, ${COLOR}, #DC2626)`,
              color: running ? COLOR : "#fff",
              border: `1px solid ${running ? "rgba(239,68,68,0.3)" : "transparent"}`,
              cursor: "pointer",
              boxShadow: running ? "none" : `0 4px 16px rgba(239,68,68,0.3)`,
            }}
          >
            {running ? "⏸ Stop Simulation" : "▶ Start Simulation"}
          </motion.button>
          {running && (
            <motion.div
              className="flex items-center gap-1.5 text-xs"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ color: COLOR }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: COLOR }} />
              Broadcasting...
            </motion.div>
          )}
        </div>

        {/* Message log */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="px-4 py-2 text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(240,240,245,0.4)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Message Log
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {log.length === 0 ? (
              <div
                className="px-4 py-4 text-sm text-center"
                style={{ color: "rgba(240,240,245,0.25)" }}
              >
                Start simulation to see messages
              </div>
            ) : (
              log.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-4 py-2 flex items-center gap-3 text-xs"
                  style={{
                    background:
                      entry.id === activeMsg
                        ? "rgba(239,68,68,0.07)"
                        : "transparent",
                  }}
                >
                  <span
                    className="font-mono px-1.5 py-0.5 rounded text-xs"
                    style={{
                      background: `${NODE_COLORS[entry.from]}20`,
                      color: NODE_COLORS[entry.from],
                    }}
                  >
                    {entry.from}
                  </span>
                  <span style={{ color: "rgba(240,240,245,0.3)" }}>→</span>
                  <span
                    className="font-mono px-1.5 py-0.5 rounded text-xs"
                    style={{
                      background: `${NODE_COLORS[entry.to]}20`,
                      color: NODE_COLORS[entry.to],
                    }}
                  >
                    {entry.to}
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: "rgba(240,240,245,0.5)" }}
                  >
                    {entry.msgId}
                  </span>
                  <span style={{ color: "rgba(240,240,245,0.35)" }}>
                    {entry.data}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
