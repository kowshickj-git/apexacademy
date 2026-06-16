"use client";
import { motion } from "framer-motion";

const COLOR = "#06B6D4";

const INSIGHTS = [
  {
    num: "01",
    title: "Dual-Core Power",
    body: "Use Core 0 for networking (WiFi/BLE stack) and Core 1 for application logic with FreeRTOS tasks via xTaskCreatePinnedToCore(). This prevents networking interrupts from stalling your sensor reads or control loops.",
    icon: "⚡",
    color: "#06B6D4",
  },
  {
    num: "02",
    title: "Deep Sleep Strategy",
    body: "10 µA deep sleep enables months of battery life. Use RTC_DATA_ATTR to persist variables across wake cycles. Wake sources: timer, ext0/ext1 GPIO, touch pins, or ULP coprocessor. Minimize wake-up time by caching WiFi credentials in RTC memory.",
    icon: "🔋",
    color: "#10B981",
  },
  {
    num: "03",
    title: "ADC Quirks",
    body: "ESP32's ADC is non-linear near 0V and 3.3V rails. Use the 0.1V–3.2V range for reliable readings. For best accuracy, apply calibration with esp_adc_cal_characterize() or use an external ADC like the ADS1115 for precision measurements.",
    icon: "📊",
    color: "#F59E0B",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 09 · Insights</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Engineering Insights</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>Pro tips from real ESP32 deployments.</p>

        <div className="space-y-4">
          {INSIGHTS.map((ins, i) => (
            <motion.div
              key={ins.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border p-5 flex gap-4"
              style={{ background: `${ins.color}06`, borderColor: `${ins.color}20` }}
            >
              <div className="text-2xl flex-shrink-0">{ins.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono" style={{ color: `${ins.color}80` }}>{ins.num}</span>
                  <h3 className="text-sm font-black" style={{ color: ins.color }}>{ins.title}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.6)" }}>{ins.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
