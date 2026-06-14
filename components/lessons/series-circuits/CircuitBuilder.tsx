"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface CircuitBuilderProps {
  onBuilderUsed: () => void;
}

const VOLTAGES = [3, 5, 9, 12];
const LED_COUNTS = [1, 2, 3];
const RESISTORS = [100, 220, 470, 1000];
const LED_VF = 2.0; // red LED forward voltage
const LED_IF_TARGET = 20; // mA

export default function CircuitBuilder({ onBuilderUsed }: CircuitBuilderProps) {
  const [voltage, setVoltage] = useState(9);
  const [ledCount, setLedCount] = useState(2);
  const [resistor, setResistor] = useState(220);
  const usedRef = useRef(false);

  const totalLedVoltage = ledCount * LED_VF;
  const vResistor = voltage - totalLedVoltage;
  const currentMa = vResistor > 0 ? (vResistor / resistor) * 1000 : 0;
  const brightness = Math.min(100, Math.max(0, (currentMa / LED_IF_TARGET) * 100));

  let warning = "";
  let warningType: "danger" | "dim" | null = null;
  if (currentMa > 30) {
    warning = "⚠️ Current too high (>30mA) — LED may overheat and burn out!";
    warningType = "danger";
  } else if (currentMa < 1 && vResistor > 0) {
    warning = "⚠️ Current too low (<1mA) — LED will barely glow or not light at all.";
    warningType = "dim";
  } else if (vResistor <= 0) {
    warning = "⚠️ Battery voltage too low to forward-bias the LED(s). No current flows.";
    warningType = "danger";
  }

  const handleInteract = () => {
    if (!usedRef.current) {
      usedRef.current = true;
      onBuilderUsed();
    }
  };

  const ledColor =
    warningType === "danger"
      ? "#ef4444"
      : warningType === "dim"
      ? "rgba(249,115,22,0.15)"
      : `rgba(249,115,22,${0.3 + brightness * 0.007})`;

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}
            >
              1
            </div>
            <h2 className="text-xl font-black" style={{ color: "#F0F0F5" }}>
              Series Circuit Builder
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(249,115,22,0.1)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
            >
              +25 XP
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
            Configure the circuit and see exactly how voltage, current, and LED brightness change.
          </p>

          {/* Controls */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6" onClick={handleInteract}>
            {/* Battery voltage */}
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: "rgba(249,115,22,0.8)" }}>
                Battery Voltage
              </label>
              <div className="flex gap-2 flex-wrap">
                {VOLTAGES.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setVoltage(v); handleInteract(); }}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: voltage === v ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)",
                      border: voltage === v ? "1.5px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                      color: voltage === v ? "#F97316" : "rgba(240,240,245,0.6)",
                    }}
                  >
                    {v}V
                  </button>
                ))}
              </div>
            </div>

            {/* Number of LEDs */}
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: "rgba(249,115,22,0.8)" }}>
                Number of LEDs
              </label>
              <div className="flex gap-2">
                {LED_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setLedCount(n); handleInteract(); }}
                    className="w-10 h-9 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: ledCount === n ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)",
                      border: ledCount === n ? "1.5px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                      color: ledCount === n ? "#F97316" : "rgba(240,240,245,0.6)",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Resistor */}
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: "rgba(249,115,22,0.8)" }}>
                Resistor Value
              </label>
              <div className="flex gap-2 flex-wrap">
                {RESISTORS.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setResistor(r); handleInteract(); }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: resistor === r ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)",
                      border: resistor === r ? "1.5px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                      color: resistor === r ? "#F97316" : "rgba(240,240,245,0.6)",
                    }}
                  >
                    {r >= 1000 ? `${r / 1000}kΩ` : `${r}Ω`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Circuit Diagram */}
          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: "rgba(5,5,7,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs text-center font-mono mb-3" style={{ color: "rgba(240,240,245,0.3)" }}>
              CIRCUIT DIAGRAM
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Battery */}
              <div
                className="px-3 py-2 rounded-xl text-xs font-bold text-center"
                style={{
                  background: "rgba(249,115,22,0.12)",
                  border: "1.5px solid #F97316",
                  color: "#F97316",
                  minWidth: 52,
                }}
              >
                🔋
                <div style={{ fontSize: 9 }}>{voltage}V</div>
              </div>

              <div style={{ color: "rgba(249,115,22,0.5)", fontSize: 18 }}>→</div>

              {/* Resistor */}
              <div
                className="px-3 py-2 rounded-xl text-xs font-bold text-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(240,240,245,0.7)",
                  minWidth: 52,
                }}
              >
                ⊟⊟⊟
                <div style={{ fontSize: 9 }}>{resistor >= 1000 ? `${resistor / 1000}kΩ` : `${resistor}Ω`}</div>
              </div>

              <div style={{ color: "rgba(249,115,22,0.5)", fontSize: 18 }}>→</div>

              {/* LEDs */}
              {Array.from({ length: ledCount }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="px-3 py-2 rounded-xl text-xs font-bold text-center transition-all duration-300"
                    style={{
                      background: ledColor,
                      border: `1.5px solid ${warningType === "danger" ? "#ef4444" : "#F97316"}`,
                      color: warningType === "danger" ? "#ef4444" : "#F97316",
                      minWidth: 48,
                      boxShadow: !warningType && brightness > 10 ? `0 0 ${Math.round(brightness / 5)}px rgba(249,115,22,0.4)` : "none",
                    }}
                  >
                    💡
                    <div style={{ fontSize: 9 }}>LED{idx + 1}</div>
                  </div>
                  {idx < ledCount - 1 && (
                    <div style={{ color: "rgba(249,115,22,0.5)", fontSize: 18 }}>→</div>
                  )}
                </div>
              ))}

              <div style={{ color: "rgba(249,115,22,0.5)", fontSize: 18 }}>↵</div>
            </div>
          </div>

          {/* Warning */}
          {warning && (
            <div
              className="rounded-xl p-3 mb-4 text-sm font-semibold"
              style={{
                background: warningType === "danger" ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)",
                border: `1px solid ${warningType === "danger" ? "rgba(239,68,68,0.3)" : "rgba(234,179,8,0.3)"}`,
                color: warningType === "danger" ? "#ef4444" : "#eab308",
              }}
            >
              {warning}
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total Resistance",
                value: `${resistor} Ω`,
                sub: `R1 only`,
                color: "#F97316",
              },
              {
                label: "Circuit Current",
                value: currentMa > 0 ? `${currentMa.toFixed(1)} mA` : "0 mA",
                sub: `I = V_r / R`,
                color: "#10B981",
              },
              {
                label: "V across R1",
                value: vResistor > 0 ? `${vResistor.toFixed(2)} V` : "0 V",
                sub: `${voltage}V − ${totalLedVoltage}V`,
                color: "#0EA5E9",
              },
              {
                label: "V per LED",
                value: `${LED_VF.toFixed(1)} V`,
                sub: `forward bias`,
                color: "#A78BFA",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${item.color}20` }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>
                  {item.label}
                </div>
                <div className="text-lg font-black" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Brightness bar */}
          {!warningType && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(240,240,245,0.4)" }}>
                <span>LED Brightness</span>
                <span style={{ color: "#F97316" }}>{Math.round(brightness)}% of ideal</span>
              </div>
              <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #F97316, #FDBA74)" }}
                  animate={{ width: `${brightness}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
