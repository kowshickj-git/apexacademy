"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const devices = [
  {
    name: "Mobile Phone",
    current: "1–3 A",
    icon: (
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
        <rect x="2" y="1" width="20" height="26" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="23" r="1.5" fill="currentColor" opacity={0.5} />
        <rect x="7" y="5" width="10" height="13" rx="1.5" fill="currentColor" opacity={0.2} />
      </svg>
    ),
    desc: "Your phone charges at 1–3A. Current flows into the battery and powers the screen, processor, and radios all at once.",
    color: "primary",
  },
  {
    name: "Laptop",
    current: "3–5 A",
    icon: (
      <svg width="30" height="24" viewBox="0 0 30 24" fill="none">
        <rect x="2" y="2" width="26" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="5" y="5" width="20" height="11" rx="1" fill="currentColor" opacity={0.15} />
        <path d="M1 19h28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="10" y="19" width="10" height="2.5" rx="1" fill="currentColor" opacity={0.4} />
      </svg>
    ),
    desc: "Laptops need 3–5A to power the CPU, GPU, screen, fans, and USB ports simultaneously.",
    color: "secondary",
  },
  {
    name: "Ceiling Fan",
    current: "0.5–2 A",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 11 Q14 4 9 3 Q4 2 5 7 Q6 12 11 11Z" fill="currentColor" opacity={0.5} />
        <path d="M17 14 Q24 14 25 9 Q26 4 21 5 Q16 6 17 11Z" fill="currentColor" opacity={0.5} transform="rotate(120 14 14)" />
        <path d="M11 17 Q4 18 3 23 Q2 28 7 27 Q12 26 11 21Z" fill="currentColor" opacity={0.5} transform="rotate(240 14 14)" />
      </svg>
    ),
    desc: "A ceiling fan typically draws 0.5–2A. Lower speeds use less current; high speed draws more.",
    color: "primary",
  },
  {
    name: "Television",
    current: "1–4 A",
    icon: (
      <svg width="32" height="26" viewBox="0 0 32 26" fill="none">
        <rect x="1" y="1" width="30" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="4" width="24" height="14" rx="1" fill="currentColor" opacity={0.15} />
        <path d="M12 21l-2 4M20 21l2 4M10 25h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    desc: "A smart TV uses 1–4A depending on screen size and brightness. 4K panels need more current.",
    color: "secondary",
  },
  {
    name: "Robot",
    current: "2–10 A",
    icon: (
      <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
        <rect x="4" y="8" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="9" cy="13" r="2" fill="currentColor" opacity={0.6} />
        <circle cx="15" cy="13" r="2" fill="currentColor" opacity={0.6} />
        <rect x="8" y="17" width="8" height="2" rx="1" fill="currentColor" opacity={0.4} />
        <rect x="7" y="3" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="3" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 15v6M24 15v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="3" y="22" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    desc: "Industrial robots use 2–10A. Motors and servo controllers need bursts of high current to move.",
    color: "primary",
  },
  {
    name: "LED Light",
    current: "20–300 mA",
    icon: (
      <svg width="22" height="30" viewBox="0 0 22 30" fill="none">
        <path d="M11 1C6.58 1 3 4.58 3 9c0 2.65 1.28 5 3.27 6.47V17h9.46v-1.53C17.72 14 19 11.65 19 9c0-4.42-3.58-8-8-8Z" stroke="currentColor" strokeWidth="1.8" />
        <rect x="7" y="17" width="8" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="7.5" y="20" width="7" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <line x1="11" y1="23" x2="11" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="5" y1="9" x2="2" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
        <line x1="17" y1="9" x2="20" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
        <line x1="11" y1="3" x2="11" y2="0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
      </svg>
    ),
    desc: "LEDs use only 20–300mA — incredibly efficient! That's why they last thousands of hours.",
    color: "secondary",
  },
];

export default function CurrentUsages() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#06</p>
        <h2 className="text-2xl font-bold text-white">Current in Everyday Life</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <p className="text-sm text-white/50">Tap any device to learn how much current it uses.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {devices.map((d, i) => (
            <motion.button
              key={d.name}
              onClick={() => setActive(active === i ? null : i)}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border p-4 text-left transition-all cursor-pointer"
              style={{
                background: active === i
                  ? (d.color === "primary" ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)")
                  : "#18181B",
                borderColor: active === i
                  ? (d.color === "primary" ? "rgba(16,185,129,0.4)" : "rgba(14,165,233,0.4)")
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
                style={{
                  background: d.color === "primary" ? "rgba(16,185,129,0.12)" : "rgba(14,165,233,0.12)",
                  color: d.color === "primary" ? "#10B981" : "#0EA5E9",
                }}
              >
                {d.icon}
              </div>
              <p className="text-sm font-semibold text-white mb-0.5">{d.name}</p>
              <p
                className="text-xs font-mono font-bold"
                style={{ color: d.color === "primary" ? "#10B981" : "#0EA5E9" }}
              >
                {d.current}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Expanded detail */}
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-2xl border p-4"
                style={{
                  background: devices[active].color === "primary" ? "rgba(16,185,129,0.06)" : "rgba(14,165,233,0.06)",
                  borderColor: devices[active].color === "primary" ? "rgba(16,185,129,0.2)" : "rgba(14,165,233,0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-sm font-bold"
                    style={{ color: devices[active].color === "primary" ? "#10B981" : "#0EA5E9" }}
                  >
                    {devices[active].name}
                  </span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                    style={{
                      background: devices[active].color === "primary" ? "rgba(16,185,129,0.15)" : "rgba(14,165,233,0.15)",
                      color: devices[active].color === "primary" ? "#10B981" : "#0EA5E9",
                    }}
                  >
                    {devices[active].current}
                  </span>
                </div>
                <p className="text-sm text-white/58 leading-relaxed">{devices[active].desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
