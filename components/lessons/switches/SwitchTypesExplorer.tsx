"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

interface SwitchType {
  id: string;
  name: string;
  full: string;
  desc: string;
  example: string;
  isLatching: boolean;
  color: string;
  bg: string;
  border: string;
}

const switchTypes: SwitchType[] = [
  {
    id: "spst",
    name: "SPST",
    full: "Single Pole Single Throw",
    desc: "The simplest switch — one input, one output. Either the circuit is connected or it isn't. Classic on/off.",
    example: "🏠 Household light switch, on/off power switches on appliances",
    isLatching: true,
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  {
    id: "spdt",
    name: "SPDT",
    full: "Single Pole Double Throw",
    desc: "One input, two outputs. Current is always routed to one of two paths — acts as a selector or changeover switch.",
    example: "💡 3-way light switches (two switches, one light), motor direction selectors",
    isLatching: true,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
  {
    id: "toggle",
    name: "Toggle",
    full: "Toggle Switch (Latching)",
    desc: "A switch that stays in its last position. Flip it ON — it stays ON. Flip it OFF — it stays OFF. No spring-back.",
    example: "✈️ Aircraft panels, industrial machinery, fan/lamp wall switches",
    isLatching: true,
    color: CYAN,
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
  },
  {
    id: "momentary",
    name: "Push Button",
    full: "Momentary Push Button (Non-Latching)",
    desc: "Springs back to default position when released. Only active while pressed. NO type: open at rest; NC type: closed at rest.",
    example: "⌨️ Keyboard keys, doorbells, Arduino buttons, calculator buttons",
    isLatching: false,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
];

function SPSTSymbol({ active }: { active: boolean }) {
  return (
    <svg width="120" height="50" viewBox="0 0 120 50">
      <line x1="5" y1="25" x2="35" y2="25" stroke={active ? "#10B981" : "rgba(255,255,255,0.3)"} strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="25" r="3" fill={active ? "#10B981" : "rgba(255,255,255,0.2)"} />
      <circle cx="85" cy="25" r="3" fill={active ? "#10B981" : "rgba(255,255,255,0.2)"} />
      <motion.line
        x1="35" y1="25"
        animate={{ x2: active ? 85 : 70, y2: active ? 25 : 10 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        stroke={active ? "#10B981" : "rgba(255,255,255,0.4)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="85" y1="25" x2="115" y2="25" stroke={active ? "#10B981" : "rgba(255,255,255,0.3)"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SPDTSymbol({ pos }: { pos: 0 | 1 | 2 }) {
  const color = "#8B5CF6";
  return (
    <svg width="120" height="70" viewBox="0 0 120 70">
      <line x1="5" y1="35" x2="35" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="35" r="3" fill={pos > 0 ? color : "rgba(255,255,255,0.2)"} />
      {/* Output A top */}
      <circle cx="85" cy="18" r="3" fill={pos === 1 ? color : "rgba(255,255,255,0.15)"} />
      <line x1="85" y1="18" x2="115" y2="18" stroke={pos === 1 ? color : "rgba(255,255,255,0.2)"} strokeWidth="2" strokeLinecap="round" />
      <text x="117" y="22" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="monospace">A</text>
      {/* Output B bottom */}
      <circle cx="85" cy="52" r="3" fill={pos === 2 ? color : "rgba(255,255,255,0.15)"} />
      <line x1="85" y1="52" x2="115" y2="52" stroke={pos === 2 ? color : "rgba(255,255,255,0.2)"} strokeWidth="2" strokeLinecap="round" />
      <text x="117" y="56" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="monospace">B</text>
      {/* Arm */}
      <motion.line
        x1="35" y1="35"
        animate={{ x2: 85, y2: pos === 0 ? 35 : pos === 1 ? 18 : 52 }}
        transition={{ type: "spring", damping: 18, stiffness: 280 }}
        stroke={pos > 0 ? color : "rgba(255,255,255,0.3)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToggleSymbol({ on }: { on: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="50" height="80" viewBox="0 0 50 80">
        {/* Body */}
        <rect x="10" y="5" width="30" height="70" rx="6" fill="rgba(255,255,255,0.05)" stroke={on ? CYAN : "rgba(255,255,255,0.15)"} strokeWidth="1.5" />
        {/* Lever */}
        <motion.rect
          x="18" y="0"
          width="14" height="36" rx="5"
          animate={{ y: on ? 5 : 39 }}
          transition={{ type: "spring", damping: 18, stiffness: 280 }}
          fill={on ? CYAN : "rgba(255,255,255,0.3)"}
        />
      </svg>
      <p className="text-[9px] font-mono font-bold" style={{ color: on ? CYAN : "rgba(255,255,255,0.2)" }}>
        {on ? "ON" : "OFF"}
      </p>
    </div>
  );
}

function MomentarySymbol({ pressed }: { pressed: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="80" height="60" viewBox="0 0 80 60">
        {/* Left wire */}
        <line x1="5" y1="40" x2="22" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        {/* Right wire */}
        <line x1="58" y1="40" x2="75" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        {/* Contacts */}
        <circle cx="22" cy="40" r="3" fill={pressed ? "#F59E0B" : "rgba(255,255,255,0.15)"} />
        <circle cx="58" cy="40" r="3" fill={pressed ? "#F59E0B" : "rgba(255,255,255,0.15)"} />
        {/* Button cap */}
        <motion.rect
          x="20" y="0"
          width="40" height="18" rx="4"
          animate={{ y: pressed ? 24 : 8 }}
          transition={{ type: "spring", damping: 18, stiffness: 320 }}
          fill={pressed ? "#F59E0B" : "rgba(255,255,255,0.15)"}
        />
        {/* Stem */}
        <motion.rect
          x="36" y="18"
          width="8" height="22" rx="2"
          animate={{ height: pressed ? 22 : 22, y: pressed ? 18 : 18 }}
          fill={pressed ? "#F59E0B" : "rgba(255,255,255,0.1)"}
        />
        {/* Gap line */}
        {!pressed && (
          <line x1="22" y1="34" x2="58" y2="34" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />
        )}
        {pressed && (
          <line x1="22" y1="40" x2="58" y2="40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
      <p className="text-[9px] font-mono font-bold" style={{ color: pressed ? "#F59E0B" : "rgba(255,255,255,0.2)" }}>
        {pressed ? "PRESSED" : "RELEASED"}
      </p>
    </div>
  );
}

export default function SwitchTypesExplorer() {
  const [selected, setSelected] = useState<string>("spst");
  const [spstOn, setSpstOn] = useState(false);
  const [spdtPos, setSpdtPos] = useState<0 | 1 | 2>(0);
  const [toggleOn, setToggleOn] = useState(false);
  const [momentaryPressed, setMomentaryPressed] = useState(false);

  const current = switchTypes.find((s) => s.id === selected)!;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 3 · Switch Types
        </p>
        <h2 className="text-xl font-bold mb-6">Switch Types Explorer</h2>

        {/* Type selector cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {switchTypes.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelected(st.id)}
              className="p-3 rounded-2xl border text-left transition-all"
              style={{
                background: selected === st.id ? st.bg : "rgba(255,255,255,0.02)",
                borderColor: selected === st.id ? st.border : "rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-sm font-black mb-0.5" style={{ color: selected === st.id ? st.color : "rgba(255,255,255,0.5)" }}>
                {st.name}
              </p>
              <p className="text-[9px] text-white/30 leading-tight">{st.isLatching ? "Latching" : "Momentary"}</p>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: current.border, background: current.bg }}
          >
            <div className="p-5 flex flex-col sm:flex-row gap-6">
              {/* Left: info */}
              <div className="flex-1">
                <p className="text-[10px] font-mono text-white/30 mb-1">{current.full}</p>
                <p className="text-base font-bold mb-3" style={{ color: current.color }}>{current.name}</p>
                <p className="text-sm text-white/55 leading-relaxed mb-4">{current.desc}</p>
                <div className="p-3 rounded-xl border" style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] text-white/30 mb-1 font-mono">Real-world examples</p>
                  <p className="text-xs text-white/50 leading-relaxed">{current.example}</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="px-2 py-1 rounded-full text-[9px] font-bold border"
                    style={{ color: current.isLatching ? "#10B981" : "#F59E0B", background: current.isLatching ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", borderColor: current.isLatching ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)" }}
                  >
                    {current.isLatching ? "Latching" : "Momentary"}
                  </span>
                </div>
              </div>

              {/* Right: animation */}
              <div className="flex items-center justify-center min-w-[140px]">
                {selected === "spst" && (
                  <div className="flex flex-col items-center gap-3">
                    <SPSTSymbol active={spstOn} />
                    <button
                      onClick={() => setSpstOn((v) => !v)}
                      className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
                      style={{
                        background: spstOn ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                        borderColor: spstOn ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)",
                        color: spstOn ? "#10B981" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {spstOn ? "Turn OFF" : "Turn ON"}
                    </button>
                  </div>
                )}
                {selected === "spdt" && (
                  <div className="flex flex-col items-center gap-3">
                    <SPDTSymbol pos={spdtPos} />
                    <div className="flex gap-2">
                      {([0, 1, 2] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setSpdtPos(p)}
                          className="px-3 py-1 rounded-full text-[10px] font-bold border transition-all"
                          style={{
                            background: spdtPos === p ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                            borderColor: spdtPos === p ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)",
                            color: spdtPos === p ? "#8B5CF6" : "rgba(255,255,255,0.3)",
                          }}
                        >
                          {p === 0 ? "Mid" : p === 1 ? "A" : "B"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selected === "toggle" && (
                  <div
                    className="flex flex-col items-center gap-3 cursor-pointer select-none"
                    onClick={() => setToggleOn((v) => !v)}
                  >
                    <ToggleSymbol on={toggleOn} />
                    <p className="text-[10px] text-white/30">Click to flip</p>
                  </div>
                )}
                {selected === "momentary" && (
                  <div
                    className="flex flex-col items-center gap-3 cursor-pointer select-none"
                    onMouseDown={() => setMomentaryPressed(true)}
                    onMouseUp={() => setMomentaryPressed(false)}
                    onMouseLeave={() => setMomentaryPressed(false)}
                    onTouchStart={() => setMomentaryPressed(true)}
                    onTouchEnd={() => setMomentaryPressed(false)}
                  >
                    <MomentarySymbol pressed={momentaryPressed} />
                    <p className="text-[10px] text-white/30">Hold to press</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
