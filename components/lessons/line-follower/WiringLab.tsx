"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card, StatChip } from "./Section";

const GRAY = "#94A3B8";

interface Pin { id: string; label: string; x: number; y: number; device: string }

const PINS: Pin[] = [
  // IR Left (pins on right edge)
  { id: "irl-vcc", label: "VCC", x: 168, y: 66, device: "IR LEFT" },
  { id: "irl-gnd", label: "GND", x: 168, y: 96, device: "IR LEFT" },
  { id: "irl-out", label: "OUT", x: 168, y: 126, device: "IR LEFT" },
  // IR Right (pins on left edge)
  { id: "irr-vcc", label: "VCC", x: 632, y: 66, device: "IR RIGHT" },
  { id: "irr-gnd", label: "GND", x: 632, y: 96, device: "IR RIGHT" },
  { id: "irr-out", label: "OUT", x: 632, y: 126, device: "IR RIGHT" },
  // ESP32
  { id: "esp-3v3", label: "3V3", x: 310, y: 202, device: "ESP32" },
  { id: "esp-gnd", label: "GND", x: 360, y: 202, device: "ESP32" },
  { id: "esp-g34", label: "G34", x: 415, y: 202, device: "ESP32" },
  { id: "esp-g35", label: "G35", x: 465, y: 202, device: "ESP32" },
  { id: "esp-in12", label: "G25·26", x: 520, y: 245, device: "ESP32" },
  { id: "esp-in34", label: "G27·14", x: 520, y: 277, device: "ESP32" },
  { id: "esp-ena", label: "G32", x: 520, y: 309, device: "ESP32" },
  { id: "esp-enb", label: "G33", x: 520, y: 341, device: "ESP32" },
  { id: "esp-vin", label: "VIN", x: 280, y: 320, device: "ESP32" },
  // L298N
  { id: "drv-in12", label: "IN1·2", x: 600, y: 245, device: "L298N" },
  { id: "drv-in34", label: "IN3·4", x: 600, y: 277, device: "L298N" },
  { id: "drv-ena", label: "ENA", x: 600, y: 309, device: "L298N" },
  { id: "drv-enb", label: "ENB", x: 600, y: 341, device: "L298N" },
  { id: "drv-5v", label: "5V", x: 600, y: 373, device: "L298N" },
  { id: "drv-12v", label: "12V", x: 648, y: 212, device: "L298N" },
  { id: "drv-gnd", label: "GND", x: 715, y: 212, device: "L298N" },
  { id: "drv-out12", label: "OUT1·2", x: 645, y: 388, device: "L298N" },
  { id: "drv-out34", label: "OUT3·4", x: 725, y: 388, device: "L298N" },
  // Battery + switch + motors
  { id: "bat-pos", label: "+", x: 212, y: 458, device: "BATTERY" },
  { id: "bat-neg", label: "−", x: 212, y: 498, device: "BATTERY" },
  { id: "sw-in", label: "IN", x: 292, y: 477, device: "SWITCH" },
  { id: "sw-out", label: "OUT", x: 392, y: 477, device: "SWITCH" },
  { id: "motor-l", label: "M+·M−", x: 512, y: 442, device: "MOTOR L" },
  { id: "motor-r", label: "M+·M−", x: 682, y: 442, device: "MOTOR R" },
];

interface Conn { a: string; b: string; color: string; group: string; desc: string }

const REQUIRED: Conn[] = [
  { a: "irl-vcc", b: "esp-3v3", color: RED, group: "Sensors → ESP32", desc: "Left IR power" },
  { a: "irl-gnd", b: "esp-gnd", color: GRAY, group: "Sensors → ESP32", desc: "Left IR ground" },
  { a: "irl-out", b: "esp-g34", color: CYAN, group: "Sensors → ESP32", desc: "Left IR signal → GPIO34" },
  { a: "irr-vcc", b: "esp-3v3", color: RED, group: "Sensors → ESP32", desc: "Right IR power" },
  { a: "irr-gnd", b: "esp-gnd", color: GRAY, group: "Sensors → ESP32", desc: "Right IR ground" },
  { a: "irr-out", b: "esp-g35", color: CYAN, group: "Sensors → ESP32", desc: "Right IR signal → GPIO35" },
  { a: "esp-in12", b: "drv-in12", color: AMBER, group: "ESP32 → Driver", desc: "Motor A direction" },
  { a: "esp-in34", b: "drv-in34", color: AMBER, group: "ESP32 → Driver", desc: "Motor B direction" },
  { a: "esp-ena", b: "drv-ena", color: PURPLE, group: "ESP32 → Driver", desc: "Motor A PWM speed" },
  { a: "esp-enb", b: "drv-enb", color: PURPLE, group: "ESP32 → Driver", desc: "Motor B PWM speed" },
  { a: "drv-out12", b: "motor-l", color: AMBER, group: "Driver → Motors", desc: "Left motor power" },
  { a: "drv-out34", b: "motor-r", color: AMBER, group: "Driver → Motors", desc: "Right motor power" },
  { a: "bat-pos", b: "sw-in", color: RED, group: "Battery → System", desc: "Battery + → switch" },
  { a: "sw-out", b: "drv-12v", color: RED, group: "Battery → System", desc: "Switched power → driver" },
  { a: "bat-neg", b: "drv-gnd", color: GRAY, group: "Battery → System", desc: "Common ground" },
  { a: "drv-5v", b: "esp-vin", color: RED, group: "Battery → System", desc: "Regulated 5V → ESP32" },
];

