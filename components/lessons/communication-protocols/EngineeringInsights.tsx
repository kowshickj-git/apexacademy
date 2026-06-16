"use client";
import { motion } from "framer-motion";

const COLOR = "#8B5CF6";

const INSIGHTS = [
  {
    icon: "📊",
    title: "Protocol Overhead",
    content: [
      "UART 8N1 sends 10 bits for every 8 data bits — that's 25% overhead from the start + stop bits.",
      "CAN sends an 11-bit ID + 8-byte (64-bit) data in a ~108-bit frame. High overhead per frame but very robust.",
      "At 115200 baud 8N1: effective data rate = 115200 ÷ 10 × 8 = 92,160 bps ≈ 11.25 KB/s",
      "Always factor protocol overhead when calculating real throughput — the raw baud rate is never the actual data rate.",
    ],
    highlight: "Effective throughput = Baud rate × (data bits ÷ total frame bits)",
  },
  {
    icon: "⚡",
    title: "Voltage Level Mismatches",
    content: [
      "5V Arduino UART TX → 3.3V ESP32 RX: the HIGH voltage (5V) exceeds the ESP32's absolute max input (3.6V).",
      "This can permanently damage the RX pin — silicon junction breakdown. The device may appear to work briefly then fail.",
      "Solution: Use a bidirectional level shifter (TXB0108, BSS138 MOSFET divider) or a simple resistor divider (1kΩ + 2kΩ).",
      "Always check the datasheet: VIH (input high threshold), VIL (input low threshold), and Vmax (absolute maximum).",
    ],
    highlight: "5V logic ≠ 3.3V logic ≠ 1.8V logic — never connect without checking!",
  },
  {
    icon: "🔗",
    title: "Protocol Stacking",
    content: [
      "MODBUS is an application-layer protocol that runs over RS485 physical layer — completely separate concerns.",
      "MQTT is an application protocol running over TCP/IP, which runs over Ethernet or WiFi physical layers.",
      "CANopen, DeviceNet, and J1939 are all application protocols built on top of CAN physical/data layer.",
      "Each layer handles one specific concern: physical (wires + voltages), data link (framing + error detection), application (meaning of data).",
    ],
    highlight: "Application protocol ↔ Transport ↔ Physical — each layer is independent",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 09 · Engineering Insights</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Engineering Insights</h2>
        <p className="text-sm mb-8" style={{ color: "rgba(240,240,245,0.45)" }}>
          Real-world knowledge you won&apos;t find in introductory tutorials.
        </p>

        <div className="space-y-5">
          {INSIGHTS.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(139,92,246,0.04)", borderColor: "rgba(139,92,246,0.18)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{insight.icon}</span>
                <h3 className="text-base font-bold" style={{ color: COLOR }}>{insight.title}</h3>
              </div>

              <div className="space-y-2 mb-4">
                {insight.content.map((line, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>
                    <span className="flex-shrink-0 mt-1" style={{ color: "rgba(139,92,246,0.5)" }}>•</span>
                    {line}
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl px-4 py-2.5 text-xs font-semibold"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: COLOR }}
              >
                💡 {insight.highlight}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
