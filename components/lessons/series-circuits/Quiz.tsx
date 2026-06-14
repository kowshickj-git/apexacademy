"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizProps {
  onPass: () => void;
}

interface Question {
  id: number;
  level: "beginner" | "intermediate" | "advanced";
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  // BEGINNER (10)
  {
    id: 1, level: "beginner",
    q: "In a series circuit, current flows through:",
    options: ["Multiple paths", "Only one path", "Random paths", "No path"],
    correct: 1,
    explanation: "A series circuit has only ONE current path. All current must travel through every component in sequence.",
  },
  {
    id: 2, level: "beginner",
    q: "If R1 = 100Ω and R2 = 200Ω are connected in series, total resistance is:",
    options: ["100Ω", "200Ω", "300Ω", "150Ω"],
    correct: 2,
    explanation: "In series, resistances simply add: R_total = R1 + R2 = 100 + 200 = 300Ω.",
  },
  {
    id: 3, level: "beginner",
    q: "In a series circuit with a 12V battery and two equal resistors, each resistor gets:",
    options: ["12V", "24V", "6V", "0V"],
    correct: 2,
    explanation: "Voltage divides equally between equal resistors: 12V ÷ 2 = 6V each. V_total = V₁ + V₂.",
  },
  {
    id: 4, level: "beginner",
    q: "If one bulb in a series string burns out (opens):",
    options: ["Only that bulb goes out", "Others get brighter", "All bulbs go out", "Nothing happens"],
    correct: 2,
    explanation: "One open circuit breaks the only current path. Zero current flows anywhere, so ALL bulbs go dark.",
  },
  {
    id: 5, level: "beginner",
    q: "The current through R1 in series with R2 is:",
    options: ["More than through R2", "Less than R2", "The same as R2", "Zero"],
    correct: 2,
    explanation: "In series, current is identical through every component: I₁ = I₂ = I_total.",
  },
  {
    id: 6, level: "beginner",
    q: "Three 10Ω resistors in series have total resistance of:",
    options: ["10Ω", "3.33Ω", "30Ω", "100Ω"],
    correct: 2,
    explanation: "R_total = R1 + R2 + R3 = 10 + 10 + 10 = 30Ω. (3.33Ω would be three 10Ω in parallel.)",
  },
  {
    id: 7, level: "beginner",
    q: "Which is a real-world example of a series circuit?",
    options: ["Home wiring", "Old Christmas lights", "Car headlights", "Computer power supply"],
    correct: 1,
    explanation: "Old incandescent Christmas lights were the classic series circuit — one failure killed the whole string.",
  },
  {
    id: 8, level: "beginner",
    q: "Voltage across a resistor in a series circuit depends primarily on:",
    options: ["Its position in circuit", "Its resistance value", "The color of the wire", "Temperature only"],
    correct: 1,
    explanation: "Voltage drop is proportional to resistance: V_Rx = I × Rx. Higher resistance → bigger voltage drop.",
  },
  {
    id: 9, level: "beginner",
    q: "If total resistance increases in a series circuit with fixed voltage, current:",
    options: ["Increases", "Stays same", "Decreases", "Doubles"],
    correct: 2,
    explanation: "Ohm's Law: I = V / R. Fixed V, increased R → current must decrease.",
  },
  {
    id: 10, level: "beginner",
    q: "A series circuit has:",
    options: ["Multiple current paths", "One current path", "No current path", "Variable current paths"],
    correct: 1,
    explanation: "By definition, a series circuit has exactly one current path. This is what makes it 'series'.",
  },
  // INTERMEDIATE (5)
  {
    id: 11, level: "intermediate",
    q: "A 9V battery powers R1 = 300Ω and R2 = 600Ω in series. Current through the circuit is:",
    options: ["30mA", "15mA", "10mA", "5mA"],
    correct: 2,
    explanation: "I = V / R_total = 9 / (300 + 600) = 9 / 900 = 0.01A = 10mA.",
  },
  {
    id: 12, level: "intermediate",
    q: "With 10mA flowing through R1 = 300Ω in the above circuit, voltage across R1 is:",
    options: ["6V", "3V", "9V", "1V"],
    correct: 1,
    explanation: "V_R1 = I × R1 = 0.01A × 300Ω = 3V. (Check: V_R2 = 0.01 × 600 = 6V, total = 3+6 = 9V ✓)",
  },
  {
    id: 13, level: "intermediate",
    q: "Four 1.5V batteries connected in series produce:",
    options: ["1.5V", "3V", "4.5V", "6V"],
    correct: 3,
    explanation: "Batteries in series: V_total = 1.5 + 1.5 + 1.5 + 1.5 = 6V. Voltages add in series.",
  },
  {
    id: 14, level: "intermediate",
    q: "A series circuit has R1 = 200Ω and R2 = 100Ω. Current is 50mA. Supply voltage is:",
    options: ["10V", "15V", "20V", "25V"],
    correct: 1,
    explanation: "V = I × R_total = 0.05A × (200 + 100)Ω = 0.05 × 300 = 15V.",
  },
  {
    id: 15, level: "intermediate",
    q: "A 12V source with R1 = 1kΩ and R2 = 2kΩ in series. Voltage across R2 is:",
    options: ["4V", "8V", "12V", "6V"],
    correct: 1,
    explanation: "Voltage divider: V_R2 = 12V × (2000 / 3000) = 12 × 0.667 = 8V. (V_R1 = 4V, total = 12V ✓)",
  },
  // ADVANCED (5)
  {
    id: 16, level: "advanced",
    q: "A 24V supply, R1, and an LED (V_f = 2V, I_f = 20mA) in series. Resistor needed to limit current to 20mA:",
    options: ["800Ω", "1000Ω", "1100Ω", "1200Ω"],
    correct: 2,
    explanation: "R = (V_supply − V_LED) / I = (24 − 2) / 0.020 = 22 / 0.020 = 1100Ω.",
  },
  {
    id: 17, level: "advanced",
    q: "Kirchhoff's Voltage Law (KVL) states:",
    options: [
      "Voltages multiply around a loop",
      "The sum of all voltages around a closed loop equals zero",
      "Current equals voltage",
      "Resistance adds in parallel",
    ],
    correct: 1,
    explanation: "KVL: ΣV = 0 around any closed loop. Source voltage rises and component drops must balance perfectly.",
  },
  {
    id: 18, level: "advanced",
    q: "Resistors 100Ω, 200Ω, 300Ω in series with 12V. Power dissipated by the 200Ω resistor is:",
    options: ["48mW", "96mW", "80mW", "120mW"],
    correct: 2,
    explanation: "I = 12/600 = 20mA. P_200 = I² × R = (0.02)² × 200 = 0.0004 × 200 = 0.08W = 80mW.",
  },
  {
    id: 19, level: "advanced",
    q: "An open circuit fault in a series loop with 10 components means:",
    options: [
      "9 components still work",
      "Only the open component stops",
      "All 10 components stop",
      "Current splits around the fault",
    ],
    correct: 2,
    explanation: "One open = zero current everywhere. There is only ONE path, so breaking it anywhere stops all current.",
  },
  {
    id: 20, level: "advanced",
    q: "Voltage divider: R1 = 470Ω and R2 = 1000Ω in series with 5V supply. Output voltage across R2 is approximately:",
    options: ["1.6V", "2.1V", "3.4V", "4.2V"],
    correct: 2,
    explanation: "V_R2 = 5V × (1000 / (470 + 1000)) = 5 × (1000 / 1470) = 5 × 0.680 ≈ 3.4V.",
  },
];

