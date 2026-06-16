"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onRead: () => void; }

const COLOR = "#8B5CF6";

export default function WhatIsComms({ onRead }: Props) {
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
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(139,92,246,0.6)" }}>
          Section 01 · Introduction
        </p>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#F0F0F5" }}>
          Communication Protocols Fundamentals
        </h1>
        <p className="text-base max-w-2xl" style={{ color: "rgba(240,240,245,0.55)" }}>
          Microcontrollers rarely work alone. Sensors, displays, memory chips, and other MCUs all need to exchange data.
          Communication protocols define exactly how that data transfer happens — the rules, timing, and format every device must follow.
        </p>
      </motion.div>

      {/* What is a Communication Protocol */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.18)" }}
      >
        <h2 className="text-xl font-bold mb-3" style={{ color: "#F0F0F5" }}>What is a Communication Protocol?</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.65)" }}>
          A <span style={{ color: COLOR, fontWeight: 700 }}>communication protocol</span> is an agreed set of rules that defines how data is exchanged between devices.
          It specifies voltage levels, timing, data frame structure, error detection, and the sequence of operations.
        </p>

        {/* Device A → Protocol → Device B diagram */}
        <div
          className="flex items-center justify-center gap-4 p-5 rounded-xl flex-wrap"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-center px-5 py-3 rounded-xl border" style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)" }}>
            <div className="text-2xl mb-1">🤖</div>
            <div className="text-xs font-bold" style={{ color: COLOR }}>Device A</div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: "rgba(240,240,245,0.35)" }}>Arduino</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ color: COLOR }}
              className="text-xl font-bold"
            >
              →
            </motion.div>
            <div
              className="px-3 py-1.5 rounded-lg text-center"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}
            >
              <div className="text-[10px] font-bold" style={{ color: COLOR }}>PROTOCOL</div>
              <div className="text-[9px] font-mono" style={{ color: "rgba(240,240,245,0.4)" }}>UART / I2C / SPI</div>
            </div>
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
              style={{ color: COLOR }}
              className="text-xl font-bold"
            >
              →
            </motion.div>
          </div>

          <div className="text-center px-5 py-3 rounded-xl border" style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)" }}>
            <div className="text-2xl mb-1">📟</div>
            <div className="text-xs font-bold" style={{ color: COLOR }}>Device B</div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: "rgba(240,240,245,0.35)" }}>Sensor / Display</div>
          </div>
        </div>
      </motion.div>

      {/* Language analogy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <h2 className="text-xl font-bold mb-3" style={{ color: "#F0F0F5" }}>The Language Analogy</h2>
        <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.6)" }}>
          Think of a protocol like a spoken language. An English speaker can&apos;t communicate with a French speaker without a shared language or interpreter.
          Similarly, two devices cannot exchange data without an agreed protocol — even if they&apos;re connected by the same wire.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🗣️", label: "Speaker A", sub: "English", color: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" },
            { icon: "📜", label: "Agreed Rules", sub: "Grammar + Vocabulary", color: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
            { icon: "👂", label: "Listener B", sub: "Must know English too", color: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 rounded-xl border"
              style={{ background: item.color, borderColor: item.border }}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm font-bold mb-1" style={{ color: "#F0F0F5" }}>{item.label}</div>
              <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why protocols exist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="rounded-2xl p-6 border"
        style={{ background: "rgba(139,92,246,0.04)", borderColor: "rgba(139,92,246,0.14)" }}
      >
        <h2 className="text-xl font-bold mb-3" style={{ color: "#F0F0F5" }}>Why Do We Need Protocols?</h2>
        <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.55)" }}>
          Different devices are made by different manufacturers with different hardware. Protocols solve three core problems:
        </p>
        <div className="space-y-3">
          {[
            { title: "Different Hardware", desc: "A 5V Arduino and a 3.3V sensor need rules about voltage levels and timing.", icon: "⚡" },
            { title: "Different Speeds", desc: "A fast MCU running at 80 MHz can't assume a slow sensor updates at the same rate.", icon: "⏱️" },
            { title: "Different Distances", desc: "A signal on a 1m cable behaves very differently from one on a 500m cable.", icon: "📏" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-bold mb-0.5" style={{ color: COLOR }}>{item.title}</div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
