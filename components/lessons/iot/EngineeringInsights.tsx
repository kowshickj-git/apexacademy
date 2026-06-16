"use client";
import { motion } from "framer-motion";

const COLOR = "#6366F1";

const insights = [
  {
    title: "MQTT vs HTTP for IoT",
    icon: "📡",
    content: [
      "HTTP polling wastes resources: 5-second polling = 17,280 requests/day per device.",
      "MQTT pub/sub pushes data instantly — no polling needed.",
      "MQTT overhead: ~2 bytes header vs ~300 bytes HTTP headers.",
      "For 10,000 devices: MQTT saves gigabytes of bandwidth daily.",
      "MQTT is stateful (persistent connection) vs HTTP stateless (new connection each request).",
    ],
    highlight: "MQTT is ~150x more efficient than HTTP for IoT telemetry.",
  },
  {
    title: "Edge Computing",
    icon: "⚡",
    content: [
      "Process data locally on the device for <1ms latency.",
      "Cloud round-trip typically adds >100ms latency — too slow for real-time control.",
      "TensorFlow Lite can run ML inference on ESP32 (tenths of kB RAM).",
      "Example: Anomaly detection locally stops a conveyor belt instantly.",
      "Edge + Cloud hybrid: process locally, sync summaries to cloud.",
    ],
    highlight: "Edge computing: 100x faster response than cloud-only approaches.",
  },
  {
    title: "IoT Security",
    icon: "🔐",
    content: [
      "Mirai botnet (2016): 600,000+ IoT devices weaponized for DDoS attacks.",
      "Root cause: default credentials (admin/admin) never changed.",
      "Best practices: always use TLS (port 8883, never plain 1883 in production).",
      "Certificate-based auth: X.509 certificates per device.",
      "OTA (Over-The-Air) firmware updates via HTTPS — patch vulnerabilities remotely.",
      "Unique credentials per device — compromise one, not all.",
    ],
    highlight: "Never use mqtt:// in production. Always use mqtts:// (TLS).",
  },
];

export default function EngineeringInsights() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          Engineering Insights
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Professional knowledge from real-world IoT deployments.
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid rgba(99,102,241,0.2)` }}
          >
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ background: `rgba(99,102,241,0.1)`, borderBottom: `1px solid rgba(99,102,241,0.15)` }}
            >
              <span className="text-2xl">{insight.icon}</span>
              <h3 className="text-base font-bold" style={{ color: "#fff" }}>
                {insight.title}
              </h3>
            </div>
            <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.02)" }}>
              <ul className="space-y-2 mb-4">
                {insight.content.map((line, j) => (
                  <li key={j} className="flex gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <span style={{ color: COLOR, flexShrink: 0 }}>→</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div
                className="rounded-xl p-3 text-sm font-semibold"
                style={{ background: `rgba(99,102,241,0.12)`, color: COLOR, border: `1px solid rgba(99,102,241,0.25)` }}
              >
                💡 {insight.highlight}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