const PASS_THRESHOLD = 14;

const LEVEL_COLORS = {
  beginner: "#10B981",
  intermediate: "#F97316",
  advanced: "#ef4444",
};

export default function Quiz({ onPass }: QuizProps) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(20).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const passedRef = useRef(false);

  const q = QUESTIONS[current];
  const answered = answers[current];
  const isCorrect = answered === q.correct;
  const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const passed = score >= PASS_THRESHOLD;

  const handleAnswer = (optIdx: number) => {
    if (answered !== null) return;
    const next = [...answers];
    next[current] = optIdx;
    setAnswers(next);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setCurrent((c) => c + 1);
  };

  const handleFinish = () => {
    setFinished(true);
    const finalScore = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
    if (finalScore >= PASS_THRESHOLD && !passedRef.current) {
      passedRef.current = true;
      onPass();
    }
  };

  const handleRetry = () => {
    setAnswers(Array(20).fill(null));
    setCurrent(0);
    setShowExplanation(false);
    setFinished(false);
    passedRef.current = false;
  };

  // When finishing last question
  useEffect(() => {
    if (finished) {
      const finalScore = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
      if (finalScore >= PASS_THRESHOLD && !passedRef.current) {
        passedRef.current = true;
        onPass();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (!started) {
    return (
      <section className="px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="rounded-3xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.25)" }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-black mb-2" style={{ color: "#F0F0F5" }}>
              Series Circuits Quiz
            </h2>
            <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
              20 questions · Pass with 14/20 correct · +50 XP
            </p>
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
                <span style={{ color: "rgba(240,240,245,0.5)" }}>10 Beginner</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: "#F97316" }} />
                <span style={{ color: "rgba(240,240,245,0.5)" }}>5 Intermediate</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
                <span style={{ color: "rgba(240,240,245,0.5)" }}>5 Advanced</span>
              </div>
            </div>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-3 rounded-2xl font-black text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #F97316, #FB923C)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
              }}
            >
              Start Quiz →
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  if (finished) {
    const finalScore = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
    const finalPassed = finalScore >= PASS_THRESHOLD;
    return (
      <section className="px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: finalPassed ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
              border: finalPassed ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <div className="text-5xl mb-4">{finalPassed ? "🏆" : "📚"}</div>
            <h2 className="text-2xl font-black mb-2" style={{ color: finalPassed ? "#10B981" : "#ef4444" }}>
              {finalPassed ? "Quiz Passed!" : "Keep Practicing!"}
            </h2>
            <div className="text-5xl font-black my-4" style={{ color: finalPassed ? "#10B981" : "#ef4444" }}>
              {finalScore}/20
            </div>
            <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.55)" }}>
              {finalPassed
                ? `Excellent! You scored ${finalScore}/20 — well above the ${PASS_THRESHOLD}/20 threshold. +50 XP earned!`
                : `You scored ${finalScore}/20. You need ${PASS_THRESHOLD}/20 to pass. Review the Key Takeaways section and try again.`}
            </p>

            {/* Score bar */}
            <div className="h-3 rounded-full mb-6 mx-auto max-w-xs" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: finalPassed ? "#10B981" : "#ef4444" }}
                initial={{ width: 0 }}
                animate={{ width: `${(finalScore / 20) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {/* Per-question breakdown */}
            <div className="flex justify-center gap-1.5 flex-wrap mb-6">
              {QUESTIONS.map((qq, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background:
                      answers[idx] === qq.correct
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(239,68,68,0.2)",
                    color: answers[idx] === qq.correct ? "#10B981" : "#ef4444",
                    border: `1px solid ${answers[idx] === qq.correct ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(240,240,245,0.7)",
                }}
              >
                ↺ Retry Quiz
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          {/* Progress header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-mono font-bold"
                style={{
                  background: `${LEVEL_COLORS[q.level]}15`,
                  color: LEVEL_COLORS[q.level],
                  border: `1px solid ${LEVEL_COLORS[q.level]}30`,
                }}
              >
                {q.level}
              </span>
              <span className="text-xs" style={{ color: "rgba(240,240,245,0.35)" }}>
                Q{current + 1} of {QUESTIONS.length}
              </span>
            </div>
            <div className="text-sm font-bold" style={{ color: "#10B981" }}>
              {answers.filter((a, i) => a !== null && a === QUESTIONS[i].correct).length} correct
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#F97316,#FB923C)" }}
              animate={{ width: `${((current) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-base sm:text-lg font-bold mb-5" style={{ color: "#F0F0F5" }}>
                {q.q}
              </h3>

              {/* Options */}
              <div className="flex flex-col gap-2.5 mb-5">
                {q.options.map((opt, idx) => {
                  const isSelected = answered === idx;
                  const isRight = idx === q.correct;
                  let bg = "rgba(255,255,255,0.04)";
                  let border = "rgba(255,255,255,0.1)";
                  let textColor = "rgba(240,240,245,0.7)";

                  if (answered !== null) {
                    if (isRight) {
                      bg = "rgba(16,185,129,0.12)";
                      border = "#10B981";
                      textColor = "#10B981";
                    } else if (isSelected && !isRight) {
                      bg = "rgba(239,68,68,0.1)";
                      border = "#ef4444";
                      textColor = "#ef4444";
                    } else {
                      bg = "rgba(255,255,255,0.02)";
                      textColor = "rgba(240,240,245,0.3)";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered !== null}
                      className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 w-full"
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        color: textColor,
                        cursor: answered !== null ? "default" : "pointer",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                        style={{
                          background:
                            answered !== null && isRight
                              ? "rgba(16,185,129,0.2)"
                              : answered !== null && isSelected && !isRight
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(255,255,255,0.08)",
                          color: textColor,
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm font-medium leading-snug">{opt}</span>
                      {answered !== null && isRight && (
                        <span className="ml-auto text-sm">✓</span>
                      )}
                      {answered !== null && isSelected && !isRight && (
                        <span className="ml-auto text-sm">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl p-4 mb-4"
                    style={{
                      background: isCorrect ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
                      border: `1px solid ${isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-black" style={{ color: isCorrect ? "#10B981" : "#ef4444" }}>
                        {isCorrect ? "✓ Correct!" : "✕ Incorrect"}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "rgba(240,240,245,0.65)" }}>
                      {q.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {answered !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end"
                >
                  <button
                    onClick={current < QUESTIONS.length - 1 ? handleNext : handleFinish}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={{
                      background: "linear-gradient(135deg, #F97316, #FB923C)",
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
                    }}
                  >
                    {current < QUESTIONS.length - 1 ? "Next Question →" : "See Results →"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
