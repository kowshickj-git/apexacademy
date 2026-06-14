"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    icon: "🔴",
    title: "Both LED legs in the same row",
    what: "Both legs share the same electrical node — there's no voltage difference across the LED — it doesn't light up.",
    fix: "Place the anode and cathode in different rows so current can flow through the LED.",
  },
  {
    icon: "🔴",
    title: "No current-limiting resistor with LED",
    what: "Too much current flows through the LED — it burns out in milliseconds. LEDs have no built-in current limit.",
    fix: "Always add a resistor in series (220Ω–1kΩ for 5V). Calculate: R = (Vsupply − Vf) / If.",
  },
  {
    icon: "🔴",
    title: "Components across the center gap — intended to be connected",
    what: "They look connected visually, but the center gap is a physical break — no electrical connection crosses it.",
    fix: "Use a jumper wire to bridge the gap, or place the component so it intentionally spans the gap (like a DIP IC).",
  },
  {
    icon: "🔴",
    title: "Wrong power rail polarity",
    what: "The circuit is reversed — polarized components (LEDs, electrolytic capacitors, diodes) fail or are damaged.",
    fix: "Always mark + and − clearly before wiring. Double-check polarity before applying power.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 6 · Common Mistakes
        </p>
        <h2 className="text-xl font-bold mb-5">Common Breadboard Mistakes</h2>

        <div className="space-y-3">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="p-4 rounded-2xl border"
              style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.04)" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">{m.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white/85 mb-2">{m.title}</p>
                  <p className="text-xs text-white/45 leading-relaxed mb-2">{m.what}</p>
                  <div
                    className="flex gap-2 p-2.5 rounded-lg"
                    style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}
                  >
                    <span className="text-xs shrink-0" style={{ color: "#14B8A6" }}>✓ Fix:</span>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(20,184,166,0.8)" }}>{m.fix}</p>
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
