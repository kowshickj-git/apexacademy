"use client";
import { motion } from "framer-motion";

const COLOR = "#EF4444";

const insights = [
  {
    icon: "⚡",
    title: "CAN FD (Flexible Data Rate)",
    sub: "ISO 11898-1:2015",
    points: [
      "Up to 64 bytes of payload data (vs 8 bytes in classic CAN)",
      "Data phase up to 8 Mbps (vs 1 Mbps)",
      "Same arbitration phase as classic CAN (backwards compatible at frame level)",
      "Required for modern ADAS, autonomous driving data rates",
      "Supported by STM32, ESP32-S3, Renesas RH850, Infineon AURIX",
    ],
  },
  {
    icon: "🚗",
    title: "Automotive ECU Architecture",
    sub: "Modern Vehicle Networks",
    points: [
      "70–100 ECUs in a typical modern passenger vehicle",
      "Gateway ECU bridges multiple CAN networks (powertrain, chassis, body, infotainment)",
      "FlexRay used for safety-critical drive-by-wire: up to 10 Mbps, deterministic",
      "LIN bus (9.6–20 kbps) for simple actuators: windows, mirrors, seat motors",
      "CAN XL (2021): up to 20 Mbps, 4096 byte payload, for Ethernet-to-CAN bridging",
    ],
  },
  {
    icon: "🔌",
    title: "OBD-II & CAN",
    sub: "On-Board Diagnostics",
    points: [
      "All cars manufactured after 2008 (US/EU) must use CAN for OBD-II",
      "Standard 16-pin OBD-II DLC port under dashboard",
      "Typically 500 kbps on pin 6 (CAN-H) and pin 14 (CAN-L)",
      "Diagnostic tools read DTCs, live sensor data, freeze frames via CAN",
      "SAE J1979 / ISO 15765-4 defines OBD-II on CAN protocol",
    ],
  },
];

export default function EngineeringInsights() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: "#F0F0F5" }}>
        Engineering Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
            }}
          >
            <div className="text-2xl mb-3">{insight.icon}</div>
            <div className="font-bold text-sm mb-0.5" style={{ color: COLOR }}>
              {insight.title}
            </div>
            <div
              className="text-xs mb-3"
              style={{ color: "rgba(240,240,245,0.3)" }}
            >
              {insight.sub}
            </div>
            <ul className="space-y-1.5">
              {insight.points.map((pt) => (
                <li key={pt} className="flex gap-2 text-xs">
                  <span style={{ color: COLOR, flexShrink: 0 }}>▸</span>
                  <span style={{ color: "rgba(240,240,245,0.6)" }}>{pt}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
