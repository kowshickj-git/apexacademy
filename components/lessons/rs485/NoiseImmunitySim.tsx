"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#F59E0B";

function getQualityLabel(protocol: "uart" | "rs485", noise: number): { label: string; color: string } {
  if (protocol === "uart") {
    if (noise < 20) return { label: "Good", color: "#10B981" };
    if (noise < 40) return { label: "Degraded", color: COLOR };
    return { label: "Failed", color: "#EF4444" };
  } else {
    if (noise < 70) return { label: "Excellent", color: "#10B981" };
    if (noise < 85) return { label: "Good", color: COLOR };
    return { label: "Marginal", color: "#F97316" };
  }
}

export default function NoiseImmunitySim({ onUsed }: Props) {
  const [tab, setTab] = useState<"uart" | "rs485">("uart");
  const [noise, setNoise] = useState(30);
  const [called, setCalled] = useState(false);

  function handleInteract(newTab?: "uart" | "rs485", newNoise?: number) {
    if (newTab !== undefined) setTab(newTab);
    if (newNoise !== undefined) setNoise(newNoise);
    if (!called) { setCalled(true); onUsed(); }
  }

  const w = 320;
  const h = 80;
  const mid = h / 2;
  const steps = [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0];
  const noiseAmt = (noise / 100);

  function uartPath() {
    const pts: string[] = [];
    steps.forEach((v, i) => {
      const x = (i / steps.length) * w;
      const nextX = ((i + 1) / steps.length) * w;
      const noiseFactor = noiseAmt * 20;
      const y = mid - v * 28 + (Math.sin(i * 3.7 + 1) * noiseFactor);
      const nextV = steps[i + 1 < steps.length ? i + 1 : i];
      const nextNoise = noiseAmt * 20;
      const nextY = mid - nextV * 28 + (Math.sin((i + 1) * 3.7 + 1) * nextNoise);
      if (i === 0) pts.push(`M ${x} ${y}`);
      pts.push(`L ${nextX} ${y}`);
      if (i < steps.length - 1) pts.push(`L ${nextX} ${nextY}`);
    });
    return pts.join(" ");
  }

  function rs485Path() {
    const pts: string[] = [];
    const noiseFactor = Math.max(0, noiseAmt - 0.7) * 8;
    steps.forEach((v, i) => {
      const x = (i / steps.length) * w;
      const nextX = ((i + 1) / steps.length) * w;
      const y = mid - v * 28 + (Math.sin(i * 3.7) * noiseFactor);
      const nextV = steps[i + 1 < steps.length ? i + 1 : i];
      const nextY = mid - nextV * 28 + (Math.sin((i + 1) * 3.7) * noiseFactor);
      if (i === 0) pts.push(`M ${x} ${y}`);
      pts.push(`L ${nextX} ${y}`);
      if (i < steps.length - 1) pts.push(`L ${nextX} ${nextY}`);
    });
    return pts.join(" ");
  }

  const q = getQualityLabel(tab, noise);
  const path = tab === "uart" ? uartPath() : rs485Path();
  const strokeColor = tab === "uart"
    ? (noise > 40 ? "#EF4444" : noise > 20 ? COLOR : "#10B981")
    : (noise > 85 ? COLOR : "#10B981");

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 04 · Comparison Simulator
        </p>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#F0F0F5" }}>Noise Immunity Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Compare how UART and RS485 handle electrical noise. UART fails around 20% noise; RS485 survives 80%+.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["uart", "rs485"] as const).map(t => (
            <button
              key={t}
              onClick={() => handleInteract(t)}
              className="px-5 py-2 rounded-xl font-bold text-sm transition-all"
              style={{
                background: tab === t
                  ? (t === "uart" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)")
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${tab === t ? (t === "uart" ? "rgba(239,68,68,0.4)" : "rgba(245,158,11,0.4)") : "rgba(255,255,255,0.08)"}`,
                color: tab === t ? (t === "uart" ? "#EF4444" : COLOR) : "rgba(240,240,245,0.4)",
              }}
            >
              {t === "uart" ? "UART (Single-ended)" : "RS485 (Differential)"}
            </button>
          ))}
        </div>

        {/* Waveform display */}
        <div className="rounded-2xl border p-5 mb-5" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.35)" }}>
              {tab === "uart" ? "Single-ended signal" : "Differential recovered signal"}
            </span>
            <span className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.35)" }}>Noise: {noise}%</span>
          </div>
          <svg width={w} height={h} className="w-full" viewBox={`0 0 ${w} ${h}`}>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(f => (
              <line key={f} x1="0" y1={h * f} x2={w} y2={h * f} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
            {/* Signal */}
            <path d={path} stroke={strokeColor} strokeWidth="2" fill="none" />
          </svg>

          {/* Signal quality */}
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 rounded-full" style={{ background: q.color }} />
            <span className="text-xs font-bold" style={{ color: q.color }}>Signal Quality: {q.label}</span>
          </div>
        </div>

        {/* Noise slider */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-2" style={{ color: "rgba(240,240,245,0.45)" }}>
            <span>Noise Level</span>
            <span className="font-mono font-bold" style={{ color: noise > 40 && tab === "uart" ? "#EF4444" : COLOR }}>{noise}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={noise}
            onChange={e => handleInteract(undefined, Number(e.target.value))}
            className="w-full"
            style={{ accentColor: COLOR }}
          />
        </div>

        {/* Comparison stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}>
            <div className="text-xs font-bold mb-1" style={{ color: "#EF4444" }}>UART fails at:</div>
            <div className="text-sm font-mono" style={{ color: "#F0F0F5" }}>~20% noise</div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Single-ended is fragile</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)" }}>
            <div className="text-xs font-bold mb-1" style={{ color: COLOR }}>RS485 survives:</div>
            <div className="text-sm font-mono" style={{ color: "#F0F0F5" }}>80%+ noise</div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Common-mode rejection</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
