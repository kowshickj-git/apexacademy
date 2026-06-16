"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#06B6D4";

export default function PWMSim({ onUse }: Props) {
  const [freq, setFreq] = useState(1000);
  const [duty, setDuty] = useState(50);
  const [called, setCalled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

  function handleChange() {
    if (!called) { setCalled(true); onUse(); }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cycles = 3;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += W / 12) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += H / 4) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Labels
      ctx.fillStyle = "rgba(240,240,245,0.2)";
      ctx.font = "9px monospace";
      ctx.fillText("3.3V", 4, 12);
      ctx.fillText("0V", 4, H - 4);

      // Waveform
      ctx.strokeStyle = COLOR;
      ctx.lineWidth = 2;
      ctx.shadowColor = COLOR;
      ctx.shadowBlur = 4;
      ctx.beginPath();

      const periodPx = W / cycles;
      const highPx = periodPx * (duty / 100);
      const offset = offsetRef.current % periodPx;

      let x = 0;
      let inHigh = offset < highPx;

      ctx.moveTo(0, inHigh ? H * 0.15 : H * 0.85);

      while (x < W) {
        const cyclePos = (x + offset) % periodPx;
        const nextBoundary = inHigh
          ? (highPx - cyclePos + periodPx) % periodPx
          : (periodPx - cyclePos + periodPx) % periodPx;
        const nextX = Math.min(x + nextBoundary, W);

        ctx.lineTo(nextX, inHigh ? H * 0.15 : H * 0.85);
        if (nextX < W) {
          ctx.lineTo(nextX, inHigh ? H * 0.85 : H * 0.15);
          inHigh = !inHigh;
        }
        x = nextX;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill area
      ctx.fillStyle = `${COLOR}15`;
      ctx.beginPath();
      x = 0;
      inHigh = (offsetRef.current % periodPx) < highPx;
      ctx.moveTo(0, H);
      ctx.lineTo(0, inHigh ? H * 0.15 : H * 0.85);
      while (x < W) {
        const cyclePos = (x + offsetRef.current) % periodPx;
        const nextBoundary = inHigh
          ? (highPx - cyclePos + periodPx) % periodPx
          : (periodPx - cyclePos + periodPx) % periodPx;
        const nextX = Math.min(x + nextBoundary, W);
        ctx.lineTo(nextX, inHigh ? H * 0.15 : H * 0.85);
        if (nextX < W) { ctx.lineTo(nextX, inHigh ? H * 0.85 : H * 0.15); inHigh = !inHigh; }
        x = nextX;
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();

      offsetRef.current = (offsetRef.current + 0.8) % periodPx;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [freq, duty]);

  const period = 1 / freq;
  const onTime = period * (duty / 100);
  const offTime = period * (1 - duty / 100);
  const brightness = duty;

  const freqDisplay = freq >= 1000 ? `${(freq / 1000).toFixed(1)} kHz` : `${freq} Hz`;

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 06 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>PWM Visualizer</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          ESP32 has 16 PWM channels via the LEDC peripheral. Adjust frequency and duty cycle.
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.2)" }}>
          {/* Waveform canvas */}
          <canvas
            ref={canvasRef}
            width={560}
            height={120}
            className="w-full rounded-xl mb-5"
            style={{ background: "rgba(0,0,0,0.5)" }}
          />

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: "rgba(240,240,245,0.5)" }}>Frequency</span>
                <span className="font-mono font-bold" style={{ color: COLOR }}>{freqDisplay}</span>
              </div>
              <input
                type="range" min={1} max={40000} value={freq}
                onChange={e => { setFreq(Number(e.target.value)); handleChange(); }}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] mt-1" style={{ color: "rgba(240,240,245,0.25)" }}>
                <span>1 Hz</span><span>40 kHz</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: "rgba(240,240,245,0.5)" }}>Duty Cycle</span>
                <span className="font-mono font-bold" style={{ color: COLOR }}>{duty}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={duty}
                onChange={e => { setDuty(Number(e.target.value)); handleChange(); }}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] mt-1" style={{ color: "rgba(240,240,245,0.25)" }}>
                <span>0%</span><span>100%</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {[
              { label: "Frequency", value: freqDisplay },
              { label: "Period", value: period < 0.001 ? `${(period * 1e6).toFixed(1)} µs` : `${(period * 1000).toFixed(2)} ms` },
              { label: "ON time", value: onTime < 0.001 ? `${(onTime * 1e6).toFixed(1)} µs` : `${(onTime * 1000).toFixed(2)} ms` },
              { label: "OFF time", value: offTime < 0.001 ? `${(offTime * 1e6).toFixed(1)} µs` : `${(offTime * 1000).toFixed(2)} ms` },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center border" style={{ background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.15)" }}>
                <div className="text-[9px] mb-0.5" style={{ color: "rgba(240,240,245,0.35)" }}>{s.label}</div>
                <div className="text-xs font-mono font-bold" style={{ color: COLOR }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* LED brightness */}
          <div className="flex items-center gap-4 p-3 rounded-xl border" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>LED Brightness:</div>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${brightness}%` }}
                style={{ background: `linear-gradient(90deg, ${COLOR}60, ${COLOR})` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                background: `rgba(6,182,212,${duty / 100})`,
                borderColor: `rgba(6,182,212,${0.3 + duty / 200})`,
                boxShadow: duty > 10 ? `0 0 ${duty / 4}px rgba(6,182,212,0.5)` : "none",
              }}
            />
          </div>

          {/* Code */}
          <div className="mt-4 p-3 rounded-xl text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.5)" }}>
            <div>ledcSetup(0, {freq}, 8); <span style={{ color: "rgba(240,240,245,0.3)" }}>// channel 0, {freqDisplay}, 8-bit</span></div>
            <div>ledcAttachPin(2, 0); <span style={{ color: "rgba(240,240,245,0.3)" }}>// GPIO2</span></div>
            <div>ledcWrite(0, {Math.round(duty * 255 / 100)}); <span style={{ color: "rgba(240,240,245,0.3)" }}>// {duty}% duty</span></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
