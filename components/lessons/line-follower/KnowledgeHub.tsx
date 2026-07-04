"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card } from "./Section";

interface Entry { id: string; title: string; icon: string; color: string; body: React.ReactNode }

function MiniTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden my-2">
      {rows.map(([k, v], i) => (
        <div key={k} className="flex justify-between gap-4 px-3 py-1.5 text-[11px]" style={{ background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
          <span className="text-white/35">{k}</span><span className="text-white/65 font-mono text-right">{v}</span>
        </div>
      ))}
    </div>
  );
}

const ENTRIES: Entry[] = [
  {
    id: "theory", title: "Theory Notes — The Big Picture", icon: "📚", color: CYAN,
    body: (
      <div className="space-y-2 text-xs text-white/50 leading-relaxed">
        <p>A line follower is the &quot;hello world&quot; of autonomous robotics because it contains every element of a full autonomy stack in miniature: <b className="text-white">perception</b> (IR sensors), <b className="text-white">state estimation</b> (where am I relative to the line?), <b className="text-white">planning</b> (which way to steer), and <b className="text-white">actuation</b> (differential drive).</p>
        <p>Key mental model: the robot never &quot;knows&quot; the track. It only knows the last sensor reading. Autonomy emerges from reacting correctly, quickly, forever — not from a map or memory.</p>
        <p>Performance ceiling formula (rule of thumb): maximum stable speed ∝ sensor preview distance ÷ loop reaction time. Improve either and you can drive faster.</p>
      </div>
    ),
  },
  {
    id: "circuit", title: "Master Circuit Diagram", icon: "🔌", color: GREEN,
    body: (
      <div>
        <svg viewBox="0 0 360 200" className="w-full rounded-xl mb-2" style={{ background: "rgba(5,5,7,0.6)" }}>
          {[
            { x: 10, y: 20, w: 66, h: 40, l: "IR L + IR R", c: PURPLE },
            { x: 130, y: 20, w: 80, h: 52, l: "ESP32", c: CYAN },
            { x: 260, y: 20, w: 80, h: 52, l: "L298N", c: RED },
            { x: 10, y: 140, w: 66, h: 40, l: "BATT 7.4V", c: GREEN },
            { x: 130, y: 140, w: 60, h: 40, l: "SWITCH", c: AMBER },
            { x: 260, y: 140, w: 34, h: 40, l: "M1", c: AMBER },
            { x: 306, y: 140, w: 34, h: 40, l: "M2", c: AMBER },
          ].map((b) => (
            <g key={b.l}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={`${b.c}0d`} stroke={`${b.c}88`} strokeWidth="1.2" />
              <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} textAnchor="middle" fontSize="9" fontWeight="900" fill={b.c}>{b.l}</text>
            </g>
          ))}
          <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" fill="none">
            <path d="M76 40 L130 40" /><path d="M210 40 L260 40" />
            <path d="M76 160 L130 160" /><path d="M190 160 L230 160 L230 72 L260 72 L260 72" />
            <path d="M277 72 L277 140" /><path d="M323 72 L323 140" />
          </g>
          <text x="100" y="34" fontSize="7" fill={CYAN}>OUT→G34/35</text>
          <text x="218" y="34" fontSize="7" fill={AMBER}>IN/EN</text>
          <text x="96" y="154" fontSize="7" fill={RED}>+7.4V</text>
          <text x="196" y="130" fontSize="7" fill={RED}>12V in</text>
        </svg>
        <p className="text-[11px] text-white/40">Golden rules: ① every GND connects together, ② battery + always passes through the switch, ③ signal wires never carry motor current.</p>
      </div>
    ),
  },
  {
    id: "datasheets", title: "Datasheet Quick Reference", icon: "📄", color: AMBER,
    body: (
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-black mb-1" style={{ color: CYAN }}>ESP32-WROOM-32</div>
          <MiniTable rows={[["VDD", "3.0–3.6V"], ["GPIO current", "40 mA max"], ["ADC", "12-bit, 0–3.3V"], ["Deep sleep", "10 µA"], ["Flash temp", "−40 to +85°C"]]} />
        </div>
        <div>
          <div className="text-[10px] font-black mb-1" style={{ color: RED }}>L298N</div>
          <MiniTable rows={[["VS (motor)", "5–35V"], ["Io peak", "2A / bridge"], ["Vce sat drop", "1.4–2.5V ⚠"], ["Logic high", "2.3V min"], ["Efficiency", "~60–70%"]]} />
        </div>
        <div>
          <div className="text-[10px] font-black mb-1" style={{ color: PURPLE }}>LM393 IR module</div>
          <MiniTable rows={[["VCC", "3.3–5V"], ["Range", "2–30 mm"], ["Response", "< 1 ms"], ["Output", "Open collector"]]} />
        </div>
        <div>
          <div className="text-[10px] font-black mb-1" style={{ color: AMBER }}>BO Motor (TT)</div>
          <MiniTable rows={[["Rated V", "3–9V"], ["No-load", "200 RPM @6V"], ["Stall current", "~1A ⚠"], ["Gear ratio", "1:48"]]} />
        </div>
      </div>
    ),
  },
  {
    id: "motor", title: "Motor Theory — Torque, Speed & Gears", icon: "🔄", color: RED,
    body: (
      <div className="space-y-2 text-xs text-white/50 leading-relaxed">
        <p>A DC motor obeys two linked laws: <b className="text-white">speed ∝ voltage</b> and <b className="text-white">torque ∝ current</b>. Load the shaft and it slows, drawing more current until torque balances the load — at stall it draws maximum (dangerous) current.</p>
        <p>The gearbox is a torque multiplier: 48:1 reduction divides speed by 48 and multiplies torque by ~48 (minus friction). This is why a tiny motor can push a 400 g robot.</p>
        <p>Back-EMF: a spinning motor is also a generator, producing a voltage that opposes the supply. That&apos;s why current spikes at startup (no back-EMF yet) — and why drivers need flyback diodes to absorb the energy when switching off.</p>
      </div>
    ),
  },
  {
    id: "ir", title: "IR Sensor Theory — Light as Measurement", icon: "👁️", color: PURPLE,
    body: (
      <div className="space-y-2 text-xs text-white/50 leading-relaxed">
        <p>Albedo is the fraction of light a surface reflects. White paper: ~0.8. Matte black tape: ~0.05. The photodiode converts returned photons to current, a resistor converts current to voltage, and the LM393 comparator converts voltage to a clean digital edge — a full analog-to-digital measurement chain in a ₹40 module.</p>
        <p>Failure modes worth memorizing: <b className="text-white">ambient IR</b> (sunlight swamps the signal), <b className="text-white">specular reflection</b> (glossy tape mirrors light away at angles), <b className="text-white">height sensitivity</b> (signal falls with distance squared).</p>
        <p>Pro upgrade: modulate the IR LED at 38 kHz and filter for that frequency — ambient light rejection improves ~100×. This is exactly how TV remotes survive sunny rooms.</p>
      </div>
    ),
  },
  {
    id: "embedded", title: "Embedded Programming Concepts", icon: "💾", color: CYAN,
    body: (
      <div className="space-y-2 text-xs text-white/50 leading-relaxed">
        <p><b className="text-white">Polling vs interrupts:</b> our loop polls sensors — simple and fast enough. Interrupts respond in microseconds but add complexity. Choose polling until you can&apos;t.</p>
        <p><b className="text-white">Blocking vs non-blocking:</b> delay() blocks everything. Real firmware tracks time with millis()/micros() and keeps the loop spinning. One blocking call can crash a robot at speed.</p>
        <p><b className="text-white">Fixed vs float:</b> the ESP32 has hardware floats, but the Uno emulates them slowly. Competition Uno code uses integer math (error × 100) for 10× faster loops.</p>
        <p><b className="text-white">Watchdogs:</b> production embedded systems auto-reset if the loop hangs. The ESP32 has one built in — feed it or it bites.</p>
      </div>
    ),
  },
  {
    id: "control", title: "Control Systems Basics", icon: "🔁", color: GREEN,
    body: (
      <div className="space-y-2 text-xs text-white/50 leading-relaxed">
        <p><b className="text-white">Open loop</b> = commands without measurement (a toy car). <b className="text-white">Closed loop</b> = measure, compare to setpoint, correct — repeat. Feedback is what makes systems robust to disturbances nobody predicted.</p>
        <p>Three behaviors every controller trades between: <b style={{ color: CYAN }}>rise time</b> (how fast it responds), <b style={{ color: AMBER }}>overshoot</b> (how far it swings past), <b style={{ color: GREEN }}>steady-state error</b> (how close it settles). Kp buys speed at the cost of overshoot; Kd buys calm; Ki buys accuracy at the cost of patience.</p>
        <p>The deep insight: stability is a property of the whole loop — sensor lag, motor lag, code speed AND gains together. Change any one and the same gains can go unstable.</p>
      </div>
    ),
  },
  {
    id: "robotics", title: "Robotics Fundamentals", icon: "🤖", color: AMBER,
    body: (
      <div className="space-y-2 text-xs text-white/50 leading-relaxed">
        <p><b className="text-white">Sense → Plan → Act</b> is the canonical robotics loop, and you&apos;ve now built all three stages. Scale the same architecture up: cameras instead of IR, neural networks instead of if/else, four motors instead of two — that&apos;s a warehouse robot.</p>
        <p><b className="text-white">Degrees of freedom:</b> our robot has 3 (x, y, heading) but only 2 controls (two wheel speeds) — it&apos;s <i>nonholonomic</i>: it cannot slide sideways. Parallel parking is hard for the same reason.</p>
        <p><b className="text-white">Odometry:</b> add wheel encoders and integrate wheel rotations to estimate position — the first step toward robots that navigate without a line at all (SLAM).</p>
      </div>
    ),
  },
];

export default function KnowledgeHub() {
  const [open, setOpen] = useState<string | null>("theory");
  return (
    <Section id="knowledge" num="14" title="Engineering Knowledge Hub"
      subtitle="The reference library: theory notes, the master circuit, datasheet numbers worth memorizing, and the concepts that transfer to every robot you'll ever build." color={CYAN}>
      <div className="space-y-2">
        {ENTRIES.map((e) => {
          const isOpen = open === e.id;
          return (
            <Card key={e.id} className="overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : e.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: `${e.color}12`, border: `1px solid ${e.color}33` }}>{e.icon}</span>
                <span className="flex-1 text-sm font-bold" style={{ color: isOpen ? e.color : "rgba(255,255,255,0.7)" }}>{e.title}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-white/30 text-xs">▼</motion.span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-4 pb-5 sm:px-16">{e.body}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
