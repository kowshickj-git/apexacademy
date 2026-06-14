"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const questions = [
  {
    q: "What is a diode's primary function?",
    options: ["Store electrical charge", "Allow current to flow in one direction only", "Amplify electrical signals", "Convert electrical energy to light"],
    correct: 1,
    explain: "A diode is a one-way valve for current — it allows current to flow from anode to cathode but blocks reverse current.",
  },
  {
    q: "Which terminal of a diode is the positive (+) terminal?",
    options: ["Cathode", "Anode", "Gate", "Emitter"],
    correct: 1,
    explain: "The Anode (A) is the positive terminal. Current flows INTO the anode and OUT of the cathode.",
  },
  {
    q: "A silicon diode is 'forward biased' when:",
    options: ["Cathode is more positive than anode", "Anode is more positive than cathode", "Both terminals are at the same voltage", "The diode is connected to AC"],
    correct: 1,
    explain: "Forward bias = anode (+) at higher potential than cathode (−). This opens the junction and allows current to flow.",
  },
  {
    q: "What is the approximate forward voltage drop of a silicon diode?",
    options: ["0.1V", "0.3V", "0.7V", "1.4V"],
    correct: 2,
    explain: "Silicon diodes have a forward voltage drop of ~0.6–0.7V. Schottky diodes drop ~0.2–0.4V. Germanium diodes ~0.2–0.3V.",
  },
  {
    q: "What does a rectifier diode do?",
    options: ["It regulates voltage at a precise level", "It converts AC to pulsed DC", "It emits light when forward biased", "It detects radio frequencies"],
    correct: 1,
    explain: "Rectification is the conversion of alternating current (AC) to direct current (DC). A diode passes only one half of the AC waveform.",
  },
  {
    q: "On a real 1N4007 diode, the cathode (−) is identified by:",
    options: ["The longer leg", "A grey/silver band painted on the body", "The flat side of the case", "The letter 'A' printed on it"],
    correct: 1,
    explain: "A silver or grey band marks the cathode end of a through-hole diode. This matches the bar in the circuit symbol.",
  },
  {
    q: "In the diode circuit symbol, which direction does conventional current flow?",
    options: ["From bar to triangle point", "From triangle point to bar (tip of arrow)", "In both directions equally", "Perpendicular to the diode"],
    correct: 1,
    explain: "The triangle points in the direction of conventional current flow — from Anode (triangle base) to Cathode (bar). The arrow is the mnemonic.",
  },
  {
    q: "What advantage does a Schottky diode have over a regular silicon diode?",
    options: ["Higher forward voltage drop", "Lower forward voltage drop and faster switching", "Higher breakdown voltage", "It emits light"],
    correct: 1,
    explain: "Schottky diodes have ~0.2–0.4V forward drop (vs 0.7V silicon) and switch much faster due to their metal-semiconductor junction. Perfect for switching supplies.",
  },
  {
    q: "A protection diode installed to prevent reverse polarity damage should be:",
    options: ["In parallel with the load, forward biased", "In series with the power input, forward biased", "In series with the power input, reverse biased", "In parallel with the load, reverse biased"],
    correct: 1,
    explain: "A series protection diode in the power path blocks reverse current entirely when battery is inserted backwards. It must be forward biased for normal operation.",
  },
  {
    q: "Is an LED a type of diode?",
    options: ["No — LEDs are transistors", "No — LEDs use capacitors not diodes", "Yes — LEDs are P-N junction diodes optimised for light emission", "Only high-power LEDs are diodes"],
    correct: 2,
    explain: "An LED (Light Emitting Diode) IS a diode. It has the same anode/cathode structure, but its semiconductor material is chosen to emit photons when carriers recombine at the junction.",
  },
];

const PASS_THRESHOLD = 7;

export default function Quiz({ onPass }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [passedOnce, setPassedOnce] = useState(false);

  const select = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers((a) => { const n = [...a]; n[qi] = oi; return n; });
  };

  const submit = () => {
    const score = answers.filter((a, i) => a === questions[i].correct).length;
    const ok = score >= PASS_THRESHOLD;
    setSubmitted(true);
    setPassed(ok);
    if (ok && !passedOnce) { setPassedOnce(true); onPass(); }
  };

  const retry = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setPassed(false);
  };

  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const allAnswered = answers.every((a) => a !== null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 12 · Quiz</p>
        <h2 className="text-xl font-bold mb-1">Test Your Knowledge</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          10 questions on diodes — fundamentals, symbols, bias, types and applications. Pass ≥7/10 to earn quiz XP.
        </p>

        <div className="space-y-6 mb-6">
          {questions.map((q, qi) => {
            const answered = answers[qi] !== null;
            const isCorrect = submitted && answers[qi] === q.correct;
            const isWrong = submitted && answered && answers[qi] !== q.correct;

            return (
              <div key={qi}>
                <p className="text-sm font-semibold text-white/80 mb-3">
                  <span className="text-white/25 font-mono text-xs mr-2">{qi + 1}.</span>{q.q}
                </p>
                <div className="space-y-2 mb-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    let bg = "rgba(255,255,255,0.03)";
                    let border = "rgba(255,255,255,0.08)";
                    let color = "rgba(255,255,255,0.55)";
                    if (!submitted && chosen) { bg = "rgba(139,92,246,0.12)"; border = "rgba(139,92,246,0.35)"; color = "#A78BFA"; }
                    if (submitted && oi === q.correct) { bg = "rgba(16,185,129,0.1)"; border = "rgba(16,185,129,0.35)"; color = "#10B981"; }
                    if (submitted && chosen && oi !== q.correct) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.35)"; color = "#EF4444"; }

                    return (
                      <button
                        key={oi}
                        onClick={() => select(qi, oi)}
                        disabled={submitted}
                        className="w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all"
                        style={{ background: bg, borderColor: border, color }}
                      >
                        <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                        {submitted && oi === q.correct && " ✓"}
                        {submitted && chosen && oi !== q.correct && " ✗"}
                      </button>
                    );
                  })}
                </div>
                {submitted && (isCorrect || isWrong) && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs leading-relaxed px-1"
                    style={{ color: isCorrect ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)" }}
                  >
                    {q.explain}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={submit}
              disabled={!allAnswered}
              className="w-full py-3 rounded-2xl font-bold text-sm transition-all"
              style={allAnswered
                ? { background: "#A78BFA", color: "#050507" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }
              }
            >
              {allAnswered ? "Submit Quiz →" : `Answer all questions (${answers.filter(a => a !== null).length}/${questions.length})`}
            </motion.button>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-6 text-center"
              style={passed
                ? { background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)" }
                : { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" }
              }
            >
              <p className="text-3xl mb-2">{passed ? "🎉" : "💪"}</p>
              <p className="text-xl font-black mb-1" style={{ color: passed ? "#10B981" : "#EF4444" }}>
                {score}/{questions.length}
              </p>
              <p className="text-sm font-semibold mb-3" style={{ color: passed ? "#10B981" : "rgba(255,255,255,0.5)" }}>
                {passed ? "Quiz passed! +40 XP earned." : `Need ${PASS_THRESHOLD}/10 to pass. Try again!`}
              </p>
              {!passed && (
                <button
                  onClick={retry}
                  className="px-6 py-2 rounded-xl font-bold text-sm border border-white/15 text-white/60 hover:bg-white/5 transition-colors"
                >
                  Retry Quiz
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
