"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ResistanceCalcProps {
  onResistanceCalcUsed: () => void;
}

const COMMON_VALUES = [10, 22, 47, 100, 220, 330, 470, 1000, 2200, 4700, 10000];

const COLOR_BANDS: Record<number, { bands: string[]; colors: string[] }> = {
  10: { bands: ["Brown", "Black", "Black"], colors: ["#8B4513", "#222", "#222"] },
  22: { bands: ["Red", "Red", "Black"], colors: ["#ef4444", "#ef4444", "#222"] },
  47: { bands: ["Yellow", "Violet", "Black"], colors: ["#eab308", "#7c3aed", "#222"] },
  100: { bands: ["Brown", "Black", "Brown"], colors: ["#8B4513", "#222", "#8B4513"] },
  220: { bands: ["Red", "Red", "Brown"], colors: ["#ef4444", "#ef4444", "#8B4513"] },
  330: { bands: ["Orange", "Orange", "Brown"], colors: ["#F97316", "#F97316", "#8B4513"] },
  470: { bands: ["Yellow", "Violet", "Brown"], colors: ["#eab308", "#7c3aed", "#8B4513"] },
  1000: { bands: ["Brown", "Black", "Red"], colors: ["#8B4513", "#222", "#ef4444"] },
  2200: { bands: ["Red", "Red", "Red"], colors: ["#ef4444", "#ef4444", "#ef4444"] },
  4700: { bands: ["Yellow", "Violet", "Red"], colors: ["#eab308", "#7c3aed", "#ef4444"] },
  10000: { bands: ["Brown", "Black", "Orange"], colors: ["#8B4513", "#222", "#F97316"] },
};

function ResistorSymbol({ value, color }: { value: number; color: string }) {
  const bands = COLOR_BANDS[value];
  return (
    <svg width="80" height="28" viewBox="0 0 80 28">
      {/* Lead left */}
      <line x1="0" y1="14" x2="14" y2="14" stroke="rgba(240,240,245,0.4)" strokeWidth="1.5" />
      {/* Body */}
      <rect x="14" y="7" width="52" height="14" rx="3" fill="rgba(220,190,140,0.9)" stroke={color} strokeWidth="1.2" />
      {/* Color bands */}
      {bands && bands.colors.map((c, i) => (
        <rect key={i} x={20 + i * 14} y="7" width="7" height="14" fill={c} opacity="0.85" />
      ))}
      {/* Gold tolerance band */}
      <rect x="62" y="7" width="4" height="14" fill="#FFD700" opacity="0.7" />
      {/* Lead right */}
      <line x1="66" y1="14" x2="80" y2="14" stroke="rgba(240,240,245,0.4)" strokeWidth="1.5" />
    </svg>
  );
}

