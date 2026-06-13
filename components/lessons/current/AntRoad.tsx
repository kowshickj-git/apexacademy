"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LEVELS = [
  { label: "Low", current: "0.5A", ants: 3, speed: 5, desc: "Few electrons, slow and steady" },
  { label: "Medium", current: "2A", ants: 7, speed: 2.5, desc: "More electrons, picking up pace" },
  { label: "High", current: "5A", ants: 12, speed: 1.2, desc: "Many electrons rushing through!" },
] as const;

function AntSVG() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
      {/* Abdomen */}
      <ellipse cx="12" cy="5" rx="3.5" ry="2.5" fill="#10B981" />
      {/* Thorax */}
      <ellipse cx="7.5" cy="5" rx="2.2" ry="1.8" fill="#10B981" />
      {/* Head */}
      <circle cx="3.5" cy="5" r="2.2" fill="#10B981" />
      {/* Antennae */}
      <line x1="2.5" y1="3.2" x2="0.5" y2="1" stroke="#10B981" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="4.5" y1="3.2" x2="6.5" y2="1" stroke="#10B981" strokeWidth="0.7" strokeLinecap="round" />
      {/* Legs top */}
      <line x1="6.5" y1="4" x2="5" y2="1.5" stroke="#10B981" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="8" y1="3.5" x2="8" y2="1" stroke="#10B981" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="10" y1="4" x2="11.5" y2="1.5" stroke="#10B981" strokeWidth="0.6" strokeLinecap="round" />
      {/* Legs bottom */}
      <line x1="6.5" y1="6" x2="5" y2="8.5" stroke="#10B981" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="8" y1="6.5" x2="8" y2="9" stroke="#10B981" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="10" y1="6" x2="11.5" y2="8.5" stroke="#10B981" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}

interface MovingAntProps {
  speed: number;
  delay: number;
  top: number;
}

function MovingAnt({ speed, delay, top }: MovingAntProps) {
  return (
    <div
      className="absolute"
      style={{
        top,
        animation: `ant-march ${speed}s ${delay}s linear infinite`,
      }}
    >
      <AntSVG />
    </div>
  );
}

interface AntRoadProps {
  onSimUsed: () => void;
}

export default function AntRoad({ onSimUsed }: AntRoadProps) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const level = LEVELS[levelIdx];

  const handleLevel = (i: number) => {
    setLevelIdx(i);
    if (!triggered) {
      setTriggered(true);
      onSimUsed();
    }
  };

  const ants = Array.from({ length: level.ants }, (_, i) => ({
    id: i,
    delay: (i * level.speed) / level.ants,
    top: 8 + (i % 3) * 12,
  }));

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#VIZ-1</p>
        <h2 className="text-2xl font-bold text-white">The Ant Road</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <p className="text-sm text-white/50 leading-relaxed">
          Each ant = one electron. Count how many pass a point each second — that&apos;s current!
          Change the level to see how current varies.
        </p>

        {/* Road container */}
        <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: "#18181B" }}>
          {/* Road */}
          <div className="relative mx-4 mt-4 rounded-xl overflow-hidden" style={{ height: 64, background: "#0F172A" }}>
            {/* Dashed centre line */}
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-px h-px"
              style={{ borderTop: "1px dashed rgba(255,255,255,0.06)" }}
            />
            {/* Ants */}
            <div className="relative w-full h-full overflow-hidden">
              {ants.map((ant) => (
                <MovingAnt key={`${levelIdx}-${ant.id}`} speed={level.speed} delay={ant.delay} top={ant.top} />
              ))}
            </div>
            {/* Counter badge */}
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[10px] font-mono text-primary border border-primary/20"
              style={{ background: "rgba(5,5,7,0.75)" }}
            >
              {level.ants} ants/s
            </div>
          </div>

          {/* Direction labels */}
          <div className="flex justify-between px-5 py-1.5">
            <span className="text-[10px] text-white/20">− Negative</span>
            <span className="text-[10px] text-white/20">Positive +</span>
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            <motion.div
              key={levelIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mx-4 mb-4 rounded-xl px-4 py-3 text-center border border-secondary/15"
              style={{ background: "rgba(14,165,233,0.05)" }}
            >
              <p className="text-sm font-bold text-secondary">{level.label} Current — {level.current}</p>
              <p className="text-xs text-white/38 mt-0.5">{level.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Level selector */}
        <div className="rounded-2xl border border-white/6 p-4 space-y-3" style={{ background: "#18181B" }}>
          <p className="text-sm font-semibold text-white">Current Level</p>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l, i) => (
              <button
                key={l.label}
                onClick={() => handleLevel(i)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  levelIdx === i
                    ? "bg-primary text-background"
                    : "text-white/45 hover:text-white/65 hover:bg-white/6"
                }`}
                style={levelIdx === i ? {} : { background: "rgba(255,255,255,0.04)" }}
              >
                {l.label}
                <span className="block text-[10px] font-mono mt-0.5 opacity-70">{l.current}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-white/32">
            More ants = <span className="text-primary font-semibold">Higher Current</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
