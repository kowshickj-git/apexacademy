"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const COLORS = ["#10B981", "#0EA5E9", "#FCD34D", "#F472B6", "#A78BFA", "#34D399", "#FB923C"];

interface VoltageCompleteProps {
  xp: number;
  onClose: () => void;
}

export default function VoltageComplete({ xp, onClose }: VoltageCompleteProps) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.2,
        duration: 2.8 + Math.random() * 2.5,
        color: COLORS[i % COLORS.length],
        width: 7 + Math.floor(Math.random() * 7),
        height: 9 + Math.floor(Math.random() * 7),
        round: Math.random() > 0.55,
        rotate: Math.floor(Math.random() * 360),
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,7,0.92)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute"
            style={{
              left: `${c.left}%`,
              top: -20,
              width: c.width,
              height: c.height,
              background: c.color,
              borderRadius: c.round ? "50%" : "2px",
              transform: `rotate(${c.rotate}deg)`,
              animation: `confetti-fall ${c.duration}s ${c.delay}s ease-in forwards`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 200, damping: 22 }}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 p-6 text-center overflow-hidden"
        style={{ background: "#18181B" }}
      >
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.14), transparent 60%)" }}
        />

        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 250, damping: 20 }}
          className="text-6xl mb-3"
        >
          🏆
        </motion.div>

        <h2 className="text-2xl font-extrabold text-white mb-1">Lesson Complete!</h2>
        <p className="text-sm text-white/45 mb-5">You&apos;ve mastered Voltage Fundamentals</p>

        {/* XP */}
        <div className="rounded-2xl border border-primary/25 p-4 mb-4" style={{ background: "rgba(16,185,129,0.07)" }}>
          <p className="text-[10px] text-white/28 uppercase tracking-widest font-semibold mb-1.5">XP Earned</p>
          <p className="text-4xl font-extrabold text-primary mb-3">{xp} XP</p>
          <div className="space-y-1.5">
            {[
              { label: "Lesson read", pts: 10 },
              { label: "Simulations used", pts: 20 },
              { label: "Quiz passed", pts: 30 },
              { label: "Lesson completed", pts: 50 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-white/45">{item.label}</span>
                <span className="text-primary font-mono font-bold">+{item.pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-white/28 mb-1.5">
            <span>Overall Progress</span>
            <span>Lesson 1 → 2</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #10B981, #0EA5E9)" }}
              initial={{ width: "10%" }}
              animate={{ width: "20%" }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>10%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Unlock */}
        <div
          className="flex items-center gap-2 justify-center px-3 py-2 rounded-full border border-secondary/25 mb-5"
          style={{ background: "rgba(14,165,233,0.08)" }}
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <rect x="1" y="6" width="10" height="8" rx="2" stroke="#0EA5E9" strokeWidth="1.4" />
            <path d="M3.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#0EA5E9" strokeWidth="1.4" />
          </svg>
          <span className="text-xs text-secondary font-semibold">Lesson 2: Current — Unlocked!</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/55 hover:border-white/20 hover:text-white/75 transition-all"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            Stay here
          </button>
          <Link
            href="/lessons/current"
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-background bg-primary hover:opacity-90 transition-opacity text-center"
          >
            Next Lesson →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
