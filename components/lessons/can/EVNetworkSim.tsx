"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#EF4444";

interface EVNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

const EV_NODES: EVNode[] = [
  { id: "bms",     label: "BMS",              x: 50,  y: 80,  color: "#10B981" },
  { id: "motor",   label: "Motor Ctrl",       x: 220, y: 30,  color: "#EF4444" },
  { id: "charger", label: "Charger",          x: 390, y: 80,  color: "#F59E0B" },
  { id: "dash",    label: "Dashboard",        x: 220, y: 200, color: "#3B82F6" },
  { id: "hvac",    label: "HVAC",             x: 390, y: 200, color: "#8B5CF6" },
];

interface Message {
  from: string;
  to: string;
  text: string;
  id: string;
}

function getMessages(soc: number, rpm: number, current: number): Message[] {
  return [
    { from: "bms",     to: "dash",    text: `SoC: ${soc}%`,              id: "0x18FF0701" },
    { from: "bms",     to: "motor",   text: `MaxCurrent: ${Math.round(soc * 2)}A`, id: "0x18FF0702" },
    { from: "bms",     to: "charger", text: `ChgLimit: ${Math.round((100-soc)*0.5+10)}A`, id: "0x18FF0703" },
    { from: "motor",   to: "dash",    text: `RPM: ${rpm}`,               id: "0x18FF0501" },
    { from: "motor",   to: "bms",     text: `DrawCurrent: ${Math.round(rpm/50)}A`, id: "0x18FF0502" },
    { from: "charger", to: "bms",     text: `InCurrent: ${current}A`,   id: "0x18FF0601" },
    { from: "hvac",    to: "bms",     text: `HVACDraw: 3.2kW`,           id: "0x18FF0801" },
    { from: "dash",    to: "motor",   text: `ThrottleReq: ${Math.round(rpm/80)}%`, id: "0x18FF0401" },
  ];
}

export default function EVNetworkSim({ onUsed }: Props) {
  const [soc, setSoc] = useState(72);
  const [rpm, setRpm] = useState(3200);
  const [current, setCurrent] = useState(18);
  const [activeMsg, setActiveMsg] = useState<number | null>(null);
  const usedRef = useRef(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((setter: (v: number) => void, value: number) => {
    setter(value);
    if (!usedRef.current) {
      usedRef.current = true;
      onUsed();
    }
    if (animRef.current) clearTimeout(animRef.current);
    setActiveMsg(Math.floor(Math.random() * 8));
    animRef.current = setTimeout(() => setActiveMsg(null), 800);
  }, [onUsed]);

  const messages = getMessages(soc, rpm, current);
  const nodeMap = Object.fromEntries(EV_NODES.map((n) => [n.id, n]));

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
          EV CAN Network Simulator
        </h2>
        <p className="text-sm mb-2" style={{ color: "rgba(240,240,245,0.45)" }}>
          Adjust EV parameters to see CAN messages flow between nodes
        </p>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs mb-5"
          style={{ background: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.7)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          High Speed CAN: 500 kbps / 1 Mbps for powertrain
        </div>

        {/* Network diagram */}
        <div className="mb-5">
          <svg viewBox="0 0 480 260" width="100%" style={{ maxWidth: 480, display: "block", margin: "0 auto" }}>
            {/* Bus line */}
            <line x1="30" y1="140" x2="450" y2="140" stroke="rgba(239,68,68,0.35)" strokeWidth="2.5" strokeLinecap="round" />
            <text x="240" y="134" textAnchor="middle" fill="rgba(240,240,245,0.2)" fontSize="8">
              CAN Bus (500 kbps)
            </text>

            {/* Termination */}
            <rect x="24" y="133" width="6" height="14" rx="1.5" fill="#F59E0B" />
            <rect x="450" y="133" width="6" height="14" rx="1.5" fill="#F59E0B" />

            {/* Active message arrow */}
            <AnimatePresence>
              {activeMsg !== null && activeMsg < messages.length && (
                <motion.g key={`arrow-${activeMsg}`}>
                  <motion.line
                    x1={nodeMap[messages[activeMsg].from].x + 40}
                    y1={nodeMap[messages[activeMsg].from].y + 20}
                    x2={nodeMap[messages[activeMsg].to].x + 40}
                    y2={nodeMap[messages[activeMsg].to].y + 20}
                    stroke={COLOR}
                    strokeWidth="1.8"
                    strokeDasharray="5,3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.8 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Stubs and nodes */}
            {EV_NODES.map((node) => {
              const isActive =
                activeMsg !== null &&
                activeMsg < messages.length &&
                (messages[activeMsg].from === node.id || messages[activeMsg].to === node.id);
              return (
                <g key={node.id}>
                  <line
                    x1={node.x + 40}
                    y1={node.y + 40}
                    x2={node.x + 40}
                    y2={140}
                    stroke={`${node.color}50`}
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />
                  <rect
                    x={node.x}
                    y={node.y}
                    width={80}
                    height={40}
                    rx={9}
                    fill={isActive ? `${node.color}22` : `${node.color}0d`}
                    stroke={isActive ? node.color : `${node.color}45`}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <text
                    x={node.x + 40}
                    y={node.y + 24}
                    textAnchor="middle"
                    fill={isActive ? "#F0F0F5" : "rgba(240,240,245,0.5)"}
                    fontSize="9"
                    fontWeight={isActive ? "bold" : "normal"}
                  >
                    {node.label}
                  </text>
                  {isActive && (
                    <motion.circle
                      cx={node.x + 40}
                      cy={140}
                      r={5}
                      fill={node.color}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Battery SoC", value: soc, min: 0, max: 100, unit: "%", color: "#10B981", set: (v: number) => handleChange(setSoc, v) },
            { label: "Motor RPM",   value: rpm, min: 0, max: 8000, unit: "RPM", color: COLOR, set: (v: number) => handleChange(setRpm, v) },
            { label: "Charging Current", value: current, min: 0, max: 50, unit: "A", color: "#F59E0B", set: (v: number) => handleChange(setCurrent, v) },
          ].map((ctrl) => (
            <div key={ctrl.label}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "rgba(240,240,245,0.5)" }}>{ctrl.label}</span>
                <span className="font-bold font-mono" style={{ color: ctrl.color }}>
                  {ctrl.value} {ctrl.unit}
                </span>
              </div>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                value={ctrl.value}
                onChange={(e) => ctrl.set(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: ctrl.color }}
              />
            </div>
          ))}
        </div>

        {/* Message list */}
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
            CAN Messages
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {messages.map((msg, i) => {
              const fromNode = nodeMap[msg.from];
              const isActive = activeMsg === i;
              return (
                <div
                  key={i}
                  className="px-4 py-2 flex items-center gap-3 text-xs transition-colors"
                  style={{
                    background: isActive ? "rgba(239,68,68,0.07)" : "transparent",
                  }}
                >
                  <span
                    className="font-mono text-xs px-1.5 py-0.5 rounded"
                    style={{ background: `${fromNode.color}20`, color: fromNode.color }}
                  >
                    {fromNode.label}
                  </span>
                  <span style={{ color: "rgba(240,240,245,0.3)" }}>→</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "rgba(240,240,245,0.5)" }}
                  >
                    {msg.id}
                  </span>
                  <span style={{ color: "rgba(240,240,245,0.6)", flex: 1 }}>
                    {msg.text}
                  </span>
                  {isActive && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: COLOR }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.4, repeat: 2 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
