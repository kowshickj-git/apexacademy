"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onSimUsed: () => void; }

const DIGIT_COLORS = [
  { name: "Black",  hex: "#000000", textHex: "#888", val: 0 },
  { name: "Brown",  hex: "#8B4513", textHex: "#CD853F", val: 1 },
  { name: "Red",    hex: "#EF4444", textHex: "#EF4444", val: 2 },
  { name: "Orange", hex: "#F97316", textHex: "#F97316", val: 3 },
  { name: "Yellow", hex: "#EAB308", textHex: "#EAB308", val: 4 },
  { name: "Green",  hex: "#22C55E", textHex: "#22C55E", val: 5 },
  { name: "Blue",   hex: "#3B82F6", textHex: "#3B82F6", val: 6 },
  { name: "Violet", hex: "#A855F7", textHex: "#A855F7", val: 7 },
  { name: "Grey",   hex: "#6B7280", textHex: "#9CA3AF", val: 8 },
  { name: "White",  hex: "#F9FAFB", textHex: "#E5E7EB", val: 9 },
];

const MULT_COLORS = [
  { name: "Black",  hex: "#000000", textHex: "#888", mult: 1,     label: "×1" },
  { name: "Brown",  hex: "#8B4513", textHex: "#CD853F", mult: 10,    label: "×10" },
  { name: "Red",    hex: "#EF4444", textHex: "#EF4444", mult: 100,   label: "×100" },
  { name: "Orange", hex: "#F97316", textHex: "#F97316", mult: 1000,  label: "×1K" },
  { name: "Yellow", hex: "#EAB308", textHex: "#EAB308", mult: 10000, label: "×10K" },
  { name: "Green",  hex: "#22C55E", textHex: "#22C55E", mult: 100000,label: "×100K" },
  { name: "Blue",   hex: "#3B82F6", textHex: "#3B82F6", mult: 1000000,label:"×1M" },
  { name: "Gold",   hex: "#FFD700", textHex: "#FFD700", mult: 0.1,   label: "×0.1" },
  { name: "Silver", hex: "#9CA3AF", textHex: "#D1D5DB", mult: 0.01,  label: "×0.01" },
];

const TOL_COLORS = [
  { name: "Brown",  hex: "#8B4513", textHex: "#CD853F", tol: "±1%" },
  { name: "Red",    hex: "#EF4444", textHex: "#EF4444", tol: "±2%" },
  { name: "Gold",   hex: "#FFD700", textHex: "#FFD700", tol: "±5%" },
  { name: "Silver", hex: "#9CA3AF", textHex: "#D1D5DB", tol: "±10%" },
];

function formatOhms(val: number) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 2)}MΩ`;
  if (val >= 1000)    return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 2)}KΩ`;
  return `${val}Ω`;
}

type BandPicker = "b1" | "b2" | "b3" | "b4" | null;

