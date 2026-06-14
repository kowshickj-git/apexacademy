"use client";

import { motion } from "framer-motion";

const examples = [
  {
    emoji: "🔶",
    title: "Copper Wire",
    subtitle: "Resistance: ~0.017 Ω/m",
    type: "Useful & Low",
    typeColor: "#10B981",
    desc: "Copper wire has very low resistance on purpose — it lets current travel far with minimal energy loss. Used in power cables, PCBs, and motors.",
    good: true,
    fact: "If copper had high resistance, your phone charger would overheat trying to deliver power.",
  },
  {
    emoji: "🔥",
    title: "Electric Heater",
    subtitle: "Resistance: ~14–28 Ω",
    type: "Useful & High",
    typeColor: "#F97316",
    desc: "A heater intentionally uses high-resistance wire (nichrome). When current passes through, the wire gets hot — that's resistance converting electricity to heat.",
    good: true,
    fact: "The filament in an old light bulb works the same way — resistance generates both heat and light.",
  },
  {
    emoji: "💡",
    title: "LED Circuit Resistor",
    subtitle: "Typical: 100–470 Ω",
    type: "Protective",
    typeColor: "#0EA5E9",
    desc: "An LED has almost no internal resistance. Without an external resistor, too much current flows, destroying it instantly. The resistor acts as a guardian.",
    good: true,
    fact: "Formula: R = (Vs − Vf) / If — resistance is calculated to deliver exactly the right current.",
  },
];

export default function GoodVsBadResistance() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="08" title="Good vs Bad Resistance" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="p-4 rounded-2xl border border-primary/15" style={{ background: "rgba(16,185,129,0.05)" }}>
          <p className="text-sm text-white/65 leading-relaxed">
            Resistance is often misunderstood as purely negative. In reality,{" "}
            <span className="text-white font-semibold">resistance is a tool</span>. Engineers use it deliberately to control heat, limit current, and protect components.
          </p>
        </div>

        {examples.map((ex, i) => (
          <motion.div
            key={ex.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/8 p-4"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl flex-shrink-0">{ex.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <p className="text-sm font-bold text-white">{ex.title}</p>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ background: `${ex.typeColor}15`, borderColor: `${ex.typeColor}30`, color: ex.typeColor }}
                  >
                    {ex.type}
                  </span>
                </div>
                <p className="text-[10px] text-white/35 font-mono mb-2">{ex.subtitle}</p>
                <p className="text-sm text-white/60 leading-relaxed mb-2">{ex.desc}</p>
                <div className="flex items-start gap-2 p-2.5 rounded-lg border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <span className="text-sm">💡</span>
                  <p className="text-[11px] text-white/45 leading-relaxed">{ex.fact}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="p-4 rounded-2xl border border-secondary/15 text-center" style={{ background: "rgba(14,165,233,0.05)" }}>
          <p className="text-xs font-bold text-secondary mb-1">Key Takeaway</p>
          <p className="text-sm text-white/65">Resistance is not the enemy — it's one of the most powerful tools in electronics.</p>
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
