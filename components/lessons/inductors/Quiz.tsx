"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPass: () => void;
}

const questions = [
  // BEGINNER Q1-10
  {
    q: "An inductor stores energy in:",
    options: ["Electric field", "Magnetic field", "Chemical form", "Heat"],
    correct: 1,
    explain: "An inductor stores energy in the magnetic field that surrounds the coil when current flows. The more current, the stronger the field and the more energy stored (E = ½LI²).",
  },
  {
    q: "The unit of inductance is:",
    options: ["Farad", "Ohm", "Henry", "Weber"],
    correct: 2,
    explain: "The Henry (H) is the unit of inductance, named after Joseph Henry who independently discovered electromagnetic induction. 1 Henry produces 1 volt when current changes at 1 A/s.",
  },
  {
    q: "An inductor opposes:",
    options: ["Voltage changes", "Current changes", "Resistance", "Frequency"],
    correct: 1,
    explain: "An inductor opposes changes in current. This is its fundamental property — it resists both increases and decreases in current. The faster the current change, the larger the opposing voltage.",
  },
  {
    q: "The key inductor formula is:",
    options: ["V = IR", "Q = CV", "V = L × dI/dt", "P = VI"],
    correct: 2,
    explain: "V = L × dI/dt. The voltage across an inductor equals inductance times the rate of change of current. If current is steady (dI/dt = 0), the voltage across an ideal inductor is zero.",
  },
  {
    q: "When current through an inductor suddenly increases:",
    options: ["Voltage drops", "Inductor resists the increase", "Current doubles", "Nothing happens"],
    correct: 1,
    explain: "The inductor generates a back-EMF opposing the increase (Lenz's Law). This opposing voltage limits how fast current can rise, causing the exponential rise curve we see in RL circuits.",
  },
  {
    q: "The time constant of an RL circuit is:",
    options: ["τ = RC", "τ = L/R", "τ = LR", "τ = R/L"],
    correct: 1,
    explain: "τ = L/R (in seconds). Larger inductance L means it takes longer to charge. Larger resistance R means less final current and faster relative charging. The time constant determines the charging speed.",
  },
  {
    q: "At t = τ (one time constant), the current reaches what percentage of final value?",
    options: ["100%", "50%", "63.2%", "36.8%"],
    correct: 2,
    explain: "At t = τ, I = I_final × (1 - 1/e) = I_final × 63.2%. This comes from the exponential formula I(t) = I_f × (1 - e^(-t/τ)). At t = 5τ, the current is 99.3% of final — considered fully charged.",
  },
  {
    q: "Back-EMF occurs when:",
    options: ["A battery is added", "Current through inductor suddenly stops", "A resistor is added", "Voltage is steady"],
    correct: 1,
    explain: "Back-EMF is generated when the current through an inductor changes rapidly — especially when it stops suddenly. The collapsing magnetic field induces a voltage that can be much larger than the supply voltage.",
  },
  {
    q: "A flyback diode protects against:",
    options: ["Overcurrent", "Back-EMF voltage spike", "Overheating", "Short circuit"],
    correct: 1,
    explain: "A flyback (or freewheeling) diode placed in parallel with an inductive load catches the back-EMF spike when current is interrupted. Without it, the spike can destroy transistors, MOSFETs, and other semiconductors.",
  },
  {
    q: "Motors contain inductors because:",
    options: ["They are cheaper", "Their windings are coils of wound wire", "They run at higher speed", "They weigh less"],
    correct: 1,
    explain: "Motor windings are literally coils of wire — they are inductors. This is why motors require flyback protection and why motor current doesn't change instantly. All electromagnetic actuators (relays, solenoids, motors) are inductive.",
  },
  // INTERMEDIATE Q11-15
  {
    q: "L = 100 mH, R = 100 Ω. What is the time constant τ?",
    options: ["100 ms", "10 ms", "1 ms", "0.1 ms"],
    correct: 2,
    explain: "τ = L/R = 0.1 H / 100 Ω = 0.001 s = 1 ms. Remember to convert mH to H first: 100 mH = 0.1 H.",
  },
  {
    q: "In an RL circuit: V = 12 V, R = 200 Ω. What is the final (steady-state) current?",
    options: ["60 mA", "120 mA", "600 mA", "6 mA"],
    correct: 0,
    explain: "At steady state, the inductor acts as a short circuit (ideal). I_final = V/R = 12V / 200Ω = 0.06A = 60 mA. The inductance doesn't affect the final current, only how fast it is reached.",
  },
  {
    q: "Energy stored in an inductor: L = 10 mH, I = 2 A. What is E?",
    options: ["20 mJ", "40 mJ", "20 µJ", "40 µJ"],
    correct: 0,
    explain: "E = ½LI² = ½ × 0.01 H × (2A)² = ½ × 0.01 × 4 = 0.02 J = 20 mJ.",
  },
  {
    q: "A buck converter has 12 V input and 50% duty cycle. What is the output voltage?",
    options: ["24 V", "6 V", "12 V", "3 V"],
    correct: 1,
    explain: "Buck converter: V_out = D × V_in = 0.5 × 12 V = 6 V. The duty cycle D (0 to 1) is the fraction of time the switch is ON. At D = 0.5 (50%), the output is half the input.",
  },
  {
    q: "A boost converter has 5 V input and D = 0.5. What is the output?",
    options: ["2.5 V", "5 V", "10 V", "15 V"],
    correct: 2,
    explain: "Boost converter: V_out = V_in / (1 - D) = 5V / (1 - 0.5) = 5V / 0.5 = 10 V. Boost converters always produce more voltage than the input — hence 'boost'.",
  },
  // ADVANCED Q16-20
  {
    q: "L = 1 H, current changes from 2 A to 0 A in 1 ms. What is the back-EMF magnitude?",
    options: ["1 V", "1000 V", "2000 V", "500 V"],
    correct: 2,
    explain: "V = -L × dI/dt = -1 H × (-2A / 0.001s) = -1 × (-2000) = 2000 V! This demonstrates how even moderate current in a large inductor, switched quickly, produces enormous voltage spikes.",
  },
  {
    q: "Why does inductor saturation reduce its effectiveness?",
    options: ["Resistance increases", "Inductance drops drastically", "Current increases uncontrollably", "The core melts"],
    correct: 1,
    explain: "When an inductor's magnetic core saturates (all magnetic domains aligned), it can no longer store more magnetic energy. The effective inductance drops dramatically (sometimes 80%+), destroying converter efficiency and causing thermal runaway.",
  },
  {
    q: "In a relay driver circuit (NPN transistor + relay coil), where is the flyback diode placed?",
    options: ["In series with the relay coil", "In parallel with the relay coil, anode to GND", "On the transistor base", "No diode is needed"],
    correct: 1,
    explain: "The diode is placed in parallel with the relay coil, with its anode connected to GND and cathode to V+. When the transistor turns off, the coil's back-EMF is clamped by the diode, protecting the transistor's collector.",
  },
  {
    q: "An LC resonant circuit has L = 1 mH and C = 1 µF. What is the resonant frequency?",
    options: ["1 kHz", "5033 Hz", "100 Hz", "10 kHz"],
    correct: 1,
    explain: "f = 1/(2π√(LC)) = 1/(2π × √(0.001 × 0.000001)) = 1/(2π × √(1×10⁻⁹)) = 1/(2π × 31.62×10⁻⁶) ≈ 1/0.0001987 ≈ 5033 Hz.",
  },
  {
    q: "Skin effect in inductors at high frequency causes:",
    options: ["Inductance to increase", "DC resistance to drop", "Effective resistance to increase", "Capacitance to increase"],
    correct: 2,
    explain: "At high frequencies, current concentrates on the outer surface of conductors ('skin effect'). This reduces the effective cross-sectional area, increasing AC resistance (R_AC >> R_DC). It causes heating and reduces Q factor of inductors at high frequencies.",
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
        <h2 className="text-xl font-bold mb-1">Inductors Quiz</h2>
        <p className="text-white/45 text-sm mb-4">
          20 questions — pass at 14/20 (70%) to earn{" "}
          <span style={{ color: "#EC4899" }}>+50 XP</span>
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
                borderColor: passed ? "rgba(236,72,153,0.4)" : "rgba(239,68,68,0.35)",
                background: passed ? "rgba(236,72,153,0.08)" : "rgba(239,68,68,0.07)",
              }}
            >
              <p className="text-2xl font-black mb-1" style={{ color: passed ? "#EC4899" : "#EF4444" }}>
                {score}/20
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: passed ? "#EC4899" : "#EF4444" }}>
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
                          ? "rgba(236,72,153,0.1)"
                          : isIntermediate
                          ? "rgba(14,165,233,0.1)"
                          : "rgba(251,146,60,0.1)",
                        color: isBeginner
                          ? "#EC4899"
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
                        style = { background: "rgba(236,72,153,0.12)", borderColor: "rgba(236,72,153,0.4)", color: "#EC4899" };
                      } else if (oi === userAnswer && oi !== q.correct) {
                        style = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" };
                      }
                    } else if (userAnswer === oi) {
                      style = { background: "rgba(236,72,153,0.1)", borderColor: "rgba(236,72,153,0.3)", color: "rgba(255,255,255,0.85)" };
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
                            ? "rgba(236,72,153,0.04)"
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
              background: allAnswered ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${allAnswered ? "rgba(236,72,153,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: allAnswered ? "#EC4899" : "rgba(255,255,255,0.3)",
            }}
          >
            {allAnswered ? "Submit Quiz →" : `Answer all ${questions.length} questions to submit`}
          </button>
        )}

        {submitted && passed && (
          <div
            className="w-full py-3 rounded-xl font-bold text-sm text-center"
            style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", color: "#EC4899" }}
          >
            Quiz Passed! +50 XP earned
          </div>
        )}
      </div>
    </section>
  );
}