export default function ColorCodes({ onSimUsed }: Props) {
  const [b1, setB1] = useState(2); // Red
  const [b2, setB2] = useState(2); // Red
  const [b3, setB3] = useState(1); // Brown ×10
  const [b4, setB4] = useState(2); // Gold (index in TOL)
  const [activePicker, setActivePicker] = useState<BandPicker>(null);
  const [used, setUsed] = useState(false);

  const value = (DIGIT_COLORS[b1].val * 10 + DIGIT_COLORS[b2].val) * MULT_COLORS[b3].mult;
  const tolerance = TOL_COLORS[b4].tol;

  const handleInteract = () => {
    if (!used) { setUsed(true); onSimUsed(); }
  };

  const bandColors = [DIGIT_COLORS[b1].hex, DIGIT_COLORS[b2].hex, MULT_COLORS[b3].hex, TOL_COLORS[b4].hex];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 8 · Interactive</p>
        <h2 className="text-xl font-bold mb-1">Resistor Color Code Calculator</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Every resistor has colored bands that encode its value. Click any band to change its color and see the value update instantly.
        </p>

        {/* Resistor visual */}
        <div className="flex items-center justify-center gap-3 mb-6 py-6">
          {/* Left wire */}
          <div className="w-10 h-0.5 bg-white/20 rounded" />

          {/* Resistor body */}
          <div
            className="relative w-44 h-10 rounded-full border border-white/10 flex items-center justify-evenly px-3 cursor-pointer select-none"
            style={{ background: "#D2B48C" }}
          >
            {bandColors.map((hex, i) => (
              <motion.div
                key={i}
                whileHover={{ scaleY: 1.15 }}
                onClick={() => { setActivePicker(activePicker === (["b1","b2","b3","b4"][i] as BandPicker) ? null : (["b1","b2","b3","b4"][i] as BandPicker)); handleInteract(); }}
                className="w-4 h-full rounded-sm cursor-pointer relative"
                style={{ background: hex, boxShadow: activePicker === ["b1","b2","b3","b4"][i] ? `0 0 0 2px white` : "none" }}
              />
            ))}
          </div>

          {/* Right wire */}
          <div className="w-10 h-0.5 bg-white/20 rounded" />
        </div>

        {/* Band labels */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center text-[10px] text-white/30">
          <div>1st Digit<br /><span className="font-bold" style={{ color: DIGIT_COLORS[b1].textHex }}>{DIGIT_COLORS[b1].val}</span></div>
          <div>2nd Digit<br /><span className="font-bold" style={{ color: DIGIT_COLORS[b2].textHex }}>{DIGIT_COLORS[b2].val}</span></div>
          <div>Multiplier<br /><span className="font-bold" style={{ color: MULT_COLORS[b3].textHex }}>{MULT_COLORS[b3].label}</span></div>
          <div>Tolerance<br /><span className="font-bold" style={{ color: TOL_COLORS[b4].textHex }}>{TOL_COLORS[b4].tol}</span></div>
        </div>

        {/* Color pickers */}
        <AnimatePresence mode="wait">
          {activePicker && (
            <motion.div
              key={activePicker}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div
                className="rounded-2xl border border-white/8 p-4"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <p className="text-[10px] text-white/30 mb-3 font-mono uppercase tracking-widest">
                  {activePicker === "b1" ? "Band 1 — 1st Digit" : activePicker === "b2" ? "Band 2 — 2nd Digit" : activePicker === "b3" ? "Band 3 — Multiplier" : "Band 4 — Tolerance"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(activePicker === "b4" ? TOL_COLORS : activePicker === "b3" ? MULT_COLORS : DIGIT_COLORS).map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        if (activePicker === "b1") setB1(i);
                        else if (activePicker === "b2") setB2(i);
                        else if (activePicker === "b3") setB3(i);
                        else setB4(i);
                        setActivePicker(null);
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl border border-white/5 hover:border-white/15 transition-all group"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <div
                        className="w-6 h-6 rounded border border-white/10"
                        style={{ background: c.hex }}
                      />
                      <span className="text-[9px] text-white/40 group-hover:text-white/60">{c.name}</span>
                      <span className="text-[8px] font-mono" style={{ color: c.textHex }}>
                        {"val" in c ? c.val : "label" in c ? c.label : c.tol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <motion.div
          key={value + tolerance}
          initial={{ scale: 0.96, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-2xl border text-center"
          style={{ background: "rgba(16,185,129,0.07)", borderColor: "rgba(16,185,129,0.25)" }}
        >
          <p className="text-4xl font-black tracking-tight text-primary mb-1 font-mono">{formatOhms(value)}</p>
          <p className="text-sm text-white/45">{tolerance} tolerance</p>
          <p className="text-xs text-white/25 mt-2 font-mono">
            = ({DIGIT_COLORS[b1].val} × 10 + {DIGIT_COLORS[b2].val}) × {MULT_COLORS[b3].mult} = {value}Ω
          </p>
        </motion.div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Red Red Brown Gold", bands: [2,2,1,2], result: "220Ω ±5%", note: "Most common LED resistor" },
            { label: "Orange Orange Orange Gold", bands: [3,3,2,2], result: "33KΩ ±5%", note: "Pull-up / bias" },
          ].map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setB1(ex.bands[0]); setB2(ex.bands[1]); setB3(ex.bands[2]); setB4(ex.bands[3]); setActivePicker(null); handleInteract(); }}
              className="p-3 rounded-xl border border-white/8 text-left hover:border-primary/30 hover:bg-primary/5 transition-all"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex gap-0.5 mb-1.5">
                {[DIGIT_COLORS[ex.bands[0]].hex, DIGIT_COLORS[ex.bands[1]].hex, MULT_COLORS[ex.bands[2]].hex, TOL_COLORS[ex.bands[3]].hex].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
                ))}
              </div>
              <p className="text-xs font-bold text-primary">{ex.result}</p>
              <p className="text-[10px] text-white/30">{ex.note}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
