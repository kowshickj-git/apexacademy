"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#0EA5E9";

const SENSOR_CARDS = [
  {
    name: "Temperature Sensor",
    icon: "🌡️",
    tech: "Thermoresistive / Thermoelectric",
    values: "LM35: 10mV/°C · NTC: 10kΩ@25°C · DHT11: 0-50°C ±2°C",
    use: "HVAC, weather stations, motor protection",
    type: "analog",
    color: "#EF4444",
  },
  {
    name: "Ultrasonic Sensor",
    icon: "📡",
    tech: "40 kHz piezoelectric transducer",
    values: "HC-SR04: 2cm – 400cm · Echo pulse width",
    use: "Robot obstacle avoidance, parking sensors",
    type: "digital",
    color: COLOR,
  },
  {
    name: "IR Sensor",
    icon: "🔴",
    tech: "Infrared LED + photodiode pair",
    values: "38 kHz carrier · Output: HIGH/LOW",
    use: "Line followers, TV remotes, obstacle detection",
    type: "digital",
    color: "#EF4444",
  },
  {
    name: "LDR (Light Sensor)",
    icon: "☀️",
    tech: "CdS photoresistor",
    values: "1 MΩ dark → 1 kΩ bright (logarithmic)",
    use: "Street lights, screen brightness, alarms",
    type: "analog",
    color: "#F59E0B",
  },
  {
    name: "Gas Sensor",
    icon: "💨",
    tech: "SnO₂ metal oxide semiconductor",
    values: "MQ-2: LPG, smoke, H₂ · Output: analog ppm",
    use: "Fire alarms, air quality monitoring",
    type: "analog",
    color: "#8B5CF6",
  },
  {
    name: "Humidity Sensor",
    icon: "💧",
    tech: "Capacitive polymer sensing",
    values: "DHT11: 20–90% RH ±5% · DHT22: 0–100% ±2%",
    use: "Smart homes, greenhouses, data centers",
    type: "digital",
    color: "#06B6D4",
  },
  {
    name: "PIR Motion Sensor",
    icon: "🚶",
    tech: "Passive infrared (pyroelectric)",
    values: "HC-SR501: 5–7m · FOV 120° · Output: HIGH/LOW",
    use: "Security systems, automatic lighting",
    type: "digital",
    color: "#10B981",
  },
  {
    name: "Accelerometer",
    icon: "📐",
    tech: "MEMS (micro-electro-mechanical)",
    values: "MPU-6050: ±2/4/8/16g · 3-axis · I2C/SPI",
    use: "Drones, phones, gesture control",
    type: "digital",
    color: "#F97316",
  },
  {
    name: "Gyroscope",
    icon: "🌀",
    tech: "MEMS Coriolis effect",
    values: "MPU-6050: ±250–2000°/s · Yaw/Pitch/Roll",
    use: "Self-balancing robots, VR headsets, drones",
    type: "digital",
    color: "#A78BFA",
  },
  {
    name: "Touch Sensor",
    icon: "👆",
    tech: "Capacitive field detection",
    values: "TTP223: Active LOW · 3.3–5V · Instant response",
    use: "Touch buttons, sliders, smart surfaces",
    type: "digital",
    color: "#EC4899",
  },
];

