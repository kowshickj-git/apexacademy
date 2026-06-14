"use client";

import { motion } from "framer-motion";

const concepts = [
  {
    icon: "🧱",
    title: "No Soldering",
    desc: "Push components in, pull them out — no heat, no fumes, no permanent mistakes.",
  },
  {
    icon: "♻️",
    title: "Fully Reusable",
    desc: "Build the same circuit 1000 times on the same board. Zero waste.",
  },
  {
    icon: "⚡",
    title: "Instant Testing",
    desc: "See results in seconds, not hours. Change a component in 5 seconds flat.",
  },
];

export default function BigIdea() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-4 font-mono">
          The Big Idea
        </p>

        {/* Quote block */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative pl-5 mb-8"
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{ background: "linear-gradient(to bottom, #14B8A6, #10B981)" }}
          />
          <p className="text-base sm:text-lg text-white/70 leading-relaxed italic">
            &ldquo;Imagine LEGO blocks. Instead of permanently gluing them together, you can snap them together and test ideas. A breadboard does the same thing for electronics — build, test, change, repeat.&rdquo;
          </p>
        </motion.div>

        {/* Concept cards */}
        <div className="grid sm:grid-cols-3 gap-3">
          {concepts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-4 rounded-2xl border border-white/8"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="text-sm font-bold text-white/90 mb-1">{c.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
