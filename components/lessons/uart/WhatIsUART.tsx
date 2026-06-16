"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onRead: () => void; }

const COLOR = "#10B981";

const FEATURES = [
  { label: "Full Duplex", detail: "TX and RX operate independently and simultaneously" },
  { label: "Asynchronous", detail: "No shared clock line — both devices must agree on baud rate" },
  { label: "Point-to-Point", detail: "Typically connects exactly 2 devices" },
  { label: "Simple", detail: "Just 2 wires (TX and RX) for bidirectional communication" },
];

const USES = [
  "Arduino Serial Monitor (debug output)",
  "GPS modules — NEO-6M at 9600 baud",
  "GSM/LTE modules — SIM800L",
  "Bluetooth modules — HC-05 / HC-06",
  "ESP-01 WiFi module",
  "Debugging output to PC",
];

export default function WhatIsUART({ onRead }: Props) {
  const calledRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onRead();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRead]);

  return (
    <section className="pt-14 border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 01 · Introduction
        </p>
        <h1 className="text-4xl font-black mb-1" style={{ color: "#F0F0F5" }}>
          UART Fundamentals
        </h1>
        <p className="text-sm mb-8" style={{ color: "rgba(240,240,245,0.4)" }}>
          The oldest and simplest serial communication protocol — still everywhere in embedded systems.
        </p>
      </motion.div>

      {/* What is UART card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
        className="rounded-2xl border p-6 mb-6"
        style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
            🔌
          </div>
          <div>
            <h2 className="text-lg font-black" style={{ color: "#F0F0F5" }}>What is UART?</h2>
            <p className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Universal Asynchronous Receiver/Transmitter</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(240,240,245,0.65)" }}>
          UART is a hardware communication protocol that uses two dedicated wires — <span className="font-bold" style={{ color: COLOR }}>TX (transmit)</span> and{" "}
          <span className="font-bold" style={{ color: COLOR }}>RX (receive)</span> — to send serial data between two devices. Unlike SPI or I2C, UART requires no clock line; instead, both devices must be pre-configured with the same <strong style={{ color: COLOR }}>baud rate</strong> (bits per second).
        </p>
      </motion.div>

      {/* Key features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="text-base font-bold mb-3" style={{ color: "#F0F0F5" }}>Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3 p-4 rounded-xl border"
              style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" }}
            >
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
              <div>
                <div className="text-xs font-bold mb-0.5" style={{ color: COLOR }}>{f.label}</div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>{f.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Phone call analogy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
        className="rounded-2xl border p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="text-2xl mb-2">📞</div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#F0F0F5" }}>The Phone Call Analogy</p>
        <p className="text-sm" style={{ color: "rgba(240,240,245,0.55)" }}>
          "Like two people talking on phones: each can <span style={{ color: COLOR }}>speak (TX)</span> and <span style={{ color: COLOR }}>listen (RX)</span> at the same time, completely independently — that's full duplex. The phone company (baud rate agreement) ensures both sides understand the same 'language speed'."
        </p>
      </motion.div>

      {/* Animated TX/RX crossing diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        className="rounded-2xl border p-6 mb-6"
        style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.18)" }}
      >
        <h3 className="text-sm font-bold mb-4" style={{ color: "#F0F0F5" }}>TX/RX Wiring — The Wires CROSS!</h3>
        <div className="flex items-center justify-between gap-4">
          {/* Device A */}
          <div className="flex-1 rounded-xl border p-4 text-center" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)" }}>
            <div className="text-xs font-black mb-2" style={{ color: COLOR }}>MCU 1</div>
            <div className="space-y-2">
              <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(16,185,129,0.15)", color: COLOR }}>TX →</div>
              <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(16,185,129,0.15)", color: COLOR }}>← RX</div>
              <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,240,245,0.4)" }}>GND</div>
            </div>
          </div>

          {/* Crossing arrows */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="text-[10px] font-bold mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>CROSSED!</div>
            <svg width="60" height="50" viewBox="0 0 60 50" fill="none">
              {/* TX→RX line (top, crosses to bottom right) */}
              <motion.path
                d="M0 10 Q30 10 60 40"
                stroke={COLOR}
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 2"
                animate={{ strokeDashoffset: [12, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {/* RX←TX line (bottom, crosses to top right) */}
              <motion.path
                d="M0 40 Q30 40 60 10"
                stroke="#34D399"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 2"
                animate={{ strokeDashoffset: [0, 12] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {/* Cross point dot */}
              <circle cx="30" cy="25" r="3" fill="#FFD700" />
            </svg>
            <div className="text-[9px] text-center" style={{ color: "rgba(240,240,245,0.3)" }}>
              TX→RX<br/>RX←TX
            </div>
          </div>

          {/* Device B */}
          <div className="flex-1 rounded-xl border p-4 text-center" style={{ borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.07)" }}>
            <div className="text-xs font-black mb-2" style={{ color: "#34D399" }}>MCU 2</div>
            <div className="space-y-2">
              <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(52,211,153,0.15)", color: "#34D399" }}>← RX</div>
              <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(52,211,153,0.15)", color: "#34D399" }}>TX →</div>
              <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,240,245,0.4)" }}>GND</div>
            </div>
          </div>
        </div>
        <p className="text-xs mt-4 text-center" style={{ color: "rgba(240,240,245,0.4)" }}>
          MCU1.TX → MCU2.RX &nbsp;|&nbsp; MCU1.RX ← MCU2.TX &nbsp;|&nbsp; GND ↔ GND (always connect grounds!)
        </p>
      </motion.div>

      {/* Uses of UART */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
        className="rounded-2xl border p-5"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-sm font-bold mb-3" style={{ color: "#F0F0F5" }}>Where You'll See UART</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {USES.map((use, i) => (
            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <path d="M1 4l2 2 4-4" stroke={COLOR} strokeWidth="1.3" strokeLinecap="round" fill="none" />
              </svg>
              {use}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
