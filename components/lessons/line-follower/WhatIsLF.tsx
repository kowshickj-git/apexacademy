"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, RED, Card } from "./Section";

type Level = "beginner" | "intermediate" | "advanced";

const LEVELS: Record<Level, { label: string; icon: string; color: string; body: React.ReactNode }> = {
  beginner: {
    label: "Beginner",
    icon: "🌱",
    color: GREEN,
    body: (
      <>
        <p className="mb-3">
          A line follower is a small robot that <b className="text-white">drives itself along a black line</b> drawn
          on the floor — no remote control, no driver. It&apos;s like a tiny self-driving car with one job.
        </p>
        <p className="mb-3">
          It has two <b className="text-white">&quot;eyes&quot;</b> underneath (IR sensors) that can tell black from white.
          If the line drifts toward the left eye, the robot steers left. If it drifts right, it steers right.
          If neither eye sees the line, the robot is centered — full speed ahead!
        </p>
        <p>
          That&apos;s the whole secret: <b style={{ color: GREEN }}>look → decide → steer → repeat</b>, hundreds of
          times every second. Simple rules, repeated fast, look like intelligence.
        </p>
      </>
    ),
  },
  intermediate: {
    label: "Intermediate",
    icon: "⚙️",
    color: CYAN,
    body: (
      <>
        <p className="mb-3">
          Technically, a line follower is a <b className="text-white">closed-loop control system</b>. The IR sensors
          measure the robot&apos;s position error relative to the line. A microcontroller computes a correction, and a
          motor driver applies it by changing the speed of each wheel independently — this is called{" "}
          <b style={{ color: CYAN }}>differential drive</b>.
        </p>
        <p className="mb-3">
          Each IR module pairs an infrared LED with a photodiode: white surfaces reflect IR back (high signal),
          black tape absorbs it (low signal). A comparator turns this into a clean digital 1/0 for the controller.
        </p>
        <p>
          The control loop — <b className="text-white">sense → compute → actuate</b> — runs every few milliseconds.
          The faster and smoother the loop, the faster the robot can drive without losing the line.
        </p>
      </>
    ),
  },
  advanced: {
    label: "Advanced",
    icon: "🎓",
    color: "#A78BFA",
    body: (
      <>
        <p className="mb-3">
          Formally, line following is a <b className="text-white">regulation problem</b>: drive the lateral offset{" "}
          <i>e(t)</i> between the sensor array centroid and the line to zero while maximizing forward velocity. The
          plant is a nonholonomic differential-drive robot; the controller output is a wheel-speed differential{" "}
          <i>Δω = v<sub>R</sub> − v<sub>L</sub></i> that commands yaw rate.
        </p>
        <p className="mb-3">
          A two-sensor robot gives a quantized error signal e ∈ {"{−1, 0, +1}"} — enough for bang-bang control but
          prone to limit-cycle oscillation. Competition robots use 8–16 sensor arrays for a near-continuous error
          estimate, feed it to a <b style={{ color: "#A78BFA" }}>PID controller</b> (u = K<sub>p</sub>e + K<sub>i</sub>∫e·dt + K<sub>d</sub>·de/dt),
          and add sensor calibration, exponential filtering, and feed-forward speed scheduling on curvature.
        </p>
        <p>
          Constraints that dominate real designs: sensor sampling latency, motor time constants (~50–100 ms), wheel
          slip at high lateral acceleration, and the preview distance of the sensor bar — the same math that governs
          lane-keeping in real autonomous vehicles.
        </p>
      </>
    ),
  },
};

