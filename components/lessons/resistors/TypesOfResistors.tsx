"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onVisualView: () => void; }

const types = [
  {
    name: "Fixed Resistor",
    icon: "🔩",
    color: "#F97316",
    desc: "Has one specific resistance value that never changes. The most common type. Comes in carbon film or metal film.",
    symbol: "—[R]—",
    example: "220Ω carbon film for LED",
  },
  {
    name: "Variable (Rheostat)",
    icon: "🔄",
    color: "#0EA5E9",
    desc: "Two-terminal variable resistor. Adjusting the wiper changes resistance from 0 to max. Used for current control.",
    symbol: "—[R→]—",
    example: "Dimmer switch, fan speed control",
  },
  {
    name: "Potentiometer",
    icon: "🎛️",
    color: "#10B981",
    desc: "Three-terminal variable resistor. Acts as a voltage divider. The wiper position sets output voltage from 0V to Vin.",
    symbol: "—[R⊥]—",
    example: "Volume knob, joystick axis",
  },
  {
    name: "Thermistor (NTC/PTC)",
    icon: "🌡️",
    color: "#EF4444",
    desc: "Resistance changes with temperature. NTC: resistance drops as temp rises. PTC: resistance rises with temp. Used in sensors.",
    symbol: "—[R°]—",
    example: "Temperature sensors, phone charging",
  },
  {
    name: "LDR (Photoresistor)",
    icon: "☀️",
    color: "#EAB308",
    desc: "Light-Dependent Resistor. Resistance drops dramatically in bright light and rises in darkness. No lens needed.",
    symbol: "—[R☀]—",
    example: "Auto nightlights, cameras, robots",
  },
  {
    name: "SMD Chip Resistor",
    icon: "🔬",
    color: "#8B5CF6",
    desc: "Surface-mount device with no leads. Soldered flat on PCB pads. Ultra-small (0402 = 1mm × 0.5mm). Automated assembly.",
    symbol: "[■]",
    example: "Every modern PCB: phones, laptops",
  },
  {
    name: "Power Resistor",
    icon: "⚡",
    color: "#EC4899",
    desc: "Designed to safely dissipate watts of power as heat. Often made of wirewound or ceramic composition. Needs heatsinking.",
    symbol: "—[R✦]—",
    example: "Motor braking, power supplies, loads",
  },
];

export default function TypesOfResistors({ onVisualView }: Props) {
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
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10</p>
        <h2 className="text-xl font-bold mb-1">7 Types of Resistors</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Resistors come in many forms — each optimized for a specific job. Click to explore.
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-5">
          {types.map((tp, i) => (
            <button
              key={tp.name}
              onClick={() => setSelected(i)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border transition-all"
              style={selected === i
                ? { background: `${tp.color}18`, borderColor: tp.color + "60" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              <span className="text-base">{tp.icon}</span>
              <span className="text-[8px] text-white/40 leading-tight text-center">{tp.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-5"
            style={{ background: `${t.color}0d`, borderColor: `${t.color}35` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl border flex flex-col items-center justify-center shrink-0 text-2xl"
                style={{ background: `${t.color}18`, borderColor: `${t.color}40` }}
              >
                {t.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-0.5" style={{ color: t.color }}>{t.name}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-2">{t.desc}</p>
                <div className="flex flex-wrap gap-3 text-[10px]">
                  <div>
                    <span className="text-white/25">Symbol: </span>
                    <span className="font-mono text-white/55">{t.symbol}</span>
                  </div>
                  <div>
                    <span className="text-white/25">Example: </span>
                    <span className="text-white/55">{t.example}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setSelected((s) => (s - 1 + types.length) % types.length)}
            className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
          >← Prev</button>
          <span className="text-[11px] text-white/25 flex-1 text-center">{selected + 1} / {types.length}</span>
          <button
            onClick={() => setSelected((s) => (s + 1) % types.length)}
            className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
          >Next →</button>
        </div>
      </div>
    </section>
  );
}
