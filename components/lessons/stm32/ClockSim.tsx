"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#0891B2";

export default function ClockSim({ onUse }: Props) {
  const [source, setSource] = useState<"HSI" | "HSE">("HSE");
  const [hseFreq, setHseFreq] = useState(8);
  const [pllM, setPllM] = useState(8);
  const [pllN, setPllN] = useState(336);
  const [pllP, setPllP] = useState(2);
  const [ahbDiv, setAhbDiv] = useState(1);
  const [apb1Div, setApb1Div] = useState(4);
  const [apb2Div, setApb2Div] = useState(2);
  const [called, setCalled] = useState(false);

  function handle() { if (!called) { setCalled(true); onUse(); } }

  const inputFreq = source === "HSI" ? 16 : hseFreq;
  const vcoIn = inputFreq / pllM;
  const vcoOut = vcoIn * pllN;
  const sysclk = Math.min(168, vcoOut / pllP);
  const ahbClk = sysclk / ahbDiv;
  const apb1Clk = Math.min(42, ahbClk / apb1Div);
  const apb2Clk = Math.min(84, ahbClk / apb2Div);
  const apb1TimClk = apb1Div > 1 ? apb1Clk * 2 : apb1Clk;
  const apb2TimClk = apb2Div > 1 ? apb2Clk * 2 : apb2Clk;

  const isValid = vcoIn >= 1 && vcoIn <= 2 && vcoOut >= 100 && vcoOut <= 432 && sysclk <= 168;

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 03 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Clock Tree Configurator</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          Configure the STM32F4 PLL to achieve SYSCLK up to 168 MHz.
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.2)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left: inputs */}
            <div className="space-y-4">
              {/* Clock source */}
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.5)" }}>Clock Source</div>
                <div className="flex gap-2">
                  {(["HSI", "HSE"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => { setSource(s); handle(); }}
                      className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: source === s ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${source === s ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: source === s ? COLOR : "rgba(240,240,245,0.4)",
                      }}
                    >
                      {s} {s === "HSI" ? "(16 MHz)" : `(${hseFreq} MHz)`}
                    </button>
                  ))}
                </div>
              </div>

              {source === "HSE" && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "rgba(240,240,245,0.5)" }}>HSE Frequency</span>
                    <span className="font-mono" style={{ color: COLOR }}>{hseFreq} MHz</span>
                  </div>
                  <input type="range" min={8} max={26} step={2} value={hseFreq}
                    onChange={e => { setHseFreq(Number(e.target.value)); handle(); }}
                    className="w-full accent-cyan-700" />
                </div>
              )}

              {/* PLL params */}
              {[
                { label: "PLL_M (÷)", min: 2, max: 63, val: pllM, set: setPllM, info: "VCO In = Fin / M (must be 1–2 MHz)" },
                { label: "PLL_N (×)", min: 50, max: 432, val: pllN, set: setPllN, info: "VCO Out = VCO In × N (100–432 MHz)" },
                { label: "PLL_P (÷)", min: 2, max: 8, step: 2, val: pllP, set: setPllP, info: "SYSCLK = VCO Out / P (max 168 MHz)" },
              ].map(p => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "rgba(240,240,245,0.5)" }}>{p.label}</span>
                    <span className="font-mono" style={{ color: COLOR }}>{p.val}</span>
                  </div>
                  <input type="range" min={p.min} max={p.max} step={p.step ?? 1} value={p.val}
                    onChange={e => { p.set(Number(e.target.value)); handle(); }}
                    className="w-full accent-cyan-700" />
                  <div className="text-[9px] mt-0.5" style={{ color: "rgba(240,240,245,0.25)" }}>{p.info}</div>
                </div>
              ))}
            </div>

            {/* Right: outputs */}
            <div>
              <div className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.5)" }}>Clock Results</div>

              {/* Validity */}
              <div className={`mb-4 p-2.5 rounded-lg text-xs font-bold text-center border`}
                style={{
                  background: isValid ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                  borderColor: isValid ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
                  color: isValid ? "#10B981" : "#EF4444",
                }}>
                {isValid ? "Valid Clock Configuration" : "Invalid — Check VCO or SYSCLK limits"}
              </div>

              {/* Clock values */}
              <div className="space-y-2">
                {[
                  { label: "VCO Input", val: `${vcoIn.toFixed(2)} MHz`, ok: vcoIn >= 1 && vcoIn <= 2 },
                  { label: "VCO Output", val: `${vcoOut.toFixed(0)} MHz`, ok: vcoOut >= 100 && vcoOut <= 432 },
                  { label: "SYSCLK", val: `${sysclk.toFixed(0)} MHz`, ok: sysclk <= 168, highlight: true },
                  { label: "AHB (HCLK)", val: `${ahbClk.toFixed(0)} MHz`, ok: true },
                  { label: "APB1 (PCLK1)", val: `${apb1Clk.toFixed(0)} MHz`, ok: apb1Clk <= 42 },
                  { label: "APB2 (PCLK2)", val: `${apb2Clk.toFixed(0)} MHz`, ok: apb2Clk <= 84 },
                  { label: "TIM on APB1", val: `${apb1TimClk.toFixed(0)} MHz`, ok: true },
                  { label: "TIM on APB2", val: `${apb2TimClk.toFixed(0)} MHz`, ok: true },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg px-3 py-2 border"
                    style={{
                      background: row.highlight ? "rgba(8,145,178,0.08)" : "rgba(255,255,255,0.02)",
                      borderColor: row.ok ? "rgba(255,255,255,0.07)" : "rgba(239,68,68,0.25)",
                    }}>
                    <span className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>{row.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: row.ok ? (row.highlight ? COLOR : "#F0F0F5") : "#EF4444" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* AHB/APB dividers */}
              <div className="mt-4 space-y-2">
                {[
                  { label: "AHB Prescaler", vals: [1, 2, 4, 8, 16, 64, 128, 256, 512], val: ahbDiv, set: setAhbDiv },
                  { label: "APB1 Prescaler", vals: [1, 2, 4, 8, 16], val: apb1Div, set: setApb1Div },
                  { label: "APB2 Prescaler", vals: [1, 2, 4, 8, 16], val: apb2Div, set: setApb2Div },
                ].map(sel => (
                  <div key={sel.label} className="flex items-center gap-2">
                    <span className="text-[10px] w-28 flex-shrink-0" style={{ color: "rgba(240,240,245,0.4)" }}>{sel.label}</span>
                    <select
                      value={sel.val}
                      onChange={e => { sel.set(Number(e.target.value)); handle(); }}
                      className="flex-1 rounded px-2 py-1 text-[10px] font-mono"
                      style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(8,145,178,0.25)", color: COLOR, outline: "none" }}
                    >
                      {sel.vals.map(v => <option key={v} value={v}>÷{v}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
