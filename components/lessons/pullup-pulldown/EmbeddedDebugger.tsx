"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onDebuggerUsed: () => void;
}

const scenarios = [
  {
    id: 1,
    symptom: "Button press not detected reliably",
    detail: "The MCU reads random values on the button pin. Sometimes pressing works, sometimes it doesn't.",
    options: [
      { label: "Bad firmware code", correct: false, explain: "Code looks correct — digitalRead() is used properly." },
      { label: "Floating pin — no pull-up/down resistor", correct: true, explain: "Correct! Without a pull-up or pull-down, the pin floats and picks up noise. The button press can't override an undefined voltage." },
      { label: "Wrong GPIO pin number", correct: false, explain: "The pin number is correct in both hardware and code." },
    ],
  },
  {
    id: 2,
    symptom: "LED always ON even without pressing button",
    detail: "Pull-up + normally-open button circuit. LED should turn on ONLY when button is pressed.",
    options: [
      { label: "Short circuit on PCB", correct: false, explain: "No short circuit — the board continuity checks out." },
      { label: "Normally-closed (NC) button used instead of normally-open (NO)", correct: true, explain: "Correct! An NC button with a pull-up creates a permanent low — current always flows. NC + pull-up = always LOW (LED on). Swap for NO button." },
      { label: "Wrong supply voltage", correct: false, explain: "Voltage is correct at 3.3V." },
    ],
  },
  {
    id: 3,
    symptom: "ESP32 resets randomly — no obvious cause",
    detail: "System runs fine for minutes, then spontaneously resets. Reset reason: unknown. No watchdog triggered.",
    options: [
      { label: "Insufficient power supply (voltage sag)", correct: false, explain: "Power supply is clean — measured with oscilloscope, no voltage sags." },
      { label: "Floating GPIO triggering spurious interrupt", correct: true, explain: "Correct! A floating GPIO configured as an interrupt source picks up noise. Each noise spike fires the interrupt. The ISR may corrupt state or cause a stack overflow, leading to a reset." },
      { label: "CPU overclocked too high", correct: false, explain: "Running at default 240MHz — no overclock." },
    ],
  },
];

export default function EmbeddedDebugger({ onDebuggerUsed }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [triggered, setTriggered] = useState(false);

  const handleAnswer = useCallback((scenarioIdx: number, optionIdx: number) => {
    if (revealed[scenarioIdx]) return;

    setAnswers(prev => {
      const next = [...prev];
      next[scenarioIdx] = optionIdx;
      return next;
    });
    setRevealed(prev => {
      const next = [...prev];
      next[scenarioIdx] = true;
      return next;
    });

    if (!triggered) {
      setTriggered(true);
      onDebuggerUsed();
    }
  }, [revealed, triggered, onDebuggerUsed]);

  const score = scenarios.filter((s, i) => answers[i] !== null && s.options[answers[i]!].correct).length;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 5 · Embedded Debugger
        </p>
        <h2 className="text-xl font-bold mb-1">Debug These Circuits</h2>
        <p className="text-sm text-white/45 mb-6">
          3 real-world embedded problems. Diagnose the root cause of each.
        </p>

        <div className="space-y-5">
          {scenarios.map((scenario, si) => {
            const userAnswer = answers[si];
            const isRevealed = revealed[si];

            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: si * 0.1 }}
                className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.015)" }}
              >
                {/* Symptom header */}
                <div className="px-4 py-3 border-b border-white/5" style={{ background: "rgba(239,68,68,0.06)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono text-white/25">SCENARIO {scenario.id}</span>
                    {isRevealed && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono" style={{
                        background: scenarios[si].options[userAnswer!].correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                        color: scenarios[si].options[userAnswer!].correct ? "#10B981" : "#EF4444",
                      }}>
                        {scenarios[si].options[userAnswer!].correct ? "✓ Correct" : "✗ Wrong"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-red-400">Symptom: {scenario.symptom}</p>
                  <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{scenario.detail}</p>
                </div>

                {/* Options */}
                <div className="px-4 py-3 space-y-2">
                  <p className="text-[10px] font-mono text-white/25 mb-2">What is the root cause?</p>
                  {scenario.options.map((opt, oi) => {
                    let style: React.CSSProperties = {
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.6)",
                    };
                    if (isRevealed) {
                      if (opt.correct) {
                        style = { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.35)", color: "#10B981" };
                      } else if (oi === userAnswer) {
                        style = { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#EF4444" };
                      }
                    } else if (userAnswer === oi) {
                      style = { background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "rgba(255,255,255,0.85)" };
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(si, oi)}
                        disabled={isRevealed}
                        className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all disabled:cursor-default"
                        style={style}
                      >
                        <span className="font-mono text-[10px] opacity-50 mr-2">{String.fromCharCode(65 + oi)}.</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {isRevealed && userAnswer !== null && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4 pt-2 border-t border-white/5"
                        style={{ background: scenario.options[userAnswer].correct ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)" }}
                      >
                        <p className="text-[11px] leading-relaxed text-white/50">
                          {scenario.options[userAnswer].explain}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Score */}
        {revealed.every(Boolean) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl border text-center"
            style={{
              background: score === 3 ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
              borderColor: score === 3 ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)",
            }}
          >
            <p className="text-xl font-black" style={{ color: score === 3 ? "#10B981" : "#F59E0B" }}>
              {score}/3 Diagnosed Correctly
            </p>
            <p className="text-xs text-white/40 mt-1">
              {score === 3 ? "Perfect! You think like an embedded engineer." : "Review the incorrect diagnoses above — common pitfalls in real products."}
            </p>
          </motion.div>
        )}

        {triggered && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs text-center font-mono" style={{ color: "#F59E0B" }}>
            +10 XP — Embedded debugger used!
          </motion.p>
        )}
      </div>
    </section>
  );
}
