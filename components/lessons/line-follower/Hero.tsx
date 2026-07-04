"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AMBER, CYAN, GREEN } from "./Section";

/** Animated counter that counts up when visible */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/** Live robot-on-track animation. Direct DOM mutation via refs — no React re-renders. */
function RobotScene() {
  const lineRef = useRef<SVGPathElement>(null);
  const botRef = useRef<SVGGElement>(null);
  const sLRef = useRef<SVGCircleElement>(null);
  const sRRef = useRef<SVGCircleElement>(null);
  const beamLRef = useRef<SVGLineElement>(null);
  const beamRRef = useRef<SVGLineElement>(null);
  const readoutRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    let raf = 0;
    const W = 640, H = 360, midY = 210;
    const lineY = (x: number, phase: number) =>
      midY + 46 * Math.sin((x + phase) * 0.011) + 20 * Math.sin((x + phase) * 0.027);

    const tick = (t: number) => {
      const phase = t * 0.12;
      // rebuild the track path
      let d = "";
      for (let x = -20; x <= W + 20; x += 10) d += `${x === -20 ? "M" : "L"}${x},${lineY(x, phase).toFixed(1)} `;
      lineRef.current?.setAttribute("d", d);

      // robot follows the line at cx with slight lag → realistic hunting wobble
      const cx = 320;
      const target = lineY(cx, phase);
      const ahead = lineY(cx + 30, phase);
      const angle = Math.atan2(ahead - target, 30) * (180 / Math.PI);
      const wobble = 4 * Math.sin(t * 0.004);
      botRef.current?.setAttribute("transform", `translate(${cx},${target + wobble * 0.4}) rotate(${angle + wobble})`);

      // sensors sit 34px ahead, ±14px lateral (in robot frame → approximate in world frame)
      const rad = (angle + wobble) * (Math.PI / 180);
      const fx = Math.cos(rad) * 34, fy = Math.sin(rad) * 34;
      const lxOff = Math.sin(rad) * 14, lyOff = -Math.cos(rad) * 14;
      const px = cx + fx, py = target + wobble * 0.4 + fy;
      const check = (sx: number, sy: number) => Math.abs(sy - lineY(sx, phase)) < 9;
      const lOn = check(px + lxOff, py + lyOff);
      const rOn = check(px - lxOff, py - lyOff);
      sLRef.current?.setAttribute("fill", lOn ? "#EF4444" : "#10B981");
      sRRef.current?.setAttribute("fill", rOn ? "#EF4444" : "#10B981");
      beamLRef.current?.setAttribute("stroke", lOn ? "rgba(239,68,68,0.5)" : "rgba(16,185,129,0.35)");
      beamRRef.current?.setAttribute("stroke", rOn ? "rgba(239,68,68,0.5)" : "rgba(16,185,129,0.35)");
      if (readoutRef.current)
        readoutRef.current.textContent = `L:${lOn ? "BLACK" : "white"}  R:${rOn ? "BLACK" : "white"}  →  ${lOn && !rOn ? "TURN LEFT" : rOn && !lOn ? "TURN RIGHT" : "FORWARD"}`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg viewBox="0 0 640 360" className="w-full h-full" aria-label="Line follower robot animation">
      <defs>
        <radialGradient id="lf-floor" cx="50%" cy="55%" r="70%">
          <stop offset="0%" stopColor="#101018" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
        <linearGradient id="lf-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A2A35" />
          <stop offset="100%" stopColor="#15151D" />
        </linearGradient>
        <filter id="lf-glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      <rect width="640" height="360" fill="url(#lf-floor)" />
      {/* lab grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 53} y1="0" x2={i * 53} y2="360" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 52} x2="640" y2={i * 52} stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
      ))}

      {/* the moving black line */}
      <path ref={lineRef} d="" fill="none" stroke="#000" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
      <path fill="none" stroke={`${AMBER}22`} strokeWidth="26" strokeLinecap="round" />

      {/* robot (top view) */}
      <g ref={botRef}>
        {/* sensor beams */}
        <line ref={beamLRef} x1="18" y1="-14" x2="34" y2="-14" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <line ref={beamRRef} x1="18" y1="14" x2="34" y2="14" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        {/* wheels */}
        <rect x="-16" y="-34" width="26" height="11" rx="4" fill="#0B0B10" stroke="#333" />
        <rect x="-16" y="23" width="26" height="11" rx="4" fill="#0B0B10" stroke="#333" />
        {/* chassis */}
        <rect x="-30" y="-24" width="66" height="48" rx="12" fill="url(#lf-body)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        {/* controller board */}
        <rect x="-18" y="-12" width="30" height="24" rx="3" fill="#0E2A33" stroke={CYAN} strokeWidth="0.8" opacity="0.95" />
        <circle cx="-10" cy="-5" r="1.6" fill={CYAN} filter="url(#lf-glow)">
          <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="-10" cy="5" r="1.6" fill={GREEN}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* sensor pods */}
        <circle ref={sLRef} cx="34" cy="-14" r="5.5" fill={GREEN} filter="url(#lf-glow)" />
        <circle ref={sRRef} cx="34" cy="14" r="5.5" fill={GREEN} filter="url(#lf-glow)" />
        {/* caster */}
        <circle cx="-24" cy="0" r="4" fill="#444" stroke="#666" />
      </g>

      {/* live decision readout */}
      <rect x="150" y="316" width="340" height="30" rx="8" fill="rgba(5,5,7,0.75)" stroke="rgba(245,158,11,0.3)" />
      <text ref={readoutRef} x="320" y="335" textAnchor="middle" fontSize="12" fontFamily="monospace" fill={AMBER} />
    </svg>
  );
}

