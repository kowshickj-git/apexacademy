"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card } from "./Section";

interface Step {
  id: number;
  title: string;
  icon: string;
  color: string;
  short: string;
  detail: string;
  signal: string;
}

const STEPS: Step[] = [
  {
    id: 1, title: "IR Sensor Detects Surface", icon: "👁️", color: PURPLE,
    short: "Infrared light bounces off the floor",
    detail: "The IR LED emits invisible 940 nm light downward. White floor reflects it into the photodiode; black tape absorbs it. The module's comparator converts this into a clean digital signal: LOW = line detected, HIGH = plain floor.",
    signal: "OUT = LOW (black) / HIGH (white)",
  },
  {
    id: 2, title: "Microcontroller Reads Values", icon: "🧠", color: CYAN,
    short: "GPIO pins sample both sensors",
    detail: "Every loop iteration (thousands per second), the ESP32/Arduino reads the digital state of both sensor pins with digitalRead(). Two bits of information — left and right — are all the robot knows about the world.",
    signal: "digitalRead(34) → 0 | 1",
  },
  {
    id: 3, title: "Logic Determines Direction", icon: "🔀", color: AMBER,
    short: "if/else rules (or PID) pick an action",
    detail: "The control algorithm maps sensor states to actions: both white → forward; left black → turn left; right black → turn right; both black → stop (finish line). Advanced robots compute a continuous error value and feed it through a PID controller instead.",
    signal: "error = right − left → correction",
  },
  {
    id: 4, title: "Motor Driver Receives Commands", icon: "⚡", color: RED,
    short: "L298N amplifies weak logic signals",
    detail: "GPIO pins can't power motors. Direction pins (IN1–IN4) set which way each H-bridge conducts, and PWM on ENA/ENB chops battery power thousands of times per second — the duty cycle sets the average voltage the motors feel.",
    signal: "PWM 0–255 → 0–100% power",
  },
  {
    id: 5, title: "Robot Adjusts Movement", icon: "🤖", color: GREEN,
    short: "Differential speeds steer the chassis",
    detail: "Slowing the left wheel while the right keeps spinning pivots the robot left (and vice versa). The robot curves back onto the line, the sensors see a new picture, and the whole cycle repeats — a closed feedback loop running forever.",
    signal: "vL ≠ vR → rotation",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2600);
    return () => clearInterval(t);
  }, [auto]);

  const step = STEPS[active];

  return (
    <Section id="how-it-works" num="02" title="How It Works — The Control Loop"
      subtitle="Five stages, repeating thousands of times per second. Click any stage to freeze and inspect it." color={CYAN}>
      <Card className="p-4 sm:p-8">
        {/* Flowchart */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex sm:flex-1 items-center gap-2">
              <button
                onClick={() => { setActive(i); setAuto(false); }}
                className="relative flex-1 p-3 rounded-2xl border text-left transition-all group"
                style={active === i
                  ? { borderColor: `${s.color}88`, background: `${s.color}14`, boxShadow: `0 0 24px ${s.color}22` }
                  : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background: `${s.color}22`, color: s.color }}>
                    STEP {s.id}
                  </span>
                </div>
                <div className="text-[11px] font-bold leading-tight" style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.5)" }}>
                  {s.title}
                </div>
                {active === i && (
                  <motion.div layoutId="hiw-pulse" className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ border: `1px solid ${s.color}` }}
                    animate={{ opacity: [0.7, 0.15, 0.7] }} transition={{ duration: 1.4, repeat: Infinity }} />
                )}
              </button>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:flex items-center shrink-0 text-white/20">
                  <motion.span animate={{ opacity: active === i ? [0.2, 1, 0.2] : 0.2, color: active === i ? s.color : "rgba(255,255,255,0.2)" }}
                    transition={{ duration: 1, repeat: active === i ? Infinity : 0 }} className="text-lg font-black">
                    →
                  </motion.span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* loop-back arrow */}
        <div className="hidden sm:flex items-center gap-2 -mt-4 mb-6 px-2">
          <div className="flex-1 border-b border-dashed border-white/12 relative">
            <motion.div className="absolute -top-1 w-2 h-2 rounded-full" style={{ background: GREEN }}
              animate={{ right: ["0%", "100%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} />
          </div>
          <span className="text-[10px] text-white/30 font-mono">loop repeats ~1000×/sec ↺</span>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-[1fr_auto] gap-4 items-center p-5 rounded-2xl border"
            style={{ borderColor: `${step.color}33`, background: `${step.color}0a` }}>
            <div>
              <div className="text-sm font-black mb-1.5" style={{ color: step.color }}>
                {step.icon} {step.title} — <span className="text-white/60 font-semibold">{step.short}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{step.detail}</p>
            </div>
            <div className="px-4 py-3 rounded-xl font-mono text-[11px] text-center border shrink-0"
              style={{ borderColor: `${step.color}44`, background: "rgba(5,5,7,0.6)", color: step.color }}>
              {step.signal}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end mt-3">
          <button onClick={() => setAuto((a) => !a)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all"
            style={auto ? { borderColor: `${GREEN}55`, color: GREEN, background: `${GREEN}0d` } : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}>
            {auto ? "⏸ Pause auto-play" : "▶ Resume auto-play"}
          </button>
        </div>
      </Card>
    </Section>
  );
}
