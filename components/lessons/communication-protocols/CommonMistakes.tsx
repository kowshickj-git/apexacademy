"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#8B5CF6";

const MISTAKES = [
  {
    title: "Connecting 5V UART directly to a 3.3V device",
    icon: "⚡",
    symptom: "Device stops responding, gets hot, or is permanently damaged",
    wrong: "Direct wire: 5V TX → 3.3V RX (no level shifting)",
    fix: "Use a TXB0108 level shifter, BSS138 MOSFET, or resistor divider (1kΩ + 2kΩ)",
    tip: "ESP32, STM32, Raspberry Pi GPIO are all 3.3V only. Arduino Uno is 5V. Never connect them directly without a level shifter.",
  },
  {
    title: "Using UART for long distances (> 15m)",
    icon: "📏",
    symptom: "Signal degrades, bit errors, garbled or missing data at long distances",
    wrong: "Long UART cable (TTL single-ended) run across a room or building",
    fix: "Convert to RS485 (up to 1200m) or CAN (up to 500m) for long runs",
    tip: "RS485 uses differential signaling — the receiver reads the difference between two wires (A and B), making it 100× more noise resistant than single-ended UART.",
  },
  {
    title: "Forgetting pull-up resistors on I2C",
    icon: "🔌",
    symptom: "I2C bus hangs, no ACK from devices, SDA or SCL stuck LOW, bus timeout",
    wrong: "I2C bus with no external pull-ups (devices use open-drain outputs — they can only pull LOW)",
    fix: "Add 4.7kΩ pull-up resistors from SDA and SCL to VCC (2.2kΩ for 400kHz Fast Mode)",
    tip: "Some breakout boards (like GY-521 for MPU6050) include built-in pull-ups. Check the schematic before adding more — too many pull-ups reduces noise margin.",
  },
  {
    title: "Wrong baud rate on UART",
    icon: "🔢",
    symptom: 'Garbled characters like "?ÿÿÿ" or "ð¬" in serial monitor. Data looks random.',
    wrong: "Sender configured at 115200 baud, receiver configured at 9600 baud",
    fix: "Both sides must use IDENTICAL baud rate AND identical data format (e.g., 115200 8N1 = 8 data bits, No parity, 1 stop bit)",
    tip: "If you see garbage data, try the most common baud rates in order: 9600, 115200, 57600, 38400, 19200. One of them will usually give readable output.",
  },
];

export default function CommonMistakes() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Common Mistakes</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Common Mistakes</h2>
        <p className="text-sm mb-7" style={{ color: "rgba(240,240,245,0.45)" }}>
          These mistakes waste hours. Know them before they happen to you.
        </p>

        <div className="space-y-3">
          {MISTAKES.map((m, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={m.title}
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: isOpen ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.07)",
                  background: isOpen ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.02)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                >
                  <span className="text-xl flex-shrink-0">{m.icon}</span>
                  <span className="flex-1 text-sm font-semibold" style={{ color: isOpen ? "#EF4444" : "#F0F0F5" }}>
                    {m.title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-sm"
                    style={{ color: "rgba(240,240,245,0.3)" }}
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3">
                        {/* Symptom */}
                        <div className="p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                          <div className="text-[10px] font-mono font-bold mb-1" style={{ color: "#EF4444" }}>SYMPTOM</div>
                          <div className="text-xs" style={{ color: "rgba(240,240,245,0.65)" }}>{m.symptom}</div>
                        </div>

                        {/* Wrong */}
                        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <div className="text-[10px] font-mono font-bold mb-1" style={{ color: "rgba(239,68,68,0.7)" }}>✗ WRONG</div>
                          <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.5)" }}>{m.wrong}</div>
                        </div>

                        {/* Fix */}
                        <div className="p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                          <div className="text-[10px] font-mono font-bold mb-1" style={{ color: "#10B981" }}>✓ FIX</div>
                          <div className="text-xs" style={{ color: "rgba(240,240,245,0.65)" }}>{m.fix}</div>
                        </div>

                        {/* Pro tip */}
                        <div className="p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.18)" }}>
                          <div className="text-[10px] font-mono font-bold mb-1" style={{ color: COLOR }}>💡 PRO TIP</div>
                          <div className="text-xs" style={{ color: "rgba(240,240,245,0.6)" }}>{m.tip}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
