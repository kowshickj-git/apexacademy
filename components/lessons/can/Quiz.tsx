"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const COLOR = "#EF4444";
const PASS_SCORE = 14;

const questions = [
  {
    q: "CAN was developed by:",
    opts: ["Intel", "Bosch", "Motorola", "Texas Instruments"],
    correct: 1,
  },
  {
    q: "CAN bus uses:",
    opts: ["Four wires", "Three wires", "Two wires (CAN-H and CAN-L)", "Single wire"],
    correct: 2,
  },
  {
    q: "Dominant bit voltages:",
    opts: ["Both 2.5V", "CAN-H=3.5V CAN-L=1.5V", "CAN-H=5V CAN-L=0V", "CAN-H=1.5V CAN-L=3.5V"],
    correct: 1,
  },
  {
    q: "Lower CAN ID number means:",
    opts: ["Lower priority", "Same priority", "Higher priority", "Random priority"],
    correct: 2,
  },
  {
    q: "CAN arbitration is:",
    opts: ["Destructive", "Non-destructive", "Random", "Priority-based and destructive"],
    correct: 1,
  },
  {
    q: "Maximum data in classic CAN frame:",
    opts: ["4 bytes", "8 bytes", "16 bytes", "64 bytes"],
    correct: 1,
  },
  {
    q: "Termination resistor value:",
    opts: ["50Ω", "75Ω", "120Ω", "220Ω"],
    correct: 2,
  },
  {
    q: "CAN SOF bit is:",
    opts: ["Recessive (1)", "Dominant (0)", "Either", "Undefined"],
    correct: 1,
  },
  {
    q: "CAN error frame consists of:",
    opts: ["3 dominant bits", "6 dominant bits error flag", "12 recessive bits", "8 bits total"],
    correct: 1,
  },
  {
    q: "CAN FD can carry up to:",
    opts: ["8 bytes", "32 bytes", "64 bytes", "128 bytes"],
    correct: 2,
  },
  {
    q: "Maximum classic CAN speed:",
    opts: ["100 kbps", "500 kbps", "1 Mbps", "10 Mbps"],
    correct: 2,
  },
  {
    q: "CAN is standardized as:",
    opts: ["IEEE 802.3", "ISO 11898", "RS-232", "ITU-T V.35"],
    correct: 1,
  },
  {
    q: "OBD-II uses CAN at:",
    opts: ["125 kbps", "250 kbps", "500 kbps", "1 Mbps"],
    correct: 2,
  },
  {
    q: "CAN transceiver chip example:",
    opts: ["MAX232", "MCP2551 or SN65HVD230", "LM358", "NE555"],
    correct: 1,
  },
  {
    q: "CRC in CAN frame is:",
    opts: ["8 bits", "12 bits", "15 bits", "32 bits"],
    correct: 2,
  },
  {
    q: "What is bit stuffing?",
    opts: [
      "Compressing data",
      "After 5 consecutive same bits insert opposite",
      "Adding parity bit",
      "Encoding data as ASCII",
    ],
    correct: 1,
  },
  {
    q: "CAN ACK slot is pulled:",
    opts: [
      "Recessive by transmitter",
      "Dominant by receiving nodes",
      "High by all nodes",
      "Low by transmitter",
    ],
    correct: 1,
  },
  {
    q: "How many 120Ω resistors needed?",
    opts: ["1", "2 (one at each end)", "3", "4"],
    correct: 1,
  },
  {
    q: "A typical modern car has how many ECUs?",
    opts: ["5-10", "20-30", "70-100", "200+"],
    correct: 2,
  },
  {
    q: "CAN DLC field specifies:",
    opts: ["Message priority", "Number of data bytes (0-8)", "Baud rate", "Node address"],
    correct: 1,
  },
];

type Phase = "quiz" | "result";

