"use client";
import { motion } from "framer-motion";

const COLOR = "#6366F1";

const mistakes = [
  {
    title: "WiFi-only Thinking",
    problem: "Designing every IoT device to use WiFi, even battery-powered or outdoor devices.",
    solution: "Match the protocol to the use case:",
    details: [
      "BLE — wearables, short range, ultra-low power (~8mA)",
      "Zigbee — home automation mesh networks",
      "LoRa — agriculture, smart city, kilometers of range",
      "NB-IoT — cellular, years of battery life on AA cells",
    ],
    icon: "📶",
  },
  {
    title: "Unencrypted MQTT in Production",
    problem: "Using mqtt:// (port 1883) in production — all data transmitted in plain text.",
    solution: "Always use mqtts:// (port 8883) with TLS in production environments.",
    details: [
      "Port 1883 is plain text — anyone on the network can read your data",
      "Port 8883 is MQTT over TLS — encrypted and authenticated",
      "Use X.509 certificates for device identity",
      "Rotate credentials regularly with OTA updates",
    ],
    icon: "🔓",
  },
  {
    title: "Ignoring Power Consumption",
    problem: "ESP32 WiFi active draws 80–240mA — a 2000mAh battery lasts ~8–25 hours.",
    solution: "Use deep sleep aggressively and choose low-power protocols.",
    details: [
      "ESP32 deep sleep: ~10µA (vs 240mA awake)",
      "Wake every 5 minutes, read sensor, send, sleep: average <1mA",
      "2000mAh battery → months of operation",
      "Use RTC memory to preserve data across sleep cycles",
    ],
    icon: "🔋",
  },
  {
    title: "No Offline Operation Plan",
    problem: "Device stops working when internet connection drops — no local fallback.",
    solution: "Always design for disconnection. Store locally, sync when reconnected.",
    details: [
      "Use SPIFFS or SD card to buffer readings locally",
      "Implement reconnect logic with exponential backoff",
      "Store critical alerts in persistent memory",
      "Sync accumulated data once connection restored",
    ],
    icon: "📴",
  },
];

export default function CommonMistakes() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          Common IoT Mistakes
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Pitfalls that trip up beginners and even experienced engineers.
        </p>
      </div>

      <div className="space-y-3">
        {mistakes.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.15)" }}
            >
              <span className="text-xl">{m.icon}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: "#ef4444" }}>
                  ✗ {m.title}
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {m.problem}
                </div>
              </div>
            </div>
            <div className="px-4 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="text-sm font-semibold mb-2" style={{ color: "#10b981" }}>
                ✓ {m.solution}
              </div>
              <ul className="space-y-1">
                {m.details.map((d, j) => (
                  <li key={j} className="flex gap-2 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ color: COLOR, flexShrink: 0 }}>·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
