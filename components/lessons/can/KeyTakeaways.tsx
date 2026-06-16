"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#EF4444";

const items = [
  {
    title: "CAN = Controller Area Network",
    content:
      "Developed by Robert Bosch GmbH in 1986 and standardized as ISO 11898. Originally designed for automotive use, now widely used in industrial automation, medical devices, marine, and aerospace. A fundamental embedded systems protocol.",
  },
  {
    title: "Two-Wire Differential Signaling",
    content:
      "CAN uses CAN-H and CAN-L twisted pair. Dominant bit: CAN-H=3.5V, CAN-L=1.5V (differential=2V). Recessive bit: both lines float to 2.5V (differential≈0V). Dominant overrides recessive — critical for arbitration and error frames.",
  },
  {
    title: "Message-Based with 11-bit ID Priority",
    content:
      "Each CAN frame carries an 11-bit message identifier (standard frame). Lower numerical ID = higher bus priority. The ID identifies the message content and priority — there are no node addresses. Extended frames (CAN 2.0B) use 29-bit IDs.",
  },
  {
    title: "Non-Destructive Arbitration",
    content:
      "Multiple nodes can start transmitting simultaneously. Each node monitors the bus while transmitting. When a node transmits recessive but reads dominant, it immediately backs off. The winning node continues without any frame corruption — no data is lost.",
  },
  {
    title: "Robust Error Detection",
    content:
      "CAN has 5 error detection mechanisms: CRC (15-bit checksum), bit monitoring, bit stuffing (after 5 same bits, insert opposite), frame check (fixed-format fields), and ACK check. Error confinement uses Transmit Error Counter (TEC): Error Active (TEC<128) → Error Passive (128≤TEC≤255) → Bus-Off (TEC>255).",
  },
  {
    title: "120Ω Termination at Both Ends Required",
    content:
      "A 120Ω resistor must be placed between CAN-H and CAN-L at each physical end of the bus. This matches the characteristic impedance of the twisted pair (~120Ω) and prevents signal reflections. One resistor or three resistors are wrong — it must be exactly two, one at each end.",
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: "#F0F0F5" }}>
        Key Takeaways
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${open === i ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}` }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
              style={{
                background:
                  open === i
                    ? "rgba(239,68,68,0.07)"
                    : "rgba(255,255,255,0.02)",
                cursor: "pointer",
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{
                  background:
                    open === i ? COLOR : "rgba(239,68,68,0.12)",
                  color: open === i ? "#fff" : COLOR,
                }}
              >
                {i + 1}
              </span>
              <span
                className="font-semibold text-sm flex-1"
                style={{ color: open === i ? "#F0F0F5" : "rgba(240,240,245,0.7)" }}
              >
                {item.title}
              </span>
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M3 5l4 4 4-4"
                  stroke={open === i ? COLOR : "rgba(240,240,245,0.35)"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="px-4 pb-4 pt-1 text-sm"
                    style={{ color: "rgba(240,240,245,0.6)", lineHeight: 1.65 }}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
