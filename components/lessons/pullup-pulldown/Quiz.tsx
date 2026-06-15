"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPass: () => void;
}

const questions = [
  // BEGINNER Q1-10
  {
    q: "A floating input pin has:",
    options: ["Stable voltage", "Undefined voltage", "Exactly 0V", "Exactly 5V"],
    correct: 1,
    explain: "A floating pin has NO defined voltage — it drifts based on electromagnetic interference, nearby signals, and capacitive coupling. This causes random HIGH/LOW readings.",
  },
  {
    q: "A pull-up resistor connects:",
    options: ["GND to pin", "Vcc to pin", "Pin to pin", "Output to input"],
    correct: 1,
    explain: "Pull-up = Vcc → R → Pin. The resistor 'pulls up' the pin to the supply voltage (HIGH) when no active signal drives it low.",
  },
  {
    q: "With pull-up + button NOT pressed, the default pin state is:",
    options: ["LOW", "HIGH", "Floating", "Unknown"],
    correct: 1,
    explain: "With button open, no path to GND through the button. The pull-up resistor holds the pin firmly at Vcc (HIGH).",
  },
  {
    q: "With pull-up + button pressed (to GND), the pin reads:",
    options: ["HIGH", "LOW", "Floating", "Vcc"],
    correct: 1,
    explain: "Pressing connects the junction to GND. The GND short-circuit wins over the pull-up resistor. Pin goes LOW (0V).",
  },
  {
    q: "`INPUT_PULLUP` in Arduino requires:",
    options: ["An external resistor", "No external resistor", "Two resistors", "A pull-down too"],
    correct: 1,
    explain: "`INPUT_PULLUP` activates the MCU's internal pull-up (~20–50kΩ). No external component needed — saves PCB space and BOM cost.",
  },
  {
    q: "Typical pull-up/pull-down resistor value is:",
    options: ["100Ω", "1kΩ", "10kΩ", "1MΩ"],
    correct: 2,
    explain: "10kΩ is the standard. Low enough to hold the pin reliably, high enough not to waste significant power (0.33mA at 3.3V).",
  },
  {
    q: "A pull-down resistor connects:",
    options: ["Vcc to pin", "Pin to GND", "Pin to Vcc", "GND to GND"],
    correct: 1,
    explain: "Pull-down = Pin → R → GND. The resistor 'pulls down' the pin to 0V (LOW) when no active signal drives it high.",
  },
  {
    q: "With pull-down + button NOT pressed, the default state is:",
    options: ["HIGH", "LOW", "Floating", "Unknown"],
    correct: 1,
    explain: "With button open, the pull-down holds the pin at GND (0V). No path to Vcc through the open button, so pin = LOW.",
  },
  {
    q: "Floating pins can cause:",
    options: ["Faster operation", "Random HIGH/LOW behavior", "Lower power consumption", "Better accuracy"],
    correct: 1,
    explain: "Without a defined voltage, floating pins pick up noise and give completely unpredictable digital readings. This can corrupt data, trigger spurious interrupts, and cause system resets.",
  },
  {
    q: "Internal pull-ups in Arduino/ESP32 are approximately:",
    options: ["100Ω", "1kΩ", "10kΩ", "20–50kΩ"],
    correct: 3,
    explain: "Arduino Uno uses ~30–50kΩ internal pull-ups. ESP32 has configurable pull-ups around 45kΩ. These are weaker than the typical 10kΩ external pull-up.",
  },
  // INTERMEDIATE Q11-15
  {
    q: "Pull-up R = 10kΩ, Vcc = 3.3V, button pressed (connects to GND). Current through resistor:",
    options: ["0 mA", "0.33 mA", "3.3 mA", "33 mA"],
    correct: 1,
    explain: "I = V/R = 3.3V / 10,000Ω = 0.00033A = 0.33mA. This flows from Vcc through the resistor to GND when button is pressed.",
  },
  {
    q: "Why is a 100Ω pull-up NOT recommended?",
    options: ["Too noisy", "Wastes ~50mA when button is pressed", "Too slow response", "Not compatible with MCUs"],
    correct: 1,
    explain: "I = 5V / 100Ω = 50mA. Most MCU GPIO pins can only sink 20–40mA. 50mA can damage the pin or chip. Even if it doesn't break, 50mA is wasteful.",
  },
  {
    q: "An ESP32 reads a floating GPIO as:",
    options: ["Always 0", "Always 1", "Random/unpredictable values", "Always 3.3V"],
    correct: 2,
    explain: "Without a defined voltage, a floating GPIO picks up environmental noise and gives unpredictable readings. On ESP32 this can also trigger false interrupts and cause mysterious resets.",
  },
  {
    q: "An active-LOW sensor outputs 0V when triggered. Best pull configuration:",
    options: ["Pull-down", "Pull-up", "No pull needed", "Both pull-up and pull-down"],
    correct: 1,
    explain: "An active-LOW sensor pulls the line LOW when triggered. You need a pull-UP to define the 'idle/not triggered' state as HIGH. Without pull-up, the idle state is floating.",
  },
  {
    q: "`digitalRead()` returns LOW with `INPUT_PULLUP` and button pressed because:",
    options: [
      "It's a bug in Arduino",
      "The button connects pin to GND, overriding the pull-up",
      "Voltage is too high for the ADC",
      "Wrong pin mode was set",
    ],
    correct: 1,
    explain: "Pressing connects the pin to GND. The GND potential (0V) overrides the internal pull-up. The MCU reads LOW. This is intentional inverted logic — the pull-up defines the 'rest' state as HIGH.",
  },
  // ADVANCED Q16-20
  {
    q: "PCB design: what is wrong with using a 1MΩ pull-up?",
    options: [
      "Too expensive",
      "Slow rise time and more susceptible to noise pickup",
      "Consumes too much power",
      "Wrong resistor type for digital signals",
    ],
    correct: 1,
    explain: "1MΩ creates a very weak pull. Rise time RC = 1MΩ × 10pF (trace cap) = 10μs — too slow for fast signals. Also, the weak pull is overwhelmed by small leakage currents and RF noise pickup.",
  },
  {
    q: "Internal pull-up on a 5V Arduino: assuming 47kΩ internal resistance, how much current flows when pin is LOW?",
    options: ["0.1 mA", "0.106 mA", "1 mA", "5 mA"],
    correct: 1,
    explain: "I = 5V / 47,000Ω = 0.0001064A ≈ 0.106mA. This is the quiescent current drawn when something holds the pin LOW while internal pull-up is active.",
  },
  {
    q: "A Hall-effect sensor has open-collector output. Required external component:",
    options: ["Pull-down resistor", "Pull-up resistor", "Capacitor", "Nothing extra needed"],
    correct: 1,
    explain: "Open-collector (open-drain) outputs can only pull LOW — they cannot drive HIGH. A pull-up resistor defines the HIGH state. Without it, HIGH is undefined (floating).",
  },
  {
    q: "Schmitt trigger input on a GPIO pin reduces the need for:",
    options: [
      "Pull-up resistors",
      "Power supply",
      "External debounce capacitor",
      "Microcontroller entirely",
    ],
    correct: 2,
    explain: "Schmitt trigger has hysteresis — it snaps cleanly between HIGH/LOW states without bouncing on slow-transitioning signals. This reduces (but doesn't eliminate) the need for RC debounce capacitors on mechanical buttons.",
  },
  {
    q: "STM32 GPIO pull-up strength — the 'weak' internal pull-up is approximately:",
    options: ["100kΩ", "~40kΩ", "1kΩ", "10kΩ"],
    correct: 1,
    explain: "STM32 internal pull-up/pull-down resistors are typically 30–50kΩ (varies by part). The STM32 reference manual lists ~40kΩ typical. This is configurable in STM32CubeMX GPIO settings.",
  },
];

