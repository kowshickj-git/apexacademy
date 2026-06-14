"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "1827",
    title: "Georg Ohm Discovers Resistance",
    desc: "German physicist Georg Ohm publishes his law: V = I × R, proving that resistance is a measurable property of materials.",
    icon: "📐",
    color: "#F97316",
  },
  {
    year: "1880s",
    title: "Carbon Resistors Invented",
    desc: "As telegraph and telephone lines expand, engineers create the first carbon-based resistors to balance signal levels across long wires.",
    icon: "🔬",
    color: "#0EA5E9",
  },
  {
    year: "1920s",
    title: "Radio & Mass Production",
    desc: "Boom in radio manufacturing drives resistors into mass production. Every radio needs dozens — factories automate production.",
    icon: "📻",
    color: "#10B981",
  },
  {
    year: "1960s",
    title: "Metal Film & Precision",
    desc: "Metal film resistors replace carbon for precision electronics. Tolerance drops from ±20% to ±1%, enabling reliable computers.",
    icon: "💻",
    color: "#8B5CF6",
  },
  {
    year: "1970s",
    title: "SMD Resistors",
    desc: "Surface-mount (SMD) resistors are invented for automated circuit board production. They shrink from centimeters to 0.6mm × 0.3mm.",
    icon: "🔭",
    color: "#EC4899",
  },
  {
    year: "Today",
    title: "Billions Per Device",
    desc: "A modern smartphone contains 400–600 resistors. A laptop motherboard has thousands. They are the most produced electronic component on Earth.",
    icon: "📱",
    color: "#10B981",
  },
];

export default function ResistorHistory() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 4</p>
        <h2 className="text-xl font-bold mb-1">The History of Resistors</h2>
        <p className="text-white/45 text-sm mb-8 leading-relaxed">
          From Georg Ohm&apos;s notebook to your smartphone — nearly 200 years of resistor evolution.
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />

          <div className="space-y-6">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: i * 0.07 }}
                className="flex gap-4 relative"
              >
                {/* Dot */}
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 text-base z-10"
                  style={{ background: `rgba(${item.color === "#F97316" ? "249,115,22" : item.color === "#0EA5E9" ? "14,165,233" : item.color === "#10B981" ? "16,185,129" : item.color === "#8B5CF6" ? "139,92,246" : "236,72,153"},0.12)`, borderColor: `rgba(${item.color === "#F97316" ? "249,115,22" : item.color === "#0EA5E9" ? "14,165,233" : item.color === "#10B981" ? "16,185,129" : item.color === "#8B5CF6" ? "139,92,246" : "236,72,153"},0.35)` }}
                >
                  {item.icon}
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold font-mono" style={{ color: item.color }}>{item.year}</span>
                    <h3 className="text-sm font-semibold text-white/80">{item.title}</h3>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
