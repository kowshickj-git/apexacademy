"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card } from "./Section";

export interface LabFlags {
  built: boolean;
  wired: boolean;
  coded: boolean;
  simFinished: boolean;
  tuned: boolean;
}

interface Q { q: string; opts: string[]; a: number; why: string; pts: number }

interface Tier { id: string; label: string; icon: string; color: string; qs: Q[] }

const TIERS: Tier[] = [
  {
    id: "beginner", label: "Beginner", icon: "🌱", color: GREEN,
    qs: [
      { q: "What does the IR sensor actually measure?", opts: ["The color black itself", "Reflected infrared light", "Magnetic fields", "Distance to the floor"], a: 1, why: "The photodiode measures how much IR light bounces back — black tape absorbs IR, so little returns.", pts: 10 },
      { q: "Both sensors read WHITE. What should the robot do?", opts: ["Stop", "Turn left", "Move forward", "Reverse"], a: 2, why: "White under both eyes means the line is between them — the robot is centered. Full speed ahead.", pts: 10 },
      { q: "Why can't the ESP32 drive motors directly?", opts: ["Wrong voltage polarity", "GPIO pins supply only ~40 mA", "Motors need AC power", "It can — the driver is optional"], a: 1, why: "A BO motor draws 100–250 mA — several times what a GPIO pin can source. The L298N does the heavy lifting.", pts: 10 },
    ],
  },
  {
    id: "intermediate", label: "Intermediate", icon: "⚙️", color: CYAN,
    qs: [
      { q: "How does a differential-drive robot turn left?", opts: ["Tilts its front wheels", "Right wheel faster than left", "Left wheel faster than right", "Uses the caster to steer"], a: 1, why: "The outer (right) wheel traveling farther than the inner one pivots the robot leftward. No steering mechanism needed.", pts: 15 },
      { q: "PWM at 50% duty on a 7.4V rail delivers an average of…", opts: ["14.8V", "7.4V", "3.7V", "0V"], a: 2, why: "Average voltage = duty × supply = 0.5 × 7.4V = 3.7V. The motor's inertia smooths the pulses.", pts: 15 },
      { q: "Why mount the sensors AHEAD of the wheel axle?", opts: ["Better balance", "Preview — they see curves before the robot arrives", "Shorter wires", "To protect them from dust"], a: 1, why: "Sensor preview acts like looking ahead while driving. More preview distance = earlier corrections = higher stable speed.", pts: 15 },
    ],
  },
  {
    id: "advanced", label: "Advanced", icon: "🎓", color: PURPLE,
    qs: [
      { q: "Your robot oscillates (zig-zags) violently. Best first fix?", opts: ["Increase Kp", "Increase Kd or reduce Kp", "Increase Ki", "Increase base speed"], a: 1, why: "Oscillation = too much proportional gain for the available damping. Kd damps the swing; lowering Kp reduces the drive.", pts: 20 },
      { q: "What does integral windup cause?", opts: ["Faster response", "Massive overshoot after long errors", "Sensor damage", "PWM frequency drift"], a: 1, why: "The integral keeps accumulating during a long error, then dumps a huge correction. That's why we constrain() it.", pts: 20 },
      { q: "delay(200) inside loop() is harmful because…", opts: ["It drains the battery", "The robot is blind for 200 ms per cycle", "It resets the ESP32", "PWM stops working"], a: 1, why: "At 0.5 m/s the robot travels 10 cm during that delay with no sensing — plenty to fly off a curve. Control loops must stay fast.", pts: 20 },
    ],
  },
  {
    id: "expert", label: "Expert", icon: "🏆", color: AMBER,
    qs: [
      { q: "Doubling speed requires roughly what from the control loop?", opts: ["Nothing — same tuning works", "Half the sensor noise", "Earlier corrections: more preview, higher Kd, or faster sampling", "Double the battery voltage"], a: 2, why: "Stability scales with reaction distance. Faster travel = less time per correction, so you need preview and damping headroom.", pts: 25 },
      { q: "An 8-sensor array beats 2 sensors mainly because…", opts: ["More total IR light", "It gives a near-continuous position error for the PID", "It's cheaper per sensor", "It works on colored lines"], a: 1, why: "A weighted average across 8 sensors yields fine-grained error (±3.5 units, not just ±1) — PID output becomes proportional, not bang-bang.", pts: 25 },
    ],
  },
];

const PRACTICALS: { id: keyof LabFlags; label: string; icon: string; pts: number }[] = [
  { id: "built", label: "Assemble the full robot (Section 4)", icon: "🔧", pts: 20 },
  { id: "wired", label: "Complete all 16 wire connections (Section 5)", icon: "🔌", pts: 20 },
  { id: "coded", label: "Edit the firmware in Code Lab (Section 7)", icon: "💻", pts: 20 },
  { id: "simFinished", label: "Finish any simulation track (Section 9)", icon: "🏁", pts: 20 },
  { id: "tuned", label: "Tune parameters in the Optimization Lab (Section 11)", icon: "🎛️", pts: 20 },
];

const MAX_QUIZ = TIERS.reduce((s, t) => s + t.qs.reduce((a, q) => a + q.pts, 0), 0);
const MAX_PRACT = PRACTICALS.reduce((s, p) => s + p.pts, 0);

interface Badge { id: string; label: string; icon: string; test: (quizPts: number, flags: LabFlags, allCorrect: boolean) => boolean }

