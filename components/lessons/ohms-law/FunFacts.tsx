"use client";

import { motion } from "framer-motion";

const facts = [
  { icon: "🤖", headline: "Used in every robot ever built", detail: "From a simple Arduino arm to NASA's Mars rovers, every robot uses Ohm's Law to design motor drivers, sensor circuits, and power systems.", color: "#10B981" },
  { icon: "📡", headline: "Satellites use it too", detail: "Every satellite in orbit — including GPS, weather, and ISS — relies on circuits designed using Ohm's Law to manage power budgets and signal conditioning.", color: "#0EA5E9" },
  { icon: "💊", headline: "Medical devices", detail: "Pacemakers, MRI machines, and blood pressure monitors all use Ohm's Law. Getting it wrong by even 1% in a pacemaker circuit can be life-threatening.", color: "#8B5CF6" },
  { icon: "🎸", headline: "Guitar amplifiers", detail: "Every electric guitar amplifier uses Ohm's Law to match speaker impedance (8Ω or 4Ω) to the amplifier output — otherwise sound quality suffers or the amp is damaged.", color: "#EC4899" },
  { icon: "🔦", headline: "Georg Ohm was self-taught", detail: "Ohm's father, a locksmith, taught himself mathematics and passed it to Georg — who later became one of the most cited scientists in electrical engineering history.", color: "#EAB308" },
  { icon: "📺", headline: "Your TV uses thousands of Ohm calculations", detail: "Modern LCD TVs contain thousands of resistors, all sized using Ohm's Law to control backlight current, signal levels, and power management across millions of pixels.", color: "#F97316" },
];

export default function FunFacts() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 16</p>
        <h2 className="text-xl font-bold mb-6">Fun Facts</h2>
        <div className="space-y-3">
          {facts.map((f, i) => (
            <motion.div
              key={f.headline}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="flex gap-4 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0"
                style={{ background: `${f.color}15`, borderColor: `${f.color}30` }}
              >
                {f.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5" style={{ color: f.color }}>{f.headline}</p>
                <p className="text-xs text-white/40 leading-relaxed">{f.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
