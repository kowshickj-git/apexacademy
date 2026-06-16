"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#0EA5E9";

const MISTAKES = [
  {
    num: "01",
    title: "Missing Pull-Up/Down Resistors",
    symptom: "Digital sensor pin reads random HIGH/LOW values — unstable output",
    wrong: {
      label: "❌ Floating Pin",
      code: `// Button/sensor output directly to Arduino pin
// No pull-up or pull-down resistor
// Result: floating pin = random noise readings`,
    },
    right: {
      label: "✅ With Pull-Up",
      code: `// Use INPUT_PULLUP for active-LOW sensors
pinMode(PIR_PIN, INPUT_PULLUP);

// Or external 10kΩ pull-down to GND
// Sensor output ──┬── Arduino pin
//                └── 10kΩ ── GND`,
    },
    tip: "Always tie unused inputs to VCC or GND. Floating CMOS inputs can oscillate at MHz frequencies and consume significant power.",
  },
  {
    num: "02",
    title: "Reading Analog Sensors Without Averaging",
    symptom: "Sensor readings jitter ±5–20 LSBs even on steady inputs",
    wrong: {
      label: "❌ Single Reading",
      code: `// Single ADC reading is noisy!
int raw = analogRead(A0);
float temp = raw * 0.488; // Very jittery`,
    },
    right: {
      label: "✅ Averaged Reading",
      code: `// Average 10 readings for stability
long sum = 0;
for (int i = 0; i < 10; i++) {
  sum += analogRead(A0);
  delay(2);
}
float temp = (sum / 10.0) * 0.488;`,
    },
    tip: "For critical measurements, use a median filter (take 7 readings, discard 2 highest and 2 lowest, average the middle 3). Even better: hardware capacitor (100nF) on the analog input pin.",
  },
  {
    num: "03",
    title: "Voltage Mismatch — 3.3V vs 5V Sensors",
    symptom: "Sensor gives wrong values or gets damaged; ESP32 reads garbage from 5V sensor",
    wrong: {
      label: "❌ Direct 5V to 3.3V MCU",
      code: `// DHT22 output (5V HIGH) directly to ESP32 GPIO
// ESP32 GPIO is NOT 5V tolerant!
// RISK: Permanent damage to ESP32`,
    },
    right: {
      label: "✅ Level Shifter or Divider",
      code: `// Option 1: Voltage divider for 5V → 3.3V
// Signal ── 10kΩ ──┬── ESP32 GPIO
//                  └── 22kΩ ── GND
// Vout = 5 × 22k/(10k+22k) = 3.44V ✓

// Option 2: Logic level shifter IC (TXS0108E)
// Option 3: Power DHT22 with 3.3V (it works)`,
    },
    tip: "Check your MCU datasheet: Arduino Uno 5V tolerant on all I/O; ESP32 3.3V only; STM32 depends on pin (check FT flag). When in doubt, use a level shifter.",
  },
  {
    num: "04",
    title: "HC-SR04 Echo Overlap — No Delay Between Pings",
    symptom: "Distance readings jump wildly or always show maximum range (400 cm)",
    wrong: {
      label: "❌ No Inter-Ping Delay",
      code: `void loop() {
  // Sending pings too fast!
  // Previous echo overlaps with new trigger pulse
  float dist = getDistance();
  // Readings: 400, 400, 23, 400, 12 ← garbage
}`,
    },
    right: {
      label: "✅ ≥60ms Between Pings",
      code: `void loop() {
  // Wait at least 60ms between pings
  // (ensures echo from previous ping fully decays)
  float dist = getDistance();
  Serial.println(dist);
  delay(60); // Minimum safe inter-ping delay
}`,
    },
    tip: "At maximum range (400 cm), sound takes ~23 ms to travel there and back. Add 37 ms guard time = 60 ms minimum cycle. At 10 cm, you only need ~1 ms — but always use 60 ms to be safe.",
  },
];

export default function CommonMistakes() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 10 · Pitfalls
        </p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Common Mistakes</h2>
        <p className="text-sm mb-8 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          These mistakes cause 80% of sensor debugging sessions. Avoid them from the start.
        </p>
      </motion.div>

      <div className="space-y-3">
        {MISTAKES.map((m, i) => (
          <motion.div
            key={m.num}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: open === i ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)" }}
          >
            <button
              className="w-full text-left px-5 py-4 flex items-center gap-3"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-xs font-mono font-black flex-shrink-0" style={{ color: "rgba(239,68,68,0.6)" }}>{m.num}</span>
              <div className="flex-1">
                <div className="font-bold text-sm" style={{ color: "#F0F0F5" }}>{m.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>{m.symptom}</div>
              </div>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, color: "rgba(240,240,245,0.3)" }}
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
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {/* Wrong */}
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
                        <div className="px-3 py-2 text-xs font-bold" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                          {m.wrong.label}
                        </div>
                        <pre className="px-3 py-3 text-[10px] font-mono overflow-x-auto" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(240,240,245,0.55)", whiteSpace: "pre-wrap" }}>
                          {m.wrong.code}
                        </pre>
                      </div>
                      {/* Right */}
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(16,185,129,0.25)" }}>
                        <div className="px-3 py-2 text-xs font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                          {m.right.label}
                        </div>
                        <pre className="px-3 py-3 text-[10px] font-mono overflow-x-auto" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(240,240,245,0.7)", whiteSpace: "pre-wrap" }}>
                          {m.right.code}
                        </pre>
                      </div>
                    </div>
                    {/* Pro tip */}
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-xl" style={{ background: `rgba(14,165,233,0.06)`, border: `1px solid rgba(14,165,233,0.15)` }}>
                      <span style={{ color: COLOR, flexShrink: 0 }}>💡</span>
                      <span className="text-xs" style={{ color: "rgba(240,240,245,0.6)" }}>{m.tip}</span>
                    </div>
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
