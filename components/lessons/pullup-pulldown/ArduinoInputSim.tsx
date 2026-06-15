"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onArduinoInputUsed: () => void;
}

type InputMode = "none" | "external" | "internal";

const modeConfig = {
  none: {
    label: "No Resistor",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    stable: false,
    code: `void setup() {\n  pinMode(2, INPUT);  // No pull-up!\n  // Pin is FLOATING!\n}\n\nvoid loop() {\n  int val = digitalRead(2);\n  // val = random noise!\n}`,
    desc: "Pin 2 floats — reads random noise",
  },
  external: {
    label: "External 10kΩ",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    stable: true,
    code: `void setup() {\n  pinMode(2, INPUT);\n  // External 10kΩ between\n  // Vcc and Pin 2\n}\n\nvoid loop() {\n  int val = digitalRead(2);\n  // Stable! HIGH by default\n}`,
    desc: "External 10kΩ pull-up added — stable",
  },
  internal: {
    label: "INPUT_PULLUP",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
    stable: true,
    code: `void setup() {\n  // One line! No external R needed\n  pinMode(2, INPUT_PULLUP);\n  // Internal ~20-50kΩ pull-up\n}\n\nvoid loop() {\n  int val = digitalRead(2);\n  // Stable HIGH. Pressed = LOW\n}`,
    desc: "Internal pull-up (~20–50kΩ) — simplest",
  },
};

