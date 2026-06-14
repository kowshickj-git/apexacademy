"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props { xp: number; onClose: () => void; }

const CONFETTI_COUNT = 55;

function randomConfetti(i: number) {
  const colors = ["#10B981", "#0EA5E9", "#F97316", "#8B5CF6", "#EF4444", "#EAB308", "#EC4899"];
  return {
    color: colors[i % colors.length],
    left: `${(i / CONFETTI_COUNT) * 100}%`,
    delay: `${(i * 0.06) % 2}s`,
    duration: `${2.2 + (i % 5) * 0.3}s`,
    size: 6 + (i % 5) * 2,
    rotation: i % 3 === 0 ? "skewX(15deg)" : i % 3 === 1 ? "skewY(10deg)" : "rotate(45deg)",
  };
}

export default function ResistorsComplete({ xp, onClose }: Props) {
  const [progress, setProgress] = useState(40);
  const confetti = Array.from({ length: CONFETTI_COUNT }, (_, i) => randomConfetti(i));

  useEffect(() => {
    const t = setTimeout(() => setProgress(50), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,7,0.92)", backdropFilter: "blur(14px)" }}
    >
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confetti.map((c, i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{
              left: c.left,
              width: c.size,
              height: c.size,
              background: c.color,
              transform: c.rotation,
              animation: `confetti-fall ${c.duration} ease-in ${c.delay} both`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative w-full max-w-sm rounded-3xl border border-primary/25 overflow-hidden"
        style={{ background: "rgba(18,18,20,0.98)" }}
      >
        {/* Top glow */}
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(to right, #0EA5E9, #10B981)" }} />

        <div className="p-7 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>

          <h2 className="text-2xl font-black mb-1 tracking-tight">Lesson Complete!</h2>
          <p className="text-white/40 text-sm mb-5">You&apos;ve mastered Resistors</p>

          {/* XP badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xl mb-5"
            style={{ background: "#10B981", color: "#050507", boxShadow: "0 0 32px rgba(16,185,129,0.5)" }}
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="currentColor">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            {xp} XP Earned
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-[10px] text-white/30 mb-2">
              <span>Course Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                initial={{ width: "40%" }}
                animate={{ width: "50%" }}
                transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #10B981, #0EA5E9)" }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1">4 of 10 lessons completed · Resistor Badge Unlocked 🔩</p>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-2 gap-2 mb-5 text-xs">
            {[
              { label: "Color Code Reader", icon: "🎨" },
              { label: "LED Protector", icon: "💡" },
              { label: "Component Identifier", icon: "🔬" },
              { label: "Resistor Expert", icon: "🏅" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-primary/15 text-white/55"
                style={{ background: "rgba(16,185,129,0.06)" }}
              >
                <span>{s.icon}</span>
                <span className="text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div
              className="w-full py-2.5 rounded-xl font-bold text-sm text-center border border-white/10 text-white/30 cursor-not-allowed select-none"
              title="Coming soon"
            >
              Next: Ohm&apos;s Law → (Coming Soon)
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-semibold text-sm border border-white/8 text-white/45 hover:bg-white/5 transition-colors"
            >
              Review Lesson
            </button>
            <Link
              href="/index.html"
              className="block py-2 text-xs text-center text-white/25 hover:text-white/45 transition-colors"
            >
              Back to APEX Academy
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
