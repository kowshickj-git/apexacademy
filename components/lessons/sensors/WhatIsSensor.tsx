"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onRead: () => void; }

const COLOR = "#0EA5E9";

const SENSES = [
  { human: "👁️", humanLabel: "Eye",   sensor: "📷", sensorLabel: "Camera / LDR",    desc: "Detects light intensity & color" },
  { human: "✋", humanLabel: "Skin",   sensor: "🔘", sensorLabel: "Touch Sensor",     desc: "Capacitive field detection" },
  { human: "👂", humanLabel: "Ear",    sensor: "🔊", sensorLabel: "Ultrasonic / Mic", desc: "Pressure waves, 40 kHz pulses" },
  { human: "👃", humanLabel: "Nose",   sensor: "💨", sensorLabel: "Gas Sensor",       desc: "Chemical concentration (ppm)" },
  { human: "👅", humanLabel: "Tongue", sensor: "🧪", sensorLabel: "pH Sensor",        desc: "Hydrogen ion concentration" },
];

export default function WhatIsSensor({ onRead }: Props) {
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
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 01 · Introduction
        </p>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#F0F0F5" }}>
          Sensors Fundamentals
        </h1>
        <p className="text-base max-w-2xl" style={{ color: "rgba(240,240,245,0.55)" }}>
          Without sensors, a robot is blind. Without sensors, a smart home is dumb. Sensors bridge the physical world and digital systems — they are the eyes, ears, and skin of every embedded system.
        </p>
      </motion.div>

      {/* What is a sensor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: "rgba(14,165,233,0.05)", borderColor: "rgba(14,165,233,0.15)" }}
      >
        <h2 className="text-xl font-bold mb-3" style={{ color: "#F0F0F5" }}>What is a Sensor?</h2>
        <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.65)" }}>
          A <span style={{ color: COLOR, fontWeight: 700 }}>sensor</span> is a{" "}
          <span style={{ color: COLOR, fontWeight: 700 }}>transducer</span> — a device that converts one form of energy or physical parameter into another.
          Sensors convert physical parameters (temperature, light, distance, motion, pressure) into electrical signals that a microcontroller can read and process.
        </p>
        <div className="flex items-center gap-4 p-4 rounded-xl flex-wrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-center">
            <div className="text-3xl mb-1">🌡️</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Physical World</div>
            <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.6)" }}>Temperature</div>
          </div>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl flex-shrink-0"
            style={{ color: COLOR }}
          >
            →
          </motion.div>
          <div className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)" }}>
            <div className="text-xs font-bold mb-0.5" style={{ color: COLOR }}>SENSOR</div>
            <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.4)" }}>LM35 / NTC</div>
          </div>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            className="text-2xl flex-shrink-0"
            style={{ color: COLOR }}
          >
            →
          </motion.div>
          <div className="text-center">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Electrical Signal</div>
            <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.6)" }}>250 mV @ 25°C</div>
          </div>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            className="text-2xl flex-shrink-0"
            style={{ color: COLOR }}
          >
            →
          </motion.div>
          <div className="text-center">
            <div className="text-3xl mb-1">🤖</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Microcontroller</div>
            <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.6)" }}>Arduino / ESP32</div>
          </div>
        </div>
      </motion.div>

      {/* Human vs Sensor analogy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl p-6 border"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <h2 className="text-xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Human Senses → Electronic Sensors</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          Every human sense has an electronic equivalent. This is what gives machines "awareness" of the physical world.
        </p>
        <div className="space-y-3">
          {SENSES.map((s, i) => (
            <motion.div
              key={s.humanLabel}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-2xl w-8 text-center">{s.human}</span>
              <div className="text-xs font-semibold w-14" style={{ color: "rgba(240,240,245,0.5)" }}>{s.humanLabel}</div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                style={{ color: COLOR }}
                className="text-sm font-bold"
              >
                →
              </motion.div>
              <span className="text-2xl w-8 text-center">{s.sensor}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold mb-0.5" style={{ color: COLOR }}>{s.sensorLabel}</div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.35)" }}>{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
