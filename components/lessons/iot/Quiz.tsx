"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#6366F1";
const PASS_SCORE = 14;

interface Props {
  onPass: () => void;
}

const questions = [
  {
    q: "IoT stands for:",
    options: ["Internet of Technology", "Internet of Things", "Integrated of Things", "Internet of Transfers"],
    correct: 1,
  },
  {
    q: "MQTT runs on port (unencrypted):",
    options: ["80", "443", "1883", "8883"],
    correct: 2,
  },
  {
    q: "MQTT is a:",
    options: ["File transfer protocol", "Request-response protocol", "Publish/subscribe protocol", "Polling protocol"],
    correct: 2,
  },
  {
    q: "LoRa is best for:",
    options: ["High bandwidth indoors", "Short range high power", "Long range low bandwidth low power", "Video streaming"],
    correct: 2,
  },
  {
    q: "Best protocol for battery-powered wearables:",
    options: ["WiFi", "Ethernet", "BLE", "LoRa"],
    correct: 2,
  },
  {
    q: "Edge computing means:",
    options: ["Data center at edge of city", "Processing data locally on the device", "Faster internet", "GPU computing"],
    correct: 1,
  },
  {
    q: "IoT layer that includes sensors:",
    options: ["Network layer", "Processing layer", "Perception layer", "Application layer"],
    correct: 2,
  },
  {
    q: "MQTT over TLS uses port:",
    options: ["443", "1883", "8883", "1194"],
    correct: 2,
  },
  {
    q: "ESP32 WiFi active current:",
    options: ["1mA", "10mA", "~80-240mA", "1A"],
    correct: 2,
  },
  {
    q: "ESP32 deep sleep current:",
    options: ["~10µA", "1mA", "10mA", "100mA"],
    correct: 0,
  },
  {
    q: "MQTT QoS level 0 means:",
    options: ["Exactly once", "At least once", "At most once (fire and forget)", "Guaranteed delivery"],
    correct: 2,
  },
  {
    q: "AWS IoT Core is:",
    options: ["A WiFi router", "A MQTT broker chip", "A cloud IoT platform", "An IoT sensor"],
    correct: 2,
  },
  {
    q: "Which is NOT an IoT protocol:",
    options: ["MQTT", "CoAP", "RS232", "Zigbee"],
    correct: 2,
  },
  {
    q: "NB-IoT stands for:",
    options: ["Network-Based IoT", "Narrowband IoT (cellular)", "No-Battery IoT", "Near-Band IoT"],
    correct: 1,
  },
  {
    q: "A MQTT broker:",
    options: [
      "Stores data permanently",
      "Routes messages between publishers and subscribers",
      "Controls IoT hardware",
      "Replaces a router",
    ],
    correct: 1,
  },
  {
    q: "Digital twin is:",
    options: ["A backup device", "Virtual representation of physical device", "Two identical sensors", "A type of IoT protocol"],
    correct: 1,
  },
  {
    q: "Mirai botnet used:",
    options: ["Personal computers", "Industrial PLCs", "Compromised IoT devices for DDoS", "Solar inverters"],
    correct: 2,
  },
  {
    q: "ThingSpeak is:",
    options: ["An IoT hardware brand", "A free IoT cloud platform", "A MQTT chip", "A Zigbee protocol"],
    correct: 1,
  },
  {
    q: "OTA update means:",
    options: ["On-The-Air", "Over-The-Air firmware update", "Only-Timed Alerts", "Offline-To-Antenna"],
    correct: 1,
  },
  {
    q: "Zigbee operates at:",
    options: ["433 MHz", "868 MHz", "2.4 GHz", "5 GHz"],
    correct: 2,
  },
];

export default function Quiz({ onPass }: Props) {
  const passed = useRef(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers(prev => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answers.some(a => a === null)) return;
    const s = questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);
    setScore(s);
    setSubmitted(true);
    if (s >= PASS_SCORE && !passed.current) {
      passed.current = true;
      onPass();
    }
  };

  const handleRetry = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          IoT Fundamentals Quiz
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          20 questions · Pass ≥ 14/20 · Earn 50 XP
        </p>
      </div>

      {/* Progress */}
      {!submitted && (
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%`, background: COLOR }}
            />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {answeredCount}/{questions.length}
          </span>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div
            key={qi}
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex gap-2 mb-3">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                style={{ background: `rgba(99,102,241,0.2)`, color: COLOR }}
              >
                Q{qi + 1}
              </span>
              <span className="text-sm" style={{ color: "#fff" }}>
                {q.q}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = oi === q.correct;
                const isWrong = submitted && isSelected && !isCorrect;
                const showCorrect = submitted && isCorrect;

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                    className="text-left px-3 py-2 rounded-lg text-sm transition-all"
                    style={{
                      background: showCorrect
                        ? "rgba(16,185,129,0.15)"
                        : isWrong
                        ? "rgba(239,68,68,0.15)"
                        : isSelected
                        ? `rgba(99,102,241,0.2)`
                        : "rgba(255,255,255,0.04)",
                      border: showCorrect
                        ? "1px solid rgba(16,185,129,0.5)"
                        : isWrong
                        ? "1px solid rgba(239,68,68,0.5)"
                        : isSelected
                        ? `1px solid rgba(99,102,241,0.5)`
                        : "1px solid rgba(255,255,255,0.07)",
                      color: showCorrect
                        ? "#10b981"
                        : isWrong
                        ? "#ef4444"
                        : isSelected
                        ? "#fff"
                        : "rgba(255,255,255,0.6)",
                      cursor: submitted ? "default" : "pointer",
                    }}
                  >
                    <span className="font-semibold mr-1">
                      {["A", "B", "C", "D"][oi]}.
                    </span>
                    {opt}
                    {showCorrect && " ✓"}
                    {isWrong && " ✗"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit / Result */}
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.button
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSubmit}
            disabled={answeredCount < questions.length}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all"
            style={{
              background: answeredCount === questions.length ? COLOR : "rgba(99,102,241,0.2)",
              color: answeredCount === questions.length ? "#fff" : "rgba(255,255,255,0.3)",
              cursor: answeredCount === questions.length ? "pointer" : "not-allowed",
            }}
          >
            {answeredCount < questions.length
              ? `Answer all questions (${questions.length - answeredCount} remaining)`
              : "Submit Quiz"}
          </motion.button>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 text-center"
            style={{
              background: score >= PASS_SCORE ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              border: score >= PASS_SCORE ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <div className="text-4xl mb-2">{score >= PASS_SCORE ? "🎉" : "📚"}</div>
            <div
              className="text-2xl font-black mb-1"
              style={{ color: score >= PASS_SCORE ? "#10b981" : "#ef4444" }}
            >
              {score}/{questions.length}
            </div>
            <div
              className="text-sm mb-1"
              style={{ color: score >= PASS_SCORE ? "#10b981" : "#ef4444" }}
            >
              {score >= PASS_SCORE ? "Passed! +50 XP" : `Need ${PASS_SCORE} to pass`}
            </div>
            <div className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              {Math.round((score / questions.length) * 100)}% correct
            </div>
            {score < PASS_SCORE && (
              <button
                onClick={handleRetry}
                className="px-6 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: COLOR, color: "#fff" }}
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
