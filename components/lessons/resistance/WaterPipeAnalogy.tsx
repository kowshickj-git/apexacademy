"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onSimUsed: () => void; }

export default function WaterPipeAnalogy({ onSimUsed }: Props) {
  const [width, setWidth] = useState(60);
  const [triggered, setTriggered] = useState(false);

  const handleChange = (v: number) => {
    setWidth(v);
    if (!triggered) { setTriggered(true); onSimUsed(); }
  };

  const pipeHeight = 8 + (width / 100) * 44;
  const speed = 3.5 - (width / 100) * 2.8;
  const { label, color } = width >= 70
    ? { label: "Very Low Resistance", color: "#10B981" }
    : width >= 45
    ? { label: "Low Resistance", color: "#34D399" }
    : width >= 28
    ? { label: "Medium Resistance", color: "#FCD34D" }
    : width >= 14
    ? { label: "High Resistance", color: "#FB923C" }
    : { label: "Very High Resistance", color: "#EF4444" };

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="02" title="Water Pipe Analogy" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-secondary/15 overflow-hidden"
        style={{ background: "rgba(14,165,233,0.03)" }}
      >
        <div className="p-5">
          <p className="text-sm text-white/65 leading-relaxed mb-5">
            Think of electric current like water in a pipe. A <span className="text-white font-semibold">wide pipe</span> lets water rush through freely. A <span className="text-white font-semibold">narrow pipe</span> forces water to squeeze — creating more resistance.
          </p>

          {/* Pipe visual */}
          <div className="relative flex items-center mb-3" style={{ height: 80 }}>
            {/* Left end cap */}
            <div className="absolute left-0 flex items-center justify-center" style={{ width: 36, height: 80, zIndex: 2 }}>
              <div className="rounded-lg flex items-center justify-center" style={{ width: 28, height: 44, background: "rgba(14,165,233,0.25)", border: "1.5px solid rgba(14,165,233,0.35)" }}>
                <span className="text-[8px] text-secondary font-mono font-bold">IN</span>
              </div>
            </div>
            {/* Pipe body */}
            <div className="absolute left-9 right-9 flex flex-col justify-center" style={{ height: 80 }}>
              {/* Top wall */}
              <div className="rounded-full transition-all duration-300" style={{ height: 4, marginBottom: pipeHeight, background: "rgba(14,165,233,0.4)" }} />
              {/* Interior with particles */}
              <div
                className="relative overflow-hidden rounded-sm transition-all duration-300"
                style={{ height: pipeHeight, background: "rgba(14,165,233,0.07)", marginTop: -pipeHeight }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: Math.max(6, pipeHeight * 0.35),
                      height: Math.max(6, pipeHeight * 0.35),
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "#0EA5E9",
                      opacity: 0.75,
                      animation: `water-drop ${speed + i * 0.25}s ${i * (speed / 6)}s linear infinite`,
                    }}
                  />
                ))}
              </div>
              {/* Bottom wall */}
              <div className="rounded-full transition-all duration-300" style={{ height: 4, background: "rgba(14,165,233,0.4)" }} />
            </div>
            {/* Right end cap */}
            <div className="absolute right-0 flex items-center justify-center" style={{ width: 36, height: 80, zIndex: 2 }}>
              <div className="rounded-lg flex items-center justify-center" style={{ width: 28, height: 44, background: "rgba(14,165,233,0.2)", border: "1.5px solid rgba(14,165,233,0.3)" }}>
                <span className="text-[8px] text-secondary font-mono font-bold">OUT</span>
              </div>
            </div>
          </div>

          {/* Resistance label */}
          <div className="flex justify-center mb-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold"
              style={{ background: `${color}18`, borderColor: `${color}35`, color }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              {label}
            </div>
          </div>

          {/* Slider */}
          <div className="mb-5">
            <div className="flex justify-between text-[10px] text-white/35 mb-2">
              <span>Narrow → High Resistance</span>
              <span>Wide → Low Resistance</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={width}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="slider-secondary w-full"
              style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${width}%, rgba(255,255,255,0.1) ${width}%, rgba(255,255,255,0.1) 100%)` }}
            />
            <p className="text-center text-[11px] text-white/30 mt-2">Pipe width: {width}% — drag to change</p>
          </div>

          {/* Static comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-primary/15 text-center" style={{ background: "rgba(16,185,129,0.05)" }}>
              <div className="flex items-center justify-center mb-2">
                <div className="rounded border-t-2 border-b-2 border-primary/40" style={{ width: 64, height: 20, background: "rgba(16,185,129,0.12)" }} />
              </div>
              <p className="text-[10px] font-bold text-primary">Wide Pipe</p>
              <p className="text-[9px] text-white/35">= Low Resistance</p>
            </div>
            <div className="p-3 rounded-xl border border-red-500/15 text-center" style={{ background: "rgba(239,68,68,0.05)" }}>
              <div className="flex items-center justify-center mb-2">
                <div className="rounded border-t-2 border-b-2 border-red-400/40" style={{ width: 64, height: 6, background: "rgba(239,68,68,0.12)" }} />
              </div>
              <p className="text-[10px] font-bold text-red-400">Narrow Pipe</p>
              <p className="text-[9px] text-white/35">= High Resistance</p>
            </div>
          </div>
        </div>
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
