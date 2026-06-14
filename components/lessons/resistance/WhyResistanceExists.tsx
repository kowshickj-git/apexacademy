"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const materials = [
  { id: "copper", label: "Copper", atomCount: 4, color: "#F97316", resistanceLabel: "Very Low", desc: "Few collisions — electrons glide through easily." },
  { id: "aluminium", label: "Aluminium", atomCount: 9, color: "#FCD34D", resistanceLabel: "Low", desc: "More atoms but still a good conductor." },
  { id: "iron", label: "Iron", atomCount: 16, color: "#94A3B8", resistanceLabel: "Medium", desc: "Denser atom structure creates more collisions." },
  { id: "rubber", label: "Rubber", atomCount: 25, color: "#6B7280", resistanceLabel: "Very High", desc: "Packed with obstacles — electrons barely move." },
];

export default function WhyResistanceExists() {
  const [selected, setSelected] = useState("copper");
  const mat = materials.find((m) => m.id === selected)!;

  const atomPositions = Array.from({ length: mat.atomCount }, (_, i) => ({
    x: 10 + (i % Math.ceil(Math.sqrt(mat.atomCount))) * (280 / Math.ceil(Math.sqrt(mat.atomCount))),
    y: 10 + Math.floor(i / Math.ceil(Math.sqrt(mat.atomCount))) * (80 / Math.ceil(mat.atomCount / Math.ceil(Math.sqrt(mat.atomCount)))),
  }));

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="04" title="Why Does Resistance Exist?" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/8 p-5"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <p className="text-sm text-white/65 leading-relaxed mb-5">
          As electrons move through a material, they constantly <span className="text-white font-semibold">collide with atoms</span>. More collisions = more resistance. The material type determines how many obstacles exist.
        </p>

        {/* Material selector */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className="py-2 rounded-xl text-xs font-bold border transition-all"
              style={selected === m.id
                ? { background: `${m.color}18`, borderColor: `${m.color}40`, color: m.color }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Atom grid visualization */}
        <div className="relative rounded-xl border border-white/5 overflow-hidden mb-4" style={{ background: "rgba(0,0,0,0.25)", height: 120 }}>
          <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet">
            {/* Atoms */}
            {atomPositions.map((pos, i) => (
              <g key={i}>
                <circle
                  cx={pos.x + 20}
                  cy={pos.y + 15}
                  r={selected === "rubber" ? 8 : selected === "iron" ? 9 : 10}
                  fill={`${mat.color}22`}
                  stroke={`${mat.color}55`}
                  strokeWidth="1.2"
                  style={{ animation: `atom-vibrate ${0.8 + i * 0.1}s ${i * 0.05}s ease-in-out infinite` }}
                />
                <circle cx={pos.x + 20} cy={pos.y + 15} r={3} fill={mat.color} opacity={0.7} />
              </g>
            ))}

            {/* Electron path */}
            <circle r="5" fill="#0EA5E9" opacity="0.9">
              <animateMotion
                path="M 0 60 L 280 60"
                dur={selected === "rubber" ? "5s" : selected === "iron" ? "3s" : selected === "aluminium" ? "2s" : "1s"}
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.05;0.95;1" dur={selected === "rubber" ? "5s" : selected === "iron" ? "3s" : "1.5s"} repeatCount="indefinite" />
            </circle>

            {/* Collision sparks */}
            {mat.atomCount > 4 && atomPositions.slice(0, 3).map((pos, i) => (
              <g key={i} opacity="0">
                <circle cx={pos.x + 20} cy={60} r="3" fill="#FCD34D" opacity="0.8">
                  <animate attributeName="opacity" values="0;0.8;0" keyTimes="0;0.5;1"
                    dur="1s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </svg>
          <div className="absolute top-2 left-2 text-[9px] text-white/25 font-mono">electrons →</div>
        </div>

        {/* Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 rounded-xl border"
            style={{ background: `${mat.color}0d`, borderColor: `${mat.color}28` }}
          >
            <div>
              <p className="text-xs font-bold mb-0.5" style={{ color: mat.color }}>{mat.label}</p>
              <p className="text-[11px] text-white/50">{mat.desc}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-[9px] text-white/30 mb-0.5">Resistance</p>
              <p className="text-xs font-bold" style={{ color: mat.color }}>{mat.resistanceLabel}</p>
              <p className="text-[9px] text-white/30">{mat.atomCount} atom{mat.atomCount > 1 ? "s" : ""}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 p-3 rounded-xl border border-primary/15" style={{ background: "rgba(16,185,129,0.05)" }}>
          <p className="text-xs text-white/65 leading-relaxed">
            <span className="text-primary font-semibold">Key insight:</span> More atoms in the path = more collisions = more resistance. That's why dense materials like rubber resist electricity far more than sparse conductors like copper.
          </p>
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
