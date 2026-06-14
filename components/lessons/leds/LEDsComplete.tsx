"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props { xp: number; onClose: () => void; }

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

const COLORS = ["#EF4444", "#10B981", "#0EA5E9", "#EAB308", "#A78BFA", "#F97316", "#FCA5A5"];

export default function LEDsComplete({ xp, onClose }: Props) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    setConfetti(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: randomBetween(5, 95),
        color: COLORS[i % COLORS.length],
        size: randomBetween(6, 14),
        delay: randomBetween(0, 1.4),
        duration: randomBetween(2.5, 4.2),
        rotate: randomBetween(-180, 180),
      }))
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,7,0.92)", backdropFilter: "blur(16px)" }}
    >
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${c.x}%`,
            width: c.size,
            height: c.size,
            background: c.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confetti-fall ${c.duration}s ease-in ${c.delay}s both`,
            transform: `rotate(${c.rotate}deg)`,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 260, delay: 0.1 }}
        className="w-full max-w-sm rounded-3xl border border-red-500/25 overflow-hidden text-center relative z-10"
        style={{ background: "rgba(18,18,27,0.98)" }}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-6 border-b border-white/5" style={{ background: "linear-gradient(to bottom, rgba(239,68,68,0.1), transparent)" }}>
          <div className="text-5xl mb-3" style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.8))" }}>💡</div>
          <h2 className="text-2xl font-black mb-1 text-white">Lesson Complete!</h2>
          <p className="text-sm text-white/45">LED Fundamentals — L08</p>
        </div>

        {/* XP */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="20" height="20" viewBox="0 0 12 12" fill="#FCA5A5">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            <span className="text-4xl font-black" style={{ background: "linear-gradient(135deg, #FCA5A5, #EAB308, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {xp} XP
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
              <span>Course Progress</span>
              <span>70% → 80%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: "70%" }}
                animate={{ width: "80%" }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #F59E0B, #EF4444, #10B981)" }}
              />
            </div>
          </div>
        </div>

        {/* Skills earned */}
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-[10px] text-white/30 uppercase font-mono mb-3">Skills Unlocked</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "🔴", label: "Polarity" },
              { icon: "🔢", label: "Resistors" },
              { icon: "🎨", label: "RGB Mix" },
              { icon: "⚡", label: "Safe Ops" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl border border-red-500/20"
                style={{ background: "rgba(239,68,68,0.08)" }}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[9px] text-red-300/60 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 py-5 space-y-3">
          <Link
            href="/electronics/breadboards"
            className="flex items-center gap-3 p-4 rounded-2xl border transition-all hover:opacity-90"
            style={{ background: "rgba(20,184,166,0.08)", borderColor: "rgba(20,184,166,0.25)" }}
          >
            <span className="text-2xl">🧩</span>
            <div className="text-left flex-1">
              <p className="text-xs font-bold" style={{ color: "#14B8A6" }}>Next: Lesson 09</p>
              <p className="text-sm font-bold text-white/80">Breadboards — LIVE ⚡</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            onClick={onClose}
            className="block w-full py-2.5 rounded-2xl font-semibold text-sm border border-white/10 text-white/40 hover:bg-white/4 transition-colors"
          >
            Review Lesson
          </button>
          <Link
            href="/index.html"
            className="block w-full py-2.5 rounded-2xl font-semibold text-sm text-center border border-primary/20 text-primary/60 hover:bg-primary/5 transition-colors"
          >
            Back to APEX Academy
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
