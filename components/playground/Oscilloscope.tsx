"use client";
// VirtualOscilloscope — a real-data scope for the APEX playground.
// Samples live pin voltages from the avr8js sim (ScopeSampler @10 kHz) and renders
// on Canvas at 60 fps: grid, 2 channels, time/V-div, trigger, cursors, measurements,
// and an educational signal explainer. No synthetic waveforms — true circuit state.

import { useEffect, useRef, useState } from "react";
import type { ScopeSampler, ScopeMeasurements } from "@/lib/playground/engine/scope";
import { measure, findTrigger } from "@/lib/playground/engine/scope";

const TIME_DIVS = [1, 2, 5, 10, 20, 50, 100, 200]; // ms/div
const VOLT_DIVS = [0.2, 0.5, 1, 2, 5]; // V/div
const PROBES = ["off", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5"];
const DIVX = 10;
const DIVY = 8;

interface Channel {
  pin: string;
  vdiv: number;
  zeroDiv: number; // 0 V position, divisions from centre (+ up)
  color: string;
  on: boolean;
}

interface Props {
  samplerRef: React.RefObject<ScopeSampler | null>;
  running: boolean;
}

export default function Oscilloscope({ samplerRef, running }: Props) {
  const [chA, setChA] = useState<Channel>({ pin: "13", vdiv: 1, zeroDiv: -2, color: "#34d399", on: true });
  const [chB, setChB] = useState<Channel>({ pin: "off", vdiv: 1, zeroDiv: -3.2, color: "#fbbf24", on: false });
  const [timeDiv, setTimeDiv] = useState(5);
  const [trigSrc, setTrigSrc] = useState<"A" | "B">("A");
  const [trigEdge, setTrigEdge] = useState<"rising" | "falling">("rising");
  const [trigLevel, setTrigLevel] = useState(2.5);
  const [trigMode, setTrigMode] = useState<"auto" | "normal">("auto");
  const [paused, setPaused] = useState(false);
  const [cursors, setCursors] = useState(false);
  const [cur, setCur] = useState({ t1: 0.3, t2: 0.6, v1: 0.4, v2: 0.7 }); // fractions of canvas
  const [mA, setMA] = useState<ScopeMeasurements | null>(null);
  const [mB, setMB] = useState<ScopeMeasurements | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cfgRef = useRef<{
    chA: Channel; chB: Channel; timeDiv: number; trigSrc: "A" | "B"; trigEdge: "rising" | "falling"; trigLevel: number; trigMode: "auto" | "normal"; paused: boolean; cursors: boolean; cur: typeof cur;
  } | null>(null);
  cfgRef.current = { chA, chB, timeDiv, trigSrc, trigEdge, trigLevel, trigMode, paused, cursors, cur };

  // Render loop.
  useEffect(() => {
    let raf = 0;
    let measTick = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      const cfg = cfgRef.current;
      if (!canvas || !wrap || !cfg) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const pxX = W / DIVX;
      const pxY = H / DIVY;
      const windowMs = cfg.timeDiv * DIVX;

      // ── grid ──
      ctx.fillStyle = "#070a10";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(56,189,248,0.10)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= DIVX; i++) {
        ctx.moveTo(i * pxX, 0);
        ctx.lineTo(i * pxX, H);
      }
      for (let i = 0; i <= DIVY; i++) {
        ctx.moveTo(0, i * pxY);
        ctx.lineTo(W, i * pxY);
      }
      ctx.stroke();
      // centre cross
      ctx.strokeStyle = "rgba(56,189,248,0.25)";
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      const sampler = samplerRef.current;
      if (sampler) {
        sampler.probeA = cfg.chA.on && cfg.chA.pin !== "off" ? cfg.chA.pin : null;
        sampler.probeB = cfg.chB.on && cfg.chB.pin !== "off" ? cfg.chB.pin : null;
      }
      const channels: Array<{ ch: Channel; key: "A" | "B" }> = [];
      if (cfg.chA.on && cfg.chA.pin !== "off") channels.push({ ch: cfg.chA, key: "A" });
      if (cfg.chB.on && cfg.chB.pin !== "off") channels.push({ ch: cfg.chB, key: "B" });

      if (sampler && running) {
        const now = sampler.nowMs();
        // trigger reference time → place at 10% from left
        let tStart = now - windowMs;
        const trigCh = channels.find((c) => c.key === cfg.trigSrc);
        if (trigCh && !cfg.paused) {
          const tw = sampler.window(cfg.trigSrc, windowMs * 1.5);
          const tt = findTrigger(tw, cfg.trigLevel, cfg.trigEdge);
          if (tt !== null) tStart = tt - windowMs * 0.1;
        }

        for (const { ch, key } of channels) {
          const win = sampler.window(key, windowMs * 1.6);
          if (!win.v.length) continue;
          // 0 V line
          const zeroY = H / 2 - ch.zeroDiv * pxY;
          ctx.strokeStyle = ch.color + "33";
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(0, zeroY);
          ctx.lineTo(W, zeroY);
          ctx.stroke();
          ctx.setLineDash([]);
          // trace
          ctx.strokeStyle = ch.color;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < win.t.length; i++) {
            const x = ((win.t[i] - tStart) / windowMs) * W;
            if (x < -2 || x > W + 2) continue;
            const y = H / 2 - (ch.zeroDiv + win.v[i] / ch.vdiv) * pxY;
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // measurements (~8 Hz)
        if (++measTick % 8 === 0) {
          setMA(cfg.chA.on && cfg.chA.pin !== "off" ? measure(sampler.window("A", windowMs)) : null);
          setMB(cfg.chB.on && cfg.chB.pin !== "off" ? measure(sampler.window("B", windowMs)) : null);
        }
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "13px monospace";
        ctx.textAlign = "center";
        ctx.fillText(running ? "no active channel" : "▶ Run the simulation to capture signals", W / 2, H / 2 - 6);
        ctx.textAlign = "left";
      }

      // trigger level marker
      if (channels.length) {
        const tch = channels.find((c) => c.key === cfg.trigSrc) ?? channels[0];
        const ty = H / 2 - (tch.ch.zeroDiv + cfg.trigLevel / tch.ch.vdiv) * pxY;
        ctx.fillStyle = "#f87171";
        ctx.beginPath();
        ctx.moveTo(W - 8, ty - 4);
        ctx.lineTo(W, ty);
        ctx.lineTo(W - 8, ty + 4);
        ctx.fill();
      }

      // cursors
      if (cfg.cursors) {
        const x1 = cfg.cur.t1 * W;
        const x2 = cfg.cur.t2 * W;
        const y1 = cfg.cur.v1 * H;
        const y2 = cfg.cur.v2 * H;
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, 0); ctx.lineTo(x1, H);
        ctx.moveTo(x2, 0); ctx.lineTo(x2, H);
        ctx.strokeStyle = "#22d3ee";
        ctx.moveTo(0, y1); ctx.lineTo(W, y1);
        ctx.moveTo(0, y2); ctx.lineTo(W, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        const dtMs = Math.abs(cfg.cur.t2 - cfg.cur.t1) * windowMs;
        const dV = Math.abs(cfg.cur.v2 - cfg.cur.v1) * DIVY * cfg.chA.vdiv;
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "11px monospace";
        ctx.fillText(`Δt=${dtMs.toFixed(2)}ms  1/Δt=${dtMs > 0 ? (1000 / dtMs).toFixed(1) : "—"}Hz  ΔV=${dV.toFixed(2)}V`, 8, H - 8);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [running, samplerRef]);

  // Cursor dragging.
  const dragRef = useRef<null | "t1" | "t2" | "v1" | "v2">(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!cursors) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    const near = (a: number, b: number) => Math.abs(a - b) < 0.03;
    let target: typeof dragRef.current = null;
    if (near(fx, cur.t1)) target = "t1";
    else if (near(fx, cur.t2)) target = "t2";
    else if (near(fy, cur.v1)) target = "v1";
    else if (near(fy, cur.v2)) target = "v2";
    if (target) {
      dragRef.current = target;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const fy = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const d = dragRef.current;
    setCur((c) => ({ ...c, [d]: d.startsWith("t") ? fx : fy }));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0e]">
      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2 border-b border-white/10 text-[11px]">
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Oscilloscope</span>
        <ChannelControls label="A" ch={chA} setCh={setChA} />
        <ChannelControls label="B" ch={chB} setCh={setChB} />
        <Group label="Time/div">
          <Select value={timeDiv} onChange={(v) => setTimeDiv(Number(v))} options={TIME_DIVS.map((t) => ({ value: t, label: t >= 1000 ? `${t / 1000}s` : `${t}ms` }))} />
        </Group>
        <Group label="Trigger">
          <Select value={trigSrc} onChange={(v) => setTrigSrc(v as "A" | "B")} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }]} />
          <button onClick={() => setTrigEdge((e) => (e === "rising" ? "falling" : "rising"))} className="px-1.5 py-0.5 rounded bg-white/5 text-white/70">
            {trigEdge === "rising" ? "↑" : "↓"}
          </button>
          <input type="range" min={0} max={5} step={0.1} value={trigLevel} onChange={(e) => setTrigLevel(Number(e.target.value))} className="w-16 slider-secondary" />
          <span className="text-white/50 font-mono w-8">{trigLevel.toFixed(1)}V</span>
          <button onClick={() => setTrigMode((m) => (m === "auto" ? "normal" : "auto"))} className="px-1.5 py-0.5 rounded bg-white/5 text-white/70 uppercase">
            {trigMode}
          </button>
        </Group>
        <button onClick={() => setPaused((p) => !p)} className={`px-2 py-1 rounded font-bold ${paused ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/15 text-emerald-300"}`}>
          {paused ? "❚❚ Hold" : "▶ Live"}
        </button>
        <button onClick={() => setCursors((c) => !c)} className={`px-2 py-1 rounded font-semibold ${cursors ? "bg-purple-500/20 text-purple-300" : "bg-white/5 text-white/50"}`}>
          Cursors
        </button>
        <button onClick={autoScale} className="px-2 py-1 rounded font-semibold bg-white/5 text-white/70 hover:bg-white/10">
          Auto
        </button>
      </div>

      {/* Scope screen */}
      <div ref={wrapRef} className="relative flex-1 min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </div>

      {/* Measurements + educational */}
      <div className="border-t border-white/10 px-3 py-2 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.2fr] gap-3">
        <Measure label="Channel A" color={chA.color} m={mA} on={chA.on && chA.pin !== "off"} pin={chA.pin} />
        <Measure label="Channel B" color={chB.color} m={mB} on={chB.on && chB.pin !== "off"} pin={chB.pin} />
        <div className="text-[11px] leading-relaxed">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1">What you&apos;re seeing</p>
          <p className="text-white/70">{explain(mA, chA.pin)}</p>
        </div>
      </div>
    </div>
  );

  function autoScale() {
    const m = mA;
    if (!m) return;
    const span = Math.max(0.4, m.pp);
    const vdiv = VOLT_DIVS.find((d) => d * (DIVY - 2) >= span) ?? 5;
    setChA((c) => ({ ...c, vdiv, zeroDiv: -(m.min / vdiv) - 2 }));
    if (m.freq > 0) {
      const targetWindow = (1000 / m.freq) * 3; // ~3 periods
      const td = TIME_DIVS.reduce((best, t) => (Math.abs(t * DIVX - targetWindow) < Math.abs(best * DIVX - targetWindow) ? t : best), TIME_DIVS[0]);
      setTimeDiv(td);
    }
  }
}

