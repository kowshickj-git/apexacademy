"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    q: "What is electric current?",
    options: [
      "The pressure that pushes electrons",
      "The flow of electrons through a conductor",
      "The opposition to electron flow",
      "The energy stored in a battery",
    ],
    correct: 1,
    explanation: "Current is the flow of electrons (electric charges) through a conductor, measured in Amperes.",
  },
  {
    q: "What is the unit of electric current?",
    options: ["Volts (V)", "Ohms (Ω)", "Amperes (A)", "Watts (W)"],
    correct: 2,
    explanation: "Current is measured in Amperes (A), named after André-Marie Ampère.",
  },
  {
    q: "In the ant road analogy, what do the ants represent?",
    options: ["Voltage", "Resistance", "Electrons", "Energy"],
    correct: 2,
    explanation: "The ants represent electrons — the more ants (electrons) passing a point per second, the higher the current.",
  },
  {
    q: "A phone charger delivers 2A. If you increase the current to 4A, what happens to the charging speed?",
    options: [
      "Charging becomes slower",
      "Charging speed stays the same",
      "Charging becomes faster",
      "The phone switches off",
    ],
    correct: 2,
    explanation: "More current = more charge flowing per second = faster charging. This is why fast chargers deliver higher Amperes.",
  },
  {
    q: "Which of these uses the LEAST amount of current?",
    options: ["Electric vehicle (charging)", "Ceiling fan", "Single LED", "Laptop charger"],
    correct: 2,
    explanation: "A single LED uses only about 20 milliamperes (0.02A), making it extremely energy-efficient.",
  },
];

interface QuizProps {
  onPass: () => void;
}

export default function Quiz({ onPass }: QuizProps) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);

  const q = questions[qIdx];
  const isCorrect = selected === q.correct;

  const handleSelect = (i: number) => {
    if (showFeedback) return;
    setSelected(i);
    setShowFeedback(true);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx((i) => i + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      const finalScore = score + (selected === q.correct && !showFeedback ? 1 : selected === q.correct ? 0 : 0);
      const passed = finalScore >= 3;
      setFinished(true);
      setPassed(passed);
      if (passed) setTimeout(onPass, 400);
    }
  };

  const retry = () => {
    setQIdx(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setPassed(false);
  };

  const ringPercent = finished ? (score / questions.length) * 100 : 0;

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#11</p>
        <h2 className="text-2xl font-bold text-white">Quick Quiz</h2>
      </div>

      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: "#18181B" }}>
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={`q-${qIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-5"
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: i === qIdx ? 24 : 8,
                        background: i < qIdx ? "#10B981" : i === qIdx ? "#0EA5E9" : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-white/30 font-mono">{qIdx + 1}/{questions.length}</span>
              </div>

              {/* Question */}
              <p className="text-base font-semibold text-white mb-4 leading-snug">{q.q}</p>

              {/* Options */}
              <div className="space-y-2.5 mb-4">
                {q.options.map((opt, i) => {
                  let borderColor = "rgba(255,255,255,0.08)";
                  let bg = "rgba(255,255,255,0.03)";
                  let textColor = "text-white/65";

                  if (showFeedback) {
                    if (i === q.correct) {
                      borderColor = "rgba(16,185,129,0.5)";
                      bg = "rgba(16,185,129,0.08)";
                      textColor = "text-white";
                    } else if (i === selected && i !== q.correct) {
                      borderColor = "rgba(239,68,68,0.45)";
                      bg = "rgba(239,68,68,0.07)";
                      textColor = "text-white/55";
                    }
                  } else if (selected === i) {
                    borderColor = "rgba(14,165,233,0.5)";
                    bg = "rgba(14,165,233,0.08)";
                    textColor = "text-white";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(i)}
                      disabled={showFeedback}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${textColor} ${!showFeedback ? "hover:border-white/20" : ""}`}
                      style={{ borderColor, background: bg }}
                    >
                      <span className="font-mono text-[10px] text-white/25 mr-2">{String.fromCharCode(65 + i)})</span>
                      {opt}
                      {showFeedback && i === q.correct && (
                        <span className="ml-2 text-xs text-primary font-semibold">✓ Correct</span>
                      )}
                      {showFeedback && i === selected && i !== q.correct && (
                        <span className="ml-2 text-xs text-red-400 font-semibold">✗ Wrong</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div
                      className="rounded-xl border p-3"
                      style={{
                        background: isCorrect ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.06)",
                        borderColor: isCorrect ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.22)",
                      }}
                    >
                      <p className={`text-xs font-semibold mb-1 ${isCorrect ? "text-primary" : "text-red-400"}`}>
                        {isCorrect ? "🎉 Correct!" : "❌ Not quite"}
                      </p>
                      <p className="text-xs text-white/52 leading-relaxed">{q.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next */}
              {showFeedback && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-bold text-sm text-background bg-primary hover:opacity-90 transition-opacity"
                >
                  {qIdx < questions.length - 1 ? "Next Question →" : "See Results"}
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6 text-center"
            >
              {/* Score ring */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={score >= 3 ? "#10B981" : "#EF4444"}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(score / questions.length) * 251.2} 251.2`}
                    style={{ transition: "stroke-dasharray 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className={`text-3xl font-extrabold ${score >= 3 ? "text-primary" : "text-red-400"}`}>{score}/{questions.length}</p>
                </div>
              </div>

              <p className="text-lg font-extrabold text-white mb-1">
                {score >= 3 ? "🎉 Nicely done!" : "Keep practising!"}
              </p>
              <p className="text-sm text-white/50 mb-5">
                {score >= 3 ? "+30 XP earned! You passed the quiz." : `You scored ${score} out of ${questions.length}. Try again!`}
              </p>

              {score >= 3 ? (
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-bold" style={{ background: "rgba(16,185,129,0.08)" }}>
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
                    <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
                  </svg>
                  +30 XP
                </div>
              ) : (
                <button
                  onClick={retry}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-white/8 text-white/80 hover:bg-white/12 transition-all border border-white/10"
                >
                  Try Again
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
