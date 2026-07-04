"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, RED, Card } from "./Section";

interface Problem {
  id: string;
  symptom: string;
  icon: string;
  diagnosis: string;
  causes: { cause: string; probability: number; fix: string }[];
}

const PROBLEMS: Problem[] = [
  {
    id: "not-moving",
    symptom: "Robot not moving at all",
    icon: "🚫",
    diagnosis: "No motion means no power reaching the motors, or no commands reaching the driver. I'll trace the power chain first — it's the culprit 80% of the time.",
    causes: [
      { cause: "Battery flat or switch OFF", probability: 45, fix: "Measure battery voltage — below 6.5V the L298N regulator browns out. Charge cells, flip the switch, and check the driver's red power LED." },
      { cause: "ENA/ENB jumpers or PWM at 0", probability: 30, fix: "If you removed the ENA/ENB jumper caps but never wired PWM pins, the H-bridges are disabled. Wire GPIO32/33 to ENA/ENB or replace the caps for full-speed testing." },
      { cause: "Missing common ground", probability: 25, fix: "The ESP32's GND must connect to the L298N GND. Without a shared reference the IN pins read as noise. Run one jumper: controller GND → driver GND." },
    ],
  },
  {
    id: "reversed",
    symptom: "Motors spin the wrong way",
    icon: "🔄",
    diagnosis: "Classic polarity issue. A DC motor doesn't know 'forward' — it only knows current direction. Somewhere, + and − are swapped.",
    causes: [
      { cause: "Motor wires swapped at OUT terminals", probability: 60, fix: "Zero-cost fix: swap the two wires of the reversed motor at OUT1/OUT2 (or OUT3/OUT4). No code change needed." },
      { cause: "IN pin logic inverted in code", probability: 40, fix: "Or fix it in firmware: swap HIGH/LOW on that motor's IN pair inside forward(). Pick ONE fix — doing both puts you back where you started!" },
    ],
  },
  {
    id: "sensor-dead",
    symptom: "Sensor not detecting the line",
    icon: "👁️‍🗨️",
    diagnosis: "The sensor's onboard LEDs tell the story: power LED off means wiring; power on but no reaction means calibration or height.",
    causes: [
      { cause: "Threshold potentiometer mis-set", probability: 40, fix: "Hold the sensor over white, turn the trim pot until the signal LED turns ON, then over black until it turns OFF. That's calibration — 10 seconds with a screwdriver." },
      { cause: "Sensor mounted too high", probability: 35, fix: "IR reflection fades with distance². Mount the sensor 3–8 mm above the surface — roughly the thickness of two stacked coins." },
      { cause: "Sunlight / IR interference", probability: 25, fix: "Direct sunlight floods the photodiode with IR. Test indoors, add a cardboard skirt around the sensor, or use modules with modulated IR." },
    ],
  },
  {
    id: "spinning",
    symptom: "Robot keeps spinning in circles",
    icon: "🌀",
    diagnosis: "Continuous spinning means one side is driving and the other isn't — or the controller believes the line is permanently on one side.",
    causes: [
      { cause: "One motor not powered", probability: 40, fix: "Lift the robot and command forward: if only one wheel turns, check that motor's OUT wiring and its IN pins. A loose OUT wire is the usual suspect." },
      { cause: "Sensors swapped (L↔R)", probability: 35, fix: "If the left sensor is wired to the right GPIO, every correction steers the WRONG way and errors amplify. Swap the OUT wires at GPIO34/35 — or swap the pin numbers in code." },
      { cause: "One sensor stuck reading BLACK", probability: 25, fix: "A sensor jammed at LOW makes the robot 'chase' a phantom line forever. Re-calibrate its pot; check its VCC wire isn't loose." },
    ],
  },
  {
    id: "power",
    symptom: "Random resets / works only sometimes",
    icon: "🔌",
    diagnosis: "Intermittent behavior is almost always a power integrity problem — motors are electrically noisy neighbors for microcontrollers.",
    causes: [
      { cause: "Voltage sag under motor load", probability: 45, fix: "When motors start, they draw 3–5× running current, sagging the rail and resetting the MCU. Use fresh Li-ion cells (not a 9V PP3!) and add a 470 µF capacitor across the driver's supply." },
      { cause: "Loose jumper connections", probability: 35, fix: "Vibration + DuPont jumpers = intermittent contact. Push every connector home, then hot-glue or tape them. Competition teams solder everything." },
      { cause: "Brownout from shared 5V", probability: 20, fix: "The L298N's onboard 5V regulator is weak. If it can't feed the ESP32 during spikes, power the ESP32 from a separate USB power bank while debugging." },
    ],
  },
];

