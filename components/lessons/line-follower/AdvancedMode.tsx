"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card } from "./Section";

function PWMDemo() {
  const [duty, setDuty] = useState(60);
  const period = 60;
  const wave = useMemo(() => {
    let d = "M0,70 ";
    for (let i = 0; i < 5; i++) {
      const x0 = i * period, xOn = x0 + (duty / 100) * period;
      d += `L${x0},70 L${x0},20 L${xOn},20 L${xOn},70 `;
    }
    return d + `L300,70`;
  }, [duty]);
  return (
    <div>
      <p className="text-xs text-white/50 leading-relaxed mb-4">
        Motors don&apos;t get a &quot;half voltage&quot; — they get full battery voltage switched ON and OFF thousands
        of times a second. The <b className="text-white">duty cycle</b> (fraction of time ON) sets the average power.
        The motor&apos;s inertia smooths the chops into steady speed.
      </p>
      <svg viewBox="0 0 300 95" className="w-full rounded-xl mb-3" style={{ background: "rgba(5,5,7,0.6)" }}>
        <path d={wave} fill="none" stroke={PURPLE} strokeWidth="2" />
        <line x1="0" y1={70 - (duty / 100) * 50} x2="300" y2={70 - (duty / 100) * 50} stroke={AMBER} strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="296" y={66 - (duty / 100) * 50} fontSize="8" fill={AMBER} textAnchor="end">average = {(7.4 * duty / 100).toFixed(1)}V</text>
        <text x="4" y="88" fontSize="8" fill="rgba(255,255,255,0.3)">7.4V pulses @ 5 kHz</text>
      </svg>
      <div className="flex items-center gap-3">
        <input type="range" min={0} max={100} value={duty} onChange={(e) => setDuty(+e.target.value)} className="flex-1" />
        <span className="font-mono font-black text-sm w-24 text-right" style={{ color: PURPLE }}>{duty}% · {Math.round(duty * 2.55)}/255</span>
      </div>
    </div>
  );
}

