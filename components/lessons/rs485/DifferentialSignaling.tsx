"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#F59E0B";

export default function DifferentialSignaling() {
  const [showNoise, setShowNoise] = useState(false);

  // SVG waveform points
  const w = 300;
  const h = 60;
  const mid = h / 2;

  // Single-ended waveform (square wave, optionally noisy)
  function singleEndedPath(noisy: boolean) {
    const pts: string[] = [];
    const steps = [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1];
    steps.forEach((v, i) => {
      const x = (i / steps.length) * w;
      const nextX = ((i + 1) / steps.length) * w;
      const y = noisy ? mid - v * 28 + (Math.sin(i * 2.3) * 8) : mid - v * 28;
      const nextY = noisy ? mid - steps[i + 1 < steps.length ? i + 1 : i] * 28 + (Math.sin((i + 1) * 2.3) * 8) : mid - steps[i + 1 < steps.length ? i + 1 : i] * 28;
      if (i === 0) pts.push(`M ${x} ${y}`);
      pts.push(`L ${nextX} ${y}`);
      if (i < steps.length - 1) pts.push(`L ${nextX} ${nextY}`);
    });
    return pts.join(" ");
  }

  // Differential A line
  function lineAPath(noisy: boolean) {
    const pts: string[] = [];
    const steps = [1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1];
    steps.forEach((v, i) => {
      const x = (i / steps.length) * w;
      const nextX = ((i + 1) / steps.length) * w;
      const noise = noisy ? 7 : 0;
      const y = mid - v * 18 + noise;
      const nextV = steps[i + 1 < steps.length ? i + 1 : i];
      const nextY = mid - nextV * 18 + noise;
      if (i === 0) pts.push(`M ${x} ${y}`);
      pts.push(`L ${nextX} ${y}`);
      if (i < steps.length - 1) pts.push(`L ${nextX} ${nextY}`);
    });
    return pts.join(" ");
  }

  // Differential B line (inverted)
  function lineBPath(noisy: boolean) {
    const pts: string[] = [];
    const steps = [-1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1];
    steps.forEach((v, i) => {
      const x = (i / steps.length) * w;
      const nextX = ((i + 1) / steps.length) * w;
      const noise = noisy ? 7 : 0;
      const y = mid - v * 18 + noise;
      const nextV = steps[i + 1 < steps.length ? i + 1 : i];
      const nextY = mid - nextV * 18 + noise;
      if (i === 0) pts.push(`M ${x} ${y}`);
      pts.push(`L ${nextX} ${y}`);
      if (i < steps.length - 1) pts.push(`L ${nextX} ${nextY}`);
    });
    return pts.join(" ");
  }

  // Recovered differential (always clean)
  function diffRecoveredPath() {
    const pts: string[] = [];
    const steps = [1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1];
    steps.forEach((v, i) => {
      const x = (i / steps.length) * w;
      const nextX = ((i + 1) / steps.length) * w;
      const y = mid - v * 20;
      const nextV = steps[i + 1 < steps.length ? i + 1 : i];
      const nextY = mid - nextV * 20;
      if (i === 0) pts.push(`M ${x} ${y}`);
      pts.push(`L ${nextX} ${y}`);
      if (i < steps.length - 1) pts.push(`L ${nextX} ${nextY}`);
    });
    return pts.join(" ");
  }

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 02 · Signal Theory
        </p>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#F0F0F5" }}>Differential Signaling</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          RS485 uses two wires (A and B) that carry inverted copies of the signal. The receiver measures the
          difference between A and B, not absolute voltage — eliminating any noise that affects both wires equally.
        </p>

        {/* Single-ended vs Differential comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Single-ended */}
          <div className="rounded-2xl p-5 border" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
            <div className="text-sm font-bold mb-1" style={{ color: "#EF4444" }}>Single-Ended (UART)</div>
            <div className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.45)" }}>
              Signal voltage measured relative to GND. Noise corrupts data.
            </div>
            <svg width={w} height={h} className="w-full" viewBox={`0 0 ${w} ${h}`}>
              <line x1="0" y1={mid} x2={w} y2={mid} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path d={singleEndedPath(showNoise)} stroke="#EF4444" strokeWidth="2" fill="none" />
            </svg>
            <div className="mt-2 text-[10px] font-mono" style={{ color: showNoise ? "#EF4444" : "rgba(240,240,245,0.3)" }}>
              {showNoise ? "❌ Corrupted by noise" : "✓ Clean (but fragile)"}
            </div>
          </div>

          {/* Differential */}
          <div className="rounded-2xl p-5 border" style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
            <div className="text-sm font-bold mb-1" style={{ color: COLOR }}>RS485 Differential</div>
            <div className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.45)" }}>
              A and B lines carry inverted signals. Receiver takes A−B.
            </div>
            <svg width={w} height={h} className="w-full" viewBox={`0 0 ${w} ${h}`}>
              <line x1="0" y1={mid} x2={w} y2={mid} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path d={lineAPath(showNoise)} stroke={COLOR} strokeWidth="1.5" fill="none" opacity="0.9" />
              <path d={lineBPath(showNoise)} stroke="#60A5FA" strokeWidth="1.5" fill="none" opacity="0.7" strokeDasharray="4 2" />
            </svg>
            <div className="flex gap-3 mt-1 text-[9px] font-mono">
              <span style={{ color: COLOR }}>— A line</span>
              <span style={{ color: "#60A5FA" }}>--- B line (inverted)</span>
            </div>
          </div>
        </div>

        {/* Recovered signal */}
        <div className="rounded-2xl p-5 border mb-6" style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}>
          <div className="text-sm font-bold mb-1" style={{ color: "#10B981" }}>Recovered Signal (A − B)</div>
          <div className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.45)" }}>
            Noise offsets both A and B equally → difference unchanged. Always clean!
          </div>
          <svg width={w} height={h} className="w-full" viewBox={`0 0 ${w} ${h}`}>
            <line x1="0" y1={mid} x2={w} y2={mid} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d={diffRecoveredPath()} stroke="#10B981" strokeWidth="2.5" fill="none" />
          </svg>
          <div className="mt-2 text-[10px] font-mono" style={{ color: "#10B981" }}>
            ✓ Clean signal regardless of noise level
          </div>
        </div>

        {/* Logic levels */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl p-4 border" style={{ background: "rgba(245,158,11,0.07)", borderColor: "rgba(245,158,11,0.2)" }}>
            <div className="text-xs font-bold mb-2" style={{ color: COLOR }}>Logic 1</div>
            <div className="font-mono text-sm mb-1" style={{ color: "#F0F0F5" }}>A − B ≥ +0.2V</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>Typically: A = +2V, B = −2V → differential = +4V</div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: "rgba(96,165,250,0.07)", borderColor: "rgba(96,165,250,0.2)" }}>
            <div className="text-xs font-bold mb-2" style={{ color: "#60A5FA" }}>Logic 0</div>
            <div className="font-mono text-sm mb-1" style={{ color: "#F0F0F5" }}>A − B ≤ −0.2V</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.45)" }}>Typically: A = −2V, B = +2V → differential = −4V</div>
          </div>
        </div>

        {/* Common-mode range */}
        <div className="rounded-xl p-4 border mb-6" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="text-xs font-bold mb-1" style={{ color: "#F0F0F5" }}>Common-Mode Voltage Range</div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
            RS485 receivers tolerate ±15V of common-mode voltage (both wires at the same offset from GND).
            This means even large ground potential differences between distant devices are handled gracefully.
          </div>
        </div>

        {/* Noise toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNoise(n => !n)}
            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: showNoise ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.12)",
              border: `1px solid ${showNoise ? "rgba(239,68,68,0.4)" : "rgba(245,158,11,0.35)"}`,
              color: showNoise ? "#EF4444" : COLOR,
            }}
          >
            {showNoise ? "Noise ON — watch UART fail" : "Add Noise to Signals"}
          </button>
          <span className="text-xs" style={{ color: "rgba(240,240,245,0.35)" }}>
            See why RS485 survives electrical noise
          </span>
        </div>
      </motion.div>
    </section>
  );
}
