"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#10B981";

const TAKEAWAYS = [
  {
    num: "01",
    title: "UART = Universal Asynchronous Receiver/Transmitter — full duplex, no clock line",
    summary: "Independent TX and RX, pre-agreed baud rate",
    content: "UART provides independent TX and RX channels, allowing simultaneous transmission and reception (full duplex). The 'asynchronous' means no shared clock — both devices must be pre-configured with the same baud rate to interpret timing correctly. This simplicity makes UART the most widely used serial protocol in embedded systems.",
    color: COLOR,
    code: null,
  },
  {
    num: "02",
    title: "TX of device A ALWAYS connects to RX of device B (wires cross!)",
    summary: "TX is output → RX is input — they must be opposite",
    content: "TX is a transmitter output; RX is a receiver input. They must be connected to their opposite. TX→TX shorts two outputs together and no communication occurs. TX→RX creates a valid sender-to-receiver path. Always 'cross' the wires between devices — MCU1.TX → MCU2.RX and MCU1.RX ← MCU2.TX.",
    color: "#3B82F6",
    code: `// Memory trick: My Output → Your Input
// MCU1.TX ──► MCU2.RX  (A sends to B's receiver)
// MCU1.RX ◄── MCU2.TX  (B sends to A's receiver)
// GND ───────── GND     (ALWAYS connect grounds!)`,
  },
  {
    num: "03",
    title: "Both devices MUST use the same baud rate (e.g., 115200)",
    summary: "Baud = bits per second — both sides must match exactly",
    content: "Baud rate determines how long each bit lasts. At 9600 baud, each bit is 104µs. At 115200, each bit is 8.7µs. Both sender and receiver must use identical baud rate, word length (8), parity (None), and stop bits (1) — commonly written as '115200 8N1'. Even 1% mismatch causes errors over long frames.",
    color: "#F59E0B",
    code: `// Must match on ALL connected devices:
Serial.begin(115200);  // Arduino
// Serial Monitor: set to 115200 baud
// ESP32: Serial.begin(115200)
// GPS module: usually 9600 (check datasheet)`,
  },
  {
    num: "04",
    title: "UART frame: 1 start bit (LOW) + 5-9 data bits (LSB first) + optional parity + 1-2 stop bits (HIGH)",
    summary: "Frame structure wraps every byte of data",
    content: "The idle line sits HIGH (mark state). A falling edge (HIGH→LOW transition) is the start bit that wakes up the receiver. Data bits follow in LSB-first order (least significant bit first). An optional parity bit provides basic error detection. Stop bit(s) return the line to HIGH. With 8N1: 10 total bits for 8 data bits = 25% overhead.",
    color: "#8B5CF6",
    code: `// 8N1 frame for byte 'A' (0x41 = 01000001):
// IDLE  START D0 D1 D2 D3 D4 D5 D6 D7  STOP IDLE
//  1     0    1  0  0  0  0  0  1  0    1    1
//            LSB────────────────────MSB`,
  },
  {
    num: "05",
    title: "8N1 (8 data bits, No parity, 1 stop bit) is the universal default",
    summary: "99% of UART uses 8N1 — covers all ASCII and binary data",
    content: "8N1 means: 8-bit data word (covers full ASCII 0-127 and extended ASCII 0-255), no error-checking parity bit, and 1 stop bit. When in doubt, use 8N1. Devices like GPS modules, Bluetooth adapters, and GSM modules default to either 9600 8N1 or 115200 8N1. Only legacy industrial equipment uses other configurations.",
    color: COLOR,
    code: `// 8N1 breakdown:
// 8 → data bits (8 bits = 1 byte = 0-255 values)
// N → No parity (no error checking bit)
// 1 → 1 stop bit

// Other formats (rare):
// 7E1 = 7 data, Even parity, 1 stop (Modbus)
// 8E2 = 8 data, Even parity, 2 stop (legacy)`,
  },
  {
    num: "06",
    title: "Check voltage compatibility: 5V TX → 3.3V RX needs level conversion",
    summary: "5V HIGH can permanently damage 3.3V GPIO pins",
    content: "5V HIGH (4.8V typical) exceeds ESP32's absolute maximum input voltage (3.6V). This can permanently damage the GPIO. Only the HIGH-voltage→LOW-voltage direction matters: 3.3V TX → 5V RX is safe (3.3V > VIH threshold of 2.4V). Use a voltage divider (1kΩ + 2kΩ) or dedicated level shifter IC (BSS138, TXB0108) for the 5V→3.3V direction only.",
    color: "#EF4444",
    code: `// Safe direction (no conversion needed):
// 3.3V TX ──────────────► 5V RX  ✓
// 3.3V > 2.4V (5V VIH threshold)

// Dangerous (needs level conversion!):
// 5V TX ── 1kΩ ──┬── 3.3V RX  ✓ (with divider)
//                └── 2kΩ ── GND
// Vout = 5 × 2/(1+2) = 3.33V ✓`,
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Key Takeaways</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Key Takeaways</h2>
        <p className="text-sm mb-8 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          Six core concepts you must know cold before using UART in any project. Click each to expand.
        </p>
      </motion.div>

      <div className="space-y-2">
        {TAKEAWAYS.map((t, i) => (
          <motion.div
            key={t.num}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
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
