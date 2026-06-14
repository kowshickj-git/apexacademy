"use client";

import { motion } from "framer-motion";

const points = [
  "Resistance opposes the flow of electric current through a material.",
  "More resistance means less current for the same voltage.",
  "Resistance exists because electrons collide with atoms as they move.",
  "Resistance is measured in Ohms (Ω), named after Georg Simon Ohm.",
  "Conductors like copper have very low resistance; insulators like rubber have very high resistance.",
];

export default function KeyTakeaways() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="10" title="Key Takeaways" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-primary/15 overflow-hidden"
        style={{ background: "rgba(16,185,129,0.04)" }}
      >
        <div className="h-[3px] bg-gradient-to-r from-primary via-orange-400 to-secondary" />
        <div className="p-5 space-y-3">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/35 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{p}</p>
            </motion.div>
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
