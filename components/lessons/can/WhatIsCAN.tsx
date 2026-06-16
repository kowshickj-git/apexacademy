"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onRead: () => void; }

const COLOR = "#EF4444";

const ecus = [
  { label: "Engine ECU", x: 60, y: 100 },
  { label: "ABS", x: 210, y: 100 },
  { label: "Airbag", x: 360, y: 100 },
  { label: "Dashboard", x: 510, y: 100 },
];

export default function WhatIsCAN({ onRead }: Props) {
  const called = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        onRead();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRead]);

  return (
    <section className="pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-4"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: COLOR,
            }}
          >
            ◆ Lesson 26 · CAN Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: "#F0F0F5" }}>
            Controller Area Network
          </h1>
          <p className="text-lg" style={{ color: "rgba(240,240,245,0.55)" }}>
            The communication backbone of every modern vehicle and industrial system.
          </p>
        </div>

        {/* What is CAN */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <h2 className="text-xl font-bold mb-3" style={{ color: COLOR }}>
            CAN = Controller Area Network
          </h2>
          <p className="mb-4" style={{ color: "rgba(240,240,245,0.7)" }}>
            Developed by <strong style={{ color: "#F0F0F5" }}>Robert Bosch GmbH</strong> in{" "}
            <strong style={{ color: "#F0F0F5" }}>1986</strong> and standardized as{" "}
            <strong style={{ color: COLOR }}>ISO 11898</strong>, CAN is a robust, multi-master,
            message-based serial communication protocol designed for reliable data transfer
            without a host computer.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Year", value: "1986" },
              { label: "Standard", value: "ISO 11898" },
              { label: "Speed", value: "Up to 1 Mbps" },
              { label: "Wire", value: "2-wire diff." },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(239,68,68,0.08)" }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>
                  {item.label}
                </div>
                <div className="font-bold text-sm" style={{ color: COLOR }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nervous system analogy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-xl font-bold mb-3" style={{ color: "#F0F0F5" }}>
            🚗 The Nervous System of Modern Vehicles
          </h2>
          <p style={{ color: "rgba(240,240,245,0.7)" }}>
            A modern car contains{" "}
            <strong style={{ color: COLOR }}>70–100 Electronic Control Units (ECUs)</strong>{" "}
            — engine management, ABS, airbags, dashboard instruments, HVAC, windows, seats, and
            more. CAN lets them all communicate on a single shared bus without a central host,
            like a city road network where all vehicles share the same roads with agreed-upon
            traffic rules.
          </p>
        </motion.div>

        {/* Key Characteristics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "#F0F0F5" }}>
            Key Characteristics
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "Message-Based (Not Address-Based)",
                desc: "Each message carries an 11-bit identifier (ID). Any node can receive any message — nodes filter by ID.",
              },
              {
                title: "Dominant / Recessive Bits",
                desc: "Logic 0 = Dominant (CAN-H=3.5V, CAN-L=1.5V, differential=2V). Logic 1 = Recessive (both 2.5V, differential≈0V).",
              },
              {
                title: "Multi-Master Bus",
                desc: "Any node can initiate a transmission. Hardware arbitration resolves simultaneous transmissions non-destructively.",
              },
              {
                title: "Two-Wire Differential",
                desc: "CAN-H and CAN-L twisted pair. Differential signaling rejects common-mode noise — ideal for harsh automotive environments.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: COLOR }}
                />
                <div>
                  <div className="font-semibold text-sm mb-0.5" style={{ color: "#F0F0F5" }}>
                    {item.title}
                  </div>
                  <div className="text-sm" style={{ color: "rgba(240,240,245,0.55)" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ECU Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "#F0F0F5" }}>
            ECU Network Diagram
          </h2>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 600 220" width="100%" style={{ maxWidth: 600 }}>
              {/* CAN-H line */}
              <line x1="30" y1="140" x2="570" y2="140" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
              <text x="10" y="144" fill="#EF4444" fontSize="9" fontWeight="bold">H</text>
              {/* CAN-L line */}
              <line x1="30" y1="160" x2="570" y2="160" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
              <text x="10" y="164" fill="#3B82F6" fontSize="9" fontWeight="bold">L</text>
              {/* Termination resistors */}
              <rect x="25" y="133" width="6" height="34" rx="2" fill="#F59E0B" />
              <text x="4" y="175" fill="rgba(240,240,245,0.4)" fontSize="7">120Ω</text>
              <rect x="569" y="133" width="6" height="34" rx="2" fill="#F59E0B" />
              <text x="553" y="175" fill="rgba(240,240,245,0.4)" fontSize="7">120Ω</text>
              {/* ECU nodes */}
              {ecus.map((ecu, i) => (
                <g key={ecu.label}>
                  {/* Drop lines to bus */}
                  <line
                    x1={ecu.x + 40}
                    y1={ecu.y + 36}
                    x2={ecu.x + 40}
                    y2={140}
                    stroke="rgba(239,68,68,0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  {/* ECU box */}
                  <rect
                    x={ecu.x}
                    y={ecu.y}
                    width="80"
                    height="36"
                    rx="8"
                    fill="rgba(239,68,68,0.12)"
                    stroke="rgba(239,68,68,0.35)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={ecu.x + 40}
                    y={ecu.y + 22}
                    textAnchor="middle"
                    fill="#F0F0F5"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {ecu.label}
                  </text>
                  {/* Animated dot */}
                  <motion.circle
                    cx={ecu.x + 40}
                    cy={140}
                    r="4"
                    fill={COLOR}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                  />
                </g>
              ))}
              {/* Labels */}
              <text x="300" y="200" textAnchor="middle" fill="rgba(240,240,245,0.3)" fontSize="9">
                CAN-H (3.5V dominant) · CAN-L (1.5V dominant) · Both 2.5V recessive
              </text>
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
