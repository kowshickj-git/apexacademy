"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const apps = [
  { icon: "🔌", title: "Phone Charger", detail: "A bridge rectifier (4 diodes) converts 230V AC to 5V DC. Without diodes, AC would destroy your phone instantly." },
  { icon: "📻", title: "AM Radio", detail: "An envelope detector diode extracts audio from the modulated carrier wave. The original use case for diodes (1906)." },
  { icon: "🚗", title: "Car Alternator", detail: "Six diodes in the alternator convert the engine's AC power to 13.8V DC to charge the battery and run electronics." },
  { icon: "☀️", title: "Solar Panel", detail: "A bypass diode in each solar cell prevents 'hot spot' damage when a cell is shaded. Without it, shaded cells are destroyed." },
  { icon: "💻", title: "Laptop Power Brick", detail: "A full-bridge rectifier followed by an LLC converter uses Schottky diodes for 95%+ efficiency power conversion." },
  { icon: "🔋", title: "Battery Charger", detail: "A protection diode prevents current from flowing back into the charger when power is removed — protects your battery." },
  { icon: "⚡", title: "Lightning Protection", detail: "TVS (transient voltage suppression) diodes clamp voltage spikes caused by lightning or switching — protects USB ports." },
  { icon: "📡", title: "TV Remote", detail: "A photodiode receiver in your TV detects 38kHz IR pulses from the remote control — working in reverse-bias mode." },
];

export default function RealWorldApplications() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9 · Applications</p>
        <h2 className="text-xl font-bold mb-1">Diodes in the Real World</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Diodes are inside almost every electronic device you own. Tap any device to see exactly what the diode is doing.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {apps.map((a, i) => (
            <button
              key={a.title}
              onClick={() => setActive(active === i ? null : i)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center"
              style={active === i
                ? { background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.35)" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-[10px] text-white/55 font-medium leading-tight">{a.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-purple-500/25 p-5"
              style={{ background: "rgba(139,92,246,0.08)" }}
            >
              <p className="text-sm font-bold mb-1.5" style={{ color: "#A78BFA" }}>{apps[active].icon} {apps[active].title}</p>
              <p className="text-xs text-white/55 leading-relaxed">{apps[active].detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
