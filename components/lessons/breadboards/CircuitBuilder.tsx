"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onCircuitBuilt: () => void;
}

interface StepInfo {
  title: string;
  instruction: string;
  detail: string;
  btnLabel: string;
  currentPath: string;
}

const steps: StepInfo[] = [
  {
    title: "Step 1: Connect the Battery",
    instruction: "Connect battery + to the + power rail, and battery − to the − power rail.",
    detail: "Power rails distribute voltage to the entire board. Red = positive (+9V), Blue = ground (0V).",
    btnLabel: "Place Battery ✓",
    currentPath: "No current yet — circuit not complete.",
  },
  {
    title: "Step 2: Add a Current-Limiting Resistor",
    instruction: "Place a 220Ω resistor bridging row 1 (hole A1) to row 5 (hole A5).",
    detail: "The resistor limits current to protect the LED. Without it, the LED would burn out instantly.",
    btnLabel: "Place Resistor ✓",
    currentPath: "Battery + → + rail → (via wire) → Row 1 → Resistor → Row 5 → (next: LED).",
  },
  {
    title: "Step 3: Add the LED",
    instruction: "Insert the LED: anode (longer leg) into row 5, cathode (shorter leg) into row 8.",
    detail: "The anode connects after the resistor. The cathode connects down toward ground via row 8 → − rail.",
    btnLabel: "Place LED ✓",
    currentPath: "Battery + → + rail → wire → R1 → LED (anode→cathode) → − rail → Battery −",
  },
];

interface PlacedComponents {
  battery: boolean;
  resistor: boolean;
  led: boolean;
}

