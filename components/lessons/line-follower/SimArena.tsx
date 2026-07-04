"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Section, { AMBER, CYAN, GREEN, RED, Card, StatChip } from "./Section";
import { SimParams } from "./simParams";

const W = 720, H = 420;
const LINE_W = 15;
const WHEELBASE = 26;

export interface SimResult { track: string; accuracy: number; time: number }

interface Track { id: string; label: string; icon: string; smooth: boolean; pts: [number, number][] }

function sine(): [number, number][] {
  const pts: [number, number][] = [];
  for (let x = 60; x <= 660; x += 20) pts.push([x, 210 + 115 * Math.sin(((x - 60) / 600) * Math.PI * 2)]);
  return pts;
}

const TRACKS: Track[] = [
  { id: "straight", label: "Straight", icon: "➖", smooth: false, pts: [[60, 210], [660, 210]] },
  { id: "curved", label: "Curved", icon: "〰️", smooth: true, pts: sine() },
  { id: "sharp", label: "Sharp Turns", icon: "⚡", smooth: false, pts: [[60, 90], [310, 90], [310, 330], [520, 330], [520, 130], [660, 130]] },
  { id: "maze", label: "Maze", icon: "🌀", smooth: false, pts: [[60, 60], [640, 60], [640, 190], [120, 190], [120, 320], [560, 320], [560, 388], [660, 388]] },
  {
    id: "competition", label: "Competition", icon: "🏆", smooth: true,
    pts: [[60, 380], [210, 375], [320, 300], [285, 190], [170, 150], [215, 68], [400, 55], [505, 130], [450, 240], [560, 330], [655, 250], [660, 110]],
  },
];

type Status = "ready" | "running" | "finished" | "lost" | "timeout";

interface HUD {
  status: Status; time: number; speed: number; accuracy: number;
  sL: boolean; sR: boolean; mL: number; mR: number; progress: number;
}

const HUD0: HUD = { status: "ready", time: 0, speed: 0, accuracy: 100, sL: false, sR: false, mL: 0, mR: 0, progress: 0 };

function buildTrackCanvas(track: Track): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  // white "floor" (like chart paper)
  ctx.fillStyle = "#E7E7EA";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#0A0A0A";
  ctx.lineWidth = LINE_W;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const p = track.pts;
  ctx.beginPath();
  if (track.smooth && p.length > 2) {
    ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
      ctx.quadraticCurveTo(p[i][0], p[i][1], mx, my);
    }
    ctx.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
  } else {
    ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  }
  ctx.stroke();
  // start / finish markers
  ctx.fillStyle = "#10B981";
  ctx.beginPath(); ctx.arc(p[0][0], p[0][1], 8, 0, Math.PI * 2); ctx.fill();
  const last = p[p.length - 1];
  ctx.fillStyle = "#EF4444";
  ctx.beginPath(); ctx.arc(last[0], last[1], 8, 0, Math.PI * 2); ctx.fill();
  return c;
}

