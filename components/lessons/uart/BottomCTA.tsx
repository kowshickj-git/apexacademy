"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const COLOR = "#10B981";
const TOTAL_DOTS = 23;

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
              style={{ width: "18px", background: COLOR, boxShadow: i === TOTAL_DOTS - 1 ? `0 0 8px ${COLOR}80` : "none" }}
            />
          ))}
        </div>

        {/* CTA text */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔌</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>
            Lesson 23 Complete!
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.45)" }}>
            You&apos;ve mastered UART serial communication. Now learn I2C — the protocol that lets one microcontroller talk to dozens of sensors on just 2 wires.
          </p>
        </div>

        {/* Next lesson preview */}
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}
        >
          <div className="text-xs font-mono mb-2" style={{ color: "rgba(16,185,129,0.6)" }}>Up Next · L24</div>
          <div className="text-base font-black mb-1" style={{ color: "#F0F0F5" }}>I2C — Inter-Integrated Circuit</div>
          <div className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.45)" }}>
            I2C uses just 2 wires (SDA + SCL) to connect up to 127 devices on the same bus — sensors, displays, EEPROMs, real-time clocks, and more. Learn addressing, clock stretching, and common I2C issues.
          </div>
          <div className="flex flex-wrap gap-2">
            {["SDA / SCL wires", "7-bit device addressing", "Master/slave model", "Pull-up resistors", "Wire.h library", "I2C scanner sketch"].map(f => (
              <span key={f} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: COLOR }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/electronics/communication-protocols"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:bg-white/3"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
          >
            ← Communication Protocols
          </Link>
          <Link
            href="/electronics/i2c"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${COLOR}, #34D399)`, color: "white", boxShadow: `0 4px 20px ${COLOR}30` }}
          >
            I2C →
          </Link>
        </div>
      </div>
    </section>
  );
}
