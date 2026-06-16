"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onRead: () => void; }

const COLOR = "#F59E0B";

const USE_CASES = [
  { icon: "🏭", label: "Factory Automation", desc: "PLCs, motor drives, HMIs on one bus" },
  { icon: "☀️", label: "Solar Inverters", desc: "Modbus monitoring up to 100 inverters" },
  { icon: "🏢", label: "Building Systems", desc: "HVAC, lighting, BMS controllers" },
  { icon: "⚡", label: "EV Charging", desc: "IEC 61851 compliant charging stations" },
  { icon: "🚰", label: "Water & Flow", desc: "SCADA systems, flow meter networks" },
  { icon: "🔋", label: "Battery Systems", desc: "BMS multi-cell monitoring & balancing" },
];

export default function WhatIsRS485({ onRead }: Props) {
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    const timer = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        onRead();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRead]);

  return (
    <section className="pt-20 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 01 · Introduction
        </p>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#F0F0F5" }}>
          RS485 Fundamentals
        </h1>
        <p className="text-base max-w-2xl" style={{ color: "rgba(240,240,245,0.55)" }}>
          RS485 (TIA-485-A) is the workhorse of industrial communication. While UART fails at 15 meters,
          RS485 carries data reliably for 1200 meters across noisy factory floors, solar plants, and SCADA systems.
        </p>
      </motion.div>

      {/* What is RS485 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.15)" }}
      >
        <h2 className="text-xl font-bold mb-3" style={{ color: "#F0F0F5" }}>What is RS485?</h2>
        <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.65)" }}>
          <span style={{ color: COLOR, fontWeight: 700 }}>RS485 (TIA-485-A)</span> is an electrical characteristics
          standard — not a protocol — that defines how bits are physically transmitted over a balanced differential
          pair. It was originally defined by the EIA (now TIA), hence &ldquo;RS&rdquo; (Recommended Standard).
        </p>

        {/* Key specs panel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Max Distance", value: "1200m", sub: "at 100 kbps" },
            { label: "Max Speed", value: "~10 Mbps", sub: "short distances" },
            { label: "Max Devices", value: "32", sub: "unit loads" },
            { label: "Wire Mode", value: "Half-duplex", sub: "2-wire typical" },
          ].map(item => (
            <div
              key={item.label}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <div className="text-lg font-black mb-0.5" style={{ color: COLOR }}>{item.value}</div>
              <div className="text-[10px] font-bold mb-0.5" style={{ color: "#F0F0F5" }}>{item.label}</div>
              <div className="text-[9px]" style={{ color: "rgba(240,240,245,0.4)" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Problem → Solution */}
        <div className="flex items-start gap-4 p-4 rounded-xl flex-wrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex-1 min-w-[140px]">
            <div className="text-xs font-bold mb-1" style={{ color: "#EF4444" }}>Problem: UART</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
              Single-ended signal degrades with distance. Noise corrupts data past ~15m. Only 1 device per line.
            </div>
          </div>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl font-bold flex-shrink-0 self-center"
            style={{ color: COLOR }}
          >
            →
          </motion.div>
          <div className="flex-1 min-w-[140px]">
            <div className="text-xs font-bold mb-1" style={{ color: COLOR }}>Solution: RS485</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
              Differential pair rejects common-mode noise. 1200m range. Up to 32 devices on one bus.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analogy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="rounded-2xl p-5 mb-6 border"
        style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎧</span>
          <h3 className="text-base font-bold" style={{ color: "#F0F0F5" }}>Analogy: Noise-Canceling Headphones for Data</h3>
        </div>
        <p className="text-sm" style={{ color: "rgba(240,240,245,0.55)" }}>
          Just like noise-canceling headphones subtract ambient noise from your audio,
          RS485 receivers subtract common-mode noise from the differential signal.
          Any noise that couples equally onto both wires is mathematically eliminated —
          leaving only the clean data signal.
        </p>
      </motion.div>

      {/* Use cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl p-6 border"
        style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <h2 className="text-base font-bold mb-4" style={{ color: "#F0F0F5" }}>Where RS485 is Used</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl p-3"
              style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)" }}
            >
              <div className="text-xl mb-1">{uc.icon}</div>
              <div className="text-xs font-bold mb-0.5" style={{ color: COLOR }}>{uc.label}</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.45)" }}>{uc.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
