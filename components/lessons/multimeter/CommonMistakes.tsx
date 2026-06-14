"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    title: "Red probe in mA port while measuring voltage",
    consequence: "Can blow the internal fuse or damage the meter — always check which port your red probe is in!",
  },
  {
    title: "Measuring current IN PARALLEL",
    consequence:
      "Near short circuit — dangerous current spike that may damage the meter or battery. Current is always measured IN SERIES.",
  },
  {
    title: "Measuring resistance on a LIVE circuit",
    consequence:
      "Gives incorrect readings and may damage the meter's internal circuitry. Always power OFF before measuring resistance.",
  },
  {
    title: "Wrong range selected",
    consequence:
      "Reading shows 0.00 or OL — select a higher or lower range, or use AUTO-ranging if available.",
  },
  {
    title: "Forgetting to switch back from current mode",
    consequence:
      "If you then measure voltage with probes still in the current port — DANGER! This creates a short circuit through the meter.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 8 · Safety
        </p>
        <h2 className="text-xl font-bold mb-2">Common Mistakes</h2>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          These are the most dangerous and most frequent multimeter mistakes. Learn them now, avoid them forever.
        </p>

        <div className="space-y-3">
          {mistakes.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-red-500/20 p-4 flex gap-3"
              style={{ background: "rgba(239,68,68,0.04)" }}
            >
              <div className="shrink-0 mt-0.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: "rgba(239,68,68,0.18)", color: "#EF4444" }}
                >
                  {i + 1}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-red-400 mb-1">{m.title}</p>
                <p className="text-xs text-white/45 leading-relaxed">{m.consequence}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