function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const iv = setInterval(() => {
      setN((v) => {
        if (v >= text.length) { clearInterval(iv); onDone?.(); return v; }
        return v + 3;
      });
    }, 16);
    return () => clearInterval(iv);
  }, [text, onDone]);
  return <span>{text.slice(0, n)}{n < text.length && <span className="animate-pulse">▊</span>}</span>;
}

export default function Troubleshoot({ onDiagnosed }: { onDiagnosed: () => void }) {
  const [selected, setSelected] = useState<Problem | null>(null);
  const [phase, setPhase] = useState<"scanning" | "report">("scanning");
  const [openFix, setOpenFix] = useState<number | null>(null);

  const pick = (p: Problem) => {
    setSelected(p);
    setPhase("scanning");
    setOpenFix(null);
    setTimeout(() => setPhase("report"), 1400);
    onDiagnosed();
  };

  return (
    <Section id="troubleshoot" num="10" title="Troubleshooting AI"
      subtitle="Every robot fails the first time you power it — that's normal engineering. Describe the symptom and the diagnostic AI will trace probable causes, ranked by likelihood." color={RED} wide>
      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Select symptom</div>
          {PROBLEMS.map((p) => (
            <button key={p.id} onClick={() => pick(p)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all"
              style={selected?.id === p.id
                ? { borderColor: `${RED}66`, background: `${RED}0f` }
                : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              <span className="text-xl">{p.icon}</span>
              <span className="text-xs font-bold" style={{ color: selected?.id === p.id ? "#FCA5A5" : "rgba(255,255,255,0.55)" }}>
                {p.symptom}
              </span>
            </button>
          ))}
        </div>

        <Card className="p-5 min-h-[380px]">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <motion.div className="text-4xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>🤖</motion.div>
              <div className="text-sm font-bold text-white/50 mb-1">Diagnostic AI standing by</div>
              <p className="text-xs text-white/30 max-w-xs">Select a symptom on the left and I&apos;ll walk the fault tree the way a robotics mentor would.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: `${CYAN}1a`, border: `1px solid ${CYAN}44` }}>🩺</span>
                <div>
                  <div className="text-xs font-black text-white">APEX Diagnostic AI</div>
                  <div className="text-[9px] font-mono" style={{ color: phase === "scanning" ? AMBER : GREEN }}>
                    {phase === "scanning" ? "▶ scanning fault tree…" : "✓ analysis complete"}
                  </div>
                </div>
              </div>

              {phase === "scanning" ? (
                <div className="space-y-2 py-6">
                  {["Reading symptom signature…", "Checking power chain…", "Cross-referencing 4,200 build logs…"].map((s, i) => (
                    <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }}
                      className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ color: CYAN }}>●</motion.span>
                      {s}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="p-3.5 rounded-xl border mb-4 text-xs leading-relaxed" style={{ borderColor: `${CYAN}33`, background: `${CYAN}0a`, color: "rgba(255,255,255,0.65)" }}>
                    <TypewriterText text={selected.diagnosis} />
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Probable causes</div>
                  <div className="space-y-2">
                    {selected.causes.map((c, i) => (
                      <motion.div key={c.cause} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.25 }}>
                        <button onClick={() => setOpenFix(openFix === i ? null : i)}
                          className="w-full p-3 rounded-xl border border-white/8 text-left hover:bg-white/[0.04] transition-colors"
                          style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <span className="text-xs font-bold text-white/70">{i + 1}. {c.cause}</span>
                            <span className="text-[10px] font-mono shrink-0" style={{ color: c.probability > 40 ? RED : AMBER }}>{c.probability}% likely</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                            <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${c.probability}%` }}
                              transition={{ delay: 0.7 + i * 0.25, duration: 0.6 }}
                              style={{ background: c.probability > 40 ? RED : AMBER }} />
                          </div>
                          <AnimatePresence>
                            {openFix === i && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden">
                                <div className="mt-2.5 p-2.5 rounded-lg text-[11px] leading-relaxed border" style={{ borderColor: `${GREEN}33`, background: `${GREEN}0a`, color: "#A7F3D0" }}>
                                  🔧 <b>Fix:</b> {c.fix}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="text-[9px] text-white/25 mt-1.5">{openFix === i ? "▲ hide fix" : "▼ show fix"}</div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Section>
  );
}