function ChannelControls({ label, ch, setCh }: { label: string; ch: Channel; setCh: React.Dispatch<React.SetStateAction<Channel>> }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setCh((c) => ({ ...c, on: !c.on }))} className="w-3 h-3 rounded-full border" style={{ background: ch.on ? ch.color : "transparent", borderColor: ch.color }} aria-label={`Channel ${label}`} />
      <span className="font-bold" style={{ color: ch.color }}>{label}</span>
      <Select value={ch.pin} onChange={(v) => setCh((c) => ({ ...c, pin: String(v) }))} options={PROBES.map((p) => ({ value: p, label: p === "off" ? "off" : p.startsWith("A") ? p : `D${p}` }))} />
      <Select value={ch.vdiv} onChange={(v) => setCh((c) => ({ ...c, vdiv: Number(v) }))} options={VOLT_DIVS.map((d) => ({ value: d, label: `${d}V` }))} />
      <button onClick={() => setCh((c) => ({ ...c, zeroDiv: c.zeroDiv + 0.5 }))} className="px-1 text-white/40 hover:text-white">▲</button>
      <button onClick={() => setCh((c) => ({ ...c, zeroDiv: c.zeroDiv - 0.5 }))} className="px-1 text-white/40 hover:text-white">▼</button>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-white/40">{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string | number; onChange: (v: string) => void; options: { value: string | number; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[11px] text-white">
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Measure({ label, color, m, on, pin }: { label: string; color: string; m: ScopeMeasurements | null; on: boolean; pin: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-mono mb-1" style={{ color }}>
        {label} {on ? `· ${pin.startsWith("A") ? pin : "D" + pin}` : "· off"}
      </p>
      {!on || !m ? (
        <p className="text-white/30 text-[11px] font-mono">—</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono">
          <Row k="Vpp" v={`${m.pp.toFixed(2)} V`} />
          <Row k="Vrms" v={`${m.rms.toFixed(2)} V`} />
          <Row k="Vmax" v={`${m.max.toFixed(2)} V`} />
          <Row k="Vmin" v={`${m.min.toFixed(2)} V`} />
          <Row k="Vavg" v={`${m.avg.toFixed(2)} V`} />
          <Row k="Duty" v={`${m.duty.toFixed(0)} %`} />
          <Row k="Freq" v={m.freq > 0 ? `${m.freq.toFixed(0)} Hz` : "—"} />
          <Row k="Period" v={m.period > 0 ? `${m.period.toFixed(2)} ms` : "—"} />
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/45">{k}</span>
      <span className="text-white/85">{v}</span>
    </div>
  );
}

function explain(m: ScopeMeasurements | null, pin: string): string {
  if (!m) return "Run the simulation and pick a probe pin to see a live waveform.";
  if (m.pp < 0.3) return `A steady DC level around ${m.avg.toFixed(2)} V — the pin isn't switching. digitalWrite holds a constant level; this is a logic ${m.avg > 2.5 ? "HIGH (5 V)" : "LOW (0 V)"}.`;
  const digital = m.pp > 4 && m.max > 4.5 && m.min < 0.5;
  if (digital && m.duty > 44 && m.duty < 56) {
    return `A square wave at ${m.freq.toFixed(0)} Hz (period ${m.period.toFixed(2)} ms), 50% duty. Square/clock signals like this drive digital timing, blinking, and switching.`;
  }
  if (digital) {
    return `A PWM signal: ${m.duty.toFixed(0)}% duty at ${m.freq.toFixed(0)} Hz. The pin is HIGH ${m.duty.toFixed(0)}% of each cycle, so the average voltage ≈ ${(m.duty / 100 * 5).toFixed(2)} V — that's how analogWrite() dims LEDs and sets motor speed.`;
  }
  return `An analog signal varying between ${m.min.toFixed(2)} and ${m.max.toFixed(2)} V (avg ${m.avg.toFixed(2)} V). This is a sensor/voltage reading — e.g. an LDR, LM35, or potentiometer changing the pin voltage that analogRead() digitises.`;
}
