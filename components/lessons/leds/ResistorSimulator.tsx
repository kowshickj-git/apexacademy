"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onResistorUsed: () => void; }

const LED_COLORS = [
  { name: "Red", vf: 2.0, color: "#EF4444", glow: "rgba(239,68,68,0.8)" },
  { name: "Yellow", vf: 2.1, color: "#EAB308", glow: "rgba(234,179,8,0.8)" },
  { name: "Green", vf: 2.2, color: "#10B981", glow: "rgba(16,185,129,0.8)" },
  { name: "Blue", vf: 3.2, color: "#0EA5E9", glow: "rgba(14,165,233,0.8)" },
  { name: "White", vf: 3.4, color: "#F9FAFB", glow: "rgba(249,250,251,0.8)" },
];

export default function ResistorSimulator({ onResistorUsed }: Props) {
  const [supply, setSupply] = useState(5);
  const [resistance, setResistance] = useState(220);
  const [ledIndex, setLedIndex] = useState(0);
  const [used, setUsed] = useState(false);

  const led = LED_COLORS[ledIndex];
  const vf = led.vf;
  const vResistor = Math.max(0, supply - vf);
  const current_mA = resistance > 0 ? (vResistor / resistance) * 1000 : 0;
  const isSafe = current_mA <= 25 && current_mA > 0.5;
  const isBurnout = current_mA > 25;
  const idealR = Math.ceil(vResistor / 0.02);
  const brightness = Math.min(1, Math.max(0, current_mA / 20));

  const handle = () => {
    if (!used) { setUsed(true); onResistorUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9 · Simulator 2</p>
        <h2 className="text-xl font-bold mb-1">LED Resistor Calculator</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Pick your LED color, supply voltage, and resistor value. The simulator shows you the resulting current and LED brightness in real time.
        </p>

        {/* LED color selector */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {LED_COLORS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => { setLedIndex(i); handle(); }}
              className="flex-1 min-w-[4rem] py-2 rounded-xl border text-xs font-bold transition-all"
              style={ledIndex === i
                ? { background: `${c.color}20`, borderColor: `${c.color}55`, color: c.color }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {c.name}
              <div className="text-[9px] text-current opacity-60 font-normal mt-0.5">Vf={c.vf}V</div>
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div className="space-y-4 mb-5">
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>🔋 Supply Voltage</span>
              <span className="font-mono text-yellow-400">{supply}V</span>
            </div>
            <input
              type="range" min={3} max={12} step={0.5} value={supply}
              onChange={(e) => { setSupply(Number(e.target.value)); handle(); }}
              className="w-full"
              style={{ background: `linear-gradient(to right, #EAB308 ${((supply - 3) / 9) * 100}%, rgba(255,255,255,0.08) ${((supply - 3) / 9) * 100}%)` }}
            />
            <div className="flex justify-between text-[9px] text-white/20 mt-0.5 font-mono"><span>3V</span><span>12V</span></div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>🚧 Resistor Value</span>
              <span className="font-mono text-orange-400">{resistance}Ω</span>
            </div>
            <input
              type="range" min={10} max={2000} step={10} value={resistance}
              onChange={(e) => { setResistance(Number(e.target.value)); handle(); }}
              className="w-full slider-orange"
              style={{ background: `linear-gradient(to right, #F97316 ${(resistance / 2000) * 100}%, rgba(255,255,255,0.08) ${(resistance / 2000) * 100}%)` }}
            />
            <div className="flex justify-between text-[9px] text-white/20 mt-0.5 font-mono"><span>10Ω</span><span>2kΩ</span></div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border p-5 mb-4" style={{
          borderColor: isBurnout ? "rgba(239,68,68,0.4)" : isSafe ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)",
          background: isBurnout ? "rgba(239,68,68,0.06)" : isSafe ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)",
        }}>
          <div className="flex items-center gap-6">
            {/* LED visual */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className="w-16 h-16 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                style={{
                  borderColor: isBurnout ? "#EF4444" : led.color,
                  background: isBurnout ? "rgba(0,0,0,0.6)" : `${led.color}${Math.round(brightness * 150).toString(16).padStart(2, "0")}`,
                  boxShadow: isBurnout ? "none" : brightness > 0.05 ? `0 0 ${brightness * 30}px ${led.glow}` : "none",
                }}
              >
                {isBurnout && <span className="text-2xl">💥</span>}
              </div>
              <p className="text-[9px] font-mono" style={{ color: led.color }}>{led.name} LED</p>
            </div>

            {/* Numbers */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/35">Voltage across resistor</span>
                <span className="text-xs font-mono text-orange-400">{vResistor.toFixed(2)}V</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/35">Current (I = V/R)</span>
                <span className="text-xs font-mono font-bold" style={{ color: isBurnout ? "#EF4444" : isSafe ? "#10B981" : "rgba(255,255,255,0.4)" }}>
                  {current_mA.toFixed(1)}mA
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (current_mA / 25) * 100)}%`,
                    background: isBurnout ? "#EF4444" : isSafe ? led.color : "#F97316",
                  }}
                />
              </div>
              <div className="text-[9px] text-white/20 flex justify-between font-mono">
                <span>0mA (off)</span>
                <span className={current_mA >= 10 && current_mA <= 20 ? "text-primary" : ""}>10–20mA (safe)</span>
                <span className={isBurnout ? "text-red-400" : ""}>25mA (danger)</span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isBurnout ? "burn" : isSafe ? "safe" : "low"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-xs font-semibold"
              style={{ color: isBurnout ? "#EF4444" : isSafe ? "#10B981" : "rgba(255,255,255,0.35)" }}
            >
              {isBurnout
                ? `💥 Burnout! ${current_mA.toFixed(0)}mA exceeds safe limit. Try adding resistance.`
                : isSafe
                ? `✅ Safe operation! ${current_mA.toFixed(1)}mA — LED is happy`
                : current_mA <= 0.5
                ? `⚫ No light — voltage too low for forward bias (need >${vf}V)`
                : `🔅 Too dim — only ${current_mA.toFixed(1)}mA. Reduce resistance for brighter light.`
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ideal resistor hint */}
        {supply > vf && (
          <div className="p-3 rounded-xl border border-primary/15 text-center" style={{ background: "rgba(16,185,129,0.05)" }}>
            <p className="text-[10px] text-white/30 font-mono mb-1">IDEAL RESISTOR FOR 20mA</p>
            <p className="text-sm font-mono font-bold text-primary">R = ({supply} − {vf}) / 0.02 = {idealR}Ω</p>
            <p className="text-[10px] text-white/25 mt-0.5">→ Use nearest standard value: {idealR <= 100 ? "100Ω" : idealR <= 150 ? "150Ω" : idealR <= 220 ? "220Ω" : idealR <= 330 ? "330Ω" : idealR <= 470 ? "470Ω" : "1kΩ"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
