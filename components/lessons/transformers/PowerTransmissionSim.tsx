"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPowerTransmissionUsed: () => void;
}

const STAGES = [
  {
    id: "plant",
    icon: "🏭",
    label: "Power Plant",
    voltage: "11kV",
    current: "90.9A",
    desc: "Generator produces AC at 11kV, 1MW. A step-up transformer boosts this to 400kV for long-distance transmission.",
    color: "#10B981",
  },
  {
    id: "stepup",
    icon: "⬆",
    label: "Step-Up Transformer",
    voltage: "11kV → 400kV",
    current: "90.9A → 2.5A",
    desc: "Turns ratio 1:36.4. Voltage ×36.4. Current ÷36.4. Why? Because P_loss = I²×R — lower current means dramatically less heat loss in the wires.",
    color: "#8B5CF6",
  },
  {
    id: "lines",
    icon: "🗼",
    label: "Transmission Lines",
    voltage: "400kV",
    current: "2.5A",
    desc: "High voltage, tiny current. For 1MW at 400kV: I = 1,000,000 ÷ 400,000 = 2.5A. With R_line = 1Ω: P_loss = 2.5² × 1 = 6.25W. Tiny fraction of 1,000,000W!",
    color: "#F59E0B",
  },
  {
    id: "substation",
    icon: "🏗",
    label: "Grid Substation",
    voltage: "400kV → 33kV",
    current: "2.5A → 30.3A",
    desc: "First step-down to 33kV for regional distribution. Another step-down will bring it to 11kV for local areas, then 230V for homes.",
    color: "#0EA5E9",
  },
  {
    id: "home",
    icon: "🏠",
    label: "Your Home",
    voltage: "230V",
    current: "4.35A (1kW load)",
    desc: "Final step-down to 230V. At this voltage, 1kW requires 4.35A. If the line had been 230V all along: P_loss = 4.35² × R_line — thousands of times more loss!",
    color: "#A78BFA",
  },
];

export default function PowerTransmissionSim({ onPowerTransmissionUsed }: Props) {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [used, setUsed] = useState(false);

  const handleClick = (i: number) => {
    setActiveStage(activeStage === i ? null : i);
    if (!used) {
      setUsed(true);
      onPowerTransmissionUsed();
    }
  };

  // Power loss comparison
  const R_LINE = 1; // ohm (simplified)
  const POWER = 1_000_000; // 1MW
  const I_AT_230 = POWER / 230;
  const I_AT_400K = POWER / 400_000;
  const LOSS_AT_230 = (I_AT_230 ** 2) * R_LINE;
  const LOSS_AT_400K = (I_AT_400K ** 2) * R_LINE;
  const ratio = LOSS_AT_230 / LOSS_AT_400K;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 5 · Power Grid
        </p>
        <h2 className="text-xl font-bold mb-1">Power Grid Journey</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Click each stage to understand why transformers are essential to the power grid.
        </p>

        {/* Grid journey visual */}
        <div className="relative mb-5">
          <div className="flex items-center gap-1">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => handleClick(i)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border w-full transition-all hover:scale-105"
                  style={{
                    background: activeStage === i ? `${stage.color}22` : "rgba(255,255,255,0.03)",
                    borderColor: activeStage === i ? `${stage.color}55` : "rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-xl">{stage.icon}</span>
                  <span className="text-[8px] font-mono text-white/30 text-center leading-tight">{stage.label}</span>
                  <span className="text-[9px] font-bold font-mono" style={{ color: stage.color }}>{stage.voltage.split("→")[0].trim()}</span>
                </button>
                {i < STAGES.length - 1 && (
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="shrink-0">
                    <path d="M2 6h8M7 2l4 4-4 4" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {activeStage !== null && (
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border p-5 mb-5"
              style={{
                borderColor: `${STAGES[activeStage].color}33`,
                background: `${STAGES[activeStage].color}0D`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{STAGES[activeStage].icon}</span>
                <div>
                  <h3 className="font-bold text-white/85">{STAGES[activeStage].label}</h3>
                  <p className="text-xs font-mono" style={{ color: STAGES[activeStage].color }}>
                    {STAGES[activeStage].voltage}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-3">{STAGES[activeStage].desc}</p>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[9px] text-white/25 font-mono uppercase mb-0.5">Voltage</p>
                  <p className="text-xs font-bold font-mono" style={{ color: STAGES[activeStage].color }}>{STAGES[activeStage].voltage}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/25 font-mono uppercase mb-0.5">Current</p>
                  <p className="text-xs font-bold font-mono" style={{ color: STAGES[activeStage].color }}>{STAGES[activeStage].current}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Power loss comparison */}
        <div
          className="rounded-2xl border border-white/8 p-5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-xs font-bold text-white/60 mb-3">Power Loss Comparison (1MW, R_line = 1Ω)</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>At 230V: I = {I_AT_230.toFixed(0)}A → P_loss = I²×R</span>
                <span className="font-mono text-red-400">{(LOSS_AT_230 / 1000).toFixed(0)} kW lost!</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full" style={{ width: "100%", background: "rgba(239,68,68,0.6)" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>At 400kV: I = {I_AT_400K.toFixed(4)}A → P_loss = I²×R</span>
                <span className="font-mono" style={{ color: "#10B981" }}>{LOSS_AT_400K.toFixed(6)} W lost</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full" style={{ width: "0.1%", background: "rgba(16,185,129,0.7)", minWidth: 2 }} />
              </div>
            </div>
          </div>
          <p
            className="text-xs mt-3 font-bold text-center"
            style={{ color: "#8B5CF6" }}
          >
            High voltage = {ratio.toLocaleString(undefined, { maximumFractionDigits: 0 })}× less power loss in transmission
          </p>
        </div>

        {!used && (
          <p className="text-[11px] text-white/30 mt-3 text-center">Click a stage to earn +15 XP</p>
        )}
        {used && (
          <p className="text-[11px] mt-3 text-center" style={{ color: "#8B5CF6" }}>+15 XP earned!</p>
        )}
      </div>
    </section>
  );
}
