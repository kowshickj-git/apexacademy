"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const questions = [
  // Beginner (1-10)
  {
    level: "Beginner",
    q: "What does 'LED' stand for?",
    options: ["Light Emitting Device", "Low Energy Diode", "Light Emitting Diode", "Luminescent Electron Driver"],
    correct: 2,
    explain: "LED = Light Emitting Diode. It's a diode (P-N junction semiconductor) that emits photons when forward biased.",
  },
  {
    level: "Beginner",
    q: "On a standard 5mm LED, which leg is the anode (+)?",
    options: ["The shorter leg", "The longer leg", "The leg nearest the flat edge", "Whichever leg is left"],
    correct: 1,
    explain: "The longer leg is always the anode (+). The shorter leg near the flat edge of the body is the cathode (−).",
  },
  {
    level: "Beginner",
    q: "For an LED to emit light, current must flow:",
    options: ["From cathode to anode (reverse bias)", "From anode to cathode (forward bias)", "In either direction — LEDs work both ways", "Only through the flat side of the body"],
    correct: 1,
    explain: "Current must flow from Anode (+) to Cathode (−) — forward bias. This pushes electrons and holes to the junction where they recombine and emit photons.",
  },
  {
    level: "Beginner",
    q: "What happens if you connect an LED backwards (reversed polarity)?",
    options: ["It glows dimly", "It immediately burns out", "It simply doesn't light up (reverse bias blocks current)", "It flashes"],
    correct: 2,
    explain: "A reversed LED is reverse biased — the P-N junction blocks current. The LED is unharmed (as long as reverse voltage is low) but produces no light.",
  },
  {
    level: "Beginner",
    q: "What is the approximate forward voltage (Vf) of a typical RED LED?",
    options: ["0.7V", "1.2V", "2.0–2.2V", "5.0V"],
    correct: 2,
    explain: "Red LEDs have Vf ≈ 2.0–2.2V. This is much higher than a silicon rectifier diode (0.7V). Blue/white LEDs need 3.0–3.4V.",
  },
  {
    level: "Beginner",
    q: "Why does an LED need a series resistor?",
    options: ["To make it glow red", "To store energy for the LED", "To limit current and prevent burnout", "To increase the forward voltage"],
    correct: 2,
    explain: "Without a resistor, LED current increases exponentially with voltage (non-linear device). A series resistor limits current to a safe value (typically 10–20mA).",
  },
  {
    level: "Beginner",
    q: "For a 5V supply and red LED (Vf=2.0V, If=20mA), what resistor value is needed?",
    options: ["10Ω", "75Ω", "150Ω (use 220Ω)", "1kΩ"],
    correct: 2,
    explain: "R = (Vs − Vf) / If = (5 − 2) / 0.02 = 150Ω. Choose 220Ω from the standard E12 series (rounds up) for a safety margin.",
  },
  {
    level: "Beginner",
    q: "Which LED color was the last to be developed, enabling white LEDs?",
    options: ["Red", "Green", "Yellow", "Blue"],
    correct: 3,
    explain: "Blue LEDs (InGaN) were invented in 1994 by Nakamura, Akasaki & Amano (Nobel Prize 2014). White LEDs are made by combining a blue LED with a yellow phosphor.",
  },
  {
    level: "Beginner",
    q: "What is the typical maximum continuous current for a standard 5mm LED?",
    options: ["2mA", "20mA", "200mA", "2A"],
    correct: 1,
    explain: "Standard 5mm LEDs are rated for 20mA continuous. Some can briefly handle 30mA but running at 20mA gives the best life and efficiency.",
  },
  {
    level: "Beginner",
    q: "What does the flat side on a 5mm LED body indicate?",
    options: ["The anode side (+)", "The cathode side (−)", "Just a manufacturing mark", "The direction of maximum light output"],
    correct: 1,
    explain: "The flat side of the LED body indicates the cathode (−) side. The leg on the flat side is the shorter leg — also the cathode. This matches the bar in the circuit symbol.",
  },

  // Intermediate (11-15)
  {
    level: "Intermediate",
    q: "Why do blue LEDs have a higher forward voltage than red LEDs?",
    options: ["Blue LEDs are less efficient", "Blue light photons have higher energy, requiring a wider band-gap semiconductor", "Blue LEDs are larger and need more voltage to push current through", "Blue LEDs have more resistance inside"],
    correct: 1,
    explain: "Photon energy E = hν = hc/λ. Blue light (λ≈450nm) carries more energy than red (λ≈630nm). The LED's semiconductor must match this photon energy — wider band gap = higher Vf.",
  },
  {
    level: "Intermediate",
    q: "Who invented the first practical visible-light LED, and in what year?",
    options: ["Henry Round, 1907", "Nick Holonyak Jr., 1962", "Oleg Losev, 1927", "Shuji Nakamura, 1994"],
    correct: 1,
    explain: "Nick Holonyak Jr. at GE created the first practical red LED in 1962 using GaAsP (gallium arsenide phosphide). He is known as the 'father of the LED'.",
  },
  {
    level: "Intermediate",
    q: "How does RGB LED colour mixing work compared to mixing paint?",
    options: ["Both are subtractive — mixing all gives black", "RGB is additive (R+G+B=White); paint is subtractive (mix all pigments=Black)", "RGB is subtractive; paint mixing is additive", "They work the same way — mixing is mixing"],
    correct: 1,
    explain: "RGB light is additive: adding all three colours produces white (all photons combined). Paint is subtractive: pigments absorb light; mixing all pigments absorbs everything, producing black.",
  },
  {
    level: "Intermediate",
    q: "What is PWM (Pulse Width Modulation) used for in LED control?",
    options: ["Increasing the forward voltage", "Controlling LED brightness by rapidly switching it on/off at a variable duty cycle", "Selecting LED colour", "Preventing reverse bias"],
    correct: 1,
    explain: "PWM switches the LED on/off thousands of times per second. The duty cycle (% on-time) controls perceived brightness. This avoids colour-shift issues that occur with voltage dimming.",
  },
  {
    level: "Intermediate",
    q: "For a 9V supply and green LED (Vf=2.2V, If=15mA), what is the correct resistor?",
    options: ["147Ω → use 150Ω", "400Ω → use 470Ω", "450Ω → use 470Ω", "600Ω → use 680Ω"],
    correct: 1,
    explain: "R = (9 − 2.2) / 0.015 = 6.8 / 0.015 = 453Ω → nearest standard value is 470Ω. Always round up for safety.",
  },

  // Advanced (16-20)
  {
    level: "Advanced",
    q: "What is electroluminescence?",
    options: ["Light produced by heating a filament", "Light produced by electron-hole recombination at a P-N junction when current flows", "Light reflected from a fluorescent coating", "Light from a plasma discharge"],
    correct: 1,
    explain: "Electroluminescence is the emission of light from a semiconductor in response to electric current. Electrons and holes recombine at the P-N junction, releasing energy as photons whose wavelength depends on the band-gap energy.",
  },
  {
    level: "Advanced",
    q: "At the LED's P-N junction, exactly what produces the photon?",
    options: ["Electrons colliding with the encapsulant dome", "An electron dropping to a lower energy level as it fills a hole, releasing the energy difference as a photon", "Heat from the resistor being radiated as light", "The LED's crystal vibrating at its resonant frequency"],
    correct: 1,
    explain: "When an electron (from N-type) recombines with a hole (from P-type), it falls to a lower energy state. ΔE = hν — the energy difference is released as a photon. The photon's frequency (colour) is determined by ΔE.",
  },
  {
    level: "Advanced",
    q: "For a 12V supply and blue LED (Vf=3.2V, If=20mA), what resistor is needed?",
    options: ["160Ω → use 180Ω", "220Ω", "440Ω → use 470Ω", "620Ω → use 680Ω"],
    correct: 2,
    explain: "R = (12 − 3.2) / 0.02 = 8.8 / 0.02 = 440Ω. The nearest standard E12 value above 440Ω is 470Ω — always round up to stay within the safe current limit.",
  },
  {
    level: "Advanced",
    q: "Why does LED forward voltage DECREASE as junction temperature increases?",
    options: ["The LED becomes more efficient at high temperature", "Higher temperature gives charge carriers more thermal energy, reducing the energy barrier needed for recombination", "The semiconductor expands, making it easier for current to flow", "The encapsulant becomes transparent, reducing voltage loss"],
    correct: 1,
    explain: "As temperature increases, more carriers have enough thermal energy to cross the depletion region barrier. This reduces the required forward voltage by approximately −2mV/°C, causing higher current at fixed voltage — a potential thermal runaway.",
  },
  {
    level: "Advanced",
    q: "A WS2812B 'NeoPixel' LED is described as 'addressable'. What does this mean?",
    options: ["It has a registered IP address for IoT control", "Each LED contains an integrated circuit that decodes serial data, so hundreds of LEDs can be controlled independently from a single microcontroller pin", "The LED can only be used at specific memory addresses in code", "The LED changes colour randomly without external control"],
    correct: 1,
    explain: "WS2812B LEDs contain a tiny IC chip alongside the RGB dies. You send 24-bit RGB data serially (800kbps). Each LED reads its data, latches the value, and passes remaining data downstream — creating a chainable data bus. One pin controls thousands.",
  },
];

