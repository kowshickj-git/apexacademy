"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SwitchSimProps {
  onSwitchUsed: () => void;
}

export default function SwitchSim({ onSwitchUsed }: SwitchSimProps) {
  const [baseHigh, setBaseHigh] = useState(false);
  const [hasToggled, setHasToggled] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!baseHigh) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 80), 40);
    return () => clearInterval(id);
  }, [baseHigh]);

  const handleToggle = () => {
    setBaseHigh((v) => !v);
    if (!hasToggled) {
      setHasToggled(true);
      onSwitchUsed();
    }
  };

  // Calculated values
  const vBase = baseHigh ? 3.3 : 0;
  const vBE = baseHigh ? 0.7 : 0;
  const iB = baseHigh ? ((3.3 - 0.7) / 10000) * 1000 : 0; // mA
  const iC = baseHigh ? 4.8 : 0; // saturated: (5-0.2)/1000*1000 = 4.8mA
  const vCE = baseHigh ? 0.2 : 5.0;
  const region = baseHigh ? "SATURATION (ON)" : "CUTOFF (OFF)";
  const regionColor = baseHigh ? "#10B981" : "rgba(239,68,68,0.7)";

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
              SIM 1
            </div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Interactive</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            BJT as a Switch
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Toggle the base voltage between 0V and 3.3V. Watch the NPN transistor switch between CUTOFF and SATURATION.
          </p>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {/* Circuit diagram SVG */}
          <div className="mb-6">
            <svg viewBox="0 0 500 260" className="w-full max-w-lg mx-auto" style={{ display: "block" }}>
              {/* VCC rail */}
              <text x="240" y="16" textAnchor="middle" fill="rgba(240,240,245,0.7)" fontSize="11" fontWeight="700">+5V (VCC)</text>
              <line x1="240" y1="18" x2="240" y2="35" stroke="rgba(239,68,68,0.6)" strokeWidth="2" />

              {/* R_C (1kΩ) */}
              <rect x="220" y="35" width="40" height="22" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <text x="240" y="44" textAnchor="middle" fill="rgba(240,240,245,0.7)" fontSize="8" fontWeight="600">R_C</text>
              <text x="240" y="53" textAnchor="middle" fill="rgba(240,240,245,0.4)" fontSize="7">1kΩ</text>

              {/* Wire from R_C to Collector */}
              <line x1="240" y1="57" x2="240" y2="100" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />

              {/* LED (circle) */}
              <circle
                cx="240"
                cy="78"
                r="12"
                fill={baseHigh ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.04)"}
                stroke={baseHigh ? "#EF4444" : "rgba(255,255,255,0.15)"}
                strokeWidth="1.5"
              >
                {baseHigh && (
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="0.8s" repeatCount="indefinite" />
                )}
              </circle>
              <text x="240" y="82" textAnchor="middle" fill={baseHigh ? "#EF4444" : "rgba(240,240,245,0.3)"} fontSize="8" fontWeight="700">LED</text>

              {/* BJT Body */}
              <circle cx="240" cy="128" r="26" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
              <text x="240" y="125" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="800">NPN</text>
              <text x="240" y="137" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="7">2N2222</text>

              {/* Collector line into BJT */}
              <line x1="240" y1="100" x2="240" y2="102" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />

              {/* Base wire from left */}
              <line x1="80" y1="128" x2="214" y2="128" stroke={baseHigh ? "#0EA5E9" : "rgba(255,255,255,0.2)"} strokeWidth="2" />

              {/* R_B (10kΩ) */}
              <rect x="100" y="115" width="50" height="22" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <text x="125" y="124" textAnchor="middle" fill="rgba(240,240,245,0.7)" fontSize="8" fontWeight="600">R_B</text>
              <text x="125" y="133" textAnchor="middle" fill="rgba(240,240,245,0.4)" fontSize="7">10kΩ</text>

              {/* Base voltage source */}
              <rect
                x="20"
                y="115"
                width="60"
                height="26"
                rx="6"
                fill={baseHigh ? "rgba(14,165,233,0.12)" : "rgba(255,255,255,0.04)"}
                stroke={baseHigh ? "#0EA5E9" : "rgba(255,255,255,0.15)"}
                strokeWidth="1.5"
              />
              <text x="50" y="127" textAnchor="middle" fill={baseHigh ? "#0EA5E9" : "rgba(240,240,245,0.4)"} fontSize="9" fontWeight="700">
                {vBase}V
              </text>
              <text x="50" y="138" textAnchor="middle" fill="rgba(240,240,245,0.35)" fontSize="7">Base V</text>

              {/* Emitter wire to GND */}
              <line x1="240" y1="154" x2="240" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

              {/* GND symbol */}
              <line x1="220" y1="190" x2="260" y2="190" stroke="rgba(240,240,245,0.4)" strokeWidth="2" />
              <line x1="226" y1="196" x2="254" y2="196" stroke="rgba(240,240,245,0.3)" strokeWidth="1.5" />
              <line x1="232" y1="202" x2="248" y2="202" stroke="rgba(240,240,245,0.2)" strokeWidth="1" />
              <text x="240" y="218" textAnchor="middle" fill="rgba(240,240,245,0.3)" fontSize="9">GND</text>

              {/* Current flow animation */}
              {baseHigh && [0, 0.33, 0.66].map((offset, i) => {
                const pos = ((tick / 80 + offset) % 1);
                // Flow from VCC down through R_C, LED, BJT to GND
                const pathY = 18 + pos * 172;
                return (
                  <circle key={i} cx="240" cy={pathY} r="3.5" fill="#EF4444" opacity="0.85" />
                );
              })}

              {/* Base current flow */}
              {baseHigh && [0, 0.5].map((offset, i) => {
                const pos = ((tick / 80 + offset) % 1);
                const cx = 80 + pos * 134;
                return (
                  <circle key={`b-${i}`} cx={cx} cy="128" r="2.5" fill="#0EA5E9" opacity="0.8" />
                );
              })}
            </svg>
          </div>

          {/* Toggle button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleToggle}
              className="px-8 py-3.5 rounded-2xl font-black text-sm transition-all"
              style={{
                background: baseHigh
                  ? "linear-gradient(135deg,#10B981,#059669)"
                  : "linear-gradient(135deg,#EF4444,#DC2626)",
                color: "#fff",
                boxShadow: baseHigh
                  ? "0 4px 20px rgba(16,185,129,0.4)"
                  : "0 4px 20px rgba(239,68,68,0.3)",
              }}
            >
              {baseHigh ? "Set Base LOW (0V)" : "Set Base HIGH (3.3V)"}
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "V_Base", value: `${vBase}V`, color: "#0EA5E9" },
              { label: "I_B", value: `${iB.toFixed(2)}mA`, color: "#0EA5E9" },
              { label: "I_C", value: `${iC.toFixed(1)}mA`, color: "#EF4444" },
              { label: "V_CE", value: `${vCE}V`, color: "#F87171" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>{s.label}</div>
                <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Region indicator */}
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: baseHigh ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
              border: `1px solid ${baseHigh ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}
          >
            <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>OPERATING REGION</div>
            <div className="text-lg font-black mb-1" style={{ color: regionColor }}>{region}</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
              {baseHigh
                ? `I_B = (3.3V - 0.7V) / 10kΩ = 0.26mA → forces saturation. V_CE ≈ 0.2V. LED ON.`
                : "I_B = 0 → no base current → transistor OFF. V_CE = V_CC = 5V. LED OFF."}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
