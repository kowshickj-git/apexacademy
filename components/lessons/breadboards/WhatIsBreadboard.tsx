"use client";

import { motion } from "framer-motion";

const flowItems = [
  { label: "Breadboard", desc: "The plastic board" },
  { label: "Holes", desc: "300–830 connection points" },
  { label: "Internal Clips", desc: "Metal springs inside" },
  { label: "Reusable", desc: "Build forever" },
];

export default function WhatIsBreadboard() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 1 · Foundation
        </p>
        <h2 className="text-xl font-bold mb-5">What is a Breadboard?</h2>

        {/* Definition card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-5 rounded-2xl border mb-5"
          style={{ borderColor: "rgba(20,184,166,0.25)", background: "rgba(20,184,166,0.05)" }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            A <span className="font-bold" style={{ color: "#14B8A6" }}>breadboard</span> is a reusable, solderless platform used to build and test electronic circuits quickly. Push component leads into the holes, and internal metal clips make electrical connections — no heat required.
          </p>
        </motion.div>

        {/* Origin note */}
        <div
          className="flex gap-3 p-4 rounded-xl border border-white/8 mb-6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <span className="text-lg shrink-0">📜</span>
          <div>
            <p className="text-xs font-bold text-white/70 mb-0.5">Historical fact</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Originally named after literal wooden bread-cutting boards used by early radio hobbyists in the 1940s — they would nail or screw terminal posts into a wooden board to prototype circuits.
            </p>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto">
          {flowItems.map((item, i) => (
            <div key={item.label} className="flex items-center gap-1 shrink-0">
              <div
                className="px-3 py-2.5 rounded-xl border border-white/8 text-center min-w-[80px]"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <p className="text-[10px] font-bold text-white/70 whitespace-nowrap">{item.label}</p>
                <p className="text-[9px] text-white/30 whitespace-nowrap">{item.desc}</p>
              </div>
              {i < flowItems.length - 1 && (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div
          className="p-4 rounded-xl border border-white/8"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-xs font-bold text-white/60 mb-1">Why it matters</p>
          <p className="text-xs text-white/40 leading-relaxed">
            Breadboards are used by students learning electronics, professional engineers prototyping new products, startups building MVPs, and hobbyists worldwide. They bridge the gap between drawing a schematic and building a final product — the fastest way to test if an idea actually works.
          </p>
        </div>
      </div>
    </section>
  );
}