const PASS_THRESHOLD = 14;

export default function Quiz({ onPass }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [passedOnce, setPassedOnce] = useState(false);

  const select = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers((a) => { const n = [...a]; n[qi] = oi; return n; });
  };

  const submit = () => {
    const score = answers.filter((a, i) => a === questions[i].correct).length;
    const ok = score >= PASS_THRESHOLD;
    setSubmitted(true);
    setPassed(ok);
    if (ok && !passedOnce) { setPassedOnce(true); onPass(); }
  };

  const retry = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setPassed(false);
  };

  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const allAnswered = answers.every((a) => a !== null);

  const levelColors: Record<string, string> = {
    Beginner: "#10B981",
    Intermediate: "#F97316",
    Advanced: "#EF4444",
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 17 · Quiz</p>
        <h2 className="text-xl font-bold mb-1">Test Your Knowledge</h2>
        <p className="text-white/45 text-sm mb-4 leading-relaxed">
          20 questions across 3 difficulty levels. Pass ≥14/20 to earn quiz XP. All questions test what you just learned.
        </p>

        {/* Level legend */}
        <div className="flex gap-3 mb-6">
          {[["Beginner", "#10B981", "1–10"], ["Intermediate", "#F97316", "11–15"], ["Advanced", "#EF4444", "16–20"]].map(([label, color, range]) => (
            <div key={label} className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span style={{ color }}>{label}</span>
              <span className="text-white/25">Q{range}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6 mb-6">
          {questions.map((q, qi) => {
            const answered = answers[qi] !== null;
            const isCorrect = submitted && answers[qi] === q.correct;
            const isWrong = submitted && answered && answers[qi] !== q.correct;

            return (
              <div key={qi}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: `${levelColors[q.level]}20`, color: levelColors[q.level] }}>{q.level}</span>
                  <p className="text-sm font-semibold text-white/80">
                    <span className="text-white/25 font-mono text-xs mr-1">{qi + 1}.</span>{q.q}
                  </p>
                </div>
                <div className="space-y-2 mb-2 ml-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    let bg = "rgba(255,255,255,0.03)";
                    let border = "rgba(255,255,255,0.08)";
                    let color = "rgba(255,255,255,0.55)";
                    if (!submitted && chosen) { bg = "rgba(239,68,68,0.12)"; border = "rgba(239,68,68,0.35)"; color = "#FCA5A5"; }
                    if (submitted && oi === q.correct) { bg = "rgba(16,185,129,0.1)"; border = "rgba(16,185,129,0.35)"; color = "#10B981"; }
                    if (submitted && chosen && oi !== q.correct) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.35)"; color = "#EF4444"; }

                    return (
                      <button
                        key={oi}
                        onClick={() => select(qi, oi)}
                        disabled={submitted}
                        className="w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all"
                        style={{ background: bg, borderColor: border, color }}
                      >
                        <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                        {submitted && oi === q.correct && " ✓"}
                        {submitted && chosen && oi !== q.correct && " ✗"}
                      </button>
                    );
                  })}
                </div>
                {submitted && (isCorrect || isWrong) && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs leading-relaxed px-2 ml-2"
                    style={{ color: isCorrect ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)" }}
                  >
                    {q.explain}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={submit}
              disabled={!allAnswered}
              className="w-full py-3 rounded-2xl font-bold text-sm transition-all"
              style={allAnswered
                ? { background: "#EF4444", color: "#ffffff" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }
              }
            >
              {allAnswered ? "Submit All 20 Questions →" : `Answer all questions (${answers.filter(a => a !== null).length}/20)`}
            </motion.button>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-6 text-center"
              style={passed
                ? { background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)" }
                : { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" }
              }
            >
              <p className="text-3xl mb-2">{passed ? "🏆" : "💪"}</p>
              <p className="text-xl font-black mb-1" style={{ color: passed ? "#10B981" : "#EF4444" }}>
                {score}/{questions.length}
              </p>
              <p className="text-sm font-semibold mb-3" style={{ color: passed ? "#10B981" : "rgba(255,255,255,0.5)" }}>
                {passed ? "Quiz passed! +50 XP earned." : `Need ${PASS_THRESHOLD}/20 to pass. Keep learning and retry!`}
              </p>
              {!passed && (
                <button
                  onClick={retry}
                  className="px-6 py-2 rounded-xl font-bold text-sm border border-white/15 text-white/60 hover:bg-white/5 transition-colors"
                >
                  Retry Quiz
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
