"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#0EA5E9";

const TAKEAWAYS = [
  {
    num: "01",
    title: "Sensors are transducers",
    summary: "Convert physical → electrical",
    content: "A sensor converts a physical parameter (temperature, light, distance, motion, pressure, humidity) into an electrical signal (voltage, current, resistance, or digital data) that a microcontroller can read. Without sensors, machines cannot perceive the physical world.",
    code: null,
    color: COLOR,
  },
  {
    num: "02",
    title: "Analog vs Digital sensors",
    summary: "Continuous output vs discrete data",
    content: "Analog sensors output a continuous voltage/resistance proportional to the measured quantity — read with analogRead() (0–1023 on Arduino Uno). Digital sensors output HIGH/LOW or serial data (I2C, SPI, UART, 1-Wire) — read with digitalRead() or a library.",
    code: "analogRead(A0)   // Analog: 0–1023\ndigitalRead(2)   // Digital: HIGH or LOW",
    color: "#F59E0B",
  },
  {
    num: "03",
    title: "Key sensor specifications",
    summary: "Range, resolution, accuracy, sensitivity",
    content: "Range: min/max measurable values. Resolution: smallest detectable change (10-bit ADC → 1024 steps). Accuracy: closeness to true value. Precision: repeatability. Sensitivity: output change per input unit. Response time: settling speed. Always check these in the datasheet.",
    code: null,
    color: "#10B981",
  },
  {
    num: "04",
    title: "HC-SR04 ultrasonic formula",
    summary: "Echo time → distance in cm",
    content: "The HC-SR04 sends a 10µs TRIG pulse, then measures the ECHO pulse width. Speed of sound ≈ 343 m/s at 20°C. The formula divides by 58.2 because: (1,000,000 µs/s) / (34300 cm/s) / 2 (round trip) = 1/58.2.",
    code: "long echo = pulseIn(ECHO, HIGH); // µs\nfloat cm = echo / 58.2;",
    color: COLOR,
  },
  {
    num: "05",
    title: "LDR voltage divider",
    summary: "1MΩ dark → 1kΩ bright — needs voltage divider",
    content: "An LDR changes resistance logarithmically with light. To read it with an ADC, you need a voltage divider: Vout = Vsupply × R_fixed / (R_fixed + R_LDR). Use 10kΩ as the fixed resistor for LDR values in the 1kΩ–1MΩ range. Brighter light → lower LDR resistance → higher Vout.",
    code: "// Vout = 5V × 10kΩ / (10kΩ + R_LDR)\nint raw = analogRead(A0); // 0–1023",
    color: "#F59E0B",
  },
  {
    num: "06",
    title: "Sensor fusion",
    summary: "Combine sensors for better accuracy",
    content: "No single sensor is perfect. Combining multiple sensor readings — sensor fusion — compensates for individual weaknesses. The MPU-6050 fuses gyroscope (fast but drifting) with accelerometer (noisy but stable) using a Kalman filter to achieve precise, stable orientation. The same principle applies everywhere: GPS + IMU, pressure + temperature, etc.",
    code: "// Complementary filter (simplified)\nangle = 0.98 * (angle + gyro * dt)\n      + 0.02 * accel_angle;",
    color: "#8B5CF6",
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 11 · Summary
        </p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Key Takeaways</h2>
        <p className="text-sm mb-8 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          Six core concepts you must know cold. Click each to expand.
        </p>
      </motion.div>

      <div className="space-y-2">
        {TAKEAWAYS.map((t, i) => (
          <motion.div
            key={t.num}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border overflow-hidden"
            style={{
              background: open === i ? `${t.color}06` : "rgba(255,255,255,0.02)",
              borderColor: open === i ? `${t.color}30` : "rgba(255,255,255,0.07)",
            }}
          >
            <button
              className="w-full text-left px-5 py-4 flex items-center gap-4"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black font-mono"
                style={{ background: `${t.color}15`, color: t.color }}
              >
                {t.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: "#F0F0F5" }}>{t.title}</div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>{t.summary}</div>
              </div>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, color: "rgba(240,240,245,0.3)" }}
              >
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <p className="text-sm mt-4 mb-3" style={{ color: "rgba(240,240,245,0.6)" }}>{t.content}</p>
                    {t.code && (
                      <pre
                        className="px-4 py-3 rounded-xl text-xs font-mono overflow-x-auto"
                        style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)", color: t.color, whiteSpace: "pre-wrap" }}
                      >
                        {t.code}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
