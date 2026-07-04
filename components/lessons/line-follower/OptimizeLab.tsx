"use client";
import { useMemo, useRef } from "react";
import Section, { AMBER, CYAN, GREEN, RED, Card } from "./Section";
import { SimParams, DEFAULT_PARAMS } from "./simParams";

interface SliderDef {
  key: keyof SimParams;
  label: string;
  min: number; max: number; step: number;
  unit: string;
  color: string;
  hint: string;
}

const SLIDERS: SliderDef[] = [
  { key: "baseSpeed", label: "Motor Speed", min: 60, max: 255, step: 5, unit: "PWM", color: AMBER, hint: "Cruise power. More speed = faster laps but the robot reacts 'later' relative to distance traveled." },
  { key: "threshold", label: "Sensor Threshold", min: 200, max: 800, step: 10, unit: "mV", color: "#A78BFA", hint: "Comparator trip point. Too low: misses faded tape. Too high: shadows read as line." },
  { key: "kp", label: "PID · Kp (proportional)", min: 0, max: 120, step: 1, unit: "", color: CYAN, hint: "Steering strength right now. Too low: drifts off curves. Too high: zig-zag oscillation." },
  { key: "ki", label: "PID · Ki (integral)", min: 0, max: 10, step: 0.1, unit: "", color: GREEN, hint: "Fixes persistent drift (e.g., one motor weaker). Use sparingly — too much causes slow wobble." },
  { key: "kd", label: "PID · Kd (derivative)", min: 0, max: 80, step: 1, unit: "", color: RED, hint: "The damper. Predicts where error is heading and brakes the swing. Cures Kp oscillation." },
  { key: "accel", label: "Acceleration", min: 5, max: 50, step: 1, unit: "", color: "#F97316", hint: "How fast the robot ramps to speed. Gentle ramps prevent wheel-slip at launch." },
  { key: "turnSens", label: "Turning Sensitivity", min: 10, max: 100, step: 1, unit: "%", color: "#EC4899", hint: "Scales all steering output. Sharp tracks want more; straight speedways want less." },
];

/** Damped-oscillator preview of the line-tracking response */
function responseCurve(p: SimParams): { pts: string; overshoot: number; settled: boolean } {
  const v = p.baseSpeed / 255;
  const stiff = 0.9 * (p.kp * (p.turnSens / 50)) * v + 1;
  const damp = 0.16 * p.kd + 0.4 + 6 / (1 + v * 4);
  let y = 1, dy = 0, overshoot = 0;
  const pts: string[] = [];
  const N = 120;
  for (let i = 0; i < N; i++) {
    const dt = 0.03;
    const ddy = -stiff * y - damp * dy + p.ki * 0.02 * (0 - y);
    dy += ddy * dt;
    y += dy * dt;
    if (-y > overshoot) overshoot = -y;
    pts.push(`${(i / (N - 1)) * 300},${60 - y * 42}`);
  }
  return { pts: pts.join(" "), overshoot, settled: Math.abs(y) < 0.06 };
}

