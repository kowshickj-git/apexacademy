"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#0891B2";

type Mode = "Input" | "Output" | "Alternate" | "Analog";
type Pull = "No Pull" | "Pull-Up" | "Pull-Down";
type OutputType = "Push-Pull" | "Open-Drain";
type Speed = "Low" | "Medium" | "High" | "Very High";

const PORTS = ["A", "B", "C", "D", "E"];

export default function GPIOSim({ onUse }: Props) {
  const [port, setPort] = useState("A");
  const [pin, setPin] = useState(5);
  const [mode, setMode] = useState<Mode>("Output");
  const [pull, setPull] = useState<Pull>("No Pull");
  const [outType, setOutType] = useState<OutputType>("Push-Pull");
  const [speed, setSpeed] = useState<Speed>("High");
  const [state, setState] = useState(false);
  const [called, setCalled] = useState(false);

  function handle() { if (!called) { setCalled(true); onUse(); } }

  const speedMHz: Record<Speed, string> = {
    Low: "8 MHz", Medium: "25 MHz", High: "50 MHz", "Very High": "100 MHz"
  };

  const modeCode: Record<Mode, string> = {
    Input: "GPIO_MODE_INPUT",
    Output: "GPIO_MODE_OUTPUT_PP",
    Alternate: "GPIO_MODE_AF_PP",
    Analog: "GPIO_MODE_ANALOG",
  };

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 04 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>GPIO Mode Configurator</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          STM32 GPIO has 4 modes: Input, Output, Alternate Function, Analog. Configure and see the generated HAL code.
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.2)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Port + Pin */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="text-[10px] mb-1.5" style={{ color: "rgba(240,240,245,0.4)" }}>GPIO Port</div>
                  <div className="flex gap-1">
                    {PORTS.map(p => (
                      <button key={p} onClick={() => { setPort(p); handle(); }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={{
                          background: port === p ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${port === p ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                          color: port === p ? COLOR : "rgba(240,240,245,0.35)",
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] mb-1.5" style={{ color: "rgba(240,240,245,0.4)" }}>Pin</div>
                  <select value={pin} onChange={e => { setPin(Number(e.target.value)); handle(); }}
                    className="rounded-lg px-2 py-1.5 text-xs font-mono w-16"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(8,145,178,0.25)", color: COLOR, outline: "none" }}>
                    {Array.from({ length: 16 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              {/* Mode */}
              <div>
                <div className="text-[10px] mb-1.5" style={{ color: "rgba(240,240,245,0.4)" }}>GPIO Mode</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["Input", "Output", "Alternate", "Analog"] as Mode[]).map(m => (
                    <button key={m} onClick={() => { setMode(m); handle(); }}
                      className="py-2 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: mode === m ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${mode === m ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: mode === m ? COLOR : "rgba(240,240,245,0.35)",
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pull */}
              <div>
                <div className="text-[10px] mb-1.5" style={{ color: "rgba(240,240,245,0.4)" }}>Pull Resistor</div>
                <div className="flex gap-1.5">
                  {(["No Pull", "Pull-Up", "Pull-Down"] as Pull[]).map(p => (
                    <button key={p} onClick={() => { setPull(p); handle(); }}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                      style={{
                        background: pull === p ? "rgba(8,145,178,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${pull === p ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)"}`,
                        color: pull === p ? COLOR : "rgba(240,240,245,0.35)",
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output type & speed */}
              {(mode === "Output" || mode === "Alternate") && (
                <>
                  <div>
                    <div className="text-[10px] mb-1.5" style={{ color: "rgba(240,240,245,0.4)" }}>Output Type</div>
                    <div className="flex gap-2">
                      {(["Push-Pull", "Open-Drain"] as OutputType[]).map(t => (
                        <button key={t} onClick={() => { setOutType(t); handle(); }}
                          className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                          style={{
                            background: outType === t ? "rgba(8,145,178,0.15)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${outType === t ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)"}`,
                            color: outType === t ? COLOR : "rgba(240,240,245,0.35)",
                          }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] mb-1.5" style={{ color: "rgba(240,240,245,0.4)" }}>Speed ({speedMHz[speed]})</div>
                    <div className="flex gap-1.5">
                      {(["Low", "Medium", "High", "Very High"] as Speed[]).map(s => (
                        <button key={s} onClick={() => { setSpeed(s); handle(); }}
                          className="flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all"
                          style={{
                            background: speed === s ? "rgba(8,145,178,0.15)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${speed === s ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)"}`,
                            color: speed === s ? COLOR : "rgba(240,240,245,0.35)",
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right: generated code + toggle */}
            <div>
              <div className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.5)" }}>Generated HAL Code</div>
              <div className="p-4 rounded-xl text-[10px] font-mono leading-relaxed mb-4" style={{ background: "rgba(0,0,0,0.5)", color: "rgba(240,240,245,0.65)" }}>
                <div style={{ color: "rgba(240,240,245,0.35)" }}>// Enable GPIO clock</div>
                <div><span style={{ color: "#F59E0B" }}>__HAL_RCC_GPIO{port}_CLK_ENABLE</span>();</div>
                <div className="mt-2" style={{ color: "rgba(240,240,245,0.35)" }}>// Configure GPIO</div>
                <div><span style={{ color: "#8B5CF6" }}>GPIO_InitTypeDef</span> GPIO_InitStruct = {"{}"};</div>
                <div>GPIO_InitStruct.Pin = <span style={{ color: COLOR }}>GPIO_PIN_{pin}</span>;</div>
                <div>GPIO_InitStruct.Mode = <span style={{ color: "#10B981" }}>{modeCode[mode]}{mode === "Output" && outType === "Open-Drain" ? ".replace('PP','OD')" : ""}</span>;</div>
                {mode !== "Analog" && (
                  <div>GPIO_InitStruct.Pull = <span style={{ color: "#F59E0B" }}>
                    {pull === "No Pull" ? "GPIO_NOPULL" : pull === "Pull-Up" ? "GPIO_PULLUP" : "GPIO_PULLDOWN"}
                  </span>;</div>
                )}
                {(mode === "Output" || mode === "Alternate") && (
                  <div>GPIO_InitStruct.Speed = <span style={{ color: "#F59E0B" }}>GPIO_SPEED_FREQ_{speed.toUpperCase().replace(" ", "_")}</span>;</div>
                )}
                <div><span style={{ color: "#F59E0B" }}>HAL_GPIO_Init</span>(GPIO{port}, &GPIO_InitStruct);</div>
              </div>

              {mode === "Output" && (
                <>
                  <div className="text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.5)" }}>Toggle Pin State</div>
                  <button
                    onClick={() => setState(s => !s)}
                    className="w-full py-3 rounded-xl font-bold text-sm border transition-all mb-3"
                    style={{
                      background: state ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                      borderColor: state ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)",
                      color: state ? "#10B981" : "rgba(240,240,245,0.4)",
                    }}
                  >
                    GPIO{port}{pin}: {state ? "HIGH (3.3V)" : "LOW (0V)"}
                  </button>
                  <div className="p-3 rounded-lg text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.5)" }}>
                    <div>HAL_GPIO_WritePin(GPIO{port}, GPIO_PIN_{pin}, {state ? "GPIO_PIN_SET" : "GPIO_PIN_RESET"});</div>
                    <div style={{ color: "rgba(240,240,245,0.3)" }}>// or: HAL_GPIO_TogglePin(GPIO{port}, GPIO_PIN_{pin});</div>
                  </div>
                </>
              )}

              {mode === "Input" && (
                <div className="p-3 rounded-xl border" style={{ background: "rgba(8,145,178,0.06)", borderColor: "rgba(8,145,178,0.2)" }}>
                  <div className="text-[10px] font-mono" style={{ color: "rgba(240,240,245,0.5)" }}>
                    <div>GPIO_PinState state = HAL_GPIO_ReadPin(GPIO{port}, GPIO_PIN_{pin});</div>
                    <div style={{ color: pull === "Pull-Up" ? "#10B981" : "rgba(240,240,245,0.3)" }}>// {pull === "Pull-Up" ? "Reads HIGH when open (pull-up active)" : pull === "Pull-Down" ? "Reads LOW when open (pull-down active)" : "Floating — undefined when open!"}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
