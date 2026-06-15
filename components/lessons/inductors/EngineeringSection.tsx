"use client";

import { motion } from "framer-motion";

const insights = [
  {
    icon: "⚡",
    title: "Back-EMF (Lenz's Law)",
    body: "When current through an inductor changes, it generates a voltage opposing that change. V_L = -L × dI/dt. The faster the change, the larger the opposing voltage. This is why disconnecting a relay without protection creates destructive spikes.",
    accent: "#EC4899",
    formula: "V_L = -L × dI/dt",
  },
  {
    icon: "🛡",
    title: "Flyback Diode",
    body: "Always place a diode in parallel with any inductive load (relay, motor, solenoid). When current is interrupted, the diode provides a path for the collapsing field current, clamping the back-EMF spike to ~0.7V instead of potentially hundreds of volts.",
    accent: "#10B981",
    formula: "D1: anode → GND, cathode → V+",
  },
  {
    icon: "⬇",
    title: "Buck Converter",
    body: "A MOSFET rapidly switches (tens to hundreds of kHz), feeding a square wave into an inductor. The inductor averages (integrates) the switching voltage. Output voltage depends on duty cycle D. Inductors enable efficient voltage step-down without resistive losses.",
    accent: "#0EA5E9",
    formula: "V_out = D × V_in",
  },
  {
    icon: "⬆",
    title: "Boost Converter",
    body: "When the switch closes, the inductor stores energy. When it opens, the inductor releases its stored energy plus the supply voltage into the output — boosting the voltage above the input. Used in battery-powered devices to step voltage up.",
    accent: "#F59E0B",
    formula: "V_out = V_in / (1 - D)",
  },
  {
    icon: "🔄",
    title: "Motors, Relays & Solenoids",
    body: "All electromagnetic devices are inductors at heart. Motor windings, relay coils, solenoids — they all have significant inductance. Understanding inductors is essential to safely driving any of these devices with transistors or MOSFETs.",
    accent: "#8B5CF6",
    formula: "E = ½LI² → mechanical work",
  },
];

export default function EngineeringSection() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 6 · Engineering Applications
        </p>
        <h2 className="text-xl font-bold mb-5">Real Engineering with Inductors</h2>

        <div className="space-y-3">
          {insights.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-4 rounded-2xl border border-white/8"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: `${ins.accent}18`, border: `1px solid ${ins.accent}30` }}
                >
                  {ins.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold mb-1" style={{ color: ins.accent }}>{ins.title}</p>
                  <p className="text-xs text-white/45 leading-relaxed mb-2">{ins.body}</p>
                  <div
                    className="inline-block px-2.5 py-1 rounded-lg font-mono text-[10px]"
                    style={{ background: `${ins.accent}12`, color: ins.accent, border: `1px solid ${ins.accent}20` }}
                  >
                    {ins.formula}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