export default function Quiz({ onPass }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passTriggered, setPassTriggered] = useState(false);

  const PASS_THRESHOLD = 14;

  const handleSelect = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers(prev => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const handleSubmit = () => {
    const s = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0);
    setScore(s);
    setSubmitted(true);
    if (s >= PASS_THRESHOLD && !passTriggered) {
      setPassTriggered(true);
      onPass();
    }
  };

  const handleRetry = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  const allAnswered = answers.every(a => a !== null);
  const passed = submitted && score >= PASS_THRESHOLD;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 9 · Quiz
        </p>
        <h2 className="text-xl font-bold mb-1">Pull-Up &amp; Pull-Down Quiz</h2>
        <p className="text-white/45 text-sm mb-4">
          20 questions — pass at 14/20 (70%) to earn{" "}
          <span style={{ color: "#F59E0B" }}>+50 XP</span>
        </p>

        {/* Score banner */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-4 rounded-2xl border text-center"
              style={{
                borderColor: passed ? "rgba(245,158,11,0.4)" : "rgba(239,68,68,0.35)",
                background: passed ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.07)",
              }}
            >
              <p className="text-2xl font-black mb-1" style={{ color: passed ? "#F59E0B" : "#EF4444" }}>
                {score}/20
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: passed ? "#F59E0B" : "#EF4444" }}>
                {passed ? "Passed! +50 XP earned" : `Not yet — need ${PASS_THRESHOLD - score} more correct`}
              </p>
              {!passed && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-white/50 hover:text-white/70 hover:border-white/20 transition-all"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  Try Again →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions */}
        <div className="space-y-5 mb-6">
          {questions.map((q, qi) => {
            const userAnswer = answers[qi];
            const isCorrect = submitted && userAnswer === q.correct;
            const isWrong = submitted && userAnswer !== null && userAnswer !== q.correct;
            const isBeginner = qi < 10;
            const isIntermediate = qi >= 10 && qi < 15;

            return (
              <div key={qi} className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono text-white/20">Q{qi + 1}</span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                      style={{
                        background: isBeginner
                          ? "rgba(245,158,11,0.1)"
                          : isIntermediate
                          ? "rgba(14,165,233,0.1)"
                          : "rgba(251,146,60,0.1)",
                        color: isBeginner
                          ? "#F59E0B"
                          : isIntermediate
                          ? "#0EA5E9"
                          : "#FB923C",
                      }}
                    >
                      {isBeginner ? "Beginner" : isIntermediate ? "Intermediate" : "Advanced"}
                    </span>
                    {submitted && (
                      <span className="ml-auto text-sm">{isCorrect ? "✅" : "❌"}</span>
                    )}
                  </div>
                  <p className="text-sm text-white/85 font-medium leading-relaxed">{q.q}</p>
                </div>

                <div className="px-4 pb-3 grid gap-1.5">
                  {q.options.map((opt, oi) => {
                    let style: React.CSSProperties = {
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.6)",
                    };
                    if (submitted) {
                      if (oi === q.correct) {
                        style = { background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.4)", color: "#F59E0B" };
                      } else if (oi === userAnswer && oi !== q.correct) {
                        style = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" };
                      }
                    } else if (userAnswer === oi) {
                      style = { background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "rgba(255,255,255,0.85)" };
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelect(qi, oi)}
                        disabled={submitted}
                        className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all disabled:cursor-default hover:opacity-90"
                        style={style}
                      >
                        <span className="font-mono text-[10px] opacity-50 mr-2">
                          {["A", "B", "C", "D"][oi]}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25, delay: qi * 0.02 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4 pt-2 border-t border-white/5"
                        style={{
                          background: isCorrect
                            ? "rgba(245,158,11,0.04)"
                            : isWrong
                            ? "rgba(239,68,68,0.04)"
                            : "transparent",
                        }}
                      >
                        <p className="text-[11px] leading-relaxed text-white/40">{q.explain}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: allAnswered ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${allAnswered ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: allAnswered ? "#F59E0B" : "rgba(255,255,255,0.3)",
            }}
          >
            {allAnswered ? "Submit Quiz →" : `Answer all ${questions.length} questions to submit`}
          </button>
        )}

        {submitted && passed && (
          <div
            className="w-full py-3 rounded-xl font-bold text-sm text-center"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}
          >
            Quiz Passed! +50 XP earned
          </div>
        )}
      </div>
    </section>
  );
}
