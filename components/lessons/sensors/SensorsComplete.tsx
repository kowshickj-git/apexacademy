"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props { xp: number; onClose: () => void; }

const COLOR = "#0EA5E9";
const CONFETTI_COLORS = [COLOR, "#38BDF8", "#FFFFFF", "#FFD700", "#FFC107", "#7DD3FC", "#BAE6FD", "#FBBF24"];

const ALL_LESSONS = [
  "Voltage", "Current", "Resistance", "Resistors", "Ohm's Law",
  "Capacitors", "Diodes", "LEDs", "Breadboards", "Multimeter",
  "Series Circuits", "Parallel Circuits", "Switches", "Pull-Up/Down",
  "Inductors", "Transformers", "BJT", "MOSFET", "Logic Gates",
  "Arduino", "Sensors",
];

export default function SensorsComplete({ xp, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string; size: number; life: number; rotation: number; rotSpeed: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    particlesRef.current = Array.from({ length: 100 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.5,
      y: H * 0.35,
      vx: (Math.random() - 0.5) * 10,
      vy: -(Math.random() * 14 + 5),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 4,
      life: 1,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.007;
        p.rotation += p.rotSpeed;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      if (particlesRef.current.some(p => p.life > 0)) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.93)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <motion.div
        className="relative z-10 max-w-2xl w-full mx-4 rounded-3xl border p-8 overflow-y-auto max-h-[90vh]"
        style={{ borderColor: "rgba(14,165,233,0.4)", background: "rgba(5,5,20,0.97)", backdropFilter: "blur(20px)" }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            className="text-6xl mb-3"
            animate={{ rotate: [0, 12, -12, 8, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            📡
          </motion.div>
          <h2 className="text-3xl font-black mb-1" style={{ color: COLOR }}>Sensors Mastered!</h2>
          <p className="text-sm mb-4" style={{ color: "rgba(240,240,245,0.5)" }}>
            Lesson 21 Complete · You now know how devices see the world
          </p>
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border font-black text-xl"
            style={{ borderColor: "rgba(14,165,233,0.4)", background: "rgba(14,165,233,0.12)", color: COLOR }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill={COLOR}>
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            +{xp} XP Earned
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5 font-mono" style={{ color: "rgba(240,240,245,0.4)" }}>
            <span>Lesson 21 of 36</span>
            <span style={{ color: COLOR }}>58% complete</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${COLOR}, #38BDF8)` }}
              initial={{ width: "0%" }}
              animate={{ width: "58%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* All 21 lesson badges */}
        <div className="mb-5">
          <p className="text-xs font-mono mb-3" style={{ color: "rgba(240,240,245,0.3)" }}>All Completed Lessons (L01–L21)</p>
          <div className="grid grid-cols-7 gap-1.5">
            {ALL_LESSONS.map((name, i) => (
              <motion.div
                key={name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.035, type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-xl border p-1.5 text-center"
                style={{
                  borderColor: i === 20 ? "rgba(14,165,233,0.5)" : "rgba(14,165,233,0.18)",
                  background: i === 20 ? "rgba(14,165,233,0.12)" : "rgba(14,165,233,0.05)",
                }}
              >
                <div className="text-[8px] font-black font-mono mb-0.5" style={{ color: i === 20 ? COLOR : "rgba(14,165,233,0.6)" }}>
                  L{String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-[7px] leading-tight" style={{ color: i === 20 ? "rgba(240,240,245,0.8)" : "rgba(240,240,245,0.4)" }}>
                  {name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What you learned */}
        <div className="rounded-2xl border p-4 mb-5" style={{ background: "rgba(14,165,233,0.05)", borderColor: "rgba(14,165,233,0.15)" }}>
          <div className="text-xs font-bold mb-2" style={{ color: COLOR }}>What you learned in this lesson:</div>
          <div className="grid grid-cols-2 gap-1">
            {[
              "Sensors as transducers",
              "Analog vs Digital sensors",
              "HC-SR04 ultrasonic distance",
              "LM35 & DHT11 temperature",
              "LDR voltage divider",
              "PIR motion detection",
              "Sensor specifications",
              "Kalman filter fusion",
            ].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke={COLOR} strokeWidth="1.3" strokeLinecap="round" fill="none" /></svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
          >
            ✕ Close
          </button>
          <Link
            href="/electronics/communication-protocols"
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
            style={{ background: `linear-gradient(135deg, ${COLOR}, #38BDF8)`, color: "white" }}
          >
            Comms Protocols →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
