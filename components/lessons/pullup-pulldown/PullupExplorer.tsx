"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type CircuitType = "pullup" | "pulldown";

function PullUpSVG({ hovered }: { hovered: boolean }) {
  return (
    <svg viewBox="0 0 200 240" className="w-full max-w-[200px]" style={{ overflow: "visible" }}>
      {/* VCC label */}
      <text x="100" y="16" textAnchor="middle" fontSize="11" fill="#F59E0B" fontFamily="monospace" fontWeight="bold">Vcc (3.3V)</text>
      {/* VCC line down to resistor */}
      <line x1="100" y1="20" x2="100" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Resistor body */}
      <rect x="82" y="55" width="36" height="20" rx="3" fill="none" stroke={hovered ? "#F59E0B" : "rgba(255,255,255,0.4)"} strokeWidth="2" />
      <text x="100" y="68" textAnchor="middle" fontSize="9" fill={hovered ? "#F59E0B" : "rgba(255,255,255,0.5)"} fontFamily="monospace">10kΩ</text>
      {/* Resistor to junction */}
      <line x1="100" y1="75" x2="100" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Junction dot */}
      <circle cx="100" cy="110" r="4" fill={hovered ? "#F59E0B" : "rgba(255,255,255,0.5)"} />
      {/* Junction to MCU Pin (right) */}
      <line x1="100" y1="110" x2="160" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* MCU Pin box */}
      <rect x="160" y="98" width="36" height="24" rx="4" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <text x="178" y="114" textAnchor="middle" fontSize="8" fill="#F59E0B" fontFamily="monospace">MCU</text>
      {/* Junction down to button */}
      <line x1="100" y1="110" x2="100" y2="150" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Button */}
      <line x1="80" y1="155" x2="120" y2="155" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
      <line x1="80" y1="165" x2="120" y2="165" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
      <line x1="100" y1="150" x2="100" y2="155" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <line x1="100" y1="165" x2="100" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* GND */}
      <line x1="70" y1="200" x2="130" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <line x1="80" y1="206" x2="120" y2="206" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1="90" y1="212" x2="110" y2="212" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="100" y="226" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="monospace">GND</text>

      {/* Current path animation */}
      {hovered && (
        <>
          <motion.line x1="100" y1="20" x2="100" y2="55" stroke="#F59E0B" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} strokeLinecap="round" />
          <motion.line x1="100" y1="75" x2="100" y2="110" stroke="#F59E0B" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} strokeLinecap="round" />
          <motion.line x1="100" y1="110" x2="160" y2="110" stroke="#F59E0B" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.35 }} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function PullDownSVG({ hovered }: { hovered: boolean }) {
  return (
    <svg viewBox="0 0 200 240" className="w-full max-w-[200px]" style={{ overflow: "visible" }}>
      {/* Pin / Junction at top */}
      <text x="100" y="16" textAnchor="middle" fontSize="11" fill="#3B82F6" fontFamily="monospace" fontWeight="bold">Pin / Junction</text>
      <line x1="100" y1="20" x2="100" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Junction dot */}
      <circle cx="100" cy="55" r="4" fill={hovered ? "#3B82F6" : "rgba(255,255,255,0.5)"} />
      {/* Junction to MCU (right) */}
      <line x1="100" y1="55" x2="160" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <rect x="160" y="43" width="36" height="24" rx="4" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />
      <text x="178" y="59" textAnchor="middle" fontSize="8" fill="#3B82F6" fontFamily="monospace">MCU</text>
      {/* Junction to resistor (down) */}
      <line x1="100" y1="55" x2="100" y2="90" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Resistor */}
      <rect x="82" y="90" width="36" height="20" rx="3" fill="none" stroke={hovered ? "#3B82F6" : "rgba(255,255,255,0.4)"} strokeWidth="2" />
      <text x="100" y="103" textAnchor="middle" fontSize="9" fill={hovered ? "#3B82F6" : "rgba(255,255,255,0.5)"} fontFamily="monospace">10kΩ</text>
      {/* Resistor to GND */}
      <line x1="100" y1="110" x2="100" y2="145" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <line x1="70" y1="145" x2="130" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <line x1="80" y1="151" x2="120" y2="151" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1="90" y1="157" x2="110" y2="157" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="100" y="172" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="monospace">GND</text>

      {/* Button path: Junction → Vcc */}
      <line x1="100" y1="55" x2="40" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="40" y1="55" x2="40" y2="185" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="30" y1="185" x2="50" y2="185" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <line x1="30" y1="195" x2="50" y2="195" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <line x1="40" y1="195" x2="40" y2="220" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="40" y="234" textAnchor="middle" fontSize="10" fill="#F59E0B" fontFamily="monospace">Vcc</text>
      <text x="60" y="192" fontSize="9" fill="rgba(255,255,255,0.25)" fontFamily="monospace">BTN</text>

      {/* Current path animation */}
      {hovered && (
        <>
          <motion.line x1="100" y1="55" x2="100" y2="90" stroke="#3B82F6" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} strokeLinecap="round" />
          <motion.line x1="100" y1="110" x2="100" y2="145" stroke="#3B82F6" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function PullupExplorer() {
  const [hovered, setHovered] = useState<CircuitType | null>(null);

  const configs = [
    {
      key: "pullup" as CircuitType,
      title: "Pull-Up Circuit",
      color: "#10B981",
      bg: "rgba(16,185,129,0.06)",
      border: "rgba(16,185,129,0.25)",
      open: "Pin = HIGH (Vcc)",
      pressed: "Pin = LOW (0V)",
      logic: "Inverted — pressed = LOW",
    },
    {
      key: "pulldown" as CircuitType,
      title: "Pull-Down Circuit",
      color: "#3B82F6",
      bg: "rgba(59,130,246,0.06)",
      border: "rgba(59,130,246,0.25)",
      open: "Pin = LOW (0V)",
      pressed: "Pin = HIGH (Vcc)",
      logic: "Normal — pressed = HIGH",
    },
  ];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 3 · Circuit Explorer
        </p>
        <h2 className="text-xl font-bold mb-2">Pull-Up vs Pull-Down</h2>
        <p className="text-sm text-white/45 mb-6">Hover over each circuit to see current flow. Typical resistor value: <span className="font-mono text-amber-400">10kΩ</span> (range: 1kΩ–100kΩ)</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {configs.map((c) => (
            <motion.div
              key={c.key}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHovered(c.key)}
              onHoverEnd={() => setHovered(null)}
              className="p-4 rounded-2xl border cursor-default transition-all"
              style={{
                background: hovered === c.key ? c.bg : "rgba(255,255,255,0.02)",
                borderColor: hovered === c.key ? c.border : "rgba(255,255,255,0.08)",
              }}
            >
              <h3 className="text-sm font-bold mb-3" style={{ color: c.color }}>{c.title}</h3>
              <div className="flex justify-center mb-3">
                {c.key === "pullup"
                  ? <PullUpSVG hovered={hovered === c.key} />
                  : <PullDownSVG hovered={hovered === c.key} />
                }
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Button Open:</span>
                  <code className="font-mono px-2 py-0.5 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>{c.open}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Button Pressed:</span>
                  <code className="font-mono px-2 py-0.5 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>{c.pressed}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Logic:</span>
                  <span className="text-[10px] font-semibold" style={{ color: c.color }}>{c.logic}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl border border-white/6 text-xs text-white/40" style={{ background: "rgba(245,158,11,0.04)" }}>
          <span className="font-mono text-amber-400">10kΩ Sweet Spot: </span>Low enough to override leakage currents. High enough to only draw 0.33mA at 3.3V (0.5mA at 5V) when button is pressed.
        </div>
      </div>
    </section>
  );
}
