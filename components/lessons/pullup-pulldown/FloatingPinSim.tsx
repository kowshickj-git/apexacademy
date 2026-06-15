"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onFloatingUsed: () => void;
}

export default function FloatingPinSim({ onFloatingUsed }: Props) {
  const [mode, setMode] = useState<"floating" | "pullup">("floating");
  const [voltage, setVoltage] = useState(1.65);
  const [ledOn, setLedOn] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleInteraction = useCallback(() => {
    if (!triggered) {
      setTriggered(true);
      onFloatingUsed();
    }
  }, [triggered, onFloatingUsed]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (mode === "floating") {
      intervalRef.current = setInterval(() => {
        const v = Math.random() * 3.3;
        setVoltage(v);
        setLedOn(v > 1.65 ? Math.random() > 0.3 : Math.random() > 0.7);
      }, 200);
    } else {
      setVoltage(3.3);
      setLedOn(false); // pull-up: LED off by default (pin HIGH, active-low)
    }

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [mode]);

  const handleModeChange = (m: "floating" | "pullup") => {
    setMode(m);
    handleInteraction();
  };

  const voltageColor = mode === "floating"
    ? voltage > 2.2 ? "#10B981" : voltage > 1.1 ? "#F59E0B" : "#EF4444"
    : "#10B981";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 1 · Floating Pin
        </p>
        <h2 className="text-xl font-bold mb-1">The Chaos of a Floating Pin</h2>
        <p className="text-sm text-white/45 mb-6">
          Watch what happens to the voltage reading when a pin has no pull resistor.
        </p>

        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(0,0,0,0.25)" }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/30">DIGITAL PIN 2 — VOLTAGE MONITOR</span>
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: mode === "floating" ? [1, 0.3, 1] : 1 }}
                transition={{ duration: 0.4, repeat: mode === "floating" ? Infinity : 0 }}
                className="w-2 h-2 rounded-full"
                style={{ background: mode === "floating" ? "#EF4444" : "#10B981" }}
              />
              <span className="text-[10px] font-mono" style={{ color: mode === "floating" ? "#EF4444" : "#10B981" }}>
                {mode === "floating" ? "FLOATING" : "STABLE"}
              </span>
            </div>
          </div>

          <div className="p-5">
            {/* Voltage display */}
            <div className="flex items-center justify-center mb-5">
              <div className="text-center">
                <p className="text-[10px] font-mono text-white/25 mb-1">V_PIN</p>
                <motion.p
                  key={voltage.toFixed(2)}
                  initial={{ scale: mode === "floating" ? 1.05 : 1 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-black font-mono tabular-nums"
                  style={{ color: voltageColor }}
                >
                  {voltage.toFixed(2)}
                  <span className="text-xl font-bold text-white/30 ml-1">V</span>
                </motion.p>
                <p className="text-[10px] font-mono mt-1" style={{ color: voltageColor }}>
                  {mode === "floating"
                    ? voltage > 2.2 ? "↑ HIGH (maybe)" : voltage > 1.1 ? "? UNDEFINED" : "↓ LOW (maybe)"
                    : "↑ HIGH (stable)"}
                </p>
              </div>
            </div>

            {/* LED indicator */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="text-xs text-white/40">Connected LED:</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${ledOn}-${mode}`}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm"
                  style={{
                    background: ledOn ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.04)",
                    borderColor: ledOn ? "#10B981" : "rgba(255,255,255,0.15)",
                    boxShadow: ledOn ? "0 0 16px rgba(16,185,129,0.5)" : "none",
                  }}
                >
                  {ledOn ? "●" : "○"}
                </motion.div>
              </AnimatePresence>
              <span className="text-xs font-mono" style={{ color: ledOn ? "#10B981" : "rgba(255,255,255,0.3)" }}>
                {mode === "floating" ? (ledOn ? "ON (noise)" : "OFF (noise)") : "OFF (stable)"}
              </span>
            </div>

            {/* Warning / info */}
            <AnimatePresence mode="wait">
              {mode === "floating" && (
                <motion.div
                  key="warning"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 rounded-xl border mb-4 text-center"
                  style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}
                >
                  <p className="text-xs text-red-400 font-semibold">The MCU cannot reliably determine if button is pressed!</p>
                  <p className="text-[10px] text-red-400/60 mt-0.5">Random noise is driving the input pin.</p>
                </motion.div>
              )}
              {mode === "pullup" && (
                <motion.div
                  key="stable"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 rounded-xl border mb-4 text-center"
                  style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.25)" }}
                >
                  <p className="text-xs font-semibold" style={{ color: "#10B981" }}>Pull-up connected — pin is stable at 3.3V!</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(16,185,129,0.6)" }}>Press button to read LOW. Release to read HIGH.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => handleModeChange("floating")}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
                style={{
                  background: mode === "floating" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: mode === "floating" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)",
                  color: mode === "floating" ? "#EF4444" : "rgba(255,255,255,0.4)",
                }}
              >
                No Resistor
              </button>
              <button
                onClick={() => handleModeChange("pullup")}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
                style={{
                  background: mode === "pullup" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: mode === "pullup" ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)",
                  color: mode === "pullup" ? "#10B981" : "rgba(255,255,255,0.4)",
                }}
              >
                Connect Pull-Up
              </button>
            </div>
          </div>
        </div>

        {triggered && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-xs text-center font-mono"
            style={{ color: "#F59E0B" }}
          >
            +15 XP — Floating vs stable observed!
          </motion.p>
        )}
      </div>
    </section>
  );
}
