"use client";

import { motion } from "framer-motion";

export default function WhatIsLED() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 1 · Concept</p>
        <h2 className="text-xl font-bold mb-1">What Is an LED?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          LED stands for <strong className="text-white/75">Light Emitting Diode</strong>. It&apos;s a special type of diode — a semiconductor device — that emits light
          when current flows through it in the forward direction. Unlike a light bulb, it has no filament to burn out.
          Instead, it converts electrical energy directly into light at the atomic level.
        </p>

        {/* Big visual */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-red-500/20 p-6 mb-6 text-center"
          style={{ background: "rgba(239,68,68,0.05)" }}
        >
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {/* Incandescent */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-5xl opacity-40">💡</div>
              <p className="text-xs font-bold text-white/40">Incandescent Bulb</p>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                  <span className="text-red-400/60">✗</span> Filament burns out
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                  <span className="text-red-400/60">✗</span> 95% energy = heat
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                  <span className="text-red-400/60">✗</span> 1,000 hour life
                </div>
              </div>
            </div>

            <div className="text-2xl text-white/15">vs</div>

            {/* LED */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-5xl" style={{ filter: "drop-shadow(0 0 16px rgba(239,68,68,0.8))" }}>💡</div>
              <p className="text-xs font-bold text-red-300">LED</p>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-white/55">
                  <span className="text-primary">✓</span> No filament
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/55">
                  <span className="text-primary">✓</span> 80%+ energy = light
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/55">
                  <span className="text-primary">✓</span> 50,000 hour life
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key facts */}
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: "💡", title: "Light by quantum physics", body: "Electrons and 'holes' recombine at the P-N junction, releasing energy as photons. No heat required — pure quantum emission." },
            { icon: "🎨", title: "Color from chemistry", body: "The LED's semiconductor material determines the photon's energy — and therefore its color. Different materials = different colors." },
            { icon: "📏", title: "Tiny and tough", body: "A standard 5mm LED uses ~20mA, withstands vibration and shock, and lasts 50,000+ hours. Ideal for embedded electronics." },
            { icon: "🌍", title: "Everywhere", body: "Phone screens (OLED), traffic lights, TV backlights, indicator lights, headlamps, billboards — LEDs replaced most other light sources." },
          ].map(({ icon, title, body }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-white/7 p-4"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-lg mb-1">{icon}</p>
              <p className="text-xs font-bold text-white/70 mb-1">{title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
