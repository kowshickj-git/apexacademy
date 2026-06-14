"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

const conductors = [
  { id: "copper", name: "Copper", emoji: "🔶", resistivity: "1.7 × 10⁻⁸ Ω·m", level: "Very Low", rating: 1, use: "Electrical wires, PCB traces", color: "#F97316" },
  { id: "silver", name: "Silver", emoji: "⚪", resistivity: "1.6 × 10⁻⁸ Ω·m", level: "Lowest", rating: 1, use: "High-end contacts, solar panels", color: "#CBD5E1" },
  { id: "gold", name: "Gold", emoji: "🟡", resistivity: "2.4 × 10⁻⁸ Ω·m", level: "Very Low", rating: 1, use: "Connectors, microchips", color: "#FCD34D" },
  { id: "aluminium", name: "Aluminium", emoji: "🔘", resistivity: "2.8 × 10⁻⁸ Ω·m", level: "Low", rating: 2, use: "Power lines, cans", color: "#94A3B8" },
];

const insulators = [
  { id: "rubber", name: "Rubber", emoji: "⬛", resistivity: "~10¹³ Ω·m", level: "Extremely High", rating: 10, use: "Wire coating, tyres", color: "#6B7280" },
  { id: "plastic", name: "Plastic", emoji: "🟫", resistivity: "~10¹⁰ Ω·m", level: "Very High", rating: 9, use: "Switches, plugs", color: "#92400E" },
  { id: "wood", name: "Wood", emoji: "🪵", resistivity: "~10³ Ω·m", level: "High", rating: 7, use: "Insulation", color: "#A16207" },
  { id: "glass", name: "Glass", emoji: "🪟", resistivity: "~10¹² Ω·m", level: "Extremely High", rating: 10, use: "High-voltage insulation", color: "#7DD3FC" },
];

type Material = typeof conductors[0] | typeof insulators[0];

export default function ConductorsInsulators({ onSimUsed }: Props) {
  const [selected, setSelected] = useState<Material | null>(null);
  const [triggered, setTriggered] = useState(false);

  const handleSelect = (m: Material) => {
    setSelected(m === selected ? null : m);
    if (!triggered) { setTriggered(true); onSimUsed(); }
  };

  const isConductor = selected ? conductors.some((c) => c.id === selected.id) : null;

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="05" title="Conductors vs Insulators" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <p className="text-sm text-white/65 leading-relaxed">
          Materials fall into two main categories based on how easily they let current flow. <span className="text-primary font-semibold">Tap a material</span> to explore it.
        </p>

        {/* Conductors */}
        <div className="rounded-2xl border border-primary/15 p-4" style={{ background: "rgba(16,185,129,0.04)" }}>
          <p className="text-xs font-bold text-primary mb-3">Good Conductors — Low Resistance</p>
          <div className="grid grid-cols-4 gap-2">
            {conductors.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all"
                style={selected?.id === m.id
                  ? { background: `${m.color}18`, borderColor: `${m.color}45`, boxShadow: `0 0 12px ${m.color}22` }
                  : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }
                }
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-[10px] font-semibold text-white/70">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Insulators */}
        <div className="rounded-2xl border border-red-500/12 p-4" style={{ background: "rgba(239,68,68,0.03)" }}>
          <p className="text-xs font-bold text-red-400 mb-3">Insulators — High Resistance</p>
          <div className="grid grid-cols-4 gap-2">
            {insulators.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all"
                style={selected?.id === m.id
                  ? { background: `${m.color}18`, borderColor: `${m.color}45`, boxShadow: `0 0 12px ${m.color}22` }
                  : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }
                }
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-[10px] font-semibold text-white/70">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-2xl border p-4"
                style={{ background: `${selected.color}0d`, borderColor: `${selected.color}28` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selected.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{selected.name}</p>
                      <p className="text-[10px] text-white/40">{selected.resistivity}</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-full border"
                    style={isConductor
                      ? { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)", color: "#10B981" }
                      : { background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.3)", color: "#EF4444" }
                    }
                  >
                    {isConductor ? "Conductor" : "Insulator"}
                  </span>
                </div>

                {/* Resistance bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-white/35 mb-1.5">
                    <span>Resistance Level</span>
                    <span style={{ color: selected.color }}>{selected.level}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(selected.rating / 10) * 100}%`, background: selected.color }}
                    />
                  </div>
                </div>

                {/* Electron SVG mini-viz */}
                <div className="rounded-lg overflow-hidden mb-3" style={{ background: "rgba(0,0,0,0.25)" }}>
                  <svg width="100%" height="36" viewBox="0 0 260 36">
                    <line x1="0" y1="18" x2="260" y2="18" stroke={selected.color} strokeWidth="2.5" strokeOpacity="0.3" />
                    {isConductor ? (
                      [0, 1, 2].map((i) => (
                        <circle key={i} cy="18" r="5" fill="#0EA5E9" opacity="0.85">
                          <animateMotion path="M 0 0 L 240 0" dur="1.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                        </circle>
                      ))
                    ) : (
                      <circle cy="18" r="5" fill="#0EA5E9" opacity="0.3">
                        <animateMotion path="M 0 0 L 240 0" dur="5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </svg>
                </div>

                <p className="text-xs text-white/50 leading-relaxed">
                  <span className="font-semibold text-white/75">Used in:</span> {selected.use}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
