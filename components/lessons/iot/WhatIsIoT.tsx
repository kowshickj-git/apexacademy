"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#6366F1";

interface Props {
  onRead: () => void;
}

const flowSteps = [
  { label: "Sensor", icon: "🌡️", desc: "Collects data" },
  { label: "MCU", icon: "⚙️", desc: "Processes data" },
  { label: "Internet", icon: "🌐", desc: "Transmits data" },
  { label: "Cloud", icon: "☁️", desc: "Stores & analyses" },
  { label: "Mobile App", icon: "📱", desc: "Displays to user" },
];

const layers = [
  {
    num: "4",
    name: "Application Layer",
    desc: "Apps, dashboards, alerts, automation",
    color: "#818cf8",
  },
  {
    num: "3",
    name: "Processing Layer",
    desc: "Cloud computing, edge computing, AI",
    color: "#6366F1",
  },
  {
    num: "2",
    name: "Network Layer",
    desc: "WiFi, BLE, Zigbee, LoRa, NB-IoT",
    color: "#4f46e5",
  },
  {
    num: "1",
    name: "Perception Layer",
    desc: "Sensors, actuators, physical devices",
    color: "#3730a3",
  },
];

export default function WhatIsIoT({ onRead }: Props) {
  const called = useRef(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    const timer = setTimeout(() => {
      onRead();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRead]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s + 1) % flowSteps.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
      style={{ paddingTop: "3.5rem" }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
            style={{ background: `rgba(99,102,241,0.2)`, color: COLOR }}
          >
            Lesson 28
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>Internet of Things</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#fff" }}>
          IoT{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${COLOR}, #818cf8)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fundamentals
          </span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
          The Internet of Things connects the physical and digital worlds. Any device with a sensor,
          processor, and internet connection is an IoT device — from a smart thermostat to an
          industrial turbine.
        </p>
      </div>

      {/* Key Quote */}
      <div
        className="rounded-xl p-4 border-l-4"
        style={{
          background: `rgba(99,102,241,0.08)`,
          borderLeftColor: COLOR,
          border: `1px solid rgba(99,102,241,0.2)`,
          borderLeft: `4px solid ${COLOR}`,
        }}
      >
        <p className="text-base italic" style={{ color: "rgba(255,255,255,0.85)" }}>
          "If a device has a{" "}
          <strong style={{ color: COLOR }}>sensor</strong>, a{" "}
          <strong style={{ color: COLOR }}>processor</strong>, and an{" "}
          <strong style={{ color: COLOR }}>internet connection</strong> — it&apos;s an IoT device."
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-4 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-3xl font-black mb-1" style={{ color: COLOR }}>15B+</div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Connected devices (2023)</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-4 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-3xl font-black mb-1" style={{ color: "#818cf8" }}>30B+</div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Projected by 2030</div>
        </motion.div>
      </div>

      {/* Animated Data Flow */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
          IoT DATA FLOW
        </h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 flex-shrink-0">
              <div
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300"
                style={{
                  background: activeStep === i ? `rgba(99,102,241,0.2)` : "rgba(255,255,255,0.04)",
                  border: activeStep === i ? `1px solid ${COLOR}` : "1px solid rgba(255,255,255,0.06)",
                  transform: activeStep === i ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="text-xl">{step.icon}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: activeStep === i ? "#fff" : "rgba(255,255,255,0.5)" }}
                >
                  {step.label}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>
                  {step.desc}
                </span>
              </div>
              {i < flowSteps.length - 1 && (
                <div
                  className="text-lg transition-all duration-300"
                  style={{ color: activeStep === i ? COLOR : "rgba(255,255,255,0.15)" }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* IoT Architecture 4 Layers */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: "#fff" }}>
          IoT Architecture: 4 Layers
        </h3>
        <div className="space-y-2">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg p-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: layer.color, color: "#fff" }}
              >
                {layer.num}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#fff" }}>
                  {layer.name}
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {layer.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-world Examples */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: "#fff" }}>
          Real-World Examples
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: "🏠", name: "Smart Thermostat", desc: "Learns your schedule, saves 15% energy" },
            { icon: "🔒", name: "Smart Lock", desc: "Remote access, activity logs, auto-lock" },
            { icon: "🌾", name: "Agricultural Monitor", desc: "Soil moisture, weather, auto-irrigation" },
          ].map(ex => (
            <div
              key={ex.name}
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-2xl mb-2">{ex.icon}</div>
              <div className="text-sm font-semibold mb-1" style={{ color: "#fff" }}>
                {ex.name}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                {ex.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
