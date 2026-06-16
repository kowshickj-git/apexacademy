"use client";
import { motion } from "framer-motion";

const COLOR = "#EF4444";

const mistakes = [
  {
    num: "01",
    title: "Missing 120Ω Termination",
    problem: "Signal reflections destroy data integrity at higher speeds. Without termination, waveforms ring and cause spurious bits.",
    fix: "Place a 120Ω resistor at BOTH ends of the bus between CAN-H and CAN-L. Never just one end.",
    tip: "Split termination (2×60Ω with bypass cap) improves common-mode rejection in noisy environments.",
  },
  {
    num: "02",
    title: "Mismatched Bus Speed",
    problem: "ALL nodes on a CAN network must operate at exactly the same baud rate. Even a 1% mismatch causes frame errors.",
    fix: "Set the same speed on every node. Common speeds: 125 kbps, 250 kbps, 500 kbps, 1 Mbps.",
    tip: "Auto-baud detection is available on some transceivers but avoid it in production — hardcode the speed.",
  },
  {
    num: "03",
    title: "Connecting Microcontroller Directly to Bus",
    problem: "MCU GPIO pins cannot drive a differential CAN bus and have no protection from bus transients (up to ±58V).",
    fix: "Always use a CAN transceiver chip: MCP2551, SN65HVD230, TJA1050, ISO1050 (isolated). MCU TX/RX → transceiver → CAN-H/L.",
    tip: "ISO1050 provides 2.5kV galvanic isolation — essential for industrial/EV applications.",
  },
  {
    num: "04",
    title: "Floating or Shared Ground",
    problem: "CAN transceivers require a common ground reference. Without it, the common-mode voltage can exceed transceiver limits.",
    fix: "Connect all nodes to a common ground. In long-distance installations, run a ground wire alongside the CAN pair.",
    tip: "For high-voltage EV systems, use isolated transceivers (ISO1050) to protect low-voltage logic from HV faults.",
  },
];

export default function CommonMistakes() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: "#F0F0F5" }}>
        Common Mistakes
      </h2>
      <div className="space-y-4">
        {mistakes.map((m, i) => (
          <motion.div
            key={m.num}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.14)",
            }}
          >
            <div className="flex items-start gap-4">
              {/* Warning icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(239,68,68,0.12)" }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 3L18 17H2L10 3Z"
                    stroke={COLOR}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <line x1="10" y1="9" x2="10" y2="13" stroke={COLOR} strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="15.5" r="0.75" fill={COLOR} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-mono"
                    style={{ color: "rgba(239,68,68,0.5)" }}
                  >
                    #{m.num}
                  </span>
                  <span className="font-bold text-sm" style={{ color: "#F0F0F5" }}>
                    {m.title}
                  </span>
                </div>
                <div className="text-sm mb-2" style={{ color: "rgba(240,240,245,0.6)" }}>
                  {m.problem}
                </div>
                <div
                  className="flex gap-2 text-xs p-2.5 rounded-lg mb-2"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
                >
                  <span style={{ color: "#10B981", flexShrink: 0 }}>✓ Fix:</span>
                  <span style={{ color: "rgba(240,240,245,0.65)" }}>{m.fix}</span>
                </div>
                <div
                  className="flex gap-2 text-xs p-2"
                  style={{ color: "rgba(240,240,245,0.4)" }}
                >
                  <span style={{ color: COLOR, flexShrink: 0 }}>💡</span>
                  <span>{m.tip}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
