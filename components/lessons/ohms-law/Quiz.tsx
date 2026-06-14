"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const questions = [
  {
    q: "Who discovered Ohm's Law?",
    options: ["Alessandro Volta", "André-Marie Ampère", "Georg Simon Ohm", "James Watt"],
    answer: 2,
    explanation: "Georg Simon Ohm (1789–1854) discovered the law in 1827 and published it in 'Die galvanische Kette'. The unit of resistance (Ω) is named after him.",
  },
  {
    q: "In the formula V = I × R, what does V stand for?",
    options: ["Volume", "Velocity", "Voltage", "Vacuum"],
    answer: 2,
    explanation: "V stands for Voltage — measured in Volts. It is the electrical pressure or potential difference driving current through a circuit.",
  },
  {
    q: "In the formula V = I × R, what does I stand for?",
    options: ["Impedance", "Inductance", "Intensity", "Current (Intensité)"],
    answer: 3,
    explanation: "I stands for Current, measured in Amperes. The letter I comes from the French word 'Intensité du courant' (intensity of current) used by Ampère.",
  },
  {
    q: "In the formula V = I × R, what does R stand for?",
    options: ["Rate", "Resistance", "Relay", "Real power"],
    answer: 1,
    explanation: "R stands for Resistance — measured in Ohms (Ω). It is the opposition a material provides to the flow of electric current.",
  },
  {
    q: "If voltage is 10V and resistance is 5Ω, what is the current?",
    options: ["50A", "0.5A", "2A", "15A"],
    answer: 2,
    explanation: "I = V ÷ R = 10V ÷ 5Ω = 2A. Always use I = V/R to find current when voltage and resistance are known.",
  },
  {
    q: "If you double the voltage while keeping resistance the same, what happens to current?",
    options: ["Current halves", "Current stays the same", "Current doubles", "Current quadruples"],
    answer: 2,
    explanation: "From I = V/R: if V doubles and R stays the same, I doubles proportionally. Voltage and current are directly proportional.",
  },
  {
    q: "If resistance doubles while voltage stays the same, what happens to current?",
    options: ["Current doubles", "Current stays the same", "Current halves", "Current quadruples"],
    answer: 2,
    explanation: "From I = V/R: if R doubles and V stays the same, I halves. Resistance and current are inversely proportional.",
  },
  {
    q: "Calculate voltage: Current = 2A, Resistance = 10Ω",
    options: ["5V", "12V", "0.2V", "20V"],
    answer: 3,
    explanation: "V = I × R = 2A × 10Ω = 20V. This is the direct application of Ohm's Law — multiply current by resistance to get voltage.",
  },
  {
    q: "Calculate resistance: Voltage = 12V, Current = 3A",
    options: ["36Ω", "9Ω", "4Ω", "0.25Ω"],
    answer: 2,
    explanation: "R = V ÷ I = 12V ÷ 3A = 4Ω. Use R = V/I when you know voltage and current and need to find resistance.",
  },
  {
    q: "Why is Ohm's Law called a 'law' rather than a 'theory'?",
    options: ["Because Georg Ohm was a lawyer", "Because it always holds — no exceptions for conductors", "Because it was voted on by scientists", "Because it was written in a law book"],
    answer: 1,
    explanation: "A law in physics means it always holds true with no exceptions. For any ohmic conductor at constant temperature, V = I × R is exactly true every time — as reliable as gravity.",
  },
];

export default function Quiz({ onPass }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const handleSubmit = () => {
    if (answers.includes(null)) return;
    const pass = score >= 7;
    setSubmitted(true);
    setPassed(pass);
    if (pass) setTimeout(() => onPass(), 400);
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setPassed(false);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 19 · Knowledge Check</p>
        <h2 className="text-xl font-bold mb-1">Quiz — Test Your Knowledge</h2>
        <p className="text-white/45 text-sm mb-2 leading-relaxed">
          10 questions. Score 7 or more to pass and earn +40 XP.
        </p>

        {!submitted && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex gap-1">
              {answers.map((a, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-colors" style={{ background: a !== null ? "#10B981" : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
            <span className="text-[10px] text-white/25">{answers.filter((a) => a !== null).length} / {questions.length} answered</span>
          </div>
        )}

        <div className="space-y-5 mb-6">
          {questions.map((q, qi) => (
            <div key={qi} className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-sm font-semibold mb-3 text-white/85">
                <span className="text-white/25 font-mono mr-2">Q{qi + 1}.</span>{q.q}
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = oi === q.answer;
                  let bg = "rgba(255,255,255,0.03)", border = "rgba(255,255,255,0.07)", tc = "rgba(255,255,255,0.5)";
                  if (submitted) {
                    if (isCorrect) { bg = "rgba(16,185,129,0.12)"; border = "#10B981"; tc = "#10B981"; }
                    else if (isSelected) { bg = "rgba(239,68,68,0.09)"; border = "#EF4444"; tc = "#EF4444"; }
                  } else if (isSelected) { bg = "rgba(14,165,233,0.1)"; border = "#0EA5E9"; tc = "#0EA5E9"; }
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => { const n = [...prev]; n[qi] = oi; return n; })}
                      className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all"
                      style={{ background: bg, borderColor: border, color: tc }}
                    >
                      <span className="font-mono mr-2 opacity-50">{["A", "B", "C", "D"][oi]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-[11px] text-white/40 leading-relaxed overflow-hidden"
                  >
                    <span className="text-primary">→ </span>{q.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={answers.includes(null)}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all"
            style={answers.includes(null)
              ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }
              : { background: "#10B981", color: "#050507", boxShadow: "0 0 24px rgba(16,185,129,0.4)" }
            }
          >
            Submit Quiz — {answers.filter((a) => a !== null).length}/{questions.length} answered
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border p-5 text-center"
            style={passed
              ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }
              : { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }
            }
          >
            <p className="text-3xl mb-2">{passed ? "🏆" : "📖"}</p>
            <p className="text-2xl font-black" style={{ color: passed ? "#10B981" : "#EF4444" }}>{score} / {questions.length}</p>
            <p className="text-sm text-white/50 mb-3">
              {passed ? "Excellent! You passed. +40 XP earned." : `Need 7/10 to pass. Review the explanations above and try again.`}
            </p>
            {!passed && (
              <button onClick={reset} className="px-4 py-2 rounded-full text-xs font-bold border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors">
                Try Again →
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
