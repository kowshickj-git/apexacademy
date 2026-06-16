"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const COLOR = "#8B5CF6";

const QUESTIONS = [
  { q: "What is a communication protocol?", o: ["A set of rules for data exchange between devices", "A physical wire connection standard", "A type of microcontroller", "A software debugging tool"], a: 0, level: "Beginner" },
  { q: "Serial communication sends bits:", o: ["One at a time on a single wire", "All bits simultaneously on multiple wires", "Using radio waves", "Through optical fiber only"], a: 0, level: "Beginner" },
  { q: "Which protocol uses a shared clock line (synchronous)?", o: ["I2C", "UART", "RS485", "CAN"], a: 0, level: "Beginner" },
  { q: "UART stands for:", o: ["Universal Asynchronous Receiver/Transmitter", "Universal Analog Radio Transceiver", "Unified Asynchronous Relay Terminal", "Ultra-fast Asynchronous Radio Transmission"], a: 0, level: "Beginner" },
  { q: "I2C uses how many wires?", o: ["2 (SDA and SCL)", "4 (MOSI, MISO, SCK, CS)", "1 (data only)", "3 (data, clock, enable)"], a: 0, level: "Beginner" },
  { q: "SPI uses how many wires minimum?", o: ["4 (MOSI, MISO, SCK, CS)", "2 (SDA, SCL)", "1 (single-wire)", "8 (parallel)"], a: 0, level: "Beginner" },
  { q: "Which protocol is best for long industrial distances up to 1200m?", o: ["RS485", "UART", "I2C", "SPI"], a: 0, level: "Beginner" },
  { q: "CAN bus was originally designed for:", o: ["Automotive applications", "Internet of Things", "Audio equipment", "Computer storage"], a: 0, level: "Beginner" },
  { q: "Full duplex means:", o: ["Both directions simultaneously", "One direction at a time", "Only transmit", "Only receive"], a: 0, level: "Beginner" },
  { q: "Half duplex means:", o: ["One direction at a time", "Both directions simultaneously", "No communication possible", "Only 50% data rate"], a: 0, level: "Beginner" },
  { q: "I2C can connect up to how many devices on one bus?", o: ["127 devices", "32 devices", "4 devices", "1000 devices"], a: 0, level: "Intermediate" },
  { q: "RS485 maximum unit loads on one bus:", o: ["32", "127", "8", "256"], a: 0, level: "Intermediate" },
  { q: "Asynchronous communication requires:", o: ["Matching baud rates on both sides", "A shared clock line", "A reference voltage", "Identical hardware"], a: 0, level: "Intermediate" },
  { q: "Why does serial beat parallel at very high speeds?", o: ["No crosstalk between wires at high frequencies", "Serial is always faster", "Parallel requires more power", "Serial uses less voltage"], a: 0, level: "Intermediate" },
  { q: "UART voltage levels for TTL logic:", o: ["LOW=0V, HIGH=3.3V or 5V", "LOW=1V, HIGH=5V", "LOW=-5V, HIGH=5V (RS232)", "LOW=0V, HIGH=1.8V only"], a: 0, level: "Intermediate" },
  { q: "Which protocol requires pull-up resistors to function correctly?", o: ["I2C", "SPI", "UART", "CAN"], a: 0, level: "Intermediate" },
  { q: "CAN uses differential signaling with:", o: ["CAN-H and CAN-L wires", "TX and RX wires", "A and B wires", "MOSI and MISO wires"], a: 0, level: "Advanced" },
  { q: "SPI communication mode:", o: ["Full duplex synchronous", "Half duplex asynchronous", "Full duplex asynchronous", "Simplex synchronous"], a: 0, level: "Advanced" },
  { q: "Maximum speed of RS485:", o: ["Up to 10 Mbps", "Up to 1 Mbps", "Up to 100 kbps", "Up to 50 MHz"], a: 0, level: "Advanced" },
  { q: "A 5V UART TX connected directly to a 3.3V device RX will:", o: ["Risk permanently damaging the 3.3V device", "Work fine, voltage is just reference", "Reduce the baud rate automatically", "Require a pull-up resistor only"], a: 0, level: "Advanced" },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "#10B981",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

export default function Quiz({ onPass }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const calledRef = useRef(false);

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
      if (pass && !calledRef.current) { calledRef.current = true; onPass(); }
    } else {
      setAnswers(newAnswers);
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  function retry() {
    setCurrent(0); setSelected(null); setAnswers([]); setSubmitted(false); setPassed(false);
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
              borderColor: passed ? "rgba(139,92,246,0.35)" : "rgba(239,68,68,0.3)",
              background: passed ? "rgba(139,92,246,0.06)" : "rgba(239,68,68,0.06)",
            }}
          >
            <div className="text-5xl mb-3">{passed ? "🏆" : "📖"}</div>
            <div className="text-3xl font-black mb-1" style={{ color: passed ? COLOR : "#EF4444" }}>{score}/20</div>
            <div className="text-sm mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>
              {passed ? "Communication Protocols Mastered!" : "Need 14/20 to pass. Review the simulators above and try again."}
            </div>
            <div className="text-xs mb-5" style={{ color: "rgba(240,240,245,0.35)" }}>
              Correct: {score} · Wrong: {20 - score} · Pass threshold: 14/20
            </div>
            {/* Answer breakdown */}
            <div className="flex gap-1 justify-center flex-wrap mb-5">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: correct ? "rgba(139,92,246,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${correct ? "rgba(139,92,246,0.3)" : "rgba(239,68,68,0.3)"}`,
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
                style={{ borderColor: "rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.12)", color: COLOR }}
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
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 12 · Quiz</p>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>Communication Protocols Quiz</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>20 questions · Pass with 14/20</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${COLOR}, #A78BFA)` }} animate={{ width: `${(current / 20) * 100}%` }} />
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
              style={{ borderColor: "rgba(139,92,246,0.18)", background: "rgba(139,92,246,0.04)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>{current + 1}/20</span>
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full border font-mono"
                  style={{
                    borderColor: `${LEVEL_COLORS[q.level]}40`,
                    color: LEVEL_COLORS[q.level],
                    background: `${LEVEL_COLORS[q.level]}12`,
                  }}
                >
                  {q.level}
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
                      borderColor: selected === i ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.07)",
                      background: selected === i ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.02)",
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
              style={{ borderColor: "rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.12)", color: COLOR }}
            >
              {isLast ? "Submit Quiz →" : "Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
