"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BJTType = "NPN" | "PNP";

function NPNStructureSVG({ hoveredTerminal }: { hoveredTerminal: string | null }) {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto" style={{ display: "block" }}>
      {/* N region (Collector) */}
      <rect x="80" y="20" width="160" height="55" rx="4" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.4)" strokeWidth={hoveredTerminal === "C" ? 2 : 1} />
      <text x="160" y="47" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700">N</text>
      <text x="160" y="62" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="9">Collector region</text>

      {/* Depletion region BC */}
      <rect x="80" y="75" width="160" height="6" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />
      <text x="260" y="81" fill="rgba(240,240,245,0.3)" fontSize="7">depletion</text>

      {/* P region (Base) */}
      <rect x="80" y="81" width="160" height="28" rx="0" fill="rgba(14,165,233,0.12)" stroke="rgba(14,165,233,0.4)" strokeWidth={hoveredTerminal === "B" ? 2 : 1} />
      <text x="160" y="97" textAnchor="middle" fill="#0EA5E9" fontSize="11" fontWeight="700">P (thin!)</text>
      <text x="160" y="109" textAnchor="middle" fill="rgba(14,165,233,0.5)" fontSize="8">Base — very thin ≈ 1µm</text>

      {/* Depletion region BE */}
      <rect x="80" y="109" width="160" height="6" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />
      <text x="260" y="115" fill="rgba(240,240,245,0.3)" fontSize="7">depletion</text>

      {/* N region (Emitter) */}
      <rect x="80" y="115" width="160" height="55" rx="4" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth={hoveredTerminal === "E" ? 2 : 1} />
      <text x="160" y="142" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="700">N</text>
      <text x="160" y="157" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="9">Emitter region (heavily doped)</text>

      {/* Terminal leads */}
      {/* Collector */}
      <line x1="160" y1="20" x2="160" y2="5" stroke="#EF4444" strokeWidth="2" />
      <circle cx="160" cy="5" r="4" fill="#EF4444" opacity="0.8" />
      <text x="175" y="9" fill="#EF4444" fontSize="10" fontWeight="700">C</text>

      {/* Base */}
      <line x1="80" y1="95" x2="50" y2="95" stroke="#0EA5E9" strokeWidth="2" />
      <circle cx="46" cy="95" r="4" fill="#0EA5E9" opacity="0.8" />
      <text x="30" y="99" fill="#0EA5E9" fontSize="10" fontWeight="700">B</text>

      {/* Emitter */}
      <line x1="160" y1="170" x2="160" y2="185" stroke="#10B981" strokeWidth="2" />
      <circle cx="160" cy="189" r="4" fill="#10B981" opacity="0.8" />
      <text x="175" y="193" fill="#10B981" fontSize="10" fontWeight="700">E</text>

      {/* Current flow arrows */}
      <text x="50" y="50" fill="rgba(239,68,68,0.5)" fontSize="18">↓</text>
      <text x="50" y="165" fill="rgba(16,185,129,0.5)" fontSize="18">↓</text>
      <text x="48" y="85" fill="rgba(14,165,233,0.5)" fontSize="12">→</text>
    </svg>
  );
}

