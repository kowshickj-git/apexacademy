"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#F59E0B";

function decodeLogic(diff: number): { label: string; color: string } {
  if (diff >= 0.2) return { label: "Logic 1", color: "#10B981" };
  if (diff <= -0.2) return { label: "Logic 0", color: "#60A5FA" };
  return { label: "Undefined", color: "#EF4444" };
}

export default function DifferentialSim({ onUsed }: Props) {
  const [lineA, setLineA] = useState(2.0);
  const [lineB, setLineB] = useState(-2.0);
  const [noiseApplied, setNoiseApplied] = useState(false);
  const [noiseOffset, setNoiseOffset] = useState(0);
  const [called, setCalled] = useState(false);

  function handleSlider(setter: (v: number) => void, val: number) {
    setter(val);
    if (!called) { setCalled(true); onUsed(); }
  }

  const effA = lineA + noiseOffset;
  const effB = lineB + noiseOffset;
  const diff = parseFloat((effA - effB).toFixed(2));
  const decoded = decodeLogic(diff);

  function toggleNoise() {
    if (!called) { setCalled(true); onUsed(); }
    setNoiseApplied(n => {
      setNoiseOffset(n ? 0 : 3.5);
      return !n;
    });
  }

  function voltBar(v: number, color: string) {
    const pct = ((v + 5) / 10) * 100;
    return (
      <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-300"
          style={{ left: "50%", width: `${Math.abs(pct - 50)}%`, [v >= 0 ? "left" : "right"]: v >= 0 ? "50%" : `${100 - pct}%`, background: color, opacity: 0.7 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-mono font-bold" style={{ color }}>{v >= 0 ? "+" : ""}{v.toFixed(1)}V</span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 05 · Differential Calculator
        </p>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#F0F0F5" }}>Differential Signal Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Set A and B line voltages. Watch the differential calculation in real-time. Then add common noise
          to prove it doesn&apos;t affect the decoded logic.
        </p>

        <div className="rounded-2xl border p-6" style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.15)" }}>
          {/* A line slider */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold" style={{ color: COLOR }}>A Line Voltage</label>
              <span className="text-sm font-mono font-black" style={{ color: COLOR }}>{effA >= 0 ? "+" : ""}{effA.toFixed(1)}V</span>
            </div>
            {voltBar(effA, COLOR)}
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={lineA}
              onChange={e => handleSlider(setLineA, parseFloat(e.target.value))}
              className="w-full mt-2"
              style={{ accentColor: COLOR }}
            />
            <div className="flex justify-between text-[9px] font-mono mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>
              <span>−5V</span><span>0V</span><span>+5V</span>
            </div>
          </div>

          {/* B line slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold" style={{ color: "#60A5FA" }}>B Line Voltage</label>
              <span className="text-sm font-mono font-black" style={{ color: "#60A5FA" }}>{effB >= 0 ? "+" : ""}{effB.toFixed(1)}V</span>
            </div>
            {voltBar(effB, "#60A5FA")}
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={lineB}
              onChange={e => handleSlider(setLineB, parseFloat(e.target.value))}
              className="w-full mt-2"
              style={{ accentColor: "#60A5FA" }}
            />
            <div className="flex justify-between text-[9px] font-mono mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>
              <span>−5V</span><span>0V</span><span>+5V</span>
            </div>
          </div>

          {/* Calculation */}
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-xs font-mono mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>Real-time Calculation</div>
            <div className="flex items-center gap-2 flex-wrap text-sm font-mono">
              <span style={{ color: COLOR }}>A ({effA >= 0 ? "+" : ""}{effA.toFixed(1)}V)</span>
              <span style={{ color: "rgba(240,240,245,0.4)" }}>−</span>
              <span style={{ color: "#60A5FA" }}>B ({effB >= 0 ? "+" : ""}{effB.toFixed(1)}V)</span>
              <span style={{ color: "rgba(240,240,245,0.4)" }}>=</span>
              <span className="font-black text-base" style={{ color: "#F0F0F5" }}>
                {diff >= 0 ? "+" : ""}{diff}V
              </span>
            </div>
          </div>

          {/* Logic decode */}
          <motion.div
            key={decoded.label}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl p-4 mb-4 text-center"
            style={{ background: `${decoded.color}15`, border: `1px solid ${decoded.color}40` }}
          >
            <div className="text-xs font-mono mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Decoded Logic</div>
            <div className="text-2xl font-black" style={{ color: decoded.color }}>{decoded.label}</div>
            <div className="text-xs mt-1" style={{ color: "rgba(240,240,245,0.35)" }}>
              {decoded.label === "Logic 1" ? "A − B ≥ +0.2V" : decoded.label === "Logic 0" ? "A − B ≤ −0.2V" : "−0.2V < A−B < +0.2V (invalid range)"}
            </div>
          </motion.div>

          {/* Noise button */}
          <button
            onClick={toggleNoise}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all"
            style={{
              background: noiseApplied ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${noiseApplied ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.12)"}`,
              color: noiseApplied ? "#EF4444" : "rgba(240,240,245,0.6)",
            }}
          >
            {noiseApplied ? "🔊 Noise ON (+3.5V common-mode) — differential unchanged!" : "Add Common-Mode Noise (+3.5V to both A & B)"}
          </button>

          {noiseApplied && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-xl text-xs"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "rgba(16,185,129,0.9)" }}
            >
              ✓ Both A and B shifted by +3.5V equally. Differential (A−B) = {diff >= 0 ? "+" : ""}{diff}V — unchanged!
              This is common-mode rejection. RS485 is immune to this noise.
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
