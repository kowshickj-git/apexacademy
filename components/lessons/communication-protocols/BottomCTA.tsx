"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const COLOR = "#8B5CF6";
const TOTAL_DOTS = 22;

export default function BottomCTA() {
  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-2xl">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-8 flex-wrap">
          {Array.from({ length: TOTAL_DOTS }, (_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 20 }}
              style={{ width: "20px", background: COLOR, boxShadow: i === TOTAL_DOTS - 1 ? `0 0 8px ${COLOR}80` : "none" }}
            />
          ))}
        </div>

        {/* CTA text */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📡</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>
            Lesson 22 Complete!
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.45)" }}>
            You understand the fundamentals of embedded communication protocols. Next: deep-dive into UART serial communication.
          </p>
        </div>

        {/* Next lesson preview */}
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}
        >
          <div className="text-xs font-mono mb-2" style={{ color: "rgba(139,92,246,0.6)" }}>Up Next · L23</div>
          <div className="text-base font-black mb-1" style={{ color: "#F0F0F5" }}>UART — Universal Asynchronous Receiver/Transmitter</div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
            Deep-dive into UART: baud rate configuration, framing, parity bits, flow control (RTS/CTS), RS232 vs TTL, and building a real serial communication project.
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/electronics/sensors"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:bg-white/3"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
          >
            ← Sensors
          </Link>
          <Link
            href="/electronics/uart"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${COLOR}, #A78BFA)`, color: "white", boxShadow: `0 4px 20px ${COLOR}30` }}
          >
            UART →
          </Link>
        </div>
      </div>
    </section>
  );
}
