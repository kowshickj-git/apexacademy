"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#F59E0B";

const TAKEAWAYS = [
  {
    title: "RS485 (TIA-485-A): Differential Signaling Standard",
    body: "RS485 transmits data on two wires (A and B) carrying inverted copies of the signal. The receiver measures A−B, making it immune to common-mode noise. Originally defined by the EIA (Electronic Industries Alliance), now TIA (Telecommunications Industry Association).",
  },
  {
    title: "Logic Levels: Differential Voltage Rules",
    body: "Logic 1: A − B ≥ +0.2V. Logic 0: A − B ≤ −0.2V. In practice, transceivers drive ±2V or more for robust margins. The ±15V common-mode range means the bus can float significantly relative to GND without errors.",
  },
  {
    title: "Distance & Speed: The Distance-Speed Tradeoff",
    body: "Maximum distance: 1200m at 100 kbps. Maximum speed: ~10 Mbps at short distances (<15m). The tradeoff is cable capacitance — higher capacitance at long lengths limits rise time and thus maximum baud rate. Use low-capacitance shielded twisted pair (STP) cable for best performance.",
  },
  {
    title: "Multi-Drop Bus: Up to 32 Unit Loads",
    body: "Standard RS485 allows 32 unit loads per segment. A standard device = 1 unit load (~12mA). High-impedance '1/8 unit load' chips (e.g., SN75176B, MAX3085) allow up to 256 devices per segment. Use RS485 repeaters to extend beyond 32 standard loads.",
  },
  {
    title: "Half-Duplex: Direction Control with DE/RE Pins",
    body: "Standard RS485 uses 2 wires (half-duplex). DE (Driver Enable) HIGH = transmit mode. RE (Receiver Enable) LOW = receive mode. They are often tied together and controlled with one GPIO. Some 4-wire RS485 variants support full-duplex but are less common in industrial practice.",
  },
  {
    title: "Modbus RTU: The Industrial Protocol of Choice",
    body: "Modbus RTU is the most widely used application protocol over RS485. It uses address-based master-slave communication. Key function codes: FC01 (Read Coils), FC03 (Read Holding Registers), FC06 (Write Single Register), FC16 (Write Multiple Registers). Frame integrity is verified with CRC-16/IBM checksum.",
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 10 · Summary
        </p>
        <h2 className="text-2xl font-black mb-6" style={{ color: "#F0F0F5" }}>Key Takeaways</h2>

        <div className="space-y-2">
          {TAKEAWAYS.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden"
              style={{
                borderColor: open === i ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)",
                background: open === i ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={{ background: "rgba(245,158,11,0.15)", color: COLOR }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: open === i ? COLOR : "#F0F0F5" }}>
                    {t.title}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  className="text-xs flex-shrink-0 ml-2"
                  style={{ color: "rgba(240,240,245,0.3)" }}
                >
                  ▼
                </motion.span>
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
                    <p className="px-5 pb-4 text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>
                      {t.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
