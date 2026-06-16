"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#EF4444";

const nodes = [
  { id: "engine",    label: "Engine ECU",        x: 60,  messages: ["0x0CF00400 RPM=3200", "0x18FF0100 Throttle=45%"] },
  { id: "abs",       label: "ABS",               x: 170, messages: ["0x18FF0200 WheelSpeed=85km/h", "0x18FF0201 BrakePressure=30%"] },
  { id: "airbag",    label: "Airbag",            x: 280, messages: ["0x18FF0300 ImpactSensor=0G", "0x18FF0301 Status=Active"] },
  { id: "dash",      label: "Dashboard",         x: 390, messages: ["0x18FEF100 Speed=85km/h", "0x18FF0400 FuelLevel=65%"] },
  { id: "bms",       label: "BMS",               x: 500, messages: ["0x18FF0700 BattVolt=48.2V", "0x18FF0701 SoC=72%"] },
  { id: "motor",     label: "Motor Ctrl",        x: 610, messages: ["0x18FF0500 MotorRPM=3800", "0x18FF0501 Torque=180Nm"] },
];

interface Packet {
  id: number;
  from: number;
  startX: number;
}

export default function CANBusViz() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [nextId, setNextId] = useState(0);

  const handleNodeClick = (nodeId: string, x: number) => {
    setSelectedNode((prev) => (prev === nodeId ? null : nodeId));
    const newPkt: Packet = { id: nextId, from: x, startX: x };
    setNextId((n) => n + 1);
    setPackets((prev) => [...prev.slice(-5), newPkt]);
    setTimeout(() => {
      setPackets((prev) => prev.filter((p) => p.id !== newPkt.id));
    }, 2500);
  };

  const selected = nodes.find((n) => n.id === selectedNode);

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
          CAN Bus Visualization
        </h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.45)" }}>
          Click any node to send a message on the bus
        </p>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 720 280" width="100%" style={{ minWidth: 600 }}>
            {/* CAN-H bus line */}
            <line x1="20" y1="140" x2="700" y2="140" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            <text x="2" y="144" fill="#EF4444" fontSize="10" fontWeight="bold">H</text>
            {/* CAN-L bus line */}
            <line x1="20" y1="165" x2="700" y2="165" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            <text x="2" y="169" fill="#3B82F6" fontSize="10" fontWeight="bold">L</text>

            {/* Labels */}
            <text x="360" y="186" textAnchor="middle" fill="rgba(240,240,245,0.25)" fontSize="8">
              CAN-H (Red) · CAN-L (Blue) · Differential Pair
            </text>

            {/* Termination resistors */}
            <rect x="15" y="132" width="8" height="40" rx="2" fill="#F59E0B" />
            <text x="4" y="182" fill="rgba(240,240,245,0.35)" fontSize="7">120Ω</text>
            <rect x="697" y="132" width="8" height="40" rx="2" fill="#F59E0B" />
            <text x="686" y="182" fill="rgba(240,240,245,0.35)" fontSize="7">120Ω</text>

            {/* Animated data packets */}
            {packets.map((pkt) => (
              <motion.rect
                key={pkt.id}
                x={0}
                y={136}
                width={20}
                height={10}
                rx={3}
                fill={COLOR}
                opacity={0.85}
                initial={{ x: pkt.startX }}
                animate={{ x: 700 }}
                transition={{ duration: 2, ease: "linear" }}
              />
            ))}

            {/* Nodes */}
            {nodes.map((node) => (
              <g key={node.id} onClick={() => handleNodeClick(node.id, node.x)}>
                {/* Drop stubs */}
                <line
                  x1={node.x}
                  y1={115}
                  x2={node.x}
                  y2={140}
                  stroke={selectedNode === node.id ? COLOR : "rgba(239,68,68,0.3)"}
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
                <line
                  x1={node.x}
                  y1={140}
                  x2={node.x}
                  y2={165}
                  stroke={selectedNode === node.id ? COLOR : "rgba(239,68,68,0.3)"}
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
                {/* Node box */}
                <rect
                  x={node.x - 40}
                  y={70}
                  width={80}
                  height={45}
                  rx={9}
                  fill={
                    selectedNode === node.id
                      ? "rgba(239,68,68,0.22)"
                      : "rgba(239,68,68,0.08)"
                  }
                  stroke={
                    selectedNode === node.id
                      ? "rgba(239,68,68,0.7)"
                      : "rgba(239,68,68,0.25)"
                  }
                  strokeWidth={selectedNode === node.id ? 2 : 1.5}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={node.x}
                  y={97}
                  textAnchor="middle"
                  fill={selectedNode === node.id ? "#F0F0F5" : "rgba(240,240,245,0.6)"}
                  fontSize="8.5"
                  fontWeight={selectedNode === node.id ? "bold" : "normal"}
                  style={{ cursor: "pointer" }}
                >
                  {node.label}
                </text>
                {/* Pulse dot on bus */}
                <motion.circle
                  cx={node.x}
                  cy={152}
                  r={selectedNode === node.id ? 5 : 3}
                  fill={selectedNode === node.id ? COLOR : "rgba(239,68,68,0.4)"}
                  animate={
                    selectedNode === node.id
                      ? { opacity: [1, 0.5, 1] }
                      : { opacity: [0.3, 0.7, 0.3] }
                  }
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Message display */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-xl p-4"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <div className="font-bold text-sm mb-2" style={{ color: COLOR }}>
                {selected.label} — Messages:
              </div>
              <div className="space-y-1.5">
                {selected.messages.map((msg) => (
                  <div
                    key={msg}
                    className="font-mono text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "rgba(240,240,245,0.8)" }}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-sm"
              style={{ color: "rgba(240,240,245,0.3)" }}
            >
              Click a node to see its CAN messages
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
