"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#10B981";

const MISTAKES = [
  {
    num: "01",
    title: "TX→TX instead of TX→RX (Most Common!)",
    symptom: "No communication at all — both devices transmit to each other's transmit pin",
    wrong: {
      label: "❌ TX→TX (Both transmitting)",
      code: `// WRONG wiring:
MCU.TX ──────────── Device.TX
// Both are OUTPUT pins driving the same wire!
// They fight each other — no data transfers.`,
    },
    right: {
      label: "✅ TX→RX (Transmitter to Receiver)",
      code: `// CORRECT wiring (always cross):
MCU.TX ──────────►  Device.RX
MCU.RX  ◄──────────  Device.TX
MCU.GND ─────────── Device.GND`,
    },
    tip: "Remember: 'My Output goes to Your Input.' TX (transmit output) connects to RX (receive input). Always. The wires cross between the two devices.",
  },
  {
    num: "02",
    title: "Baud Rate Mismatch",
    symptom: "Garbled characters like '??ÿÿ' or random symbols appearing in Serial Monitor",
    wrong: {
      label: "❌ Different Baud Rates",
      code: `// Arduino sends at 9600:
Serial.begin(9600);
Serial.println("Hello");

// But receiving device expects 115200!
// Result: ÿ??¿¡ÿ? (garbage)`,
    },
    right: {
      label: "✅ Matching Baud Rates",
      code: `// BOTH devices must use the SAME baud rate:

// Arduino:
Serial.begin(115200);  // ← must match

// Serial Monitor / other device:
// Set dropdown to: 115200 baud  ← must match

// Common default baud rates to try:
// 9600 (GPS), 115200 (most MCUs), 38400, 57600`,
    },
    tip: "Most common baud rates to try: 9600, 115200, 57600, 38400. GPS modules (NEO-6M) default to 9600. HC-05 Bluetooth defaults to 9600 (AT mode) or 38400 (data mode). Always check the datasheet.",
  },
  {
    num: "03",
    title: "5V UART TX into 3.3V RX Pin (DESTROYER!)",
    symptom: "ESP32/STM32 RX pin permanently damaged — device becomes unresponsive or unreliable",
    wrong: {
      label: "❌ Direct 5V to 3.3V (Dangerous!)",
      code: `// Arduino 5V TX → ESP32 3.3V RX
// Arduino TX outputs 5V HIGH
// ESP32 GPIO max input: 3.6V absolute maximum
// RESULT: Permanent gate oxide damage!
// ESP32 may work initially, then fail randomly.`,
    },
    right: {
      label: "✅ Level Shifted Safely",
      code: `// Voltage Divider (simple, cheap):
// A.TX ── 1kΩ ──┬── B.RX (ESP32)
//               └── 2kΩ ── GND
// Vout = 5 × 2k/(1k+2k) = 3.33V ✓

// Or: BSS138 MOSFET level shifter
// Or: Power ESP32 TXD module at 3.3V directly
// Note: ESP32 TX (3.3V) → Arduino RX (5V) is SAFE`,
    },
    tip: "ONLY the TX→RX direction needs level shifting when going 5V→3.3V. The 3.3V TX can go directly to 5V RX — 3.3V HIGH is above the 5V VIH threshold of ~2.4V minimum. Don't over-engineer the safe direction.",
  },
  {
    num: "04",
    title: "Not Checking Serial.available() Before Serial.read()",
    symptom: "Serial.read() returns -1 (0xFF); code processes garbage value -1 as a valid character",
    wrong: {
      label: "❌ Reading Without Checking",
      code: `void loop() {
  // WRONG: reads -1 if no data waiting!
  char c = Serial.read(); // Returns -1 = 0xFF
  if (c == 'A') {         // -1 != 'A', but...
    doSomething();         // -1 cast to char = 255
  }
  // Code runs unpredictably!
}`,
    },
    right: {
      label: "✅ Always Check First",
      code: `void loop() {
  // CORRECT: check before reading
  if (Serial.available() > 0) {
    char c = Serial.read();  // Always valid data
    if (c == 'A') {
      doSomething();
    }
  }

  // Or use readStringUntil() — blocks until newline:
  // String cmd = Serial.readStringUntil('\\n');
}`,
    },
    tip: "Serial.available() returns the number of bytes waiting in the receive buffer (0–64). Always check it first. Or use Serial.readStringUntil('\\n') which blocks until a newline arrives — great for command parsing but blocks your loop().",
  },
];

export default function CommonMistakes() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Common Mistakes</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Common Mistakes</h2>
        <p className="text-sm mb-8 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          These four mistakes cause 90% of UART debugging sessions. Memorize them and skip hours of frustration.
        </p>
      </motion.div>

      <div className="space-y-3">
        {MISTAKES.map((m, i) => (
          <motion.div
            key={m.num}
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
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
                        <div className="px-3 py-2 text-xs font-bold" style={{ background: "rgba(16,185,129,0.1)", color: COLOR }}>
                          {m.right.label}
                        </div>
                        <pre className="px-3 py-3 text-[10px] font-mono overflow-x-auto" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(240,240,245,0.7)", whiteSpace: "pre-wrap" }}>
                          {m.right.code}
                        </pre>
                      </div>
                    </div>
                    {/* Pro tip */}
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-xl" style={{ background: `rgba(16,185,129,0.06)`, border: `1px solid rgba(16,185,129,0.15)` }}>
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
