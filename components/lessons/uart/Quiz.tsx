"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const COLOR = "#10B981";

const QUESTIONS = [
  { q: "UART stands for:", o: ["Universal Asynchronous Receiver/Transmitter", "Universal Analog Radio Transceiver", "Unified Asynchronous Relay Terminal", "Ultra-fast Asynchronous Radio Transmission"], a: 0, level: "Beginner" },
  { q: "In UART wiring, TX of Device A connects to:", o: ["RX of Device B", "TX of Device B", "GND of Device B", "VCC of Device B"], a: 0, level: "Beginner" },
  { q: "UART communication is:", o: ["Full duplex (both directions simultaneously)", "Half duplex (one direction at a time)", "Simplex (one direction only)", "Quarter duplex"], a: 0, level: "Beginner" },
  { q: "What does 'asynchronous' mean in UART?", o: ["No shared clock line between devices", "Very slow communication", "Only one direction at a time", "Requires Internet connection"], a: 0, level: "Beginner" },
  { q: "What is baud rate?", o: ["Symbols (bits) transmitted per second", "Bytes per second", "Number of start bits per frame", "Clock frequency in Hz"], a: 0, level: "Beginner" },
  { q: "At 115200 baud with 8N1, the effective data rate is approximately:", o: ["~11.5 KB/s (11520 bytes/sec)", "~115 KB/s", "~1.15 MB/s", "~960 bytes/sec"], a: 0, level: "Beginner" },
  { q: "The start bit in a UART frame is:", o: ["Always LOW (0)", "Always HIGH (1)", "Optional", "Same voltage as data bits"], a: 0, level: "Beginner" },
  { q: "The idle state of a UART line is:", o: ["HIGH (logic 1)", "LOW (logic 0)", "Floating (undefined)", "Alternating HIGH and LOW"], a: 0, level: "Beginner" },
  { q: "What does 8N1 mean?", o: ["8 data bits, No parity, 1 stop bit", "8 MHz, No clock, 1 wire", "8 bits, Normal speed, 1 device", "8N1 is a UART module model number"], a: 0, level: "Beginner" },
  { q: "UART data bits are sent in which order?", o: ["LSB (least significant bit) first", "MSB (most significant bit) first", "Random order determined by parity", "Highest voltage bit first"], a: 0, level: "Beginner" },
  { q: "Which baud rate is most commonly recommended for Arduino projects?", o: ["115200", "9600", "300", "1000000"], a: 0, level: "Intermediate" },
  { q: "If sender uses 9600 baud and receiver uses 115200 baud, what happens?", o: ["Garbled/wrong data received", "Data received correctly but slowly", "Data received at 9600 baud speed", "Communication stops completely with no output"], a: 0, level: "Intermediate" },
  { q: "Maximum practical distance for TTL UART (3.3V/5V)?", o: ["About 15 meters", "About 1200 meters", "About 1 meter only", "Unlimited with proper cable"], a: 0, level: "Intermediate" },
  { q: "What does Serial.available() return?", o: ["Number of bytes in the receive buffer", "Whether serial port is initialized", "The current baud rate setting", "The last received byte value"], a: 0, level: "Intermediate" },
  { q: "GPS modules (like NEO-6M) typically use UART at:", o: ["9600 baud", "115200 baud", "1 Mbps", "57600 baud"], a: 0, level: "Intermediate" },
  { q: "A 5V Arduino UART TX connected directly to a 3.3V ESP32 RX:", o: ["Can permanently damage the ESP32 RX pin", "Works fine — 5V is compatible with all logic", "Reduces baud rate automatically to 3.3k", "Requires a pull-up resistor only"], a: 0, level: "Intermediate" },
  { q: "SoftwareSerial allows UART on:", o: ["Any digital pins via software bit-banging", "Only pins 0 and 1 on Arduino", "Only analog input pins", "Only PWM-capable pins"], a: 0, level: "Advanced" },
  { q: "What is the parity bit used for?", o: ["Basic error detection", "Setting the baud rate", "Selecting the device address on the bus", "Encoding ASCII character set"], a: 0, level: "Advanced" },
  { q: "The UART stop bit is:", o: ["Always HIGH (1)", "Always LOW (0)", "Optional and can be omitted", "Same voltage as the last data bit"], a: 0, level: "Advanced" },
  { q: "To send letter 'A' (ASCII 65 = 0x41 = 01000001) via UART, the data bits in transmission order are:", o: ["1,0,0,0,0,0,1,0 (LSB first)", "0,1,0,0,0,0,0,1 (MSB first)", "0,1,0,0,0,0,1,0 (hex order)", "6,5,A,H (ASCII code letters)"], a: 0, level: "Advanced" },
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
              borderColor: passed ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.3)",
              background: passed ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
            }}
          >
            <div className="text-5xl mb-3">{passed ? "🏆" : "📖"}</div>
            <div className="text-3xl font-black mb-1" style={{ color: passed ? COLOR : "#EF4444" }}>{score}/20</div>
            <div className="text-sm mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>
              {passed ? "UART Mastered! You understand serial communication." : "Need 14/20 to pass. Review the simulators above and try again."}
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
                    background: correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${correct ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
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
                style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.12)", color: COLOR }}
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
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>UART Quiz</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>20 questions · Pass with 14/20</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${COLOR}, #34D399)` }}
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
              style={{ borderColor: "rgba(16,185,129,0.18)", background: "rgba(16,185,129,0.04)" }}
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
                      borderColor: selected === i ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.07)",
                      background: selected === i ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)",
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
              style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.12)", color: COLOR }}
            >
              {isLast ? "Submit Quiz →" : "Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
