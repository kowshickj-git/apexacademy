"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPracticeUsed: () => void; }

type Solve = "V" | "I" | "R";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem() {
  const type: Solve = (["V", "I", "R"] as Solve[])[randInt(0, 2)];
  const V = randInt(1, 20);
  const R = randInt(1, 50) * 10; // 10–500Ω
  const I_exact = V / R;
  const I = parseFloat(I_exact.toFixed(2));

  if (type === "V") return { type, given: { I: `${I}A`, R: `${R}Ω` }, answer: V, unit: "V", display: `${V}V` };
  if (type === "I") return { type, given: { V: `${V}V`, R: `${R}Ω` }, answer: parseFloat(I_exact.toFixed(3)), unit: "A", display: `${I}A` };
  return { type, given: { V: `${V}V`, I: `${I}A` }, answer: R, unit: "Ω", display: `${R}Ω` };
}

const FORMULAS: Record<Solve, string> = { V: "V = I × R", I: "I = V ÷ R", R: "R = V ÷ I" };

export default function PracticeMode({ onPracticeUsed }: Props) {
  const [problem, setProblem] = useState(generateProblem);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(0);
  const [used, setUsed] = useState(false);

  const next = useCallback(() => {
    setProblem(generateProblem());
    setInput("");
    setStatus("idle");
    setShowAnswer(false);
    setShowHint(false);
  }, []);

  const check = () => {
    const val = parseFloat(input);
    if (isNaN(val)) return;
    const isCorrect = Math.abs(val - problem.answer) / problem.answer < 0.02; // 2% tolerance
    setStatus(isCorrect ? "correct" : "wrong");
    setShowAnswer(true);
    if (isCorrect) setSolved((s) => s + 1);
    if (!used) { setUsed(true); onPracticeUsed(); }
  };

  const color = problem.type === "V" ? "#EAB308" : problem.type === "I" ? "#0EA5E9" : "#F97316";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold font-mono">Section 12 · Practice</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-primary font-mono">✓ {solved} solved</div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-1">Practice Mode</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Random problems generated for you. Solve for the missing variable. Enter your answer and check it.
        </p>

        {/* Problem card */}
        <div
          className="rounded-2xl border p-6 mb-5"
          style={{ background: `${color}0c`, borderColor: `${color}25` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1 font-mono">Find: {problem.type === "V" ? "Voltage" : problem.type === "I" ? "Current" : "Resistance"}</p>
              <p className="text-sm font-semibold text-white/70">
                Use: <span className="font-mono" style={{ color }}>{FORMULAS[problem.type]}</span>
              </p>
            </div>
            <button
              onClick={() => setShowHint((h) => !h)}
              className="px-2.5 py-1 rounded-full text-[10px] border border-white/10 text-white/30 hover:text-white/50 transition-colors"
            >
              {showHint ? "Hide hint" : "Hint"}
            </button>
          </div>

          {/* Given values */}
          <div className="flex gap-6 mb-4">
            {Object.entries(problem.given).map(([k, v]) => (
              <div key={k} className="text-center">
                <p className="text-3xl font-black font-mono mb-0.5" style={{ color }}>
                  {v}
                </p>
                <p className="text-[10px] text-white/35">{k}</p>
              </div>
            ))}
            <div className="text-center">
              <p className="text-3xl font-black font-mono mb-0.5 text-white/15">?</p>
              <p className="text-[10px] text-white/35">{problem.type}</p>
            </div>
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="p-3 rounded-xl border border-white/8 text-xs text-white/45" style={{ background: "rgba(255,255,255,0.03)" }}>
                  💡 Hint: {problem.type === "V" ? "Multiply I × R to find voltage." : problem.type === "I" ? "Divide V ÷ R to find current." : "Divide V ÷ I to find resistance."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          {!showAnswer ? (
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-white/15 rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                <input
                  type="number"
                  step="0.001"
                  placeholder={`Enter ${problem.type} value...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  className="flex-1 bg-transparent outline-none text-white/80 text-sm font-mono placeholder-white/15"
                />
                <span className="text-white/25 text-sm font-mono">{problem.unit}</span>
              </div>
              <button
                onClick={check}
                disabled={!input}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={input
                  ? { background: color, color: "#050507" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }
                }
              >
                Check
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border p-4 text-center"
                style={status === "correct"
                  ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }
                  : { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }
                }
              >
                <p className="text-base font-black mb-1" style={{ color: status === "correct" ? "#10B981" : "#EF4444" }}>
                  {status === "correct" ? "✓ Correct!" : "✗ Not quite."}
                </p>
                <p className="text-sm font-mono text-white/70">Answer: <span style={{ color }}>{problem.display}</span></p>
                <p className="text-xs text-white/35 mt-1 font-mono">
                  {problem.type === "V"
                    ? `${Object.values(problem.given)[0]} × ${Object.values(problem.given)[1]} = ${problem.display}`
                    : problem.type === "I"
                    ? `${Object.values(problem.given)[0]} ÷ ${Object.values(problem.given)[1]} = ${problem.display}`
                    : `${Object.values(problem.given)[0]} ÷ ${Object.values(problem.given)[1]} = ${problem.display}`}
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <button
          onClick={next}
          className="w-full py-2.5 rounded-xl text-sm font-bold border border-white/10 text-white/50 hover:border-primary/30 hover:text-primary transition-all"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          New Problem →
        </button>
      </div>
    </section>
  );
}
