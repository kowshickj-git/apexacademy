"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const COLOR = "#0EA5E9";
const TOTAL_DOTS = 21;

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
              transition={{ delay: i * 0.035, type: "spring", stiffness: 300, damping: 20 }}
              style={{ width: "20px", background: COLOR, boxShadow: i === TOTAL_DOTS - 1 ? `0 0 8px ${COLOR}80` : "none" }}
            />
          ))}
        </div>

        {/* CTA text */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📡</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>
            Lesson 21 Complete!
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.45)" }}>
            You understand how sensors bridge the physical and digital worlds. Next up: how devices talk to each other.
          </p>
        </div>

        {/* Next lesson preview */}
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{ background: "rgba(14,165,233,0.05)", borderColor: "rgba(14,165,233,0.2)" }}
        >
          <div className="text-xs font-mono mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>Up Next · L22</div>
          <div className="text-base font-black mb-1" style={{ color: "#F0F0F5" }}>Communication Protocols</div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
            Learn how microcontrollers communicate: UART serial, I2C device buses, SPI high-speed, CAN automotive networks.
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/electronics/arduino"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:bg-white/3"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
          >
            ← Arduino
          </Link>
          <Link
            href="/electronics/communication-protocols"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${COLOR}, #38BDF8)`, color: "white", boxShadow: `0 4px 20px ${COLOR}30` }}
          >
            Communication Protocols →
          </Link>
        </div>
      </div>
    </section>
  );
}
