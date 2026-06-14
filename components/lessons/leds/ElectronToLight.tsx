"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { title: "Current flows into the LED", body: "When forward biased, conventional current enters the anode. This means electrons flow in the opposite direction — from cathode toward the P-N junction.", emoji: "⚡" },
  { title: "Electrons meet holes at the junction", body: "At the P-N junction, electrons from the N-type side collide with 'holes' (missing electrons) from the P-type side. They're about to recombine.", emoji: "🔵🔴" },
  { title: "Energy is released as a photon", body: "When an electron fills a hole, it drops to a lower energy level. The energy difference is released as a photon — a particle of light. This is electroluminescence.", emoji: "✨" },
  { title: "Photon escapes as visible light", body: "Millions of electron-hole recombinations happen per second. Each releases a photon. The photons escape the LED package and we see them as light.", emoji: "💡" },
  { title: "Color = energy gap", body: "The energy of each photon (and therefore its color / wavelength) is determined by the semiconductor's band gap. GaN = blue/white, AlGaInP = red/orange/yellow.", emoji: "🌈" },
];

export default function ElectronToLight() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 2500);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 3 · Physics</p>
        <h2 className="text-xl font-bold mb-1">How an LED Makes Light</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          An LED doesn&apos;t &quot;heat up&quot; to produce light like a bulb. It converts electrical energy directly to photons at the P-N junction via <strong className="text-white/70">electroluminescence</strong>.
        </p>

        {/* Step indicators */}
        <div className="flex gap-2 mb-5">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => { setAuto(false); setStep(i); }}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{ background: i === step ? "#EF4444" : "rgba(255,255,255,0.08)" }}
            />
          ))}
        </div>

        {/* Animated LED junction visual */}
        <div
          className="rounded-2xl border border-white/8 p-6 mb-5 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* LED cross-section */}
          <div className="shrink-0">
            <svg width="140" height="100" viewBox="0 0 140 100">
              {/* N-type region */}
              <rect x="0" y="10" width="60" height="80" rx="4" fill="rgba(14,165,233,0.2)" stroke="rgba(14,165,233,0.4)" strokeWidth="1" />
              <text x="30" y="55" textAnchor="middle" fontSize="12" fill="rgba(14,165,233,0.8)" fontFamily="monospace" fontWeight="bold">N</text>
              <text x="30" y="68" textAnchor="middle" fontSize="8" fill="rgba(14,165,233,0.5)" fontFamily="monospace">electrons</text>

              {/* Junction line */}
              <line x1="60" y1="10" x2="60" y2="90" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />

              {/* P-type region */}
              <rect x="60" y="10" width="60" height="80" rx="0" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
              <text x="90" y="55" textAnchor="middle" fontSize="12" fill="rgba(239,68,68,0.8)" fontFamily="monospace" fontWeight="bold">P</text>
              <text x="90" y="68" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.5)" fontFamily="monospace">holes</text>

              {/* Photon burst at junction */}
              {step >= 2 && (
                <>
                  <circle cx="60" cy="50" r="6" fill="#EAB308" opacity="0.8" style={{ animation: "pulse-glow 0.8s ease-in-out infinite" }} />
                  <line x1="60" y1="50" x2="80" y2="35" stroke="#EAB308" strokeWidth="1.5" opacity="0.6" style={{ animation: "pulse-glow 0.8s ease-in-out infinite 0.2s" }} />
                  <line x1="60" y1="50" x2="78" y2="65" stroke="#EAB308" strokeWidth="1.5" opacity="0.6" style={{ animation: "pulse-glow 0.8s ease-in-out infinite 0.4s" }} />
                  <line x1="60" y1="50" x2="85" y2="50" stroke="#EAB308" strokeWidth="1.5" opacity="0.6" style={{ animation: "pulse-glow 0.8s ease-in-out infinite 0.6s" }} />
                </>
              )}

              {/* Electron moving */}
              {step <= 1 && (
                <circle cx={step === 0 ? 45 : 62} cy="50" r="4" fill="#0EA5E9"
                  style={{ transition: "cx 0.5s ease" }}
                />
              )}
            </svg>
          </div>

          {/* Step content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{steps[step].emoji}</span>
                  <span className="text-[10px] text-white/25 font-mono">Step {step + 1} of {steps.length}</span>
                </div>
                <p className="text-sm font-bold text-white/80 mb-2">{steps[step].title}</p>
                <p className="text-xs text-white/50 leading-relaxed">{steps[step].body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAuto(false); setStep(i); }}
              className="px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all"
              style={step === i
                ? { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.35)", color: "#FCA5A5" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }
              }
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setAuto(!auto)}
            className="px-3 py-1.5 rounded-lg border text-[10px] transition-all"
            style={{ background: auto ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", borderColor: auto ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)", color: auto ? "#10B981" : "rgba(255,255,255,0.3)" }}
          >
            {auto ? "⏸ Pause" : "▶ Auto"}
          </button>
        </div>
      </div>
    </section>
  );
}
