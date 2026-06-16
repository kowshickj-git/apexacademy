"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#6366F1";

interface Props {
  onUsed: () => void;
}

interface Decision {
  type: "warning" | "danger" | "success";
  message: string;
  topic: string;
  payload: string;
}

function getDecisions(moisture: number, temperature: number): Decision[] {
  const decisions: Decision[] = [];

  if (moisture < 30) {
    decisions.push({
      type: "warning",
      message: "💧 Activating Irrigation Pump!",
      topic: "farm/pump",
      payload: `{"state":"ON","reason":"soil_dry"}`,
    });
  } else if (moisture > 70) {
    decisions.push({
      type: "success",
      message: "✅ Soil saturated — Pump OFF",
      topic: "farm/pump",
      payload: `{"state":"OFF","reason":"saturated"}`,
    });
  } else {
    decisions.push({
      type: "success",
      message: "✅ Soil moisture normal",
      topic: "farm/pump",
      payload: `{"state":"OFF","reason":"optimal"}`,
    });
  }

  if (temperature > 35) {
    decisions.push({
      type: "danger",
      message: "☀️ Activating Shade Nets",
      topic: "farm/shade",
      payload: `{"state":"ON","reason":"heat"}`,
    });
  } else if (temperature < 5) {
    decisions.push({
      type: "danger",
      message: "❄️ Frost Alert! Activating heaters",
      topic: "farm/heater",
      payload: `{"state":"ON","reason":"frost"}`,
    });
  } else {
    decisions.push({
      type: "success",
      message: "✅ Temperature in optimal range",
      topic: "farm/shade",
      payload: `{"state":"OFF","reason":"optimal"}`,
    });
  }

  return decisions;
}

export default function SmartFarmSim({ onUsed }: Props) {
  const called = useRef(false);
  const [moisture, setMoisture] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [showWater, setShowWater] = useState(false);

  const markUsed = () => {
    if (!called.current) {
      called.current = true;
      onUsed();
    }
  };

  const decisions = getDecisions(moisture, temperature);
  const isPumping = moisture < 30;

  useEffect(() => {
    setShowWater(isPumping);
  }, [isPumping]);

  const handleMoisture = (val: number) => {
    markUsed();
    setMoisture(val);
  };

  const handleTemp = (val: number) => {
    markUsed();
    setTemperature(val);
  };

  const typeColors: Record<Decision["type"], { bg: string; border: string; text: string }> = {
    warning: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", text: "#fbbf24" },
    danger: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", text: "#ef4444" },
    success: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#10b981" },
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
          Smart Farm Simulator
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Adjust soil moisture and temperature to see how automated IoT systems respond.
        </p>
      </div>

      <div
        className="rounded-2xl p-5 space-y-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Farm Illustration */}
        <div
          className="rounded-xl p-4 relative overflow-hidden"
          style={{ background: "rgba(0,0,0,0.3)", minHeight: "100px" }}
        >
          {/* Sky */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: temperature > 35
                ? "linear-gradient(180deg, #7c3aed20 0%, #000 100%)"
                : temperature < 5
                ? "linear-gradient(180deg, #1e3a5f30 0%, #000 100%)"
                : "linear-gradient(180deg, #1e3a8a20 0%, #000 100%)",
            }}
          />
          <div className="relative z-10 flex items-end gap-4 h-20">
            {/* Soil/Plants */}
            <div className="flex-1 flex items-end gap-2">
              {["🌱", "🌿", "🌾", "🌱", "🌿"].map((plant, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  className="text-2xl"
                >
                  {plant}
                </motion.div>
              ))}
            </div>
            {/* Sensor */}
            <div className="flex flex-col items-center">
              <div className="text-lg">📡</div>
              <div className="text-xs text-center" style={{ color: "#10b981" }}>
                IoT Sensor
              </div>
            </div>
          </div>
          {/* Moisture visual */}
          <div className="relative z-10 mt-2">
            <div className="w-full rounded-full h-2" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${moisture}%`,
                  background:
                    moisture < 30
                      ? "#ef4444"
                      : moisture > 70
                      ? "#3b82f6"
                      : "#10b981",
                }}
              />
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Soil moisture: {moisture}%
            </div>
          </div>

          {/* Water drops animation when pumping */}
          <AnimatePresence>
            {showWater &&
              [0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 40, opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                  className="absolute text-sm"
                  style={{ left: `${20 + i * 15}%`, top: "10px" }}
                >
                  💧
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "#fff" }}>💧 Soil Moisture</span>
              <span className="font-bold" style={{ color: moisture < 30 ? "#ef4444" : moisture > 70 ? "#3b82f6" : "#10b981" }}>
                {moisture}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={moisture}
              onChange={e => handleMoisture(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: moisture < 30 ? "#ef4444" : moisture > 70 ? "#3b82f6" : "#10b981" }}
            />
            <div className="flex justify-between text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span>Dry (0%)</span>
              <span>Saturated (100%)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "#fff" }}>🌡️ Temperature</span>
              <span className="font-bold" style={{ color: temperature > 35 ? "#ef4444" : temperature < 5 ? "#3b82f6" : "#10b981" }}>
                {temperature}°C
              </span>
            </div>
            <input
              type="range"
              min={-5}
              max={50}
              value={temperature}
              onChange={e => handleTemp(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: temperature > 35 ? "#ef4444" : temperature < 5 ? "#3b82f6" : "#10b981" }}
            />
            <div className="flex justify-between text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span>-5°C</span>
              <span>50°C</span>
            </div>
          </div>
        </div>

        {/* System Decisions */}
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
            System Decisions
          </h4>
          <div className="space-y-2">
            {decisions.map((dec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg p-3"
                style={{
                  background: typeColors[dec.type].bg,
                  border: `1px solid ${typeColors[dec.type].border}`,
                }}
              >
                <div className="text-sm font-semibold mb-1" style={{ color: typeColors[dec.type].text }}>
                  {dec.message}
                </div>
                <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Topic: <span style={{ color: COLOR }}>{dec.topic}</span> | Payload:{" "}
                  <span style={{ color: "#10b981" }}>{dec.payload}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                Traditional Farming
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)" }}>
                Scheduled irrigation regardless of soil conditions. Wastes water.
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: COLOR }}>
                Smart Farming
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)" }}>
                Data-driven irrigation. Saves{" "}
                <strong style={{ color: "#10b981" }}>30–50% water</strong> annually.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
