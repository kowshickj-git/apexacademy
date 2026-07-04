"use client";
import { useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card } from "./Section";
import { ARDUINO_CODE, ESP32_CODE, BEGINNER_STEPS } from "./data";

type Tab = "beginner" | "arduino" | "esp32";

interface Lint { line: number; msg: string; severity: "error" | "warn" }

function lint(code: string): Lint[] {
  const issues: Lint[] = [];
  const lines = code.split("\n");
  let braces = 0;
  lines.forEach((l, i) => {
    for (const ch of l) { if (ch === "{") braces++; if (ch === "}") braces--; }
    const t = l.trim();
    if (/^(digitalWrite|analogWrite|ledcWrite|pinMode|delay|Serial\.\w+)\s*\([^)]*\)$/.test(t))
      issues.push({ line: i + 1, msg: "Missing semicolon at end of statement", severity: "error" });
    if (/analogWrite\s*\(\s*\w+\s*,\s*(\d+)/.test(t)) {
      const v = parseInt(t.match(/analogWrite\s*\(\s*\w+\s*,\s*(\d+)/)![1]);
      if (v > 255) issues.push({ line: i + 1, msg: `PWM value ${v} exceeds 255 — will wrap around and misbehave`, severity: "error" });
    }
    if (/delay\s*\(\s*(\d{3,})\s*\)/.test(t)) {
      const v = parseInt(t.match(/delay\s*\(\s*(\d+)\s*\)/)![1]);
      if (v >= 100) issues.push({ line: i + 1, msg: `delay(${v}) freezes the control loop — the robot goes blind for ${v} ms`, severity: "warn" });
    }
  });
  if (!/void\s+setup\s*\(/.test(code)) issues.push({ line: 1, msg: "No setup() found — every Arduino sketch needs one", severity: "error" });
  if (!/void\s+loop\s*\(/.test(code)) issues.push({ line: 1, msg: "No loop() found — the robot would run once and stop", severity: "error" });
  if (braces !== 0) issues.push({ line: lines.length, msg: `Unbalanced braces (${braces > 0 ? "+" : ""}${braces}) — check your { } pairs`, severity: "error" });
  return issues;
}

const EXPLAIN: { match: RegExp; text: string }[] = [
  { match: /pinMode/, text: "pinMode() tells the chip whether a pin listens (INPUT) or speaks (OUTPUT). Sensors are inputs; motor driver pins are outputs." },
  { match: /digitalRead/, text: "digitalRead() samples the pin voltage and returns HIGH or LOW. Our IR modules pull the pin LOW when they see the black line." },
  { match: /analogWrite|ledcWrite/, text: "This outputs PWM — a square wave switched thousands of times per second. 128 of 255 ≈ half power. The motor's inertia smooths it into 'half speed'." },
  { match: /digitalWrite\(IN|digitalWrite\(\s*IN/, text: "The IN pins set H-bridge direction. HIGH/LOW spins the motor one way; LOW/HIGH reverses it; LOW/LOW brakes." },
  { match: /Kp|Kd|Ki/, text: "PID gains: Kp reacts to the current error, Kd damps oscillation by reacting to how fast error changes, Ki removes steady drift over time." },
  { match: /error\s*=/, text: "The error signal is the heart of control: negative = line is left, positive = line is right, zero = centered. Everything else just responds to this number." },
  { match: /constrain/, text: "constrain() clamps a value into a safe range — protecting PWM from overflow and the integral term from 'windup'." },
  { match: /BASE_SPEED/, text: "Base cruising speed (0–255). Higher = faster laps but harder cornering. Real teams tune this per track." },
  { match: /if\s*\(!?leftOnLine|if\s*\(l\b/, text: "The decision logic: compare both sensors and pick forward / turn-left / turn-right / stop. Four rules = autonomous driving." },
  { match: /void\s+loop/, text: "loop() runs forever, as fast as the chip allows — this IS the control loop from Section 2, in code." },
];

export default function CodeLab({ onCoded }: { onCoded: () => void }) {
  const [tab, setTab] = useState<Tab>("beginner");
  const [code, setCode] = useState({ arduino: ARDUINO_CODE, esp32: ESP32_CODE });
  const [cursorLine, setCursorLine] = useState(1);
  const edited = useRef(false);

  const activeCode = tab === "arduino" ? code.arduino : code.esp32;
  const issues = useMemo(() => (tab === "beginner" ? [] : lint(activeCode)), [activeCode, tab]);

  const behavior = useMemo(() => {
    const base = parseInt(activeCode.match(/BASE_SPEED\s*=\s*(\d+)/)?.[1] ?? "160");
    const kp = parseFloat(activeCode.match(/Kp\s*=\s*([\d.]+)/)?.[1] ?? "0");
    return { base, kp };
  }, [activeCode]);

  const lineText = activeCode.split("\n")[cursorLine - 1] ?? "";
  const explanation = EXPLAIN.find((e) => e.match.test(lineText));

  return (
    <Section id="code-lab" num="07" title="Code Lab"
      subtitle="Real firmware, editable live. Start in Beginner mode, then open the Arduino or ESP32 sketch — click any line and the AI tutor explains it." color={PURPLE} wide>
      <Card className="overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center border-b border-white/8 px-3 pt-3 gap-1 flex-wrap">
          {([
            ["beginner", "🌱 Beginner Mode", GREEN],
            ["arduino", "🎛️ Arduino Uno (C++)", "#0EA5E9"],
            ["esp32", "🧠 ESP32 + PID (C++)", CYAN],
          ] as [Tab, string, string][]).map(([k, label, color]) => (
            <button key={k} onClick={() => setTab(k)}
              className="px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2"
              style={tab === k
                ? { color, borderColor: color, background: "rgba(255,255,255,0.04)" }
                : { color: "rgba(255,255,255,0.35)", borderColor: "transparent" }}>
              {label}
            </button>
          ))}
          {tab !== "beginner" && (
            <span className="ml-auto mb-1 text-[10px] font-mono px-2 py-1 rounded-lg"
              style={{ color: issues.some((i) => i.severity === "error") ? RED : GREEN, background: "rgba(5,5,7,0.6)" }}>
              {issues.length === 0 ? "✓ compiles clean" : `${issues.length} issue${issues.length > 1 ? "s" : ""} found`}
            </span>
          )}
        </div>

        {tab === "beginner" ? (
          <div className="p-5 sm:p-8 grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">The algorithm in plain English</div>
              <div className="space-y-2">
                {BEGINNER_STEPS.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }} className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                      style={{ background: `${GREEN}1a`, color: GREEN, border: `1px solid ${GREEN}44` }}>{i + 1}</span>
                    <div>
                      <code className="text-[11px] font-mono" style={{ color: CYAN }}>{s.code}</code>
                      <div className="text-[11px] text-white/45 mt-0.5">{s.plain}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-white/8 h-fit" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GREEN }}>Why this works</div>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                Notice there&apos;s no map, no memory, no plan. The robot only ever answers one question:
                <b className="text-white"> &quot;where is the line right now?&quot;</b> — and reacts. Because it re-asks
                a thousand times per second, tiny corrections add up to smooth following.
              </p>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                This idea — <b style={{ color: GREEN }}>fast simple feedback beats slow clever planning</b> — powers
                thermostats, drone stabilizers, cruise control, and rocket landings.
              </p>
              <button onClick={() => setTab("arduino")} className="w-full py-2.5 rounded-xl text-xs font-black transition-transform hover:scale-[1.02]"
                style={{ background: `linear-gradient(90deg, ${GREEN}, ${CYAN})`, color: "#04121A" }}>
                I&apos;m ready — show me the real code →
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px]">
            <div className="h-[440px] border-b lg:border-b-0 lg:border-r border-white/8">
              <Editor
                height="100%"
                defaultLanguage="cpp"
                theme="vs-dark"
                path={tab === "arduino" ? "linefollower_uno.ino" : "linefollower_esp32.ino"}
                value={activeCode}
                onChange={(v) => {
                  setCode((c) => ({ ...c, [tab]: v ?? "" }));
                  if (!edited.current) { edited.current = true; onCoded(); }
                }}
                onMount={(editor) => {
                  editor.onDidChangeCursorPosition((e) => setCursorLine(e.position.lineNumber));
                }}
                options={{
                  fontSize: 12.5,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontFamily: "var(--font-mono, monospace)",
                  padding: { top: 12 },
                  automaticLayout: true,
                  wordWrap: "on",
                }}
              />
            </div>

            <div className="p-4 space-y-4 max-h-[440px] overflow-y-auto">
              {/* AI explain */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
                  🤖 AI tutor · line {cursorLine}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={explanation?.text ?? lineText.slice(0, 20)}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-3 rounded-xl border text-[11px] leading-relaxed"
                    style={{ borderColor: `${PURPLE}33`, background: `${PURPLE}0a`, color: "rgba(255,255,255,0.6)" }}>
                    {explanation ? explanation.text : lineText.trim()
                      ? "Click a line containing sensor reads, PWM writes, PID math, or decision logic and I'll break it down."
                      : "Place your cursor on any line of code to get an explanation."}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Error detection */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Error detection</div>
                {issues.length === 0 ? (
                  <div className="p-3 rounded-xl border text-[11px]" style={{ borderColor: `${GREEN}33`, background: `${GREEN}0a`, color: "#6EE7B7" }}>
                    ✓ No problems found. Ready to flash to the robot.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {issues.slice(0, 5).map((iss, i) => (
                      <div key={i} className="p-2.5 rounded-xl border text-[10px] leading-snug"
                        style={iss.severity === "error"
                          ? { borderColor: `${RED}44`, background: `${RED}0a`, color: "#FCA5A5" }
                          : { borderColor: `${AMBER}44`, background: `${AMBER}0a`, color: "#FCD34D" }}>
                        <b>L{iss.line}</b> · {iss.msg}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Behavior prediction */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Predicted behavior</div>
                <div className="p-3 rounded-xl border border-white/8 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/40">Cruise speed</span>
                    <span className="font-mono font-bold" style={{ color: AMBER }}>
                      {behavior.base}/255 · {behavior.base < 120 ? "cautious 🐢" : behavior.base < 190 ? "balanced ⚖️" : "aggressive 🐇"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(behavior.base / 255) * 100}%`, background: AMBER }} />
                  </div>
                  {tab === "esp32" && (
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/40">Steering gain Kp</span>
                      <span className="font-mono font-bold" style={{ color: CYAN }}>
                        {behavior.kp} · {behavior.kp < 25 ? "lazy turns" : behavior.kp < 70 ? "crisp" : "twitchy!"}
                      </span>
                    </div>
                  )}
                  <p className="text-[9px] text-white/25 pt-1">Try editing BASE_SPEED{tab === "esp32" ? " or Kp" : ""} — this panel updates live.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </Section>
  );
}
