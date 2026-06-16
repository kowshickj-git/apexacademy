"use client";
import { motion } from "framer-motion";

const COLOR = "#F59E0B";

const MISTAKES = [
  {
    num: "01",
    title: "Reversing A and B Lines",
    problem: "Communication fails or data is inverted. Logic levels are swapped.",
    fix: "Check your transceiver datasheet carefully — some manufacturers (e.g., Texas Instruments vs Maxim) define A/B opposite to each other! Use an oscilloscope to confirm A is HIGH when idle.",
  },
  {
    num: "02",
    title: "Missing Termination at Cable Ends",
    problem: "Signal reflections cause data corruption, especially at speeds >100 kbps or distances >100m.",
    fix: "Add 120Ω resistors at both physical ends of the bus cable. Not in the middle, not at branch points — at the ends only.",
  },
  {
    num: "03",
    title: "Using Long UART Cables Instead of RS485",
    problem: "Single-ended UART degrades rapidly beyond ~15m. Noise picked up from motors, VFDs, and switching supplies corrupts data.",
    fix: "Use a MAX485, SN75176, or similar transceiver IC to convert UART TX/RX to RS485 differential. 5 minutes of work, 80× range improvement.",
  },
  {
    num: "04",
    title: "Forgetting Direction Control (DE/RE Pins)",
    problem: "RS485 is half-duplex. If two devices transmit simultaneously, bus collision occurs — both messages are lost.",
    fix: "Set DE=HIGH before transmitting, wait for transmission complete interrupt, then set DE=LOW to release the bus for receive mode. This is mandatory.",
  },
  {
    num: "05",
    title: "Missing Common Ground Connection",
    problem: "RS485 is differential, so people assume no GND wire is needed. But without a common GND reference, common-mode voltage can exceed ±15V, damaging transceivers.",
    fix: "Always run a third wire (GND/signal reference) alongside A and B. It does not carry signal current — just provides a common reference. Use a twisted pair for A/B and the third wire in shielded cable.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 09 · Avoid These Pitfalls
        </p>
        <h2 className="text-2xl font-black mb-6" style={{ color: "#F0F0F5" }}>Common Mistakes</h2>

        <div className="space-y-3">
          {MISTAKES.map((m, i) => (
            <motion.div
              key={m.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border p-5"
              style={{ background: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.18)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                >
                  {m.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black mb-2" style={{ color: "#F0F0F5" }}>{m.title}</h3>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>Problem</span>
                    <p className="text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>{m.problem}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)", color: COLOR }}>Fix</span>
                    <p className="text-xs" style={{ color: "rgba(240,240,245,0.65)" }}>{m.fix}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