export default function ArduinoInputSim({ onArduinoInputUsed }: Props) {
  const [mode, setMode] = useState<InputMode>("none");
  const [triggered, setTriggered] = useState(false);
  const [ledFlicker, setLedFlicker] = useState(false);
  const [pinReading, setPinReading] = useState<"HIGH" | "LOW" | "?">("?");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleModeChange = useCallback((m: InputMode) => {
    setMode(m);
    if (!triggered) {
      setTriggered(true);
      onArduinoInputUsed();
    }
  }, [triggered, onArduinoInputUsed]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const cfg = modeConfig[mode];

    if (!cfg.stable) {
      intervalRef.current = setInterval(() => {
        setLedFlicker(Math.random() > 0.5);
        setPinReading(Math.random() > 0.5 ? "HIGH" : "LOW");
      }, 250);
    } else {
      setLedFlicker(false);
      setPinReading("HIGH");
    }

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [mode]);

  const cfg = modeConfig[mode];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 4 · Arduino Input Modes
        </p>
        <h2 className="text-xl font-bold mb-1">Arduino Input Configuration</h2>
        <p className="text-sm text-white/45 mb-6">
          Compare three ways to handle digital button input on Arduino/ESP32.
        </p>

        {/* Mode selector */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {(["none", "external", "internal"] as InputMode[]).map((m) => {
            const c = modeConfig[m];
            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className="py-2.5 px-2 rounded-xl text-xs font-bold border transition-all"
                style={{
                  background: mode === m ? c.bg : "rgba(255,255,255,0.03)",
                  borderColor: mode === m ? c.border : "rgba(255,255,255,0.08)",
                  color: mode === m ? c.color : "rgba(255,255,255,0.35)",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border overflow-hidden transition-all duration-500" style={{ background: "rgba(0,0,0,0.25)", borderColor: cfg.border }}>
          {/* Arduino board illustration */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-4">
              {/* Arduino outline */}
              <div className="relative shrink-0">
                <svg viewBox="0 0 120 160" width="90" height="120">
                  {/* Board body */}
                  <rect x="5" y="5" width="110" height="150" rx="8" fill="rgba(0,100,0,0.2)" stroke="rgba(0,150,0,0.4)" strokeWidth="1.5" />
                  <text x="60" y="20" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.4)" fontFamily="monospace">Arduino Uno</text>

                  {/* USB connector */}
                  <rect x="18" y="1" width="30" height="10" rx="2" fill="rgba(255,255,255,0.15)" />

                  {/* Chip */}
                  <rect x="30" y="65" width="55" height="35" rx="3" fill="rgba(30,30,30,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <text x="57" y="85" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="monospace">ATmega328</text>

                  {/* Pin 2 */}
                  <rect x="88" y="50" width="16" height="8" rx="2" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
                  <text x="96" y="57" textAnchor="middle" fontSize="5.5" fill="#F59E0B" fontFamily="monospace">D2</text>

                  {/* Resistor (external mode) */}
                  {mode === "external" && (
                    <>
                      <line x1="96" y1="50" x2="96" y2="38" stroke="#F59E0B" strokeWidth="1.5" />
                      <rect x="88" y="25" width="16" height="12" rx="2" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                      <text x="96" y="34" textAnchor="middle" fontSize="5" fill="#F59E0B" fontFamily="monospace">10k</text>
                      <line x1="96" y1="25" x2="96" y2="15" stroke="#F59E0B" strokeWidth="1.5" />
                      <text x="96" y="12" textAnchor="middle" fontSize="5" fill="#F59E0B" fontFamily="monospace">Vcc</text>
                    </>
                  )}

                  {/* Internal pullup indicator */}
                  {mode === "internal" && (
                    <>
                      <line x1="96" y1="50" x2="96" y2="40" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="96" y="37" textAnchor="middle" fontSize="5" fill="#10B981" fontFamily="monospace">INT</text>
                    </>
                  )}

                  {/* LED on pin */}
                  <circle
                    cx="96" cy="115"
                    r="8"
                    fill={ledFlicker ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.04)"}
                    stroke={ledFlicker ? "#F59E0B" : "rgba(255,255,255,0.15)"}
                    strokeWidth="1.5"
                    style={{ transition: "all 0.1s" }}
                  />
                  <text x="96" y="118" textAnchor="middle" fontSize="6" fill={ledFlicker ? "#F59E0B" : "rgba(255,255,255,0.3)"} fontFamily="monospace">LED</text>
                  <line x1="96" y1="58" x2="96" y2="107" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 2" />
                </svg>
              </div>

              {/* Status */}
              <div className="flex-1">
                <div className="mb-3 p-3 rounded-xl border" style={{ background: cfg.bg, borderColor: cfg.border }}>
                  <p className="text-[10px] font-mono text-white/30 mb-1">PIN 2 READING</p>
                  <p className="text-2xl font-black font-mono" style={{ color: cfg.color }}>
                    {pinReading}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: cfg.color + "99" }}>{cfg.desc}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/35">Builtin LED:</span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${ledFlicker}`}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full border"
                      style={{
                        background: ledFlicker ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.04)",
                        borderColor: ledFlicker ? "#F59E0B" : "rgba(255,255,255,0.15)",
                        boxShadow: ledFlicker ? "0 0 10px rgba(245,158,11,0.6)" : "none",
                        transition: "all 0.12s",
                      }}
                    />
                  </AnimatePresence>
                  <span className="text-xs font-mono" style={{ color: ledFlicker ? "#F59E0B" : "rgba(255,255,255,0.25)" }}>
                    {modeConfig[mode].stable ? "stable" : "flickering (noise)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Code snippet */}
          <div className="p-4">
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Arduino Code</p>
            <pre
              className="text-[11px] font-mono leading-relaxed p-3 rounded-xl overflow-x-auto"
              style={{ background: "rgba(0,0,0,0.4)", color: cfg.color + "CC" }}
            >
              {cfg.code}
            </pre>
            {mode === "internal" && (
              <p className="text-[10px] text-white/35 mt-2 font-mono">
                Note: Internal pull-up is ~20–50kΩ. Pressed = reads LOW (inverted). Works on most Arduino/ESP32/STM32.
              </p>
            )}
          </div>
        </div>

        {triggered && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs text-center font-mono" style={{ color: "#F59E0B" }}>
            +15 XP — Arduino input modes explored!
          </motion.p>
        )}
      </div>
    </section>
  );
}
