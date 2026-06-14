"use client";

import { motion } from "framer-motion";

const values = [
  { ohms: 100,     label: "100Ω",  use: "LED current limiting (low power)", color: "#10B981" },
  { ohms: 220,     label: "220Ω",  use: "LED with 5V supply (classic starter)", color: "#10B981" },
  { ohms: 470,     label: "470Ω",  use: "LED with 9V supply", color: "#0EA5E9" },
  { ohms: 1000,    label: "1KΩ",   use: "Pull-up / pull-down resistors", color: "#0EA5E9" },
  { ohms: 10000,   label: "10KΩ",  use: "Digital signal pull-up, button debounce", color: "#8B5CF6" },
  { ohms: 47000,   label: "47KΩ",  use: "Sensor input bias", color: "#F97316" },
  { ohms: 100000,  label: "100KΩ", use: "High-impedance input bias", color: "#F97316" },
  { ohms: 1000000, label: "1MΩ",   use: "Voltage dividers, discharge resistors", color: "#EF4444" },
];

export default function ResistorValues() {
  const maxLog = Math.log10(1000000);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7</p>
        <h2 className="text-xl font-bold mb-1">Resistor Values — The Ohm Scale</h2>
        <p className="text-white/45 text-sm mb-2 leading-relaxed">
          Resistance is measured in <strong className="text-white">Ohms (Ω)</strong>, named after Georg Ohm.
          Common values range from a fraction of an Ohm to several Megaohms (MΩ).
        </p>
        <div className="flex gap-4 text-xs text-white/35 mb-6">
          <span>1Ω = 1 Ohm</span>
          <span>1KΩ = 1,000Ω</span>
          <span>1MΩ = 1,000,000Ω</span>
        </div>

        <div className="space-y-2">
          {values.map((v, i) => {
            const pct = (Math.log10(v.ohms) / maxLog) * 100;
            return (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border border-white/5 p-3 hover:border-white/10 transition-colors"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold font-mono w-14 shrink-0" style={{ color: v.color }}>{v.label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 + 0.15 }}
                      className="h-full rounded-full"
                      style={{ background: v.color }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-white/35 pl-[68px]">{v.use}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-xl border border-secondary/15 flex gap-3" style={{ background: "rgba(14,165,233,0.06)" }}>
          <span className="text-xl">🎯</span>
          <div>
            <p className="text-xs font-semibold text-secondary mb-1">Most common values to memorize</p>
            <p className="text-xs text-white/45 leading-relaxed">
              For beginners: <strong className="text-white/70">220Ω</strong> (5V LED), <strong className="text-white/70">470Ω</strong> (9V LED),
              and <strong className="text-white/70">10KΩ</strong> (pull-up) cover 90% of your early projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
