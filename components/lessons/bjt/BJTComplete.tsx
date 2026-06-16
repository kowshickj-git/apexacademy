"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  xp: number;
  onClose: () => void;
}

const CONFETTI_COLORS = ["#EF4444","#F87171","#FCA5A5","#B91C1C","#DC2626","#FECACA","#F97316","#FDBA74"];

interface Particle {
  id: number; x: number; y: number; color: string;
  rotation: number; size: number; duration: number; delay: number;
}

function generateConfetti(): Particle[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: -10 - Math.random() * 20,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotation: Math.random() * 360, size: 5 + Math.random() * 6,
    duration: 2.5 + Math.random() * 2, delay: Math.random() * 1.5,
  }));
}

const BADGE_SKILLS = ["BJT Switcher", "Amplifier Builder", "Base Driver Pro", "Quiz Champion"];

export default function BJTComplete({ xp, onClose }: Props) {
  const [particles] = useState<Particle[]>(generateConfetti);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,7,0.92)", backdropFilter: "blur(16px)" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div key={p.id}
            initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: p.rotation, opacity: 1 }}
            animate={{ y: "110vh", rotate: p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1), opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            className="absolute rounded-sm" style={{ width: p.size, height: p.size, background: p.color }} />
        ))}
      </div>

      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 200 }}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        style={{ background: "rgba(12,14,20,0.98)" }}>
        <div className="h-1.5" style={{ background: "linear-gradient(to right, #EF4444, #F87171)" }} />
        <div className="p-6">
          <div className="text-center mb-5">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.15 }} className="text-4xl mb-3">
              🔴
            </motion.div>
            <h2 className="text-xl font-black mb-1"
              style={{ background: "linear-gradient(135deg, #EF4444, #F87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              BJT Mastered!
            </h2>
            <p className="text-xs text-white/40 font-mono">BJT Transistors — L17 of 36</p>
          </div>

          <div className="rounded-2xl p-4 mb-4 text-center border"
            style={{ borderColor: "rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)" }}>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 font-mono">Total XP Earned</p>
            <p className="text-3xl font-black"
              style={{ background: "linear-gradient(to right, #EF4444, #F87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {xp} XP
            </p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-white/30 mb-1 font-mono">
              <span>Course progress</span><span>17/20 = 85%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full" style={{ background: "linear-gradient(to right, #EF4444, #F87171)" }} />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-mono">Skills Unlocked</p>
            <div className="flex flex-wrap gap-2">
              {BADGE_SKILLS.map((skill, i) => (
                <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold border"
                  style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                  ✓ {skill}
                </motion.div>
              ))}
            </div>
          </div>

          <Link href="/electronics/mosfet" className="block p-4 rounded-2xl border mb-3 hover:opacity-90 transition-opacity group"
            style={{ borderColor: "rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)" }}>
            <p className="text-[9px] text-white/25 uppercase tracking-widest mb-0.5 font-mono">Next Lesson</p>
            <p className="text-sm font-bold text-white/85 group-hover:text-white transition-colors">Lesson 18: MOSFET</p>
            <p className="text-[10px] text-white/35 mt-0.5">Voltage-controlled switching for power electronics →</p>
          </Link>

          <div className="flex gap-2">
            <Link href="/electronics/mosfet" className="flex-1 py-2.5 rounded-xl font-bold text-sm text-center transition-all"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#EF4444" }}>
              Continue to MOSFET →
            </Link>
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-bold text-xs border border-white/10 text-white/40 hover:text-white/60 transition-all"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              Review
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
