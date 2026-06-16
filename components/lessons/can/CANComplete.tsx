"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  xp: number;
  onClose: () => void;
}

const COLOR = "#EF4444";

const CONFETTI_COLORS = ["#EF4444", "#ffffff", "#FFD700", "#F97316", "#FCA5A5"];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const PIECES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  x: random(5, 95),
  delay: random(0, 0.8),
  duration: random(1.8, 3.2),
  size: random(5, 11),
  rotate: random(-180, 180),
}));

const badges = [
  { icon: "🚗", label: "CAN Master",     desc: "Automotive protocol" },
  { icon: "⚡", label: "CAN FD Ready",   desc: "Up to 64 bytes" },
  { icon: "🔍", label: "Error Hunter",    desc: "5 error types" },
  { icon: "🏆", label: "EV Engineer",     desc: "BMS & powertrain" },
];

export default function CANComplete({ xp, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "rgba(5,5,7,0.85)", backdropFilter: "blur(12px)" }}
    >
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PIECES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: -12,
              width: p.size,
              height: p.size * 0.5,
              background: p.color,
              opacity: 0.9,
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: "110vh",
              rotate: p.rotate * 3,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <motion.div
        ref={ref}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative w-full max-w-md rounded-3xl p-8 text-center overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0d0d14, #12070a)",
          border: "1px solid rgba(239,68,68,0.3)",
          boxShadow: "0 24px 80px rgba(239,68,68,0.2)",
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.12), transparent 70%)",
          }}
        />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 260, damping: 18 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "2px solid rgba(239,68,68,0.35)",
            fontSize: 40,
          }}
        >
          🚗
        </motion.div>

        {/* Heading */}
        <h2
          className="text-3xl font-black mb-1"
          style={{
            background: `linear-gradient(135deg, ${COLOR}, #F97316)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CAN Protocol Mastered!
        </h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.5)" }}>
          You completed Lesson 26 of 36 · Embedded Systems
        </p>

        {/* XP */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xl font-black mb-6"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: COLOR,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 12 12" fill={COLOR}>
            <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
          </svg>
          +{xp} XP Earned
        </motion.div>

        {/* Badges */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="rounded-xl p-3 text-center"
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.18)",
              }}
            >
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="text-xs font-bold" style={{ color: "#F0F0F5" }}>
                {b.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(240,240,245,0.35)" }}>
                {b.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/electronics/rs485"
          className="block w-full py-3 rounded-xl font-bold text-sm text-center mb-3 transition-all"
          style={{
            background: `linear-gradient(135deg, ${COLOR}, #DC2626)`,
            color: "#fff",
            boxShadow: `0 6px 24px rgba(239,68,68,0.35)`,
            textDecoration: "none",
          }}
        >
          Start RS485 →
        </Link>

        <button
          onClick={onClose}
          className="text-xs"
          style={{ color: "rgba(240,240,245,0.3)", cursor: "pointer", background: "none", border: "none" }}
        >
          Stay on this lesson
        </button>
      </motion.div>
    </motion.div>
  );
}
