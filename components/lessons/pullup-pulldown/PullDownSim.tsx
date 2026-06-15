"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPulldownUsed: () => void;
}

export default function PullDownSim({ onPulldownUsed }: Props) {
  const [pressed, setPressed] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const handlePress = useCallback(() => {
    setPressed(true);
    if (!triggered) {
      setTriggered(true);
      onPulldownUsed();
    }
  }, [triggered, onPulldownUsed]);

  const pinVoltage = pressed ? 3.3 : 0;
  const pinState = pressed ? "HIGH" : "LOW";
  const currentmA = pressed ? 0.33 : 0;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 3 · Pull-Down Resistor
        </p>
        <h2 className="text-xl font-bold mb-1">Pull-Down Circuit Simulator</h2>
        <p className="text-sm text-white/45 mb-6">
          Pin → 10kΩ → GND. Button from pin to Vcc (3.3V). Press to go HIGH.
        </p>

        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(0,0,0,0.25)" }}>
          {/* SVG circuit */}
          <div className="p-5 border-b border-white/5">
            <svg viewBox="0 0 340 200" className="w-full">
              {/* Vcc at top left (button connects here) */}
              <text x="60" y="18" textAnchor="middle" fontSize="11" fill="#F59E0B" fontFamily="monospace" fontWeight="bold">Vcc 3.3V</text>
              <line x1="60" y1="22" x2="60" y2="55" stroke="rgba(245,158,11,0.3)" strokeWidth="2" />

              {/* Button */}
              <line x1="40" y1="57" x2="80" y2="57" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              {!pressed
                ? <line x1="54" y1="59" x2="66" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                : <line x1="60" y1="57" x2="60" y2="67" stroke="#10B981" strokeWidth="2.5" />
              }
              <line x1="40" y1="67" x2="80" y2="67" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="60" y1="67" x2="60" y2="100" stroke={pressed ? "#10B981" : "rgba(255,255,255,0.15)"} strokeWidth="2.5" />

              {/* Junction */}
              <circle cx="60" cy="100" r="5" fill={pressed ? "#10B981" : "#3B82F6"} />
              <text x="60" y="118" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="monospace">JUNCTION</text>

              {/* Junction to MCU */}
              <line x1="60" y1="100" x2="200" y2="100" stroke={pressed ? "#10B981" : "#3B82F6"} strokeWidth="2.5" />
              <rect x="200" y="82" width="60" height="36" rx="6" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5" />
              <text x="230" y="103" textAnchor="middle" fontSize="10" fill="#3B82F6" fontFamily="monospace">MCU Pin</text>

              {/* State indicator */}
              <circle cx="286" cy="100" r="8" fill={pressed ? "rgba(16,185,129,0.3)" : "rgba(59,130,246,0.3)"} stroke={pressed ? "#10B981" : "#3B82F6"} strokeWidth="1.5" />
              <text x="286" y="104" textAnchor="middle" fontSize="8" fill={pressed ? "#10B981" : "#3B82F6"} fontFamily="monospace" fontWeight="bold">{pressed ? "H" : "L"}</text>

              {/* Junction down to resistor */}
              <line x1="60" y1="100" x2="60" y2="132" stroke={pressed ? "rgba(59,130,246,0.3)" : "#3B82F6"} strokeWidth="2.5" />

              {/* Resistor */}
              <rect x="42" y="132" width="36" height="22" rx="3" fill="none" stroke={pressed ? "rgba(59,130,246,0.4)" : "#3B82F6"} strokeWidth="2" />
              <text x="60" y="146" textAnchor="middle" fontSize="9" fill={pressed ? "rgba(59,130,246,0.5)" : "#3B82F6"} fontFamily="monospace">10kΩ</text>

              {/* Resistor to GND */}
              <line x1="60" y1="154" x2="60" y2="175" stroke={pressed ? "rgba(59,130,246,0.3)" : "#3B82F6"} strokeWidth="2.5" />
              <line x1="30" y1="175" x2="90" y2="175" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="40" y1="181" x2="80" y2="181" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <line x1="50" y1="187" x2="70" y2="187" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <text x="60" y="200" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" fontFamily="monospace">GND</text>

              {/* Current animation */}
              {pressed && (
                <motion.circle
                  r="4"
                  fill="#10B981"
                  initial={{ cx: 60, cy: 22 }}
                  animate={{ cx: [60, 60, 60, 200], cy: [22, 67, 100, 100] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  opacity={0.8}
                />
              )}
              {!pressed && (
                <motion.circle
                  r="3.5"
                  fill="#3B82F6"
                  initial={{ cx: 60, cy: 100 }}
                  animate={{ cx: [60, 60, 60], cy: [100, 154, 175] }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
                  opacity={0.6}
                />
              )}
            </svg>
          </div>

          {/* State readout */}
          <div className="px-5 py-4 border-b border-white/5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pin Voltage", value: `${pinVoltage.toFixed(1)}V`, color: pressed ? "#10B981" : "#3B82F6" },
                { label: "Pin State", value: pinState, color: pressed ? "#10B981" : "#3B82F6" },
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
                <div className="px-5 py-3 border-b border-white/5" style={{ background: "rgba(16,185,129,0.04)" }}>
                  <p className="text-[10px] font-mono text-white/30 mb-1">WHEN BUTTON PRESSED (Vcc = 3.3V at junction):</p>
                  <p className="text-xs font-mono" style={{ color: "#10B981" }}>V_pin = Vcc = 3.3V (Vcc overrides pull-down)</p>
                  <p className="text-[10px] font-mono text-white/30 mt-1">I = 3.3V / 10,000Ω = 0.33mA (through R to GND)</p>
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
                background: pressed ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: pressed ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.12)",
                color: pressed ? "#10B981" : "rgba(255,255,255,0.5)",
              }}
            >
              {pressed ? "● Button PRESSED — Pin = HIGH" : "○ Hold to Press Button"}
            </button>
            <p className="text-[10px] font-mono text-white/20 text-center mt-2">
              Pull-Down logic is NORMAL: pressed = HIGH
            </p>
          </div>
        </div>

        {triggered && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs text-center font-mono" style={{ color: "#F59E0B" }}>
            +20 XP — Pull-Down circuit mastered!
          </motion.p>
        )}
      </div>
    </section>
  );
}
