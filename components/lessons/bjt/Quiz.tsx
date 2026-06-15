"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPass: () => void;
}

const questions = [
  // BEGINNER Q1-10
  {
    q: "What does BJT stand for?",
    options: ["Bipolar Junction Transistor", "Binary Junction Transistor", "Bidirectional Junction Terminal", "Base-Junction Transfer"],
    correct: 0,
    explain: "BJT = Bipolar Junction Transistor. 'Bipolar' means current flows via both electrons and holes. 'Junction' refers to the two P-N junctions. 'Transistor' = Transfer + Resistor.",
  },
  {
    q: "A BJT has three terminals. Which are they?",
    options: ["Gate, Source, Drain", "Base, Collector, Emitter", "Anode, Cathode, Gate", "Input, Output, Ground"],
    correct: 1,
    explain: "BJT terminals: Base (B) — control input, Collector (C) — where current is collected, Emitter (E) — where current exits. Remember: BCE.",
  },
  {
    q: "For an NPN BJT to turn on, which condition must be met?",
    options: ["V_CE > 5V", "V_BE > 0.7V (base higher than emitter)", "V_BC > 0", "V_BE < 0"],
    correct: 1,
    explain: "NPN turns on when V_BE ≥ 0.7V (silicon). The base must be ~0.7V higher than the emitter to forward-bias the base-emitter junction and allow base current to flow.",
  },
  {
    q: "The current gain β (hFE) relates which currents?",
    options: ["I_B to I_E", "I_C to I_B (I_C = β × I_B)", "I_E to I_C", "I_E to I_B"],
    correct: 1,
    explain: "β = I_C / I_B. A small base current I_B controls a large collector current I_C. If β = 100 and I_B = 1mA, then I_C = 100mA.",
  },
  {
    q: "A BJT in 'saturation' region means:",
    options: ["The transistor is fully OFF", "The transistor is amplifying", "The transistor is fully ON (V_CE ≈ 0.2V)", "The base is floating"],
    correct: 2,
    explain: "Saturation = fully ON. V_CE drops to ≈0.1–0.3V. Both junctions are forward-biased. Used for switching applications where you want the transistor as a closed switch.",
  },
  {
    q: "A BJT in 'cutoff' region means:",
    options: ["Transistor is ON", "Transistor is OFF — no collector current flows", "Transistor is amplifying linearly", "Base-emitter voltage is 0.7V"],
    correct: 1,
    explain: "Cutoff = transistor OFF. V_BE < 0.7V so no base current flows. I_C ≈ 0 (only tiny leakage). Used for the OFF state of a switch.",
  },
  {
    q: "What is V_BE for a silicon NPN transistor when forward biased?",
    options: ["0V", "0.3V (germanium value)", "0.7V", "5V"],
    correct: 2,
    explain: "Silicon BJT: V_BE ≈ 0.7V when forward-biased (conducting). This is the diode drop of the base-emitter P-N junction. Germanium BJTs: ≈0.3V (older, rarely used now).",
  },
  {
    q: "In an NPN common-emitter amplifier, the output voltage is:",
    options: ["In phase with input (same direction)", "180° out of phase (inverted)", "90° phase-shifted", "Unrelated to input"],
    correct: 1,
    explain: "Common-emitter amplifier inverts the output. When V_in increases → I_B increases → I_C increases → voltage drop across R_C increases → V_C (output) decreases. Input and output are 180° out of phase.",
  },
  {
    q: "You want to switch a 100mA LED with β=100. What base current do you need for saturation?",
    options: ["100mA", "10mA", "1mA (100mA/100) or more", "0.1mA"],
    correct: 2,
    explain: "For guaranteed saturation, drive 5–10× harder: I_B = I_C/(β/10) = 100mA/(100/10) = 10mA. At minimum: I_B = I_C/β = 100mA/100 = 1mA. Always overdrive to ensure full saturation.",
  },
  {
    q: "Current in an NPN transistor follows which path?",
    options: ["Emitter → Base → Collector", "Base → Collector → Emitter", "Collector → Base → Emitter", "All current flows through base only"],
    correct: 1,
    explain: "Conventional current: enters at Base and Collector, exits at Emitter. I_E = I_C + I_B. The emitter carries the total current (collector current + base current). I_C >> I_B typically.",
  },
  // INTERMEDIATE Q11-15
  {
    q: "β = 150, I_C = 75mA. What is I_B?",
    options: ["0.5mA", "11.25A", "5mA", "150mA"],
    correct: 0,
    explain: "I_B = I_C / β = 75mA / 150 = 0.5mA. The transistor amplifies: 0.5mA base current controls 75mA collector current.",
  },
  {
    q: "V_supply = 5V, V_control = 5V, V_BE = 0.7V, I_B needed = 1mA. Calculate R_B:",
    options: ["4.3kΩ", "700Ω", "5kΩ", "0.7kΩ"],
    correct: 0,
    explain: "R_B = (V_control − V_BE) / I_B = (5V − 0.7V) / 1mA = 4.3V / 0.001A = 4300Ω = 4.3kΩ.",
  },
  {
    q: "A common-emitter amp with R_C = 2kΩ, I_C = 2mA, β = 100. What is the small-signal voltage gain (A_v = −β × R_C/r_e, r_e = 26mV/I_C)?",
    options: ["−100", "−200", "−769", "−50"],
    correct: 2,
    explain: "r_e = 26mV / 2mA = 13Ω. A_v = −β × R_C / r_e = −100 × 2000 / 13 ≈ −15384 → wait, simpler: A_v = −g_m × R_C = −(I_C/V_T) × R_C = −(2mA/26mV) × 2kΩ = −77 × 2 = −154. With β/r_e: −100×2000/13 ≈ −769. High gain possible with CE config.",
  },
  {
    q: "Why is a flyback diode needed when a BJT switches a relay coil?",
    options: ["To increase switching speed", "To protect the transistor from back-EMF voltage spikes when the coil turns off", "To reduce base current", "To filter noise"],
    correct: 1,
    explain: "A relay coil is inductive. When the BJT turns off, the collapsing magnetic field generates a large voltage spike (V = L × dI/dt). Without a flyback diode, this spike (often 100V+) can destroy the BJT. The diode clamps the spike.",
  },
  {
    q: "Voltage divider bias (two base resistors R1, R2) is preferred over fixed-base bias because:",
    options: ["It costs less", "It stabilizes the Q-point against β variations and temperature changes", "It provides higher gain", "It requires fewer components"],
    correct: 1,
    explain: "Fixed-base bias sets I_B = (V_CC − 0.7V)/R_B. Since I_C = β × I_B, any β variation shifts I_C. Voltage divider bias sets V_B independently of β (if stiff divider). With emitter resistor R_E, Q-point is very stable.",
  },
  // ADVANCED Q16-20
  {
    q: "The Early effect in a BJT refers to:",
    options: ["Base width increasing with V_CE, causing I_C to increase slightly with V_CE", "The transistor turning on early before V_BE reaches 0.7V", "Reverse breakdown of the collector junction", "High-frequency current gain roll-off"],
    correct: 0,
    explain: "Early effect: as V_CE increases, the collector depletion region widens, narrowing the base width. Narrower base → more minority carriers collected → I_C increases slightly with V_CE. Output impedance in active region is finite (not infinite). Early voltage V_A extrapolates the I_C curves to a single point.",
  },
  {
    q: "f_T (transition frequency) of a BJT defines:",
    options: ["The temperature at which β halves", "The frequency where current gain β drops to 1 (0dB)", "The maximum V_CE allowed", "The switching frequency for saturation mode"],
    correct: 1,
    explain: "f_T is where the small-signal current gain |h_fe| = 1. Above f_T, the BJT cannot amplify. It's set by minority carrier transit time through the base. For RF amplifiers: choose f_T >> operating frequency. f_T typically 50MHz–5GHz for RF transistors.",
  },
  {
    q: "In a Darlington pair, two BJTs are connected so that:",
    options: ["They switch in opposite phases", "The overall β ≈ β₁ × β₂, giving extremely high current gain", "They cancel each other's V_BE", "Collector of T1 drives base of T2 in reverse"],
    correct: 1,
    explain: "Darlington: emitter of T1 → base of T2. I_B2 = β₁ × I_B1. I_C2 = β₂ × I_B2 = β₁ × β₂ × I_B1. Total β ≈ β₁ × β₂ (minus small correction). Disadvantage: V_BE(total) ≈ 1.4V (two diode drops). Used for power control where very small input currents must switch large loads.",
  },
  {
    q: "Compared to MOSFETs, BJTs in digital switching have a disadvantage because:",
    options: ["BJTs cannot switch high voltages", "BJTs require base current (power) to stay ON; MOSFETs only need voltage on gate", "BJTs are always slower than MOSFETs", "BJTs have higher breakdown voltage"],
    correct: 1,
    explain: "MOSFET gate draws near-zero steady-state current (voltage-controlled). BJT base requires continuous current I_B = I_C/β to stay on. In digital ICs with millions of transistors, BJT base currents add up enormously. MOSFETs dominate digital ICs for this reason. BJTs remain useful in analog, RF, and high-speed bipolar logic (ECL).",
  },
  {
    q: "The h-parameter h_fe of a BJT is the same as:",
    options: ["V_BE voltage", "α (alpha)", "β (beta) — small-signal forward current gain", "1/β"],
    correct: 2,
    explain: "h_fe = h_21e = small-signal AC current gain in common-emitter configuration. Numerically close to β (DC current gain h_FE). Datasheets list both: h_FE (DC, large signal) and h_fe (AC, small signal). For most practical calculations, treat h_FE ≈ h_fe = β.",
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

  const handleRetry = () => { setAnswers(Array(questions.length).fill(null)); setSubmitted(false); setScore(0); };

  const allAnswered = answers.every((a) => a !== null);
  const passed = submitted && score >= PASS_THRESHOLD;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 12 · Quiz</p>
        <h2 className="text-xl font-bold mb-1">BJT Transistors Quiz</h2>
        <p className="text-white/45 text-sm mb-4">20 questions — pass at 14/20 (70%) to earn <span style={{ color: "#EF4444" }}>+50 XP</span></p>

        <AnimatePresence>
          {submitted && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-5 p-4 rounded-2xl border text-center"
              style={{ borderColor: passed ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.35)", background: passed ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.07)" }}>
              <p className="text-2xl font-black mb-1" style={{ color: "#EF4444" }}>{score}/20</p>
              <p className="text-sm font-semibold mb-2" style={{ color: "#EF4444" }}>
                {passed ? "Passed! +50 XP earned" : `Not yet — need ${PASS_THRESHOLD - score} more correct`}
              </p>
              {!passed && (
                <button onClick={handleRetry} className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-white/50 hover:text-white/70 transition-all" style={{ background: "rgba(255,255,255,0.03)" }}>
                  Try Again →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                      style={{ background: isBeginner ? "rgba(239,68,68,0.1)" : isIntermediate ? "rgba(14,165,233,0.1)" : "rgba(251,146,60,0.1)", color: isBeginner ? "#EF4444" : isIntermediate ? "#0EA5E9" : "#FB923C" }}>
                      {isBeginner ? "Beginner" : isIntermediate ? "Intermediate" : "Advanced"}
                    </span>
                    {submitted && <span className="ml-auto text-sm">{isCorrect ? "✅" : "❌"}</span>}
                  </div>
                  <p className="text-sm text-white/85 font-medium leading-relaxed">{q.q}</p>
                </div>
                <div className="px-4 pb-3 grid gap-1.5">
                  {q.options.map((opt, oi) => {
                    let optStyle: React.CSSProperties = { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" };
                    if (submitted) {
                      if (oi === q.correct) optStyle = { background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.4)", color: "#EF4444" };
                      else if (oi === userAnswer && oi !== q.correct) optStyle = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" };
                    } else if (userAnswer === oi) {
                      optStyle = { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", color: "rgba(255,255,255,0.85)" };
                    }
                    return (
                      <button key={oi} onClick={() => handleSelect(qi, oi)} disabled={submitted}
                        className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all disabled:cursor-default hover:opacity-90"
                        style={optStyle}>
                        <span className="font-mono text-[10px] opacity-50 mr-2">{["A", "B", "C", "D"][oi]}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {submitted && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25, delay: qi * 0.02 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-2 border-t border-white/5" style={{ background: isCorrect ? "rgba(239,68,68,0.04)" : isWrong ? "rgba(239,68,68,0.04)" : "transparent" }}>
                        <p className="text-[11px] leading-relaxed text-white/40">{q.explain}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {!submitted && (
          <button onClick={handleSubmit} disabled={!allAnswered}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: allAnswered ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${allAnswered ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`, color: allAnswered ? "#EF4444" : "rgba(255,255,255,0.3)" }}>
            {allAnswered ? "Submit Quiz →" : `Answer all ${questions.length} questions to submit`}
          </button>
        )}

        {submitted && passed && (
          <div className="w-full py-3 rounded-xl font-bold text-sm text-center"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>
            Quiz Passed! +50 XP earned
          </div>
        )}
      </div>
    </section>
  );
}