function PNPStructureSVG({ hoveredTerminal }: { hoveredTerminal: string | null }) {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto" style={{ display: "block" }}>
      {/* P region (Emitter) */}
      <rect x="80" y="20" width="160" height="55" rx="4" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.4)" strokeWidth={hoveredTerminal === "E" ? 2 : 1} />
      <text x="160" y="47" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700">P</text>
      <text x="160" y="62" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="9">Emitter region (heavily doped)</text>

      {/* Depletion region EB */}
      <rect x="80" y="75" width="160" height="6" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />

      {/* N region (Base) */}
      <rect x="80" y="81" width="160" height="28" fill="rgba(14,165,233,0.12)" stroke="rgba(14,165,233,0.4)" strokeWidth={hoveredTerminal === "B" ? 2 : 1} />
      <text x="160" y="97" textAnchor="middle" fill="#0EA5E9" fontSize="11" fontWeight="700">N (thin!)</text>
      <text x="160" y="109" textAnchor="middle" fill="rgba(14,165,233,0.5)" fontSize="8">Base — very thin</text>

      {/* Depletion region BC */}
      <rect x="80" y="109" width="160" height="6" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />

      {/* P region (Collector) */}
      <rect x="80" y="115" width="160" height="55" rx="4" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth={hoveredTerminal === "C" ? 2 : 1} />
      <text x="160" y="142" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="700">P</text>
      <text x="160" y="157" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="9">Collector region</text>

      {/* Leads */}
      <line x1="160" y1="20" x2="160" y2="5" stroke="#EF4444" strokeWidth="2" />
      <circle cx="160" cy="5" r="4" fill="#EF4444" opacity="0.8" />
      <text x="175" y="9" fill="#EF4444" fontSize="10" fontWeight="700">E</text>

      <line x1="80" y1="95" x2="50" y2="95" stroke="#0EA5E9" strokeWidth="2" />
      <circle cx="46" cy="95" r="4" fill="#0EA5E9" opacity="0.8" />
      <text x="30" y="99" fill="#0EA5E9" fontSize="10" fontWeight="700">B</text>

      <line x1="160" y1="170" x2="160" y2="185" stroke="#10B981" strokeWidth="2" />
      <circle cx="160" cy="189" r="4" fill="#10B981" opacity="0.8" />
      <text x="175" y="193" fill="#10B981" fontSize="10" fontWeight="700">C</text>

      {/* Current arrows */}
      <text x="50" y="50" fill="rgba(239,68,68,0.5)" fontSize="18">↑</text>
      <text x="50" y="165" fill="rgba(16,185,129,0.5)" fontSize="18">↑</text>
      <text x="48" y="85" fill="rgba(14,165,233,0.5)" fontSize="12">←</text>
    </svg>
  );
}

function NPNSymbol() {
  return (
    <svg viewBox="0 0 120 140" className="w-28 h-36 mx-auto">
      {/* Body circle */}
      <circle cx="60" cy="70" r="35" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      {/* Base line */}
      <line x1="25" y1="70" x2="44" y2="70" stroke="#0EA5E9" strokeWidth="2" />
      {/* Vertical base bar */}
      <line x1="44" y1="50" x2="44" y2="90" stroke="#EF4444" strokeWidth="2.5" />
      {/* Collector */}
      <line x1="44" y1="57" x2="75" y2="40" stroke="#10B981" strokeWidth="2" />
      <line x1="75" y1="40" x2="75" y2="15" stroke="#10B981" strokeWidth="2" />
      {/* Emitter with arrow */}
      <line x1="44" y1="83" x2="75" y2="100" stroke="#EF4444" strokeWidth="2" />
      <line x1="75" y1="100" x2="75" y2="125" stroke="#EF4444" strokeWidth="2" />
      {/* Arrow on emitter (pointing away = NPN) */}
      <polygon points="65,94 75,100 68,105" fill="#EF4444" />
      {/* Labels */}
      <text x="15" y="73" fill="#0EA5E9" fontSize="10" fontWeight="700">B</text>
      <text x="80" y="18" fill="#10B981" fontSize="10" fontWeight="700">C</text>
      <text x="80" y="128" fill="#EF4444" fontSize="10" fontWeight="700">E</text>
    </svg>
  );
}

function PNPSymbol() {
  return (
    <svg viewBox="0 0 120 140" className="w-28 h-36 mx-auto">
      {/* Body circle */}
      <circle cx="60" cy="70" r="35" fill="none" stroke="rgba(14,165,233,0.4)" strokeWidth="1.5" />
      {/* Base line */}
      <line x1="25" y1="70" x2="44" y2="70" stroke="#0EA5E9" strokeWidth="2" />
      {/* Vertical base bar */}
      <line x1="44" y1="50" x2="44" y2="90" stroke="#0EA5E9" strokeWidth="2.5" />
      {/* Collector */}
      <line x1="44" y1="57" x2="75" y2="40" stroke="#10B981" strokeWidth="2" />
      <line x1="75" y1="40" x2="75" y2="15" stroke="#10B981" strokeWidth="2" />
      {/* Emitter with arrow (pointing IN = PNP) */}
      <line x1="44" y1="83" x2="75" y2="100" stroke="#EF4444" strokeWidth="2" />
      <line x1="75" y1="100" x2="75" y2="125" stroke="#EF4444" strokeWidth="2" />
      {/* Arrow on emitter pointing toward base */}
      <polygon points="54,79 44,83 50,91" fill="#EF4444" />
      {/* Labels */}
      <text x="15" y="73" fill="#0EA5E9" fontSize="10" fontWeight="700">B</text>
      <text x="80" y="18" fill="#10B981" fontSize="10" fontWeight="700">C</text>
      <text x="80" y="128" fill="#EF4444" fontSize="10" fontWeight="700">E</text>
    </svg>
  );
}

