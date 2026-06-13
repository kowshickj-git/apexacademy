"use client";

import { motion } from "framer-motion";

export default function WhatIsCurrent() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="01" title="What is Current?" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Ant analogy block */}
        <div className="rounded-2xl border border-secondary/22 p-5 relative overflow-hidden" style={{ background: "#18181B" }}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-secondary" />
          <div className="pl-2">
            <p className="text-[10px] text-secondary/55 uppercase tracking-widest font-semibold mb-3">
              Think of it this way 🐜
            </p>
            <p className="text-base text-white leading-relaxed mb-3">
              Imagine tiny <span className="text-secondary font-semibold">ants</span> marching in a line along a road.
              The number of ants passing a single point every second is like{" "}
              <span className="text-secondary font-semibold">electric current</span>.
            </p>
            <p className="text-sm text-white/58 leading-relaxed">
              More ants passing = <strong className="text-white/80">More current</strong>.
              Fewer ants = <strong className="text-white/80">Less current</strong>. That simple!
            </p>
          </div>
        </div>

        {/* Definition */}
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "#18181B" }}>
          <p className="text-[10px] text-white/28 uppercase tracking-widest font-semibold mb-2.5">
            Simple Definition
          </p>
          <p className="text-lg font-bold text-white leading-snug">
            Current is the <span className="text-secondary">flow of electric charge</span>{" "}
            (electrons) through a conductor.
          </p>
        </div>

        {/* Symbol + unit cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/6 p-4 text-center" style={{ background: "#18181B" }}>
            <p className="text-4xl font-extrabold text-secondary mb-1">A</p>
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Unit</p>
            <p className="text-xs text-white/50 mt-1">Amperes</p>
          </div>
          <div className="rounded-xl border border-white/6 p-4 text-center" style={{ background: "#18181B" }}>
            <p className="text-4xl font-extrabold text-primary mb-1">I</p>
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Symbol</p>
            <p className="text-xs text-white/50 mt-1">Intensité (French)</p>
          </div>
        </div>

        {/* One sentence context */}
        <p className="text-sm text-white/55 leading-relaxed">
          Just like water flowing through a pipe, electric current is the flow of tiny particles
          called <strong className="text-white">electrons</strong> through a wire or conductor.
          The more electrons flowing per second, the higher the current.
        </p>
      </motion.div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
