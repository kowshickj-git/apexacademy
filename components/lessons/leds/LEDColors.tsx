"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
  { name: "Infrared", wavelength: "850–940nm", vf: "1.2–1.6V", material: "GaAs", hex: "#4B1818", glow: "rgba(150,30,30,0.4)", note: "Invisible to humans. Used in TV remotes, IR sensors, facial recognition." },
  { name: "Red", wavelength: "620–750nm", vf: "1.8–2.2V", material: "AlGaInP", hex: "#EF4444", glow: "rgba(239,68,68,0.7)", note: "First visible LED color (1962). Most common in indicators and brake lights." },
  { name: "Orange", wavelength: "590–620nm", vf: "2.0–2.2V", material: "AlGaInP", hex: "#F97316", glow: "rgba(249,115,22,0.7)", note: "Common in traffic lights and car turn signals. Similar manufacturing to red LEDs." },
  { name: "Yellow", wavelength: "570–590nm", vf: "2.0–2.2V", material: "AlGaInP", hex: "#EAB308", glow: "rgba(234,179,8,0.7)", note: "Used in traffic signals and status indicators. Lower efficiency than red LEDs." },
  { name: "Green", wavelength: "520–560nm", vf: "2.0–3.5V", material: "InGaN / AlGaP", hex: "#10B981", glow: "rgba(16,185,129,0.7)", note: "Pure green (525nm) uses InGaN. The brightest color to the human eye at equal power." },
  { name: "Blue", wavelength: "450–490nm", vf: "3.0–3.5V", material: "InGaN", hex: "#0EA5E9", glow: "rgba(14,165,233,0.7)", note: "Pioneered by Nakamura, Akasaki & Amano (Nobel 2014). Enabled white LEDs and modern lighting." },
  { name: "White", wavelength: "All visible", vf: "3.0–3.6V", material: "Blue LED + phosphor", hex: "#F9FAFB", glow: "rgba(249,250,251,0.8)", note: "Blue InGaN chip + yellow phosphor coating = white light. Efficiency: up to 200 lm/W." },
  { name: "UV", wavelength: "370–400nm", vf: "3.5–4.0V", material: "InGaN (high Al)", hex: "#7C3AED", glow: "rgba(124,58,237,0.7)", note: "Used for counterfeit detection, sterilisation, and curing adhesives." },
];

export default function LEDColors() {
  const [active, setActive] = useState(1);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Colors</p>
        <h2 className="text-xl font-bold mb-1">LED Colors — From Infrared to UV</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          The semiconductor material determines the photon energy — and therefore the color.
          Higher energy photons (shorter wavelength = blue/UV) require wider band-gap materials and higher forward voltage.
        </p>

        {/* Spectrum bar */}
        <div className="rounded-2xl overflow-hidden mb-5 p-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex rounded-xl overflow-hidden h-8">
            {colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                className="flex-1 transition-all hover:opacity-80"
                style={{
                  background: c.hex,
                  opacity: active === i ? 1 : 0.5,
                  boxShadow: active === i ? `inset 0 -3px 0 rgba(255,255,255,0.4)` : "none",
                }}
                title={c.name}
              />
            ))}
          </div>
          <div className="flex justify-between px-1 mt-1">
            <span className="text-[8px] text-white/25 font-mono">Infrared</span>
            <span className="text-[8px] text-white/25 font-mono">↑ wavelength decreases, energy increases →</span>
            <span className="text-[8px] text-white/25 font-mono">UV</span>
          </div>
        </div>

        {/* Color buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActive(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all"
              style={active === i
                ? { background: `${c.hex}25`, borderColor: `${c.hex}60`, color: c.hex === "#F9FAFB" ? "rgba(255,255,255,0.9)" : c.hex }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              }
            >
              <div className="w-2 h-2 rounded-full" style={{ background: c.hex }} />
              {c.name}
            </button>
          ))}
        </div>

        {/* Detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-5"
            style={{
              background: `${colors[active].hex}10`,
              borderColor: `${colors[active].hex}35`,
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-full border-2 shrink-0 transition-all"
                style={{
                  borderColor: colors[active].hex,
                  background: `${colors[active].hex}35`,
                  boxShadow: `0 0 20px ${colors[active].glow}`,
                }}
              />
              <div>
                <p className="text-base font-black" style={{ color: colors[active].hex === "#F9FAFB" ? "rgba(255,255,255,0.9)" : colors[active].hex }}>
                  {colors[active].name} LED
                </p>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-[10px] text-white/35 font-mono">λ = {colors[active].wavelength}</span>
                  <span className="text-[10px] text-white/35 font-mono">Vf = {colors[active].vf}</span>
                  <span className="text-[10px] text-white/35 font-mono">Material: {colors[active].material}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">{colors[active].note}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 p-3 rounded-xl border border-yellow-500/15 text-xs text-white/40 leading-relaxed" style={{ background: "rgba(234,179,8,0.06)" }}>
          <strong className="text-yellow-400">Nobel Prize fact:</strong> The 2014 Nobel Prize in Physics went to Nakamura, Akasaki & Amano for inventing the blue LED. Without blue, there was no white LED — and no modern energy-efficient lighting.
        </div>
      </div>
    </section>
  );
}