const GROUPS = ["Sensors → ESP32", "ESP32 → Driver", "Driver → Motors", "Battery → System"];

function keyOf(a: string, b: string) { return [a, b].sort().join("~"); }

function classifyError(a: string, b: string): string {
  const set = new Set([a, b]);
  if ((set.has("motor-l") || set.has("motor-r")) && (a.startsWith("esp") || b.startsWith("esp")))
    return "🔥 Never wire motors straight to the microcontroller! GPIO pins supply ~40 mA — a motor draws 10× that. Route power through the L298N.";
  if (set.has("bat-pos") && set.has("drv-12v"))
    return "⚡ Almost! Route battery + through the SWITCH first, so you can shut the robot down instantly.";
  const isPwr = (p: string) => /vcc|3v3|vin|5v|12v|pos/.test(p);
  const isGnd = (p: string) => /gnd|neg/.test(p);
  const isSig = (p: string) => /out|g3[45]|in12|in34|ena|enb/.test(p);
  if ((isPwr(a) && isGnd(b)) || (isGnd(a) && isPwr(b)))
    return "💥 That's a SHORT CIRCUIT — power straight to ground. In real life: smoke. Wire removed automatically.";
  if ((isPwr(a) && isSig(b)) || (isSig(a) && isPwr(b)))
    return "⚠ That feeds supply voltage into a signal line. Signals go to GPIO/logic pins, power goes to power pins.";
  return "❌ Those two pins don't belong together on this robot. Check the hint panel.";
}

