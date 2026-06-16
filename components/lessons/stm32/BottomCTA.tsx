"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const COLOR = "#0891B2";
const TOTAL = 36;
const DONE = 30;

export default function BottomCTA() {
  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-2xl">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-8 flex-wrap">
          {Array.from({ length: TOTAL }, (_, i) => {
            const isDone = i < DONE - 1;
            const isCurrent = i === DONE - 1;
            return (
              <motion.div
                key={i}
                className="h-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.025, type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width: "20px",
                  background: isDone ? "#059669" : isCurrent ? "rgba(8,145,178,0.6)" : "rgba(255,255,255,0.1)",
                  boxShadow: isCurrent ? `0 0 8px ${COLOR}80` : "none",
                }}
              />
            );
          })}
        </div>

        {/* CTA text */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔧</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: COLOR }}>
            STM32 Complete!
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.45)" }}>
            L30 done · 6 more lessons to go.
          </p>
        </div>

        {/* Next lesson preview */}
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{ background: "rgba(8,145,178,0.05)", borderColor: "rgba(8,145,178,0.2)" }}
        >
          <div className="text-xs font-mono mb-2" style={{ color: "rgba(8,145,178,0.6)" }}>Up Next · L31</div>
          <div className="text-base font-black mb-1" style={{ color: "#F0F0F5" }}>FreeRTOS</div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
            Master real-time operating systems: tasks, queues, semaphores, mutexes, and scheduling on embedded hardware.
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/electronics/esp32"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:bg-white/3"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
          >
            ← ESP32
          </Link>
          <Link
            href="/electronics/freertos"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${COLOR}, #06B6D4)`, color: "white", boxShadow: `0 4px 20px ${COLOR}30` }}
          >
            FreeRTOS →
          </Link>
        </div>
      </div>
    </section>
  );
}
