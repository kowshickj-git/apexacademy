"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const COLOR = "#6366F1";

export default function BottomCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6 pb-16"
    >
      {/* 28 Dots */}
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === 27 ? "10px" : "8px",
              height: i === 27 ? "10px" : "8px",
              background:
                i < 27
                  ? `rgba(99,102,241,${0.25 + (i / 27) * 0.35})`
                  : COLOR,
              boxShadow: i === 27 ? `0 0 8px ${COLOR}` : "none",
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/electronics/rs485"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          ← RS485
        </Link>

        <div className="text-center">
          <div className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
            Lesson 28 of 36
          </div>
        </div>

        <Link
          href="/electronics/esp32"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
          style={{
            background: COLOR,
            color: "#fff",
            boxShadow: `0 4px 15px rgba(99,102,241,0.35)`,
          }}
        >
          ESP32 →
        </Link>
      </div>

      {/* Footer text */}
      <div className="text-center">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Lesson 28 of 36 · Embedded Systems · APEX Academy
        </p>
      </div>
    </motion.section>
  );
}
