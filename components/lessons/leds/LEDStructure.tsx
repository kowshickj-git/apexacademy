"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const parts = [
  { id: "dome", label: "Epoxy Dome / Lens", color: "#FCA5A5", desc: "The transparent or diffused plastic dome acts as a lens, focusing and shaping the light output. Clear domes produce a narrow beam; diffused domes spread light wider." },
  { id: "chip", label: "LED Chip (Die)", color: "#EAB308", desc: "The semiconductor chip — typically 0.25mm square — is the actual P-N junction that emits light. The chip material determines the colour (GaN for blue/white, AlGaInP for red)." },
  { id: "anode_post", label: "Anode Post (+)", color: "#10B981", desc: "The longer metal post connects the anode of the LED chip to the external anode leg. Bond wires from the chip connect to this post." },
  { id: "cathode_post", label: "Cathode Reflector Cup (−)", color: "#0EA5E9", desc: "The cathode is mounted in a reflective cup that directs emitted light toward the dome. The cup also mechanically supports the chip and bonds to the cathode leg." },
  { id: "bond_wire", label: "Bond Wire", color: "#A78BFA", desc: "Ultra-thin gold or aluminium wire (25μm diameter) connects the LED chip's anode pad to the anode post. Under a microscope it looks like a tiny bridge." },
];

export default function LEDStructure() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7 · Structure</p>
        <h2 className="text-xl font-bold mb-1">Inside an LED</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          A standard 5mm LED has five key parts. Click any part below to learn what it does.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* LED cross-section SVG */}
          <div className="shrink-0">
            <svg width="160" height="200" viewBox="0 0 160 200">
              {/* Epoxy dome */}
              <g className="cursor-pointer" onClick={() => setActive(active === "dome" ? null : "dome")}>
                <ellipse cx="80" cy="60" rx="55" ry="55"
                  fill={active === "dome" ? "rgba(252,165,165,0.3)" : "rgba(239,68,68,0.15)"}
                  stroke={active === "dome" ? "#FCA5A5" : "rgba(239,68,68,0.3)"}
                  strokeWidth="1.5"
                />
                <text x="80" y="35" textAnchor="middle" fontSize="7" fill="rgba(252,165,165,0.5)" fontFamily="monospace">dome</text>
              </g>

              {/* Cathode reflector cup */}
              <g className="cursor-pointer" onClick={() => setActive(active === "cathode_post" ? null : "cathode_post")}>
                <path d="M55 100 Q55 130 80 130 Q105 130 105 100 L105 80 L55 80 Z"
                  fill={active === "cathode_post" ? "rgba(14,165,233,0.3)" : "rgba(14,165,233,0.15)"}
                  stroke={active === "cathode_post" ? "#0EA5E9" : "rgba(14,165,233,0.3)"}
                  strokeWidth="1"
                />
              </g>

              {/* LED chip */}
              <g className="cursor-pointer" onClick={() => setActive(active === "chip" ? null : "chip")}>
                <rect x="70" y="85" width="20" height="20" rx="2"
                  fill={active === "chip" ? "rgba(234,179,8,0.6)" : "rgba(234,179,8,0.35)"}
                  stroke={active === "chip" ? "#EAB308" : "rgba(234,179,8,0.5)"}
                  strokeWidth="1.5"
                />
                {active === "chip" && (
                  <rect x="73" y="88" width="14" height="14" rx="1" fill="rgba(234,179,8,0.3)" />
                )}
              </g>

              {/* Bond wire */}
              <g className="cursor-pointer" onClick={() => setActive(active === "bond_wire" ? null : "bond_wire")}>
                <path d="M80 85 Q65 72 60 65"
                  fill="none"
                  stroke={active === "bond_wire" ? "#A78BFA" : "rgba(167,139,250,0.4)"}
                  strokeWidth={active === "bond_wire" ? 2 : 1}
                />
              </g>

              {/* Anode post */}
              <g className="cursor-pointer" onClick={() => setActive(active === "anode_post" ? null : "anode_post")}>
                <rect x="58" y="65" width="10" height="35" rx="2"
                  fill={active === "anode_post" ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.2)"}
                  stroke={active === "anode_post" ? "#10B981" : "rgba(16,185,129,0.35)"}
                  strokeWidth="1"
                />
              </g>

              {/* LED legs */}
              <line x1="65" y1="130" x2="65" y2="195" stroke={active === "anode_post" ? "#10B981" : "#6B7280"} strokeWidth="3" />
              <line x1="95" y1="130" x2="95" y2="185" stroke={active === "cathode_post" ? "#0EA5E9" : "#6B7280"} strokeWidth="3" />
              <line x1="65" y1="180" x2="95" y2="180" stroke="#6B7280" strokeWidth="1.5" />

              {/* Labels */}
              <text x="40" y="195" fontSize="8" fill="rgba(16,185,129,0.7)" fontFamily="monospace">A (+)</text>
              <text x="98" y="185" fontSize="8" fill="rgba(239,68,68,0.7)" fontFamily="monospace">K (−)</text>

              {/* Light rays when no part selected */}
              {!active && (
                <>
                  <line x1="80" y1="5" x2="80" y2="-5" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  <line x1="105" y1="15" x2="115" y2="8" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <line x1="55" y1="15" x2="45" y2="8" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                </>
              )}
            </svg>
            <p className="text-[9px] text-white/20 text-center">Click any part</p>
          </div>

          {/* Info panel */}
          <div className="flex-1 w-full">
            {/* Part list */}
            <div className="space-y-1.5 mb-3">
              {parts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(active === p.id ? null : p.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all"
                  style={active === p.id
                    ? { background: `${p.color}15`, borderColor: `${p.color}40` }
                    : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }
                  }
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className="text-xs" style={{ color: active === p.id ? p.color : "rgba(255,255,255,0.5)" }}>{p.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border p-3"
                  style={{ background: `${parts.find(p => p.id === active)?.color}0d`, borderColor: `${parts.find(p => p.id === active)?.color}30` }}
                >
                  <p className="text-[10px] text-white/30 mb-1 font-mono uppercase">{parts.find(p => p.id === active)?.label}</p>
                  <p className="text-xs text-white/55 leading-relaxed">{parts.find(p => p.id === active)?.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
