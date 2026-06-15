"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LEDDriverSimProps {
  onLEDDriverUsed: () => void;
}

export default function LEDDriverSim({ onLEDDriverUsed }: LEDDriverSimProps) {
  const [arduinoHigh, setArduinoHigh] = useState(false);
  const [hasToggled, setHasToggled] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!arduinoHigh) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 60), 35);
    return () => clearInterval(id);
  }, [arduinoHigh]);

  const handleToggle = () => {
    setArduinoHigh((v) => !v);
    if (!hasToggled) {
      setHasToggled(true);
      onLEDDriverUsed();
    }
  };

  // Values
  const vPin = arduinoHigh ? 3.3 : 0;
  const vBE = arduinoHigh ? 0.7 : 0;
  const RB = 10000; // 10kΩ
  const iB_mA = arduinoHigh ? ((3.3 - 0.7) / RB) * 1000 : 0;
  const beta = 100;
  const iC_mA = arduinoHigh ? Math.min(beta * iB_mA, 30) : 0;
  const ledBrightness = arduinoHigh ? 1 : 0;
  const pinCurrent_mA = iB_mA; // Arduino only provides base current

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
              SIM 4
            </div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Practical Circuit</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            Arduino LED Driver
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Arduino GPIO can only source 5mA. This high-power LED needs 30mA. Use an NPN BJT to bridge the gap.
          </p>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {/* Problem/Solution visual */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Without BJT */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <div className="text-xs font-bold mb-3" style={{ color: "#EF4444" }}>WITHOUT BJT (problem)</div>
              <svg viewBox="0 0 180 120" className="w-full max-w-xs mx-auto" style={{ display: "block" }}>
                {/* Arduino */}
                <rect x="10" y="40" width="55" height="35" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                <text x="37" y="54" textAnchor="middle" fill="rgba(240,240,245,0.6)" fontSize="8" fontWeight="700">Arduino</text>
                <text x="37" y="67" textAnchor="middle" fill="rgba(240,240,245,0.3)" fontSize="7">5mA max</text>

                {/* Wire to LED */}
                <line x1="65" y1="57" x2="100" y2="57" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />

                {/* LED */}
                <circle cx="120" cy="57" r="16" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
                <text x="120" y="53" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="7" fontWeight="700">HIGH</text>
                <text x="120" y="63" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="7">POWER</text>
                <text x="120" y="73" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="6">LED</text>

                {/* Red X */}
                <text x="150" y="55" fill="#EF4444" fontSize="24" fontWeight="900">✕</text>
                <text x="40" y="105" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="7">NOT ENOUGH CURRENT</text>
              </svg>
            </div>

            {/* With BJT */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <div className="text-xs font-bold mb-3" style={{ color: "#10B981" }}>WITH BJT (solution)</div>
              <svg viewBox="0 0 180 120" className="w-full max-w-xs mx-auto" style={{ display: "block" }}>
                {/* Arduino */}
                <rect x="5" y="50" width="40" height="28" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x="25" y="63" textAnchor="middle" fill="rgba(240,240,245,0.6)" fontSize="7" fontWeight="700">Arduino</text>
                <text x="25" y="73" textAnchor="middle" fill="rgba(240,240,245,0.3)" fontSize="6">0.26mA</text>

                {/* Wire + R_B */}
                <line x1="45" y1="64" x2="62" y2="64" stroke="rgba(14,165,233,0.5)" strokeWidth="1.2" />
                <rect x="62" y="58" width="24" height="14" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x="74" y="68" textAnchor="middle" fill="rgba(240,240,245,0.5)" fontSize="6">10kΩ</text>

                {/* BJT */}
                <circle cx="108" cy="64" r="16" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.35)" strokeWidth="1.2" />
                <text x="108" y="68" textAnchor="middle" fill="#EF4444" fontSize="7" fontWeight="800">NPN</text>

                {/* Wire from R_B to Base */}
                <line x1="86" y1="64" x2="92" y2="64" stroke="rgba(14,165,233,0.5)" strokeWidth="1.2" />

                {/* LED on top */}
                <circle cx="108" cy="24" r="12" fill={arduinoHigh ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.04)"} stroke={arduinoHigh ? "#EF4444" : "rgba(255,255,255,0.15)"} strokeWidth="1.2" />
                <text x="108" y="28" textAnchor="middle" fill={arduinoHigh ? "#EF4444" : "rgba(240,240,245,0.3)"} fontSize="6" fontWeight="700">LED</text>
                <line x1="108" y1="48" x2="108" y2="36" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2" />

                {/* 5V */}
                <text x="108" y="10" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="7" fontWeight="700">+5V</text>
                <line x1="108" y1="11" x2="108" y2="12" stroke="rgba(239,68,68,0.4)" strokeWidth="1.2" />

                {/* GND */}
                <line x1="108" y1="80" x2="108" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                <line x1="100" y1="90" x2="116" y2="90" stroke="rgba(240,240,245,0.3)" strokeWidth="1.2" />

                {/* Check */}
                <text x="155" y="62" fill="#10B981" fontSize="20" fontWeight="900">✓</text>
                <text x="40" y="112" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="7">30mA from 5V rail</text>
              </svg>
            </div>
          </div>

          {/* Circuit diagram with animation */}
          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg viewBox="0 0 540 200" className="w-full max-w-2xl mx-auto" style={{ display: "block" }}>
              {/* 5V rail */}
              <text x="270" y="14" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="10" fontWeight="700">+5V</text>
              <line x1="270" y1="16" x2="270" y2="30" stroke="rgba(239,68,68,0.5)" strokeWidth="1.8" />

              {/* R_C = 100Ω */}
              <rect x="248" y="30" width="44" height="20" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
              <text x="270" y="38" textAnchor="middle" fill="rgba(240,240,245,0.6)" fontSize="7">R_C</text>
              <text x="270" y="47" textAnchor="middle" fill="rgba(240,240,245,0.35)" fontSize="6">100Ω</text>

              {/* LED */}
              <circle
                cx="270"
                cy="72"
                r="14"
                fill={arduinoHigh ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.03)"}
                stroke={arduinoHigh ? "#EF4444" : "rgba(255,255,255,0.15)"}
                strokeWidth="1.5"
              />
              <text x="270" y="76" textAnchor="middle" fill={arduinoHigh ? "#EF4444" : "rgba(240,240,245,0.3)"} fontSize="8" fontWeight="700">LED</text>
              <line x1="270" y1="50" x2="270" y2="58" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />

              {/* BJT */}
              <circle cx="270" cy="118" r="22" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
              <text x="270" y="115" textAnchor="middle" fill="#EF4444" fontSize="8" fontWeight="800">NPN</text>
              <text x="270" y="126" textAnchor="middle" fill="rgba(239,68,68,0.4)" fontSize="6">2N2222</text>
              <line x1="270" y1="86" x2="270" y2="96" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />

              {/* Base R_B from left */}
              <text x="55" y="118" textAnchor="middle" fill="rgba(14,165,233,0.7)" fontSize="9" fontWeight="700">Arduino</text>
              <text x="55" y="130" textAnchor="middle" fill="rgba(14,165,233,0.4)" fontSize="7">3.3V GPIO</text>
              <line x1="90" y1="120" x2="130" y2="120" stroke={arduinoHigh ? "rgba(14,165,233,0.6)" : "rgba(255,255,255,0.15)"} strokeWidth="1.5" />

              {/* R_B box */}
              <rect x="130" y="110" width="50" height="20" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
              <text x="155" y="118" textAnchor="middle" fill="rgba(240,240,245,0.6)" fontSize="7">R_B</text>
              <text x="155" y="127" textAnchor="middle" fill="rgba(240,240,245,0.35)" fontSize="6">10kΩ</text>

              <line x1="180" y1="120" x2="248" y2="120" stroke={arduinoHigh ? "rgba(14,165,233,0.6)" : "rgba(255,255,255,0.15)"} strokeWidth="1.5" />

              {/* GND */}
              <line x1="270" y1="140" x2="270" y2="165" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <line x1="254" y1="165" x2="286" y2="165" stroke="rgba(240,240,245,0.35)" strokeWidth="1.5" />
              <line x1="260" y1="171" x2="280" y2="171" stroke="rgba(240,240,245,0.25)" strokeWidth="1" />
              <line x1="264" y1="177" x2="276" y2="177" stroke="rgba(240,240,245,0.15)" strokeWidth="1" />
              <text x="270" y="190" textAnchor="middle" fill="rgba(240,240,245,0.3)" fontSize="8">GND</text>

              {/* Current flow dots */}
              {arduinoHigh && [0, 0.4, 0.7].map((offset, i) => {
                const pos = ((tick / 60 + offset) % 1);
                const pathY = 16 + pos * 148;
                return <circle key={i} cx="270" cy={pathY} r="3" fill="#EF4444" opacity="0.8" />;
              })}
              {arduinoHigh && [0, 0.5].map((offset, i) => {
                const pos = ((tick / 60 + offset) % 1);
                const cx = 90 + pos * 158;
                return <circle key={`b-${i}`} cx={cx} cy="120" r="2" fill="#0EA5E9" opacity="0.8" />;
              })}

              {/* Labels */}
              <text x="370" y="62" fill="rgba(239,68,68,0.5)" fontSize="8">← {arduinoHigh ? "30mA" : "0mA"} LED current</text>
              <text x="370" y="120" fill="rgba(14,165,233,0.5)" fontSize="8">← {arduinoHigh ? `${iB_mA.toFixed(2)}mA` : "0mA"} from Arduino</text>
            </svg>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleToggle}
              className="px-8 py-3.5 rounded-2xl font-black text-sm transition-all"
              style={{
                background: arduinoHigh
                  ? "linear-gradient(135deg,#10B981,#059669)"
                  : "rgba(255,255,255,0.08)",
                border: arduinoHigh ? "none" : "1px solid rgba(255,255,255,0.15)",
                color: arduinoHigh ? "#fff" : "rgba(240,240,245,0.6)",
                boxShadow: arduinoHigh ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
              }}
            >
              {arduinoHigh ? "Arduino Pin: HIGH (3.3V)" : "Arduino Pin: LOW (0V)"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Arduino GPIO", value: `${pinCurrent_mA.toFixed(2)}mA`, sublabel: "pin current", color: "#0EA5E9" },
              { label: "I_B", value: `${iB_mA.toFixed(2)}mA`, sublabel: "base current", color: "#0EA5E9" },
              { label: "I_LED", value: `${iC_mA.toFixed(0)}mA`, sublabel: "from 5V rail", color: "#EF4444" },
              { label: "Amplify", value: `×${iB_mA > 0 ? Math.round(iC_mA / iB_mA) : 0}`, sublabel: "current gain", color: "#10B981" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-xs mb-0.5" style={{ color: "rgba(240,240,245,0.4)", fontSize: "9px" }}>{s.label}</div>
                <div className="text-base font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "rgba(240,240,245,0.3)", fontSize: "9px" }}>{s.sublabel}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", color: "rgba(240,240,245,0.5)" }}>
            Design: I_B_needed = I_C/β = 30mA/100 = 0.3mA. R_B = (3.3V - 0.7V) / 0.3mA = 8.67kΩ → use 10kΩ (slight overdrive is OK).
          </div>
        </div>
      </motion.div>
    </section>
  );
}
