"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#0EA5E9";

const SPECS = [
  {
    title: "Range",
    icon: "↔️",
    def: "The minimum and maximum values a sensor can reliably measure.",
    example: "HC-SR04: 2 cm to 400 cm",
    detail: "Outside the range, readings become inaccurate or undefined. Always select a sensor whose range covers your operating conditions.",
    color: COLOR,
  },
  {
    title: "Resolution",
    icon: "🔬",
    def: "The smallest change in input that produces a detectable change in output.",
    example: "12-bit ADC over 3.3 V = 3300 mV / 4096 ≈ 0.8 mV resolution",
    detail: "Higher bit-depth ADC = finer resolution. Arduino Uno uses 10-bit ADC (1024 steps over 5V ≈ 4.9mV per step).",
    color: "#10B981",
  },
  {
    title: "Accuracy vs Precision",
    icon: "🎯",
    def: "Accuracy: how close to the true value. Precision: how repeatable the measurement is.",
    example: "DHT11: ±2°C accuracy, ±1°C precision",
    detail: "A cheap sensor may be precise (consistent readings) but inaccurate (offset from reality). Calibration improves accuracy.",
    color: "#F59E0B",
  },
  {
    title: "Sensitivity",
    icon: "📈",
    def: "Change in output per unit change in input.",
    example: "LM35 temperature sensor: 10 mV per °C",
    detail: "Higher sensitivity = larger output signal = easier to read with ADC. Low-sensitivity sensors may need amplification (op-amp).",
    color: "#8B5CF6",
  },
  {
    title: "Response Time",
    icon: "⚡",
    def: "How fast the sensor output settles after a change in input.",
    example: "HC-SR04: max 50ms measurement cycle; DHT11: 1 reading per second",
    detail: "Slow sensors miss fast-changing phenomena. A 1Hz humidity sensor can't detect rapid humidity bursts.",
    color: "#EF4444",
  },
  {
    title: "Sampling Rate",
    icon: "📊",
    def: "How often you read the sensor per second.",
    example: "Nyquist: sample at ≥ 2× the highest frequency of interest",
    detail: "Arduino ADC can sample at ~9,600 SPS (samples per second). For audio (20 kHz), you need ≥ 40 kSPS.",
    color: "#F97316",
  },
];

export default function SensorSpecs() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 03 · Specifications
        </p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Sensor Specifications</h2>
        <p className="text-sm mb-8 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          Understanding sensor specs is essential for choosing the right sensor and writing reliable code. These are the key parameters you&apos;ll see in every datasheet.
        </p>
      </motion.div>

      {/* Spec cards */}
      <div className="space-y-3 mb-10">
        {SPECS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <button
              className="w-full text-left rounded-2xl border p-4 transition-all"
              style={{
                background: open === i ? `${s.color}08` : "rgba(255,255,255,0.025)",
                borderColor: open === i ? `${s.color}35` : "rgba(255,255,255,0.07)",
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl w-8">{s.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm" style={{ color: open === i ? s.color : "#F0F0F5" }}>{s.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(240,240,245,0.45)" }}>{s.def}</div>
                </div>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "rgba(240,240,245,0.3)" }}
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              {open === i && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 pt-3 border-t" style={{ borderColor: `${s.color}20` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${s.color}15`, color: s.color }}>
                      Example: {s.example}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>{s.detail}</p>
                </motion.div>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Accuracy vs Precision visual */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border p-6 mb-8"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: "#F0F0F5" }}>Accuracy vs Precision — Bullseye Analogy</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Accurate & Precise", dots: [[50, 50], [52, 48], [49, 51]], good: true, desc: "Ideal sensor" },
            { label: "Precise, Not Accurate", dots: [[25, 25], [27, 23], [24, 26]], good: false, desc: "Consistent offset — fixable with calibration" },
            { label: "Accurate, Not Precise", dots: [[50, 50], [35, 65], [60, 40]], good: false, desc: "Noisy sensor — use averaging" },
            { label: "Neither", dots: [[20, 70], [75, 30], [40, 20]], good: false, desc: "Faulty or wrong sensor" },
          ].map(({ label, dots, good, desc }) => (
            <div key={label} className="text-center">
              <svg viewBox="0 0 100 100" className="w-full h-20 mb-2">
                {[40, 30, 20, 10].map((r, ri) => (
                  <circle key={r} cx="50" cy="50" r={r} fill="none" stroke={ri === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"} strokeWidth="1" />
                ))}
                <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.3)" />
                {dots.map(([x, y], di) => (
                  <circle key={di} cx={x} cy={y} r="4" fill={good ? "#10B981" : "#EF4444"} opacity="0.9" />
                ))}
              </svg>
              <div className="text-[10px] font-bold mb-0.5" style={{ color: good ? "#10B981" : "#EF4444" }}>{label}</div>
              <div className="text-[9px]" style={{ color: "rgba(240,240,245,0.35)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Calibration */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border p-6"
        style={{ background: "rgba(14,165,233,0.04)", borderColor: "rgba(14,165,233,0.15)" }}
      >
        <h3 className="text-base font-bold mb-2" style={{ color: "#F0F0F5" }}>Calibration Formula</h3>
        <p className="text-xs mb-4" style={{ color: "rgba(240,240,245,0.5)" }}>
          Two-point calibration maps a raw sensor reading to a real-world value using two known reference points:
        </p>
        <div className="p-4 rounded-xl font-mono text-xs mb-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "rgba(240,240,245,0.4)" }}>// Two-point calibration</div>
          <div style={{ color: "#F0F0F5" }}>
            output = (raw - raw_min) / (raw_max - raw_min)
          </div>
          <div style={{ color: "#F0F0F5" }}>
            {"         "}&times; (real_max - real_min) + real_min
          </div>
          <div className="mt-2" style={{ color: "rgba(240,240,245,0.4)" }}>// Example: LM35 at 0°C reads ADC=0, at 100°C reads ADC=205</div>
          <div style={{ color: COLOR }}>
            temp = (analogRead(A0) - 0) / (205 - 0) &times; (100 - 0) + 0
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
          <span style={{ color: "#F59E0B" }}>Noise reduction:</span>
          <span>Average 10–20 readings; use a median filter or Kalman filter for high-precision applications.</span>
        </div>
      </motion.div>
    </section>
  );
}
