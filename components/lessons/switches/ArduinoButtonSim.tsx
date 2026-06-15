"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

interface Props {
  onArduinoUsed: () => void;
}

const codeSnippet = `// Arduino Button → LED
const int BTN = 2;
const int LED = 13;

void setup() {
  pinMode(BTN, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(BTN) == LOW) {
    digitalWrite(LED, HIGH);
    Serial.println("Button Pressed! LED ON");
  } else {
    digitalWrite(LED, LOW);
    Serial.println("Released. LED OFF");
  }
}`;

export default function ArduinoButtonSim({ onArduinoUsed }: Props) {
  const [pressed, setPressed] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [log, setLog] = useState<string[]>(["Serial Monitor ready..."]);

  const handlePress = () => {
    setPressed(true);
    if (!triggered) { setTriggered(true); onArduinoUsed(); }
    setLog((prev) => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] Button Pressed! LED ON`]);
  };

  const handleRelease = () => {
    setPressed(false);
    setLog((prev) => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] Released. LED OFF`]);
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
          Section 8 · Simulation 5
        </p>
        <h2 className="text-xl font-bold mb-1">Arduino Button Simulator</h2>
        <p className="text-sm text-white/40 mb-6">Press the button to simulate a digital input on Pin 2 controlling LED on Pin 13.</p>

        <div className="max-w-3xl">
          {/* Code toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCode((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
              style={{
                background: showCode ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                borderColor: showCode ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.1)",
                color: showCode ? CYAN : "rgba(255,255,255,0.4)",
              }}
            >
              <span>{"</>"}</span>
              <span>{showCode ? "Hide Code" : "View Code"}</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Arduino board visual */}
            <div className="flex-1 rounded-2xl border overflow-hidden" style={{ background: "rgba(8,20,12,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="p-4">
                <p className="text-[9px] font-mono text-white/20 mb-3 uppercase tracking-widest">Arduino Uno Simulation</p>

                {/* Arduino board outline */}
                <svg width="100%" viewBox="0 0 280 180" style={{ display: "block" }}>
                  {/* Board */}
                  <rect x="10" y="10" width="260" height="160" rx="8" fill="rgba(0,80,30,0.4)" stroke="rgba(0,120,50,0.5)" strokeWidth="2" />
                  <text x="50" y="25" fontSize="8" fill="rgba(255,255,255,0.2)" fontFamily="monospace" fontWeight="bold">ARDUINO UNO</text>

                  {/* USB port */}
                  <rect x="10" y="60" width="16" height="40" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <text x="18" y="88" fontSize="6" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">USB</text>

                  {/* Digital pins row */}
                  <text x="220" y="22" fontSize="7" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">DIGITAL</text>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((pin, i) => {
                    const px = 30 + i * 18;
                    const isPin2 = pin === 2;
                    const isPin13 = pin === 13;
                    const active = isPin2 ? pressed : isPin13 ? pressed : false;
                    return (
                      <g key={pin}>
                        <rect x={px - 4} y="28" width="8" height="14" rx="1" fill={active ? (isPin13 ? "rgba(251,191,36,0.7)" : CYAN) : "rgba(255,255,255,0.1)"} />
                        <text x={px} y="53" fontSize="6" fill={isPin2 || isPin13 ? (active ? (isPin2 ? CYAN : "rgba(251,191,36,0.8)") : "rgba(255,255,255,0.35)") : "rgba(255,255,255,0.15)"} textAnchor="middle" fontFamily="monospace">{pin}</text>
                      </g>
                    );
                  })}

                  {/* Breadboard area (simplified) */}
                  <rect x="30" y="70" width="200" height="80" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <text x="130" y="83" fontSize="7" fill="rgba(255,255,255,0.15)" textAnchor="middle" fontFamily="monospace">BREADBOARD</text>

                  {/* Push button on breadboard */}
                  <rect x="85" y="90" width="30" height="30" rx="3" fill={pressed ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"} stroke={pressed ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.12)"} strokeWidth="1.5" />
                  <circle cx="100" cy="105" r="8" fill={pressed ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.15)"} />
                  <text x="100" y="130" fontSize="7" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">BTN P2</text>

                  {/* LED on breadboard */}
                  <circle cx="170" cy="105" r="10" fill={pressed ? "rgba(251,191,36,0.85)" : "rgba(255,255,255,0.05)"} stroke={pressed ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" />
                  {pressed && <circle cx="170" cy="105" r="16" fill="rgba(251,191,36,0.15)" />}
                  <text x="170" y="130" fontSize="7" fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">LED P13</text>

                  {/* Wires */}
                  {/* BTN Pin2 wire */}
                  <path d="M 57 42 L 57 65 L 85 65 L 85 90" stroke={pressed ? CYAN : "rgba(255,255,255,0.1)"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* LED Pin13 wire */}
                  <path d="M 246 42 L 246 65 L 195 65 L 195 90 L 170 90" stroke={pressed ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* GND wire from BTN */}
                  <path d="M 115 105 L 130 105 L 130 155 L 30 155" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                  <text x="22" y="158" fontSize="6" fill="rgba(255,255,255,0.15)" fontFamily="monospace">GND</text>

                  {/* Pin state labels */}
                  <text x="57" y="20" fontSize="7" fill={pressed ? CYAN : "rgba(255,255,255,0.2)"} textAnchor="middle" fontFamily="monospace">
                    {pressed ? "LOW" : "HIGH"}
                  </text>
                  <text x="246" y="20" fontSize="7" fill={pressed ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.2)"} textAnchor="middle" fontFamily="monospace">
                    {pressed ? "HIGH" : "LOW"}
                  </text>
                </svg>
              </div>
            </div>

            {/* Right panel: button + serial */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              {/* Big button */}
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest">Pin 2 Button</p>
                <button
                  onMouseDown={handlePress}
                  onMouseUp={handleRelease}
                  onMouseLeave={handleRelease}
                  onTouchStart={handlePress}
                  onTouchEnd={handleRelease}
                  className="w-16 h-16 rounded-full border-2 transition-all duration-100 font-black text-sm select-none"
                  style={{
                    background: pressed ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.1)",
                    borderColor: pressed ? "rgba(245,158,11,0.9)" : "rgba(255,255,255,0.2)",
                    color: pressed ? "#fff" : "rgba(255,255,255,0.4)",
                    boxShadow: pressed ? "0 2px 0 rgba(0,0,0,0.3)" : "0 4px 0 rgba(0,0,0,0.4)",
                    transform: pressed ? "translateY(2px)" : "translateY(0)",
                  }}
                >
                  BTN
                </button>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full transition-all duration-200"
                    style={{
                      background: pressed ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.1)",
                      boxShadow: pressed ? "0 0 8px rgba(251,191,36,0.6)" : "none",
                    }}
                  />
                  <p className="text-[10px] font-mono" style={{ color: pressed ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.25)" }}>
                    LED {pressed ? "ON" : "OFF"}
                  </p>
                </div>
                <div
                  className="w-full p-2 rounded-lg text-center text-[10px] font-bold border"
                  style={{
                    background: pressed ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                    borderColor: pressed ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)",
                    color: pressed ? "#10B981" : "rgba(255,255,255,0.25)",
                  }}
                >
                  Pin 2: {pressed ? "LOW (GND)" : "HIGH (5V)"}
                </div>
              </div>

              {/* Serial monitor */}
              <div className="flex-1 rounded-2xl border overflow-hidden" style={{ background: "rgba(5,5,8,0.95)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-[9px] font-mono text-white/30">Serial Monitor · 9600 baud</p>
                </div>
                <div className="p-2 font-mono text-[9px] space-y-0.5" style={{ color: "#10B981" }}>
                  {log.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="leading-relaxed"
                      style={{ color: i === log.length - 1 ? "#10B981" : "rgba(16,185,129,0.4)" }}
                    >
                      {line}
                    </motion.p>
                  ))}
                  <p className="animate-pulse">▊</p>
                </div>
              </div>
            </div>
          </div>

          {/* Code view */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(5,5,8,0.95)", borderColor: "rgba(6,182,212,0.2)" }}>
                  <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(6,182,212,0.15)" }}>
                    <span className="text-[9px] font-mono" style={{ color: CYAN }}>sketch.ino</span>
                  </div>
                  <pre className="p-4 text-[11px] font-mono overflow-x-auto leading-relaxed" style={{ color: "rgba(240,240,245,0.7)" }}>
                    <code>{codeSnippet}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!triggered && (
            <p className="text-center text-xs text-white/30 mt-3">Press the BTN button to earn XP</p>
          )}
          {triggered && (
            <p className="text-center text-xs mt-3" style={{ color: CYAN }}>+15 XP earned! Toggle the Code View to see the sketch.</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