const ROW_COUNT = 10;
const COL_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export default function CircuitBuilder({ onCircuitBuilt }: Props) {
  const [step, setStep] = useState(0); // 0 = not started, 1–3 = steps, 4 = done
  const [components, setComponents] = useState<PlacedComponents>({
    battery: false,
    resistor: false,
    led: false,
  });
  const [done, setDone] = useState(false);

  const handleStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setComponents((c) => ({ ...c, battery: true }));
      setStep(2);
    } else if (step === 2) {
      setComponents((c) => ({ ...c, resistor: true }));
      setStep(3);
    } else if (step === 3) {
      setComponents((c) => ({ ...c, led: true }));
      setStep(4);
      setDone(true);
      onCircuitBuilt();
    }
  };

  const getHoleContent = (row: number, col: string) => {
    // Battery wires on col A, rows 1 and 10 (power rails)
    if (components.battery && row === 1 && col === "A") return "wire-pos";
    if (components.battery && row === 10 && col === "A") return "wire-neg";
    // Resistor: A1 to A5
    if (components.resistor && row === 1 && col === "A") return "resistor-top";
    if (components.resistor && row === 5 && col === "A") return "resistor-bot";
    // LED: A5 anode, A8 cathode
    if (components.led && row === 5 && col === "A") return "led-anode";
    if (components.led && row === 8 && col === "A") return "led-cathode";
    return null;
  };

  const getHoleStyle = (content: string | null, row: number) => {
    if (content === "wire-pos") return { background: "rgba(239,68,68,0.7)", border: "1px solid #EF4444" };
    if (content === "wire-neg") return { background: "rgba(59,130,246,0.7)", border: "1px solid #3B82F6" };
    if (content === "resistor-top" || content === "resistor-bot")
      return { background: "rgba(251,191,36,0.7)", border: "1px solid #FBBF24" };
    if (content === "led-anode") return { background: done ? "rgba(250,204,21,0.9)" : "rgba(239,68,68,0.7)", border: `1px solid ${done ? "#FBBF24" : "#EF4444"}`, boxShadow: done ? "0 0 8px rgba(250,204,21,0.7)" : "none" };
    if (content === "led-cathode") return { background: "rgba(156,163,175,0.5)", border: "1px solid #9CA3AF" };
    // Row-based coloring for active circuit
    if (done && row >= 1 && row <= 8 && row !== 9 && row !== 10) {
      return { background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.2)" };
    }
    return { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" };
  };

  const currentStepInfo = step >= 1 && step <= 3 ? steps[step - 1] : null;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 5 · Simulator 4
        </p>
        <h2 className="text-xl font-bold mb-1">Circuit Builder</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Build an LED circuit step by step. Follow the instructions and watch the breadboard update in real time.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Mini breadboard */}
          <div
            className="rounded-2xl border border-white/8 p-3"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {/* + rail */}
            <div className="h-4 rounded-t mb-1 flex items-center px-1" style={{ background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.25)" }}>
              {components.battery && <div className="w-2 h-2 rounded-full ml-1" style={{ background: "#EF4444", boxShadow: "0 0 6px #EF4444" }} />}
              <span className="text-[8px] text-red-400/50 ml-auto font-mono">+</span>
            </div>

            {/* Terminal rows */}
            <div className="grid gap-0.5 my-1">
              {Array.from({ length: ROW_COUNT }).map((_, ri) => {
                const row = ri + 1;
                return (
                  <div key={row} className="flex items-center gap-0.5">
                    <span className="text-[7px] text-white/15 w-3 text-right font-mono">{row}</span>
                    {COL_LABELS.slice(0, 5).map((col) => {
                      const content = getHoleContent(row, col);
                      return (
                        <div
                          key={col}
                          className="w-3.5 h-3.5 rounded-full transition-all duration-300"
                          style={getHoleStyle(content, row)}
                        />
                      );
                    })}
                    <div className="w-2" />
                    {COL_LABELS.slice(5).map((col) => (
                      <div
                        key={col}
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>

            {/* − rail */}
            <div className="h-4 rounded-b flex items-center px-1" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}>
              {components.battery && <div className="w-2 h-2 rounded-full ml-1" style={{ background: "#3B82F6", boxShadow: "0 0 6px #3B82F6" }} />}
              <span className="text-[8px] text-blue-400/50 ml-auto font-mono">−</span>
            </div>

            {/* Component legend */}
            {(components.battery || components.resistor || components.led) && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {components.battery && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#F87171" }}>🔋 Battery</span>
                )}
                {components.resistor && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.15)", color: "#FCD34D" }}>⬜ 220Ω</span>
                )}
                {components.led && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: done ? "rgba(250,204,21,0.2)" : "rgba(239,68,68,0.15)", color: done ? "#FDE68A" : "#F87171" }}>
                    {done ? "💡 LED (ON)" : "LED (off)"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Instructions panel */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 rounded-2xl border p-4 flex flex-col items-center justify-center text-center gap-3"
                  style={{ borderColor: "rgba(250,204,21,0.3)", background: "rgba(250,204,21,0.06)" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                    style={{ background: "rgba(250,204,21,0.15)", boxShadow: "0 0 20px rgba(250,204,21,0.3)" }}
                  >
                    💡
                  </motion.div>
                  <div>
                    <p className="font-bold text-sm mb-0.5" style={{ color: "#FDE68A" }}>Circuit Complete!</p>
                    <p className="text-[11px] text-white/45">Your LED circuit is working. Current flows: Battery → Resistor → LED → Ground</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {["✓ Battery", "✓ Resistor", "✓ LED"].map((b) => (
                      <span key={b} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(20,184,166,0.15)", color: "#14B8A6" }}>{b}</span>
                    ))}
                  </div>
                </motion.div>
              ) : step === 0 ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 rounded-2xl border border-white/8 p-4 flex flex-col items-center justify-center text-center gap-3"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="text-3xl">🔧</div>
                  <p className="text-sm font-bold text-white/70">Ready to build?</p>
                  <p className="text-[11px] text-white/35">Follow 3 steps to build a working LED circuit on a breadboard.</p>
                </motion.div>
              ) : currentStepInfo ? (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 rounded-2xl border border-white/8 p-4 flex flex-col gap-3"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-[9px] font-mono text-white/25">Step {step} of 3</p>
                  <p className="text-sm font-bold text-white/90">{currentStepInfo.title}</p>
                  <p className="text-xs text-white/55 leading-relaxed">{currentStepInfo.instruction}</p>
                  <div
                    className="p-2.5 rounded-lg border border-white/5 text-[10px] text-white/35 leading-relaxed"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    {currentStepInfo.detail}
                  </div>
                  <div
                    className="p-2 rounded-lg text-[10px] leading-relaxed"
                    style={{ background: "rgba(20,184,166,0.07)", color: "rgba(20,184,166,0.8)" }}
                  >
                    ⚡ {currentStepInfo.currentPath}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Action button */}
            <button
              onClick={handleStep}
              disabled={done}
              className="mt-3 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: done ? "rgba(20,184,166,0.1)" : "rgba(20,184,166,0.15)",
                border: "1px solid rgba(20,184,166,0.3)",
                color: "#14B8A6",
              }}
            >
              {done
                ? "✓ Complete!"
                : step === 0
                ? "Start Building →"
                : steps[step - 1].btnLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
