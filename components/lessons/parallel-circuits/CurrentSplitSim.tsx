"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onCurrentSplitUsed: () => void;
}

const voltageOptions = [5, 9, 12];

export default function CurrentSplitSim({ onCurrentSplitUsed }: Props) {
  const [voltage, setVoltage] = useState(9);
  const [r1, setR1] = useState(300);
  const [r2, setR2] = useState(600);
  const [r3, setR3] = useState(1000);
  const [used, setUsed] = useState(false);

  const handleInteract = () => {
    if (!used) {
      setUsed(true);
      onCurrentSplitUsed();
    }
  };

  // Kirchhoff's Current Law
  const i1 = voltage / r1;
  const i2 = voltage / r2;
  const i3 = voltage / r3;
  const iTotal = i1 + i2 + i3;
  const rEq = voltage / iTotal;

  const maxI = Math.max(i1, i2, i3);

  const formatMA = (a: number) => (a * 1000).toFixed(2);

  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/8 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5" style={{ background: "rgba(14,165,233,0.06)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="text-xs font-bold px-2 py-0.5 rounded-full border"
              style={{ color: "#0EA5E9", borderColor: "rgba(14,165,233,0.3)", background: "rgba(14,165,233,0.1)" }}
            >
              SIMULATOR 2
            </div>
          </div>
          <h2 className="text-lg font-bold text-white">Current Split Simulator</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(240,240,245,0.5)" }}>
            Adjust branch resistances — watch current split according to Kirchhoff&apos;s Current Law.
            Lower resistance = more current in that branch.
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Voltage */}
            <div>
              <label className="text-xs font-bold text-white/60 mb-2 block">Supply Voltage</label>
              <div className="flex gap-2">
                {voltageOptions.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setVoltage(v); handleInteract(); }}
                    className="px-3 py-1.5 rounded-xl text-sm font-bold border transition-all"
                    style={{
                      background: voltage === v ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.04)",
                      borderColor: voltage === v ? "rgba(14,165,233,0.5)" : "rgba(255,255,255,0.08)",
                      color: voltage === v ? "#38BDF8" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {v}V
                  </button>
                ))}
              </div>
            </div>

            {/* Resistor sliders */}
            {[
              { label: "Branch 1 (R₁)", value: r1, set: setR1, color: "#6366F1" },
              { label: "Branch 2 (R₂)", value: r2, set: setR2, color: "#0EA5E9" },
              { label: "Branch 3 (R₃)", value: r3, set: setR3, color: "#10B981" },
            ].map(({ label, value, set, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold" style={{ color: "rgba(240,240,245,0.6)" }}>
                    {label}
                  </label>
                  <span className="text-xs font-mono font-bold" style={{ color }}>
                    {value}Ω
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={50}
                  value={value}
                  onChange={(e) => { set(Number(e.target.value)); handleInteract(); }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - 100) / 1900) * 100}%, rgba(255,255,255,0.1) ${((value - 100) / 1900) * 100}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-white/20 mt-0.5">
                  <span>100Ω</span>
                  <span>2000Ω</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visualization + results */}
          <div className="flex flex-col gap-4">
            {/* Animated current arrows */}
            <div
              className="rounded-2xl p-4 border border-white/6"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Current Flow</p>

              {/* Total arrow */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-white/40 w-16 shrink-0">I_total</span>
                <div className="flex-1 relative h-4 flex items-center">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute left-0 w-full h-3 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.25)" }}
                  >
                    <span className="text-[9px] font-bold" style={{ color: "#818CF8" }}>
                      {formatMA(iTotal)}mA →
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Branch arrows */}
              {[
                { label: "I₁", current: i1, color: "#6366F1" },
                { label: "I₂", current: i2, color: "#0EA5E9" },
                { label: "I₃", current: i3, color: "#10B981" },
              ].map(({ label, current, color }) => {
                const widthPct = maxI > 0 ? (current / maxI) * 100 : 0;
                return (
                  <div key={label} className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-white/40 w-16 shrink-0">{label}</span>
                    <div className="flex-1 relative h-3">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)" }}
                      />
                      <motion.div
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                    <span className="text-[10px] font-mono w-14 text-right" style={{ color }}>
                      {formatMA(current)}mA
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "I₁", value: `${formatMA(i1)} mA`, color: "#6366F1" },
                { label: "I₂", value: `${formatMA(i2)} mA`, color: "#0EA5E9" },
                { label: "I₃", value: `${formatMA(i3)} mA`, color: "#10B981" },
                { label: "I_total", value: `${formatMA(iTotal)} mA`, color: "#F97316" },
                { label: "R_eq", value: `${rEq.toFixed(1)} Ω`, color: "#818CF8" },
                { label: "V_supply", value: `${voltage} V`, color: "#A5B4FC" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-2.5 border border-white/5 text-center"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="text-xs font-mono font-black" style={{ color }}>
                    {value}
                  </div>
                  <div className="text-[9px] text-white/30 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-3 border text-xs"
              style={{
                background: "rgba(14,165,233,0.07)",
                borderColor: "rgba(14,165,233,0.2)",
                color: "#7DD3FC",
              }}
            >
              KCL: I₁ ({formatMA(i1)}) + I₂ ({formatMA(i2)}) + I₃ ({formatMA(i3)}) = {formatMA(iTotal)} mA total.
              Each branch: I = V_supply / R_branch.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
