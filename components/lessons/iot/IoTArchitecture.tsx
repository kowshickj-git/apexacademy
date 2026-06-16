"use client";
import { motion } from "framer-motion";

const COLOR = "#6366F1";

const connectivityOptions = [
  {
    name: "WiFi",
    range: "50–100m",
    power: "~80–170mA",
    bandwidth: "High",
    use: "Home automation",
    color: "#3b82f6",
  },
  {
    name: "BLE",
    range: "10m",
    power: "~8mA",
    bandwidth: "Low-Med",
    use: "Wearables",
    color: "#06b6d4",
  },
  {
    name: "LoRa",
    range: "2–15km",
    power: "Very low",
    bandwidth: "Very low",
    use: "Agriculture",
    color: "#10b981",
  },
  {
    name: "NB-IoT",
    range: "~10km",
    power: "1–2 yr battery",
    bandwidth: "Low",
    use: "Asset tracking",
    color: "#f59e0b",
  },
];

const cloudPlatforms = [
  { name: "AWS IoT Core", logo: "☁️", desc: "Enterprise grade, rich ecosystem" },
  { name: "Google Cloud IoT", logo: "🔷", desc: "ML integration, BigQuery" },
  { name: "Azure IoT Hub", logo: "🔵", desc: "Microsoft ecosystem, digital twins" },
  { name: "ThingSpeak", logo: "📊", desc: "Free tier, MATLAB analytics" },
];

export default function IoTArchitecture() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          IoT Architecture Deep Dive
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Four layers working together to enable connected intelligence.
        </p>
      </div>

      {/* Layer 1 — Edge Devices */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#3730a3", color: "#fff" }}
          >
            1
          </div>
          <h3 className="font-bold" style={{ color: "#fff" }}>
            Edge Devices — Perception Layer
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["ESP32", "Arduino", "Raspberry Pi", "Industrial Sensors"].map(d => (
            <div
              key={d}
              className="rounded-lg p-2 text-center text-xs"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Layer 2 — Connectivity */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#4f46e5", color: "#fff" }}
          >
            2
          </div>
          <h3 className="font-bold" style={{ color: "#fff" }}>
            Connectivity — Network Layer
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {connectivityOptions.map(opt => (
            <div
              key={opt.name}
              className="rounded-lg p-3 flex gap-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${opt.color}33`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: `${opt.color}33`, color: opt.color }}
              >
                {opt.name.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: opt.color }}>
                  {opt.name}
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Range: {opt.range} · Power: {opt.power}
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  BW: {opt.bandwidth} · Use: {opt.use}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 3 — Cloud */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#6366F1", color: "#fff" }}
          >
            3
          </div>
          <h3 className="font-bold" style={{ color: "#fff" }}>
            Cloud Platforms — Processing Layer
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cloudPlatforms.map(p => (
            <div
              key={p.name}
              className="rounded-lg p-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-lg mb-1">{p.logo}</div>
              <div className="text-xs font-semibold mb-0.5" style={{ color: "#fff" }}>
                {p.name}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 4 — Apps */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#818cf8", color: "#fff" }}
          >
            4
          </div>
          <h3 className="font-bold" style={{ color: "#fff" }}>
            Applications — Application Layer
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["📊 Dashboards", "📱 Mobile Apps", "🔔 Alerts", "⚡ Automation", "🤖 AI Analytics", "🗺️ Asset Tracking"].map(
            app => (
              <span
                key={app}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: "rgba(129,140,248,0.15)",
                  color: "#818cf8",
                  border: "1px solid rgba(129,140,248,0.2)",
                }}
              >
                {app}
              </span>
            )
          )}
        </div>
      </div>

      {/* MQTT Protocol */}
      <div
        className="rounded-xl p-5"
        style={{
          background: `rgba(99,102,241,0.08)`,
          border: `1px solid rgba(99,102,241,0.25)`,
        }}
      >
        <h3 className="font-bold mb-3" style={{ color: COLOR }}>
          MQTT Protocol — The Backbone of IoT
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div style={{ color: "rgba(255,255,255,0.7)" }}>
              <strong style={{ color: "#fff" }}>Model:</strong> Publish/Subscribe
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)" }}>
              <strong style={{ color: "#fff" }}>Port:</strong> 1883 (plain) / 8883 (TLS)
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)" }}>
              <strong style={{ color: "#fff" }}>Header:</strong> Only 2 bytes overhead
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)" }}>
              <strong style={{ color: "#fff" }}>QoS Levels:</strong> 0 (fire &amp; forget), 1 (at least once), 2 (exactly once)
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Topic example:
            </div>
            <div
              className="rounded p-2 text-sm font-mono"
              style={{ background: "rgba(0,0,0,0.3)", color: COLOR }}
            >
              home/livingroom/temperature
            </div>
            <div className="text-xs mt-2 mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Payload:
            </div>
            <div
              className="rounded p-2 text-sm font-mono"
              style={{ background: "rgba(0,0,0,0.3)", color: "#10b981" }}
            >
              {`{"temp": 23.5, "unit": "C"}`}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
