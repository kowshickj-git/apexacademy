"use client";

import { motion } from "framer-motion";

const ideaCards = [
  {
    icon: "🩺",
    title: "Diagnose",
    desc: "Find faults before they become failures — pinpoint the exact problem in any circuit.",
  },
  {
    icon: "📏",
    title: "Measure",
    desc: "Know exact values, not guesses — real numbers, real confidence in your designs.",
  },
  {
    icon: "✅",
    title: "Verify",
    desc: "Confirm your circuit works as designed — from the first prototype to final product.",
  },
];

export default function BigIdea() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 1 · Concept
        </p>
        <h2 className="text-xl font-bold mb-6">The Big Idea</h2>

        {/* Story quote */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/8 p-5 mb-8 relative overflow-hidden"
          style={{ background: "rgba(167,139,250,0.04)" }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ background: "linear-gradient(to bottom, #A78BFA, #8B5CF6)" }}
          />
          <p className="text-white/65 text-sm leading-relaxed pl-3 italic">
            &ldquo;Imagine being a doctor. You use instruments to check a patient&apos;s health — heart rate,
            blood pressure, temperature. An electronics engineer does the same with circuits.{" "}
            <span style={{ color: "#A78BFA" }} className="font-semibold not-italic">
              The multimeter is your stethoscope.
            </span>
            &rdquo;
          </p>
        </motion.div>

        {/* Three idea cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ideaCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-white/8 p-4"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <h3 className="text-sm font-bold mb-1" style={{ color: "#A78BFA" }}>
                {card.title}
              </h3>
              <p className="text-xs text-white/45 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