export default function ResistanceCalc({ onResistanceCalcUsed }: ResistanceCalcProps) {
  const [r1, setR1] = useState<number>(100);
  const [r2, setR2] = useState<number>(220);
  const [r3, setR3] = useState<number>(470);
  const [inputMode, setInputMode] = useState<"dropdown" | "input">("dropdown");
  const [customR1, setCustomR1] = useState("100");
  const [customR2, setCustomR2] = useState("220");
  const [customR3, setCustomR3] = useState("470");
  const usedRef = useRef(false);

  const eff1 = inputMode === "input" ? (parseFloat(customR1) || 0) : r1;
  const eff2 = inputMode === "input" ? (parseFloat(customR2) || 0) : r2;
  const eff3 = inputMode === "input" ? (parseFloat(customR3) || 0) : r3;

  const rTotal = eff1 + eff2 + eff3;
  const currentAt9V = rTotal > 0 ? (9 / rTotal) * 1000 : 0;
  const powerAt9V = rTotal > 0 ? (81 / rTotal) * 1000 : 0; // P = V²/R in mW

  const handleInteract = () => {
    if (!usedRef.current) {
      usedRef.current = true;
      onResistanceCalcUsed();
    }
  };

  const formatOhm = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}kΩ` : `${v}Ω`;

  const resistors = [
    { label: "R1", val: eff1, color: "#F97316", setDrop: setR1, setInput: setCustomR1, dropVal: r1, inputVal: customR1 },
    { label: "R2", val: eff2, color: "#10B981", setDrop: setR2, setInput: setCustomR2, dropVal: r2, inputVal: customR2 },
    { label: "R3", val: eff3, color: "#0EA5E9", setDrop: setR3, setInput: setCustomR3, dropVal: r3, inputVal: customR3 },
  ];

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}
            >
              4
            </div>
            <h2 className="text-xl font-black" style={{ color: "#F0F0F5" }}>
              Series Resistance Calculator
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(249,115,22,0.1)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
            >
              +20 XP
            </span>
          </div>
          <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.5)" }}>
            Choose resistor values and see the total resistance, current, and power.
          </p>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-5">
            {(["dropdown", "input"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setInputMode(m); handleInteract(); }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: inputMode === m ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)",
                  border: inputMode === m ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  color: inputMode === m ? "#F97316" : "rgba(240,240,245,0.5)",
                }}
              >
                {m === "dropdown" ? "Common Values" : "Custom Input"}
              </button>
            ))}
          </div>

          {/* Resistor inputs */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {resistors.map((res) => (
              <div key={res.label}>
                <label className="text-xs font-bold mb-2 block" style={{ color: res.color }}>
                  {res.label}
                </label>
                {inputMode === "dropdown" ? (
                  <select
                    value={res.dropVal}
                    onChange={(e) => { res.setDrop(Number(e.target.value)); handleInteract(); }}
                    className="w-full px-3 py-2 rounded-xl text-sm font-mono"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${res.color}30`,
                      color: res.color,
                      outline: "none",
                    }}
                  >
                    {COMMON_VALUES.map((v) => (
                      <option key={v} value={v} style={{ background: "#0a0a12" }}>
                        {formatOhm(v)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={res.inputVal}
                      onChange={(e) => { res.setInput(e.target.value); handleInteract(); }}
                      className="w-full px-3 py-2 rounded-xl text-sm font-mono pr-8"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: `1px solid ${res.color}30`,
                        color: res.color,
                        outline: "none",
                      }}
                    />
                    <span
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: "rgba(240,240,245,0.3)" }}
                    >
                      Ω
                    </span>
                  </div>
                )}

                {/* Resistor visual */}
                <div className="mt-2 flex justify-center">
                  <ResistorSymbol
                    value={inputMode === "dropdown" ? res.dropVal : (COMMON_VALUES.includes(res.val) ? res.val : 100)}
                    color={res.color}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Series resistor diagram */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: "rgba(5,5,7,0.5)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs font-mono text-center mb-3" style={{ color: "rgba(240,240,245,0.3)" }}>
              SERIES CONNECTION
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {resistors.map((res, i) => (
                <div key={res.label} className="flex items-center gap-2">
                  <div
                    className="px-3 py-2 rounded-lg text-xs font-bold text-center"
                    style={{
                      background: `${res.color}12`,
                      border: `1px solid ${res.color}30`,
                      color: res.color,
                      minWidth: 60,
                    }}
                  >
                    <div className="font-mono text-xs">{res.label}</div>
                    <div className="font-black text-sm">{formatOhm(res.val)}</div>
                  </div>
                  {i < 2 && (
                    <span style={{ color: "rgba(249,115,22,0.5)", fontSize: 18 }}>+</span>
                  )}
                </div>
              ))}
              <span style={{ color: "rgba(249,115,22,0.5)", fontSize: 20 }}>=</span>
              <div
                className="px-3 py-2 rounded-lg text-center"
                style={{ background: "rgba(249,115,22,0.1)", border: "1.5px solid #F97316", minWidth: 70 }}
              >
                <div className="text-xs font-mono" style={{ color: "rgba(249,115,22,0.6)" }}>R_total</div>
                <div className="font-black text-base" style={{ color: "#F97316" }}>{formatOhm(rTotal)}</div>
              </div>
            </div>

            {/* Formula */}
            <div className="mt-3 text-center">
              <code className="text-xs" style={{ color: "rgba(240,240,245,0.35)" }}>
                R_total = R₁ + R₂ + R₃ = {eff1} + {eff2} + {eff3} = {rTotal} Ω
              </code>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.2)" }}
            >
              <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Total Resistance</div>
              <div className="text-xl font-black" style={{ color: "#F97316" }}>{formatOhm(rTotal)}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>R₁+R₂+R₃</div>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Current @ 9V</div>
              <div className="text-xl font-black" style={{ color: "#10B981" }}>
                {currentAt9V < 1 ? `${(currentAt9V * 1000).toFixed(2)}µA` : `${currentAt9V.toFixed(2)}mA`}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>I=9÷{rTotal}Ω</div>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(14,165,233,0.07)", border: "1px solid rgba(14,165,233,0.2)" }}
            >
              <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Power @ 9V</div>
              <div className="text-xl font-black" style={{ color: "#0EA5E9" }}>
                {powerAt9V >= 1000 ? `${(powerAt9V / 1000).toFixed(2)}W` : `${powerAt9V.toFixed(1)}mW`}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>P=81÷{rTotal}Ω</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
