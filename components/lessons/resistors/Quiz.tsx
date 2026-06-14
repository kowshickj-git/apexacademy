"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const questions = [
  {
    q: "What does a resistor do?",
    options: ["Stores electrical charge", "Amplifies voltage", "Opposes current flow", "Converts AC to DC"],
    answer: 2,
    explanation: "A resistor opposes current flow in a circuit, limiting how much current passes through.",
  },
  {
    q: "What unit is resistance measured in?",
    options: ["Volts (V)", "Ohms (Ω)", "Amperes (A)", "Watts (W)"],
    answer: 1,
    explanation: "Resistance is measured in Ohms (Ω), named after physicist Georg Simon Ohm.",
  },
  {
    q: "What does a Gold band (4th band) mean on a resistor?",
    options: ["The resistor is made of gold", "The multiplier is 0.001", "The tolerance is ±5%", "The value is 1,000 Ohms"],
    answer: 2,
    explanation: "The gold 4th band indicates ±5% tolerance — the actual resistance is within 5% of the marked value.",
  },
  {
    q: "You have a Red-Red-Brown-Gold resistor. What is its value?",
    options: ["22Ω", "220Ω", "2,200Ω", "22KΩ"],
    answer: 1,
    explanation: "Red(2) · Red(2) = 22 × Brown(×10) = 220Ω ± 5%. This is the most common LED resistor.",
  },
  {
    q: "What happens if you connect an LED directly to 9V without a resistor?",
    options: ["The LED glows brighter", "Nothing changes", "The LED burns out immediately", "The battery drains faster"],
    answer: 2,
    explanation: "Without a resistor, too much current flows through the LED (90mA vs safe 20mA), burning it out in milliseconds.",
  },
  {
    q: "Which type of resistor changes value with temperature?",
    options: ["Potentiometer", "SMD Chip Resistor", "Wirewound Resistor", "Thermistor"],
    answer: 3,
    explanation: "A Thermistor (NTC or PTC) changes resistance with temperature. Used in temperature sensors and battery charging circuits.",
  },
  {
    q: "What does LDR stand for?",
    options: ["Light-Dependent Resistor", "Low-Density Resistance", "Linear Digital Resistor", "Liquid-Driven Relay"],
    answer: 0,
    explanation: "LDR = Light-Dependent Resistor. Resistance drops dramatically in bright light, useful for automatic nightlights.",
  },
  {
    q: "Which resistor type is used on modern PCBs for automated assembly?",
    options: ["Wirewound", "Carbon Film", "SMD Chip Resistor", "Power Resistor"],
    answer: 2,
    explanation: "SMD (Surface-Mount Device) chip resistors have no leads and can be picked and placed by machines at high speed, making them ideal for automated PCB assembly.",
  },
];

export default function Quiz({ onPass }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const handleSubmit = () => {
    if (answers.includes(null)) return;
    const pass = score >= 5;
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
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 15 · Quiz</p>
        <h2 className="text-xl font-bold mb-1">Test Your Knowledge</h2>
        <p className="text-white/45 text-sm mb-2 leading-relaxed">
          8 questions. Score 5 or more to pass and earn 30 XP.
        </p>

        {!submitted && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex gap-1">
              {answers.map((a, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors duration-200"
                  style={{ background: a !== null ? "#10B981" : "rgba(255,255,255,0.1)" }}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/25">{answers.filter((a) => a !== null).length} / {questions.length} answered</span>
          </div>
        )}

        <div className="space-y-6 mb-6">
          {questions.map((q, qi) => (
            <div key={qi} className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-sm font-semibold mb-3 text-white/85">
                <span className="text-white/25 mr-2 font-mono">Q{qi + 1}.</span>{q.q}
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = oi === q.answer;
                  let bg = "rgba(255,255,255,0.03)";
                  let border = "rgba(255,255,255,0.07)";
                  let textColor = "rgba(255,255,255,0.5)";
                  if (submitted) {
                    if (isCorrect) { bg = "rgba(16,185,129,0.12)"; border = "#10B981"; textColor = "#10B981"; }
                    else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.1)"; border = "#EF4444"; textColor = "#EF4444"; }
                  } else if (isSelected) {
                    bg = "rgba(14,165,233,0.1)"; border = "#0EA5E9"; textColor = "#0EA5E9";
                  }
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => { const n = [...prev]; n[qi] = oi; return n; })}
                      className="w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all"
                      style={{ background: bg, borderColor: border, color: textColor }}
                    >
                      <span className="font-mono mr-2 opacity-50">{["A","B","C","D"][oi]}.</span>{opt}
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
              ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)", cursor: "not-allowed" }
              : { background: "#10B981", color: "#050507", boxShadow: "0 0 24px rgba(16,185,129,0.4)" }
            }
          >
            Submit Quiz →
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
            <p className="text-3xl mb-2">{passed ? "🎉" : "📚"}</p>
            <p className="text-lg font-black" style={{ color: passed ? "#10B981" : "#EF4444" }}>
              {score} / {questions.length}
            </p>
            <p className="text-sm text-white/50 mb-3">
              {passed ? "Excellent! You passed and earned 30 XP." : `You need 5/8 to pass. Got ${score}. Review and try again.`}
            </p>
            {!passed && (
              <button
                onClick={reset}
                className="px-4 py-2 rounded-full text-xs font-bold border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
              >
                Try Again →
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
