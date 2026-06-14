"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const examples = [
  {
    icon: "📱",
    title: "Phone Charger",
    voltage: "5V",
    current: "2A",
    resistance: "2.5Ω",
    where: "USB charging cable resistance",
    explain: "Your phone charger outputs 5V. The charging circuit draws 2A. Using V=IR, the effective resistance is 5 ÷ 2 = 2.5Ω. Engineers used Ohm's Law to design the charger to deliver exactly this safely.",
    color: "#10B981",
  },
  {
    icon: "💡",
    title: "LED Circuit",
    voltage: "9V",
    current: "19.1mA",
    resistance: "470Ω",
    where: "Current-limiting resistor",
    explain: "A 9V battery powers an LED (2V forward voltage). The 470Ω resistor drops (9-2)=7V. I = 7V ÷ 470Ω = 14.9mA — safely below the LED's 20mA limit. Pure Ohm's Law.",
    color: "#EAB308",
  },
  {
    icon: "🤖",
    title: "Arduino Sensor",
    voltage: "5V",
    current: "0.5mA",
    resistance: "10KΩ",
    where: "Pull-up resistor to GPIO pin",
    explain: "A 10KΩ pull-up resistor on an Arduino GPIO pin. When the button is open: I = 5V ÷ 10,000Ω = 0.5mA. Barely any current — but enough to hold the pin at HIGH state reliably.",
    color: "#0EA5E9",
  },
  {
    icon: "🚗",
    title: "Car Headlight",
    voltage: "12V",
    current: "4A",
    resistance: "3Ω",
    where: "Bulb filament resistance",
    explain: "A car headlight bulb runs on 12V and draws 4A of current. R = 12V ÷ 4A = 3Ω. The tungsten filament glows white-hot, producing light. The whole design relies on Ohm's Law.",
    color: "#F97316",
  },
  {
    icon: "⚡",
    title: "Electric Vehicle",
    voltage: "400V",
    current: "250A",
    resistance: "1.6Ω",
    where: "Motor drive circuit",
    explain: "EV motors operate at 400V with peak current of 250A during acceleration: P = V×I = 100KW! Engineers use Ohm's Law at every stage of the battery, inverter, and motor design.",
    color: "#8B5CF6",
  },
];

export default function RealWorldExamples() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Applications</p>
        <h2 className="text-xl font-bold mb-1">Ohm&apos;s Law in the Real World</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Every one of these is a real circuit where engineers applied V = I × R. Click to see how.
        </p>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {examples.map((ex, i) => (
            <button
              key={ex.title}
              onClick={() => setSelected(selected === i ? null : i)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
              style={selected === i
                ? { background: `${ex.color}14`, borderColor: ex.color + "50" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              <span className="text-2xl">{ex.icon}</span>
              <span className="text-[9px] text-white/40 text-center leading-tight">{ex.title}</span>
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
              transition={{ duration: 0.22 }}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: `${examples[selected].color}25` }}
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5" style={{ background: `${examples[selected].color}0c` }}>
                <span className="text-2xl">{examples[selected].icon}</span>
                <h3 className="text-sm font-bold" style={{ color: examples[selected].color }}>{examples[selected].title}</h3>
                <span className="text-[10px] text-white/25 ml-auto">{examples[selected].where}</span>
              </div>
              <div className="p-5">
                <div className="flex gap-4 mb-4 flex-wrap">
                  {[
                    { label: "V", val: examples[selected].voltage, color: "#EAB308" },
                    { label: "I", val: examples[selected].current, color: "#0EA5E9" },
                    { label: "R", val: examples[selected].resistance, color: "#F97316" },
                  ].map((m) => (
                    <div key={m.label} className="text-center px-3 py-2 rounded-xl border border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="text-lg font-black font-mono" style={{ color: m.color }}>{m.val}</p>
                      <p className="text-[10px] text-white/30">{m.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/55 leading-relaxed">{examples[selected].explain}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selected === null && (
          <div className="text-center py-8 text-white/20 text-sm">↑ Click a device to see the numbers</div>
        )}
      </div>
    </section>
  );
}
