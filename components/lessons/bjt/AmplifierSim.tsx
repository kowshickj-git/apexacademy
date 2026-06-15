"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface AmplifierSimProps {
  onAmplifierUsed: () => void;
}

export default function AmplifierSim({ onAmplifierUsed }: AmplifierSimProps) {
  const [inputMv, setInputMv] = useState(10);
  const [hasUsed, setHasUsed] = useState(false);
  const [tick, setTick] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 120), 30);
    return () => clearInterval(id);
  }, []);

  // Common emitter amplifier params
  const beta = 100;
  const RC = 1000; // 1kΩ
  const IC_Q = 1e-3; // 1mA quiescent
  const re = 0.026 / IC_Q; // 26Ω
  const gain = -(RC / re); // ≈ -38.46
  const outputMv = Math.abs(gain) * inputMv;
  const outputV = outputMv / 1000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const phase = (tick / 120) * Math.PI * 2;
    const midY = H / 2;
    const halfH = H / 2 - 10;

    // Draw grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let y = 0; y <= H; y += H / 4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let x = 0; x <= W; x += W / 4) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    // Input signal (small, top half)
    const inputScaleV = halfH * 0.3 * (inputMv / 50);
    ctx.strokeStyle = "#0EA5E9";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const t = (x / W) * 4 * Math.PI + phase;
      const y = midY / 2 - Math.sin(t) * inputScaleV;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Output signal (large, bottom half, 180° inverted)
    const outputScale = halfH * 0.75 * Math.min(outputMv / 2000, 1);
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const t = (x / W) * 4 * Math.PI + phase;
      // 180° inverted: note the + sign makes it inverted relative to input
      const y = (midY * 1.5) + Math.sin(t) * outputScale;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#0EA5E9";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`Input: ${inputMv}mV`, 8, 14);

    ctx.fillStyle = "#EF4444";
    ctx.fillText(`Output: ${outputMv.toFixed(0)}mV (inverted)`, 8, H / 2 + 14);

    // Center divider
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    ctx.setLineDash([]);

  }, [tick, inputMv, outputMv]);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMv(Number(e.target.value));
    if (!hasUsed) {
      setHasUsed(true);
      onAmplifierUsed();
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
              SIM 2
            </div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Interactive</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            BJT as an Amplifier
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Common-emitter amplifier. Slide to adjust input amplitude. Watch the output grow — and flip 180° in phase.
          </p>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {/* Oscilloscope display */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="px-3 py-1.5 flex justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-xs font-mono" style={{ color: "#0EA5E9" }}>CH1: Input</span>
              <span className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>OSCILLOSCOPE</span>
              <span className="text-xs font-mono" style={{ color: "#EF4444" }}>CH2: Output (inv)</span>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="w-full"
              style={{ display: "block" }}
            />
          </div>

          {/* Input slider */}
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: "rgba(240,240,245,0.6)" }}>Input Signal Amplitude</span>
              <span style={{ color: "#0EA5E9" }} className="font-black">{inputMv} mV</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={inputMv}
              onChange={handleSlider}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#EF4444" }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>
              <span>1 mV</span>
              <span>50 mV</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "V_in", value: `${inputMv}mV`, color: "#0EA5E9" },
              { label: "Gain (Av)", value: `${gain.toFixed(1)}`, color: "#EF4444" },
              { label: "V_out", value: `${outputMv.toFixed(0)}mV`, color: "#EF4444" },
              { label: "Phase", value: "180° inv", color: "#F87171" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>{s.label}</div>
                <div className="text-base font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Formula explanation */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            <div className="text-xs font-mono mb-2" style={{ color: "rgba(239,68,68,0.7)" }}>SMALL SIGNAL ANALYSIS</div>
            <div className="text-xs leading-relaxed space-y-1" style={{ color: "rgba(240,240,245,0.6)" }}>
              <div>• r_e = 26mV / I_C = 26mV / 1mA = <span style={{ color: "#EF4444" }}>26Ω</span></div>
              <div>• A_v = -R_C / r_e = -1000 / 26 = <span style={{ color: "#EF4444" }}>{gain.toFixed(1)}</span></div>
              <div>• V_out = A_v × V_in = {gain.toFixed(1)} × {inputMv}mV = <span style={{ color: "#EF4444" }}>{(gain * inputMv).toFixed(0)}mV</span></div>
              <div>• Negative sign = <span style={{ color: "#F87171" }}>180° phase inversion</span> (common-emitter characteristic)</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
