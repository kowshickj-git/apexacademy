"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onVisualView: () => void; }

const cars = Array.from({ length: 6 }, (_, i) => i);

export default function WhatIsResistor({ onVisualView }: Props) {
  const [active, setActive] = useState<"free" | "resistor">("free");
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) { setTriggered(true); onVisualView(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered, onVisualView]);

  const speed = active === "free" ? 1.4 : 4;
  const color = active === "free" ? "#10B981" : "#F97316";
  const roadColor = active === "free" ? "rgba(16,185,129,0.12)" : "rgba(249,115,22,0.1)";

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 1</p>
        <h2 className="text-xl font-bold mb-1">What is a Resistor?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          A resistor is an electronic component that <span className="text-white/70 font-medium">opposes the flow of electric current</span>.
          Think of a road with a speed bump — cars can still move, but they&apos;re forced to slow down.
          That&apos;s exactly what a resistor does to electrons.
        </p>

        {/* Toggle */}
        <div className="flex gap-2 mb-4">
          {(["free", "resistor"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActive(mode)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={active === mode
                ? { background: mode === "free" ? "rgba(16,185,129,0.15)" : "rgba(249,115,22,0.15)", borderColor: mode === "free" ? "#10B981" : "#F97316", color: mode === "free" ? "#10B981" : "#F97316" }
                : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {mode === "free" ? "Free Road" : "With Speed Bump (Resistor)"}
            </button>
          ))}
        </div>

        {/* Road animation */}
        <div
          className="relative h-20 rounded-2xl overflow-hidden border border-white/5"
          style={{ background: roadColor }}
        >
          {/* Road markings */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px border-t border-dashed border-white/8" />

          {/* Speed bump */}
          {active === "resistor" && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-12 rounded-full border-2 flex items-center justify-center"
              style={{ background: "rgba(249,115,22,0.2)", borderColor: "#F97316" }}
            >
              <span className="text-[8px] font-bold text-orange-400 rotate-90 whitespace-nowrap">R</span>
            </div>
          )}

          {/* Cars */}
          {cars.map((i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                animation: `ant-march ${speed + i * 0.4}s linear infinite`,
                animationDelay: `${i * (speed / 6)}s`,
                left: "-30px",
              }}
            >
              <div
                className="w-6 h-4 rounded-sm flex items-center justify-center text-[10px]"
                style={{ background: color, opacity: 0.85 }}
              >
                🚗
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <p className="text-xs text-white/40">
            {active === "free"
              ? "Without a resistor — electrons flow freely and fast."
              : "With a resistor — electrons still flow, but slower and controlled."}
          </p>
        </div>

        {/* Definition box */}
        <div
          className="mt-6 p-4 rounded-xl border"
          style={{ background: "rgba(14,165,233,0.06)", borderColor: "rgba(14,165,233,0.18)" }}
        >
          <p className="text-xs text-secondary font-semibold mb-1">Definition</p>
          <p className="text-sm text-white/70 leading-relaxed">
            A <strong className="text-white">resistor</strong> is a passive two-terminal electrical component that{" "}
            <strong className="text-white">reduces current flow</strong> and{" "}
            <strong className="text-white">lowers voltage levels</strong> in a circuit.
            Its resistance is measured in <strong className="text-white">Ohms (Ω)</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
