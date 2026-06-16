"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#10B981";

const PROBLEMS = [
  {
    icon: "⚠️",
    title: "Garbled/Scrambled Characters ???",
    diagnosis: "Baud Rate Mismatch",
    diagColor: "#F59E0B",
    explanation: "Sender and receiver are using different baud rates. At 9600 baud, each bit lasts 104µs. If receiver is at 115200, it samples every 8.7µs — grabbing wrong bit values. The receiver misinterprets multiple sender bits as one bit, producing garbage characters.",
    fixCode: `// BOTH devices must use the same baud rate!
// Device 1 (Arduino):
Serial.begin(115200);  // Set baud rate

// Device 2 (Serial Monitor / other MCU):
// Must ALSO be set to 115200

// Common mistake: Arduino at 115200, Serial Monitor at 9600`,
    checklist: [
      "Check baud rate in Serial.begin() on your Arduino",
      "Check baud rate dropdown in Serial Monitor (bottom right)",
      "Check datasheet for module's default baud rate (GPS=9600, HC-05=9600 or 38400)",
      "Try common baud rates: 9600, 115200, 57600, 38400",
    ],
  },
  {
    icon: "🔇",
    title: "No Data Received (nothing appears)",
    diagnosis: "TX/RX Not Crossed",
    diagColor: "#EF4444",
    explanation: "TX of one device must connect to RX of the other. If TX→TX, both devices are transmitting onto the same wire but nobody is listening on the correct pin. The RX pin of the receiver is floating and picks up noise.",
    fixCode: `// CORRECT wiring (wires CROSS between devices):
// MCU1.TX  ──────────────►  MCU2.RX
// MCU1.RX  ◄──────────────  MCU2.TX
// MCU1.GND ────────────────  MCU2.GND  (REQUIRED!)

// WRONG (both transmitting on same wire):
// MCU1.TX ──────────── MCU2.TX  ✗`,
    checklist: [
      "Verify TX of one device goes to RX of the other",
      "Check GND is connected between both devices",
      "Try swapping TX/RX wires if still no data",
      "Verify both devices are powered (VCC connected)",
      "Check baud rate is matching on both devices",
    ],
  },
  {
    icon: "🌩️",
    title: "Random Garbage Bytes Appearing",
    diagnosis: "Voltage Level Mismatch",
    diagColor: "#EF4444",
    explanation: "A 5V Arduino TX line drives 5V HIGH into a 3.3V ESP32 RX pin. The ESP32's absolute maximum input voltage is 3.6V — 5V exceeds this and can permanently damage or confuse the GPIO. Also check for electrical noise on long cables.",
    fixCode: `// Option 1: Voltage Divider (5V TX → 3.3V RX)
// A.TX ── 1kΩ ──┬── B.RX (ESP32)
//               └── 2kΩ ── GND
// Vout = 5V × 2k/(1k+2k) = 3.33V ✓

// Option 2: Level shifter IC
// BSS138 MOSFET level shifter
// TXB0108 bidirectional 8-channel shifter

// Note: B.TX (3.3V) → A.RX (5V) is SAFE
// 3.3V > 2.4V (5V VIH minimum threshold)`,
    checklist: [
      "Check voltage levels of both devices (3.3V vs 5V)",
      "Use voltage divider for 5V TX → 3.3V RX direction only",
      "3.3V TX → 5V RX is safe (no level shifting needed)",
      "Add 100nF decoupling capacitor near device power pins",
      "Use short cables (<30cm) to reduce noise pickup",
    ],
  },
  {
    icon: "🚀",
    title: "Missing First Bytes of Transmission",
    diagnosis: "Serial.begin() Called Too Late",
    diagColor: "#F59E0B",
    explanation: "UART hardware isn't initialized until Serial.begin() is called. Any print statements before begin() are discarded silently. Also, the UART hardware needs a few milliseconds to stabilize after initialization before reliable communication starts.",
    fixCode: `void setup() {
  // MUST call Serial.begin() FIRST
  Serial.begin(115200);
  delay(100);  // Let UART hardware stabilize

  // Now safe to print:
  Serial.println("System started");
  Serial.println("Version: 1.0.0");
}

// WRONG: printing before begin (lost forever):
// Serial.println("Boot");  // ← LOST!
// Serial.begin(115200);    // ← too late`,
    checklist: [
      "Ensure Serial.begin() is the first line in setup()",
      "Add delay(100) after Serial.begin() for stability",
      "For very early boot messages, use F() macro: Serial.println(F(\"Boot\"))",
      "Check USB-Serial chip is properly recognized by OS",
    ],
  },
  {
    icon: "📭",
    title: "Communication Works Sometimes but Drops Data",
    diagnosis: "Buffer Overflow or Timing Issue",
    diagColor: "#8B5CF6",
    explanation: "Arduino's UART receive buffer is only 64 bytes by default. If your sender transmits faster than your loop() reads the buffer, it overflows and new data overwrites old data silently. Large bursts of data at high baud rates are especially vulnerable.",
    fixCode: `// Read Serial data promptly in loop():
void loop() {
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\\n');
    processCommand(data);  // Handle immediately
  }
  // Don't do heavy work that delays Serial reads!
}

// Increase buffer size (add to top of sketch):
// #define RX_BUFFER_SIZE 256
// (May not work on all Arduino versions)

// Or use Serial.read() byte-by-byte for max control`,
    checklist: [
      "Read Serial.available() every loop iteration",
      "Don't use long delay() calls while receiving data",
      "Consider non-blocking state machine instead of readString()",
      "Reduce baud rate if data loss persists",
      "Arduino Mega has larger buffers — consider upgrading",
    ],
  },
];

