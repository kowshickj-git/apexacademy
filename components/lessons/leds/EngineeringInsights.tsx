"use client";

import { motion } from "framer-motion";

const insights = [
  {
    icon: "🎛️",
    title: "PWM dimming — why engineers don't use voltage",
    detail: "Reducing LED voltage to dim it changes the colour (colour temperature shifts). Instead, engineers use PWM (Pulse Width Modulation) — switching the LED on/off 1000x per second at different duty cycles. Your eyes see average brightness, not the flickering.",
    formula: "Duty cycle = on_time / period × 100%  →  50% duty = 50% brightness",
  },
  {
    icon: "🔌",
    title: "Current source vs voltage source for LEDs",
    detail: "LED brightness is proportional to current, not voltage. A 0.1V change at the forward voltage point can double current. Professional LED drivers use constant-current sources, not resistors, for consistent brightness across temperature changes.",
    formula: "LED current source: set I = Vref / Rsense  (e.g. 20mA = 100mV / 5Ω)",
  },
  {
    icon: "🌡️",
    title: "Thermal derating at high temperature",
    detail: "LED forward voltage decreases ~2mV per °C temperature rise. At 100°C junction temperature, a red LED's Vf drops from 2.0V to 1.8V. More current flows — causing more heat — a thermal runaway loop. Engineers derate LED current by 30% at high ambient temperatures.",
    formula: "ΔVf ≈ −2mV/°C  →  At 100°C: Vf = 2.0 − (0.002 × 75) = 1.85V",
  },
  {
    icon: "🌐",
    title: "Addressable LED strips (WS2812B / NeoPixel)",
    detail: "Each WS2812B LED contains three tiny RGB LED dies plus a controller IC. You send 24-bit colour data serially. One microcontroller pin can control 1000+ LEDs. Used in every LED strip light and gaming peripheral.",
    formula: "Data rate: 800kbps  →  60 LEDs refreshed at 800Hz = smooth animation",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 16 · Engineering</p>
        <h2 className="text-xl font-bold mb-1">How Engineers Actually Use LEDs</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Beyond the basics — real engineering decisions that separate a working project from a professional design.
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
              <div className="px-3 py-2 rounded-lg border border-red-500/15 font-mono text-[10px]" style={{ background: "rgba(239,68,68,0.07)", color: "#FCA5A5" }}>
                {formula}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
