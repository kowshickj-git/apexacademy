"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPass: () => void;
}

const questions = [
  // BEGINNER Q1-10
  {
    q: "What does a breadboard allow you to do WITHOUT?",
    options: ["Soldering", "Electricity", "Components", "Wires"],
    correct: 0,
    explain: "A breadboard is a solderless platform — you push components in and pull them out without any heat or permanent connections.",
  },
  {
    q: "Holes A1, B1, C1, D1 and E1 on a breadboard are...",
    options: [
      "All electrically connected",
      "All separate",
      "Connected only if same voltage",
      "Connected by the center gap",
    ],
    correct: 0,
    explain: "Internal metal clips connect all holes in the same row on the same side (A–E). They share a single electrical node.",
  },
  {
    q: "Are holes A1 and F1 on a breadboard electrically connected?",
    options: [
      "No — the center gap separates them",
      "Yes — same row",
      "Yes — via power rail",
      "Only when powered",
    ],
    correct: 0,
    explain: "The center gap physically separates the left (A–E) and right (F–J) columns. A1 and F1 are NOT connected — they are different electrical nodes.",
  },
  {
    q: "What do the RED stripes on breadboard power rails indicate?",
    options: [
      "Positive (+) supply",
      "Negative (−) ground",
      "High current",
      "Warning danger",
    ],
    correct: 0,
    explain: "Red = positive (+). Blue or black = negative/ground (−). This colour coding is universal across breadboard manufacturers.",
  },
  {
    q: "How many holes share a connection in each terminal strip row?",
    options: ["5", "10", "2", "30"],
    correct: 0,
    explain: "Each half-row has 5 holes: A, B, C, D, E (left side) or F, G, H, I, J (right side). All 5 are connected by an internal metal clip.",
  },
  {
    q: "What is the CENTER GAP of a breadboard primarily designed for?",
    options: [
      "DIP (Dual Inline Package) integrated circuits",
      "Separating positive from negative",
      "Making rows longer",
      "Aesthetic purposes",
    ],
    correct: 0,
    explain: "The center gap (~7.6mm) matches the body width of DIP ICs. The IC sits across the gap with pins in rows on each side, keeping each pin isolated.",
  },
  {
    q: "Power rails on a breadboard run...",
    options: [
      "Along the LENGTH (vertically when viewed lengthwise)",
      "Across the WIDTH",
      "Diagonally",
      "In a circle",
    ],
    correct: 0,
    explain: "Power rails run along the full length of the board (horizontally when you look at the breadboard from above). All holes in one rail are connected.",
  },
  {
    q: "The standard hole-to-hole spacing on a breadboard is...",
    options: ["0.1 inch (2.54mm)", "1mm", "5mm", "0.5 inch"],
    correct: 0,
    explain: "2.54mm (0.1\") is the universal standard — it matches the pin spacing of DIP components, making them a perfect fit.",
  },
  {
    q: "Can a breadboard be reused?",
    options: [
      "Yes, many times",
      "No, single use",
      "Only 3 times",
      "Only with new components",
    ],
    correct: 0,
    explain: "Breadboards are completely reusable. The internal metal clips spring back after a component is removed, ready for the next circuit.",
  },
  {
    q: "Which colour marks the NEGATIVE (ground) power rail?",
    options: ["Blue or Black", "Red", "Green", "Yellow"],
    correct: 0,
    explain: "Blue or black marks the negative/ground rail. Red always marks positive. This colour convention is consistent across all breadboard brands.",
  },
  // INTERMEDIATE Q11-15
  {
    q: "An LED has BOTH legs placed in row 7 (holes C7 and D7). What happens when power is applied?",
    options: [
      "The LED does not light — both legs share the same node, so no voltage difference",
      "The LED lights normally",
      "The LED flashes",
      "The board short-circuits",
    ],
    correct: 0,
    explain: "C7 and D7 are in the same row on the same side — they are the same electrical node. No voltage difference means no current through the LED.",
  },
  {
    q: "A resistor is placed with one leg in A3 and the other in A7. These holes are...",
    options: [
      "Different rows — NOT connected internally; the resistor bridges them",
      "The same row — already connected",
      "Connected via the power rail",
      "On opposite sides of the center gap",
    ],
    correct: 0,
    explain: "A3 (row 3) and A7 (row 7) are different rows — each row is a separate node. The resistor creates a path between row 3 and row 7.",
  },
  {
    q: "What type of IC package is designed to sit across the breadboard center gap?",
    options: [
      "DIP (Dual Inline Package)",
      "SMD (Surface Mount Device)",
      "BGA (Ball Grid Array)",
      "QFP (Quad Flat Package)",
    ],
    correct: 0,
    explain: "DIP packages have two parallel rows of pins exactly 7.62mm (0.3\") apart — matching the breadboard center gap width perfectly.",
  },
  {
    q: "You place a wire from hole E5 to hole F5. What does this accomplish?",
    options: [
      "It bridges the center gap, connecting left row 5 (A–E) to right row 5 (F–J)",
      "Nothing — they're already connected",
      "It creates a short circuit",
      "It connects two power rails",
    ],
    correct: 0,
    explain: "E5 is the last hole on the left side of row 5. F5 is the first hole on the right side. A wire between them bridges the center gap.",
  },
  {
    q: "Why should you ALWAYS use a current-limiting resistor with an LED?",
    options: [
      "Without it, too much current flows and destroys the LED",
      "The resistor makes the LED brighter",
      "The LED won't fit otherwise",
      "Breadboards require resistors by design",
    ],
    correct: 0,
    explain: "LEDs have no built-in current limiting. Without a resistor, current increases until the LED burns out. The resistor sets a safe operating current (typically 10–20mA).",
  },
  // ADVANCED Q16-20
  {
    q: "A half-size breadboard has 30 rows of terminal strips. Ignoring power rails, how many distinct electrical nodes does the terminal strip section have?",
    options: [
      "60 (30 left-side groups + 30 right-side groups)",
      "30",
      "150",
      "300",
    ],
    correct: 0,
    explain: "Each row has 2 independent groups (left A–E, right F–J). With 30 rows: 30 × 2 = 60 distinct electrical nodes.",
  },
  {
    q: "You are testing a 555 timer IC (DIP-8, 8 pins, 4 on each side). How does it sit on a breadboard?",
    options: [
      "Across the center gap — 4 pins in rows on the left, 4 pins in rows on the right",
      "All 8 pins in one row",
      "Along the power rail",
      "Parallel to the center gap",
    ],
    correct: 0,
    explain: "DIP-8 has 4 pins on each side. The IC body spans the center gap with 4 pins entering rows A–E and 4 pins entering rows F–J, keeping every pin isolated.",
  },
  {
    q: "Why are breadboards NOT suitable for high-frequency circuits above ~1MHz?",
    options: [
      "The internal metal clips have parasitic capacitance and inductance that degrade signals at high frequency",
      "Components fall out at high speed",
      "The plastic melts",
      "LEDs don't work at high frequency",
    ],
    correct: 0,
    explain: "The metal clips and long wire connections have parasitic inductance (~10nH) and capacitance (~2pF). At MHz frequencies these cause signal degradation, ringing, and cross-talk.",
  },
  {
    q: "A student connects the + power rail directly to the − power rail with a wire. What happens?",
    options: [
      "Short circuit — maximum current flows, battery/power supply may be damaged",
      "Nothing happens",
      "A useful ground connection forms",
      "The breadboard is reset",
    ],
    correct: 0,
    explain: "Shorting + to − creates zero resistance — current spikes to the maximum the supply can deliver. Batteries can overheat and burst; power supplies trip over-current protection.",
  },
  {
    q: "When building an LED circuit (5V supply, red LED Vf=2V, target If=20mA), which resistor value should you use, and where does it connect?",
    options: [
      "150Ω, in series between + rail and LED anode",
      "150Ω, in parallel with the LED",
      "1kΩ, directly across power rails",
      "No resistor needed",
    ],
    correct: 0,
    explain: "R = (Vsupply − Vf) / If = (5V − 2V) / 0.02A = 150Ω. It goes IN SERIES with the LED (not in parallel) to limit current through the LED.",
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
          Section 9 · Quiz
        </p>
        <h2 className="text-xl font-bold mb-1">Breadboard Quiz</h2>
        <p className="text-white/45 text-sm mb-1">
          20 questions — pass at 14/20 (70%) to earn <span style={{ color: "#14B8A6" }}>+50 XP</span>
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
                borderColor: passed ? "rgba(20,184,166,0.4)" : "rgba(239,68,68,0.35)",
                background: passed ? "rgba(20,184,166,0.08)" : "rgba(239,68,68,0.07)",
              }}
            >
              <p className="text-2xl font-black mb-1" style={{ color: passed ? "#14B8A6" : "#EF4444" }}>
                {score}/20
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: passed ? "#14B8A6" : "#EF4444" }}>
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
                          ? "rgba(20,184,166,0.1)"
                          : isIntermediate
                          ? "rgba(14,165,233,0.1)"
                          : "rgba(251,146,60,0.1)",
                        color: isBeginner
                          ? "#14B8A6"
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
                        style = { background: "rgba(20,184,166,0.12)", borderColor: "rgba(20,184,166,0.4)", color: "#14B8A6" };
                      } else if (oi === userAnswer && oi !== q.correct) {
                        style = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" };
                      }
                    } else if (userAnswer === oi) {
                      style = { background: "rgba(20,184,166,0.1)", borderColor: "rgba(20,184,166,0.3)", color: "rgba(255,255,255,0.85)" };
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
                            ? "rgba(20,184,166,0.04)"
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
              background: allAnswered ? "rgba(20,184,166,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${allAnswered ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: allAnswered ? "#14B8A6" : "rgba(255,255,255,0.3)",
            }}
          >
            {allAnswered ? "Submit Quiz →" : `Answer all ${questions.length} questions to submit`}
          </button>
        )}

        {submitted && passed && (
          <div
            className="w-full py-3 rounded-xl font-bold text-sm text-center"
            style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.3)", color: "#14B8A6" }}
          >
            Quiz Passed! +50 XP earned
          </div>
        )}
      </div>
    </section>
  );
}
