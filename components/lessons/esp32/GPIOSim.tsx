"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#06B6D4";

const PINS = [
  { num: 0, name: "GPIO0", inputOnly: false, special: "Boot" },
  { num: 2, name: "GPIO2", inputOnly: false, special: "LED" },
  { num: 4, name: "GPIO4", inputOnly: false, special: "" },
  { num: 5, name: "GPIO5", inputOnly: false, special: "SPI CS" },
  { num: 12, name: "GPIO12", inputOnly: false, special: "" },
  { num: 13, name: "GPIO13", inputOnly: false, special: "" },
  { num: 14, name: "GPIO14", inputOnly: false, special: "" },
  { num: 15, name: "GPIO15", inputOnly: false, special: "" },
  { num: 16, name: "GPIO16", inputOnly: false, special: "UART2 RX" },
  { num: 17, name: "GPIO17", inputOnly: false, special: "UART2 TX" },
  { num: 21, name: "GPIO21", inputOnly: false, special: "I2C SDA" },
  { num: 22, name: "GPIO22", inputOnly: false, special: "I2C SCL" },
  { num: 34, name: "GPIO34", inputOnly: true, special: "Input Only" },
  { num: 35, name: "GPIO35", inputOnly: true, special: "Input Only" },
  { num: 36, name: "GPIO36", inputOnly: true, special: "VP/ADC" },
  { num: 39, name: "GPIO39", inputOnly: true, special: "VN/ADC" },
];

type Mode = "INPUT" | "OUTPUT" | "INPUT_PULLUP";

export default function GPIOSim({ onUse }: Props) {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("OUTPUT");
  const [outputHigh, setOutputHigh] = useState(false);
  const [called, setCalled] = useState(false);

  const pin = PINS.find(p => p.num === selectedPin);

  function selectPin(num: number) {
    if (!called) { setCalled(true); onUse(); }
    setSelectedPin(num);
    const p = PINS.find(x => x.num === num);
    if (p?.inputOnly) setMode("INPUT");
    else setMode("OUTPUT");
    setOutputHigh(false);
  }

  function toggleOutput() {
    if (mode === "OUTPUT") setOutputHigh(h => !h);
  }

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 05 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>GPIO Configurator</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          Select a pin, configure its mode, and read/write its digital value.
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.2)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pin selector */}
            <div>
              <div className="text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.5)" }}>Select GPIO Pin</div>
              <div className="grid grid-cols-4 gap-1.5">
                {PINS.map(p => (
                  <button
                    key={p.num}
                    onClick={() => selectPin(p.num)}
                    className="p-2 rounded-xl text-center transition-all"
                    style={{
                      background: selectedPin === p.num ? (p.inputOnly ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.15)") : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selectedPin === p.num ? (p.inputOnly ? "rgba(239,68,68,0.4)" : "rgba(6,182,212,0.4)") : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div className="text-[10px] font-mono font-bold" style={{ color: p.inputOnly ? "#EF4444" : "#F0F0F5" }}>{p.num}</div>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2 text-[9px]">
                <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.12)", color: COLOR }}>● I/O</span>
                <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>● Input Only (34-39)</span>
              </div>
            </div>

            {/* Config panel */}
            <div>
              {pin ? (
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: COLOR }}>{pin.name} {pin.special && `(${pin.special})`}</div>

                  {/* Mode selector */}
                  <div className="text-[10px] mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>pinMode()</div>
                  <div className="flex gap-1.5 mb-4">
                    {(["INPUT", "OUTPUT", "INPUT_PULLUP"] as Mode[]).map(m => (
                      <button
                        key={m}
                        onClick={() => { if (!pin.inputOnly || m !== "OUTPUT") setMode(m); }}
                        disabled={pin.inputOnly && m === "OUTPUT"}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all disabled:opacity-30"
                        style={{
                          background: mode === m ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${mode === m ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.08)"}`,
                          color: mode === m ? COLOR : "rgba(240,240,245,0.4)",
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Code preview */}
                  <div className="mb-4 p-2.5 rounded-lg text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.6)" }}>
                    <div>pinMode({pin.num}, {mode});</div>
                    {mode === "OUTPUT" && (
                      <div>digitalWrite({pin.num}, {outputHigh ? "HIGH" : "LOW"});</div>
                    )}
                    {mode !== "OUTPUT" && (
                      <div>int val = digitalRead({pin.num}); <span style={{ color: "#10B981" }}>// {outputHigh ? 1 : 0}</span></div>
                    )}
                  </div>

                  {/* Toggle / Read */}
                  {mode === "OUTPUT" ? (
                    <button
                      onClick={toggleOutput}
                      className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all"
                      style={{
                        borderColor: outputHigh ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.15)",
                        background: outputHigh ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                        color: outputHigh ? "#10B981" : "rgba(240,240,245,0.5)",
                      }}
                    >
                      {outputHigh ? "HIGH (3.3V)" : "LOW (0V)"} — Click to Toggle
                    </button>
                  ) : (
                    <div
                      className="w-full py-2.5 rounded-xl font-bold text-sm border text-center"
                      style={{ borderColor: "rgba(6,182,212,0.25)", background: "rgba(6,182,212,0.08)", color: COLOR }}
                    >
                      digitalRead → {mode === "INPUT_PULLUP" ? "1 (pulled HIGH)" : "0 or 1"}
                    </div>
                  )}

                  {/* State indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 rounded-full border-2"
                      animate={{ background: mode === "OUTPUT" && outputHigh ? "#10B981" : "rgba(255,255,255,0.1)" }}
                      style={{ borderColor: "rgba(255,255,255,0.15)" }}
                    />
                    <span className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>
                      Pin state: {mode === "OUTPUT" ? (outputHigh ? "HIGH 3.3V" : "LOW 0V") : "Input mode"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center" style={{ color: "rgba(240,240,245,0.2)", fontSize: "13px" }}>
                  Select a pin to configure
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
