"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, RED, Card, StatChip } from "./Section";

interface Part {
  id: string;
  label: string;
  emoji: string;
  needs?: string[];
  hint: string;
  /** zone position as % of the stage */
  zone: { left: string; top: string; w: string; h: string };
}

const PARTS: Part[] = [
  { id: "motor-l", label: "Left Motor", emoji: "🟨", hint: "Slots into the left chassis cutout", zone: { left: "12%", top: "38%", w: "16%", h: "24%" } },
  { id: "motor-r", label: "Right Motor", emoji: "🟨", hint: "Slots into the right chassis cutout", zone: { left: "72%", top: "38%", w: "16%", h: "24%" } },
  { id: "wheel-l", label: "Left Wheel", emoji: "🛞", needs: ["motor-l"], hint: "Push-fits onto the left motor shaft", zone: { left: "2%", top: "34%", w: "10%", h: "32%" } },
  { id: "wheel-r", label: "Right Wheel", emoji: "🛞", needs: ["motor-r"], hint: "Push-fits onto the right motor shaft", zone: { left: "88%", top: "34%", w: "10%", h: "32%" } },
  { id: "caster", label: "Caster Wheel", emoji: "⚪", hint: "Rear center — completes the tripod", zone: { left: "42%", top: "76%", w: "16%", h: "18%" } },
  { id: "battery", label: "Battery Pack", emoji: "🔋", hint: "Low and central — keeps weight over the wheels", zone: { left: "36%", top: "48%", w: "28%", h: "22%" } },
  { id: "driver", label: "L298N Driver", emoji: "⚡", needs: ["battery"], hint: "Between battery and motors", zone: { left: "36%", top: "24%", w: "28%", h: "20%" } },
  { id: "mcu", label: "ESP32 Board", emoji: "🧠", needs: ["driver"], hint: "Front deck, near the sensors", zone: { left: "34%", top: "2%", w: "32%", h: "18%" } },
  { id: "sensors", label: "IR Sensor Pair", emoji: "👁️", needs: ["mcu"], hint: "Front edge, facing DOWN, ahead of the wheels", zone: { left: "24%", top: "-10%", w: "52%", h: "10%" } },
];

const STATUS_BY_COUNT = [
  "Awaiting parts — empty chassis",
  "First motor mounted",
  "Drivetrain taking shape",
  "Rolling on one side…",
  "Both wheels on!",
  "Tripod stable — caster fitted",
  "Power plant installed",
  "Muscle wired in — driver mounted",
  "Brain connected",
  "🎉 ROBOT FULLY ASSEMBLED",
];

