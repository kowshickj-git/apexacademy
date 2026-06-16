"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#8B5CF6";

const TAKEAWAYS = [
  {
    title: "A communication protocol is a set of rules for data exchange",
    detail: "Without agreed rules, devices can't understand each other even if electrically connected. The protocol defines voltage levels, timing, frame structure, and error handling. Two devices wired together without matching protocols will just produce garbage data.",
  },
  {
    title: "Serial sends bits one at a time; parallel sends multiple simultaneously",
    detail: "Modern embedded systems use serial protocols (UART, I2C, SPI, CAN). At high frequencies, serial wins due to less crosstalk and simpler wiring. That's why USB, PCIe, and SATA are all serial despite needing very high bandwidth.",
  },
  {
    title: "Synchronous protocols use a shared clock (I2C, SPI); asynchronous use agreed baud rate (UART)",
    detail: "Synchronous: a clock line ensures perfect bit timing — receiver samples data on each clock edge, regardless of speed. Asynchronous: both sides must be configured with identical baud rate before communication begins. No clock means simpler wiring but less flexibility.",
  },
  {
    title: "Full duplex = both directions simultaneously; half duplex = one direction at a time",
    detail: "UART is full duplex: separate TX and RX lines allow simultaneous sending and receiving — like a phone call. I2C, CAN, RS485 are half duplex: shared bus means devices must take turns — like a walkie-talkie. SPI is full duplex with separate MOSI and MISO lines.",
  },
  {
    title: "Choose protocol by: number of devices, distance, speed, power consumption",
    detail: "Use I2C for multiple slow sensors on a board (up to 127 devices on 2 wires). Use SPI for high-speed displays, memory, or ADCs (fastest protocol, full duplex). Use UART for simple point-to-point communication. Use RS485 or CAN for industrial long-distance multi-node networks.",
  },
  {
    title: "Always check voltage compatibility between communicating devices",
    detail: "Mismatched voltages are the #1 cause of destroyed microcontroller pins in hobby and professional projects. 5V Arduino logic ≠ 3.3V ESP32 logic ≠ 1.8V modern ARM SoC. Always check the datasheet for VIH, VIL, and absolute maximum ratings. Use level shifters when voltage levels differ.",
  },
];

export default function KeyTakeaways() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Key Takeaways</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Key Takeaways</h2>
        <p className="text-sm mb-7" style={{ color: "rgba(240,240,245,0.45)" }}>
          The six most important concepts from this lesson. Click each to expand.
        </p>

        <div className="space-y-2">
          {TAKEAWAYS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl overflow-hidden border"
                style={{
                  borderColor: isOpen ? "rgba(139,92,246,0.45)" : "rgba(255,255,255,0.07)",
                  borderLeft: isOpen ? `3px solid ${COLOR}` : "3px solid transparent",
                  background: isOpen ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.02)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: isOpen ? COLOR : "rgba(139,92,246,0.15)", color: isOpen ? "white" : COLOR }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-semibold" style={{ color: isOpen ? "#F0F0F5" : "rgba(240,240,245,0.7)" }}>
                    {item.title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "rgba(240,240,245,0.25)", fontSize: "12px" }}
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
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4">
                        <div
                          className="text-sm rounded-xl p-3"
                          style={{ color: "rgba(240,240,245,0.6)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)" }}
                        >
                          {item.detail}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
