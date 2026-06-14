"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface VoltageDropSimProps {
  onVoltageDropUsed: () => void;
}

export default function VoltageDropSim({ onVoltageDropUsed }: VoltageDropSimProps) {
  const [battV, setBattV] = useState(12);
  const [r1, setR1] = useState(300);
  const [r2, setR2] = useState(500);
  const [r3, setR3] = useState(200);
  const usedRef = useRef(false);

  const rTotal = r1 + r2 + r3;
  const current = battV / rTotal; // Amps
  const currentMa = current * 1000;
  const vr1 = current * r1;
  const vr2 = current * r2;
  const vr3 = current * r3;
  const vSum = vr1 + vr2 + vr3;
  const checksOut = Math.abs(vSum - battV) < 0.001;

  const pct1 = (vr1 / battV) * 100;
  const pct2 = (vr2 / battV) * 100;
  const pct3 = (vr3 / battV) * 100;

  const handleInteract = () => {
    if (!usedRef.current) {
      usedRef.current = true;
      onVoltageDropUsed();
    }
  };

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
              2
            </div>
            <h2 className="text-xl font-black" style={{ color: "#F0F0F5" }}>
              Voltage Drop Simulator
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(249,115,22,0.1)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
            >
              +25 XP
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
            Adjust resistor values and see exactly how voltage distributes across each component.
          </p>

          {/* Sliders */}
          <div className="grid sm:grid-cols-2 gap-5 mb-6" onChange={handleInteract}>
            {/* Battery voltage */}
            <div className="sm:col-span-2">
              <div className="flex justify-between text-xs mb-1.5">
                <label style={{ color: "rgba(249,115,22,0.8)", fontWeight: 700 }}>Battery Voltage</label>
                <span style={{ color: "#F97316", fontWeight: 700 }}>{battV} V</span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                value={battV}
                onChange={(e) => { setBattV(Number(e.target.value)); handleInteract(); }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#F97316" }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(240,240,245,0.25)" }}>
                <span>1V</span><span>24V</span>
              </div>
            </div>

            {/* R1 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label style={{ color: "#F97316", fontWeight: 700 }}>R1</label>
                <span style={{ color: "#F97316", fontWeight: 700 }}>{r1} Ω</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={10}
                value={r1}
                onChange={(e) => { setR1(Number(e.target.value)); handleInteract(); }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#F97316" }}
              />
            </div>

            {/* R2 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label style={{ color: "#10B981", fontWeight: 700 }}>R2</label>
                <span style={{ color: "#10B981", fontWeight: 700 }}>{r2} Ω</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={10}
                value={r2}
                onChange={(e) => { setR2(Number(e.target.value)); handleInteract(); }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#10B981" }}
              />
            </div>

            {/* R3 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label style={{ color: "#0EA5E9", fontWeight: 700 }}>R3</label>
                <span style={{ color: "#0EA5E9", fontWeight: 700 }}>{r3} Ω</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={10}
                value={r3}
                onChange={(e) => { setR3(Number(e.target.value)); handleInteract(); }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#0EA5E9" }}
              />
            </div>
          </div>

          {/* Voltage distribution bar */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: "rgba(5,5,7,0.5)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs font-mono mb-3 text-center" style={{ color: "rgba(240,240,245,0.3)" }}>
              VOLTAGE DISTRIBUTION ACROSS {battV}V
            </p>
            <div className="flex h-10 rounded-xl overflow-hidden mb-3">
              <motion.div
                className="flex items-center justify-center text-xs font-black"
                style={{ background: "rgba(249,115,22,0.7)", color: "#fff" }}
                animate={{ width: `${pct1}%` }}
                transition={{ duration: 0.3 }}
              >
                {pct1 > 12 ? `${vr1.toFixed(1)}V` : ""}
              </motion.div>
              <motion.div
                className="flex items-center justify-center text-xs font-black"
                style={{ background: "rgba(16,185,129,0.7)", color: "#fff" }}
                animate={{ width: `${pct2}%` }}
                transition={{ duration: 0.3 }}
              >
                {pct2 > 12 ? `${vr2.toFixed(1)}V` : ""}
              </motion.div>
              <motion.div
                className="flex items-center justify-center text-xs font-black"
                style={{ background: "rgba(14,165,233,0.7)", color: "#fff" }}
                animate={{ width: `${pct3}%` }}
                transition={{ duration: 0.3 }}
              >
                {pct3 > 12 ? `${vr3.toFixed(1)}V` : ""}
              </motion.div>
            </div>

            {/* Voltage readouts */}
            <div className="flex justify-around text-center">
              {[
                { label: "R1", v: vr1, color: "#F97316" },
                { label: "R2", v: vr2, color: "#10B981" },
                { label: "R3", v: vr3, color: "#0EA5E9" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-xs mb-0.5" style={{ color: "rgba(240,240,245,0.35)" }}>{item.label}</div>
                  <div className="text-lg font-black" style={{ color: item.color }}>
                    {item.v.toFixed(2)}V
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KVL check + current */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4"
              style={{
                background: checksOut ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${checksOut ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}
            >
              <div className="text-xs mb-1 font-semibold" style={{ color: "rgba(240,240,245,0.5)" }}>
                Kirchhoff's Voltage Law Check
              </div>
              <div className="font-mono text-sm" style={{ color: checksOut ? "#10B981" : "#ef4444" }}>
                {vr1.toFixed(2)} + {vr2.toFixed(2)} + {vr3.toFixed(2)} = {vSum.toFixed(2)}V
              </div>
              <div className="text-xs mt-1 font-bold" style={{ color: checksOut ? "#10B981" : "#ef4444" }}>
                {checksOut ? "✓ Verified — sums to battery voltage" : "✗ Error in calculation"}
              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}
            >
              <div className="text-xs mb-1 font-semibold" style={{ color: "rgba(240,240,245,0.5)" }}>
                Circuit Current (same everywhere)
              </div>
              <div className="font-mono text-xl font-black" style={{ color: "#F97316" }}>
                {currentMa.toFixed(2)} mA
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(240,240,245,0.35)" }}>
                I = {battV}V ÷ {rTotal}Ω
              </div>
            </div>
          </div>

          <div
            className="mt-4 p-3 rounded-xl text-xs font-semibold"
            style={{ background: "rgba(249,115,22,0.06)", color: "rgba(249,115,22,0.7)", border: "1px solid rgba(249,115,22,0.12)" }}
          >
            💡 Notice: larger resistors get bigger voltage drops — voltage divides proportionally to resistance.
          </div>
        </div>
      </motion.div>
    </section>
  );
}
