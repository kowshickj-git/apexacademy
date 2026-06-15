"use client";

import { motion } from "framer-motion";

const cards = [
  {
    icon: "⚡",
    title: "Faraday's Law",
    formula: "EMF = −N × dΦ/dt",
    desc: "The rate of change of magnetic flux determines induced voltage. The negative sign (Lenz's Law) means the induced current opposes the flux change. Faster flux change → higher induced EMF.",
    color: "#8B5CF6",
  },
  {
    icon: "♨",
    title: "Transformer Efficiency",
    formula: "η = P_out / P_in × 100%",
    desc: "Real transformers: 95–99% efficient. Losses come from two sources: (1) Core losses — eddy currents (reduced by laminated cores) and hysteresis (reduced by silicon steel). (2) Copper losses — I²R heating in windings.",
    color: "#F59E0B",
  },
  {
    icon: "〜",
    title: "Frequency Dependence",
    formula: "Works only with AC (changing flux)",
    desc: "Transformers require changing magnetic flux (dΦ/dt). DC produces constant flux → zero induced EMF → transformer doesn't work (just heats up). This is exactly why the AC power system won over Edison's DC — AC enables efficient transformer use.",
    color: "#0EA5E9",
  },
  {
    icon: "🧲",
    title: "Core Materials",
    formula: "Material chosen by frequency",
    desc: "Silicon steel: 50/60Hz power transformers. Ferrite: kHz–MHz switching power supplies (SMPS). Air core: RF/radio circuits (no core loss, but poor coupling). Each material balances permeability, losses, and saturation flux density.",
    color: "#10B981",
  },
  {
    icon: "🛡",
    title: "Isolation Safety",
    formula: "1:1 ratio, no earth connection",
    desc: "Medical equipment uses isolation transformers with 1:1 ratio. This breaks the electrical path to earth ground. If equipment faults, no current can flow through a person to ground — preventing electrocution. Also used in oscilloscope probes and lab power supplies.",
    color: "#EC4899",
  },
];

export default function EngineeringSection() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 9 · Engineering
        </p>
        <h2 className="text-xl font-bold mb-1">Engineering Deep Dive</h2>
        <p className="text-white/45 text-sm mb-5">
          The physics and engineering behind transformer design and operation.
        </p>

        <div className="space-y-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-xl border p-4"
              style={{
                borderColor: `${card.color}22`,
                background: `${card.color}08`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                >
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white/80">{card.title}</h3>
                  </div>
                  <div
                    className="font-mono text-xs px-2 py-1 rounded-lg inline-block mb-2"
                    style={{ background: `${card.color}14`, color: card.color }}
                  >
                    {card.formula}
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
