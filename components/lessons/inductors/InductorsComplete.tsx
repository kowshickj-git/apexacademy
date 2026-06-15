"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  xp: number;
  onClose: () => void;
}

const CONFETTI_COLORS = ["#EC4899", "#F43F5E", "#FB7185", "#E11D48", "#BE185D", "#9D174D", "#FECDD3"];
const BADGE_SKILLS = ["Magnetic Master", "Energy Storer", "Back-EMF Expert", "Quiz Champion"];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: number;
  duration: number;
  delay: number;
}

function generateConfetti(): Particle[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotation: Math.random() * 360,
    size: 5 + Math.random() * 6,
    duration: 2.5 + Math.random() * 2,
    delay: Math.random() * 1.5,
  }));
}

export default function InductorsComplete({ xp, onClose }: Props) {
  const [particles] = useState<Particle[]>(generateConfetti);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,7,0.92)", backdropFilter: "blur(16px)" }}
    >
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: p.rotation, opacity: 1 }}
            animate={{ y: "110vh", rotate: p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1), opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            className="absolute rounded-sm"
            style={{ width: p.size, height: p.size, background: p.color }}
          />
        ))}
      </div>

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 200 }}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        style={{ background: "rgba(12,14,20,0.98)" }}
      >
        {/* Header gradient strip */}
        <div className="h-1.5" style={{ background: "linear-gradient(to right, #EC4899, #F43F5E)" }} />

        <div className="p-6">
          {/* Title */}
          <div className="text-center mb-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.15 }}
              className="text-4xl mb-3"
            >
              🧲
            </motion.div>
            <h2 className="text-xl font-black text-white mb-1">Inductors Mastered!</h2>
            <p className="text-xs text-white/40 font-mono">Inductors Fundamentals — L15</p>
          </div>

          {/* XP display */}
          <div
            className="rounded-2xl p-4 mb-4 text-center border"
            style={{ borderColor: "rgba(236,72,153,0.25)", background: "rgba(236,72,153,0.06)" }}
          >
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 font-mono">Total XP Earned</p>
            <p
              className="text-3xl font-black"
              style={{ background: "linear-gradient(to right, #EC4899, #F43F5E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {xp} XP
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-white/30 mb-1 font-mono">
              <span>Course progress</span>
              <span>15/20 — 75%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="relative h-full rounded-full overflow-hidden" style={{ width: "70%", background: "rgba(236,72,153,0.2)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "5%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute right-0 top-0 h-full rounded-full"
                  style={{ background: "linear-gradient(to right, #EC4899, #F43F5E)" }}
                />
              </div>
            </div>
          </div>

          {/* Skills unlocked */}
          <div className="mb-4">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-mono">Skills Unlocked</p>
            <div className="flex flex-wrap gap-2">
              {BADGE_SKILLS.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold border"
                  style={{ borderColor: "rgba(236,72,153,0.3)", background: "rgba(236,72,153,0.1)", color: "#EC4899" }}
                >
                  ✓ {skill}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next lesson card */}
          <Link
            href="/electronics/transformers"
            className="block p-4 rounded-2xl border mb-3 hover:opacity-90 transition-opacity group"
            style={{ borderColor: "rgba(236,72,153,0.25)", background: "rgba(236,72,153,0.06)" }}
          >
            <p className="text-[9px] text-white/25 uppercase tracking-widest mb-0.5 font-mono">Next Lesson</p>
            <p className="text-sm font-bold text-white/85 group-hover:text-white transition-colors">
              Lesson 16: Transformers
            </p>
            <p className="text-[10px] text-white/35 mt-0.5">Electromagnetic coupling, voltage transformation, power transfer →</p>
          </Link>

          {/* Buttons */}
          <div className="flex gap-2">
            <Link
              href="/electronics/transformers"
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-center transition-all"
              style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.35)", color: "#EC4899" }}
            >
              Continue to Transformers →
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              Review
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
