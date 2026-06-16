"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#EF4444";

const fields = [
  {
    name: "SOF",
    bits: "1 bit",
    color: "#EF4444",
    desc: "Start of Frame — always a dominant (0) bit. Signals all nodes that a new frame is beginning and synchronizes their clocks to the transmitter.",
  },
  {
    name: "Arbitration",
    bits: "11 bits",
    color: "#F97316",
    desc: "Message Identifier (ID) — 11-bit value that identifies the message content and priority. Lower ID = higher priority. Used for non-destructive bus arbitration.",
  },
  {
    name: "RTR",
    bits: "1 bit",
    color: "#EAB308",
    desc: "Remote Transmission Request — 0 (dominant) for data frames, 1 (recessive) for remote frames requesting data from another node.",
  },
  {
    name: "IDE",
    bits: "1 bit",
    color: "#22C55E",
    desc: "Identifier Extension — 0 (dominant) for standard 11-bit frame, 1 (recessive) for extended 29-bit frame (CAN 2.0B). Distinguishes frame types.",
  },
  {
    name: "r0",
    bits: "1 bit",
    color: "#14B8A6",
    desc: "Reserved bit — must be transmitted as dominant (0). Reserved for future extensions. Receivers accept both dominant and recessive.",
  },
  {
    name: "DLC",
    bits: "4 bits",
    color: "#3B82F6",
    desc: "Data Length Code — specifies how many bytes of data follow (0–8 bytes). Values 9–15 are not used in classic CAN (CAN FD extends this).",
  },
  {
    name: "Data",
    bits: "0–64 bits",
    color: "#8B5CF6",
    desc: "Payload data — 0 to 8 bytes of actual message content. Can be sensor readings, commands, status values. Format is application-defined.",
  },
  {
    name: "CRC",
    bits: "15 bits",
    color: "#EC4899",
    desc: "Cyclic Redundancy Check — 15-bit checksum calculated over all bits from SOF to end of Data field. Detects up to 5 random bit errors.",
  },
  {
    name: "CRC Del",
    bits: "1 bit",
    color: "#F43F5E",
    desc: "CRC Delimiter — always recessive (1). Separates CRC from ACK slot. Provides a boundary for the CRC field.",
  },
  {
    name: "ACK",
    bits: "1 bit",
    color: "#10B981",
    desc: "Acknowledge — transmitter sends recessive (1), any correctly receiving node overwrites it with dominant (0) to acknowledge reception.",
  },
  {
    name: "ACK Del",
    bits: "1 bit",
    color: "#6EE7B7",
    desc: "ACK Delimiter — always recessive (1). Separates ACK from EOF. Cannot be overwritten; transmitter checks this for errors.",
  },
  {
    name: "EOF",
    bits: "7 bits",
    color: "#94A3B8",
    desc: "End of Frame — 7 recessive bits marking the end of the data frame. Any dominant bit here causes a frame error.",
  },
];

export default function CANFrameAnim() {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => setActiveIdx((i) => Math.min(i + 1, fields.length - 1));
  const handlePrev = () => setActiveIdx((i) => Math.max(i - 1, 0));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>
          CAN Standard Data Frame
        </h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.45)" }}>
          Step through each field of a CAN frame
        </p>

        {/* Frame fields row */}
        <div className="flex overflow-x-auto gap-1 pb-3 mb-6">
          {fields.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setActiveIdx(i)}
              className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer"
            >
              <div
                className="rounded-lg px-2 py-2 text-center transition-all duration-200"
                style={{
                  background:
                    i === activeIdx
                      ? `${f.color}30`
                      : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${i === activeIdx ? f.color : "rgba(255,255,255,0.08)"}`,
                  minWidth: f.name === "Data" ? 56 : f.name === "Arbitration" ? 52 : 36,
                  transform: i === activeIdx ? "translateY(-4px)" : "none",
                  boxShadow: i === activeIdx ? `0 4px 16px ${f.color}30` : "none",
                }}
              >
                <div
                  className="text-xs font-bold leading-tight whitespace-nowrap"
                  style={{ color: i === activeIdx ? f.color : "rgba(240,240,245,0.4)", fontSize: "9px" }}
                >
                  {f.name}
                </div>
                <div
                  className="text-xs mt-0.5 whitespace-nowrap"
                  style={{ color: "rgba(240,240,245,0.3)", fontSize: "8px" }}
                >
                  {f.bits}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active field explanation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl p-5 mb-5"
            style={{
              background: `${fields[activeIdx].color}12`,
              border: `1px solid ${fields[activeIdx].color}35`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  background: `${fields[activeIdx].color}25`,
                  color: fields[activeIdx].color,
                }}
              >
                {fields[activeIdx].name}
              </div>
              <span
                className="font-mono text-xs px-2 py-1 rounded"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(240,240,245,0.6)",
                }}
              >
                {fields[activeIdx].bits}
              </span>
              <span className="text-xs" style={{ color: "rgba(240,240,245,0.3)" }}>
                Field {activeIdx + 1} of {fields.length}
              </span>
            </div>
            <p style={{ color: "rgba(240,240,245,0.75)", lineHeight: 1.6 }}>
              {fields[activeIdx].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={activeIdx === 0}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: activeIdx === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
              color: activeIdx === 0 ? "rgba(240,240,245,0.25)" : "rgba(240,240,245,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: activeIdx === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← Prev Field
          </button>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${COLOR}, #F97316)` }}
              animate={{ width: `${((activeIdx + 1) / fields.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <button
            onClick={handleNext}
            disabled={activeIdx === fields.length - 1}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background:
                activeIdx === fields.length - 1
                  ? "rgba(239,68,68,0.06)"
                  : "rgba(239,68,68,0.15)",
              color:
                activeIdx === fields.length - 1
                  ? "rgba(239,68,68,0.3)"
                  : COLOR,
              border: `1px solid ${activeIdx === fields.length - 1 ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.3)"}`,
              cursor: activeIdx === fields.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next Field →
          </button>
        </div>
      </div>
    </motion.section>
  );
}
