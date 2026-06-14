"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

export default function ElectronJourney({ onSimUsed }: Props) {
  const [material, setMaterial] = useState<"copper" | "rubber">("copper");
  const [triggered, setTriggered] = useState(false);

  const toggle = (m: "copper" | "rubber") => {
    setMaterial(m);
    if (!triggered) { setTriggered(true); onSimUsed(); }
  };

  const isCopper = material === "copper";
  const dur = isCopper ? "1.2s" : "4s";
  const wireColor = isCopper ? "#F97316" : "#6B7280";
  const electronColor = isCopper ? "#0EA5E9" : "#6B7280";

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="03" title="Electron Journey" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/8 p-5"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <p className="text-sm text-white/65 leading-relaxed mb-5">
          Electrons are the tiny particles that carry electric current. How easily they move depends on the material they travel through. Toggle between materials to see the difference.
        </p>

        {/* Toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => toggle("copper")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style={isCopper
              ? { background: "rgba(249,115,22,0.15)", borderColor: "rgba(249,115,22,0.4)", color: "#F97316" }
              : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
            }
          >
            🔶 Copper Wire
          </button>
          <button
            onClick={() => toggle("rubber")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style={!isCopper
              ? { background: "rgba(107,114,128,0.15)", borderColor: "rgba(107,114,128,0.4)", color: "#9CA3AF" }
              : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }
            }
          >
            ⬛ Rubber
          </button>
        </div>

        {/* Circuit SVG */}
        <div className="relative rounded-xl border border-white/5 p-4 mb-4 overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
          <svg width="100%" viewBox="0 0 300 80" preserveAspectRatio="xMidYMid meet">
            {/* Battery */}
            <rect x="8" y="26" width="32" height="28" rx="4" fill="#18181B" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
            <line x1="18" y1="34" x2="18" y2="46" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="26" y1="36" x2="26" y2="44" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
            <text x="20" y="62" fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle">5V</text>

            {/* Wire — top */}
            <line x1="40" y1="40" x2="260" y2="40" stroke={wireColor} strokeWidth="3" strokeLinecap="round" />

            {/* Material label */}
            <rect x="100" y="28" width="100" height="24" rx="4" fill={isCopper ? "rgba(249,115,22,0.12)" : "rgba(107,114,128,0.12)"} stroke={isCopper ? "rgba(249,115,22,0.3)" : "rgba(107,114,128,0.3)"} strokeWidth="1" />
            <text x="150" y="38" fill={isCopper ? "#F97316" : "#9CA3AF"} fontSize="8" textAnchor="middle" fontWeight="600">
              {isCopper ? "Copper Wire" : "Rubber"}
            </text>
            <text x="150" y="48" fill={isCopper ? "rgba(249,115,22,0.6)" : "rgba(107,114,128,0.6)"} fontSize="7" textAnchor="middle">
              {isCopper ? "Low Resistance" : "High Resistance"}
            </text>

            {/* LED indicator */}
            <circle cx="270" cy="40" r="10" fill={isCopper ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.04)"} stroke={isCopper ? "#10B981" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" />
            {isCopper && <circle cx="270" cy="40" r="5" fill="#10B981" opacity="0.8" />}
            <text x="270" y="58" fill="rgba(255,255,255,0.3)" fontSize="6" textAnchor="middle">LED</text>

            {/* Electrons */}
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cy="40" r="4" fill={electronColor} opacity={isCopper ? 0.9 : 0.4}>
                <animateMotion
                  path="M 40 0 L 220 0"
                  dur={dur}
                  begin={`${i * (parseFloat(dur) / 4)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        </div>

        {/* Result card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={material}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-xl border"
            style={isCopper
              ? { background: "rgba(249,115,22,0.07)", borderColor: "rgba(249,115,22,0.2)" }
              : { background: "rgba(107,114,128,0.07)", borderColor: "rgba(107,114,128,0.2)" }
            }
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold" style={{ color: isCopper ? "#F97316" : "#9CA3AF" }}>
                {isCopper ? "Copper Wire" : "Rubber"}
              </p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={isCopper
                  ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.25)", color: "#10B981" }
                  : { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.25)", color: "#EF4444" }
                }
              >
                {isCopper ? "Low Resistance" : "High Resistance"}
              </span>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">
              {isCopper
                ? "Copper has very few obstacles for electrons. They flow freely and quickly, making copper an excellent conductor used in almost all wires."
                : "Rubber has billions of obstacles blocking electrons. Almost no current can pass through, making rubber a perfect insulator for covering wires."
              }
            </p>
          </motion.div>
        </AnimatePresence>
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
