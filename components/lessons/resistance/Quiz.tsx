"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const questions = [
  {
    q: "What is Resistance?",
    options: ["Flow of current through a wire", "Opposition to the flow of electric current", "The power stored in a battery"],
    correct: 1,
    explanation: "Resistance is the opposition to the flow of electric current. Higher resistance means it's harder for current to flow.",
  },
  {
    q: "Which material has lower resistance?",
    options: ["Copper", "Rubber"],
    correct: 0,
    explanation: "Copper is an excellent conductor with resistivity ~1.7×10⁻⁸ Ω·m. Rubber is an insulator with resistivity ~10¹³ Ω·m.",
  },
  {
    q: "A narrow pipe in the water analogy represents:",
    options: ["Low Resistance — water flows freely", "High Resistance — water is restricted"],
    correct: 1,
    explanation: "A narrow pipe restricts water flow, just as a material with high resistance restricts current flow.",
  },
  {
    q: "Why does resistance occur in materials?",
    options: ["Electrons collide with atoms inside the material", "The battery has a certain colour", "Only depends on wire length"],
    correct: 0,
    explanation: "Resistance is caused by collisions between moving electrons and the atoms in a material. More collisions = more resistance.",
  },
  {
    q: "Resistance is measured in:",
    options: ["Volt (V)", "Ampere (A)", "Ohm (Ω)"],
    correct: 2,
    explanation: "Resistance is measured in Ohms (Ω), named after the physicist Georg Simon Ohm who discovered the relationship between voltage, current, and resistance.",
  },
];

export default function Quiz({ onPass }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [passCalled, setPassCalled] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const newAnswers = [...answers];
    newAnswers[current] = i;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selected === null) return;
    if (isLast) {
      setFinished(true);
      const score = [...answers.slice(0, -1), selected].filter((a, i) => a === questions[i].correct).length;
      if (score >= 3 && !passCalled) {
        setPassCalled(true);
        setTimeout(onPass, 400);
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(answers[current + 1] ?? null);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setFinished(false);
    setPassCalled(false);
  };

  const score = finished ? answers.filter((a, i) => a === questions[i].correct).length : 0;

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="11" title="Knowledge Check" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/8 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="h-[3px] bg-gradient-to-r from-primary to-orange-400" />

        {!finished ? (
          <div className="p-5">
            {/* Progress */}
            <div className="flex justify-between text-[10px] text-white/30 mb-3">
              <span>Question {current + 1} of {questions.length}</span>
              <span>{answers.filter((a, i) => a !== null && a === questions[i].correct).length} correct so far</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500"
                style={{ width: `${((current + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <p className="text-base font-bold text-white mb-4 leading-snug">{q.q}</p>
                <div className="space-y-2.5 mb-5">
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === q.correct;
                    const showResult = selected !== null;
                    let style: React.CSSProperties = { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" };
                    if (showResult && isCorrect) style = { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.4)", color: "#10B981" };
                    else if (showResult && isSelected && !isCorrect) style = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" };
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all"
                        style={style}
                        disabled={selected !== null}
                      >
                        <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl border border-primary/20 mb-4"
                    style={{ background: "rgba(16,185,129,0.07)" }}
                  >
                    <p className="text-[11px] text-white/55 leading-relaxed">
                      <span className="text-primary font-bold">Explanation: </span>{q.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={handleNext}
              disabled={selected === null}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all"
              style={selected !== null
                ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#10B981" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)", cursor: "not-allowed" }
              }
            >
              {isLast ? "See Results →" : "Next Question →"}
            </button>
          </div>
        ) : (
          <div className="p-5 text-center">
            <div className="text-5xl mb-3">{score >= 4 ? "🏆" : score >= 3 ? "⭐" : "📚"}</div>
            <p className="text-xl font-extrabold text-white mb-1">
              {score >= 4 ? "Excellent!" : score >= 3 ? "Good job!" : "Keep learning!"}
            </p>
            <p className="text-sm text-white/45 mb-5">You got {score} out of {questions.length} correct</p>

            <div className="grid grid-cols-5 gap-2 mb-5">
              {questions.map((q, i) => {
                const correct = answers[i] === q.correct;
                return (
                  <div key={i} className="text-center py-2 rounded-xl border" style={correct ? { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)" } : { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
                    <span className="text-sm">{correct ? "✓" : "✗"}</span>
                    <p className="text-[9px] text-white/35 mt-0.5">Q{i + 1}</p>
                  </div>
                );
              })}
            </div>

            {score >= 3 && (
              <div className="p-3 rounded-xl border border-primary/20 mb-4" style={{ background: "rgba(16,185,129,0.08)" }}>
                <p className="text-xs text-primary font-semibold">+30 XP earned for passing the quiz!</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:text-white/70 hover:border-white/20 transition-all"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                Retry
              </button>
              {score < 3 && (
                <button
                  onClick={handleRetry}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-primary/30 text-primary transition-all"
                  style={{ background: "rgba(16,185,129,0.1)" }}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
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