export default function OptimizeLab({
  params, setParams, onTuned,
}: {
  params: SimParams;
  setParams: (p: SimParams) => void;
  onTuned: () => void;
}) {
  const touched = useRef(0);
  const curve = useMemo(() => responseCurve(params), [params]);

  const metrics = useMemo(() => {
    const speedScore = params.baseSpeed / 255;
    const oscillationPenalty = Math.min(1, curve.overshoot * 1.4);
    const lapTime = Math.round((16 / (0.35 + speedScore)) * (1 + oscillationPenalty * 0.7) * 10) / 10;
    const stability = Math.max(0, Math.min(100, Math.round(100 - curve.overshoot * 120 - (curve.settled ? 0 : 25))));
    const cornering = Math.max(0, Math.min(100, Math.round((params.kp * (params.turnSens / 50)) * 0.9 - Math.max(0, params.baseSpeed - 180) * 0.25)));
    const risk = params.baseSpeed > 210 && stability < 60 ? "HIGH" : params.baseSpeed > 180 || stability < 50 ? "MEDIUM" : "LOW";
    return { lapTime, stability, cornering, risk };
  }, [params, curve]);

  const set = (key: keyof SimParams, val: number) => {
    setParams({ ...params, [key]: val });
    touched.current += 1;
    if (touched.current === 6) onTuned();
  };

  return (
    <Section id="optimize" num="11" title="Optimization Lab"
      subtitle="These sliders drive the Simulation Arena above in real time. Tune, re-run, repeat — this loop is exactly how competition teams shave seconds." color={AMBER} wide>
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <Card className="p-5">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
            {SLIDERS.map((s) => (
              <div key={s.key}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className="text-xs font-bold text-white/60">{s.label}</label>
                  <span className="font-mono text-sm font-black tabular-nums" style={{ color: s.color }}>
                    {params[s.key]}{s.unit && <span className="text-[9px] text-white/30 ml-0.5">{s.unit}</span>}
                  </span>
                </div>
                <input
                  type="range" min={s.min} max={s.max} step={s.step}
                  value={params[s.key]}
                  onChange={(e) => set(s.key, parseFloat(e.target.value))}
                  className="w-full"
                  style={{ background: `linear-gradient(90deg, ${s.color} ${((params[s.key] - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.08) 0%)` }}
                />
                <p className="text-[10px] text-white/30 mt-1 leading-snug">{s.hint}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setParams({ ...DEFAULT_PARAMS })}
            className="mt-5 text-[11px] font-bold px-4 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
            ↺ Reset to factory defaults
          </button>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Tracking response preview</div>
            <svg viewBox="0 0 300 120" className="w-full rounded-xl" style={{ background: "rgba(5,5,7,0.6)" }}>
              <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
              <text x="4" y="56" fontSize="8" fill="rgba(255,255,255,0.3)">line center</text>
              <polyline points={curve.pts} fill="none" stroke={curve.overshoot > 0.6 ? RED : curve.overshoot > 0.25 ? AMBER : GREEN} strokeWidth="2" />
              <text x="296" y="112" fontSize="8" fill="rgba(255,255,255,0.3)" textAnchor="end">time →</text>
            </svg>
            <p className="text-[10px] mt-2 leading-snug" style={{ color: curve.overshoot > 0.6 ? "#FCA5A5" : curve.overshoot > 0.25 ? "#FCD34D" : "#6EE7B7" }}>
              {curve.overshoot > 0.6
                ? "⚠ Heavy oscillation — the robot will zig-zag violently. Raise Kd or lower Kp/speed."
                : curve.overshoot > 0.25
                  ? "Slight overshoot — acceptable, but a touch more Kd would smooth it."
                  : "✓ Critically damped — smooth, fast recovery to the line. Beautiful tuning."}
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Predicted performance</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/45">Est. competition lap</span>
              <span className="font-mono font-black text-lg tabular-nums" style={{ color: CYAN }}>{metrics.lapTime}s</span>
            </div>
            {([["Stability", metrics.stability, GREEN], ["Cornering", metrics.cornering, AMBER]] as const).map(([label, v, color]) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white/45">{label}</span>
                  <span className="font-mono tabular-nums" style={{ color }}>{v}/100</span>
                </div>
                <div className="h-2 rounded-full bg-white/6 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${v}%`, background: color }} />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-white/45">Line-loss risk</span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-lg"
                style={{
                  color: metrics.risk === "HIGH" ? "#FCA5A5" : metrics.risk === "MEDIUM" ? "#FCD34D" : "#6EE7B7",
                  background: metrics.risk === "HIGH" ? `${RED}1a` : metrics.risk === "MEDIUM" ? `${AMBER}1a` : `${GREEN}1a`,
                }}>
                {metrics.risk}
              </span>
            </div>
            <p className="text-[9px] text-white/25 pt-1">💡 Now scroll up and re-run the Competition track with your new tune.</p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
