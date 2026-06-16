"use client";
import { motion } from "framer-motion";

const MISTAKES = [
  {
    num: "01",
    title: "GPIO 34–39 are input-only",
    wrong: "digitalWrite(34, HIGH); // Silently fails!",
    right: "// Use GPIO 0-33 for outputs\ndigitalWrite(2, HIGH); // OK",
    body: "GPIO 34, 35, 36, and 39 have no output driver and no internal pull-up/pull-down resistors. Attempting to drive them as output will not work and may cause undefined behavior. Always use GPIO 0–33 for digital outputs.",
  },
  {
    num: "02",
    title: "3.3V only logic — 5V will damage the ESP32",
    wrong: "// Connecting Arduino 5V TX directly to ESP32 RX",
    right: "// Use a voltage divider or level shifter\n// 5V → 10kΩ → ESP32 RX → 20kΩ → GND",
    body: "ESP32 GPIO are NOT 5V tolerant. Applying 5V directly will exceed the absolute maximum rating and permanently damage the chip. Use a voltage divider or dedicated logic level shifter (e.g. TXS0108E) when interfacing with 5V systems like Arduino or RS-232.",
  },
  {
    num: "03",
    title: "WiFi and ADC2 conflict",
    wrong: "// Reading ADC2 pin while WiFi is connected\nint val = analogRead(GPIO_NUM_25); // Returns 0 or garbage!",
    right: "// Use ADC1 pins (GPIO 32-39) when WiFi is active\nint val = analogRead(GPIO_NUM_34); // ADC1 channel 6, OK",
    body: "When WiFi is active, the ESP32 radio uses ADC2 internally, making ADC2 pins (GPIO 0,2,4,12-15,25-27) return incorrect values or fail silently. Always use ADC1 pins (GPIO 32–39) for analog readings in WiFi-connected applications.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Mistakes</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Common Mistakes</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>Avoid these pitfalls that trip up most ESP32 beginners.</p>

        <div className="space-y-4">
          {MISTAKES.map((m, i) => (
            <motion.div
              key={m.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border p-5"
              style={{ background: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.18)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-mono" style={{ color: "rgba(239,68,68,0.5)" }}>{m.num}</span>
                <h3 className="text-sm font-black" style={{ color: "#EF4444" }}>{m.title}</h3>
              </div>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>{m.body}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <div className="text-[9px] font-mono mb-1.5" style={{ color: "#EF4444" }}>WRONG</div>
                  <pre className="text-[9px] font-mono whitespace-pre-wrap" style={{ color: "rgba(240,240,245,0.5)" }}>{m.wrong}</pre>
                </div>
                <div className="rounded-lg p-3" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div className="text-[9px] font-mono mb-1.5" style={{ color: "#10B981" }}>RIGHT</div>
                  <pre className="text-[9px] font-mono whitespace-pre-wrap" style={{ color: "rgba(240,240,245,0.5)" }}>{m.right}</pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
