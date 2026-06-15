"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type TraceMode = "floating" | "stable";

function OscilloscopeTrace({ mode }: { mode: TraceMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const midY = H * 0.5;
    const highY = H * 0.12;
    const lowY = H * 0.88;

    const points: number[] = [];
    let lastY = midY;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Labels
      ctx.fillStyle = "rgba(245,158,11,0.5)";
      ctx.font = "10px monospace";
      ctx.fillText("3.3V", 4, highY - 4);
      ctx.fillText("0V", 4, lowY + 12);

      tRef.current += 1;

      if (mode === "floating") {
        // Random noise trace
        if (tRef.current % 4 === 0) {
          const r = Math.random();
          if (r < 0.45) lastY = highY + Math.random() * 8;
          else if (r < 0.55) lastY = midY + (Math.random() - 0.5) * 20;
          else lastY = lowY - Math.random() * 8;
        }
        points.push(lastY);
        if (points.length > W) points.shift();

        ctx.beginPath();
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#EF4444";
        points.forEach((y, x) => { x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Stable HIGH line
        ctx.beginPath();
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#10B981";
        ctx.moveTo(0, highY);
        ctx.lineTo(W, highY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={100}
      className="w-full rounded-xl"
      style={{ background: "rgba(0,0,0,0.4)" }}
    />
  );
}

export default function WhatIsFloating() {
  const [mode, setMode] = useState<TraceMode>("floating");

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 2 · The Problem
        </p>
        <h2 className="text-xl font-bold mb-4">What Is a Floating Pin?</h2>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative pl-5 mb-6"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ background: "linear-gradient(to bottom, #F59E0B, #D97706)" }} />
          <p className="text-base text-white/65 leading-relaxed">
            A <strong className="text-white/85">floating input pin</strong> has no defined voltage — it drifts based on electromagnetic
            interference, nearby power lines, capacitive coupling from other traces, and even{" "}
            <strong className="text-white/85">human touch</strong>. The microcontroller cannot reliably read it.
          </p>
        </motion.div>

        {/* Oscilloscope sim */}
        <div className="rounded-2xl border border-white/8 overflow-hidden mb-5" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="px-4 pt-3 pb-2 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/30">OSCILLOSCOPE — Pin 2 Voltage</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: mode === "floating" ? "#EF4444" : "#10B981" }} />
              <span className="text-[10px] font-mono" style={{ color: mode === "floating" ? "#EF4444" : "#10B981" }}>
                {mode === "floating" ? "UNSTABLE" : "STABLE"}
              </span>
            </div>
          </div>
          <div className="p-3">
            <OscilloscopeTrace mode={mode} />
          </div>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("floating")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style={{
              background: mode === "floating" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
              borderColor: mode === "floating" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)",
              color: mode === "floating" ? "#EF4444" : "rgba(255,255,255,0.35)",
            }}
          >
            Floating (no resistor)
          </button>
          <button
            onClick={() => setMode("stable")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style={{
              background: mode === "stable" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
              borderColor: mode === "stable" ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)",
              color: mode === "stable" ? "#10B981" : "rgba(255,255,255,0.35)",
            }}
          >
            With Pull-Up/Down
          </button>
        </div>

        {/* Formula box */}
        <div className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(245,158,11,0.04)" }}>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3">Key Formulas</p>
          <div className="space-y-2">
            {[
              { label: "Button OPEN with Pull-Up:", formula: "V_pin = V_supply (HIGH)" },
              { label: "Button OPEN with Pull-Down:", formula: "V_pin = GND = 0V (LOW)" },
              { label: "Button PRESSED with Pull-Up:", formula: "V_pin = 0V (LOW) — GND short wins" },
              { label: "Button PRESSED with Pull-Down:", formula: "V_pin = V_supply (HIGH) — Vcc wins" },
            ].map(({ label, formula }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-[11px] text-white/40 shrink-0 mt-0.5">{label}</span>
                <code className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>{formula}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
