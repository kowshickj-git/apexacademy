"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "What is the best definition of voltage?",
    options: [
      "The flow rate of electrons through a wire",
      "The electrical pressure that pushes electrons through a circuit",
      "The resistance to electrical flow in a component",
      "The total electrical energy a battery stores",
    ],
    correct: 1,
    explanation:
      "Voltage is the electrical pressure that drives electrons through a circuit — similar to how water pressure drives water through a pipe.",
  },
  {
    question: "What unit is voltage measured in?",
    options: ["Amperes (A)", "Ohms (Ω)", "Watts (W)", "Volts (V)"],
    correct: 3,
    explanation:
      "Voltage is measured in Volts (V), named after Alessandro Volta who invented the first battery in 1800.",
  },
  {
    question: "Which device has the highest voltage?",
    options: [
      "AA Battery — 1.5V",
      "USB Power — 5V",
      "9V Rectangular Battery — 9V",
      "Car Battery — 12V",
    ],
    correct: 3,
    explanation:
      "A car battery provides 12V, making it the highest among these everyday examples. More voltage means a stronger push for electrons.",
  },
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];
  const isCorrect = selected === q.correct;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    if (index === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((n) => n + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  const scoreColor =
    score === 3 ? "text-primary" : score === 2 ? "text-secondary" : "text-yellow-400";
  const scoreLabel =
    score === 3 ? "Perfect Score!" : score === 2 ? "Great Work!" : "Keep Practicing!";

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="06" title="Quick Quiz" />

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < currentQ
                        ? "w-6 bg-primary"
                        : i === currentQ
                        ? "w-10 bg-primary"
                        : "w-6 bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-white/30 ml-auto">
                {currentQ + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div className="bg-surface rounded-2xl border border-white/5 p-4">
              <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-3">
                Question {currentQ + 1}
              </p>
              <p className="text-base font-semibold text-white leading-snug">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrectOpt = i === q.correct;

                let style =
                  "bg-surface border-white/5 text-white/70 hover:border-white/15 hover:text-white active:scale-[0.98]";

                if (showFeedback) {
                  if (isCorrectOpt)
                    style = "bg-primary/10 border-primary/40 text-white";
                  else if (isSelected && !isCorrectOpt)
                    style = "bg-red-500/10 border-red-500/40 text-white/60";
                  else style = "bg-surface border-white/5 text-white/30";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={showFeedback}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 flex items-center gap-3 ${style}`}
                  >
                    {/* Option marker */}
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                        showFeedback && isCorrectOpt
                          ? "bg-primary border-primary text-background"
                          : showFeedback && isSelected && !isCorrectOpt
                          ? "bg-red-500/20 border-red-500 text-red-400"
                          : isSelected
                          ? "bg-primary/20 border-primary text-primary"
                          : "border-white/15 text-white/30"
                      }`}
                    >
                      {showFeedback && isCorrectOpt ? (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : showFeedback && isSelected && !isCorrectOpt ? (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <span className="text-sm leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-xl border p-4 flex gap-3 ${
                    isCorrect
                      ? "bg-primary/8 border-primary/25"
                      : "bg-red-500/8 border-red-500/25"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      isCorrect ? "bg-primary/20" : "bg-red-500/20"
                    }`}
                  >
                    {isCorrect ? (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1" stroke="#10B981" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1 1l7 7M8 1L1 8" stroke="#EF4444" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold mb-0.5 ${
                        isCorrect ? "text-primary" : "text-red-400"
                      }`}
                    >
                      {isCorrect ? "Correct!" : "Not quite."}
                    </p>
                    <p className="text-xs text-white/55 leading-relaxed">{q.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {showFeedback && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full py-3.5 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                {currentQ < questions.length - 1 ? "Next Question →" : "See Results"}
              </motion.button>
            )}
          </motion.div>
        ) : (
          // Results screen
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
              {/* Score ring */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="38" fill="none" stroke="#ffffff0a" strokeWidth="8" />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - score / questions.length)}`}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-extrabold ${scoreColor}`}>{score}</span>
                  <span className="text-xs text-white/30">/ {questions.length}</span>
                </div>
              </div>

              <p className={`text-xl font-bold mb-1 ${scoreColor}`}>{scoreLabel}</p>
              <p className="text-sm text-white/50">
                You got {score} out of {questions.length} questions correct.
              </p>
            </div>

            {/* Score breakdown */}
            {questions.map((qs, i) => (
              <div
                key={i}
                className={`rounded-xl border p-3 flex items-start gap-3 ${
                  score > i
                    ? "bg-primary/5 border-primary/20"
                    : "bg-red-500/5 border-red-500/20"
                }`}
              >
                <span
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    score > i ? "bg-primary/20" : "bg-red-500/20"
                  }`}
                >
                  {score > i ? (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 6L8 1" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                      <path d="M1 1l5 5M6 1L1 6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <p className="text-xs text-white/60 leading-relaxed">{qs.question}</p>
              </div>
            ))}

            <button
              onClick={handleRetry}
              className="w-full py-3.5 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:border-primary/30 hover:text-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7a6 6 0 1 0 1.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 3v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
