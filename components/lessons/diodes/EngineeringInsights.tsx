"use client";

import { motion } from "framer-motion";

const insights = [
  {
    icon: "🔋",
    title: "Preventing battery drain in IoT",
    detail: "A 1N5817 Schottky diode in series with a solar panel input prevents the battery from powering the panel at night. Engineers choose Schottky over silicon to minimize the 0.3V vs 0.7V voltage loss.",
    formula: "Effective voltage = Vsolar − 0.3V (Schottky) vs −0.7V (silicon)",
  },
  {
    icon: "💡",
    title: "LED polarity indicator circuit",
    detail: "Two LEDs (red and green) wired anti-parallel across a diode + resistor tells you instantly if mains polarity is correct. If wired backwards, the red LED lights instead of green.",
    formula: "R = (230V − 2V) / 5mA = 45.6kΩ → use 47kΩ",
  },
  {
    icon: "🚗",
    title: "OR-ing two power sources",
    detail: "In battery-backed systems, two Schottky diodes 'OR' the main supply and battery backup. The higher voltage wins automatically — no relays, no control logic needed.",
    formula: "Vout = max(Vsupply, Vbattery) − 0.3V",
  },
  {
    icon: "📡",
    title: "Envelope detection in AM radio",
    detail: "A single germanium diode (Vf ≈ 0.2V) extracts audio from an AM signal by passing only the positive peaks. The RC circuit then smooths them to recover the audio waveform.",
    formula: "RC time constant: τ = 1/(2π × f_audio_max) ≈ 15μs",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Engineering</p>
        <h2 className="text-xl font-bold mb-1">How Engineers Use Diodes</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Real engineering tasks where the humble diode solves surprisingly tricky problems.
        </p>

        <div className="space-y-4">
          {insights.map(({ icon, title, detail, formula }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-white/7 p-5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{icon}</span>
                <p className="text-sm font-bold text-white/75">{title}</p>
              </div>
              <p className="text-xs text-white/45 leading-relaxed mb-3">{detail}</p>
              <div className="px-3 py-2 rounded-lg border border-purple-500/15 font-mono text-[10px]" style={{ background: "rgba(139,92,246,0.07)", color: "#A78BFA" }}>
                {formula}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
