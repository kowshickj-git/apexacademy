"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const devices = [
  { id: "charger", emoji: "🔌", name: "Phone Charger", desc: "Resistors inside regulate the charging current so your phone battery doesn't get damaged by too much power.", detail: "Uses resistors to step down voltage and limit current to safe charging levels (typically 5V / 1–3A)." },
  { id: "laptop", emoji: "💻", name: "Laptop", desc: "Multiple resistors control power flow to the CPU, screen, and battery, protecting each component.", detail: "CPU power management uses precision resistors to regulate the exact voltage each core receives." },
  { id: "arduino", emoji: "🤖", name: "Arduino", desc: "Resistors are essential in every Arduino project — limiting current to LEDs, pull-up/pull-down for buttons.", detail: "A 220Ω resistor on an LED limits current to ~22mA, preventing the LED from burning out." },
  { id: "robot", emoji: "⚙️", name: "Robot", desc: "Motor drivers use shunt resistors to sense current, helping the robot know how hard each motor is working.", detail: "Current-sense resistors (milli-ohm range) measure motor load and enable torque control." },
  { id: "tv", emoji: "📺", name: "Television", desc: "Resistors are used in the power supply, audio circuits, and display driver circuits of every TV.", detail: "Bias resistors set operating points for transistors in the amplifier and display driver circuits." },
  { id: "led", emoji: "💡", name: "LED Circuit", desc: "Without a resistor in series with an LED, it would instantly burn out from too much current.", detail: "R = (Vs − Vf) / If. For a 5V supply and red LED (Vf=2V, If=20mA): R = 3/0.02 = 150Ω." },
  { id: "ev", emoji: "🚗", name: "Electric Vehicle", desc: "High-power shunt resistors measure battery current, while others dissipate regen braking energy as heat.", detail: "Battery management systems use precision resistors to measure state-of-charge and protect cells." },
];

export default function ResistanceUsages() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="06" title="Where Is Resistance Used?" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm text-white/65 leading-relaxed mb-4">
          Resistance isn't just a physics concept — it's built into every electronic device you use daily. Tap a device to learn how.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {devices.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(selected === d.id ? null : d.id)}
              className="text-left p-4 rounded-2xl border transition-all"
              style={selected === d.id
                ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", boxShadow: "0 0 16px rgba(16,185,129,0.12)" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              <div className="text-2xl mb-2">{d.emoji}</div>
              <p className="text-sm font-bold text-white mb-1">{d.name}</p>
              <p className="text-[11px] text-white/45 leading-snug line-clamp-2">{d.desc}</p>
              {selected === d.id && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-primary/80 mt-2 leading-snug"
                >
                  {d.detail}
                </motion.p>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
