"use client";

import { motion } from "framer-motion";

function Runner({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <div
      className="absolute"
      style={{
        top: "50%",
        transform: "translateY(-65%)",
        animation: `run-figure var(--run-dur) ${delay}s linear infinite`,
      }}
    >
      <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
        <circle cx="9" cy="4" r="3.5" fill={color} />
        <line x1="9" y1="7.5" x2="9" y2="16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="9" y1="11" x2="4" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="11" x2="14" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="16" x2="5" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="16" x2="13" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function RunningRace() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="01" title="Introduction to Resistance" />

      {/* Story */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/8 p-5 mb-4"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <p className="text-[10px] text-primary/60 uppercase tracking-widest font-semibold mb-3">The Story</p>
        <p className="text-sm text-white/65 leading-relaxed mb-4">
          Imagine you are running on two different roads.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3 border border-primary/20" style={{ background: "rgba(16,185,129,0.07)" }}>
            <p className="text-xs font-bold text-primary mb-1">Road A — Smooth</p>
            <p className="text-xs text-white/50 leading-snug">You run easily and reach the finish line fast.</p>
          </div>
          <div className="rounded-xl p-3 border border-orange-500/20" style={{ background: "rgba(249,115,22,0.07)" }}>
            <p className="text-xs font-bold text-orange-400 mb-1">Road B — Mud</p>
            <p className="text-xs text-white/50 leading-snug">The mud slows you down — it resists your movement.</p>
          </div>
        </div>
        <p className="text-sm text-white/65 leading-relaxed mb-3">
          Electricity experiences the same thing. Some materials let electrons move freely. Others make them struggle.{" "}
          <span className="text-white font-semibold">That struggle is called Resistance.</span>
        </p>
        <div className="p-3 rounded-xl border border-primary/20" style={{ background: "rgba(16,185,129,0.06)" }}>
          <p className="text-xs font-bold text-primary mb-1">Simple Definition</p>
          <p className="text-sm text-white/80">
            Resistance is the <span className="text-primary font-semibold">opposition to the flow of electric current</span>.
          </p>
        </div>
      </motion.div>

      {/* Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-white/8 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="px-4 pt-4 pb-2">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Visualization · The Running Race</p>
        </div>

        {/* Lane 1 — Smooth */}
        <div className="mx-4 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-primary">Lane 1 — Smooth Road</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 text-primary" style={{ background: "rgba(16,185,129,0.1)" }}>
              Low Resistance
            </span>
          </div>
          <div
            className="relative h-14 rounded-xl overflow-hidden border border-primary/10"
            style={{ background: "linear-gradient(to right, rgba(16,185,129,0.06), rgba(16,185,129,0.02))", "--run-dur": "2.2s" } as React.CSSProperties}
          >
            <div className="absolute bottom-0 left-0 right-0 h-5 rounded-b-xl" style={{ background: "rgba(16,185,129,0.12)" }}>
              {[...Array(10)].map((_, i) => (
                <div key={i} className="absolute top-2 h-0.5 w-5 rounded-full" style={{ left: `${i * 11}%`, background: "rgba(255,255,255,0.12)" }} />
              ))}
            </div>
            <Runner color="#10B981" delay={0} />
            <Runner color="#34D399" delay={1.1} />
          </div>
        </div>

        {/* Lane 2 — Mud */}
        <div className="mx-4 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-orange-400">Lane 2 — Mud Road</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-400/20 text-orange-400" style={{ background: "rgba(249,115,22,0.1)" }}>
              High Resistance
            </span>
          </div>
          <div
            className="relative h-14 rounded-xl overflow-hidden border border-orange-500/10"
            style={{ background: "linear-gradient(to right, rgba(249,115,22,0.06), rgba(249,115,22,0.02))", "--run-dur": "5.5s" } as React.CSSProperties}
          >
            <div className="absolute bottom-0 left-0 right-0 h-5 rounded-b-xl" style={{ background: "rgba(120,53,15,0.35)" }}>
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bottom-0 rounded-t-full"
                  style={{ left: `${i * 7 + 1}%`, width: 8, height: 5, background: "rgba(92,37,7,0.55)" }}
                />
              ))}
            </div>
            <Runner color="#F97316" delay={0} />
            <Runner color="#FB923C" delay={2.75} />
          </div>
        </div>

        <div className="mx-4 mb-4 grid grid-cols-2 gap-2">
          <div className="text-center py-2.5 rounded-xl border border-primary/15" style={{ background: "rgba(16,185,129,0.05)" }}>
            <p className="text-xs font-bold text-primary">Smooth Road</p>
            <p className="text-[10px] text-white/35 mt-0.5">= Low Resistance</p>
          </div>
          <div className="text-center py-2.5 rounded-xl border border-orange-400/15" style={{ background: "rgba(249,115,22,0.05)" }}>
            <p className="text-xs font-bold text-orange-400">Mud Road</p>
            <p className="text-[10px] text-white/35 mt-0.5">= High Resistance</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
