"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#0891B2";

const SAMPLING_TIMES = [
  { label: "3 cycles", val: 3 },
  { label: "15 cycles", val: 15 },
  { label: "28 cycles", val: 28 },
  { label: "56 cycles", val: 56 },
  { label: "84 cycles", val: 84 },
  { label: "112 cycles", val: 112 },
  { label: "144 cycles", val: 144 },
  { label: "480 cycles", val: 480 },
];

export default function ADCSim({ onUse }: Props) {
  const [voltage, setVoltage] = useState(1.65);
  const [samplingIdx, setSamplingIdx] = useState(1);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [called, setCalled] = useState(false);

  const VREF = 3.3;
  const adcVal = Math.round((voltage / VREF) * 4096);
  const clampedVal = Math.min(4095, Math.max(0, adcVal));
  const backVoltage = (clampedVal / 4096) * VREF;

  // Internal temperature formula: Temp = (V25 - VSENSE) / Avg_Slope + 25
  // V25 = 0.76V (typical), Avg_Slope = 2.5 mV/°C
  const tempVoltage = voltage;
  const tempC = ((0.76 - tempVoltage) / 0.0025) + 25;

  const samplingCycles = SAMPLING_TIMES[samplingIdx].val;
  const totalCycles = samplingCycles + 12; // 12.5 conversion cycles
  const adcClk = 21; // MHz (PCLK2/4 = 84/4)
  const convTimeUs = (totalCycles / (adcClk * 1_000_000)) * 1_000_000;

  function startConvert() {
    if (!called) { setCalled(true); onUse(); }
    setConverting(true);
    setResult(null);
    setTimeout(() => {
      setConverting(false);
      setResult(clampedVal);
    }, 1000);
  }

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 06 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>ADC Converter</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          12-bit ADC: 0–4095 range, Vref=3.3V. Formula: Voltage = (ADC_val / 4096) × 3.3V
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.2)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Voltage input */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span style={{ color: "rgba(240,240,245,0.5)" }}>Input Voltage (VSENSE)</span>
                  <span className="font-mono font-bold" style={{ color: COLOR }}>{voltage.toFixed(3)} V</span>
                </div>
                <input
                  type="range" min={0} max={3.3} step={0.001} value={voltage}
                  onChange={e => setVoltage(Number(e.target.value))}
                  className="w-full accent-cyan-700"
                />
                <div className="flex justify-between text-[9px] mt-0.5" style={{ color: "rgba(240,240,245,0.25)" }}>
                  <span>0 V</span><span>3.3 V (VREF)</span>
                </div>
              </div>

              {/* Sampling time */}
              <div>
                <div className="text-xs mb-2" style={{ color: "rgba(240,240,245,0.5)" }}>Sampling Time</div>
                <div className="grid grid-cols-4 gap-1">
                  {SAMPLING_TIMES.map((s, i) => (
                    <button
                      key={s.val}
                      onClick={() => setSamplingIdx(i)}
                      className="py-1.5 rounded-lg text-[9px] font-bold transition-all"
                      style={{
                        background: samplingIdx === i ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${samplingIdx === i ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: samplingIdx === i ? COLOR : "rgba(240,240,245,0.3)",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="text-[9px] mt-1.5" style={{ color: "rgba(240,240,245,0.3)" }}>
                  Total: {totalCycles} cycles · {convTimeUs.toFixed(3)} µs @ {adcClk} MHz ADC clock
                </div>
              </div>

              <button
                onClick={startConvert}
                disabled={converting}
                className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all disabled:opacity-50"
                style={{ borderColor: "rgba(8,145,178,0.4)", background: "rgba(8,145,178,0.12)", color: COLOR }}
              >
                {converting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="inline-block">⟳</motion.span>
                    Converting...
                  </span>
                ) : "Start Conversion"}
              </button>
            </div>

            <div>
              <div className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.5)" }}>ADC Result</div>

              {/* Live preview */}
              <div className="space-y-2 mb-4">
                {[
                  { label: "Raw ADC Value", val: `${clampedVal}`, sub: "12-bit (0–4095)" },
                  { label: "Hex", val: `0x${clampedVal.toString(16).toUpperCase().padStart(3, "0")}` },
                  { label: "Calculated Voltage", val: `${backVoltage.toFixed(4)} V` },
                  { label: "Temp Sensor Reading", val: `${tempC.toFixed(1)} °C`, note: "(if using internal sensor)" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center rounded-lg px-3 py-2 border"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div>
                      <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>{r.label}</div>
                      {r.note && <div className="text-[8px]" style={{ color: "rgba(240,240,245,0.25)" }}>{r.note}</div>}
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: COLOR }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Animated result */}
              <AnimatePresence>
                {result !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border p-4 text-center mb-4"
                    style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)" }}
                  >
                    <div className="text-[10px] font-mono mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Conversion Complete</div>
                    <div className="text-3xl font-black" style={{ color: "#10B981" }}>{result}</div>
                    <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>HAL_ADC_GetValue(&hadc1)</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formula */}
              <div className="rounded-xl border p-3 text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.07)", color: "rgba(240,240,245,0.5)" }}>
                <div style={{ color: "rgba(240,240,245,0.3)" }}>// Convert ADC to voltage</div>
                <div><span style={{ color: "#F59E0B" }}>float</span> voltage = (HAL_ADC_GetValue(&hadc1) / 4096.0f) * 3.3f;</div>
                <div className="mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>// Internal temp sensor</div>
                <div><span style={{ color: "#F59E0B" }}>float</span> temp = ((0.76f - voltage) / 0.0025f) + 25.0f;</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
