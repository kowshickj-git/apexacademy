"use client";

import { motion } from "framer-motion";

const events = [
  { year: "1789", title: "Georg Simon Ohm Born", desc: "Born March 16 in Erlangen, Bavaria. Son of a locksmith who educated himself in mathematics and physics through self-study.", icon: "👶", color: "#10B981" },
  { year: "1817", title: "Physics Teacher", desc: "Becomes a physics teacher in Cologne. Begins systematic experiments with electrical circuits, wire lengths, and battery types.", icon: "🏫", color: "#0EA5E9" },
  { year: "1825", title: "First Experiments", desc: "Ohm carefully measures how current changes when he varies wire length and voltage. Records precise data — groundbreaking at the time.", icon: "🔬", color: "#8B5CF6" },
  { year: "1827", title: "Publishes Ohm's Law", desc: "Publishes \"Die galvanische Kette\" — The Galvanic Circuit. States: current is proportional to voltage and inversely to resistance: V = I × R.", icon: "📖", color: "#F97316" },
  { year: "1827", title: "Scientists Reject It", desc: "German scientists call the paper \"a web of naked fancies.\" Ohm loses his teaching position and falls into poverty. A dark chapter.", icon: "😤", color: "#EF4444" },
  { year: "1841", title: "Royal Society of London", desc: "British scientists recognise Ohm's work as revolutionary. He receives the Copley Medal — one of the highest scientific honours of the time.", icon: "🏅", color: "#EAB308" },
  { year: "1854", title: "Georg Ohm Dies", desc: "Died July 6, age 65. He lived to see his law accepted but never saw it taught universally. His name became the unit of resistance — the Ohm (Ω).", icon: "🕊️", color: "#6B7280" },
  { year: "Today", title: "In Every Device You Own", desc: "V = I × R is used in every circuit design on Earth. From your phone charger to the Mars rover — Ohm's Law runs modern civilisation.", icon: "🌍", color: "#10B981" },
];

export default function OhmHistory() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 4 · History</p>
        <h2 className="text-xl font-bold mb-1">Who Discovered Ohm&apos;s Law?</h2>
        <p className="text-white/45 text-sm mb-8 leading-relaxed">
          The story of Georg Ohm is a story of patience, rejection, and eventual triumph. One of science&apos;s great underdogs.
        </p>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="space-y-5">
            {events.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex gap-4"
              >
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 text-base z-10"
                  style={{ background: `${e.color}14`, borderColor: `${e.color}40` }}
                >
                  {e.icon}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold font-mono" style={{ color: e.color }}>{e.year}</span>
                    <h3 className="text-sm font-semibold text-white/80">{e.title}</h3>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
