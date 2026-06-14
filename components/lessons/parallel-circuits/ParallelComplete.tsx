"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Props {
  xp: number;
  onClose: () => void;
}

const CONFETTI_COLORS = [
  "#6366F1", "#818CF8", "#A5B4FC",
  "#10B981", "#0EA5E9", "#F97316",
  "#34D399", "#7DD3FC", "#C4B5FD",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle";
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    vx: (Math.random() - 0.5) * 2,
    vy: 1.5 + Math.random() * 3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));
}

const badges = [
  { icon: "🌿", title: "Branch Master", desc: "Mastered parallel branches" },
  { icon: "⚡", title: "Current Splitter", desc: "Understands KCL" },
  { icon: "🔋", title: "Voltage Expert", desc: "Same V across all branches" },
  { icon: "🧠", title: "Quiz Champion", desc: "Passed the knowledge check" },
];

export default function ParallelComplete({ xp, onClose }: Props) {
  const [particles] = useState<Particle[]>(() => createParticles(60));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,7,0.92)", backdropFilter: "blur(16px)" }}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}vw`, y: "-5vh", rotate: p.rotation, opacity: 1 }}
            animate={{
              y: "110vh",
              x: `${p.x + p.vx * 30}vw`,
              rotate: p.rotation + p.rotationSpeed * 60,
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              delay: Math.random() * 1.5,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.shape === "rect" ? p.size * 0.5 : p.size,
              borderRadius: p.shape === "circle" ? "50%" : 2,
              background: p.color,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280, delay: 0.15 }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden"
        style={{ background: "rgba(12,12,20,0.98)" }}
      >
        {/* Indigo top bar */}
        <div className="h-1" style={{ background: "linear-gradient(to right, #6366F1, #818CF8, #10B981)" }} />

        <div className="p-8 text-center">
          {/* Trophy */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3, stiffness: 300 }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>

          <h2 className="text-3xl font-black text-white mb-1">Parallel Circuits</h2>
          <h3 className="text-xl font-black mb-1" style={{ color: "#818CF8" }}>Mastered!</h3>

          {/* Course complete */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-sm font-bold"
            style={{
              background: "rgba(16,185,129,0.1)",
              borderColor: "rgba(16,185,129,0.3)",
              color: "#34D399",
            }}
          >
            🎓 Electronics Fundamentals Complete!
          </div>

          {/* XP */}
          <div className="mb-6">
            <div className="text-5xl font-black mb-1" style={{ color: "#6366F1" }}>
              {xp} XP
            </div>
            <div className="text-sm text-white/50">Total XP earned this lesson</div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/40">Course Progress</span>
              <span className="font-bold" style={{ color: "#10B981" }}>12/12 · 100%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #6366F1, #10B981)" }}
              />
            </div>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl p-3 border border-white/6 text-left"
                style={{ background: "rgba(99,102,241,0.07)" }}
              >
                <div className="text-xl mb-1">{badge.icon}</div>
                <div className="text-xs font-bold text-white">{badge.title}</div>
                <div className="text-[10px] text-white/40">{badge.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {/* Next lesson (disabled) */}
            <div
              className="w-full py-3 rounded-2xl border border-white/8 text-sm font-bold text-white/30 cursor-not-allowed text-center"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              Switches &amp; Push Buttons — Coming Soon
            </div>

            {/* Back to APEX Academy */}
            <Link
              href="/"
              className="w-full py-3 rounded-2xl text-sm font-black text-white text-center transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              Back to APEX Academy
            </Link>

            {/* Close */}
            <button
              onClick={onClose}
              className="text-sm text-white/30 hover:text-white/50 transition-colors"
            >
              Continue reading lesson
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
