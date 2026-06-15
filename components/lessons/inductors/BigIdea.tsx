"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const concepts = [
  {
    title: "Opposes Change",
    desc: "Lenz's Law: an inductor generates a voltage that opposes any change in current. Like a flywheel resisting speed changes.",
    icon: "↺",
    color: "#EC4899",
  },
  {
    title: "Stores Energy",
    desc: "Energy is stored in the magnetic field surrounding the coil. E = ½LI². More current = stronger field = more energy.",
    icon: "⚡",
    color: "#F43F5E",
  },
  {
    title: "Time Constant",
    desc: "τ = L/R. The time it takes current to reach 63.2% of its final value. Larger L or smaller R = slower response.",
    icon: "τ",
    color: "#FB7185",
  },
];

export default function BigIdea() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [phase, setPhase] = useState<"idle" | "applying" | "spinning" | "releasing" | "coasting">("idle");
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    let raf: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setRotation(r => r + speed * dt * 360);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const applyForce = () => {
    if (phase === "applying" || phase === "spinning") return;
    setPhase("applying");
    let s = speed;
    const interval = setInterval(() => {
      s = Math.min(s + 0.05, 3);
      setSpeed(s);
      if (s >= 3) {
        clearInterval(interval);
        setIsSpinning(true);
        setPhase("spinning");
      }
    }, 80);
  };

  const releaseForce = () => {
    if (phase !== "spinning") return;
    setPhase("releasing");
    setIsSpinning(false);
    let s = speed;
    const interval = setInterval(() => {
      s = Math.max(s - 0.02, 0);
      setSpeed(s);
      if (s <= 0) {
        clearInterval(interval);
        setPhase("idle");
      }
    }, 80);
  };

  const phaseLabel =
    phase === "idle" ? "Flywheel at rest — apply force to spin" :
    phase === "applying" ? "Current applied — wheel slowly speeds up (inductor resists change!)" :
    phase === "spinning" ? "Current flowing — magnetic energy stored in field" :
    phase === "releasing" ? "Current removed — wheel keeps spinning (back-EMF!)" : "";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-4 font-mono">
          The Big Idea
        </p>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative pl-5 mb-8"
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{ background: "linear-gradient(to bottom, #EC4899, #F43F5E)" }}
          />
          <p className="text-base sm:text-lg text-white/70 leading-relaxed italic">
            &ldquo;An inductor is like a flywheel for electricity. It takes time to speed up (resist current increase) and time to slow down (resist current decrease). It stores energy in a magnetic field and releases it when needed.&rdquo;
          </p>
        </motion.div>

        {/* Flywheel Animation */}
        <div
          className="rounded-2xl border border-white/8 p-6 mb-6"
          style={{ background: "rgba(236,72,153,0.04)" }}
        >
          <p className="text-xs text-white/40 uppercase tracking-widest font-mono mb-4">Flywheel Analogy — Interactive</p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Flywheel SVG */}
            <div className="flex-shrink-0 relative w-40 h-40 flex items-center justify-center">
              {/* Axle */}
              <div
                className="absolute w-4 h-4 rounded-full z-10"
                style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}
              />
              {/* Wheel */}
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ duration: 0, ease: "linear" }}
                className="absolute inset-2"
                style={{ willChange: "transform" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer ring */}
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#EC4899" strokeWidth="6" opacity="0.6" />
                  {/* Spokes */}
                  {[0, 60, 120, 180, 240, 300].map(angle => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <line
                        key={angle}
                        x1={50 + 8 * Math.cos(rad)}
                        y1={50 + 8 * Math.sin(rad)}
                        x2={50 + 44 * Math.cos(rad)}
                        y2={50 + 44 * Math.sin(rad)}
                        stroke="#EC4899"
                        strokeWidth="3"
                        opacity="0.5"
                      />
                    );
                  })}
                  {/* Inner hub */}
                  <circle cx="50" cy="50" r="8" fill="#EC4899" opacity="0.4" />
                  {/* Speed indicator dot */}
                  <circle cx="50" cy="8" r="4" fill="#F43F5E" opacity="0.9" />
                </svg>
              </motion.div>
              {/* Speed glow */}
              {speed > 0 && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, rgba(236,72,153,${speed / 6}) 0%, transparent 70%)`,
                  }}
                />
              )}
            </div>

            {/* Controls and labels */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/30">SPEED</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{ width: `${(speed / 3) * 100}%`, background: "linear-gradient(to right, #EC4899, #F43F5E)" }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/30">{(speed / 3 * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{phaseLabel}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={applyForce}
                  disabled={phase === "applying" || phase === "spinning"}
                  className="px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(236,72,153,0.15)",
                    borderColor: "rgba(236,72,153,0.3)",
                    color: "#EC4899",
                  }}
                >
                  Apply Current
                </button>
                <button
                  onClick={releaseForce}
                  disabled={phase !== "spinning"}
                  className="px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Remove Current
                </button>
              </div>

              <div className="space-y-1 border-t border-white/5 pt-3">
                <p className="text-[10px] text-white/25 font-mono uppercase tracking-widest">Parallels</p>
                <p className="text-xs text-white/40">Current = spinning force applied to wheel</p>
                <p className="text-xs text-white/40">Inductor = flywheel (takes time to speed up/slow down)</p>
                <p className="text-xs" style={{ color: "rgba(236,72,153,0.7)" }}>Resists any change in current!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Concept cards */}
        <div className="grid sm:grid-cols-3 gap-3">
          {concepts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-4 rounded-2xl border border-white/8"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold mb-2"
                style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30` }}
              >
                {c.icon}
              </div>
              <h3 className="text-sm font-bold text-white/90 mb-1">{c.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
