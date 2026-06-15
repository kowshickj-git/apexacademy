"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPullupUsed: () => void;
}

export default function PullUpSim({ onPullupUsed }: Props) {
  const [pressed, setPressed] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const handlePress = useCallback(() => {
    setPressed(true);
    if (!triggered) {
      setTriggered(true);
      onPullupUsed();
    }
  }, [triggered, onPullupUsed]);

  const pinVoltage = pressed ? 0 : 3.3;
  const pinState = pressed ? "LOW" : "HIGH";
  const currentmA = pressed ? 0.33 : 0;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 2 · Pull-Up Resistor
        </p>
        <h2 className="text-xl font-bold mb-1">Pull-Up Circuit Simulator</h2>
        <p className="text-sm text-white/45 mb-6">
          Vcc → 10kΩ → Pin (MCU). Button from pin to GND. Press the button to see what happens.
        </p>

        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(0,0,0,0.25)" }}>
          {/* SVG circuit diagram */}
          <div className="p-5 border-b border-white/5">
            <svg viewBox="0 0 340 200" className="w-full">
              {/* VCC */}
              <text x="60" y="18" textAnchor="middle" fontSize="11" fill="#F59E0B" fontFamily="monospace" fontWeight="bold">Vcc 3.3V</text>
              <line x1="60" y1="22" x2="60" y2="55" stroke={pressed ? "rgba(245,158,11,0.3)" : "#F59E0B"} strokeWidth="2.5" />

              {/* Resistor */}
              <rect x="42" y="55" width="36" height="22" rx="3" fill="none" stroke={pressed ? "rgba(245,158,11,0.6)" : "#F59E0B"} strokeWidth="2" />
              <text x="60" y="69" textAnchor="middle" fontSize="9" fill={pressed ? "rgba(245,158,11,0.6)" : "#F59E0B"} fontFamily="monospace">10kΩ</text>

              {/* Resistor to junction */}
              <line x1="60" y1="77" x2="60" y2="110" stroke={pressed ? "rgba(245,158,11,0.5)" : "#F59E0B"} strokeWidth="2.5" />

              {/* Junction dot */}
              <circle cx="60" cy="110" r="5" fill={pressed ? "rgba(245,158,11,0.6)" : "#F59E0B"} />

              {/* Junction label */}
              <text x="60" y="128" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="monospace">JUNCTION</text>

              {/* Junction to MCU */}
              <line x1="60" y1="110" x2="200" y2="110" stroke={pressed ? "rgba(255,255,255,0.15)" : "rgba(245,158,11,0.8)"} strokeWidth="2.5" />
              <rect x="200" y="92" width="60" height="36" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.35)" strokeWidth="1.5" />
              <text x="230" y="113" textAnchor="middle" fontSize="10" fill="#F59E0B" fontFamily="monospace">MCU Pin</text>

              {/* Pin state indicator */}
              <circle cx="286" cy="110" r="8" fill={pressed ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"} stroke={pressed ? "#EF4444" : "#10B981"} strokeWidth="1.5" />
              <text x="286" y="114" textAnchor="middle" fontSize="8" fill={pressed ? "#EF4444" : "#10B981"} fontFamily="monospace" fontWeight="bold">{pressed ? "L" : "H"}</text>

              {/* Junction to button */}
              <line x1="60" y1="110" x2="60" y2="148" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />

              {/* Button */}
              <line x1="40" y1="150" x2="80" y2="150" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              {!pressed && <line x1="60" y1="148" x2="60" y2="150" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />}
              {pressed
                ? <line x1="60" y1="150" x2="60" y2="160" stroke="#EF4444" strokeWidth="2.5" />
                : <line x1="54" y1="152" x2="66" y2="158" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              }
              <line x1="40" y1="160" x2="80" y2="160" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="60" y1="160" x2="60" y2="185" stroke={pressed ? "#EF4444" : "rgba(255,255,255,0.15)"} strokeWidth="2" />

              {/* GND */}
              <line x1="30" y1="185" x2="90" y2="185" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="40" y1="191" x2="80" y2="191" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <line x1="50" y1="197" x2="70" y2="197" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <text x="60" y="210" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" fontFamily="monospace">GND</text>

              {/* Animated current particle when pressed */}
              {pressed && (
                <motion.circle
                  r="4"
                  fill="#EF4444"
                  initial={{ cx: 60, cy: 22 }}
                  animate={{ cx: [60, 60, 60, 60], cy: [22, 77, 110, 185] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  opacity={0.8}
                />
              )}
              {/* Current particle to MCU when not pressed */}
              {!pressed && (
                <motion.circle
                  r="3.5"
                  fill="#F59E0B"
                  initial={{ cx: 60, cy: 22 }}
                  animate={{ cx: [60, 60, 60, 200], cy: [22, 55, 110, 110] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  opacity={0.7}
                />
              )}
            </svg>
          </div>

          {/* State readout */}
          <div className="px-5 py-4 border-b border-white/5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pin Voltage", value: `${pinVoltage.toFixed(1)}V`, color: pressed ? "#EF4444" : "#10B981" },
                { label: "Pin State", value: pinState, color: pressed ? "#EF4444" : "#10B981" },
                { label: "I through R", value: `${currentmA.toFixed(2)} mA`, color: pressed ? "#F59E0B" : "rgba(255,255,255,0.3)" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-2.5 rounded-xl border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[9px] font-mono text-white/25 mb-1">{label}</p>
                  <p className="text-lg font-black font-mono" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Math when pressed */}
          <AnimatePresence>
            {pressed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-white/5" style={{ background: "rgba(239,68,68,0.04)" }}>
                  <p className="text-[10px] font-mono text-white/30 mb-1">VOLTAGE DIVIDER (button pressed = 0Ω to GND):</p>
                  <p className="text-xs font-mono" style={{ color: "#EF4444" }}>
                    V_pin = Vcc × 0 / (10kΩ + 0) = 0V
                  </p>
                  <p className="text-[10px] font-mono text-white/30 mt-1">
                    I = 3.3V / 10,000Ω = 0.33mA (through resistor to GND)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button control */}
          <div className="p-5">
            <button
              onMouseDown={handlePress}
              onMouseUp={() => setPressed(false)}
              onTouchStart={handlePress}
              onTouchEnd={() => setPressed(false)}
              className="w-full py-3 rounded-xl font-bold text-sm border transition-all select-none"
              style={{
                background: pressed ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: pressed ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.12)",
                color: pressed ? "#EF4444" : "rgba(255,255,255,0.5)",
              }}
            >
              {pressed ? "● Button PRESSED — Pin = LOW" : "○ Hold to Press Button"}
            </button>
            <p className="text-[10px] font-mono text-white/20 text-center mt-2">
              Pull-Up logic is INVERTED: pressed = LOW
            </p>
          </div>
        </div>

        {triggered && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs text-center font-mono" style={{ color: "#F59E0B" }}>
            +20 XP — Pull-Up circuit mastered!
          </motion.p>
        )}
      </div>
    </section>
  );
}
