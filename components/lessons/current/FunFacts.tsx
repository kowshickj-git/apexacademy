"use client";

import { motion } from "framer-motion";

const facts = [
  {
    emoji: "📱",
    title: "Phone Charger",
    detail: "1–3 Amperes",
    desc: "Your phone's USB charger typically delivers 1–3A. Fast chargers push up to 5A to charge your battery quicker.",
    color: "primary",
  },
  {
    emoji: "💡",
    title: "Single LED",
    detail: "20 milliAmperes",
    desc: "A standard LED uses only 20mA (0.02A) — that's why LEDs are incredibly efficient and last for years!",
    color: "secondary",
  },
  {
    emoji: "⚡",
    title: "Lightning Strike",
    detail: "20,000+ Amperes",
    desc: "A bolt of lightning can carry 20,000A or more in a fraction of a second. That's enormous current but for a very short time.",
    color: "primary",
  },
  {
    emoji: "🚗",
    title: "Electric Vehicle",
    detail: "100–500 Amperes",
    desc: "EVs like Tesla draw hundreds of Amperes during fast charging. That's why EV chargers need thick cables and special sockets!",
    color: "secondary",
  },
  {
    emoji: "🧠",
    title: "Your Brain",
    detail: "< 1 microAmpere",
    desc: "Neurons in your brain use currents smaller than 1 microampere (0.000001A) to send signals at up to 120 meters per second!",
    color: "primary",
  },
];

export default function FunFacts() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#09</p>
        <h2 className="text-2xl font-bold text-white">Fun Facts about Current</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        {facts.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09, duration: 0.35 }}
            className="flex gap-4 rounded-2xl border p-4"
            style={{
              background: "#18181B",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: f.color === "primary" ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)",
              }}
            >
              {f.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-sm font-bold text-white">{f.title}</p>
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    color: f.color === "primary" ? "#10B981" : "#0EA5E9",
                    background: f.color === "primary" ? "rgba(16,185,129,0.12)" : "rgba(14,165,233,0.12)",
                  }}
                >
                  {f.detail}
                </span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
