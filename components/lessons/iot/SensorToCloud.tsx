"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#6366F1";

interface Props {
  onUsed: () => void;
}

const steps = [
  { label: "DHT22 → ESP32", icon: "🌡️", desc: "Sensor reading captured", color: "#3b82f6" },
  { label: "ESP32 → WiFi Router", icon: "📡", desc: "Data packet transmitted", color: COLOR },
  { label: "Router → MQTT Broker :1883", icon: "☁️", desc: "Published to broker", color: "#818cf8" },
  { label: "Broker → Cloud Database", icon: "🗄️", desc: "Stored in time-series DB", color: "#10b981" },
  { label: "Cloud → Mobile App", icon: "📱", desc: "Pushed to dashboard", color: "#f59e0b" },
];

interface Reading {
  temp: number;
  humidity: number;
  ts: string;
}

export default function SensorToCloud({ onUsed }: Props) {
  const called = useRef(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [running, setRunning] = useState(false);
  const [currentReading, setCurrentReading] = useState({ temp: 23.5, humidity: 65.2 });

  const sendReading = () => {
    if (running) return;
    if (!called.current) {
      called.current = true;
      onUsed();
    }
    setRunning(true);
    const newTemp = +(20 + Math.random() * 10).toFixed(1);
    const newHumidity = +(55 + Math.random() * 25).toFixed(1);
    setCurrentReading({ temp: newTemp, humidity: newHumidity });

    steps.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i === steps.length - 1) {
          setReadings(prev => [
            { temp: newTemp, humidity: newHumidity, ts: new Date().toLocaleTimeString() },
            ...prev.slice(0, 5),
          ]);
          setTimeout(() => {
            setActiveStep(-1);
            setRunning(false);
          }, 600);
        }
      }, i * 400);
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          Sensor → Cloud Journey
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Watch your DHT22 temperature data travel from sensor to cloud in real time.
        </p>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Sensor Reading Display */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="rounded-xl p-4 flex-1 text-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: activeStep === 0 ? `1px solid #3b82f6` : "1px solid rgba(255,255,255,0.08)",
              boxShadow: activeStep === 0 ? "0 0 20px rgba(59,130,246,0.3)" : "none",
              transition: "all 0.3s",
            }}
          >
            <div className="text-2xl mb-1">🌡️</div>
            <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>DHT22 Sensor</div>
            <div className="text-xl font-black" style={{ color: "#3b82f6" }}>
              {currentReading.temp}°C
            </div>
            <div className="text-sm" style={{ color: "#06b6d4" }}>
              {currentReading.humidity}% RH
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs font-mono mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>MQTT Topic:</div>
            <div
              className="text-xs font-mono rounded p-2 mb-2"
              style={{ background: "rgba(0,0,0,0.4)", color: COLOR }}
            >
              sensors/esp32/temperature
            </div>
            <div className="text-xs font-mono mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Payload:</div>
            <div
              className="text-xs font-mono rounded p-2"
              style={{ background: "rgba(0,0,0,0.4)", color: "#10b981" }}
            >
              {`{"temp":${currentReading.temp},"humidity":${currentReading.humidity}}`}
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={sendReading}
          disabled={running}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all"
          style={{
            background: running ? "rgba(99,102,241,0.3)" : COLOR,
            color: "#fff",
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Sending..." : "📤 Send Reading"}
        </button>

        {/* Step Flow */}
        <div className="mt-5 space-y-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300"
              style={{
                background: activeStep === i ? `${step.color}20` : "rgba(255,255,255,0.02)",
                border: activeStep === i ? `1px solid ${step.color}` : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300"
                style={{
                  background: activeStep >= i ? `${step.color}40` : "rgba(255,255,255,0.06)",
                  boxShadow: activeStep === i ? `0 0 12px ${step.color}` : "none",
                }}
              >
                {activeStep > i ? "✓" : step.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: activeStep >= i ? "#fff" : "rgba(255,255,255,0.3)" }}>
                  Step {i + 1}: {step.label}
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {step.desc}
                </div>
              </div>
              <AnimatePresence>
                {activeStep === i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: step.color }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Cloud Graph */}
        {readings.length > 0 && (
          <div
            className="mt-5 rounded-xl p-4"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xs font-semibold mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
              ☁️ Cloud — Recent Readings
            </div>
            <div className="flex items-end gap-2 h-20">
              {readings.map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs font-bold" style={{ color: COLOR, fontSize: "10px" }}>
                    {r.temp}°
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${((r.temp - 15) / 25) * 60}px` }}
                    className="w-full rounded-t-sm"
                    style={{ background: COLOR, minHeight: "4px" }}
                  />
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px" }}>
                    {r.ts.split(":").slice(1).join(":")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
