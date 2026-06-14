"use client";

import { motion } from "framer-motion";

const timeline = [
  { year: "1920s", event: "First analog current/voltage meters developed for telephone lines" },
  { year: "1930s", event: "Practical combination multimeters (volt-ohm-milliammeters) introduced" },
  { year: "1970s", event: "Digital multimeters (DMMs) appear — LCD displays replace analog needles" },
  { year: "Today", event: "Every electronics engineer and hobbyist uses a DMM as their primary tool" },
];

const modes = [
  { symbol: "V", label: "Voltage", desc: "Measure electrical potential difference", color: "#F59E0B" },
  { symbol: "A", label: "Current", desc: "Measure flow of electric charge", color: "#0EA5E9" },
  { symbol: "Ω", label: "Resistance", desc: "Measure opposition to current flow", color: "#10B981" },
  { symbol: "🔊", label: "Continuity", desc: "Check if current can flow between two points", color: "#A78BFA" },
  { symbol: "↗", label: "Diode", desc: "Measure forward voltage drop of diodes", color: "#F97316" },
];

export default function WhatIsMultimeter() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 2 · Definition
        </p>
        <h2 className="text-xl font-bold mb-5">What Is a Multimeter?</h2>

        {/* Definition card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 p-5 mb-8"
          style={{ background: "rgba(167,139,250,0.06)" }}
        >
          <p className="text-white/75 text-sm leading-relaxed">
            A <span style={{ color: "#A78BFA" }} className="font-bold">multimeter</span> is an electronic measuring
            instrument that combines several measurement functions in one unit — measuring{" "}
            <span className="text-yellow-400 font-semibold">voltage</span>,{" "}
            <span className="text-blue-400 font-semibold">current</span>,{" "}
            <span className="text-green-400 font-semibold">resistance</span>, and more.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mb-8">
          <p className="text-[10px] text-white/25 uppercase tracking-widest font-mono mb-4">History</p>
          <div className="relative pl-5">
            <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: "rgba(167,139,250,0.2)" }} />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="mb-5 last:mb-0 relative"
              >
                <div
                  className="absolute -left-3.5 top-1 w-3 h-3 rounded-full border-2 border-current"
                  style={{ borderColor: "#A78BFA", background: "#050507" }}
                />
                <span className="text-[10px] font-mono font-bold" style={{ color: "#A78BFA" }}>
                  {item.year}
                </span>
                <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modes */}
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-mono mb-3">Measurement Modes</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {modes.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-white/8 p-3"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="text-xl font-black mb-1.5"
                style={{ color: m.color }}
              >
                {m.symbol}
              </div>
              <p className="text-xs font-bold text-white/70">{m.label}</p>
              <p className="text-[10px] text-white/35 mt-0.5 leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
