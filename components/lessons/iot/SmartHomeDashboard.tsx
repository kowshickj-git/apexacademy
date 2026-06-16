"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#6366F1";

interface Props {
  onUsed: () => void;
}

type FanSpeed = number;
type Temp = number;

export default function SmartHomeDashboard({ onUsed }: Props) {
  const called = useRef(false);
  const [lightOn, setLightOn] = useState(false);
  const [fanSpeed, setFanSpeed] = useState<FanSpeed>(0);
  const [temp, setTemp] = useState<Temp>(22);
  const [locked, setLocked] = useState(true);
  const [toasts, setToasts] = useState<string[]>([]);
  const [lastMqtt, setLastMqtt] = useState<{ topic: string; payload: string } | null>(null);

  const markUsed = () => {
    if (!called.current) {
      called.current = true;
      onUsed();
    }
  };

  const showToast = (msg: string) => {
    setToasts(prev => [...prev, msg]);
    setTimeout(() => setToasts(prev => prev.slice(1)), 2000);
  };

  const handleLight = () => {
    markUsed();
    const next = !lightOn;
    setLightOn(next);
    const payload = `{"state":"${next ? "ON" : "OFF"}"}`;
    setLastMqtt({ topic: "home/living/light", payload });
    showToast("Sending to cloud...");
  };

  const handleFan = (val: number) => {
    markUsed();
    setFanSpeed(val);
    const payload = `{"speed":${val},"unit":"%"}`;
    setLastMqtt({ topic: "home/living/fan", payload });
    showToast("Sending to cloud...");
  };

  const handleTempChange = (delta: number) => {
    markUsed();
    const next = Math.max(16, Math.min(30, temp + delta));
    setTemp(next);
    const payload = `{"setpoint":${next},"unit":"C"}`;
    setLastMqtt({ topic: "home/living/thermostat", payload });
    showToast("Sending to cloud...");
  };

  const handleLock = () => {
    markUsed();
    const next = !locked;
    setLocked(next);
    const payload = `{"state":"${next ? "LOCKED" : "UNLOCKED"}"}`;
    setLastMqtt({ topic: "home/living/door", payload });
    showToast("Sending to cloud...");
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
          Smart Home Dashboard
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Control your living room devices. Watch MQTT messages update in real time.
        </p>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Room header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#fff" }}>
              🏠 Living Room
            </h3>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              4 smart devices connected
            </p>
          </div>
          <div
            className="px-2 py-0.5 rounded text-xs"
            style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}
          >
            ● Online
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Toggle */}
          <div
            className="rounded-xl p-4 transition-all duration-300"
            style={{
              background: lightOn ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)",
              border: lightOn ? `1px solid rgba(99,102,241,0.35)` : "1px solid rgba(255,255,255,0.07)",
              boxShadow: lightOn ? `0 0 20px rgba(99,102,241,0.15)` : "none",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                💡 Smart Light
              </span>
              <button
                onClick={handleLight}
                className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                style={{
                  background: lightOn ? COLOR : "rgba(255,255,255,0.1)",
                  color: lightOn ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {lightOn ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-center h-10">
              <motion.div
                animate={{ opacity: lightOn ? 1 : 0.3, scale: lightOn ? 1.1 : 0.9 }}
                className="text-3xl"
              >
                💡
              </motion.div>
            </div>
            <div className="mt-2 text-xs font-mono rounded p-1.5" style={{ background: "rgba(0,0,0,0.3)", color: lightOn ? COLOR : "rgba(255,255,255,0.3)" }}>
              Topic: home/living/light
            </div>
          </div>

          {/* Fan Speed */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                🌀 Fan Speed
              </span>
              <span className="text-xs font-bold" style={{ color: COLOR }}>
                {fanSpeed}%
              </span>
            </div>
            <div className="flex items-center justify-center h-10">
              <motion.div
                animate={{ rotate: fanSpeed > 0 ? 360 : 0 }}
                transition={{ duration: fanSpeed > 0 ? 60 / fanSpeed : 0, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                🌀
              </motion.div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={fanSpeed}
              onChange={e => handleFan(Number(e.target.value))}
              className="w-full mt-2"
              style={{ accentColor: COLOR }}
            />
            <div className="mt-1 text-xs font-mono rounded p-1.5" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.3)" }}>
              Topic: home/living/fan
            </div>
          </div>

          {/* Temperature */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                🌡️ Thermostat
              </span>
              <span className="text-xl font-black" style={{ color: temp > 26 ? "#ef4444" : COLOR }}>
                {temp}°C
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 h-10">
              <button
                onClick={() => handleTempChange(-1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all hover:scale-110"
                style={{ background: "rgba(99,102,241,0.2)", color: COLOR }}
              >
                −
              </button>
              <div className="text-3xl">🌡️</div>
              <button
                onClick={() => handleTempChange(1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all hover:scale-110"
                style={{ background: "rgba(99,102,241,0.2)", color: COLOR }}
              >
                +
              </button>
            </div>
            <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Range: 16°C – 30°C
            </div>
            <div className="mt-1 text-xs font-mono rounded p-1.5" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.3)" }}>
              Topic: home/living/thermostat
            </div>
          </div>

          {/* Door Lock */}
          <div
            className="rounded-xl p-4 transition-all duration-300"
            style={{
              background: locked ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              border: locked ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                🔒 Door Lock
              </span>
              <button
                onClick={handleLock}
                className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                style={{
                  background: locked ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                  color: locked ? "#10b981" : "#ef4444",
                }}
              >
                {locked ? "LOCKED" : "UNLOCKED"}
              </button>
            </div>
            <div className="flex items-center justify-center h-10">
              <motion.div
                animate={{ rotate: locked ? 0 : -20 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-3xl"
              >
                {locked ? "🔒" : "🔓"}
              </motion.div>
            </div>
            <div className="mt-2 text-xs font-mono rounded p-1.5" style={{ background: "rgba(0,0,0,0.3)", color: locked ? "#10b981" : "#ef4444" }}>
              Topic: home/living/door
            </div>
          </div>
        </div>

        {/* MQTT Live Feed */}
        {lastMqtt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl p-4"
            style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(99,102,241,0.25)` }}
          >
            <div className="text-xs mb-2 font-semibold" style={{ color: COLOR }}>
              MQTT Message Sent
            </div>
            <div className="text-xs font-mono space-y-1">
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Topic: </span>
                <span style={{ color: "#818cf8" }}>{lastMqtt.topic}</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Payload: </span>
                <span style={{ color: "#10b981" }}>{lastMqtt.payload}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: COLOR, color: "#fff" }}
            >
              {t}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
