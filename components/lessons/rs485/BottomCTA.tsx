"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const COLOR = "#F59E0B";
const TOTAL_DOTS = 27;

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
              transition={{ delay: i * 0.028, type: "spring", stiffness: 300, damping: 20 }}
              style={{
                width: "18px",
                background: COLOR,
                boxShadow: i === TOTAL_DOTS - 1 ? `0 0 8px ${COLOR}80` : "none",
              }}
            />
          ))}
        </div>

        {/* CTA text */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📡</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>
            Lesson 27 Complete!
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.45)" }}>
            You can now design RS485 networks, implement Modbus RTU, and debug industrial communication issues.
            Next up: connect everything to the Internet with IoT.
          </p>
        </div>

        {/* Next lesson preview */}
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}
        >
          <div className="text-xs font-mono mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>Up Next · L28</div>
          <div className="text-base font-black mb-1" style={{ color: "#F0F0F5" }}>Internet of Things (IoT)</div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
            Connect embedded systems to the cloud. Wi-Fi, MQTT protocol, HTTP REST APIs, sensor dashboards,
            and remote control with ESP32 and Node-RED.
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/electronics/can"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:bg-white/3"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
          >
            ← CAN Protocol
          </Link>
          <Link
            href="/electronics/iot"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${COLOR}, #FCD34D)`,
              color: "#050507",
              boxShadow: `0 4px 20px ${COLOR}30`,
            }}
          >
            IoT Fundamentals →
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs" style={{ color: "rgba(240,240,245,0.2)" }}>
          Lesson 27 of 36 · Embedded Systems · APEX Academy
        </div>
      </div>
    </section>
  );
}
