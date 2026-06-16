"use client";
import { motion } from "framer-motion";

const COLOR = "#06B6D4";

const TAKEAWAYS = [
  { icon: "🧠", text: "Dual-core Xtensa LX6 @ up to 240 MHz — run networking and application logic in parallel" },
  { icon: "📡", text: "Built-in WiFi 802.11 b/g/n (2.4 GHz) + Bluetooth 4.2 / BLE 5.0 — no external radio needed" },
  { icon: "🔋", text: "Deep sleep at 10 µA — months of battery life for IoT sensors and beacons" },
  { icon: "🔌", text: "34 GPIO, 18× 12-bit ADC, 2× 8-bit DAC, 10× capacitive touch, 16× PWM channels" },
  { icon: "⚠️", text: "3.3V logic only — GPIO 34–39 are input-only; ADC2 unusable while WiFi is active" },
  { icon: "📦", text: "Rich ecosystem: Arduino IDE, ESP-IDF, MicroPython, FreeRTOS all fully supported" },
];

export default function KeyTakeaways() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Summary</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Key Takeaways</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>Everything you need to remember about the ESP32.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TAKEAWAYS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 rounded-xl border p-4"
              style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.14)" }}
            >
              <span className="text-lg flex-shrink-0">{t.icon}</span>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.65)" }}>{t.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
