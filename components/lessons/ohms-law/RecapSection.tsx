"use client";

import { motion } from "framer-motion";

const concepts = [
  { label: "Voltage", symbol: "V", unit: "Volts", color: "#EAB308", emoji: "🔋", desc: "The electrical push — how hard electrons are being forced to move.", analogy: "Water pressure in a pipe" },
  { label: "Current", symbol: "I", unit: "Amperes", color: "#0EA5E9", emoji: "⚡", desc: "The flow of electrons — how many pass a point per second.", analogy: "Water flow rate" },
  { label: "Resistance", symbol: "R", unit: "Ohms (Ω)", color: "#F97316", emoji: "🚧", desc: "Opposition to current — how hard the material fights electron flow.", analogy: "Pipe narrowness" },
  { label: "Resistor", symbol: "R⃝", unit: "Component", color: "#8B5CF6", emoji: "🔩", desc: "The physical component with a specific resistance value — the device you put in circuits.", analogy: "A valve in a pipe" },
];

const electrons = Array.from({ length: 5 }, (_, i) => i);

export default function RecapSection() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 1 · Recap</p>
        <h2 className="text-xl font-bold mb-1">What We Know So Far</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Before meeting Ohm&apos;s Law, let&apos;s quickly remember the four concepts from the last four lessons.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {concepts.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-2xl border p-4"
              style={{ background: `${c.color}0d`, borderColor: `${c.color}25` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{c.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: c.color }}>{c.label}</h3>
                  <span className="text-[10px] font-mono text-white/25">{c.symbol} · {c.unit}</span>
                </div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-1">{c.desc}</p>
              <p className="text-[10px] text-white/25 italic">Like: {c.analogy}</p>
            </motion.div>
          ))}
        </div>

        {/* Flow animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/6 p-5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-xs text-white/35 mb-4 text-center font-semibold uppercase tracking-widest text-[10px]">The circuit relationship</p>
          <div className="relative h-14 overflow-hidden rounded-xl border border-white/5" style={{ background: "rgba(14,165,233,0.05)" }}>
            {/* Battery */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-10 rounded border border-yellow-400/30 flex flex-col items-center justify-center" style={{ background: "rgba(234,179,8,0.1)" }}>
                <span className="text-[10px] text-yellow-400 font-bold">9V</span>
              </div>
            </div>

            {/* Wire top */}
            <div className="absolute left-10 right-10 top-3 h-0.5 bg-secondary/30 rounded" />

            {/* Electrons */}
            {electrons.map((i) => (
              <div
                key={i}
                className="absolute top-2.5 w-2 h-2 rounded-full"
                style={{
                  background: "#0EA5E9",
                  boxShadow: "0 0 5px rgba(14,165,233,0.8)",
                  animation: `ant-march 2s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                  left: "-8px",
                }}
              />
            ))}

            {/* Resistor */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1 flex flex-col items-center">
              <div className="w-12 h-5 rounded border border-orange-400/40 flex items-center gap-0.5 justify-center px-1" style={{ background: "rgba(249,115,22,0.12)" }}>
                <div className="w-1.5 h-3 rounded-sm bg-orange-400/60" />
                <div className="w-1.5 h-3 rounded-sm bg-red-500/60" />
                <div className="w-1.5 h-3 rounded-sm bg-yellow-500/60" />
              </div>
              <span className="text-[8px] text-orange-400/60 mt-0.5">R</span>
            </div>

            {/* Wire bottom */}
            <div className="absolute left-10 right-10 bottom-3 h-0.5 bg-secondary/30 rounded" />

            {/* Labels */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-center">
              <div className="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center text-xs" style={{ background: "rgba(16,185,129,0.1)" }}>💡</div>
            </div>
          </div>
          <div className="flex justify-around mt-2 text-[9px] text-white/25">
            <span>Battery pushes (V)</span>
            <span>Electrons flow (I)</span>
            <span>Resistor slows (R)</span>
            <span>LED lights up</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
