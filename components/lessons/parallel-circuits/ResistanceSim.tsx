"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onResistanceSimUsed: () => void;
}

const RESISTANCE_OPTIONS = [100, 220, 330, 470, 1000, 2200, 4700, 10000];
const SUPPLY_V = 9;

function formatR(r: number): string {
  if (r >= 1000) return `${r / 1000}kΩ`;
  return `${r}Ω`;
}

export default function ResistanceSim({ onResistanceSimUsed }: Props) {
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(220);
  const [r3, setR3] = useState(470);
  const [en1, setEn1] = useState(true);
  const [en2, setEn2] = useState(true);
  const [en3, setEn3] = useState(false);
  const [used, setUsed] = useState(false);

  const handleInteract = () => {
    if (!used) {
      setUsed(true);
      onResistanceSimUsed();
    }
  };

  // Calculate R_eq
  const conductance = (en1 ? 1 / r1 : 0) + (en2 ? 1 / r2 : 0) + (en3 ? 1 / r3 : 0);
  const rEq = conductance > 0 ? 1 / conductance : Infinity;
  const totalCurrentMA = conductance > 0 ? (SUPPLY_V / rEq) * 1000 : 0;

  const activeRs = [en1 ? r1 : null, en2 ? r2 : null, en3 ? r3 : null].filter(
    (r): r is number => r !== null
  );
  const minR = activeRs.length > 0 ? Math.min(...activeRs) : Infinity;

  // Two-resistor special case
  const twoEqual = en1 && en2 && !en3 && r1 === r2;

  const maxBarR = Math.max(r1, r2, r3, rEq < Infinity ? rEq : 0);

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
        <div className="p-5 border-b border-white/5" style={{ background: "rgba(99,102,241,0.05)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="text-xs font-bold px-2 py-0.5 rounded-full border"
              style={{ color: "#818CF8", borderColor: "rgba(129,140,248,0.3)", background: "rgba(99,102,241,0.1)" }}
            >
              SIMULATOR 4
            </div>
          </div>
          <h2 className="text-lg font-bold text-white">Parallel Resistance Calculator</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(240,240,245,0.5)" }}>
            Choose resistor values and enable/disable branches. R_eq is ALWAYS less than the smallest
            individual resistor!
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="flex flex-col gap-4">
            {[
              { label: "R₁", value: r1, set: setR1, enabled: en1, setEnabled: setEn1, color: "#6366F1" },
              { label: "R₂", value: r2, set: setR2, enabled: en2, setEnabled: setEn2, color: "#0EA5E9" },
              { label: "R₃", value: r3, set: setR3, enabled: en3, setEnabled: setEn3, color: "#10B981" },
            ].map(({ label, value, set, enabled, setEnabled, color }) => (
              <div
                key={label}
                className="rounded-xl p-3 border transition-all"
                style={{
                  background: enabled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
                  borderColor: enabled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold" style={{ color: enabled ? "rgba(240,240,245,0.7)" : "rgba(240,240,245,0.25)" }}>
                    {label}
                  </label>
                  <button
                    onClick={() => { setEnabled((e) => !e); handleInteract(); }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all"
                    style={{
                      background: enabled ? `${color}22` : "rgba(255,255,255,0.04)",
                      borderColor: enabled ? `${color}55` : "rgba(255,255,255,0.1)",
                      color: enabled ? color : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {enabled ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>

                {enabled && (
                  <div className="flex flex-wrap gap-1.5">
                    {RESISTANCE_OPTIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => { set(r); handleInteract(); }}
                        className="text-[10px] px-2 py-1 rounded-lg border transition-all font-mono"
                        style={{
                          background: value === r ? `${color}18` : "rgba(255,255,255,0.03)",
                          borderColor: value === r ? `${color}44` : "rgba(255,255,255,0.06)",
                          color: value === r ? color : "rgba(255,255,255,0.35)",
                          fontWeight: value === r ? 700 : 400,
                        }}
                      >
                        {formatR(r)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Special case highlight */}
            {twoEqual && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl p-3 border text-xs"
                style={{
                  background: "rgba(99,102,241,0.12)",
                  borderColor: "rgba(99,102,241,0.35)",
                  color: "#A5B4FC",
                }}
              >
                ✨ Two equal resistors: R_eq = R/2 = {r1}/2 = {r1 / 2}Ω
                <br />
                <span className="text-white/40">This is the &ldquo;equal resistors&rdquo; shortcut!</span>
              </motion.div>
            )}
          </div>

          {/* Visualization + results */}
          <div className="flex flex-col gap-4">
            {/* Bar chart */}
            <div
              className="rounded-2xl p-4 border border-white/6"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Resistance Comparison</p>

              {[
                { label: "R₁", value: en1 ? r1 : null, color: "#6366F1" },
                { label: "R₂", value: en2 ? r2 : null, color: "#0EA5E9" },
                { label: "R₃", value: en3 ? r3 : null, color: "#10B981" },
                { label: "R_eq", value: rEq < Infinity ? rEq : null, color: "#F97316", highlight: true },
              ].map(({ label, value, color, highlight }) => {
                const pct = value !== null && maxBarR > 0 ? (value / maxBarR) * 100 : 0;
                return (
                  <div key={label} className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-mono w-10 text-right shrink-0"
                      style={{ color: value !== null ? color : "rgba(255,255,255,0.2)" }}
                    >
                      {label}
                    </span>
                    <div className="flex-1 relative h-5 flex items-center">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      />
                      {value !== null && (
                        <motion.div
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.4 }}
                          className="absolute left-0 top-0 h-full rounded-full flex items-center justify-end pr-1.5"
                          style={{
                            background: highlight ? `linear-gradient(to right, ${color}, rgba(249,115,22,0.7))` : color,
                            minWidth: 20,
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="text-[10px] font-mono w-16 text-right"
                      style={{ color: value !== null ? color : "rgba(255,255,255,0.2)" }}
                    >
                      {value !== null ? formatR(Math.round(value)) : "off"}
                    </span>
                  </div>
                );
              })}

              <div className="mt-2 text-[10px] text-center" style={{ color: "rgba(240,240,245,0.35)" }}>
                R_eq (orange) is always shorter than all branches
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3 border text-center"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  borderColor: "rgba(99,102,241,0.25)",
                }}
              >
                <div className="text-lg font-black" style={{ color: "#818CF8" }}>
                  {rEq < Infinity ? formatR(Math.round(rEq)) : "∞"}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">R_equivalent</div>
              </div>
              <div
                className="rounded-xl p-3 border text-center"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="text-lg font-black" style={{ color: "#10B981" }}>
                  {totalCurrentMA.toFixed(1)} mA
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">I from 9V supply</div>
              </div>
            </div>

            {/* Formula */}
            <div
              className="rounded-xl p-3 border text-xs font-mono text-center"
              style={{
                background: "rgba(99,102,241,0.06)",
                borderColor: "rgba(99,102,241,0.2)",
                color: "#A5B4FC",
              }}
            >
              1/R_eq = {[en1 && "1/R₁", en2 && "1/R₂", en3 && "1/R₃"].filter(Boolean).join(" + ") || "—"}
              <br />
              <span className="text-white/40">
                R_eq = {rEq < Infinity ? `${Math.round(rEq)}Ω` : "∞"} (less than smallest: {activeRs.length > 0 ? formatR(minR) : "—"})
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