export default function UARTDebugger({ onUsed }: Props) {
  const [openProblem, setOpenProblem] = useState<number | null>(null);
  const calledRef = useRef(false);

  function handleClick(i: number) {
    if (!calledRef.current) { calledRef.current = true; onUsed(); }
    setOpenProblem(openProblem === i ? null : i);
  }

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 08 · UART Debugger</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>UART Problem Debugger</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
          Click a symptom to diagnose and fix. These cover 95% of all UART debugging sessions.
        </p>
      </motion.div>

      <div className="space-y-3">
        {PROBLEMS.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: openProblem === i ? `${p.diagColor}40` : "rgba(255,255,255,0.07)",
            }}
          >
            <button
              className="w-full text-left px-5 py-4 flex items-center gap-3"
              onClick={() => handleClick(i)}
            >
              <span className="text-lg flex-shrink-0">{p.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-sm" style={{ color: "#F0F0F5" }}>{p.title}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="hidden sm:inline text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: `${p.diagColor}15`, color: p.diagColor, border: `1px solid ${p.diagColor}30` }}
                >
                  {p.diagnosis}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{ transform: openProblem === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, color: "rgba(240,240,245,0.3)" }}
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </button>

            <AnimatePresence>
              {openProblem === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    {/* Diagnosis badge */}
                    <div className="flex items-center gap-2 mt-4 mb-3">
                      <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: `${p.diagColor}15`, color: p.diagColor, border: `1px solid ${p.diagColor}30` }}>
                        Diagnosis: {p.diagnosis}
                      </span>
                    </div>

                    {/* Explanation */}
                    <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.6)" }}>{p.explanation}</p>

                    {/* Fix code */}
                    <div className="rounded-xl overflow-hidden border mb-4" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
                      <div className="px-3 py-2 text-xs font-bold" style={{ background: "rgba(16,185,129,0.1)", color: COLOR }}>
                        ✅ Fix
                      </div>
                      <pre className="px-4 py-3 text-[10px] font-mono overflow-x-auto" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(240,240,245,0.7)", whiteSpace: "pre-wrap" }}>
                        {p.fixCode}
                      </pre>
                    </div>

                    {/* Checklist */}
                    <div className="rounded-xl p-4" style={{ background: `rgba(16,185,129,0.05)`, border: `1px solid rgba(16,185,129,0.12)` }}>
                      <div className="text-xs font-bold mb-2" style={{ color: COLOR }}>Debugging Checklist:</div>
                      <div className="space-y-1.5">
                        {p.checklist.map((item, ci) => (
                          <div key={ci} className="flex items-start gap-2 text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" className="mt-0.5 flex-shrink-0">
                              <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="rgba(16,185,129,0.4)" strokeWidth="1" fill="none" />
                            </svg>
                            {item}
                          </div>
                        ))}
                      </div>
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
