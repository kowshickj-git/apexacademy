"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const COLOR = "#6366F1";

interface Props {
  xp: number;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

const COLORS = [COLOR, "#818cf8", "#ffffff", "#fbbf24", "#c4b5fd", "#a5b4fc"];

const badges = [
  { icon: "🌐", label: "IoT Architect", desc: "Mastered IoT layers" },
  { icon: "📡", label: "MQTT Expert", desc: "Pub/sub protocol pro" },
  { icon: "🏭", label: "IIoT Engineer", desc: "Industrial IoT certified" },
  { icon: "🔐", label: "IoT Security", desc: "Secure by design" },
];

export default function IoTComplete({ xp, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      alpha: 1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.008;
        if (p.y > canvas.height || p.alpha <= 0) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.alpha = 1;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 rounded-3xl p-8 max-w-md w-full text-center"
        style={{ background: "rgba(10,10,15,0.97)", border: `1px solid rgba(99,102,241,0.4)` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
        >
          ✕
        </button>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="text-6xl mb-4"
        >
          🌐
        </motion.div>

        {/* Title */}
        <h2
          className="text-3xl font-black mb-2"
          style={{
            background: `linear-gradient(135deg, ${COLOR}, #818cf8, #c4b5fd)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          IoT Mastered!
        </h2>

        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          Lesson 28 of 36 complete · Embedded Systems
        </p>

        {/* XP */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl mb-6"
          style={{ background: `rgba(99,102,241,0.2)`, border: `1px solid rgba(99,102,241,0.4)` }}
        >
          <span className="text-2xl font-black" style={{ color: COLOR }}>
            +{xp} XP
          </span>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>earned</span>
        </motion.div>

        {/* Badges */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl p-3"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-xs font-bold" style={{ color: "#fff" }}>
                {badge.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {badge.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next Lesson */}
        <Link
          href="/electronics/esp32"
          className="block w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{ background: COLOR, color: "#fff" }}
        >
          Start ESP32 →
        </Link>
      </motion.div>
    </motion.div>
  );
}
