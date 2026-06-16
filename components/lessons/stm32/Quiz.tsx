"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const COLOR = "#0891B2";

const QUESTIONS = [
  { q: "What CPU architecture does STM32 use?", o: ["ARM Cortex-M", "Xtensa LX6", "AVR", "MIPS"], a: 0, level: "Beginner" },
  { q: "What is the maximum frequency of the STM32F4?", o: ["168 MHz", "72 MHz", "240 MHz", "84 MHz"], a: 0, level: "Beginner" },
  { q: "What is the ADC resolution on STM32F4?", o: ["12-bit", "10-bit", "8-bit", "16-bit"], a: 0, level: "Beginner" },
  { q: "What logic level does STM32 use?", o: ["3.3V", "5V", "1.8V", "3.6V"], a: 0, level: "Beginner" },
  { q: "Which library is more portable and readable on STM32?", o: ["HAL (Hardware Abstraction Layer)", "LL (Low Level)", "CMSIS directly", "libopencm3"], a: 0, level: "Beginner" },
  { q: "How many GPIO modes does STM32 have?", o: ["4 (Input, Output, Alternate, Analog)", "2 (Input, Output)", "3 (Input, Output, Analog)", "6 modes total"], a: 0, level: "Beginner" },
  { q: "What is the maximum clock frequency of APB1 on STM32F4?", o: ["42 MHz", "84 MHz", "168 MHz", "21 MHz"], a: 0, level: "Intermediate" },
  { q: "What is the main advantage of DMA on STM32?", o: ["Frees the CPU during data transfers", "Increases CPU speed", "Reduces flash memory usage", "Enables 5V I/O"], a: 0, level: "Intermediate" },
  { q: "How many ADC units does the STM32F4 have?", o: ["3", "1", "2", "4"], a: 0, level: "Intermediate" },
  { q: "What must you do before using any GPIO peripheral on STM32?", o: ["Enable its RCC clock", "Set the GPIO mode", "Configure pull resistors", "Write to ODR register"], a: 0, level: "Beginner" },
  { q: "What is the HSI frequency on STM32F4?", o: ["16 MHz", "8 MHz", "4 MHz", "12 MHz"], a: 0, level: "Intermediate" },
  { q: "What is the timer frequency formula on STM32?", o: ["TimerCLK / (PSC+1) / (ARR+1)", "TimerCLK × PSC × ARR", "TimerCLK / PSC / ARR", "TimerCLK / (PSC × ARR)"], a: 0, level: "Intermediate" },
  { q: "What is the flash memory range for STM32F4?", o: ["256 KB to 2 MB", "4 KB to 64 KB", "16 KB to 256 KB", "1 MB to 8 MB"], a: 0, level: "Intermediate" },
  { q: "What tool does ST provide for STM32 graphical configuration and code generation?", o: ["STM32CubeIDE / CubeMX", "Arduino IDE", "Keil MDK only", "Eclipse CDT"], a: 0, level: "Beginner" },
  { q: "Does the STM32F4 Cortex-M4 have a hardware FPU?", o: ["Yes, hardware FPU included", "No, software emulation only", "Only in F7 series", "Only in H7 series"], a: 0, level: "Intermediate" },
  { q: "What is CCR in STM32 timers?", o: ["Capture/Compare Register — sets PWM duty", "Clock Control Register", "Counter Clear Register", "Channel Configuration Register"], a: 0, level: "Advanced" },
  { q: "What is the maximum SYSCLK on STM32F4?", o: ["168 MHz", "84 MHz", "216 MHz", "144 MHz"], a: 0, level: "Intermediate" },
  { q: "What is ARR in STM32 timers?", o: ["Auto-Reload Register — sets the period", "Address Resolution Register", "Analog Reference Register", "Alternate Register"], a: 0, level: "Advanced" },
  { q: "What is the valid HSE frequency range for STM32F4?", o: ["4–26 MHz (external crystal)", "8 MHz fixed", "16–48 MHz", "1–100 MHz"], a: 0, level: "Advanced" },
  { q: "How does Cortex-M4 differ from Cortex-M0?", o: ["M4 has FPU and DSP instructions, M0 does not", "M4 is slower than M0", "M0 supports more GPIO", "M4 uses RISC-V ISA"], a: 0, level: "Advanced" },
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
              borderColor: passed ? "rgba(8,145,178,0.35)" : "rgba(239,68,68,0.3)",
              background: passed ? "rgba(8,145,178,0.06)" : "rgba(239,68,68,0.06)",
            }}
          >
            <div className="text-5xl mb-3">{passed ? "🏆" : "📖"}</div>
            <div className="text-3xl font-black mb-1" style={{ color: passed ? COLOR : "#EF4444" }}>{score}/20</div>
            <div className="text-sm mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>
              {passed ? "STM32 Mastered! Professional embedded skills unlocked." : "Need 14/20 to pass. Review the clock tree and peripherals, then retry."}
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
                    background: correct ? "rgba(8,145,178,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${correct ? "rgba(8,145,178,0.3)" : "rgba(239,68,68,0.3)"}`,
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
                style={{ borderColor: "rgba(8,145,178,0.4)", background: "rgba(8,145,178,0.12)", color: COLOR }}
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
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>STM32 Quiz</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>20 questions · Pass with 14/20</p>

        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${COLOR}, #06B6D4)` }} animate={{ width: `${(current / 20) * 100}%` }} />
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
              style={{ borderColor: "rgba(8,145,178,0.18)", background: "rgba(8,145,178,0.04)" }}
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
                      borderColor: selected === i ? "rgba(8,145,178,0.6)" : "rgba(255,255,255,0.07)",
                      background: selected === i ? "rgba(8,145,178,0.1)" : "rgba(255,255,255,0.02)",
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
              style={{ borderColor: "rgba(8,145,178,0.4)", background: "rgba(8,145,178,0.12)", color: COLOR }}
            >
              {isLast ? "Submit Quiz →" : "Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
