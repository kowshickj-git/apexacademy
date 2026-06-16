"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass: () => void; }

const COLOR = "#0EA5E9";

const QUESTIONS = [
  { q: "What does a sensor do?", o: ["Converts physical parameters to electrical signals", "Amplifies voltage signals", "Stores electrical energy", "Converts electrical to mechanical energy"], a: 0, level: "Beginner" },
  { q: "What type of sensor is an LDR (Light Dependent Resistor)?", o: ["Analog", "Digital", "Binary", "Pulse-width"], a: 0, level: "Beginner" },
  { q: "What speed of sound is used in HC-SR04 calculations?", o: ["343 m/s", "300 m/s", "1500 m/s", "3000 m/s"], a: 0, level: "Beginner" },
  { q: "What is the output formula for an LM35 temperature sensor?", o: ["10 mV per °C", "1 mV per °C", "100 mV per °C", "1V per °C"], a: 0, level: "Beginner" },
  { q: "What does PIR stand for?", o: ["Passive Infrared", "Photonic Infrared", "Pulse Infrared Receiver", "Powered Infrared"], a: 0, level: "Beginner" },
  { q: "An HC-SR04 ultrasonic sensor has a maximum range of:", o: ["400 cm", "100 cm", "200 cm", "50 cm"], a: 0, level: "Beginner" },
  { q: "What is sensor accuracy?", o: ["How close the reading is to the true value", "How fast the sensor responds", "How repeatable the measurements are", "The smallest detectable change"], a: 0, level: "Beginner" },
  { q: "What is sensor precision?", o: ["Repeatability of measurements", "Closeness to the true value", "Maximum measurable value", "Output voltage range"], a: 0, level: "Beginner" },
  { q: "A DHT11 sensor measures:", o: ["Temperature and humidity", "Temperature and pressure", "Light and temperature", "Motion and humidity"], a: 0, level: "Beginner" },
  { q: "The Nyquist theorem states you must sample at:", o: ["≥ 2× the highest signal frequency", "≥ 10× the highest signal frequency", "≥ the highest signal frequency", "At any rate above 100 Hz"], a: 0, level: "Beginner" },
  { q: "What is sensor calibration?", o: ["Adjusting output to match a known reference", "Resetting the sensor to factory settings", "Increasing sensor sensitivity", "Reducing sensor noise"], a: 0, level: "Intermediate" },
  { q: "An MPU-6050 contains which two sensors?", o: ["Accelerometer and gyroscope", "Temperature and humidity", "LDR and thermistor", "Magnetometer and barometer"], a: 0, level: "Intermediate" },
  { q: "A PIR sensor detects:", o: ["Infrared radiation from moving warm bodies", "Visible light changes", "Ultrasonic reflections", "Magnetic field changes"], a: 0, level: "Intermediate" },
  { q: "What is a voltage divider used for with an LDR?", o: ["To convert resistance changes to voltage", "To amplify the signal", "To filter noise", "To increase current"], a: 0, level: "Intermediate" },
  { q: "What is sensor sampling rate?", o: ["How often readings are taken per second", "The maximum output voltage", "The sensor's power consumption", "The number of ADC bits"], a: 0, level: "Intermediate" },
  { q: "The MQ-2 gas sensor primarily detects:", o: ["LPG, smoke, and hydrogen", "CO₂ and methane only", "Oxygen levels", "Water vapor"], a: 0, level: "Intermediate" },
  { q: "What is sensor noise?", o: ["Unwanted random variation in sensor output", "Audible sound from the sensor", "Electromagnetic interference from wires", "ADC quantization error only"], a: 0, level: "Advanced" },
  { q: "A capacitive touch sensor detects:", o: ["Changes in electric field near the sensor", "Physical pressure force", "Infrared body heat", "Ultrasonic reflections"], a: 0, level: "Advanced" },
  { q: "What is sensor range?", o: ["Min and max values the sensor can reliably measure", "The wireless communication distance", "The maximum cable length", "The operating temperature of the sensor IC"], a: 0, level: "Advanced" },
  { q: "What is sensor fusion?", o: ["Combining multiple sensor readings for improved accuracy", "Physically combining two sensors in one package", "Fusing sensor data into a database", "Using one sensor to calibrate another"], a: 0, level: "Advanced" },
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
              borderColor: passed ? "rgba(14,165,233,0.35)" : "rgba(239,68,68,0.3)",
              background: passed ? "rgba(14,165,233,0.06)" : "rgba(239,68,68,0.06)",
            }}
          >
            <div className="text-5xl mb-3">{passed ? "🏆" : "📖"}</div>
            <div className="text-3xl font-black mb-1" style={{ color: passed ? COLOR : "#EF4444" }}>{score}/20</div>
            <div className="text-sm mb-1" style={{ color: "rgba(240,240,245,0.5)" }}>
              {passed ? "Sensors Mastered! You understand how sensors work." : "Need 14/20 to pass. Review the simulators above and try again."}
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
                    background: correct ? "rgba(14,165,233,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${correct ? "rgba(14,165,233,0.3)" : "rgba(239,68,68,0.3)"}`,
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
                style={{ borderColor: "rgba(14,165,233,0.4)", background: "rgba(14,165,233,0.12)", color: COLOR }}
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
        <h2 className="text-xl font-bold mb-1" style={{ color: "#F0F0F5" }}>Sensors Quiz</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>20 questions · Pass with 14/20</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${COLOR}, #38BDF8)` }} animate={{ width: `${(current / 20) * 100}%` }} />
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
              style={{ borderColor: "rgba(14,165,233,0.18)", background: "rgba(14,165,233,0.04)" }}
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
                      borderColor: selected === i ? "rgba(14,165,233,0.6)" : "rgba(255,255,255,0.07)",
                      background: selected === i ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.02)",
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
              style={{ borderColor: "rgba(14,165,233,0.4)", background: "rgba(14,165,233,0.12)", color: COLOR }}
            >
              {isLast ? "Submit Quiz →" : "Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
