"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SeriesCompleteProps {
  xp: number;
  onClose: () => void;
}

const CONFETTI_COLORS = [
  "#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#10B981", "#0EA5E9",
  "#F97316", "#FB923C", "#10B981", "#FDBA74", "#0EA5E9", "#F97316",
];

const BADGES = [
  { icon: "🗺️", title: "Circuit Tracer", desc: "Mapped the current path" },
  { icon: "⚡", title: "Voltage Analyst", desc: "Mastered voltage drops" },
  { icon: "🔗", title: "Series Pro", desc: "Completed all simulators" },
  { icon: "🏆", title: "Quiz Champion", desc: "Passed the quiz" },
];

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotate: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: p.rotate }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rotate + 360 }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
            top: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function SeriesComplete({ xp, onClose }: SeriesCompleteProps) {
  const [progressPct, setProgressPct] = useState(91);

  useEffect(() => {
    const t = setTimeout(() => setProgressPct(92), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,7,0.92)", backdropFilter: "blur(16px)" }}
    >
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "rgba(18,18,27,0.98)", border: "1px solid rgba(249,115,22,0.3)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors z-10"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(240,240,245,0.5)" }}
        >
          ✕
        </button>

        {/* Header */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 16 }}
            className="text-5xl mb-4"
          >
            🎉
          </motion.div>
          <h2
            className="text-2xl font-black mb-1"
            style={{
              background: "linear-gradient(135deg, #F97316, #FB923C, #FDBA74)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Series Circuits Mastered!
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            You've completed Lesson 11
          </p>

          {/* XP */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl mt-4 text-xl font-black"
            style={{
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.3)",
              boxShadow: "0 0 20px rgba(249,115,22,0.2)",
              color: "#F97316",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="#F97316">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            {xp} XP Earned
          </div>
        </div>

        {/* Badges */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>
            BADGES EARNED
          </p>
          <div className="grid grid-cols-2 gap-2">
            {BADGES.map((badge, i) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)" }}
              >
                <span className="text-lg flex-shrink-0">{badge.icon}</span>
                <div>
                  <div className="text-xs font-bold" style={{ color: "#F97316" }}>
                    {badge.title}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)", fontSize: "10px" }}>
                    {badge.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: "rgba(240,240,245,0.5)" }}>Course Progress</span>
            <span className="font-bold" style={{ color: "#10B981" }}>{progressPct}%</span>
          </div>
          <div className="h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #10B981, #0EA5E9)" }}
              initial={{ width: "91%" }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs" style={{ color: "rgba(240,240,245,0.25)" }}>
            <span>91% → 92%</span>
            <span>11/12 complete</span>
          </div>
        </div>

        {/* Next lesson */}
        <div className="px-6 py-5">
          <p className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>
            NEXT UP
          </p>
          <Link
            href="/electronics/parallel-circuits"
            className="flex items-center justify-between p-4 rounded-2xl group transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(14,165,233,0.1))",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <div className="text-sm font-black" style={{ color: "#F0F0F5" }}>
                  Parallel Circuits
                </div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
                  Lesson 12 · Multiple paths
                </div>
              </div>
            </div>
            <div
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #F97316, #0EA5E9)",
                color: "#fff",
              }}
            >
              Start →
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