export default function Quiz({ onPass }: Props) {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [passedCalled, setPassedCalled] = useState(false);

  const score = answers.reduce<number>((acc, a, i) => (a === questions[i].correct ? acc + 1 : acc), 0);

  const handleSelect = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    const filled = answers.every((a) => a !== null);
    if (!filled) return;
    setSubmitted(true);
    setPhase("result");
    if (score >= PASS_SCORE && !passedCalled) {
      setPassedCalled(true);
      onPass();
    }
  }, [answers, score, passedCalled, onPass]);

  const handleRetry = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setPhase("quiz");
  };

  const allAnswered = answers.every((a) => a !== null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>
          CAN Protocol Quiz
        </h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.45)" }}>
          20 questions · Pass with {PASS_SCORE}/20 to earn 50 XP
        </p>

        <AnimatePresence mode="wait">
          {phase === "result" ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div
                className="text-5xl font-black mb-2"
                style={{ color: score >= PASS_SCORE ? "#10B981" : COLOR }}
              >
                {score}/{questions.length}
              </div>
              <div
                className="text-lg font-bold mb-1"
                style={{ color: score >= PASS_SCORE ? "#10B981" : COLOR }}
              >
                {score >= PASS_SCORE ? "Passed! 🎉" : "Keep Studying"}
              </div>
              <div
                className="text-sm mb-6"
                style={{ color: "rgba(240,240,245,0.5)" }}
              >
                {score >= PASS_SCORE
                  ? `Excellent! You scored ${score}/20 — CAN Protocol mastered!`
                  : `You scored ${score}/20 — need ${PASS_SCORE} to pass. Review and try again.`}
              </div>

              {/* Answer review */}
              <div className="text-left space-y-3 mb-6">
                {questions.map((q, i) => {
                  const correct = answers[i] === q.correct;
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-3"
                      style={{
                        background: correct
                          ? "rgba(16,185,129,0.07)"
                          : "rgba(239,68,68,0.07)",
                        border: `1px solid ${correct ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className="text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ color: correct ? "#10B981" : COLOR }}
                        >
                          {correct ? "✓" : "✗"}
                        </span>
                        <div>
                          <div
                            className="text-xs font-semibold mb-1"
                            style={{ color: "rgba(240,240,245,0.8)" }}
                          >
                            Q{i + 1}: {q.q}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: correct ? "#10B981" : "rgba(240,240,245,0.45)" }}
                          >
                            Your answer: {answers[i] !== null ? q.opts[answers[i]!] : "—"}
                          </div>
                          {!correct && (
                            <div
                              className="text-xs"
                              style={{ color: "#10B981" }}
                            >
                              Correct: {q.opts[q.correct]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleRetry}
                className="px-6 py-2.5 rounded-xl font-bold text-sm"
                style={{
                  background:
                    score >= PASS_SCORE
                      ? "rgba(16,185,129,0.12)"
                      : `linear-gradient(135deg, ${COLOR}, #DC2626)`,
                  color: score >= PASS_SCORE ? "#10B981" : "#fff",
                  border: score >= PASS_SCORE ? "1px solid rgba(16,185,129,0.3)" : "none",
                  cursor: "pointer",
                  boxShadow:
                    score >= PASS_SCORE
                      ? "none"
                      : `0 4px 16px rgba(239,68,68,0.3)`,
                }}
              >
                {score >= PASS_SCORE ? "Retake Quiz" : "Try Again →"}
              </button>
            </motion.div>
          ) : (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-6">
                {questions.map((q, qi) => (
                  <div key={qi}>
                    <div
                      className="text-sm font-semibold mb-3"
                      style={{ color: "#F0F0F5" }}
                    >
                      <span
                        className="font-mono text-xs mr-2"
                        style={{ color: "rgba(239,68,68,0.6)" }}
                      >
                        Q{qi + 1}
                      </span>
                      {q.q}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.opts.map((opt, oi) => {
                        const selected = answers[qi] === oi;
                        return (
                          <button
                            key={oi}
                            onClick={() => handleSelect(qi, oi)}
                            className="text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                            style={{
                              background: selected
                                ? "rgba(239,68,68,0.15)"
                                : "rgba(255,255,255,0.04)",
                              border: `1px solid ${
                                selected
                                  ? "rgba(239,68,68,0.4)"
                                  : "rgba(255,255,255,0.08)"
                              }`,
                              color: selected
                                ? "#F0F0F5"
                                : "rgba(240,240,245,0.6)",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              className="font-mono text-xs mr-2"
                              style={{ color: selected ? COLOR : "rgba(240,240,245,0.3)" }}
                            >
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress + submit */}
              <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>
                    {answers.filter((a) => a !== null).length}/{questions.length} answered
                  </span>
                  {!allAnswered && (
                    <span className="text-xs" style={{ color: "rgba(240,240,245,0.3)" }}>
                      Answer all questions to submit
                    </span>
                  )}
                </div>
                <div className="h-1 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${COLOR}, #F97316)` }}
                    animate={{
                      width: `${(answers.filter((a) => a !== null).length / questions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: allAnswered
                      ? `linear-gradient(135deg, ${COLOR}, #DC2626)`
                      : "rgba(239,68,68,0.08)",
                    color: allAnswered ? "#fff" : "rgba(239,68,68,0.3)",
                    border: "none",
                    cursor: allAnswered ? "pointer" : "not-allowed",
                    boxShadow: allAnswered ? `0 4px 16px rgba(239,68,68,0.3)` : "none",
                  }}
                >
                  Submit Quiz →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
