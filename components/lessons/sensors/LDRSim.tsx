"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#0EA5E9";

function getLDRResistance(light: number): number {
  // Logarithmic scale: 0% → 1,000,000 Ω, 100% → 1,000 Ω
  const logR = Math.log10(1000000) - (light / 100) * (Math.log10(1000000) - Math.log10(1000));
  return Math.round(Math.pow(10, logR));
}

function formatOhms(r: number): string {
  if (r >= 1000000) return `${(r / 1000000).toFixed(2)} MΩ`;
  if (r >= 1000) return `${(r / 1000).toFixed(1)} kΩ`;
  return `${r} Ω`;
}

export default function LDRSim({ onUsed }: Props) {
  const [light, setLight] = useState(50);
  const [called, setCalled] = useState(false);
  const [moved, setMoved] = useState(false);

  const rLDR = getLDRResistance(light);
  const r2 = 10000; // 10kΩ fixed resistor
  const vout = (5 * r2) / (r2 + rLDR);
  const adcReading = Math.round((vout / 5) * 1023);
  const percent = (light / 100);

  // Colors based on light level
  const sunColor = light > 60 ? "#F59E0B" : light > 30 ? "#FCD34D" : "#60A5FA";
  const bgColor = light > 50 ? "rgba(245,158,11,0.08)" : "rgba(14,165,233,0.05)";
  const borderColor = light > 50 ? "rgba(245,158,11,0.25)" : "rgba(14,165,233,0.2)";

  function getLightLabel(l: number): string {
    if (l < 5) return "Complete darkness — midnight";
    if (l < 20) return "Dim room — night light";
    if (l < 40) return "Indoor lighting — office";
    if (l < 60) return "Bright room — daylight through window";
    if (l < 80) return "Outdoor shade — overcast day";
    return "Direct sunlight — full brightness";
  }

  function handleSlider(val: number) {
    setLight(val);
    if (!called && !moved) {
      setMoved(true);
      setCalled(true);
      onUsed();
    }
  }

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 06 · Simulator
        </p>
        <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>LDR Light Sensor Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          A Light Dependent Resistor (LDR) changes resistance based on light intensity. Pair it with a voltage divider to get a readable analog voltage.
        </p>
      </motion.div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: bgColor, borderColor }}>
        <div className="p-6">
          {/* Scene visualization */}
          <div className="relative h-40 rounded-xl mb-5 flex items-center justify-center overflow-hidden" style={{ background: `rgba(0,0,0,${0.5 - percent * 0.3})`, border: "1px solid rgba(255,255,255,0.05)" }}>
            {/* Sky/background brightness */}
            <motion.div
              className="absolute inset-0"
              animate={{ background: `rgba(${light > 50 ? "245,158,11" : "14,165,233"},${percent * 0.15})` }}
              transition={{ duration: 0.3 }}
            />

            {/* Sun / Moon */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                className="rounded-full flex items-center justify-center"
                animate={{
                  width: `${40 + light * 0.4}px`,
                  height: `${40 + light * 0.4}px`,
                  background: sunColor,
                  boxShadow: `0 0 ${light * 0.8}px ${sunColor}`,
                }}
                transition={{ duration: 0.3 }}
              >
                <span style={{ fontSize: `${14 + light * 0.1}px` }}>
                  {light > 30 ? "☀️" : "🌙"}
                </span>
              </motion.div>
              <div className="mt-2 text-xs font-mono" style={{ color: "rgba(240,240,245,0.5)" }}>
                {getLightLabel(light)}
              </div>
            </div>

            {/* Stars (dark mode) */}
            {light < 30 && (
              <>
                {[[15, 15], [80, 25], [120, 10], [200, 20], [250, 8]].map(([x, y], i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ left: x, top: y, background: "white" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Slider */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">🌑</span>
              <input
                type="range" min={0} max={100} value={light}
                onChange={e => handleSlider(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: sunColor }}
              />
              <span className="text-xl">☀️</span>
            </div>
            <div className="flex justify-between text-[10px]" style={{ color: "rgba(240,240,245,0.3)" }}>
              <span>0% Dark</span>
              <span className="font-bold font-mono" style={{ color: sunColor }}>{light}% Light</span>
              <span>100% Bright</span>
            </div>
          </div>

          {/* Readings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "LDR Resistance", value: formatOhms(rLDR), color: sunColor },
              { label: "Fixed R (R2)", value: "10 kΩ", color: "rgba(240,240,245,0.5)" },
              { label: "Vout", value: `${vout.toFixed(3)} V`, color: COLOR },
              { label: "ADC Reading", value: adcReading.toString(), color: "#10B981" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl p-3 text-center border" style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="text-[9px] mb-1" style={{ color: "rgba(240,240,245,0.35)" }}>{label}</div>
                <div className="text-sm font-black font-mono" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Circuit diagram */}
          <div className="rounded-xl p-4 border mb-4" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-[10px] mb-3 font-bold" style={{ color: "rgba(240,240,245,0.4)" }}>Voltage Divider Circuit</div>
            <svg viewBox="0 0 280 80" className="w-full h-16">
              {/* 5V rail */}
              <text x="2" y="12" fontSize="7" fill="#EF4444">+5V</text>
              <line x1="30" y1="8" x2="30" y2="20" stroke="#EF4444" strokeWidth="1.5" />
              {/* LDR symbol */}
              <rect x="20" y="20" width="20" height="12" fill="none" stroke={sunColor} strokeWidth="1.2" />
              <text x="23" y="28.5" fontSize="5.5" fill={sunColor}>LDR</text>
              <text x="42" y="23" fontSize="5" fill="rgba(240,240,245,0.3)">{formatOhms(rLDR)}</text>
              {/* Wire between */}
              <line x1="30" y1="32" x2="30" y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
              {/* Vout tap */}
              <circle cx="30" cy="44" r="2" fill={COLOR} />
              <line x1="30" y1="44" x2="80" y2="44" stroke={COLOR} strokeWidth="1.2" />
              <text x="82" y="47" fontSize="6" fill={COLOR}>Vout={vout.toFixed(2)}V → A0</text>
              {/* Fixed resistor */}
              <line x1="30" y1="44" x2="30" y2="56" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
              <rect x="20" y="56" width="20" height="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <text x="24" y="64.5" fontSize="5" fill="rgba(255,255,255,0.4)">10kΩ</text>
              {/* GND */}
              <line x1="30" y1="68" x2="30" y2="76" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <text x="22" y="82" fontSize="7" fill="rgba(255,255,255,0.3)">GND</text>
              {/* Formula */}
              <text x="130" y="20" fontSize="6" fill="rgba(240,240,245,0.35)">Vout = 5V × R2 / (R2 + R_LDR)</text>
              <text x="130" y="32" fontSize="6" fill={COLOR}>     = 5 × 10k / (10k + {formatOhms(rLDR)})</text>
              <text x="130" y="44" fontSize="6" fill="#10B981">     = {vout.toFixed(3)} V</text>
            </svg>
          </div>

          {/* Use cases */}
          <div className="flex gap-3 flex-wrap">
            {[
              { icon: "🌃", label: "Automatic street lights (dark → ON)" },
              { icon: "📱", label: "Screen brightness adjustment" },
              { icon: "🌱", label: "Plant grow light control" },
              { icon: "🔒", label: "Security — laser trip wire" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Arduino code */}
        <div className="px-6 pb-6 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="rounded-xl p-3 font-mono text-xs" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "rgba(240,240,245,0.3)" }}>// LDR + 10kΩ voltage divider on A0</div>
            <div><span style={{ color: "#10B981" }}>int</span> <span style={{ color: "#F0F0F5" }}>ldrValue = </span><span style={{ color: COLOR }}>analogRead</span><span style={{ color: "#F0F0F5" }}>(A0);</span></div>
            <div><span style={{ color: "#10B981" }}>float</span> <span style={{ color: "#F0F0F5" }}>vout = ldrValue * (</span><span style={{ color: "#F59E0B" }}>5.0</span><span style={{ color: "#F0F0F5" }}>/</span><span style={{ color: "#F59E0B" }}>1023</span><span style={{ color: "#F0F0F5" }}>);</span></div>
            <div><span style={{ color: "#10B981" }}>int</span> <span style={{ color: "#F0F0F5" }}>brightness = </span><span style={{ color: COLOR }}>map</span><span style={{ color: "#F0F0F5" }}>(ldrValue, </span><span style={{ color: "#F59E0B" }}>0</span><span style={{ color: "#F0F0F5" }}>, </span><span style={{ color: "#F59E0B" }}>1023</span><span style={{ color: "#F0F0F5" }}>, </span><span style={{ color: "#F59E0B" }}>0</span><span style={{ color: "#F0F0F5" }}>, </span><span style={{ color: "#F59E0B" }}>100</span><span style={{ color: "#F0F0F5" }}>);</span></div>
            <div className="mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>// Now: ADC={adcReading} → {vout.toFixed(3)}V → {light}% bright</div>
          </div>
        </div>
      </div>

      {called && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs mt-2 text-center font-bold" style={{ color: "#10B981" }}>
          +25 XP earned! LDR sensor mastered.
        </motion.p>
      )}
    </section>
  );
}
