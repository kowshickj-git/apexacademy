"use client";
import { motion } from "framer-motion";

const COLOR = "#F59E0B";

const INSIGHTS = [
  {
    icon: "⚡",
    title: "4-20mA vs RS485",
    content: [
      "Current loops (4-20mA) are ideal for single analog measurements — they're immune to voltage drop over long cable runs.",
      "4mA = 0% of range, 20mA = 100% of range. Wire break detection: 0mA means broken wire.",
      "RS485 wins when you need multiple devices on one cable, digital precision, or bi-directional communication.",
      "Common rule: use 4-20mA for a single field sensor, RS485/Modbus when you have multiple devices or need configuration access.",
    ],
  },
  {
    icon: "🔌",
    title: "Termination Resistors",
    content: [
      "RS485 cable acts as a transmission line with characteristic impedance ~120Ω (typical twisted pair).",
      "Without termination at cable ends, signals reflect back and cause data corruption at high speeds.",
      "Termination formula: R_term = cable impedance ≈ 120Ω",
      "At low speeds (<100 kbps) and short runs (<100m), termination is optional — reflections die before next bit.",
      "Always terminate at the physical ends of the bus, not at branch points or stubs.",
    ],
  },
  {
    icon: "☀️",
    title: "RS485 in Solar & EV Charging",
    content: [
      "Solar inverters use RS485 + Modbus RTU for plant monitoring. A single RS485 bus can monitor 100 inverters.",
      "Data logged: AC power, DC input voltage, energy yield, fault codes, temperature, string currents.",
      "EV charging stations use RS485 for back-end communication (IEC 61851 standard).",
      "OCPP (Open Charge Point Protocol) often runs over Ethernet, but station-to-module links use RS485.",
      "Battery Management Systems (BMS) in large ESS use RS485 for cell balancing and SoC reporting.",
    ],
  },
];

export default function EngineeringInsights() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 08 · Engineering Insights
        </p>
        <h2 className="text-2xl font-black mb-6" style={{ color: "#F0F0F5" }}>Engineering Insights</h2>

        <div className="space-y-4">
          {INSIGHTS.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border p-5"
              style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.14)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{ins.icon}</span>
                <h3 className="text-base font-black" style={{ color: COLOR }}>{ins.title}</h3>
              </div>
              <ul className="space-y-2">
                {ins.content.map((line, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" className="mt-1 flex-shrink-0">
                      <path d="M1 4l2 2 4-4" stroke={COLOR} strokeWidth="1.3" strokeLinecap="round" fill="none" />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