export default function BJTStructureExplorer() {
  const [activeType, setActiveType] = useState<BJTType>("NPN");
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

  const terminalInfo: Record<string, { desc: string; color: string }> = {
    B: { desc: "Base: Control terminal. Forward-bias BE junction with ~0.7V to enable transistor action.", color: "#0EA5E9" },
    C: { desc: "Collector: Main current path. Reverse-biased to BC junction. High voltage tolerance.", color: "#10B981" },
    E: { desc: "Emitter: Current exit. Heavily doped for efficient minority carrier injection.", color: "#EF4444" },
  };

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div
            className="inline-block px-2 py-1 rounded-lg text-xs font-mono font-bold mb-2"
            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            INTERACTIVE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            BJT Structure Explorer
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Explore the physical structure of NPN and PNP transistors. Click tabs to switch type.
          </p>
        </div>

        {/* Type tabs */}
        <div className="flex gap-2 mb-6">
          {(["NPN", "PNP"] as BJTType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="px-6 py-2.5 rounded-xl font-black text-sm transition-all"
              style={{
                background: activeType === type ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                border: activeType === type ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.1)",
                color: activeType === type ? "#EF4444" : "rgba(240,240,245,0.5)",
              }}
            >
              {type} Transistor
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Cross-section */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xs font-mono mb-3 text-center" style={{ color: "rgba(240,240,245,0.4)" }}>
              CROSS-SECTION — {activeType}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeType}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {activeType === "NPN" ? (
                  <NPNStructureSVG hoveredTerminal={hoveredTerminal} />
                ) : (
                  <PNPStructureSVG hoveredTerminal={hoveredTerminal} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Key note */}
            <div
              className="mt-3 p-3 rounded-xl text-center"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
            >
              <div className="text-xs" style={{ color: "rgba(239,68,68,0.8)" }}>
                Key: Base region is VERY thin (~1µm). This is what enables transistor action.
              </div>
            </div>
          </div>

          {/* Schematic symbol + terminal info */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-xs font-mono mb-3 text-center" style={{ color: "rgba(240,240,245,0.4)" }}>
                SCHEMATIC SYMBOL — {activeType}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeType + "-sym"}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeType === "NPN" ? <NPNSymbol /> : <PNPSymbol />}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs text-center mt-2" style={{ color: "rgba(240,240,245,0.4)" }}>
                {activeType === "NPN"
                  ? "Emitter arrow points AWAY from base (current OUT)"
                  : "Emitter arrow points TOWARD base (current IN)"}
              </div>
            </div>

            {/* Terminal hover info */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-xs font-mono mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>
                HOVER TERMINAL TO LEARN MORE
              </div>
              <div className="flex gap-2">
                {["B", "C", "E"].map((t) => (
                  <button
                    key={t}
                    onMouseEnter={() => setHoveredTerminal(t)}
                    onMouseLeave={() => setHoveredTerminal(null)}
                    className="w-10 h-10 rounded-xl font-black text-sm transition-all"
                    style={{
                      background: hoveredTerminal === t ? `${terminalInfo[t].color}20` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${hoveredTerminal === t ? terminalInfo[t].color : "rgba(255,255,255,0.1)"}`,
                      color: hoveredTerminal === t ? terminalInfo[t].color : "rgba(240,240,245,0.5)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {hoveredTerminal && (
                  <motion.div
                    key={hoveredTerminal}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-3 rounded-xl"
                    style={{ background: `${terminalInfo[hoveredTerminal].color}08`, border: `1px solid ${terminalInfo[hoveredTerminal].color}20` }}
                  >
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.65)" }}>
                      {terminalInfo[hoveredTerminal].desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
