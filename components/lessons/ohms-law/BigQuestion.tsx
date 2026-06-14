"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    q: "If you INCREASE the voltage — what happens to the current?",
    options: ["Current stays the same", "Current increases", "Current decreases", "Not sure"],
    reveal: "Current increases! More push = more flow. Double the voltage, double the current.",
    correct: 1,
  },
  {
    q: "If you INCREASE the resistance — what happens to the current?",
    options: ["Current stays the same", "Current increases", "Current decreases", "Not sure"],
    reveal: "Current decreases! More opposition = less flow. Double the resistance, half the current.",
    correct: 2,
  },
];

export default function BigQuestion() {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false]);

  const answer = (qi: number, oi: number) => {
    if (revealed[qi]) return;
    const newAnswers = [...answers]; newAnswers[qi] = oi;
    const newRevealed = [...revealed]; newRevealed[qi] = true;
    setAnswers(newAnswers);
    setRevealed(newRevealed);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 2 · Think First</p>
        <h2 className="text-xl font-bold mb-1">The Big Question</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Before we reveal Ohm&apos;s Law, take a guess. What do <em>you</em> think happens?
          There&apos;s no penalty — just think it through and pick your answer.
        </p>

        <div className="space-y-5">
          {questions.map((q, qi) => (
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: qi * 0.1 }}
              className="rounded-2xl border border-white/7 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="px-5 py-4 border-b border-white/5">
                <p className="text-sm font-semibold text-white/85">
                  <span className="text-primary mr-2">Q{qi + 1}.</span>{q.q}
                </p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = oi === q.correct;
                  let style = { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" };
                  if (revealed[qi]) {
                    if (isCorrect) style = { background: "rgba(16,185,129,0.12)", borderColor: "#10B981", color: "#10B981" };
                    else if (isSelected) style = { background: "rgba(239,68,68,0.1)", borderColor: "#EF4444", color: "#EF4444" };
                  } else if (isSelected) {
                    style = { background: "rgba(14,165,233,0.1)", borderColor: "#0EA5E9", color: "#0EA5E9" };
                  }
                  return (
                    <button
                      key={oi}
                      disabled={revealed[qi]}
                      onClick={() => answer(qi, oi)}
                      className="px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all"
                      style={style}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {revealed[qi] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-primary/15 px-5 py-3 overflow-hidden"
                    style={{ background: "rgba(16,185,129,0.05)" }}
                  >
                    <p className="text-xs text-primary font-semibold mb-0.5">✓ Answer revealed</p>
                    <p className="text-xs text-white/60 leading-relaxed">{q.reveal}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-5 p-4 rounded-xl border border-white/7 flex gap-3"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <span className="text-lg">🤔</span>
          <p className="text-xs text-white/40 leading-relaxed">
            You just discovered the core of Ohm&apos;s Law by intuition. Now let&apos;s make it exact with a formula
            — and prove it with a visual experiment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
