"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPass: () => void;
}

interface Question {
  level: string;
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

const questions: Question[] = [
  // Beginner (Q1-10)
  {
    level: "Beginner",
    q: "What does DMM stand for?",
    options: ["Digital Multi Meter", "Dynamic Motor Measurement", "Dual Mode Meter", "Direct Measuring Machine"],
    correct: 0,
    explain: "DMM = Digital Multi Meter. It combines voltage, current, and resistance measurement in one digital instrument.",
  },
  {
    level: "Beginner",
    q: "Which probe ALWAYS goes in the COM port?",
    options: ["Black probe", "Red probe", "Either probe", "Neither probe"],
    correct: 0,
    explain: "The BLACK probe always goes in COM (Common = Ground reference). The red probe goes in VΩ or mA depending on what you measure.",
  },
  {
    level: "Beginner",
    q: "Voltage is always measured how?",
    options: [
      "In PARALLEL with the component",
      "In SERIES with the component",
      "Only across the battery",
      "Only when circuit is off",
    ],
    correct: 0,
    explain: "Voltage is measured IN PARALLEL — both probes touch the two ends of a component at the same time. The circuit does not break.",
  },
  {
    level: "Beginner",
    q: "Current is always measured how?",
    options: [
      "In SERIES — circuit must be broken",
      "In PARALLEL — no need to break circuit",
      "Across the battery terminals",
      "Using the voltage port",
    ],
    correct: 0,
    explain: "Current is measured IN SERIES. You must break the circuit at one point and insert the ammeter into that gap so all current flows through the meter.",
  },
  {
    level: "Beginner",
    q: "When should you NEVER measure resistance?",
    options: [
      "When circuit is powered ON",
      "When circuit is powered OFF",
      "On a resistor",
      "On a disconnected component",
    ],
    correct: 0,
    explain: "NEVER measure resistance on a live (powered) circuit. The meter's internal battery and circuitry can be damaged, and readings will be wrong.",
  },
  {
    level: "Beginner",
    q: "What reading does continuity test show for a BROKEN wire?",
    options: ["OL (open line/overload)", "0 Ω", "Beep with 0.2Ω", "Infinite voltage"],
    correct: 0,
    explain: "A broken wire shows OL (Open Line/Overload) — the meter cannot measure a path because there is none. No beep is produced.",
  },
  {
    level: "Beginner",
    q: "Which port does the RED probe go in for voltage measurement?",
    options: ["VΩ port", "COM port", "mA port", "Any port"],
    correct: 0,
    explain: "The red probe goes in the VΩ port for both voltage and resistance measurements. Using the mA port for voltage can blow the internal fuse!",
  },
  {
    level: "Beginner",
    q: "A silicon diode in FORWARD bias on diode test shows approximately...",
    options: ["0.5–0.7V", "0V", "12V", "OL"],
    correct: 0,
    explain: "A silicon diode forward bias reading is typically 0.5–0.7V. This is the P-N junction's forward voltage drop.",
  },
  {
    level: "Beginner",
    q: 'What does "OL" on a multimeter display mean?',
    options: [
      "Open Line / Overload — reading exceeds range",
      "Online",
      "Optimal Level",
      "Over Limit safety stop",
    ],
    correct: 0,
    explain: "OL = Open Line / Overload. The value being measured exceeds the meter's range, or the circuit is open (no path for current).",
  },
  {
    level: "Beginner",
    q: "What is the unit of electrical resistance?",
    options: ["Ohm (Ω)", "Volt (V)", "Ampere (A)", "Watt (W)"],
    correct: 0,
    explain: "Resistance is measured in Ohms (Ω), named after Georg Simon Ohm. kΩ = 1,000Ω, MΩ = 1,000,000Ω.",
  },
  // Intermediate (Q11-15)
  {
    level: "Intermediate",
    q: "You connect a multimeter IN PARALLEL to measure current. What happens?",
    options: [
      "Near short circuit — the meter's low resistance causes huge current spike",
      "Normal reading",
      "No current flows",
      "Meter reads in volts instead",
    ],
    correct: 0,
    explain: "An ammeter has very low internal resistance (mΩ). Connecting it in parallel creates a near short circuit — most circuit current bypasses the load and flows through the meter.",
  },
  {
    level: "Intermediate",
    q: 'A multimeter reads "12.0 V" across a 9V battery. What likely happened?',
    options: [
      "Wrong range or mode selected — meter is on wrong setting",
      "Battery overcharged",
      "Correct reading",
      "The probes are reversed",
    ],
    correct: 0,
    explain: "A 9V battery cannot read 12V. The meter is likely on the wrong mode or range. Always verify the dial position before trusting a reading.",
  },
  {
    level: "Intermediate",
    q: "You want to measure the current through an LED in a circuit. What must you do?",
    options: [
      "Break the circuit at one point and insert the ammeter in series",
      "Touch probes to LED legs",
      "Place probes across the battery",
      "Use voltage port",
    ],
    correct: 0,
    explain: "To measure current through the LED, you must break the circuit at any point in the series loop and insert the ammeter into that gap.",
  },
  {
    level: "Intermediate",
    q: "A Schottky diode forward bias reading on diode test shows approximately...",
    options: ["0.2–0.4V", "0.6–0.7V", "2.0V", "OL"],
    correct: 0,
    explain: "Schottky diodes have a lower forward voltage drop (~0.2–0.4V) compared to silicon diodes (~0.6–0.7V), due to their metal-semiconductor junction.",
  },
  {
    level: "Intermediate",
    q: "Why does a voltmeter need HIGH internal resistance?",
    options: [
      "So it draws almost no current and doesn't affect the circuit being measured",
      "To measure higher voltages",
      "To be compatible with AC",
      "For safety against shorts",
    ],
    correct: 0,
    explain: "A voltmeter with high internal resistance (MΩ) draws negligible current from the circuit, ensuring the measurement doesn't change the circuit's behavior.",
  },
  // Advanced (Q16-20)
  {
    level: "Advanced",
    q: "Why does an ammeter need VERY LOW internal resistance?",
    options: [
      "To minimize voltage drop across the meter so it doesn't affect the circuit's current",
      "To increase current through meter",
      "To match LED resistance",
      "Standard design convention",
    ],
    correct: 0,
    explain: "An ammeter with very low internal resistance (mΩ) causes minimal voltage drop across itself, so inserting it doesn't significantly change the current being measured.",
  },
  {
    level: "Advanced",
    q: "You measure 0.7V across a component you suspect is a faulty LED. What does this tell you?",
    options: [
      "It may be conducting like a regular silicon diode, not emitting light — possibly burnt out",
      "LED is working perfectly",
      "LED is reverse biased",
      "Supply voltage is too low",
    ],
    correct: 0,
    explain: "A working LED typically shows its forward voltage (2.0V–3.4V). 0.7V suggests the junction is conducting like a standard silicon diode — the emitting material may have failed.",
  },
  {
    level: "Advanced",
    q: "What category rating (CAT) should a multimeter have for measuring 240V AC household mains?",
    options: [
      "CAT II or higher (CAT III preferred for fixed installations)",
      "CAT I",
      "Any category",
      "No rating needed for <1000V",
    ],
    correct: 0,
    explain: "CAT II covers receptacle-connected equipment. CAT III (panel/wiring) is preferred for fixed wiring measurements. Higher CAT = better transient protection.",
  },
  {
    level: "Advanced",
    q: "A multimeter shows 0.00Ω continuity between + and − power rails on your circuit. What does this mean?",
    options: [
      "Short circuit — somewhere + and − are directly connected",
      "Good — rails are functioning",
      "Meter is broken",
      "Normal for DC circuits",
    ],
    correct: 0,
    explain: "0Ω between + and − rails means there is a direct short circuit somewhere. Current will flow uncontrolled, potentially damaging components or the supply.",
  },
  {
    level: "Advanced",
    q: "You want to measure 5mA flowing through a circuit. Your multimeter has ports: COM, VΩ, mA-400, and 10A. Which port do you use for the red probe?",
    options: ["mA-400 port", "VΩ port", "10A port", "COM port"],
    correct: 0,
    explain: "5mA is well within the mA-400 range, so use the mA-400 port. Using the 10A port would give poor resolution for such a small current.",
  },
];

export default function Quiz({ onPass }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [passed, setPassed] = useState(false);
  const [calledPass, setCalledPass] = useState(false);

  const q = questions[current];
  const answered = answers[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (optIdx: number) => {
    if (answered !== null) return;
    const newAnswers = [...answers];
    newAnswers[current] = optIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrent((c) => c + 1);
    } else {
      const score = answers.filter((a, i) => a === questions[i].correct).length;
      const pass = score >= 14;
      setPassed(pass);
      setShowResult(true);
      if (pass && !calledPass) {
        setCalledPass(true);
        onPass();
      }
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  };

  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const progressPct = ((current + 1) / questions.length) * 100;

  const levelColors: Record<string, string> = {
    Beginner: "#10B981",
    Intermediate: "#F59E0B",
    Advanced: "#EF4444",
  };

  if (showResult) {
    return (
      <section className="px-4 sm:px-8 py-10 border-b border-white/5">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border p-6 text-center"
            style={
              passed
                ? { borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.06)" }
                : { borderColor: "rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.06)" }
            }
          >
            <div className="text-5xl mb-4">{passed ? "🏆" : "📚"}</div>
            <h3 className="text-xl font-black mb-1" style={{ color: passed ? "#10B981" : "#EF4444" }}>
              {passed ? "Quiz Passed!" : "Keep Studying"}
            </h3>
            <p className="text-white/50 text-sm mb-4">
              {score}/{questions.length} correct — {Math.round((score / questions.length) * 100)}%
              {passed ? " · +50 XP earned!" : " · Need 14/20 to pass"}
            </p>

            {/* Score bar */}
            <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score / questions.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: passed ? "#10B981" : "#EF4444" }}
              />
            </div>

            {/* Per-question summary */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {answers.map((a, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-mono"
                  style={
                    a === questions[i].correct
                      ? { background: "rgba(16,185,129,0.2)", color: "#10B981" }
                      : { background: "rgba(239,68,68,0.2)", color: "#EF4444" }
                  }
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <button
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white/50 hover:bg-white/5 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 11 · Quiz
        </p>
        <h2 className="text-xl font-bold mb-1">Knowledge Check</h2>
        <p className="text-white/40 text-sm mb-5">20 questions · pass with 14/20 · +50 XP</p>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-[10px] text-white/30 mb-1.5 font-mono">
            <span>
              Q{current + 1}/{questions.length}
            </span>
            <span>
              {score} correct
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(to right, #8B5CF6, #A78BFA)",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {/* Level badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: levelColors[q.level] ?? "#fff",
                  background: `${levelColors[q.level] ?? "#fff"}18`,
                }}
              >
                {q.level}
              </span>
              <span className="text-[9px] text-white/20 font-mono">Q{current + 1}</span>
            </div>

            {/* Question */}
            <p className="text-sm font-semibold text-white/85 mb-4 leading-relaxed">{q.q}</p>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isSelected = answered === i;
                const isAnswered = answered !== null;

                let style: React.CSSProperties = {
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                };

                if (isAnswered) {
                  if (isCorrect) {
                    style = {
                      background: "rgba(16,185,129,0.12)",
                      borderColor: "rgba(16,185,129,0.45)",
                      color: "#10B981",
                    };
                  } else if (isSelected && !isCorrect) {
                    style = {
                      background: "rgba(239,68,68,0.12)",
                      borderColor: "rgba(239,68,68,0.45)",
                      color: "#EF4444",
                    };
                  } else {
                    style = {
                      background: "rgba(255,255,255,0.01)",
                      borderColor: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.25)",
                    };
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={isAnswered}
                    className="w-full text-left rounded-xl border px-4 py-2.5 text-xs font-medium transition-all flex items-center gap-3"
                    style={style}
                  >
                    <span
                      className="shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-mono"
                      style={{ borderColor: "currentColor", opacity: 0.6 }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {isAnswered && isCorrect && (
                      <span className="ml-auto text-green-400">✓</span>
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <span className="ml-auto text-red-400">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {answered !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: answered === q.correct ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
                      background: answered === q.correct ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)",
                    }}
                  >
                    <p className="text-[10px] text-white/25 font-mono uppercase mb-1">
                      {answered === q.correct ? "Correct!" : `Incorrect — correct answer: ${q.options[q.correct]}`}
                    </p>
                    <p className="text-xs text-white/55 leading-relaxed">{q.explain}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {answered !== null && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.3)" }}
              >
                {isLast ? "See Results →" : "Next Question →"}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
