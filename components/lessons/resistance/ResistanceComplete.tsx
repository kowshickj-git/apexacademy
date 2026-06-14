"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const COLORS = ["#10B981", "#F97316", "#FCD34D", "#F472B6", "#A78BFA", "#34D399", "#0EA5E9"];

interface Props { xp: number; onClose: () => void; }

export default function ResistanceComplete({ xp, onClose }: Props) {
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

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 200, damping: 22 }}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 p-6 text-center overflow-hidden"
        style={{ background: "#18181B" }}
      >
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.14), transparent 60%)" }}
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
        <p className="text-sm text-white/45 mb-5">You&apos;ve mastered Resistance Fundamentals</p>

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

        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-white/28 mb-1.5">
            <span>Overall Progress</span>
            <span>Lesson 3 → 4</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #10B981, #F97316)" }}
              initial={{ width: "30%" }}
              animate={{ width: "40%" }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>30%</span>
            <span>40%</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/electronics/resistors"
            className="w-full py-2.5 rounded-xl text-sm font-bold text-background bg-primary hover:opacity-90 transition-opacity text-center"
          >
            Continue to Resistors →
          </Link>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/55 hover:border-white/20 hover:text-white/75 transition-all"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            Stay here
          </button>
          <Link
            href="/index.html"
            className="block py-1.5 text-xs text-center text-white/25 hover:text-white/45 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