export default function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${AMBER}55, transparent 65%)` }} />
        <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${CYAN}44, transparent 65%)` }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-16 grid lg:grid-cols-2 gap-10 items-center w-full">
        {/* Left: copy */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold mb-5"
            style={{ borderColor: `${AMBER}44`, background: `${AMBER}11`, color: AMBER }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: AMBER }} />
            PROJECT LESSON · ROBOTICS ENGINEERING LAB
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.05] mb-5">
            Build Your Own{" "}
            <span style={{ background: `linear-gradient(90deg, ${AMBER}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Autonomous
            </span>{" "}
            Line Follower Robot
          </h1>
          <p className="text-white/45 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
            Learn, design, simulate, assemble, code, test, and deploy a real robot — all on this page.
            From your first IR sensor to a tuned PID controller, this is a complete engineering
            laboratory in your browser. No experience required.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <button onClick={() => scrollTo("build")}
              className="px-6 py-3 rounded-xl font-bold text-sm text-black transition-transform hover:scale-[1.03] active:scale-95"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FBBF24)`, boxShadow: `0 8px 32px ${AMBER}44` }}>
              🔧 Start Building
            </button>
            <button onClick={() => scrollTo("arena")}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/10 border"
              style={{ borderColor: `${CYAN}55`, color: CYAN, background: `${CYAN}0d` }}>
              ▶ Try Simulation
            </button>
            <button onClick={() => scrollTo("components")}
              className="px-6 py-3 rounded-xl font-bold text-sm border border-white/12 text-white/60 hover:text-white hover:bg-white/5 transition-all">
              View Components
            </button>
          </div>

          {/* animated stats */}
          <div className="grid grid-cols-4 gap-3 max-w-md">
            {[
              { to: 17, suffix: "", label: "Interactive labs", color: AMBER },
              { to: 11, suffix: "", label: "Components", color: CYAN },
              { to: 5, suffix: "", label: "Test tracks", color: GREEN },
              { to: 100, suffix: "%", label: "In-browser", color: "#A78BFA" },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 rounded-xl border border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: s.color }}>
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[9px] uppercase tracking-wider text-white/30 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: live robot scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}
          className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)", boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 48px ${AMBER}14` }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live sensor telemetry</span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: GREEN }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }} /> RUNNING
            </span>
          </div>
          <RobotScene />
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/25 text-xs flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <span>scroll to begin</span><span>↓</span>
      </motion.div>
    </header>
  );
}
