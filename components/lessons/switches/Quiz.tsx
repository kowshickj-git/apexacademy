"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

interface Props {
  onPass: () => void;
}

const questions = [
  // BEGINNER Q1-10
  {
    q: "A switch in the OPEN position...",
    options: ["Allows current to flow", "Blocks current from flowing", "Increases resistance slightly", "Short-circuits the circuit"],
    correct: 1,
    explain: "An OPEN switch breaks the circuit path — no continuous path exists, so no current can flow. The word 'open' refers to the circuit being broken, like an open gate that blocks passage.",
  },
  {
    q: "NO stands for:",
    options: ["Not Open", "Normally Open", "No Output", "Neutral Origin"],
    correct: 1,
    explain: "NO = Normally Open. The contacts are OPEN (disconnected) when the switch is at rest and no force is applied. Pressing the switch closes the contacts and allows current to flow.",
  },
  {
    q: "A toggle switch is considered:",
    options: ["Momentary", "Latching", "Wireless", "Digital"],
    correct: 1,
    explain: "A toggle switch is latching — it stays in its last position (ON stays ON, OFF stays OFF) after you release it. This is unlike a momentary push button which springs back to its default state.",
  },
  {
    q: "When a NO push button is pressed:",
    options: ["The circuit opens", "The circuit stays open", "The circuit closes", "The polarity reverses"],
    correct: 2,
    explain: "NO (Normally Open) means the contacts are open at rest. Pressing the button physically pushes the contacts together, CLOSING the circuit and allowing current to flow. Release it and it springs open again.",
  },
  {
    q: "An SPST switch has:",
    options: ["2 inputs, 1 output", "1 input, 2 outputs", "1 input, 1 output", "2 inputs, 2 outputs"],
    correct: 2,
    explain: "SPST = Single Pole Single Throw. Single Pole = 1 input (one wire entering). Single Throw = 1 output (one wire leaving). It's the simplest possible switch: on or off.",
  },
  {
    q: "NC contacts' default state (switch at rest) is:",
    options: ["Open", "Closed", "Floating", "Half-open"],
    correct: 1,
    explain: "NC = Normally Closed. The contacts are CLOSED (connected) when the switch is at rest. Current flows through an NC contact without pressing anything — pressing the switch opens it and breaks the circuit.",
  },
  {
    q: "Switch bounce occurs in:",
    options: ["Digital switches", "Mechanical switches", "Optical switches", "All switches equally"],
    correct: 1,
    explain: "Mechanical switches suffer from contact bounce because the physical metal contacts physically strike and bounce apart multiple times before settling. Digital, optical, and solid-state switches have no moving mechanical contacts so they don't bounce.",
  },
  {
    q: "Emergency stop buttons use NC (Normally Closed) because:",
    options: ["NC is cheaper to manufacture", "A wire break or failure causes the machine to stop safely", "NC is more common in stock", "NC is easier to wire"],
    correct: 1,
    explain: "With NC: normal operation = contacts closed = machine runs. E-stop pressed OR wire breaks = contacts open = machine stops. This is 'fail-safe' — any failure in the safety circuit causes a safe stop, not a dangerous run condition.",
  },
  {
    q: "An SPDT switch routes current to:",
    options: ["One fixed path only", "No path (acts as insulator)", "One of two selectable paths", "All connected paths simultaneously"],
    correct: 2,
    explain: "SPDT = Single Pole Double Throw. The common terminal connects to either output A or output B — never both at once. This makes it ideal for changeover and selector applications like 3-way light switches.",
  },
  {
    q: "A keyboard key is an example of a:",
    options: ["Toggle switch", "Latching switch", "Momentary switch", "Rotary switch"],
    correct: 2,
    explain: "Keyboard keys are momentary switches. They spring back to their released (open) position when you let go. If they were latching, each key you pressed would stay pressed — typing would be impossible!",
  },
  // INTERMEDIATE Q11-15
  {
    q: "An Arduino pin is connected to a button with a pull-up resistor (pin connected to 5V via 10kΩ, button connects pin to GND). When the button is pressed, the pin reads:",
    options: ["HIGH (5V)", "LOW (0V/GND)", "Floating (undefined)", "5V (the pull-up voltage)"],
    correct: 1,
    explain: "Pull-up: pin sits at HIGH (5V via resistor) when button is open. Pressing button connects pin directly to GND — GND wins because it's a direct low-resistance connection vs the 10kΩ pull-up. Pin reads LOW. This is why INPUT_PULLUP inverts the logic: pressed = LOW.",
  },
  {
    q: "Recommended software debounce delay for mechanical buttons:",
    options: ["1 microsecond (1µs)", "1 millisecond (1ms)", "10 milliseconds (10ms)", "1 second (1s)"],
    correct: 2,
    explain: "10ms is the standard. Contact bounce typically settles within 1–5ms, so a 10ms delay after first edge detection ensures all bounces are ignored. Too short (1µs, 1ms) misses bounces; too long (1s) makes the UI feel sluggish.",
  },
  {
    q: "A 3-way light switch system (two switches, one light) uses which switch type?",
    options: ["SPST (Single Pole Single Throw)", "SPDT (Single Pole Double Throw)", "DPDT (Double Pole Double Throw)", "Momentary push button"],
    correct: 1,
    explain: "3-way switching uses two SPDT switches. Each switch selects which 'traveler' wire connects to the load. Flipping either switch changes the routing, toggling the light — the standard staircase light wiring configuration.",
  },
  {
    q: "Maximum current rating for a typical small signal/PCB push button switch is:",
    options: ["0.1 mA", "1 A", "100 mA", "10 A"],
    correct: 2,
    explain: "Small signal PCB-mount push buttons (like those used with Arduinos) are typically rated for 50–100mA at low voltages. They're meant for signal switching, not power loads. Exceeding the rating arcs and welds the contacts.",
  },
  {
    q: "Internal pull-up resistor in Arduino is activated by:",
    options: ["pinMode(pin, INPUT)", "pinMode(pin, OUTPUT)", "pinMode(pin, INPUT_PULLUP)", "pinMode(pin, PULLUP)"],
    correct: 2,
    explain: "INPUT_PULLUP enables the ~20–50kΩ internal pull-up resistor connected between the pin and 5V. No external resistor needed. The pin reads HIGH when button is released and LOW when button is pressed (connecting pin to GND).",
  },
  // ADVANCED Q16-20
  {
    q: "Why is software debounce still needed when using INPUT_PULLUP?",
    options: [
      "The pull-up voltage is too high for the pin",
      "Mechanical contact bounce causes multiple rising/falling edge detections regardless of pull-up type",
      "The pull-up resistor interferes with button operation",
      "Debounce is not needed with INPUT_PULLUP",
    ],
    correct: 1,
    explain: "The pull-up resistor only ensures a defined HIGH state when the button is open — it doesn't affect the mechanical bouncing of the contacts themselves. Bounce still creates rapid LOW/HIGH transitions at the pin that need to be filtered in software.",
  },
  {
    q: "An NC limit switch on a robot arm opens when the arm reaches the end position. What does this cause?",
    options: [
      "The motor speeds up to push through",
      "The motor stops (safe behavior)",
      "No effect on the motor",
      "The motor reverses direction automatically",
    ],
    correct: 1,
    explain: "NC limit switch = closed during normal operation (motor runs). When arm hits end position, switch opens = circuit broken = control system detects loss of signal = motor stops. This is fail-safe: any switch failure or broken wire also stops the motor, preventing runaway.",
  },
  {
    q: "A momentary button is connected between Vcc (5V) and a pin, with a 10kΩ pull-down to GND. Button pressed = pin reads:",
    options: ["LOW (GND)", "HIGH (Vcc)", "Floating", "Unknown"],
    correct: 1,
    explain: "Pull-DOWN: pin sits at LOW (GND via 10kΩ) when button is open. Pressing button connects pin directly to Vcc (5V) — 5V wins over the 10kΩ to GND. Pin reads HIGH. This is the opposite of INPUT_PULLUP logic: pressed = HIGH.",
  },
  {
    q: "A relay's internal contact is best described as which type of switch?",
    options: [
      "Momentary NO push button",
      "Latching SPDT (or SPST) switch controlled electromagnetically",
      "Momentary push button that resets",
      "Toggle NC switch",
    ],
    correct: 1,
    explain: "A relay has a coil (electromagnet) and internal contacts. The contacts are latching while the coil is energized (they stay closed/open as long as current flows through the coil). Relays come in SPST, SPDT, DPDT configurations with NO and NC contacts — they're electrically-operated mechanical switches.",
  },
  {
    q: "Contact resistance of a high-quality mechanical switch is typically:",
    options: ["0Ω (perfect conductor)", "~100 milliohms (0.1Ω)", "1 Ohm", "10 Ohms"],
    correct: 1,
    explain: "Quality mechanical switches have contact resistance of 30–200mΩ when new. This matters in precision analog circuits where even small voltage drops across the switch create errors. In high-current applications, even 100mΩ dissipates significant power (P = I²R). After wear and oxidation, resistance increases.",
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
    setAnswers((prev) => { const next = [...prev]; next[qi] = oi; return next; });
  };

  const handleSubmit = () => {
    const s = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0);
    setScore(s);
    setSubmitted(true);
    if (s >= PASS_THRESHOLD && !passTriggered) { setPassTriggered(true); onPass(); }
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
        <h2 className="text-xl font-bold mb-1">Switches & Push Buttons Quiz</h2>
        <p className="text-white/45 text-sm mb-5">
          20 questions — pass at 14/20 (70%) to earn <span style={{ color: CYAN }}>+50 XP</span>
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
                borderColor: passed ? "rgba(6,182,212,0.4)" : "rgba(239,68,68,0.35)",
                background: passed ? "rgba(6,182,212,0.08)" : "rgba(239,68,68,0.07)",
              }}
            >
              <p className="text-2xl font-black mb-1" style={{ color: passed ? CYAN : "#EF4444" }}>
                {score}/20
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: passed ? CYAN : "#EF4444" }}>
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
                          ? "rgba(6,182,212,0.1)"
                          : isIntermediate
                          ? "rgba(14,165,233,0.1)"
                          : "rgba(251,146,60,0.1)",
                        color: isBeginner ? CYAN : isIntermediate ? "#0EA5E9" : "#FB923C",
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
                        style = { background: "rgba(6,182,212,0.12)", borderColor: "rgba(6,182,212,0.4)", color: CYAN };
                      } else if (oi === userAnswer && oi !== q.correct) {
                        style = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" };
                      }
                    } else if (userAnswer === oi) {
                      style = { background: "rgba(6,182,212,0.1)", borderColor: "rgba(6,182,212,0.3)", color: "rgba(255,255,255,0.85)" };
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelect(qi, oi)}
                        disabled={submitted}
                        className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all disabled:cursor-default hover:opacity-90"
                        style={style}
                      >
                        <span className="font-mono text-[10px] opacity-50 mr-2">{["A", "B", "C", "D"][oi]}.</span>
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
                            ? "rgba(6,182,212,0.04)"
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

        {/* Submit */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: allAnswered ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${allAnswered ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: allAnswered ? CYAN : "rgba(255,255,255,0.3)",
            }}
          >
            {allAnswered ? "Submit Quiz →" : `Answer all ${questions.length} questions to submit`}
          </button>
        )}

        {submitted && passed && (
          <div
            className="w-full py-3 rounded-xl font-bold text-sm text-center"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: CYAN }}
          >
            Quiz Passed! +50 XP earned ✓
          </div>
        )}
      </div>
    </section>
  );
}
