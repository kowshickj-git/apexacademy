"use client";
import { motion } from "framer-motion";

const COLOR = "#0EA5E9";

const INSIGHTS = [
  {
    icon: "🔄",
    title: "Sensor Fusion",
    subtitle: "MPU-6050: Gyroscope + Accelerometer",
    content: [
      "The MPU-6050 integrates a 3-axis gyroscope and 3-axis accelerometer in one IC, communicating via I2C.",
      "Gyroscope measures angular velocity (°/s) — fast and responsive but drifts over time due to integration error.",
      "Accelerometer measures g-force — stable long-term but noisy in the short term (sensitive to vibrations).",
      "A Kalman filter fuses both: uses the gyroscope for fast motion and the accelerometer to correct drift, giving precise yaw/pitch/roll angles.",
    ],
    highlight: "Used in: drones, self-balancing robots, VR headsets, phone screen rotation",
    color: COLOR,
  },
  {
    icon: "🏭",
    title: "Industrial Sensor Networks",
    subtitle: "4-20 mA Current Loops & HART Protocol",
    content: [
      "Industrial plants use hundreds of pressure, temperature, and flow sensors connected over long cable runs.",
      "4-20 mA current loops are immune to resistive voltage drop over cable length — only current matters.",
      "4 mA = 0% of measurement range; 20 mA = 100%. A value below 4 mA indicates a wire fault (broken loop).",
      "HART protocol superimposes a digital signal on the 4-20 mA loop for remote configuration without disconnecting the sensor.",
    ],
    highlight: "Scale: Siemens plants use 50,000+ sensors per facility in real-time SCADA systems",
    color: "#10B981",
  },
  {
    icon: "📻",
    title: "Sampling Rate & Aliasing",
    subtitle: "Nyquist Theorem in Practice",
    content: [
      "Nyquist-Shannon theorem: to reconstruct a signal, you must sample at ≥ 2× the highest frequency component.",
      "An EEG measures brain waves up to 100 Hz — needs ≥ 200 Hz sampling rate to reconstruct faithfully.",
      "Arduino Uno ADC can achieve ~9,600 SPS (samples per second) at default clock settings.",
      "Aliasing occurs when you sample too slowly — a 60 Hz signal sampled at 50 Hz appears as a 10 Hz signal.",
    ],
    highlight: "Audio (20 kHz) → 44.1 kSPS (CD quality); Wi-Fi (2.4 GHz) → 5+ GSps ADCs in chips",
    color: "#8B5CF6",
  },
];

export default function EngineeringInsights() {
  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 09 · Deep Dive
        </p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Engineering Insights</h2>
        <p className="text-sm mb-8 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          How professional engineers think about sensors — from IMU fusion algorithms to industrial 4-20mA networks.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5">
        {INSIGHTS.map((ins, i) => (
          <motion.div
            key={ins.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border p-6"
            style={{ background: `${ins.color}05`, borderColor: `${ins.color}20` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${ins.color}12`, border: `1px solid ${ins.color}30` }}
              >
                {ins.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="text-base font-black" style={{ color: "#F0F0F5" }}>{ins.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: `${ins.color}12`, color: ins.color, border: `1px solid ${ins.color}25` }}>
                    {ins.subtitle}
                  </span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {ins.content.map((line, li) => (
                    <div key={li} className="flex items-start gap-2 text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: ins.color }}>▸</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-xl" style={{ background: `${ins.color}08`, border: `1px solid ${ins.color}20` }}>
                  <span className="text-xs" style={{ color: ins.color }}>💡 {ins.highlight}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
