"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPass: () => void;
}

interface Question {
  q: string;
  opts: string[];
  answer: number;
  explanation: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const questions: Question[] = [
  // BEGINNER (10)
  {
    level: "Beginner",
    q: "In a parallel circuit, the voltage across each branch is:",
    opts: ["A) Different for each branch", "B) Zero", "C) The same for all branches", "D) Divided equally"],
    answer: 2,
    explanation:
      "Every branch is connected directly across the supply terminals, so each branch sees the full supply voltage. V₁ = V₂ = V₃ = V_supply.",
  },
  {
    level: "Beginner",
    q: "In a parallel circuit, if one branch fails (opens), what happens?",
    opts: [
      "A) All branches fail",
      "B) Only that branch fails — others continue",
      "C) Other branches increase their voltage",
      "D) Nothing changes at all",
    ],
    answer: 1,
    explanation:
      "An open branch simply removes one current path. The supply voltage across remaining branches is unchanged, so they continue operating normally.",
  },
  {
    level: "Beginner",
    q: "Two 100Ω resistors are connected in parallel. Their equivalent resistance is:",
    opts: ["A) 200Ω", "B) 100Ω", "C) 50Ω", "D) 25Ω"],
    answer: 2,
    explanation:
      "Using product-over-sum: R_eq = (100 × 100) / (100 + 100) = 10000 / 200 = 50Ω. Two equal resistors in parallel always give R/2.",
  },
  {
    level: "Beginner",
    q: "The total current in a parallel circuit equals:",
    opts: [
      "A) The current in one branch",
      "B) Zero",
      "C) The sum of all branch currents",
      "D) The average of branch currents",
    ],
    answer: 2,
    explanation:
      "Kirchhoff's Current Law: I_total = I₁ + I₂ + I₃ + ... All branch currents add at the supply node.",
  },
  {
    level: "Beginner",
    q: "Home electrical wiring uses parallel circuits because:",
    opts: [
      "A) It is cheaper to wire",
      "B) Each device works independently at full voltage",
      "C) It uses less total current",
      "D) Bulbs are dimmer and longer lasting",
    ],
    answer: 1,
    explanation:
      "Parallel ensures every outlet receives full mains voltage (120V/230V) and each device operates independently — turning off one doesn't affect others.",
  },
  {
    level: "Beginner",
    q: "Adding another branch to a parallel circuit:",
    opts: [
      "A) Increases total resistance",
      "B) Decreases total resistance",
      "C) Has no effect on resistance",
      "D) Doubles the supply voltage",
    ],
    answer: 1,
    explanation:
      "Each new branch adds another conductance (1/R) path, increasing total conductance and thus DECREASING R_eq. R_eq will always be less than the smallest branch.",
  },
  {
    level: "Beginner",
    q: "A 12V battery has two parallel branches: R₁ = 6Ω and R₂ = 4Ω. The current in the R₁ branch is:",
    opts: ["A) 1A", "B) 2A", "C) 3A", "D) 6A"],
    answer: 1,
    explanation:
      "Each branch sees the full 12V. I₁ = V / R₁ = 12 / 6 = 2A. Branch currents are independent — R₂ doesn't affect R₁.",
  },
  {
    level: "Beginner",
    q: "In a parallel circuit with 3 branches, which branch carries the most current?",
    opts: [
      "A) The branch with highest resistance",
      "B) The branch with lowest resistance",
      "C) The branch with middle resistance",
      "D) All branches carry equal current",
    ],
    answer: 1,
    explanation:
      "I = V/R. Since voltage is the same across all branches, lower resistance means more current flows through that branch.",
  },
  {
    level: "Beginner",
    q: "Kirchhoff's Current Law (KCL) states:",
    opts: [
      "A) Voltage divides between parallel branches",
      "B) The sum of currents entering a node equals the sum leaving it",
      "C) Resistance adds directly in parallel",
      "D) Voltage multiplies at junctions",
    ],
    answer: 1,
    explanation:
      "KCL: charge is conserved. At any node, all current that flows in must flow out. In parallel: I_in = I₁ + I₂ + I₃.",
  },
  {
    level: "Beginner",
    q: "A parallel circuit is most like:",
    opts: [
      "A) A single train track",
      "B) Multiple roads where cars split at a fork",
      "C) A dead-end road",
      "D) A circuit breaker",
    ],
    answer: 1,
    explanation:
      "Multiple roads is the perfect analogy — traffic (current) splits at the fork, each road handles its own flow, and all roads reconnect at the destination.",
  },
  // INTERMEDIATE (5)
  {
    level: "Intermediate",
    q: "A 9V battery has two parallel resistors: R₁ = 300Ω and R₂ = 600Ω. What is the total current?",
    opts: ["A) 10 mA", "B) 30 mA", "C) 45 mA", "D) 15 mA"],
    answer: 2,
    explanation:
      "I₁ = 9/300 = 30mA. I₂ = 9/600 = 15mA. I_total = I₁ + I₂ = 30 + 15 = 45mA.",
  },
  {
    level: "Intermediate",
    q: "For the circuit above (9V, 300Ω ‖ 600Ω), the equivalent resistance R_eq is:",
    opts: ["A) 900Ω", "B) 150Ω", "C) 200Ω", "D) 100Ω"],
    answer: 2,
    explanation:
      "R_eq = (300 × 600) / (300 + 600) = 180000 / 900 = 200Ω. Or: R_eq = V / I_total = 9 / 0.045 = 200Ω.",
  },
  {
    level: "Intermediate",
    q: "Three 60Ω resistors connected in parallel. What is R_eq?",
    opts: ["A) 180Ω", "B) 30Ω", "C) 20Ω", "D) 60Ω"],
    answer: 2,
    explanation:
      "For n equal resistors in parallel: R_eq = R/n = 60/3 = 20Ω. Verify: 1/R_eq = 1/60 + 1/60 + 1/60 = 3/60, so R_eq = 60/3 = 20Ω.",
  },
  {
    level: "Intermediate",
    q: "A 12V supply powers R₁ = 1kΩ and R₂ = 2kΩ in parallel. Total power dissipated is:",
    opts: ["A) 72 mW", "B) 216 mW", "C) 144 mW", "D) 288 mW"],
    answer: 1,
    explanation:
      "P₁ = V²/R₁ = 144/1000 = 144mW. P₂ = V²/R₂ = 144/2000 = 72mW. P_total = 144 + 72 = 216mW. Or: R_eq = (1k×2k)/(1k+2k) = 2000/3 = 667Ω, P = 144/667 ≈ 216mW.",
  },
  {
    level: "Intermediate",
    q: "If R₁ branch in a parallel circuit is disconnected, the voltage across R₂ branch:",
    opts: [
      "A) Increases",
      "B) Decreases",
      "C) Stays exactly the same",
      "D) Drops to zero",
    ],
    answer: 2,
    explanation:
      "R₂ is still connected directly across the supply. The supply voltage hasn't changed. Therefore V across R₂ remains the same. This is the key parallel property.",
  },
  // ADVANCED (5)
  {
    level: "Advanced",
    q: "Four resistors 100Ω, 200Ω, 300Ω, and 600Ω are in parallel. R_eq equals:",
    opts: ["A) 1200Ω", "B) 60Ω", "C) 50Ω", "D) 80Ω"],
    answer: 2,
    explanation:
      "1/R_eq = 1/100 + 1/200 + 1/300 + 1/600 = 6/600 + 3/600 + 2/600 + 1/600 = 12/600 = 1/50. R_eq = 50Ω.",
  },
  {
    level: "Advanced",
    q: "Why is parallel R_eq always less than the smallest individual branch resistor?",
    opts: [
      "A) Because voltage decreases in parallel",
      "B) Each branch adds another current path, increasing total conductance",
      "C) Because resistance subtracts in parallel",
      "D) Because current stays the same",
    ],
    answer: 1,
    explanation:
      "Conductance G = 1/R adds in parallel. G_total = G₁ + G₂ + G₃. Since G_total > G_smallest, R_total = 1/G_total < R_smallest. More paths = more conductance = less resistance.",
  },
  {
    level: "Advanced",
    q: "A 120V home circuit has: 60W bulb, 100W TV, 1200W heater — all in parallel. Total current drawn:",
    opts: ["A) 11.3A", "B) 5.0A", "C) 24.0A", "D) 8.0A"],
    answer: 0,
    explanation:
      "I = P/V for each: I_bulb = 60/120 = 0.5A, I_TV = 100/120 ≈ 0.833A, I_heater = 1200/120 = 10A. I_total = 0.5 + 0.833 + 10 = 11.333A ≈ 11.3A.",
  },
  {
    level: "Advanced",
    q: "The Thévenin equivalent of two 470Ω resistors in parallel with a 10V source is:",
    opts: [
      "A) R_th = 940Ω, V_th = 10V",
      "B) R_th = 235Ω, V_th = 10V",
      "C) R_th = 470Ω, V_th = 5V",
      "D) R_th = 235Ω, V_th = 5V",
    ],
    answer: 1,
    explanation:
      "R_th = 470 ‖ 470 = 470/2 = 235Ω. V_th = open-circuit voltage = 10V (no current through either resistor with no load). A voltage source has zero internal resistance in Thevenin analysis.",
  },
  {
    level: "Advanced",
    q: "The Norton current for a 9V source with 300Ω ‖ 600Ω is:",
    opts: ["A) 30 mA", "B) 45 mA", "C) 15 mA", "D) 60 mA"],
    answer: 1,
    explanation:
      "Norton current I_N = V / R_eq = 9 / 200 = 45mA. (R_eq = 200Ω as calculated earlier.) This equals I_total = I₁ + I₂ = 30mA + 15mA = 45mA — they agree!",
  },
];

const PASS_SCORE = 14;

export default function Quiz({ onPass }: Props) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [onPassCalled, setOnPassCalled] = useState(false);

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers((prev) => prev.map((a, i) => (i === current ? idx : a)));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      const finalScore = answers.filter((a, i) => a === questions[i].answer).length;
      const didPass = finalScore >= PASS_SCORE;
      setFinished(true);
      setPassed(didPass);
      if (didPass && !onPassCalled) {
        setOnPassCalled(true);
        onPass();
      }
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setShowExplanation(false);
    setFinished(false);
    setPassed(false);
  };

  const levelColor = {
    Beginner: "#10B981",
    Intermediate: "#6366F1",
    Advanced: "#F97316",
  };

  if (!started) {
    return (
      <section className="px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/8 p-8 text-center"
          style={{ background: "rgba(99,102,241,0.05)" }}
        >
          <div className="text-4xl mb-3">🧠</div>
          <h2 className="text-2xl font-black text-white mb-2">Knowledge Check</h2>
          <p className="text-sm mb-2" style={{ color: "rgba(240,240,245,0.55)" }}>
            20 questions · Beginner → Advanced
          </p>
          <p className="text-xs mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
            Pass threshold: {PASS_SCORE}/20 correct to earn 50 XP
          </p>
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
              <div
                key={lvl}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
                style={{
                  background: `${levelColor[lvl]}15`,
                  borderColor: `${levelColor[lvl]}33`,
                  color: levelColor[lvl],
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: levelColor[lvl] }} />
                {lvl}
              </div>
            ))}
          </div>
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-3 rounded-2xl font-black text-white text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
          >
            Start Quiz →
          </button>
        </motion.div>
      </section>
    );
  }

  if (finished) {
    return (
      <section className="px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-white/8 p-8 text-center"
          style={{ background: passed ? "rgba(99,102,241,0.07)" : "rgba(239,68,68,0.05)" }}
        >
          <div className="text-5xl mb-4">{passed ? "🎉" : "😤"}</div>
          <h2 className="text-2xl font-black text-white mb-2">
            {passed ? "Quiz Passed!" : "Keep Practicing"}
          </h2>
          <div className="text-4xl font-black mb-1" style={{ color: passed ? "#6366F1" : "#F87171" }}>
            {score}/{questions.length}
          </div>
          <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.55)" }}>
            {passed
              ? `Excellent! ${score >= 18 ? "Outstanding score!" : score >= 16 ? "Great work!" : "Well done!"} You earned 50 XP.`
              : `You got ${score}/${questions.length}. Need ${PASS_SCORE} to pass. Review and retry!`}
          </p>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => {
              const lvlQs = questions.filter((q) => q.level === lvl);
              const lvlScore = lvlQs.filter((q, li) => {
                const globalIdx = questions.indexOf(q);
                return answers[globalIdx] === q.answer;
              }).length;
              return (
                <div
                  key={lvl}
                  className="rounded-xl p-3 border border-white/6"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div
                    className="text-lg font-black"
                    style={{ color: levelColor[lvl] }}
                  >
                    {lvlScore}/{lvlQs.length}
                  </div>
                  <div className="text-[10px] text-white/40">{lvl}</div>
                </div>
              );
            })}
          </div>

          {/* Answer review */}
          <div className="text-left mb-6 flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div
                  key={i}
                  className="rounded-xl p-3 border text-xs"
                  style={{
                    background: correct ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                    borderColor: correct ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span style={{ color: correct ? "#34D399" : "#F87171" }} className="shrink-0 font-bold">
                      {correct ? "✓" : "✗"}
                    </span>
                    <div>
                      <div className="font-medium text-white/80 mb-0.5">{q.q}</div>
                      {!correct && (
                        <div className="text-white/50">
                          Your answer: {answers[i] !== null ? q.opts[answers[i]!] : "Not answered"}
                        </div>
                      )}
                      <div style={{ color: correct ? "#6EE7B7" : "#FCA5A5" }}>
                        Correct: {q.opts[q.answer]}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-2xl font-bold text-sm border border-white/15 text-white/60 hover:border-white/25 hover:text-white/80 transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              Retry Quiz
            </button>
            {passed && (
              <div
                className="px-6 py-2.5 rounded-2xl font-bold text-sm"
                style={{ background: "rgba(99,102,241,0.2)", color: "#818CF8" }}
              >
                +50 XP Earned ✓
              </div>
            )}
          </div>
        </motion.div>
      </section>
    );
  }

  const q = questions[current];
  const isCorrect = selected === q.answer;

  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/8 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {/* Quiz header */}
        <div
          className="p-5 border-b border-white/5"
          style={{ background: "rgba(99,102,241,0.06)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/50">
                Question {current + 1} of {questions.length}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{
                  color: levelColor[q.level],
                  borderColor: `${levelColor[q.level]}44`,
                  background: `${levelColor[q.level]}15`,
                }}
              >
                {q.level}
              </span>
            </div>
            <span className="text-xs font-bold" style={{ color: "#6366F1" }}>
              {answers.filter((a, i) => a !== null && a === questions[i].answer).length} correct
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #6366F1, #10B981)" }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Question */}
          <h3 className="text-base font-bold text-white mb-5 leading-relaxed">{q.q}</h3>

          {/* Options */}
          <div className="flex flex-col gap-2.5 mb-5">
            {q.opts.map((opt, idx) => {
              let bg = "rgba(255,255,255,0.03)";
              let border = "rgba(255,255,255,0.08)";
              let color = "rgba(240,240,245,0.7)";

              if (selected !== null) {
                if (idx === q.answer) {
                  bg = "rgba(16,185,129,0.12)";
                  border = "rgba(16,185,129,0.4)";
                  color = "#6EE7B7";
                } else if (idx === selected && selected !== q.answer) {
                  bg = "rgba(239,68,68,0.1)";
                  border = "rgba(239,68,68,0.35)";
                  color = "#FCA5A5";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className="w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all"
                  style={{ background: bg, borderColor: border, color }}
                >
                  <span className="font-mono mr-1 opacity-60">{opt.slice(0, 2)}</span>
                  {opt.slice(2)}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-5"
              >
                <div
                  className="rounded-xl p-4 border text-sm"
                  style={{
                    background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.07)",
                    borderColor: isCorrect ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
                    color: isCorrect ? "#6EE7B7" : "#FCA5A5",
                  }}
                >
                  <div className="font-bold mb-1">{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.65)" }}>
                    {q.explanation}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
              >
                {current < questions.length - 1 ? "Next Question →" : "See Results →"}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
