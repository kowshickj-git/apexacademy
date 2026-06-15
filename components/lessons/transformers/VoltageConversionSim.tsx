"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onVoltageConversionUsed: () => void;
}

const INPUTS = [
  { label: "120V USA", value: 120, icon: "🇺🇸" },
  { label: "230V Europe", value: 230, icon: "🇪🇺" },
];

const OUTPUTS = [
  { label: "5V (Phone)", value: 5, icon: "📱", device: "Smartphone" },
  { label: "12V (Router)", value: 12, icon: "📶", device: "WiFi Router" },
  { label: "24V (CCTV)", value: 24, icon: "📷", device: "Security Camera" },
  { label: "48V (PoE)", value: 48, icon: "🔌", device: "PoE Switch" },
];

export default function VoltageConversionSim({ onVoltageConversionUsed }: Props) {
  const [selectedInput, setSelectedInput] = useState<number | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<number | null>(null);
  const [used, setUsed] = useState(false);
  const [animate, setAnimate] = useState(false);

  const vIn = selectedInput !== null ? INPUTS[selectedInput].value : null;
  const vOut = selectedOutput !== null ? OUTPUTS[selectedOutput].value : null;

  const npNs = vIn && vOut ? `${vIn}:${vOut}` : "—";
  const ratio = vIn && vOut ? (vIn / vOut).toFixed(2) : "—";
  const turnsRatio = vIn && vOut ? `N_p/N_s = ${vIn}/${vOut} = ${ratio}:1` : "Select input & output";

  const handleSelect = () => {
    if (!used) {
      setUsed(true);
      onVoltageConversionUsed();
    }
    setAnimate(true);
    setTimeout(() => setAnimate(false), 800);
  };

  const inputObj = selectedInput !== null ? INPUTS[selectedInput] : null;
  const outputObj = selectedOutput !== null ? OUTPUTS[selectedOutput] : null;

  const isComplete = vIn !== null && vOut !== null;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Sim 4 · Voltage Converter
        </p>
        <h2 className="text-xl font-bold mb-1">World Voltage Converter</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Select your wall socket voltage and the device you want to power. See the required transformer turns ratio.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {/* Input selection */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-mono">Wall Socket (Input)</p>
            <div className="space-y-2">
              {INPUTS.map((inp, i) => (
                <button
                  key={inp.label}
                  onClick={() => { setSelectedInput(i); handleSelect(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                  style={{
                    background: selectedInput === i ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                    borderColor: selectedInput === i ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-xl">{inp.icon}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: selectedInput === i ? "#8B5CF6" : "rgba(255,255,255,0.6)" }}>{inp.label}</p>
                    <p className="text-[10px] font-mono text-white/30">{inp.value}V AC</p>
                  </div>
                  {selectedInput === i && (
                    <svg className="ml-auto" width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Output selection */}
          <div>
            <p className="text-xs text-white/40 mb-2 font-mono">Device Output</p>
            <div className="space-y-2">
              {OUTPUTS.map((out, i) => (
                <button
                  key={out.label}
                  onClick={() => { setSelectedOutput(i); handleSelect(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                  style={{
                    background: selectedOutput === i ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
                    borderColor: selectedOutput === i ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-xl">{out.icon}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: selectedOutput === i ? "#A78BFA" : "rgba(255,255,255,0.6)" }}>{out.device}</p>
                    <p className="text-[10px] font-mono text-white/30">{out.value}V DC</p>
                  </div>
                  {selectedOutput === i && (
                    <svg className="ml-auto" width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animated result */}
        <AnimatePresence mode="wait">
          {isComplete && (
            <motion.div
              key={`${vIn}-${vOut}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border p-5"
              style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.06)" }}
            >
              {/* Journey animation */}
              <div className="flex items-center justify-between gap-2 mb-4">
                {/* Plug */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl">{inputObj?.icon}</div>
                  <span className="text-[10px] font-mono" style={{ color: "#8B5CF6" }}>{vIn}V</span>
                </div>

                {/* Arrow with animation */}
                <motion.div
                  className="flex-1 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(139,92,246,0.6), rgba(167,139,250,0.6))" }}
                  animate={animate ? { scaleX: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 0.6 }}
                />

                {/* Transformer box */}
                <div
                  className="shrink-0 rounded-xl flex items-center justify-center text-[9px] font-mono font-bold"
                  style={{ width: 44, height: 36, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.35)", color: "#8B5CF6" }}
                >
                  XFMR
                </div>

                {/* Arrow */}
                <motion.div
                  className="flex-1 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(167,139,250,0.6), rgba(196,181,253,0.6))" }}
                  animate={animate ? { scaleX: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 0.6, delay: 0.15 }}
                />

                {/* Device */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl">{outputObj?.icon}</div>
                  <span className="text-[10px] font-mono" style={{ color: "#A78BFA" }}>{vOut}V</span>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 text-center border border-white/6" style={{ background: "rgba(0,0,0,0.25)" }}>
                  <p className="text-[9px] text-white/25 font-mono uppercase mb-1">Turns Ratio (N_p:N_s)</p>
                  <p className="font-bold font-mono text-sm" style={{ color: "#8B5CF6" }}>{npNs}</p>
                </div>
                <div className="rounded-xl p-3 text-center border border-white/6" style={{ background: "rgba(0,0,0,0.25)" }}>
                  <p className="text-[9px] text-white/25 font-mono uppercase mb-1">Ratio</p>
                  <p className="font-bold font-mono text-sm" style={{ color: "#A78BFA" }}>{ratio}:1</p>
                </div>
              </div>

              <p className="text-[10px] text-white/30 mt-3 font-mono text-center">{turnsRatio}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isComplete && (
          <div
            className="rounded-2xl border border-white/6 p-6 text-center"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <p className="text-sm text-white/25">Select an input and output voltage above to see the transformer design</p>
          </div>
        )}

        {!used && (
          <p className="text-[11px] text-white/30 mt-3 text-center">Make a selection to earn +15 XP</p>
        )}
        {used && (
          <p className="text-[11px] mt-3 text-center" style={{ color: "#8B5CF6" }}>+15 XP earned!</p>
        )}
      </div>
    </section>
  );
}
