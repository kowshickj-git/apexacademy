"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const COLOR = "#F59E0B";

const QUESTIONS = [
  { q: "RS485 was originally defined by:", o: ["IEEE", "EIA (now TIA)", "ISO", "ANSI"], a: 1 },
  { q: "RS485 uses:", o: ["Single wire", "Two wires differential", "Four wires", "Coax"], a: 1 },
  { q: "Logic 1 in RS485 when:", o: ["A=0V B=5V", "Both wires at 2.5V", "A > B by ≥0.2V", "B > A by ≥0.2V"], a: 2 },
  { q: "Maximum cable length at 100 kbps:", o: ["100m", "500m", "1200m", "5000m"], a: 2 },
  { q: "Maximum devices on standard RS485 bus:", o: ["8", "16", "32 unit loads", "64"], a: 2 },
  { q: "RS485 is typically:", o: ["Full-duplex", "Half-duplex", "Simplex", "Wireless"], a: 1 },
  { q: "Termination resistor value:", o: ["50Ω", "75Ω", "120Ω", "220Ω"], a: 2 },
  { q: "How many termination resistors needed:", o: ["1", "2 (one at each end)", "3", "4"], a: 1 },
  { q: "Common RS485 transceiver chip:", o: ["MAX232", "MAX485", "L298", "ULN2803"], a: 1 },
  { q: "DE pin on MAX485 controls:", o: ["Data encoding", "Driver enable (transmit direction)", "Clock signal", "Baud rate"], a: 1 },
  { q: "RS485 common-mode voltage range:", o: ["±2V from GND", "±7V from GND", "±15V from GND", "±50V from GND"], a: 2 },
  { q: "What is Modbus RTU?", o: ["A hardware standard", "An application protocol over RS485", "A type of connector", "A cable standard"], a: 1 },
  { q: "RS485 noise immunity comes from:", o: ["Shielding only", "Twisted pair cable", "Common-mode rejection of differential", "Higher voltage"], a: 2 },
  { q: "Maximum RS485 speed (short distances):", o: ["1 Mbps", "5 Mbps", "~10 Mbps", "100 Mbps"], a: 2 },
  { q: "RS485 GND connection between devices:", o: ["Not required", "Still required for common-mode reference", "Only for power", "Depends on distance"], a: 1 },
  { q: "Modbus function code 0x03:", o: ["Write Coil", "Read Coils", "Read Holding Registers", "Write Single Register"], a: 2 },
  { q: "What happens if A/B wires are reversed?", o: ["Faster speed", "Communication fails or inverted", "Higher noise immunity", "No effect"], a: 1 },
  { q: "Modbus RTU CRC uses:", o: ["CRC-8", "CRC-16 polynomial", "CRC-32", "Simple checksum"], a: 1 },
  { q: "RS485 is used in solar plants for:", o: ["Physical mounting", "Inverter monitoring via Modbus", "Power storage", "Panel cleaning"], a: 1 },
  { q: "Differential is better than single-ended because:", o: ["Uses less wire", "Faster speed", "Common-mode noise is subtracted", "Lower cost"], a: 2 },
];

export default function Quiz({ onPass }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [calledPass, setCalledPass] = useState(false);

  const isLast = current === QUESTIONS.length - 1;
  const q = QUESTIONS[current];

  function choose(i: number) {
    if (!submitted) setSelected(i);
  }

  function next() {
    if (selected === null) return;
    const correct = selected === q.a;
    const newAnswers = [...answers, correct];
    if (isLast) {
      const score = newAnswers.filter(Boolean).length;
      const pass = score >= 14;
      setAnswers(newAnswers);
      setPassed(pass);
      setSubmitted(true);
      if (pass && !calledPass) { setCalledPass(true); onPass(); }
    } else {
      setAnswers(newAnswers);
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  function retry() {
    setCurrent(0); setSelected(null); setAnswers([]); setSubmitted(false); setPassed(false); setCalledPass(false);
  }

  if (submitted) {
    const score = answers.filter(Boolean).length;
    return (
      <section className="py-10 border-b border-white/5">
        <div className="max-w-2xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border p-8 text-center"
            style={{
              borderColor: passed ? "rgba(245,158,11,0.35)" : "rgba(239,68,68,0.3)",
              background: passed ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)",
            }}
          >
            <div className="text-5xl mb-3">{passed ? "🏆" : "📖"}</div>
            <div className="text-3xl font-black mb-1" style={{ color: passed ? COLOR : "#EF4444" }}>{score}/20</div>
            <div className="text-sm mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>
              {passed ? "RS485 Mastered! You understand industrial communication." : "Need 14/20 to pass. Review the simulators above and try again."}
            </div>
            <div className="text-xs mb-5" style={{ color: "rgba(240,240,245,0.35)" }}>
              Correct: {score} · Wrong: {20 - score} · Pass threshold: 14/20
            </div>
            <div className="flex gap-1 justify-center flex-wrap mb-5">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: correct ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${correct ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: correct ? COLOR : "#EF4444",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            {!passed && (
              <button
                onClick={retry}
                className="px-6 py-2.5 rounded-xl font-bold text-sm border"
                style={{ borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.12)", color: COLOR }}
              >
                Retry Quiz
              </button>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Quiz</p>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>RS485 Quiz</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>20 questions · Pass with 14/20</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${COLOR}, #FCD34D)` }}
            animate={{ width: `${(current / 20) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="rounded-2xl border p-5 mb-4"
              style={{ borderColor: "rgba(245,158,11,0.18)", background: "rgba(245,158,11,0.04)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>{current + 1}/20</span>
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full border font-mono"
                  style={{ borderColor: "rgba(245,158,11,0.3)", color: COLOR, background: "rgba(245,158,11,0.1)" }}
                >
                  RS485
                </span>
              </div>
              <p className="font-semibold text-sm mb-4" style={{ color: "#F0F0F5" }}>{q.q}</p>
              <div className="space-y-2">
                {q.o.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                    style={{
                      borderColor: selected === i ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.07)",
                      background: selected === i ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.02)",
                      color: selected === i ? COLOR : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <span className="font-mono text-xs mr-2" style={{ color: selected === i ? COLOR : "rgba(240,240,245,0.25)" }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={next}
              disabled={selected === null}
              className="w-full py-3 rounded-xl font-bold text-sm border transition-all disabled:opacity-30"
              style={{ borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.12)", color: COLOR }}
            >
              {isLast ? "Submit Quiz →" : "Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
