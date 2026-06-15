"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface BaseCurrentSimProps {
  onBaseCurrentUsed: () => void;
}

const BETA_OPTIONS = [50, 100, 200, 300];

export default function BaseCurrentSim({ onBaseCurrentUsed }: BaseCurrentSimProps) {
  const [beta, setBeta] = useState(100);
  const [iBuA, setIBuA] = useState(100); // µA
  const [hasUsed, setHasUsed] = useState(false);

  const iB_mA = iBuA / 1000;
  const iC_mA = beta * iB_mA;
  const iE_mA = iC_mA + iB_mA;
  const VCE = 2; // fixed example
  const power_mW = VCE * iC_mA;

  const maxBar = 300 * 0.5; // max iC at beta=300, iB=500µA = 150mA

  const handleInteraction = () => {
    if (!hasUsed) {
      setHasUsed(true);
      onBaseCurrentUsed();
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="inline-block px-2 py-1 rounded-lg text-xs font-mono font-bold"
              style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              SIM 3
            </div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Interactive</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            I_B vs I_C Relationship
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Explore how β (beta) multiplies base current into collector current. Change β and I_B to see the amplification.
          </p>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {/* Beta selector */}
          <div className="mb-6">
            <div className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.5)" }}>
              Select β (hFE) — DC Current Gain
            </div>
            <div className="flex gap-2 flex-wrap">
              {BETA_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => { setBeta(b); handleInteraction(); }}
                  className="px-4 py-2 rounded-xl font-black text-sm transition-all"
                  style={{
                    background: beta === b ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                    border: beta === b ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.1)",
                    color: beta === b ? "#EF4444" : "rgba(240,240,245,0.5)",
                  }}
                >
                  β = {b}
                </button>
              ))}
            </div>
          </div>

          {/* I_B slider */}
          <div className="mb-8">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: "rgba(240,240,245,0.6)" }}>Base Current (I_B)</span>
              <span style={{ color: "#0EA5E9" }} className="font-black">{iBuA} µA</span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={iBuA}
              onChange={(e) => { setIBuA(Number(e.target.value)); handleInteraction(); }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#EF4444" }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>
              <span>0 µA</span>
              <span>500 µA</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="mb-6">
            <div className="text-xs font-mono mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>
              CURRENT COMPARISON BAR CHART
            </div>
            <div className="flex gap-6 items-end h-36">
              {/* I_B bar */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="text-xs font-black" style={{ color: "#0EA5E9" }}>{iB_mA.toFixed(3)} mA</div>
                <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: "100px", background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="absolute bottom-0 w-full rounded-t-lg"
                    style={{ background: "linear-gradient(180deg,#0EA5E9,#0284C7)" }}
                    animate={{ height: `${Math.min((iB_mA / maxBar) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>I_B</div>
              </div>

              {/* Multiply symbol */}
              <div className="flex flex-col items-center pb-6">
                <div className="text-2xl font-black" style={{ color: "rgba(239,68,68,0.6)" }}>×{beta}</div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.3)" }}>beta</div>
              </div>

              {/* I_C bar */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="text-xs font-black" style={{ color: "#EF4444" }}>{iC_mA.toFixed(1)} mA</div>
                <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: "100px", background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="absolute bottom-0 w-full rounded-t-lg"
                    style={{ background: "linear-gradient(180deg,#EF4444,#DC2626)" }}
                    animate={{ height: `${Math.min((iC_mA / maxBar) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>I_C = β×I_B</div>
              </div>

              {/* I_E bar */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="text-xs font-black" style={{ color: "#10B981" }}>{iE_mA.toFixed(1)} mA</div>
                <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: "100px", background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="absolute bottom-0 w-full rounded-t-lg"
                    style={{ background: "linear-gradient(180deg,#10B981,#059669)" }}
                    animate={{ height: `${Math.min((iE_mA / maxBar) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>I_E = I_C+I_B</div>
              </div>
            </div>
          </div>

          {/* Formula results */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "β (hFE)", value: String(beta), color: "#EF4444" },
              { label: "I_C = β×I_B", value: `${iC_mA.toFixed(2)}mA`, color: "#EF4444" },
              { label: "I_E = I_C+I_B", value: `${iE_mA.toFixed(2)}mA`, color: "#10B981" },
              { label: "P = V_CE×I_C", value: `${power_mW.toFixed(1)}mW`, color: "#F87171" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)", fontSize: "9px" }}>{s.label}</div>
                <div className="text-base font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl text-center" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)" }}>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
              Power dissipated in BJT (V_CE=2V fixed): <span style={{ color: "#EF4444" }}>P = {VCE}V × {iC_mA.toFixed(2)}mA = {power_mW.toFixed(1)}mW</span>.
              Keep below max P_dissipation rating!
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
