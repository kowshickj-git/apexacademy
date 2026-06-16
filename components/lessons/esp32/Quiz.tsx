"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const COLOR = "#06B6D4";

const QUESTIONS = [
  { q: "How many CPU cores does the ESP32 have?", o: ["2 (dual-core Xtensa LX6)", "1 (single-core)", "4 (quad-core)", "2 (ARM Cortex-M4)"], a: 0, level: "Beginner" },
  { q: "What is the ESP32 deep sleep current consumption?", o: ["10 µA", "10 mA", "100 µA", "1 mA"], a: 0, level: "Beginner" },
  { q: "Which frequency band does ESP32 WiFi use?", o: ["2.4 GHz", "5 GHz", "900 MHz", "868 MHz"], a: 0, level: "Beginner" },
  { q: "What is the ADC resolution on ESP32?", o: ["12-bit", "10-bit", "8-bit", "16-bit"], a: 0, level: "Beginner" },
  { q: "What logic voltage level does the ESP32 use?", o: ["3.3V", "5V", "1.8V", "3.6V"], a: 0, level: "Beginner" },
  { q: "Which GPIO pins are input-only on the ESP32?", o: ["GPIO 34–39", "GPIO 0–3", "GPIO 16–21", "GPIO 25–27"], a: 0, level: "Beginner" },
  { q: "What is the default MQTT broker port?", o: ["1883", "8883", "443", "80"], a: 0, level: "Beginner" },
  { q: "Why can't you use ADC2 when WiFi is active?", o: ["The WiFi radio uses ADC2 internally", "ADC2 doesn't support 12-bit mode", "ADC2 requires 5V", "ADC2 interferes with BLE"], a: 0, level: "Intermediate" },
  { q: "Which BLE version does ESP32 support?", o: ["BLE 5.0", "BLE 4.0", "BLE 3.0", "BLE 2.1"], a: 0, level: "Beginner" },
  { q: "What is the maximum CPU frequency of the ESP32?", o: ["240 MHz", "160 MHz", "80 MHz", "120 MHz"], a: 0, level: "Beginner" },
  { q: "How much SRAM does the ESP32 have?", o: ["520 KB", "256 KB", "1 MB", "128 KB"], a: 0, level: "Intermediate" },
  { q: "How many PWM channels does the ESP32 LEDC peripheral have?", o: ["16", "8", "12", "4"], a: 0, level: "Intermediate" },
  { q: "Which Bluetooth Classic version does ESP32 support?", o: ["Bluetooth 4.2", "Bluetooth 5.0", "Bluetooth 3.0", "Bluetooth 2.1"], a: 0, level: "Intermediate" },
  { q: "How many capacitive touch pins does the ESP32 have?", o: ["10", "8", "12", "6"], a: 0, level: "Intermediate" },
  { q: "What is the DAC resolution on ESP32?", o: ["8-bit", "12-bit", "10-bit", "16-bit"], a: 0, level: "Intermediate" },
  { q: "What current does ESP32 draw in hibernation mode?", o: ["5 µA", "10 µA", "100 µA", "1 mA"], a: 0, level: "Advanced" },
  { q: "How many UART interfaces does ESP32 have?", o: ["3", "2", "4", "1"], a: 0, level: "Intermediate" },
  { q: "How many I2C interfaces does ESP32 have?", o: ["2", "1", "4", "3"], a: 0, level: "Intermediate" },
  { q: "How many SPI interfaces does ESP32 have?", o: ["4", "2", "3", "1"], a: 0, level: "Advanced" },
  { q: "Which attribute preserves a variable across ESP32 deep sleep cycles?", o: ["RTC_DATA_ATTR", "IRAM_ATTR", "DRAM_ATTR", "FLASH_ATTR"], a: 0, level: "Advanced" },
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
              borderColor: passed ? "rgba(6,182,212,0.35)" : "rgba(239,68,68,0.3)",
              background: passed ? "rgba(6,182,212,0.06)" : "rgba(239,68,68,0.06)",
            }}
          >
            <div className="text-5xl mb-3">{passed ? "🏆" : "📖"}</div>
            <div className="text-3xl font-black mb-1" style={{ color: passed ? COLOR : "#EF4444" }}>{score}/20</div>
            <div className="text-sm mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>
              {passed ? "ESP32 Mastered! You understand the platform deeply." : "Need 14/20 to pass. Review the simulators and try again."}
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
                    background: correct ? "rgba(6,182,212,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${correct ? "rgba(6,182,212,0.3)" : "rgba(239,68,68,0.3)"}`,
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
                style={{ borderColor: "rgba(6,182,212,0.4)", background: "rgba(6,182,212,0.12)", color: COLOR }}
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
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>ESP32 Quiz</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>20 questions · Pass with 14/20</p>

        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${COLOR}, #22D3EE)` }} animate={{ width: `${(current / 20) * 100}%` }} />
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
              style={{ borderColor: "rgba(6,182,212,0.18)", background: "rgba(6,182,212,0.04)" }}
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
                      borderColor: selected === i ? "rgba(6,182,212,0.6)" : "rgba(255,255,255,0.07)",
                      background: selected === i ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.02)",
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
              style={{ borderColor: "rgba(6,182,212,0.4)", background: "rgba(6,182,212,0.12)", color: COLOR }}
            >
              {isLast ? "Submit Quiz →" : "Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