export default function SimArena({ params, onResult }: { params: SimParams; onResult: (r: SimResult) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trackId, setTrackId] = useState("curved");
  const [hud, setHud] = useState<HUD>(HUD0);
  const [best, setBest] = useState<Record<string, SimResult>>({});

  const trackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackDataRef = useRef<Uint8ClampedArray | null>(null);
  const runningRef = useRef(false);
  const rafRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const track = TRACKS.find((t) => t.id === trackId)!;

  const drawStatic = useCallback((t: Track) => {
    const tc = buildTrackCanvas(t);
    trackCanvasRef.current = tc;
    trackDataRef.current = tc.getContext("2d")!.getImageData(0, 0, W, H).data;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(tc, 0, 0);
    drawRobot(ctx, t.pts[0][0], t.pts[0][1], Math.atan2(t.pts[1][1] - t.pts[0][1], t.pts[1][0] - t.pts[0][0]), false, false);
  }, []);

  useEffect(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setHud(HUD0);
    drawStatic(track);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  const isDark = (x: number, y: number) => {
    const d = trackDataRef.current;
    if (!d) return false;
    const xi = Math.round(x), yi = Math.round(y);
    if (xi < 0 || yi < 0 || xi >= W || yi >= H) return false;
    return d[(yi * W + xi) * 4] < 100;
  };

  function drawRobot(ctx: CanvasRenderingContext2D, x: number, y: number, th: number, sL: boolean, sR: boolean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(th);
    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath(); ctx.ellipse(0, 3, 26, 20, 0, 0, Math.PI * 2); ctx.fill();
    // wheels
    ctx.fillStyle = "#141419";
    ctx.fillRect(-14, -19, 20, 7);
    ctx.fillRect(-14, 12, 20, 7);
    // body
    ctx.fillStyle = "#23232E";
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1.2;
    const r = 8;
    ctx.beginPath();
    ctx.roundRect(-22, -14, 44, 28, r);
    ctx.fill(); ctx.stroke();
    // board
    ctx.fillStyle = "#0E2A33";
    ctx.fillRect(-12, -7, 18, 14);
    // sensors
    ctx.fillStyle = sL ? "#EF4444" : "#10B981";
    ctx.beginPath(); ctx.arc(20, -9, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = sR ? "#EF4444" : "#10B981";
    ctx.beginPath(); ctx.arc(20, 9, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  const run = () => {
    if (runningRef.current) return;
    const t = track;
    if (!trackCanvasRef.current) drawStatic(t);
    runningRef.current = true;

    // robot state
    let x = t.pts[0][0], y = t.pts[0][1];
    let th = Math.atan2(t.pts[1][1] - t.pts[0][1], t.pts[1][0] - t.pts[0][0]);
    let speed = 0;
    let integral = 0, lastErr = 0, steer = 0;
    let elapsed = 0, onLineFrames = 0, totalFrames = 0, lostTime = 0;
    let lastT = performance.now();
    let hudT = 0;
    const trail: [number, number][] = [];
    const fin = t.pts[t.pts.length - 1];

    // total path length for progress estimate
    let pathLen = 0;
    for (let i = 1; i < t.pts.length; i++) pathLen += Math.hypot(t.pts[i][0] - t.pts[i - 1][0], t.pts[i][1] - t.pts[i - 1][1]);
    let traveled = 0;

    const finish = (status: Status) => {
      runningRef.current = false;
      const accuracy = totalFrames ? Math.round((onLineFrames / totalFrames) * 100) : 0;
      const result: SimResult = { track: t.label, accuracy, time: Math.round(elapsed * 10) / 10 };
      setHud((h) => ({ ...h, status, time: result.time, accuracy }));
      if (status === "finished") {
        setBest((b) => {
          const prev = b[t.id];
          if (!prev || result.time < prev.time) return { ...b, [t.id]: result };
          return b;
        });
        onResult(result);
      }
    };

    const step = (now: number) => {
      if (!runningRef.current) return;
      const p = paramsRef.current;
      let dt = Math.min(0.032, (now - lastT) / 1000);
      lastT = now;
      elapsed += dt;
      totalFrames++;

      // --- sense ---
      const sensAhead = 20, sensSide = 9;
      const cos = Math.cos(th), sin = Math.sin(th);
      const sLx = x + cos * sensAhead - sin * -sensSide, sLy = y + sin * sensAhead + cos * -sensSide;
      const sRx = x + cos * sensAhead - sin * sensSide, sRy = y + sin * sensAhead + cos * sensSide;
      const sL = isDark(sLx, sLy);
      const sR = isDark(sRx, sRy);
      const centerOn = isDark(x + cos * sensAhead, y + sin * sensAhead) || sL || sR;
      if (centerOn) { onLineFrames++; lostTime = 0; } else lostTime += dt;

      // --- think (PID on quantized error) ---
      let err = (sR ? 1 : 0) - (sL ? 1 : 0);
      if (!sL && !sR && !centerOn) err = lastErr !== 0 ? Math.sign(lastErr) * 1.6 : 0; // chase last known direction
      integral = Math.max(-40, Math.min(40, integral + err * dt * 10));
      const deriv = Math.max(-60, Math.min(60, (err - lastErr) / Math.max(dt, 0.001)));
      lastErr = err;
      const u = (p.kp * err + p.ki * integral + p.kd * 0.06 * deriv) * (p.turnSens / 50);

      // --- act (differential drive with acceleration limit) ---
      const targetSpeed = (p.baseSpeed / 255) * 150;
      const accel = 40 + p.accel * 4;
      speed += Math.max(-accel * dt * 3, Math.min(accel * dt, targetSpeed - speed));
      const slowdown = Math.abs(u) > 30 ? Math.max(0.45, 1 - Math.abs(u) / 260) : 1; // corners scrub speed
      const v = speed * slowdown;
      steer += (u - steer) * Math.min(1, dt * 14); // motor time constant
      const vL = v + steer * 0.55;
      const vR = v - steer * 0.55;
      const omega = (vL - vR) / WHEELBASE;
      th += omega * dt;
      x += Math.cos(th) * ((vL + vR) / 2) * dt;
      y += Math.sin(th) * ((vL + vR) / 2) * dt;
      traveled += ((vL + vR) / 2) * dt;

      if (trail.length === 0 || Math.hypot(x - trail[trail.length - 1][0], y - trail[trail.length - 1][1]) > 4) trail.push([x, y]);

      // --- render ---
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && trackCanvasRef.current) {
        ctx.drawImage(trackCanvasRef.current, 0, 0);
        ctx.strokeStyle = "rgba(34,211,238,0.55)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        trail.forEach(([tx, ty], i) => (i ? ctx.lineTo(tx, ty) : ctx.moveTo(tx, ty)));
        ctx.stroke();
        drawRobot(ctx, x, y, th, sL, sR);
      }

      // --- HUD (throttled) ---
      hudT += dt;
      if (hudT > 0.1) {
        hudT = 0;
        setHud({
          status: "running", time: Math.round(elapsed * 10) / 10,
          speed: Math.round(v), accuracy: totalFrames ? Math.round((onLineFrames / totalFrames) * 100) : 100,
          sL, sR,
          mL: Math.round(Math.max(0, Math.min(255, ((vL / 150) * 255))) ),
          mR: Math.round(Math.max(0, Math.min(255, ((vR / 150) * 255))) ),
          progress: Math.min(99, Math.round((traveled / pathLen) * 100)),
        });
      }

      // --- end conditions ---
      if (Math.hypot(x - fin[0], y - fin[1]) < 18 && traveled > pathLen * 0.5) return finish("finished");
      if (lostTime > 2.5 || x < -30 || x > W + 30 || y < -30 || y > H + 30) return finish("lost");
      if (elapsed > 90) return finish("timeout");

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setHud(HUD0);
    drawStatic(track);
  };

  const statusMeta: Record<Status, [string, string]> = {
    ready: ["READY — press Run Simulation", "rgba(255,255,255,0.4)"],
    running: ["RUNNING", CYAN],
    finished: ["🏁 TRACK COMPLETE!", GREEN],
    lost: ["❌ LINE LOST — tune your parameters in the Optimization Lab", RED],
    timeout: ["⏱ TIMEOUT — robot too slow", AMBER],
  };

  return (
    <Section id="arena" num="09" title="Robot Simulation Arena"
      subtitle="Your virtual robot, driven by the same PID math as the real firmware — and by YOUR settings from the Optimization Lab below. Pick a track and race." color={CYAN} wide>
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <Card className="p-3 sm:p-5">
          {/* track picker */}
          <div className="flex flex-wrap gap-2 mb-4">
            {TRACKS.map((t) => (
              <button key={t.id} onClick={() => setTrackId(t.id)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all"
                style={trackId === t.id
                  ? { background: `${CYAN}1a`, borderColor: `${CYAN}66`, color: CYAN }
                  : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                {t.icon} {t.label}
                {best[t.id] && <span className="ml-1.5" style={{ color: GREEN }}>· {best[t.id].time}s</span>}
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 relative">
            <canvas ref={canvasRef} width={W} height={H} className="w-full block" />
            {hud.status !== "running" && hud.status !== "ready" && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(5,5,7,0.55)", backdropFilter: "blur(3px)" }}>
                <div className="text-center px-6 py-5 rounded-2xl border" style={{ borderColor: `${statusMeta[hud.status][1]}55`, background: "rgba(10,10,14,0.9)" }}>
                  <div className="text-lg font-black mb-1" style={{ color: statusMeta[hud.status][1] }}>{statusMeta[hud.status][0]}</div>
                  {hud.status === "finished" && (
                    <div className="text-xs text-white/50">Time <b style={{ color: CYAN }}>{hud.time}s</b> · Accuracy <b style={{ color: GREEN }}>{hud.accuracy}%</b></div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={run} disabled={hud.status === "running"}
              className="flex-1 py-3 rounded-xl font-black text-sm text-black transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-40"
              style={{ background: `linear-gradient(90deg, ${CYAN}, ${GREEN})` }}>
              ▶ Run Simulation
            </button>
            <button onClick={reset} className="px-5 py-3 rounded-xl font-bold text-sm border border-white/12 text-white/50 hover:bg-white/5 transition-all">
              ↺ Reset
            </button>
          </div>
        </Card>

        {/* Telemetry */}
        <div className="space-y-3">
          <Card className="p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Live telemetry</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <StatChip label="Time" value={`${hud.time}s`} color={CYAN} />
              <StatChip label="Speed" value={`${hud.speed} cm/s`} color={AMBER} />
              <StatChip label="Accuracy" value={`${hud.accuracy}%`} color={hud.accuracy > 85 ? GREEN : hud.accuracy > 60 ? AMBER : RED} />
              <StatChip label="Progress" value={`${hud.status === "finished" ? 100 : hud.progress}%`} color={GREEN} />
            </div>

            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Sensors</div>
            <div className="flex gap-2 mb-3">
              {([["L", hud.sL], ["R", hud.sR]] as const).map(([s, on]) => (
                <div key={s} className="flex-1 p-2 rounded-xl border text-center transition-colors"
                  style={{ borderColor: on ? `${RED}66` : `${GREEN}44`, background: on ? `${RED}12` : `${GREEN}0a` }}>
                  <div className="text-[9px] text-white/35">SENSOR {s}</div>
                  <div className="text-[11px] font-black" style={{ color: on ? "#FCA5A5" : "#6EE7B7" }}>{on ? "BLACK" : "WHITE"}</div>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Motor outputs (PWM)</div>
            {([["LEFT", hud.mL], ["RIGHT", hud.mR]] as const).map(([s, v]) => (
              <div key={s} className="mb-2">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-white/40">{s}</span>
                  <span className="font-mono tabular-nums" style={{ color: AMBER }}>{v}/255</span>
                </div>
                <div className="h-2 rounded-full bg-white/6 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-100" style={{ width: `${(v / 255) * 100}%`, background: AMBER }} />
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Best runs</div>
            {Object.keys(best).length === 0 ? (
              <p className="text-[11px] text-white/30">Complete a track to log a time. Beat all 5 to become arena champion. 🏆</p>
            ) : (
              <div className="space-y-1.5">
                {TRACKS.filter((t) => best[t.id]).map((t) => (
                  <div key={t.id} className="flex justify-between text-[11px]">
                    <span className="text-white/50">{t.icon} {t.label}</span>
                    <span className="font-mono" style={{ color: GREEN }}>{best[t.id].time}s · {best[t.id].accuracy}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Section>
  );
}