export default function SensorTypes() {
  const [filter, setFilter] = useState<"all" | "analog" | "digital">("all");
  const filtered = filter === "all" ? SENSOR_CARDS : SENSOR_CARDS.filter(s => s.type === filter);

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 02 · Sensor Types
        </p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Types of Sensors</h2>
        <p className="text-sm mb-6 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          Sensors fall into two broad categories: analog (continuous output) and digital (discrete data). Understanding the difference is critical for circuit design and code.
        </p>
      </motion.div>

      {/* Analog vs Digital comparison */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <div className="rounded-2xl p-5 border" style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
            <span className="font-bold text-sm" style={{ color: "#F59E0B" }}>Analog Sensors</span>
          </div>
          <p className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.55)" }}>
            Output a <strong style={{ color: "#F59E0B" }}>continuous voltage or resistance</strong> that varies proportionally with the measured quantity. Read with Arduino&apos;s <code className="text-xs px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>analogRead()</code>.
          </p>
          <div className="space-y-1.5">
            {["LDR: 1MΩ (dark) → 1kΩ (bright)", "LM35: 250mV at 25°C", "NTC Thermistor: R decreases with temp", "MQ-2 gas sensor: 0–5V output"].map(item => (
              <div key={item} className="flex items-start gap-2 text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
                <span style={{ color: "#F59E0B" }}>▸</span> {item}
              </div>
            ))}
          </div>
          {/* Mini waveform */}
          <svg viewBox="0 0 120 30" className="w-full mt-3 h-8">
            <path d="M 0 25 C 20 25, 20 5, 40 5 C 60 5, 60 15, 80 15 C 100 15, 100 25, 120 20" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
            <text x="0" y="29" fontSize="5" fill="rgba(240,240,245,0.3)">0V</text>
            <text x="0" y="6" fontSize="5" fill="rgba(240,240,245,0.3)">5V</text>
          </svg>
        </div>

        <div className="rounded-2xl p-5 border" style={{ background: "rgba(14,165,233,0.06)", borderColor: "rgba(14,165,233,0.2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: COLOR }} />
            <span className="font-bold text-sm" style={{ color: COLOR }}>Digital Sensors</span>
          </div>
          <p className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.55)" }}>
            Output <strong style={{ color: COLOR }}>discrete HIGH/LOW or serial data</strong> (I2C, SPI, UART). Processed with <code className="text-xs px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>digitalRead()</code> or a protocol library.
          </p>
          <div className="space-y-1.5">
            {["PIR HC-SR501: HIGH when motion", "HC-SR04: echo pulse width in µs", "DHT11: 40-bit serial data frame", "MPU-6050: 16-bit I2C registers"].map(item => (
              <div key={item} className="flex items-start gap-2 text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
                <span style={{ color: COLOR }}>▸</span> {item}
              </div>
            ))}
          </div>
          {/* Digital waveform */}
          <svg viewBox="0 0 120 30" className="w-full mt-3 h-8">
            <polyline points="0,25 20,25 20,5 40,5 40,25 60,25 60,5 70,5 70,25 100,25 100,5 110,5 110,25 120,25" stroke={COLOR} strokeWidth="1.5" fill="none" />
            <text x="0" y="29" fontSize="5" fill="rgba(240,240,245,0.3)">LOW</text>
            <text x="0" y="6" fontSize="5" fill="rgba(240,240,245,0.3)">HIGH</text>
          </svg>
        </div>
      </motion.div>

      {/* Input vs Output note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-start gap-3 p-4 rounded-xl mb-8 border"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <span className="text-xl">💡</span>
        <div>
          <span className="text-sm font-bold" style={{ color: "#F0F0F5" }}>Sensors are INPUT devices. </span>
          <span className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            They provide data <em>to</em> the microcontroller. Actuators (motors, LEDs, buzzers, relays) are <strong style={{ color: "#F0F0F5" }}>OUTPUT devices</strong> — they respond to commands <em>from</em> the microcontroller based on sensor data.
          </span>
        </div>
      </motion.div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-5">
        {(["all", "analog", "digital"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
            style={{
              background: filter === f ? (f === "analog" ? "rgba(245,158,11,0.15)" : f === "digital" ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.08)") : "rgba(255,255,255,0.04)",
              color: filter === f ? (f === "analog" ? "#F59E0B" : f === "digital" ? COLOR : "#F0F0F5") : "rgba(240,240,245,0.4)",
              border: `1px solid ${filter === f ? (f === "analog" ? "rgba(245,158,11,0.35)" : f === "digital" ? "rgba(14,165,233,0.35)" : "rgba(255,255,255,0.12)") : "rgba(255,255,255,0.07)"}`,
            }}
          >
            {f === "all" ? "All Sensors" : f === "analog" ? "Analog" : "Digital"}
          </button>
        ))}
      </div>

      {/* Sensor cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {filtered.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-2xl p-4 border"
            style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
              >
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: "#F0F0F5" }}>{s.name}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold uppercase"
                    style={{
                      background: s.type === "analog" ? "rgba(245,158,11,0.12)" : "rgba(14,165,233,0.12)",
                      color: s.type === "analog" ? "#F59E0B" : COLOR,
                      border: `1px solid ${s.type === "analog" ? "rgba(245,158,11,0.25)" : "rgba(14,165,233,0.25)"}`,
                    }}
                  >
                    {s.type}
                  </span>
                </div>
                <div className="text-[10px] mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>{s.tech}</div>
                <div className="text-[10px] font-mono mb-1" style={{ color: s.color }}>{s.values}</div>
                <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>Use: {s.use}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
