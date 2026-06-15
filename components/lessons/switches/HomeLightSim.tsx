"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

interface Props {
  onHomeLightUsed: () => void;
}

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  switchX: number;
  switchY: number;
  bulbX: number;
  bulbY: number;
}

const rooms: Room[] = [
  { id: "living", name: "Living Room", x: 20, y: 20, w: 140, h: 100, switchX: 30, switchY: 115, bulbX: 90, bulbY: 65 },
  { id: "kitchen", name: "Kitchen",    x: 180, y: 20, w: 110, h: 100, switchX: 185, switchY: 115, bulbX: 235, bulbY: 65 },
  { id: "bedroom", name: "Bedroom",    x: 20, y: 140, w: 140, h: 100, switchX: 30, switchY: 235, bulbX: 90, bulbY: 185 },
];

export default function HomeLightSim({ onHomeLightUsed }: Props) {
  const [roomStates, setRoomStates] = useState<Record<string, boolean>>({ living: false, kitchen: false, bedroom: false });
  const [triggered, setTriggered] = useState(false);

  const toggle = (id: string) => {
    setRoomStates((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!triggered) { setTriggered(true); onHomeLightUsed(); }
      return next;
    });
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 7 · Simulation 4
        </p>
        <h2 className="text-xl font-bold mb-1">Home Light Simulator</h2>
        <p className="text-sm text-white/40 mb-6">Click the wall switches to control lights in each room independently.</p>

        <div className="max-w-2xl">
          {/* House floor plan */}
          <div
            className="rounded-2xl border overflow-hidden mb-5 relative"
            style={{ background: "rgba(8,8,16,0.9)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            {/* Power label */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-mono text-white/30">MAINS POWER</span>
            </div>

            <svg width="100%" viewBox="0 0 320 260" style={{ display: "block" }}>
              {/* House outline */}
              <rect x="10" y="10" width="300" height="240" rx="4" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              {/* Roof triangle */}
              <polygon points="160,2 310,52 10,52" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x="160" y="38" fontSize="10" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">APEX HOME</text>

              {rooms.map((room) => {
                const on = roomStates[room.id];
                return (
                  <g key={room.id}>
                    {/* Room rectangle */}
                    <rect
                      x={room.x} y={room.y} width={room.w} height={room.h}
                      rx="3"
                      fill={on ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.02)"}
                      stroke={on ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.08)"}
                      strokeWidth="1"
                    />
                    {/* Room name */}
                    <text
                      x={room.x + room.w / 2} y={room.y + 14}
                      fontSize="8" fill={on ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.25)"}
                      textAnchor="middle" fontFamily="monospace"
                    >
                      {room.name.toUpperCase()}
                    </text>
                    {/* Ceiling light */}
                    <circle
                      cx={room.bulbX} cy={room.bulbY} r={on ? 14 : 10}
                      fill={on ? "rgba(251,191,36,0.85)" : "rgba(255,255,255,0.05)"}
                      stroke={on ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.1)"}
                      strokeWidth="1.5"
                    />
                    {on && (
                      <circle cx={room.bulbX} cy={room.bulbY} r="22" fill="rgba(251,191,36,0.1)" />
                    )}
                    <text x={room.bulbX} y={room.bulbY + 5} fontSize="10" textAnchor="middle">
                      {on ? "💡" : "⚪"}
                    </text>
                    {/* Wire from switch to light (simplified) */}
                    <line
                      x1={room.switchX + 6} y1={room.switchY - 4}
                      x2={room.bulbX} y2={room.bulbY + (room.bulbY > room.switchY ? -14 : 14)}
                      stroke={on ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.06)"}
                      strokeWidth="1"
                      strokeDasharray={on ? "none" : "3,3"}
                    />
                    {/* Switch (clickable) */}
                    <g
                      onClick={() => toggle(room.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect
                        x={room.switchX} y={room.switchY - 10}
                        width="20" height="28" rx="3"
                        fill={on ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.05)"}
                        stroke={on ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.15)"}
                        strokeWidth="1"
                      />
                      <rect
                        x={room.switchX + 5}
                        y={on ? room.switchY - 7 : room.switchY + 3}
                        width="10" height="10" rx="2"
                        fill={on ? CYAN : "rgba(255,255,255,0.25)"}
                      />
                    </g>
                  </g>
                );
              })}

              {/* Power symbol at bottom */}
              <circle cx="160" cy="245" r="7" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
              <line x1="160" y1="238" x2="160" y2="243" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
              <text x="160" y="260" fontSize="7" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">MAINS</text>
            </svg>
          </div>

          {/* Room switch controls */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {rooms.map((room) => {
              const on = roomStates[room.id];
              return (
                <button
                  key={room.id}
                  onClick={() => toggle(room.id)}
                  className="p-3 rounded-2xl border text-center transition-all"
                  style={{
                    background: on ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.03)",
                    borderColor: on ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="text-xl mb-1">{on ? "💡" : "🔦"}</div>
                  <p className="text-[10px] font-bold" style={{ color: on ? CYAN : "rgba(255,255,255,0.35)" }}>
                    {room.name.split(" ")[0]}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: on ? "rgba(6,182,212,0.7)" : "rgba(255,255,255,0.2)" }}>
                    {on ? "ON" : "OFF"}
                  </p>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {Object.values(roomStates).every((v) => v) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-xl border text-center text-xs"
                style={{ background: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.3)", color: "rgba(251,191,36,0.8)" }}
              >
                All lights on! Your electricity bill just went up... 💸
              </motion.div>
            )}
          </AnimatePresence>

          {triggered && (
            <p className="text-center text-xs mt-3" style={{ color: CYAN }}>+15 XP earned! Each room has its own switch.</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
