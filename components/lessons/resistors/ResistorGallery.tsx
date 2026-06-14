"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onVisualView: () => void; }

const types = [
  {
    name: "Carbon Film",
    color: "#F97316",
    bands: ["#F97316", "#8B4513", "#000000", "#FFD700"],
    desc: "Most common through-hole resistor. Made by depositing a carbon film on a ceramic rod. Cheap, ±5% tolerance. Used in breadboard projects.",
    uses: ["Arduino projects", "LED circuits", "School labs"],
    range: "1Ω – 10MΩ",
  },
  {
    name: "Metal Film",
    color: "#0EA5E9",
    bands: ["#0EA5E9", "#4B0082", "#A52A2A", "#FFD700", "#8B8B8B"],
    desc: "Higher precision than carbon film. ±1% or better tolerance. Thin metal layer on ceramic. Used in audio amplifiers and measurement circuits.",
    uses: ["Audio circuits", "Precision instruments", "Medical devices"],
    range: "1Ω – 1MΩ",
  },
  {
    name: "Wirewound",
    color: "#10B981",
    bands: [],
    desc: "A wire coiled around a ceramic core. Handles high power (up to 50W+). More expensive. Used in power supplies and motor controllers.",
    uses: ["Power supplies", "Motor drives", "Industrial control"],
    range: "0.1Ω – 100KΩ",
  },
  {
    name: "SMD / Chip",
    color: "#8B5CF6",
    bands: [],
    desc: "Surface-mount device. Tiny rectangular chip soldered directly to PCB. No leads. Automated manufacturing. Found on every modern circuit board.",
    uses: ["Smartphones", "Laptops", "All PCBs"],
    range: "Any value",
  },
  {
    name: "Variable (Potentiometer)",
    color: "#EC4899",
    bands: [],
    desc: "A resistor whose value can be changed by turning a knob or sliding. The wiper moves along a resistive track. Volume knobs use these.",
    uses: ["Volume controls", "Dimmer switches", "Tuning circuits"],
    range: "0 – Max Value",
  },
  {
    name: "Power Resistor",
    color: "#EF4444",
    bands: [],
    desc: "Designed to handle large amounts of power as heat. Often has a metal casing for heat dissipation. Used in industrial and high-current applications.",
    uses: ["Motor braking", "Load testing", "Power conversion"],
    range: "0.1Ω – 100Ω",
  },
];

export default function ResistorGallery({ onVisualView }: Props) {
  const [selected, setSelected] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) { setTriggered(true); onVisualView(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered, onVisualView]);

  const t = types[selected];

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 5</p>
        <h2 className="text-xl font-bold mb-1">Types of Resistors — Gallery</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Click each type to explore how it looks and where it&apos;s used.
        </p>

        {/* Selector grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {types.map((tp, i) => (
            <button
              key={tp.name}
              onClick={() => setSelected(i)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center"
              style={selected === i
                ? { background: `rgba(${tp.color === "#F97316" ? "249,115,22" : tp.color === "#0EA5E9" ? "14,165,233" : tp.color === "#10B981" ? "16,185,129" : tp.color === "#8B5CF6" ? "139,92,246" : tp.color === "#EC4899" ? "236,72,153" : "239,68,68"},0.13)`, borderColor: tp.color }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }
              }
            >
              {/* Mini resistor shape */}
              <div className="w-8 h-4 rounded flex items-center justify-center" style={{ background: `rgba(${tp.color === "#F97316" ? "249,115,22" : tp.color === "#0EA5E9" ? "14,165,233" : tp.color === "#10B981" ? "16,185,129" : tp.color === "#8B5CF6" ? "139,92,246" : tp.color === "#EC4899" ? "236,72,153" : "239,68,68"},0.2)`, border: `1px solid ${tp.color}40` }}>
                {tp.bands.length > 0 ? (
                  <div className="flex gap-0.5">
                    {tp.bands.slice(0, 3).map((c, j) => (
                      <div key={j} className="w-1 h-2.5 rounded-sm" style={{ background: c }} />
                    ))}
                  </div>
                ) : (
                  <div className="w-5 h-2 rounded-sm" style={{ background: tp.color, opacity: 0.7 }} />
                )}
              </div>
              <span className="text-[9px] text-white/50 leading-tight">{tp.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl border p-5"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-start gap-4">
              {/* Visual */}
              <div
                className="w-20 h-12 rounded-xl shrink-0 flex items-center justify-center border"
                style={{ background: `rgba(${t.color === "#F97316" ? "249,115,22" : t.color === "#0EA5E9" ? "14,165,233" : t.color === "#10B981" ? "16,185,129" : t.color === "#8B5CF6" ? "139,92,246" : t.color === "#EC4899" ? "236,72,153" : "239,68,68"},0.1)`, borderColor: `${t.color}30` }}
              >
                {t.bands.length > 0 ? (
                  <div className="flex items-center gap-0.5">
                    <div className="w-3 h-px bg-white/20" />
                    <div className="w-12 h-7 rounded-sm flex items-center gap-0.5 px-1" style={{ background: "#D2B48C" }}>
                      {t.bands.map((c, j) => (
                        <div key={j} className="w-1.5 h-5 rounded-sm" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="w-3 h-px bg-white/20" />
                  </div>
                ) : (
                  <div className="w-14 h-6 rounded border flex items-center justify-center" style={{ background: t.color + "25", borderColor: t.color + "50" }}>
                    <span className="text-[9px] font-bold" style={{ color: t.color }}>R</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold" style={{ color: t.color }}>{t.name}</h3>
                  <span className="text-[9px] font-mono text-white/25 border border-white/8 px-1.5 py-0.5 rounded">{t.range}</span>
                </div>
                <p className="text-xs text-white/45 leading-relaxed mb-2">{t.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.uses.map((u) => (
                    <span key={u} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ color: t.color, borderColor: t.color + "40", background: t.color + "10" }}>{u}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
