"use client";

import { motion } from "framer-motion";

const comparisons = [
  { aspect: "Full name", diode: "Rectifier diode", led: "Light Emitting Diode" },
  { aspect: "Primary job", diode: "Control current direction", led: "Emit light" },
  { aspect: "Forward voltage", diode: "~0.6–0.7V (silicon)", led: "1.8–3.6V (colour-dependent)" },
  { aspect: "In reverse bias", diode: "No current (blocks)", led: "No current + no light" },
  { aspect: "In forward bias", diode: "Conducts electricity", led: "Emits photons (light)" },
  { aspect: "Max current (typical)", diode: "1A (1N4007)", led: "20mA (standard 5mm)" },
  { aspect: "Used for rectification?", diode: "Yes — main purpose", led: "No — optimised for light" },
  { aspect: "Example part", diode: "1N4007, 1N5819", led: "Standard 5mm, WS2812B" },
];

export default function LEDvsDiode() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 2 · Comparison</p>
        <h2 className="text-xl font-bold mb-1">LED vs Regular Diode</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          An LED is a diode — but it&apos;s optimised for light output rather than current control. The key difference is in the semiconductor material chosen during manufacturing.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* Header */}
          <div className="grid grid-cols-3 px-5 py-3 border-b border-white/6 text-xs font-bold text-white/40">
            <span></span>
            <span className="text-center" style={{ color: "rgba(167,139,250,0.7)" }}>Rectifier Diode</span>
            <span className="text-center" style={{ color: "rgba(239,68,68,0.7)" }}>LED</span>
          </div>

          <div className="divide-y divide-white/4">
            {comparisons.map((row) => (
              <div key={row.aspect} className="grid grid-cols-3 px-5 py-3 items-center">
                <span className="text-xs text-white/35 font-medium">{row.aspect}</span>
                <span className="text-xs text-white/55 text-center px-2">{row.diode}</span>
                <span className="text-xs text-white/55 text-center px-2">{row.led}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-4 p-4 rounded-xl border border-red-500/15" style={{ background: "rgba(239,68,68,0.06)" }}>
          <p className="text-xs font-bold text-red-300 mb-1">Important: Higher Forward Voltage</p>
          <p className="text-[11px] text-white/45 leading-relaxed">
            LEDs need 1.8–3.6V to conduct, not 0.7V like silicon rectifier diodes. If you calculate a resistor using 0.7V for an LED, your calculation will be wrong and the LED will likely burn out.
          </p>
        </div>
      </div>
    </section>
  );
}
