"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card } from "./Section";

type LinePos = "left" | "center" | "right" | "both" | "lost";

const POSITIONS: { id: LinePos; label: string; icon: string }[] = [
  { id: "left", label: "Line under LEFT eye", icon: "⬅" },
  { id: "center", label: "Line centered", icon: "⬆" },
  { id: "right", label: "Line under RIGHT eye", icon: "➡" },
  { id: "both", label: "Both on black (finish)", icon: "⏹" },
  { id: "lost", label: "Line lost (off track)", icon: "❓" },
];

export default function CircuitSim({ onUsed }: { onUsed: () => void }) {
  const [power, setPower] = useState(false);
  const [pos, setPos] = useState<LinePos>("center");
  const [interacted, setInteracted] = useState(0);

  const bump = () => setInteracted((n) => { if (n === 3) onUsed(); return n + 1; });

  const state = useMemo(() => {
    const lOn = pos === "left" || pos === "both";
    const rOn = pos === "right" || pos === "both";
    if (!power) return { lOn, rOn, action: "SYSTEM OFF", dutyL: 0, dutyR: 0, dirL: 0, dirR: 0, current: 0 };
    let action = "FORWARD", dutyL = 65, dutyR = 65, dirL = 1, dirR = 1;
    if (pos === "left") { action = "TURN LEFT"; dutyL = 45; dutyR = 65; dirL = -1; }
    else if (pos === "right") { action = "TURN RIGHT"; dutyL = 65; dutyR = 45; dirR = -1; }
    else if (pos === "both") { action = "STOP · FINISH"; dutyL = 0; dutyR = 0; dirL = 0; dirR = 0; }
    else if (pos === "lost") { action = "SEARCH SPIN"; dutyL = 40; dutyR = 40; dirL = -1; }
    const current = 62 + (dutyL + dutyR) * 1.9;
    return { lOn, rOn, action, dutyL, dutyR, dirL, dirR, current };
  }, [power, pos]);

  const rpm = (duty: number) => Math.round((duty / 100) * 205);
  const gpioRows: [string, string, string, string][] = [
    ["GPIO34", "INPUT", state.lOn ? "LOW (0)" : "HIGH (1)", state.lOn ? RED : GREEN],
    ["GPIO35", "INPUT", state.rOn ? "LOW (0)" : "HIGH (1)", state.rOn ? RED : GREEN],
    ["GPIO25/26", "OUTPUT", !power || state.dirL === 0 ? "L / L" : state.dirL > 0 ? "H / L" : "L / H", AMBER],
    ["GPIO27/14", "OUTPUT", !power || state.dirR === 0 ? "L / L" : state.dirR > 0 ? "H / L" : "L / H", AMBER],
    ["GPIO32 (ENA)", "PWM", power ? `duty ${state.dutyL}%` : "duty 0%", PURPLE],
    ["GPIO33 (ENB)", "PWM", power ? `duty ${state.dutyR}%` : "duty 0%", PURPLE],
  ];

  const volts: [string, number, number, string][] = [
    ["Battery rail", power ? 7.4 : 0, 8.4, GREEN],
    ["5V regulator", power ? 5.0 : 0, 5.5, RED],
    ["3.3V logic", power ? 3.3 : 0, 3.6, CYAN],
    ["Motor rail", power ? 7.4 - 1.9 : 0, 8.4, AMBER],
  ];

  return (
    <Section id="circuit-sim" num="06" title="Live Circuit Simulator"
      subtitle="A virtual power-up of the exact circuit you just wired. Flip the switch, move the line, and watch every voltage, GPIO, and PWM signal respond." color={GREEN} wide>
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Controls */}
        <Card className="p-5">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Control panel</div>
          <button
            onClick={() => { setPower((p) => !p); bump(); }}
            className="w-full mb-5 p-4 rounded-2xl border-2 transition-all font-black text-sm"
            style={power
              ? { borderColor: `${GREEN}77`, background: `${GREEN}14`, color: GREEN, boxShadow: `0 0 32px ${GREEN}22` }
              : { borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
            <div className="flex items-center justify-between">
              <span>MASTER POWER</span>
              <div className="w-12 h-6 rounded-full relative transition-colors" style={{ background: power ? GREEN : "rgba(255,255,255,0.12)" }}>
                <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" animate={{ left: power ? 26 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 26 }} />
              </div>
            </div>
            <div className="text-[10px] font-semibold mt-1 text-left opacity-70">{power ? "System energized · 7.4V" : "Press to power on"}</div>
          </button>

          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Where is the line?</div>
          <div className="space-y-1.5">
            {POSITIONS.map((p) => (
              <button key={p.id} onClick={() => { setPos(p.id); bump(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left text-[11px] font-bold transition-all"
                style={pos === p.id
                  ? { borderColor: `${CYAN}66`, background: `${CYAN}11`, color: CYAN }
                  : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.45)" }}>
                <span>{p.icon}</span>{p.label}
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl border text-center" style={{ borderColor: power ? `${AMBER}55` : "rgba(255,255,255,0.08)", background: "rgba(5,5,7,0.5)" }}>
            <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Controller decision</div>
            <div className="font-mono font-black text-sm" style={{ color: power ? AMBER : "rgba(255,255,255,0.25)" }}>{state.action}</div>
          </div>
        </Card>

        {/* Signal flow + motors */}
        <Card className="p-5">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Signal & power flow</div>
          <svg viewBox="0 0 260 210" className="w-full mb-3">
            {/* nodes */}
            {[
              { x: 10, y: 10, w: 70, h: 34, label: "IR ×2", color: PURPLE },
              { x: 95, y: 10, w: 70, h: 34, label: "ESP32", color: CYAN },
              { x: 180, y: 10, w: 70, h: 34, label: "L298N", color: RED },
              { x: 10, y: 160, w: 70, h: 34, label: "BATT", color: GREEN },
              { x: 137, y: 160, w: 50, h: 34, label: "M-L", color: AMBER },
              { x: 200, y: 160, w: 50, h: 34, label: "M-R", color: AMBER },
            ].map((n) => (
              <g key={n.label}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="9" fill={power ? `${n.color}14` : "rgba(255,255,255,0.03)"} stroke={power ? `${n.color}88` : "rgba(255,255,255,0.15)"} strokeWidth="1.3" />
                <text x={n.x + n.w / 2} y={n.y + 21} textAnchor="middle" fontSize="10" fontWeight="900" fill={power ? n.color : "rgba(255,255,255,0.3)"}>{n.label}</text>
              </g>
            ))}
            {/* links */}
            {[
              { d: "M80 27 L95 27", c: CYAN },
              { d: "M165 27 L180 27", c: AMBER },
              { d: "M45 160 L45 60 L95 44", c: GREEN },
              { d: "M215 44 L215 100 L162 100 L162 160", c: AMBER },
              { d: "M225 44 L225 160", c: AMBER },
            ].map((l, i) => (
              <g key={i}>
                <path d={l.d} fill="none" stroke={power ? `${l.c}55` : "rgba(255,255,255,0.1)"} strokeWidth="2" />
                {power && (
                  <circle r="3" fill={l.c}>
                    <animateMotion dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" path={l.d} />
                  </circle>
                )}
              </g>
            ))}
            <text x="130" y="205" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)">
              {power ? "signals flowing — sense → think → act" : "power off — no signal flow"}
            </text>
          </svg>

          {/* motor visualization */}
          <div className="grid grid-cols-2 gap-3">
            {([["LEFT", state.dutyL, state.dirL], ["RIGHT", state.dutyR, state.dirR]] as const).map(([side, duty, dir]) => (
              <div key={side} className="p-3 rounded-xl border border-white/8 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
                <motion.div
                  className="w-12 h-12 mx-auto rounded-full border-4 relative mb-2"
                  style={{ borderColor: duty > 0 ? AMBER : "rgba(255,255,255,0.12)", borderTopColor: duty > 0 ? "#FDE68A" : "rgba(255,255,255,0.25)" }}
                  animate={duty > 0 ? { rotate: dir >= 0 ? 360 : -360 } : {}}
                  transition={duty > 0 ? { duration: Math.max(0.25, 1.4 - duty / 100), repeat: Infinity, ease: "linear" } : {}}
                />
                <div className="text-[10px] font-black text-white/60">{side} MOTOR</div>
                <div className="text-sm font-black tabular-nums" style={{ color: duty > 0 ? AMBER : "rgba(255,255,255,0.25)" }}>
                  {rpm(duty)} RPM
                </div>
                <div className="text-[9px] text-white/30">{duty === 0 ? "stopped" : dir >= 0 ? "forward" : "reverse"}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Telemetry */}
        <Card className="p-5">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">GPIO status</div>
          <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
            {gpioRows.map(([pin, mode, val, color], i) => (
              <div key={pin} className="flex items-center justify-between px-3 py-1.5 text-[10px] font-mono" style={{ background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span className="text-white/50">{pin}</span>
                <span className="text-white/25">{mode}</span>
                <span className="font-bold" style={{ color: power ? color : "rgba(255,255,255,0.2)" }}>{power || mode === "INPUT" ? val : "—"}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Voltage rails</div>
          <div className="space-y-2 mb-4">
            {volts.map(([name, v, max, color]) => (
              <div key={name}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-white/40">{name}</span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: v > 0 ? color : "rgba(255,255,255,0.25)" }}>{v.toFixed(1)}V</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                  <motion.div className="h-full rounded-full" animate={{ width: `${(v / max) * 100}%` }} style={{ background: color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl border border-white/8 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="text-lg font-black tabular-nums" style={{ color: power ? GREEN : "rgba(255,255,255,0.25)" }}>
                {Math.round(state.current)} <span className="text-[10px]">mA</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider text-white/30">Current draw</div>
            </div>
            <div className="p-3 rounded-xl border border-white/8 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="text-lg font-black tabular-nums" style={{ color: power ? CYAN : "rgba(255,255,255,0.25)" }}>
                {power ? Math.round((2200 / Math.max(state.current, 1)) * 10) / 10 : "—"}<span className="text-[10px]">{power ? " h" : ""}</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider text-white/30">Est. battery life</div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
