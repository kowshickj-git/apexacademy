"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const devices = [
  { name: "Smartphone",  icon: "📱", count: "400–600",   resistors: ["Display brightness control", "Microphone bias", "Charging protection", "RF signal routing"] },
  { name: "Laptop",      icon: "💻", count: "1,000+",    resistors: ["CPU power delivery", "RAM signal termination", "Screen backlight driver", "USB port protection"] },
  { name: "Arduino",     icon: "🤖", count: "~30",        resistors: ["LED current limiters", "Button pull-ups", "Sensor voltage dividers", "Motor driver bias"] },
  { name: "TV / Monitor",icon: "📺", count: "300–800",   resistors: ["Power supply filtering", "LED backlight", "HDMI signal termination", "Audio amplifier gain"] },
  { name: "Car (ECU)",   icon: "🚗", count: "2,000+",    resistors: ["Engine sensor bias", "CAN bus termination", "Ignition control", "Safety system bias"] },
  { name: "PCB / Board", icon: "🔬", count: "Thousands", resistors: ["Pull-ups everywhere", "Voltage dividers", "Signal conditioning", "ESD protection"] },
  { name: "TV Remote",   icon: "🎮", count: "~15",        resistors: ["IR LED current limit", "Button debounce", "Battery voltage sense", "Microcontroller bias"] },
  { name: "Electric Car",icon: "⚡", count: "5,000+",    resistors: ["Battery management", "Motor phase sensing", "Charging safety", "HV system monitoring"] },
  { name: "Raspberry Pi",icon: "🍓", count: "~200",       resistors: ["GPIO pull-ups", "HDMI termination", "USB protection", "Power LED limit"] },
];

export default function ResistorUsages() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9</p>
        <h2 className="text-xl font-bold mb-1">Resistors in Everyday Devices</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Every electronic device you&apos;ve ever touched contains resistors. Click any device to see how many and what they do.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {devices.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setSelected(selected === i ? null : i)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center"
              style={selected === i
                ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              <span className="text-xl">{d.icon}</span>
              <span className="text-[10px] text-white/55 leading-tight">{d.name}</span>
              <span className="text-[9px] font-mono" style={{ color: selected === i ? "#10B981" : "rgba(255,255,255,0.25)" }}>{d.count}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-primary/20 p-4"
              style={{ background: "rgba(16,185,129,0.06)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{devices[selected].icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white/85">{devices[selected].name}</h3>
                  <p className="text-xs text-primary font-mono">{devices[selected].count} resistors</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {devices[selected].resistors.map((r) => (
                  <div key={r} className="flex items-start gap-1.5">
                    <svg className="shrink-0 mt-0.5" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4" stroke="rgba(16,185,129,0.4)" />
                      <path d="M2.5 5L4.5 7L7.5 3" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[11px] text-white/50">{r}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selected === null && (
          <div className="text-center py-6 text-white/20 text-sm">
            ↑ Click a device to see its resistors
          </div>
        )}
      </div>
    </section>
  );
}
