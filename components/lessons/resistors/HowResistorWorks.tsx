"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onVisualView: () => void; }

const electrons = Array.from({ length: 8 }, (_, i) => i);

export default function HowResistorWorks({ onVisualView }: Props) {
  const [triggered, setTriggered] = useState(false);
  const [resistance, setResistance] = useState(50);
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

  const atomCount = Math.round(4 + (resistance / 100) * 16);
  const electronSpeed = 0.8 + (resistance / 100) * 3.2;
  const heatOpacity = resistance / 100;

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 6</p>
        <h2 className="text-xl font-bold mb-1">How Does a Resistor Work?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Inside a resistor, a material is packed with tightly bound atoms. As electrons try to flow through, they constantly collide with these atoms — losing energy as heat. More atoms = more resistance.
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Resistance</span>
            <span className="font-mono text-orange-400">{Math.round(resistance * 100)}Ω</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="w-full slider-orange"
            style={{ background: `linear-gradient(to right, #F97316 ${resistance}%, rgba(255,255,255,0.08) ${resistance}%)` }}
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>0Ω (wire)</span>
            <span>10KΩ (high)</span>
          </div>
        </div>

        {/* Resistor body visualization */}
        <div
          className="relative h-24 rounded-2xl overflow-hidden border border-white/8"
          style={{ background: "rgba(30,15,0,0.4)" }}
        >
          {/* Heat glow */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(ellipse at center, rgba(249,115,22,${heatOpacity * 0.35}) 0%, transparent 70%)`,
              animation: resistance > 20 ? "heat-pulse 1.5s ease-in-out infinite" : "none",
            }}
          />

          {/* Atom grid */}
          {Array.from({ length: atomCount }).map((_, i) => {
            const col = i % 8;
            const row = Math.floor(i / 8);
            return (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full border border-orange-400/40 flex items-center justify-center"
                style={{
                  left: `${8 + col * 11}%`,
                  top: `${18 + row * 38}%`,
                  background: "rgba(249,115,22,0.15)",
                  animation: `atom-vibrate ${0.3 + (i % 4) * 0.1}s ease-in-out infinite alternate`,
                }}
              >
                <div className="w-1 h-1 rounded-full bg-orange-400/60" />
              </div>
            );
          })}

          {/* Electrons */}
          {electrons.map((i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: `${20 + (i % 4) * 18}%`,
                animation: `ant-march ${electronSpeed + (i % 3) * 0.5}s linear infinite`,
                animationDelay: `${i * (electronSpeed / 8)}s`,
                left: "-8px",
                background: "#0EA5E9",
                boxShadow: "0 0 6px rgba(14,165,233,0.8)",
              }}
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-lg font-bold font-mono" style={{ color: "#0EA5E9" }}>{electronSpeed.toFixed(1)}s</p>
            <p className="text-[10px] text-white/30">Electron transit</p>
          </div>
          <div className="p-2 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-lg font-bold font-mono text-orange-400">{atomCount}</p>
            <p className="text-[10px] text-white/30">Obstacle atoms</p>
          </div>
          <div className="p-2 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-lg font-bold font-mono text-red-400">{Math.round(heatOpacity * 100)}%</p>
            <p className="text-[10px] text-white/30">Heat generated</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 p-3 rounded-xl border border-white/8 flex gap-3"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <span className="text-base">⚡</span>
          <p className="text-xs text-white/40 leading-relaxed">
            This energy lost as heat is not wasted in a bad way — it&apos;s intentional. Resistors are designed to convert electrical energy into heat to control circuit behavior.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
