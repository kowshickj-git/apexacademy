"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const COLOR = "#EF4444";
const TOTAL_LESSONS = 26;

export default function BottomCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="pb-16"
    >
      {/* Progress dots */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-8">
        {Array.from({ length: TOTAL_LESSONS }, (_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: i < TOTAL_LESSONS - 1
                ? "rgba(16,185,129,0.5)"
                : COLOR,
              boxShadow: i === TOTAL_LESSONS - 1 ? `0 0 8px ${COLOR}` : "none",
              transform: i === TOTAL_LESSONS - 1 ? "scale(1.3)" : "none",
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/electronics/spi"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
          style={{
            color: "rgba(240,240,245,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            textDecoration: "none",
          }}
        >
          ← SPI
        </Link>

        <div className="text-center">
          <div className="text-xs font-semibold" style={{ color: COLOR }}>
            Lesson 26 Complete
          </div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.3)" }}>
            Up Next: RS485 Protocol
          </div>
        </div>

        <Link
          href="/electronics/rs485"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: `linear-gradient(135deg, ${COLOR}, #DC2626)`,
            color: "#fff",
            boxShadow: `0 4px 16px rgba(239,68,68,0.3)`,
            textDecoration: "none",
          }}
        >
          RS485 →
        </Link>
      </div>

      {/* Footer */}
      <div
        className="text-center text-xs"
        style={{ color: "rgba(240,240,245,0.2)" }}
      >
        Lesson 26 of 36 · Embedded Systems · APEX Academy
      </div>
    </motion.section>
  );
}