export default function BuildLab({ onBuilt }: { onBuilt: () => void }) {
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [flash, setFlash] = useState<{ zone: string; ok: boolean } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const canPlace = (p: Part) => !p.needs || p.needs.every((n) => placed.has(n));
  const remaining = PARTS.filter((p) => !placed.has(p.id));
  const pct = Math.round((placed.size / PARTS.length) * 100);
  const done = placed.size === PARTS.length;

  const place = (part: Part) => {
    if (!canPlace(part)) {
      setFlash({ zone: part.id, ok: false });
      setTimeout(() => setFlash(null), 700);
      return false;
    }
    setPlaced((prev) => {
      const next = new Set(prev).add(part.id);
      if (next.size === PARTS.length) setTimeout(onBuilt, 500);
      return next;
    });
    setFlash({ zone: part.id, ok: true });
    setTimeout(() => setFlash(null), 700);
    setSelected(null);
    return true;
  };

  const tryDrop = (id: string, clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const part = PARTS.find((p) => p.id === id)!;
    const r = stage.getBoundingClientRect();
    const zx = (parseFloat(part.zone.left) / 100) * r.width + r.left;
    const zy = (parseFloat(part.zone.top) / 100) * r.height + r.top;
    const zw = (parseFloat(part.zone.w) / 100) * r.width;
    const zh = (parseFloat(part.zone.h) / 100) * r.height;
    const pad = 24;
    if (clientX > zx - pad && clientX < zx + zw + pad && clientY > zy - pad && clientY < zy + zh + pad) place(part);
    else { setFlash({ zone: part.id, ok: false }); setTimeout(() => setFlash(null), 500); }
  };

  const nextPart = remaining.find(canPlace);

  return (
    <Section id="build" num="04" title="Build Your Robot"
      subtitle="Drag each part from the tray onto its glowing slot — or tap a part, then tap its slot. Order matters: motors before wheels, brain before eyes."
      color={GREEN} wide>
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        {/* Assembly stage */}
        <Card className="p-4 sm:p-6 relative overflow-visible">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Assembly Bay · top view</span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg border" style={{ borderColor: done ? `${GREEN}66` : `${AMBER}44`, color: done ? GREEN : AMBER, background: "rgba(5,5,7,0.6)" }}>
              {STATUS_BY_COUNT[placed.size]}
            </span>
          </div>

          <div ref={stageRef} className="relative mx-auto max-w-md aspect-[4/5] mt-6 mb-2 select-none">
            {/* chassis plate */}
            <div className="absolute inset-x-[8%] inset-y-[6%] rounded-[2.5rem] border-2"
              style={{ borderColor: "rgba(16,185,129,0.35)", background: "linear-gradient(160deg, rgba(16,185,129,0.07), rgba(255,255,255,0.02))" }}>
              <div className="absolute inset-3 rounded-[2rem] border border-dashed border-white/8" />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-white/20">chassis deck</span>
            </div>

            {/* zones */}
            {PARTS.map((p) => {
              const isPlaced = placed.has(p.id);
              const isNext = !isPlaced && canPlace(p) && (selected === p.id || selected === null);
              const flashing = flash?.zone === p.id;
              return (
                <div key={p.id}
                  onClick={() => { if (selected === p.id) place(p); }}
                  className="absolute rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    left: p.zone.left, top: p.zone.top, width: p.zone.w, height: p.zone.h,
                    border: isPlaced ? `1.5px solid ${GREEN}88` : `1.5px dashed ${flashing && !flash!.ok ? RED : isNext ? `${AMBER}88` : "rgba(255,255,255,0.12)"}`,
                    background: isPlaced ? `${GREEN}14` : flashing && !flash!.ok ? `${RED}14` : selected === p.id ? `${AMBER}18` : "rgba(255,255,255,0.02)",
                    boxShadow: isPlaced ? `0 0 18px ${GREEN}22` : selected === p.id ? `0 0 18px ${AMBER}33` : "none",
                    cursor: selected === p.id ? "pointer" : "default",
                    zIndex: 2,
                  }}>
                  {isPlaced ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="text-lg sm:text-2xl">
                      {p.emoji}
                    </motion.span>
                  ) : (
                    <span className="text-[8px] sm:text-[9px] text-white/25 text-center px-1 leading-tight">{p.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {done && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-3 rounded-xl border font-black text-sm" style={{ borderColor: `${GREEN}55`, background: `${GREEN}11`, color: GREEN }}>
              ✓ Mechanical build complete — proceed to the Wiring Lab ↓
            </motion.div>
          )}
        </Card>

        {/* Tray + stats */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Parts tray</div>
            <div className="grid grid-cols-2 gap-2">
              <AnimatePresence>
                {remaining.map((p) => {
                  const unlocked = canPlace(p);
                  return (
                    <motion.button key={p.id} layout exit={{ scale: 0, opacity: 0 }}
                      disabled={!unlocked}
                      onClick={() => unlocked && setSelected(selected === p.id ? null : p.id)}
                      onPointerDown={(e) => {
                        if (!unlocked) return;
                        e.preventDefault();
                        setSelected(p.id);
                        setDrag({ id: p.id, x: e.clientX, y: e.clientY });
                        const move = (ev: PointerEvent) => setDrag({ id: p.id, x: ev.clientX, y: ev.clientY });
                        const up = (ev: PointerEvent) => {
                          window.removeEventListener("pointermove", move);
                          window.removeEventListener("pointerup", up);
                          setDrag(null);
                          tryDrop(p.id, ev.clientX, ev.clientY);
                        };
                        window.addEventListener("pointermove", move);
                        window.addEventListener("pointerup", up);
                      }}
                      className="p-2.5 rounded-xl border text-left transition-all touch-none"
                      style={{
                        borderColor: selected === p.id ? `${AMBER}77` : unlocked ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                        background: selected === p.id ? `${AMBER}14` : "rgba(255,255,255,0.02)",
                        opacity: unlocked ? 1 : 0.35,
                        cursor: unlocked ? "grab" : "not-allowed",
                      }}>
                      <div className="text-base mb-0.5">{p.emoji}</div>
                      <div className="text-[10px] font-bold text-white/70 leading-tight">{p.label}</div>
                      {!unlocked && <div className="text-[8px] text-white/30 mt-0.5">needs {p.needs?.map((n) => PARTS.find((x) => x.id === n)?.label).join(", ")}</div>}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {remaining.length === 0 && <div className="col-span-2 text-center text-xs text-white/30 py-4">Tray empty — nice work! 🎉</div>}
            </div>
            {nextPart && (
              <div className="mt-3 p-2.5 rounded-xl border text-[10px] leading-relaxed" style={{ borderColor: `${CYAN}33`, background: `${CYAN}0a`, color: "rgba(255,255,255,0.5)" }}>
                <b style={{ color: CYAN }}>Engineer&apos;s tip:</b> {nextPart.hint}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Build telemetry</div>
            <div className="mb-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-white/40">Engineering Build Completion</span>
                <span className="font-black tabular-nums" style={{ color: done ? GREEN : AMBER }}>{pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/6 overflow-hidden">
                <motion.div className="h-full rounded-full" animate={{ width: `${pct}%` }}
                  style={{ background: `linear-gradient(90deg, ${AMBER}, ${GREEN})` }} transition={{ type: "spring", stiffness: 80, damping: 20 }} />
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-white/40">Difficulty meter</span>
                <span className="text-white/50 font-bold">{placed.size < 4 ? "Easy 🌱" : placed.size < 7 ? "Moderate ⚙️" : "Precision work 🔬"}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < Math.min(placed.size + 1, 8) ? (i < 4 ? GREEN : i < 7 ? AMBER : RED) : "rgba(255,255,255,0.07)" }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <StatChip label="Placed" value={`${placed.size}/${PARTS.length}`} color={GREEN} />
              <StatChip label="Status" value={done ? "READY" : "BUILDING"} color={done ? GREEN : AMBER} />
            </div>
            {placed.size > 0 && !done && (
              <button onClick={() => { setPlaced(new Set()); setSelected(null); }}
                className="mt-3 w-full text-[10px] font-bold py-2 rounded-lg border border-white/10 text-white/35 hover:text-white/60 hover:bg-white/5 transition-all">
                ↺ Restart build
              </button>
            )}
          </Card>
        </div>
      </div>

      {/* drag ghost */}
      {drag && (
        <div className="fixed z-[70] pointer-events-none -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]"
          style={{ left: drag.x, top: drag.y }}>
          {PARTS.find((p) => p.id === drag.id)?.emoji}
        </div>
      )}
    </Section>
  );
}
