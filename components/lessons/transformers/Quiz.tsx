"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPass: () => void;
}

const questions = [
  // BEGINNER Q1-10
  {
    q: "Which is the correct turns ratio formula?",
    options: [
      "V_p × V_s = N_p / N_s",
      "V_p / V_s = N_p / N_s",
      "V_p = V_s × N",
      "V_s = N_p × V_p",
    ],
    correct: 1,
    explain: "The turns ratio formula is V_p/V_s = N_p/N_s. Primary voltage over secondary voltage equals primary turns over secondary turns.",
  },
  {
    q: "A step-down transformer has:",
    options: [
      "N_s > N_p (more secondary turns)",
      "N_p > N_s (more primary turns)",
      "N_p = N_s (equal turns)",
      "No windings at all",
    ],
    correct: 1,
    explain: "Step-down means the voltage goes DOWN. More primary turns than secondary: N_p > N_s. The voltage ratio equals the turns ratio — fewer secondary turns means lower output voltage.",
  },
  {
    q: "Transformers work with:",
    options: [
      "DC only",
      "AC only",
      "Both AC and DC equally",
      "Neither AC nor DC",
    ],
    correct: 1,
    explain: "Transformers ONLY work with AC. DC produces constant magnetic flux (dΦ/dt = 0), so no EMF is induced. Transformers rely on CHANGING magnetic flux from AC.",
  },
  {
    q: "A transformer has 100 primary turns and 200 secondary turns. What is the turns ratio N_s/N_p?",
    options: [
      "0.5",
      "2",
      "300",
      "100",
    ],
    correct: 1,
    explain: "N_s/N_p = 200/100 = 2. This is a step-up transformer — the secondary has twice as many turns, so output voltage is twice the input voltage.",
  },
  {
    q: "A transformer has 100 primary turns, 200 secondary turns, and 10V input. What is the output voltage?",
    options: [
      "5V",
      "10V",
      "20V",
      "200V",
    ],
    correct: 2,
    explain: "V_out = V_in × (N_s/N_p) = 10V × (200/100) = 10V × 2 = 20V. More secondary turns → higher output voltage.",
  },
  {
    q: "Why does the power grid use very high voltage for transmission?",
    options: [
      "To generate more power at the source",
      "To reduce I²R transmission losses in the wires",
      "To increase current through the lines",
      "To keep the wires cool through high resistance",
    ],
    correct: 1,
    explain: "P_loss = I²R. High voltage → low current → dramatically less I²R heat loss. This is why transformers (enabling AC high voltage) are so important for power distribution.",
  },
  {
    q: "The operating principle of a transformer is:",
    options: [
      "Static electricity between plates",
      "Electromagnetic induction (Faraday's Law)",
      "Photoelectric effect",
      "Thermoelectric effect",
    ],
    correct: 1,
    explain: "Transformers work by electromagnetic induction — Faraday's Law. Changing current in the primary creates changing flux, which induces EMF in the secondary: EMF = −N × dΦ/dt.",
  },
  {
    q: "An isolation transformer has a turns ratio of:",
    options: [
      "10:1",
      "1:10",
      "1:1",
      "Variable (adjustable)",
    ],
    correct: 2,
    explain: "An isolation transformer has a 1:1 turns ratio — same voltage in and out. Its purpose is not to change voltage but to break the electrical connection to earth ground for safety.",
  },
  {
    q: "The core material most commonly used in 50Hz/60Hz power transformers is:",
    options: [
      "Air (no core)",
      "Copper wire",
      "Silicon steel (laminated)",
      "Ferrite ceramic",
    ],
    correct: 2,
    explain: "Silicon steel laminated cores are used for power frequency (50/60Hz) transformers. Laminations reduce eddy currents. Silicon increases electrical resistance of the steel.",
  },
  {
    q: "Laminating a transformer core into thin sheets reduces:",
    options: [
      "Hysteresis losses",
      "Eddy current losses",
      "Copper winding losses",
      "Magnetic permeability",
    ],
    correct: 1,
    explain: "Laminated cores reduce EDDY CURRENT losses. Eddy currents are induced in the core itself by the changing flux. Thin sheets with insulation between them restrict these circulating currents.",
  },
  // INTERMEDIATE Q11-15
  {
    q: "A transformer: N_p=500, N_s=50, V_p=240V. What is V_s?",
    options: [
      "2400V",
      "24V",
      "240V",
      "12V",
    ],
    correct: 1,
    explain: "V_s = V_p × (N_s/N_p) = 240 × (50/500) = 240 × 0.1 = 24V. This is a 10:1 step-down transformer.",
  },
  {
    q: "Same transformer (N_p=500, N_s=50). If I_p = 0.1A, what is I_s?",
    options: [
      "0.01A",
      "1A",
      "10A",
      "0.1A",
    ],
    correct: 1,
    explain: "I_s = I_p × (N_p/N_s) = 0.1 × (500/50) = 0.1 × 10 = 1A. Current ratio is INVERSE of turns ratio. Step-down voltage → step-up current (power conserved).",
  },
  {
    q: "A transformer primary has 240V at 0.5A. What is the input power?",
    options: [
      "60W",
      "120W",
      "240W",
      "480W",
    ],
    correct: 1,
    explain: "P = V × I = 240V × 0.5A = 120W. For an ideal transformer, output power also equals 120W (P_in = P_out).",
  },
  {
    q: "A transformer is 96% efficient with P_in = 1000W. What is P_out?",
    options: [
      "960W",
      "1040W",
      "1000W",
      "40W",
    ],
    correct: 0,
    explain: "P_out = η × P_in = 0.96 × 1000W = 960W. The 40W difference is lost as heat (core + copper losses). Real transformers are NOT 100% efficient.",
  },
  {
    q: "Ferrite cores are used in switching power supplies because they work best at:",
    options: [
      "50Hz mains frequency",
      "60Hz mains frequency",
      "kHz to MHz range (high frequency)",
      "DC only",
    ],
    correct: 2,
    explain: "Ferrite has high electrical resistivity, so eddy currents are naturally suppressed even at high frequencies. Perfect for switching power supplies (SMPS) operating at 20kHz–2MHz.",
  },
  // ADVANCED Q16-20
  {
    q: "Which core loss type is specifically reduced by using thin laminations?",
    options: [
      "Hysteresis loss",
      "Eddy current loss",
      "Copper (I²R) loss",
      "All losses equally",
    ],
    correct: 1,
    explain: "Eddy current losses are reduced by laminations. The thin insulated layers restrict the paths available for eddy currents. Hysteresis is reduced by silicon steel material choice, not lamination.",
  },
  {
    q: "Why can't a transformer operate with DC applied to the primary?",
    options: [
      "DC is too dangerous for transformer insulation",
      "DC produces constant flux (dΦ/dt = 0) so no EMF is induced in the secondary",
      "DC has the wrong frequency for the core",
      "The core saturates immediately and becomes a conductor",
    ],
    correct: 1,
    explain: "Faraday's Law: EMF = −N × dΦ/dt. DC produces steady, constant magnetic flux. dΦ/dt = 0, so induced EMF = 0. No induction occurs. The primary winding simply acts as a resistor, heating up.",
  },
  {
    q: "A step-up autotransformer has a single winding of 300 turns total, tapped at 180 turns for the output. With 120V applied across all 300 turns, what is V_out?",
    options: [
      "120V",
      "72V",
      "200V",
      "240V",
    ],
    correct: 1,
    explain: "V_out = V_in × (N_tap/N_total) = 120 × (180/300) = 120 × 0.6 = 72V. The tap provides 180 of 300 turns — a fraction of the full winding.",
  },
  {
    q: "A flyback transformer in a switching power supply stores energy in:",
    options: [
      "The primary capacitor",
      "The secondary winding directly",
      "The core air gap",
      "The primary winding inductance",
    ],
    correct: 2,
    explain: "Flyback transformers deliberately include an air gap in the core to store magnetic energy (like an inductor). During the primary on-phase, energy is stored. During off-phase, energy transfers to secondary. This is different from conventional transformers.",
  },
  {
    q: "Faraday's Law: EMF = −N × dΦ/dt. A 100-turn coil has flux changing at 0.01Wb in 0.001s. What is the induced EMF?",
    options: [
      "1V",
      "1000V",
      "100V",
      "10V",
    ],
    correct: 1,
    explain: "EMF = N × (dΦ/dt) = 100 × (0.01Wb / 0.001s) = 100 × 10 = 1000V. The rate of flux change (dΦ/dt = 10 Wb/s) multiplied by turns (100) gives 1000V EMF.",
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
    setAnswers((prev) => {
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

  const allAnswered = answers.every((a) => a !== null);
  const passed = submitted && score >= PASS_THRESHOLD;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 12 · Quiz
        </p>
        <h2 className="text-xl font-bold mb-1">Transformers Quiz</h2>
        <p className="text-white/45 text-sm mb-4">
          20 questions — pass at 14/20 (70%) to earn{" "}
          <span style={{ color: "#8B5CF6" }}>+50 XP</span>
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
                borderColor: passed ? "rgba(139,92,246,0.4)" : "rgba(239,68,68,0.35)",
                background: passed ? "rgba(139,92,246,0.08)" : "rgba(239,68,68,0.07)",
              }}
            >
              <p className="text-2xl font-black mb-1" style={{ color: passed ? "#8B5CF6" : "#EF4444" }}>
                {score}/20
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: passed ? "#8B5CF6" : "#EF4444" }}>
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
                          ? "rgba(139,92,246,0.1)"
                          : isIntermediate
                          ? "rgba(14,165,233,0.1)"
                          : "rgba(251,146,60,0.1)",
                        color: isBeginner
                          ? "#8B5CF6"
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
                    let optStyle: React.CSSProperties = {
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.6)",
                    };
                    if (submitted) {
                      if (oi === q.correct) {
                        optStyle = { background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.4)", color: "#8B5CF6" };
                      } else if (oi === userAnswer && oi !== q.correct) {
                        optStyle = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" };
                      }
                    } else if (userAnswer === oi) {
                      optStyle = { background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.3)", color: "rgba(255,255,255,0.85)" };
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelect(qi, oi)}
                        disabled={submitted}
                        className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all disabled:cursor-default hover:opacity-90"
                        style={optStyle}
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
                            ? "rgba(139,92,246,0.04)"
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

        {/* Submit button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: allAnswered ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${allAnswered ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: allAnswered ? "#8B5CF6" : "rgba(255,255,255,0.3)",
            }}
          >
            {allAnswered ? "Submit Quiz →" : `Answer all ${questions.length} questions to submit`}
          </button>
        )}

        {submitted && passed && (
          <div
            className="w-full py-3 rounded-xl font-bold text-sm text-center"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#8B5CF6" }}
          >
            Quiz Passed! +50 XP earned
          </div>
        )}
      </div>
    </section>
  );
}