/** Animated diagram: robot on a line with three scenario buttons */
function ScenarioDiagram() {
  const [scenario, setScenario] = useState<"center" | "left" | "right">("center");
  const lineX = scenario === "center" ? 0 : scenario === "left" ? -34 : 34;
  const steer = scenario === "center" ? 0 : scenario === "left" ? -14 : 14;
  const lOn = scenario === "left";
  const rOn = scenario === "right";
  const decision = scenario === "center" ? "BOTH WHITE → FORWARD" : scenario === "left" ? "LEFT = BLACK → TURN LEFT" : "RIGHT = BLACK → TURN RIGHT";
  const wheelL = scenario === "center" ? 100 : scenario === "left" ? 30 : 100;
  const wheelR = scenario === "center" ? 100 : scenario === "right" ? 30 : 100;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {([["left", "Line drifts LEFT"], ["center", "Line CENTERED"], ["right", "Line drifts RIGHT"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setScenario(k)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all"
            style={scenario === k
              ? { background: `${AMBER}22`, borderColor: `${AMBER}66`, color: AMBER }
              : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 400 250" className="w-full">
        {/* floor */}
        <rect x="0" y="0" width="400" height="250" rx="12" fill="#0D0D13" />
        {/* line */}
        <motion.rect animate={{ x: 186 + lineX }} transition={{ type: "spring", stiffness: 120, damping: 18 }}
          y="0" width="28" height="250" fill="#000" stroke="#222" />
        {/* robot */}
        <motion.g animate={{ rotate: steer }} transition={{ type: "spring", stiffness: 100, damping: 14 }} style={{ originX: "200px", originY: "150px" }}>
          {/* wheels */}
          <rect x="152" y="128" width="14" height="44" rx="5" fill="#0B0B10" stroke="#3A3A44" />
          <rect x="234" y="128" width="14" height="44" rx="5" fill="#0B0B10" stroke="#3A3A44" />
          {/* body */}
          <rect x="162" y="110" width="76" height="80" rx="14" fill="#1C1C26" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <rect x="180" y="132" width="40" height="34" rx="4" fill="#0E2A33" stroke={CYAN} strokeWidth="0.8" />
          {/* sensors */}
          <circle cx="180" cy="102" r="8" fill={lOn ? RED : GREEN} opacity="0.95">
            {lOn && <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="220" cy="102" r="8" fill={rOn ? RED : GREEN} opacity="0.95">
            {rOn && <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />}
          </circle>
          <text x="180" y="88" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">L</text>
          <text x="220" y="88" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">R</text>
        </motion.g>

        {/* wheel speed bars */}
        <g fontSize="9" fill="rgba(255,255,255,0.4)">
          <text x="52" y="120" textAnchor="middle">LEFT MOTOR</text>
          <rect x="30" y="130" width="44" height="72" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
          <motion.rect x="34" width="36" rx="4" fill={AMBER}
            animate={{ y: 198 - wheelL * 0.64, height: wheelL * 0.64 }} transition={{ type: "spring", stiffness: 120, damping: 16 }} />
          <text x="348" y="120" textAnchor="middle">RIGHT MOTOR</text>
          <rect x="326" y="130" width="44" height="72" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
          <motion.rect x="330" width="36" rx="4" fill={CYAN}
            animate={{ y: 198 - wheelR * 0.64, height: wheelR * 0.64 }} transition={{ type: "spring", stiffness: 120, damping: 16 }} />
        </g>

        {/* decision banner */}
        <rect x="80" y="218" width="240" height="24" rx="7" fill="rgba(5,5,7,0.8)" stroke={`${AMBER}55`} />
        <text x="200" y="234" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={AMBER}>{decision}</text>
      </svg>
      <p className="text-[11px] text-white/30 mt-3 text-center">
        Click a scenario — watch the sensors change color and the motors respond. Red sensor = sees black line.
      </p>
    </Card>
  );
}

export default function WhatIsLF({ onRead }: { onRead: () => void }) {
  const [level, setLevel] = useState<Level>("beginner");
  const l = LEVELS[level];

  return (
    <Section id="what-is" num="01" title="What Is a Line Follower Robot?"
      subtitle="One robot, three depths of understanding. Pick your level — then click the scenarios to see the core idea in motion.">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div>
          <div className="flex gap-2 mb-4">
            {(Object.keys(LEVELS) as Level[]).map((k) => (
              <button key={k}
                onClick={() => { setLevel(k); if (k === "advanced") onRead(); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                style={level === k
                  ? { background: `${LEVELS[k].color}1a`, borderColor: `${LEVELS[k].color}66`, color: LEVELS[k].color }
                  : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
                <span>{LEVELS[k].icon}</span> {LEVELS[k].label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={level}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}
              className="text-sm text-white/55 leading-relaxed p-5 rounded-2xl border border-white/8"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              {l.body}
            </motion.div>
          </AnimatePresence>
          <p className="text-[11px] text-white/25 mt-3">💡 Read all three levels — the Advanced tab earns bonus XP.</p>
        </div>
        <ScenarioDiagram />
      </div>
    </Section>
  );
}
