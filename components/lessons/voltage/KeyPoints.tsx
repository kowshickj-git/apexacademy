"use client";

import { motion } from "framer-motion";

const points = [
  {
    text: "Voltage is electrical pressure.",
    detail: "It pushes electrons through a circuit, just like water pressure pushes water through a pipe.",
  },
  {
    text: "Voltage is measured in Volts (V).",
    detail: "Named after Alessandro Volta, the inventor of the first electrical battery in 1800.",
  },
  {
    text: "Batteries provide voltage.",
    detail: "A battery creates a difference in electrical potential between its + and − terminals.",
  },
  {
    text: "More voltage means a stronger push.",
    detail: "Higher voltage drives more electrons, producing greater current through the circuit.",
  },
];

export default function KeyPoints() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="05" title="Key Points" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        {points.map(({ text, detail }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="flex gap-3 bg-surface rounded-xl p-4 border border-white/5"
          >
            {/* Check icon */}
            <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path
                  d="M1 4.5L4 7.5L10 1"
                  stroke="#10B981"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">{text}</p>
              <p className="text-xs text-white/45 mt-1 leading-relaxed">{detail}</p>
            </div>
          </motion.div>
        ))}

        {/* Formula card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center"
        >
          <p className="text-[10px] text-primary/60 uppercase tracking-widest font-semibold mb-2">
            Remember
          </p>
          <p className="text-lg font-bold text-white">
            More Voltage = Stronger Push = More Current
          </p>
          <p className="text-xs text-white/40 mt-1">
            V ↑ &nbsp;→&nbsp; Electrons pushed harder &nbsp;→&nbsp; I ↑
          </p>
        </motion.div>
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
