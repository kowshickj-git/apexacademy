"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#0891B2";

const TIMERS = [
  { name: "TIM1", bus: "APB2", bits: 16, advanced: true },
  { name: "TIM2", bus: "APB1", bits: 32, advanced: false },
  { name: "TIM3", bus: "APB1", bits: 16, advanced: false },
  { name: "TIM4", bus: "APB1", bits: 16, advanced: false },
  { name: "TIM5", bus: "APB1", bits: 32, advanced: false },
  { name: "TIM6", bus: "APB1", bits: 16, advanced: false },
  { name: "TIM7", bus: "APB1", bits: 16, advanced: false },
  { name: "TIM8", bus: "APB2", bits: 16, advanced: true },
];

const SYSCLK = 168;
const APB1_TIM = 84; // timers get x2 if prescaler > 1
const APB2_TIM = 168;

export default function TimerSim({ onUse }: Props) {
  const [selectedTimer, setSelectedTimer] = useState("TIM2");
  const [psc, setPsc] = useState(167);
  const [arr, setArr] = useState(999);
  const [ccr, setCcr] = useState(499);
  const [called, setCalled] = useState(false);

  function handle() { if (!called) { setCalled(true); onUse(); } }

  const timer = TIMERS.find(t => t.name === selectedTimer)!;
  const timClk = timer.bus === "APB2" ? APB2_TIM : APB1_TIM;
  const counterFreq = timClk * 1_000_000 / (psc + 1);
  const updateFreq = counterFreq / (arr + 1);
  const period = 1 / updateFreq;
  const pwmDuty = Math.round((ccr / (arr + 1)) * 100);

  function fmtFreq(hz: number): string {
    if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(2)} MHz`;
    if (hz >= 1_000) return `${(hz / 1_000).toFixed(2)} kHz`;
    return `${hz.toFixed(2)} Hz`;
  }

  function fmtTime(s: number): string {
    if (s < 0.001) return `${(s * 1_000_000).toFixed(1)} µs`;
    if (s < 1) return `${(s * 1000).toFixed(2)} ms`;
    return `${s.toFixed(3)} s`;
  }

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 05 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Timer Calculator</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          Formula: Timer frequency = TimerCLK / (PSC+1) / (ARR+1). PWM duty = CCR / (ARR+1).
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.2)" }}>
          {/* Timer selector */}
          <div className="mb-5">
            <div className="text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.5)" }}>Select Timer</div>
            <div className="flex gap-1.5 flex-wrap">
              {TIMERS.map(t => (
                <button
                  key={t.name}
                  onClick={() => { setSelectedTimer(t.name); handle(); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: selectedTimer === t.name ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${selectedTimer === t.name ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: selectedTimer === t.name ? COLOR : "rgba(240,240,245,0.35)",
                  }}
                >
                  {t.name}
                  <span className="ml-1 text-[8px] opacity-60">{t.bits}b</span>
                </button>
              ))}
            </div>
            <div className="mt-2 text-[10px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>
              {timer.name} · {timer.bits}-bit · {timer.bus} · {fmtFreq(timClk * 1_000_000)} input
              {timer.advanced && " · Advanced (complementary outputs)"}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { label: "Prescaler (PSC)", min: 0, max: 65535, val: psc, set: setPsc, info: `Counter clock = ${fmtFreq(counterFreq)}` },
                { label: "Auto-Reload (ARR)", min: 0, max: timer.bits === 32 ? 4294967295 : 65535, val: arr, set: setArr, step: 1, info: `Update freq = ${fmtFreq(updateFreq)}` },
                { label: "Capture/Compare (CCR)", min: 0, max: arr, val: Math.min(ccr, arr), set: setCcr, step: 1, info: `PWM duty = ${pwmDuty}%` },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "rgba(240,240,245,0.5)" }}>{s.label}</span>
                    <span className="font-mono" style={{ color: COLOR }}>{s.val}</span>
                  </div>
                  <input
                    type="range" min={s.min} max={Math.min(s.max, 65535)} step={s.step ?? 1} value={Math.min(s.val, 65535)}
                    onChange={e => { s.set(Number(e.target.value)); handle(); }}
                    className="w-full accent-cyan-700"
                  />
                  <div className="text-[9px] mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>{s.info}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.5)" }}>Calculated Values</div>
              <div className="space-y-2 mb-4">
                {[
                  { label: "Timer Input Clock", val: fmtFreq(timClk * 1_000_000), highlight: false },
                  { label: "Counter Frequency", val: fmtFreq(counterFreq), highlight: false },
                  { label: "Update Frequency", val: fmtFreq(updateFreq), highlight: true },
                  { label: "Period", val: fmtTime(period), highlight: false },
                  { label: "PWM Duty Cycle", val: `${pwmDuty}%`, highlight: false },
                  { label: "PWM ON Time", val: fmtTime(period * pwmDuty / 100), highlight: false },
                ].map(row => (
                  <div key={row.label} className="flex justify-between rounded-lg px-3 py-2 border"
                    style={{
                      background: row.highlight ? "rgba(8,145,178,0.08)" : "rgba(255,255,255,0.02)",
                      borderColor: row.highlight ? "rgba(8,145,178,0.25)" : "rgba(255,255,255,0.06)",
                    }}>
                    <span className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>{row.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: row.highlight ? COLOR : "#F0F0F5" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* PWM bar */}
              <div className="mb-4">
                <div className="text-[10px] mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>PWM Duty Visualization</div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${pwmDuty}%` }}
                    style={{ background: `linear-gradient(90deg, ${COLOR}, #06B6D4)` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
                <div className="text-[9px] mt-0.5 text-right font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>{pwmDuty}%</div>
              </div>

              {/* Code */}
              <div className="p-3 rounded-xl text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.55)" }}>
                <div>htim.Instance = {timer.name};</div>
                <div>htim.Init.Prescaler = {psc};</div>
                <div>htim.Init.Period = {arr};</div>
                <div>HAL_TIM_PWM_Start(&htim, TIM_CHANNEL_1);</div>
                <div>{timer.name}-{">"}<span style={{ color: COLOR }}>CCR1</span> = {Math.min(ccr, arr)};</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