export default function WiringLab({ onWired }: { onWired: () => void }) {
  const [wires, setWires] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorWire, setErrorWire] = useState<[string, string] | null>(null);
  const [hint, setHint] = useState<Conn | null>(null);

  const pinMap = useMemo(() => new Map(PINS.map((p) => [p.id, p])), []);
  const reqMap = useMemo(() => new Map(REQUIRED.map((c) => [keyOf(c.a, c.b), c])), []);
  const doneCount = wires.size;
  const complete = doneCount === REQUIRED.length;

  const clickPin = (id: string) => {
    setError(null); setHint(null);
    if (!pending) { setPending(id); return; }
    if (pending === id) { setPending(null); return; }
    const k = keyOf(pending, id);
    if (reqMap.has(k) && !wires.has(k)) {
      setWires((prev) => {
        const next = new Set(prev).add(k);
        if (next.size === REQUIRED.length) setTimeout(onWired, 400);
        return next;
      });
    } else if (wires.has(k)) {
      setError("That connection already exists.");
    } else {
      setError(classifyError(pending, id));
      setErrorWire([pending, id]);
      setTimeout(() => setErrorWire(null), 900);
    }
    setPending(null);
  };

  const showHint = () => {
    const next = REQUIRED.find((c) => !wires.has(keyOf(c.a, c.b)));
    if (next) { setHint(next); setError(null); }
  };

  const wirePath = (a: Pin, b: Pin) => {
    const mx = (a.x + b.x) / 2;
    const sag = Math.min(60, Math.abs(a.x - b.x) * 0.2 + 24);
    return `M${a.x},${a.y} C ${mx},${a.y + sag} ${mx},${b.y + sag} ${b.x},${b.y}`;
  };

  const deviceBox = (x: number, y: number, w: number, h: number, label: string, color: string, sub?: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="rgba(255,255,255,0.03)" stroke={`${color}55`} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" fontSize="11" fontWeight="900" fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + 34} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">{sub}</text>}
    </g>
  );

  return (
    <Section id="wiring" num="05" title="Interactive Wiring Lab"
      subtitle="Click a pin, then click its partner to run a wire. Wrong pairs are rejected with an explanation — exactly the mistakes real engineers learn from." color={CYAN} wide>
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <Card className="p-3 sm:p-5">
          <svg viewBox="0 0 800 560" className="w-full select-none">
            {/* devices */}
            {deviceBox(30, 40, 130, 110, "IR LEFT", PURPLE, "eyes · left")}
            {deviceBox(640, 40, 130, 110, "IR RIGHT", PURPLE, "eyes · right")}
            {deviceBox(280, 200, 240, 160, "ESP32", CYAN, "the brain")}
            {deviceBox(600, 210, 170, 180, "L298N", RED, "the muscle")}
            {deviceBox(60, 430, 150, 90, "BATTERY", GREEN, "7.4V Li-ion")}
            {deviceBox(292, 445, 100, 60, "SWITCH", AMBER)}
            {deviceBox(460, 442, 105, 80, "MOTOR L", AMBER)}
            {deviceBox(630, 442, 105, 80, "MOTOR R", AMBER)}

            {/* placed wires */}
            {[...wires].map((k) => {
              const c = reqMap.get(k)!;
              const a = pinMap.get(c.a)!, b = pinMap.get(c.b)!;
              return (
                <g key={k}>
                  <motion.path d={wirePath(a, b)} fill="none" stroke={c.color} strokeWidth="3" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} opacity="0.85" />
                  <circle cx={a.x} cy={a.y} r="4" fill={c.color} />
                  <circle cx={b.x} cy={b.y} r="4" fill={c.color} />
                </g>
              );
            })}

            {/* error wire flash */}
            {errorWire && (
              <motion.path d={wirePath(pinMap.get(errorWire[0])!, pinMap.get(errorWire[1])!)}
                fill="none" stroke={RED} strokeWidth="3.5" strokeDasharray="6 5" strokeLinecap="round"
                initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.9 }} />
            )}

            {/* hint pulse */}
            {hint && [hint.a, hint.b].map((id) => {
              const p = pinMap.get(id)!;
              return (
                <motion.circle key={id} cx={p.x} cy={p.y} r="12" fill="none" stroke={AMBER} strokeWidth="2"
                  animate={{ r: [8, 18, 8], opacity: [1, 0.1, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
              );
            })}

            {/* pins */}
            {PINS.map((p) => {
              const isPending = pending === p.id;
              const used = [...wires].some((k) => k.includes(p.id));
              return (
                <g key={p.id} onClick={() => clickPin(p.id)} className="cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="11" fill="transparent" />
                  <circle cx={p.x} cy={p.y} r="5.5" fill={isPending ? AMBER : used ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)"}
                    stroke={isPending ? AMBER : "rgba(255,255,255,0.4)"} strokeWidth="1.4">
                    {isPending && <animate attributeName="r" values="5.5;7.5;5.5" dur="0.8s" repeatCount="indefinite" />}
                  </circle>
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold"
                    fill={isPending ? AMBER : "rgba(255,255,255,0.55)"}>{p.label}</text>
                </g>
              );
            })}
          </svg>

          <AnimatePresence>
            {(error || pending || complete) && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-2 px-4 py-2.5 rounded-xl border text-xs font-semibold"
                style={complete
                  ? { borderColor: `${GREEN}55`, background: `${GREEN}11`, color: GREEN }
                  : error
                    ? { borderColor: `${RED}55`, background: `${RED}0d`, color: "#FCA5A5" }
                    : { borderColor: `${AMBER}44`, background: `${AMBER}0d`, color: AMBER }}>
                {complete
                  ? "✓ ALL 16 CONNECTIONS VERIFIED — your robot's nervous system is live. Power it up in the Circuit Simulator ↓"
                  : error ?? `Selected ${pinMap.get(pending!)?.device} · ${pinMap.get(pending!)?.label} — now click its partner pin (or click again to cancel).`}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* status panel */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Wiring status</span>
              <StatChip label="wired" value={`${doneCount}/16`} color={complete ? GREEN : CYAN} />
            </div>
            <div className="space-y-3">
              {GROUPS.map((g) => {
                const items = REQUIRED.filter((c) => c.group === g);
                const done = items.filter((c) => wires.has(keyOf(c.a, c.b))).length;
                return (
                  <div key={g}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-white/55">{g}</span>
                      <span className="tabular-nums" style={{ color: done === items.length ? GREEN : "rgba(255,255,255,0.35)" }}>{done}/{items.length}</span>
                    </div>
                    <div className="space-y-1">
                      {items.map((c) => {
                        const ok = wires.has(keyOf(c.a, c.b));
                        return (
                          <div key={c.desc} className="flex items-center gap-1.5 text-[10px]" style={{ color: ok ? "#6EE7B7" : "rgba(255,255,255,0.3)" }}>
                            <span>{ok ? "✓" : "○"}</span><span>{c.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <div className="flex gap-2">
            <button onClick={showHint} disabled={complete}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-30"
              style={{ borderColor: `${AMBER}44`, color: AMBER, background: `${AMBER}0a` }}>
              💡 Hint
            </button>
            <button onClick={() => { setWires(new Set()); setPending(null); setError(null); setHint(null); }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-white/40 hover:bg-white/5 transition-all">
              ↺ Clear wires
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