function PIDDemo() {
  const [mode, setMode] = useState<"P" | "PD" | "PID">("P");
  const curves = useMemo(() => {
    const make = (kp: number, kd: number, ki: number) => {
      let y = 1, dy = 0, I = 0;
      const pts: string[] = [];
      for (let i = 0; i < 110; i++) {
        const dt = 0.035;
        I += y * dt;
        const ddy = -kp * y - kd * dy - ki * I + (i > 60 && i < 66 ? 2.2 : 0); // disturbance kick
        dy += ddy * dt; y += dy * dt;
        pts.push(`${(i / 109) * 300},${55 - y * 30}`);
      }
      return pts.join(" ");
    };
    return { P: make(9, 0.4, 0), PD: make(9, 4.5, 0), PID: make(9, 4.5, 2.2) };
  }, []);
  const meta = { P: [RED, "Kp only — reacts hard but overshoots and rings. The robot zig-zags."], PD: [AMBER, "Kp+Kd — derivative brakes the swing. Fast and calm, but a small offset can persist."], PID: [GREEN, "Full PID — integral erases residual drift and shrugs off the disturbance bump."] } as const;
  return (
    <div>
      <p className="text-xs text-white/50 leading-relaxed mb-3">
        PID sums three views of the error: <b style={{ color: CYAN }}>P</b>resent (where is it now),{" "}
        <b style={{ color: RED }}>D</b>erivative (where is it heading), <b style={{ color: GREEN }}>I</b>ntegral (how long has it been wrong).
        Watch the same robot recover from a bump with each controller:
      </p>
      <div className="flex gap-2 mb-3">
        {(["P", "PD", "PID"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className="px-4 py-1.5 rounded-lg text-xs font-black border transition-all"
            style={mode === m ? { borderColor: `${meta[m][0]}77`, color: meta[m][0], background: `${meta[m][0]}14` } : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
            {m}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 300 110" className="w-full rounded-xl mb-2" style={{ background: "rgba(5,5,7,0.6)" }}>
        <line x1="0" y1="55" x2="300" y2="55" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
        <rect x={(62 / 110) * 300} y="0" width="6" height="110" fill={`${PURPLE}22`} />
        <text x={(62 / 110) * 300 + 9} y="12" fontSize="7.5" fill={PURPLE}>disturbance</text>
        <motion.polyline key={mode} points={curves[mode]} fill="none" stroke={meta[mode][0]} strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      </svg>
      <p className="text-[11px]" style={{ color: meta[mode][0] }}>{meta[mode][1]}</p>
    </div>
  );
}

function CalibrationDemo() {
  const [raw, setRaw] = useState(520);
  const MIN = 180, MAX = 840;
  const norm = Math.round(Math.max(0, Math.min(1000, ((raw - MIN) / (MAX - MIN)) * 1000)));
  return (
    <div>
      <p className="text-xs text-white/50 leading-relaxed mb-4">
        No two sensors are identical, and every floor reflects differently. Calibration records each sensor&apos;s
        real <b className="text-white">min (white)</b> and <b className="text-white">max (black)</b>, then remaps raw
        readings to a clean 0–1000 scale: <code className="text-[10px]" style={{ color: CYAN }}>norm = 1000·(raw−min)/(max−min)</code>.
      </p>
      <div className="space-y-3 mb-3">
        <div>
          <div className="flex justify-between text-[10px] mb-1"><span className="text-white/40">Raw ADC reading</span><span className="font-mono" style={{ color: AMBER }}>{raw}</span></div>
          <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg, #F8FAFC, #0A0A0A)" }}>
            <div className="absolute top-0 bottom-0 w-1 bg-red-500" style={{ left: `${(raw / 1023) * 100}%` }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400/70" style={{ left: `${(MIN / 1023) * 100}%` }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400/70" style={{ left: `${(MAX / 1023) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[8px] text-white/30 mt-0.5"><span>0 (pure white)</span><span>calibrated min {MIN} · max {MAX}</span><span>1023 (pitch black)</span></div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1"><span className="text-white/40">Calibrated output</span><span className="font-mono" style={{ color: GREEN }}>{norm}/1000 → {norm > 500 ? "LINE" : "FLOOR"}</span></div>
          <div className="h-2.5 rounded-full bg-white/6 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${norm / 10}%`, background: norm > 500 ? RED : GREEN }} />
          </div>
        </div>
      </div>
      <input type="range" min={0} max={1023} value={raw} onChange={(e) => setRaw(+e.target.value)} className="w-full slider-secondary" />
      <p className="text-[9px] text-white/25 mt-1">Slide to simulate the sensor passing from white floor onto black tape.</p>
    </div>
  );
}

function FilterDemo() {
  const [alpha, setAlpha] = useState(0.25);
  const { rawPts, filtPts } = useMemo(() => {
    const noise = (i: number) => Math.sin(i * 2.7) * 8 + Math.sin(i * 7.3) * 5 + Math.sin(i * 13.1) * 4;
    const signal = (i: number) => (i > 35 && i < 75 ? 30 : 0);
    let f = 0;
    const raw: string[] = [], filt: string[] = [];
    for (let i = 0; i < 110; i++) {
      const r = signal(i) + noise(i);
      f = f + alpha * (r - f);
      raw.push(`${(i / 109) * 300},${70 - r}`);
      filt.push(`${(i / 109) * 300},${70 - f}`);
    }
    return { rawPts: raw.join(" "), filtPts: filt.join(" ") };
  }, [alpha]);
  return (
    <div>
      <p className="text-xs text-white/50 leading-relaxed mb-3">
        Real sensors are noisy — motor sparks, sunlight, vibration. An <b className="text-white">exponential moving
        average</b> <code className="text-[10px]" style={{ color: CYAN }}>f += α·(raw − f)</code> smooths the jitter.
        The catch: heavier filtering (small α) adds <b style={{ color: RED }}>lag</b>, and lag destabilizes control. Filtering is always a trade.
      </p>
      <svg viewBox="0 0 300 95" className="w-full rounded-xl mb-2" style={{ background: "rgba(5,5,7,0.6)" }}>
        <polyline points={rawPts} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        <polyline points={filtPts} fill="none" stroke={GREEN} strokeWidth="2" />
        <text x="4" y="12" fontSize="8" fill="rgba(255,255,255,0.35)">gray = raw · green = filtered</text>
      </svg>
      <div className="flex items-center gap-3">
        <input type="range" min={0.02} max={1} step={0.01} value={alpha} onChange={(e) => setAlpha(+e.target.value)} className="flex-1" />
        <span className="font-mono text-xs w-28 text-right" style={{ color: GREEN }}>α = {alpha.toFixed(2)} {alpha < 0.15 ? "(laggy)" : alpha > 0.7 ? "(noisy)" : "(good)"}</span>
      </div>
    </div>
  );
}

function RealtimeDemo() {
  return (
    <div>
      <p className="text-xs text-white/50 leading-relaxed mb-4">
        A line follower is a <b className="text-white">hard real-time system</b>: a correct answer that arrives late
        is a wrong answer. At 1 m/s, a 50 ms delay means the robot travels 5 cm blind — enough to lose a hairpin.
        Three architectures embedded engineers choose between:
      </p>
      <div className="space-y-2">
        {[
          { name: "Superloop (what we wrote)", lat: "~1 ms", color: GREEN, desc: "loop() { sense → think → act } — simple, deterministic, perfect for one job. Rule: never call delay()!" },
          { name: "Interrupt-driven", lat: "~10 µs", color: CYAN, desc: "Sensor edges trigger ISRs instantly while the main loop handles slow work. Used when events can't wait." },
          { name: "RTOS tasks (FreeRTOS)", lat: "tick-bound", color: PURPLE, desc: "Control task at priority 10, telemetry at 2. The ESP32 runs FreeRTOS under the hood already." },
        ].map((r) => (
          <div key={r.name} className="flex items-start gap-3 p-3 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.02)" }}>
            <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded mt-0.5 shrink-0" style={{ background: `${r.color}1a`, color: r.color }}>{r.lat}</span>
            <div>
              <div className="text-[11px] font-bold text-white/70">{r.name}</div>
              <div className="text-[10px] text-white/40 leading-snug">{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlSystemsDemo() {
  return (
    <div>
      <p className="text-xs text-white/50 leading-relaxed mb-4">
        Everything on this page is one diagram in disguise — the <b className="text-white">closed feedback loop</b>,
        the founding idea of control engineering:
      </p>
      <svg viewBox="0 0 320 120" className="w-full rounded-xl mb-3" style={{ background: "rgba(5,5,7,0.6)" }}>
        {[
          { x: 8, y: 42, w: 46, h: 34, t1: "SETPOINT", t2: "stay on line", c: "rgba(255,255,255,0.5)" },
          { x: 78, y: 42, w: 52, h: 34, t1: "CONTROLLER", t2: "PID / rules", c: CYAN },
          { x: 154, y: 42, w: 52, h: 34, t1: "ACTUATOR", t2: "L298N+motors", c: RED },
          { x: 230, y: 42, w: 52, h: 34, t1: "PLANT", t2: "robot chassis", c: AMBER },
        ].map((b) => (
          <g key={b.t1}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="7" fill="rgba(255,255,255,0.03)" stroke={b.c} strokeWidth="1.1" />
            <text x={b.x + b.w / 2} y={b.y + 15} textAnchor="middle" fontSize="7.5" fontWeight="900" fill={b.c}>{b.t1}</text>
            <text x={b.x + b.w / 2} y={b.y + 26} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.35)">{b.t2}</text>
          </g>
        ))}
        {["M54 59 L78 59", "M130 59 L154 59", "M206 59 L230 59"].map((d) => (
          <g key={d}><path d={d} stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" markerEnd="url(#cs-arr)" /></g>
        ))}
        {/* feedback path */}
        <path d="M282 76 L282 102 L40 102 L40 76" fill="none" stroke={GREEN} strokeWidth="1.4" />
        <rect x="130" y="92" width="66" height="20" rx="6" fill={`${GREEN}10`} stroke={GREEN} strokeWidth="1" />
        <text x="163" y="105" textAnchor="middle" fontSize="7" fontWeight="900" fill={GREEN}>IR SENSORS</text>
        <circle r="3" fill={GREEN}><animateMotion dur="3s" repeatCount="indefinite" path="M282 76 L282 102 L40 102 L40 76" /></circle>
        <circle r="3" fill={CYAN}><animateMotion dur="3s" repeatCount="indefinite" path="M54 59 L130 59 L206 59 L282 59" /></circle>
        <defs><marker id="cs-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="rgba(255,255,255,0.35)" /></marker></defs>
      </svg>
      <p className="text-xs text-white/50 leading-relaxed">
        The same loop stabilizes drones, keeps rockets vertical, holds cruise control at 100 km/h, and regulates
        insulin pumps. Master it on a ₹1,500 robot; apply it for a career.
      </p>
    </div>
  );
}

const TOPICS = [
  { id: "pid", label: "PID Control", icon: "🎯", color: GREEN, comp: <PIDDemo /> },
  { id: "pwm", label: "PWM", icon: "📶", color: PURPLE, comp: <PWMDemo /> },
  { id: "cal", label: "Sensor Calibration", icon: "🎛️", color: CYAN, comp: <CalibrationDemo /> },
  { id: "filter", label: "Noise Filtering", icon: "🌊", color: "#F97316", comp: <FilterDemo /> },
  { id: "rt", label: "Real-Time & Embedded", icon: "⏱️", color: AMBER, comp: <RealtimeDemo /> },
  { id: "cs", label: "Control Systems", icon: "🔁", color: RED, comp: <ControlSystemsDemo /> },
];

export default function AdvancedMode({ onExplored }: { onExplored: () => void }) {
  const [active, setActive] = useState("pid");
  const [visited] = useState(() => new Set<string>(["pid"]));

  return (
    <Section id="advanced" num="12" title="Advanced Engineering Mode"
      subtitle="The university-level concepts hiding inside your toy robot. Each one has a live visual — no equations required to build intuition." color={PURPLE} wide>
      <div className="flex flex-wrap gap-2 mb-5">
        {TOPICS.map((t) => (
          <button key={t.id}
            onClick={() => { setActive(t.id); visited.add(t.id); if (visited.size >= 4) onExplored(); }}
            className="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
            style={active === t.id
              ? { borderColor: `${t.color}77`, background: `${t.color}14`, color: t.color }
              : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
          <Card className="p-5 sm:p-7 max-w-3xl">{TOPICS.find((t) => t.id === active)?.comp}</Card>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
