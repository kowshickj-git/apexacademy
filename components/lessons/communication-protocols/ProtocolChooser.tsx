"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#8B5CF6";

const QUESTIONS = [
  {
    id: "devices",
    text: "How many devices need to communicate?",
    options: ["2 devices (point-to-point)", "3–10 devices", "10+ devices"],
  },
  {
    id: "distance",
    text: "How far apart are the devices?",
    options: ["< 1 meter (same PCB / box)", "1–15 meters", "> 15 meters"],
  },
  {
    id: "speed",
    text: "What data speed is needed?",
    options: ["Low (< 115,200 bps)", "Medium (< 1 Mbps)", "High (> 1 Mbps)"],
  },
  {
    id: "env",
    text: "What is the operating environment?",
    options: ["Indoor / Lab / Consumer", "Industrial / Noisy / Automotive"],
  },
];

interface Answers { devices: number; distance: number; speed: number; env: number; }

function recommend(a: Answers): { name: string; color: string; reason: string; specs: string } {
  // > 15 meters → RS485 always wins
  if (a.distance === 2) {
    return { name: "RS485", color: "#EF4444", reason: "RS485 is the only choice for distances > 15m. Differential signaling rejects noise over long cables.", specs: "2 wires · Up to 1200m · Up to 10 Mbps · Half duplex" };
  }
  // Industrial environment
  if (a.env === 1) {
    if (a.devices >= 1) {
      return { name: "CAN Bus", color: "#F59E0B", reason: "CAN was designed for industrial and automotive noise environments. Multi-master, fault-tolerant differential bus.", specs: "2 wires · Up to 500m · 1 Mbps · Half duplex" };
    }
  }
  // 10+ devices
  if (a.devices === 2) {
    return { name: "RS485 or CAN", color: "#F59E0B", reason: "Many devices on one bus. RS485 (MODBUS) for industrial, CAN for automotive. Both support many nodes.", specs: "2 wires · Multi-node · Differential signaling" };
  }
  // 3-10 devices, short distance
  if (a.devices === 1 && a.distance === 0) {
    if (a.speed === 2) {
      return { name: "SPI", color: "#10B981", reason: "High-speed, short-distance, multiple devices — SPI is ideal. Each device gets its own CS line.", specs: "4 wires + CS per device · Up to 50+ MHz · Full duplex" };
    }
    return { name: "I2C", color: "#06B6D4", reason: "Multiple devices on the same board with a shared 2-wire bus. Add up to 127 devices with unique addresses.", specs: "2 wires (SDA + SCL) · 100k/400kHz · Up to 127 devices" };
  }
  // 2 devices, short, high speed
  if (a.devices === 0 && a.distance === 0 && a.speed === 2) {
    return { name: "SPI", color: "#10B981", reason: "Two devices, same PCB, need high speed — SPI is the fastest embedded protocol with minimal overhead.", specs: "4 wires · Up to 50+ MHz · Full duplex · Synchronous" };
  }
  // 2 devices, short/medium, low/medium speed
  if (a.devices === 0 && a.distance <= 1 && a.speed <= 1) {
    return { name: "UART", color: COLOR, reason: "Simple point-to-point, moderate distance and speed. UART is the easiest to implement with just TX and RX.", specs: "2 wires · Up to 1 Mbps · Full duplex · Asynchronous" };
  }
  // 2 devices, same board, multiple sensors
  if (a.devices === 0 && a.distance === 0) {
    return { name: "I2C or SPI", color: "#06B6D4", reason: "Two devices on the same board. I2C if you need address-based selection; SPI if speed matters more.", specs: "I2C: 2 wires · SPI: 4 wires · Both synchronous" };
  }
  // Default
  return { name: "UART", color: COLOR, reason: "For general-purpose serial communication between two devices, UART is the simplest and most universal choice.", specs: "2 wires · Up to 1 Mbps · Full duplex · Asynchronous" };
}

export default function ProtocolChooser({ onUsed }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<ReturnType<typeof recommend> | null>(null);
  const usedRef = useRef(false);

  const keys = ["devices", "distance", "speed", "env"] as const;

  function handleOption(optIndex: number) {
    const key = keys[step];
    const newAnswers = { ...answers, [key]: optIndex } as Answers;
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      const rec = recommend(newAnswers as Answers);
      setResult(rec);
      if (!usedRef.current) { usedRef.current = true; onUsed(); }
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 07 · Protocol Selection</p>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#F0F0F5" }}>Protocol Chooser</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.45)" }}>Answer 4 questions to find the right protocol for your project.</p>

        {/* Progress indicator */}
        {!result && (
          <div className="flex gap-1.5 mb-6">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? COLOR : "rgba(255,255,255,0.08)" }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22 }}
            >
              <div className="rounded-2xl border p-5 mb-4" style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}>
                <div className="text-xs font-mono mb-2" style={{ color: "rgba(139,92,246,0.5)" }}>Question {step + 1} of {QUESTIONS.length}</div>
                <p className="text-base font-bold mb-4" style={{ color: "#F0F0F5" }}>{QUESTIONS[step].text}</p>
                <div className="space-y-2">
                  {QUESTIONS[step].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleOption(i)}
                      className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all hover:bg-white/5"
                      style={{ borderColor: "rgba(139,92,246,0.2)", background: "rgba(255,255,255,0.02)", color: "rgba(240,240,245,0.7)" }}
                    >
                      <span className="font-mono text-xs mr-2" style={{ color: "rgba(139,92,246,0.5)" }}>{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl border p-6 mb-4" style={{ borderColor: `${result.color}40`, background: `rgba(5,5,7,0.8)` }}>
                <div className="text-center mb-4">
                  <div className="text-xs font-mono mb-1" style={{ color: "rgba(240,240,245,0.3)" }}>Recommended Protocol</div>
                  <div className="text-4xl font-black mb-2" style={{ color: result.color }}>{result.name}</div>
                  <div className="text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>{result.reason}</div>
                </div>

                <div className="p-3 rounded-xl mb-4 text-center" style={{ background: `${result.color}10`, border: `1px solid ${result.color}30` }}>
                  <div className="text-[10px] font-mono mb-1" style={{ color: `${result.color}80` }}>Key Specifications</div>
                  <div className="text-xs font-semibold" style={{ color: "#F0F0F5" }}>{result.specs}</div>
                </div>

                {/* Answers recap */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  {keys.map((k, i) => (
                    <div key={k} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ color: "rgba(240,240,245,0.35)" }}>{QUESTIONS[i].text.split("?")[0]}?</div>
                      <div className="font-semibold mt-0.5" style={{ color: "rgba(240,240,245,0.7)" }}>
                        {QUESTIONS[i].options[answers[k] ?? 0]}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={reset}
                  className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
