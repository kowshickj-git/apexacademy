"use client";

import { motion } from "framer-motion";

const facts = [
  { emoji: "⚡", fact: "Copper has one of the lowest resistances of any common metal — 1.7 × 10⁻⁸ Ω·m — which is why it's used in almost every wire.", color: "#F97316" },
  { emoji: "🛡️", fact: "Rubber has resistance so high (~10¹³ Ω·m) that even 1,000 volts can't push meaningful current through it — that's why rubber gloves protect electricians.", color: "#10B981" },
  { emoji: "🔥", fact: "The nichrome wire in a toaster reaches 1000°C because its resistance converts electrical energy directly into heat. Without resistance, no heat!", color: "#EF4444" },
  { emoji: "⛈️", fact: "Lightning always takes the path of least resistance — usually moisture in the air or a tall tree, which explains why tall objects get struck more often.", color: "#0EA5E9" },
  { emoji: "🧪", fact: "Superconductors are materials with exactly 0 Ω of resistance at very low temperatures. At -196°C, some metals lose all resistance entirely!", color: "#A78BFA" },
];

export default function FunFacts() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="09" title="Fun Facts" />
      <div className="space-y-3">
        {facts.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09 }}
            className="flex gap-3 items-start p-4 rounded-2xl border border-white/7"
            style={{ background: `${f.color}09` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border"
              style={{ background: `${f.color}15`, borderColor: `${f.color}28` }}
            >
              {f.emoji}
            </div>
            <p className="text-sm text-white/65 leading-relaxed">{f.fact}</p>
          </motion.div>
        ))}
      </div>
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