const BADGES: Badge[] = [
  { id: "spark", label: "First Spark", icon: "✨", test: (q) => q > 0 },
  { id: "surgeon", label: "Circuit Surgeon", icon: "🔌", test: (_q, f) => f.wired },
  { id: "racer", label: "Track Racer", icon: "🏁", test: (_q, f) => f.simFinished },
  { id: "whisperer", label: "PID Whisperer", icon: "🎯", test: (_q, f) => f.tuned },
  { id: "quizmaster", label: "Quiz Master", icon: "🧠", test: (_q, _f, all) => all },
  { id: "apex", label: "APEX Engineer", icon: "👑", test: (q, f, all) => all && f.built && f.wired && f.coded && f.simFinished && f.tuned },
];

export default function ChallengeMode({ flags, onScore }: { flags: LabFlags; onScore: (pts: number, badges: number) => void }) {
  const [tier, setTier] = useState("beginner");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const quizPts = TIERS.reduce((s, t) => s + t.qs.reduce((a, q, i) => a + (answers[`${t.id}-${i}`] === q.a ? q.pts : 0), 0), 0);
  const practPts = PRACTICALS.reduce((s, p) => s + (flags[p.id] ? p.pts : 0), 0);
  const total = quizPts + practPts;
  const answeredAll = TIERS.every((t) => t.qs.every((_, i) => answers[`${t.id}-${i}`] !== undefined));
  const allCorrect = answeredAll && TIERS.every((t) => t.qs.every((q, i) => answers[`${t.id}-${i}`] === q.a));
  const earnedBadges = BADGES.filter((b) => b.test(quizPts, flags, allCorrect));

  useEffect(() => { onScore(total, earnedBadges.length); }, [total, earnedBadges.length, onScore]);

  const t = TIERS.find((x) => x.id === tier)!;

  return (
    <Section id="challenges" num="13" title="Challenge Mode"
      subtitle="Prove it. Four difficulty tiers of engineering questions plus hands-on lab objectives. Points feed your final certificate score." color={AMBER} wide>
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {TIERS.map((x) => {
              const done = x.qs.every((_, i) => answers[`${x.id}-${i}`] !== undefined);
              return (
                <button key={x.id} onClick={() => setTier(x.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={tier === x.id
                    ? { borderColor: `${x.color}77`, background: `${x.color}14`, color: x.color }
                    : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)" }}>
                  {x.icon} {x.label} {done && "✓"}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {t.qs.map((q, qi) => {
              const key = `${t.id}-${qi}`;
              const chosen = answers[key];
              return (
                <Card key={key} className="p-4">
                  <div className="flex justify-between gap-3 mb-3">
                    <div className="text-sm font-bold text-white/80">{q.q}</div>
                    <span className="text-[10px] font-black shrink-0" style={{ color: t.color }}>+{q.pts} pts</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.opts.map((o, oi) => {
                      const isChosen = chosen === oi;
                      const showState = chosen !== undefined;
                      const correct = oi === q.a;
                      return (
                        <button key={oi} disabled={chosen !== undefined}
                          onClick={() => setAnswers((a) => ({ ...a, [key]: oi }))}
                          className="px-3 py-2.5 rounded-xl border text-left text-xs font-semibold transition-all disabled:cursor-default"
                          style={showState && correct
                            ? { borderColor: `${GREEN}77`, background: `${GREEN}12`, color: "#6EE7B7" }
                            : showState && isChosen
                              ? { borderColor: `${RED}66`, background: `${RED}0f`, color: "#FCA5A5" }
                              : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.55)" }}>
                          {showState && correct ? "✓ " : showState && isChosen ? "✗ " : ""}{o}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {chosen !== undefined && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="text-[11px] leading-relaxed mt-3 overflow-hidden"
                        style={{ color: chosen === q.a ? "#6EE7B7" : "rgba(255,255,255,0.45)" }}>
                        {chosen === q.a ? "🎉 Correct! " : "Not quite. "}{q.why}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Challenge score</div>
            <div className="text-3xl font-black tabular-nums mb-1" style={{ color: AMBER }}>{total}</div>
            <div className="text-[10px] text-white/30 mb-3">of {MAX_QUIZ + MAX_PRACT} points</div>
            <div className="h-2 rounded-full bg-white/6 overflow-hidden">
              <motion.div className="h-full rounded-full" animate={{ width: `${(total / (MAX_QUIZ + MAX_PRACT)) * 100}%` }}
                style={{ background: `linear-gradient(90deg, ${AMBER}, ${GREEN})` }} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Lab objectives (auto-verified)</div>
            <div className="space-y-1.5">
              {PRACTICALS.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-[11px]"
                  style={{ color: flags[p.id] ? "#6EE7B7" : "rgba(255,255,255,0.35)" }}>
                  <span>{flags[p.id] ? "✅" : "⬜"}</span>
                  <span className="flex-1">{p.label}</span>
                  <span className="font-mono text-[10px]">+{p.pts}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Badges · {earnedBadges.length}/{BADGES.length}</div>
            <div className="grid grid-cols-3 gap-2">
              {BADGES.map((b) => {
                const got = earnedBadges.includes(b);
                return (
                  <motion.div key={b.id} animate={got ? { scale: [1, 1.15, 1] } : {}}
                    className="p-2 rounded-xl border text-center"
                    style={got
                      ? { borderColor: `${AMBER}66`, background: `${AMBER}12` }
                      : { borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", filter: "grayscale(1)", opacity: 0.4 }}>
                    <div className="text-lg">{b.icon}</div>
                    <div className="text-[8px] font-bold mt-0.5" style={{ color: got ? AMBER : "rgba(255,255,255,0.4)" }}>{b.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
