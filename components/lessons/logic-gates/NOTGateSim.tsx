"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onNotGateUsed:()=>void; }

export default function NOTGateSim({ onNotGateUsed }: Props) {
  const [a, setA] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const out = !a;

  const toggle = () => { setA(v=>!v); if(!triggered){ setTriggered(true); onNotGateUsed(); } };
  const wire=(on:boolean)=>on?"#84CC16":"rgba(255,255,255,0.2)";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 5 · Simulator 3</p>
        <h2 className="text-xl font-bold mb-1">NOT Gate (Inverter)</h2>
        <p className="text-white/45 text-sm mb-6">The simplest gate — output is always the <strong className="text-lime-400">opposite</strong> of input. Watch it flip!</p>

        <div className="rounded-2xl border p-6" style={{borderColor:"rgba(132,204,22,0.2)",background:"rgba(132,204,22,0.04)"}}>
          <div className="flex justify-center mb-6">
            <svg width="280" height="100" viewBox="0 0 280 100">
              <line x1="20" y1="50" x2="100" y2="50" stroke={wire(a)} strokeWidth="3" style={{transition:"stroke 0.2s"}}/>
              {/* Triangle gate */}
              <polygon points="100,20 100,80 160,50" fill={a?"rgba(132,204,22,0.1)":"rgba(255,255,255,0.04)"} stroke={a?"rgba(132,204,22,0.5)":"rgba(255,255,255,0.2)"} strokeWidth="2" style={{transition:"all 0.3s"}}/>
              {/* Inversion bubble */}
              <motion.circle cx="167" cy="50" r="7" fill="none" stroke={out?"#84CC16":"rgba(255,255,255,0.2)"} strokeWidth="2" animate={{scale:[1,1.15,1]}} transition={{duration:0.4,repeat:out?Infinity:0}} style={{transition:"stroke 0.3s"}}/>
              <line x1="174" y1="50" x2="260" y2="50" stroke={wire(out)} strokeWidth="3" style={{transition:"stroke 0.2s"}}/>
              <text x="10" y="54" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">A</text>
              <text x="263" y="54" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">Y</text>
              <text x="128" y="54" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">NOT</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5 max-w-sm mx-auto">
            <button onClick={toggle} className="rounded-xl p-4 border text-center transition-all" style={{borderColor:a?"rgba(132,204,22,0.4)":"rgba(255,255,255,0.1)",background:a?"rgba(132,204,22,0.1)":"rgba(255,255,255,0.03)"}}>
              <div className="text-[9px] text-white/30 uppercase tracking-wider font-mono mb-1">Input A</div>
              <div className="text-xl font-black" style={{color:a?"#84CC16":"rgba(255,255,255,0.3)"}}>{a?"HIGH":"LOW"}</div>
              <div className="text-[10px] font-mono mt-1" style={{color:a?"rgba(132,204,22,0.5)":"rgba(255,255,255,0.15)"}}>{a?"1 — click to toggle":"0 — click to toggle"}</div>
            </button>
            <div className="rounded-xl p-4 border text-center" style={{borderColor:out?"rgba(132,204,22,0.4)":"rgba(255,255,255,0.1)",background:out?"rgba(132,204,22,0.1)":"rgba(255,255,255,0.03)"}}>
              <div className="text-[9px] text-white/30 uppercase tracking-wider font-mono mb-1">Output Y = Ā</div>
              <motion.div className="text-xl font-black" style={{color:out?"#84CC16":"rgba(255,255,255,0.3)"}}
                animate={{scale:[1,1.1,1]}} transition={{duration:0.2}} key={String(out)}>{out?"HIGH":"LOW"}</motion.div>
              <div className="text-[10px] font-mono mt-1" style={{color:out?"rgba(132,204,22,0.5)":"rgba(255,255,255,0.15)"}}>{out?"1":"0"}</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/8 overflow-hidden">
            <div className="px-3 py-1.5 text-[10px] font-mono text-white/30 border-b border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>Truth Table — Y = Ā (NOT A)</div>
            <table className="w-full text-xs">
              <thead><tr><th className="p-2 text-white/30 font-mono">A</th><th className="p-2 text-white/30 font-mono">Y</th></tr></thead>
              <tbody>
                {[[0,1],[1,0]].map(([av,yv],i)=>{
                  const active=av===+(a);
                  return <tr key={i} style={{background:active?"rgba(132,204,22,0.08)":"transparent",transition:"background 0.2s"}}><td className="p-2 text-center font-mono" style={{color:av?"#84CC16":"rgba(255,255,255,0.3)"}}>{av}</td><td className="p-2 text-center font-mono" style={{color:yv?"#84CC16":"rgba(255,255,255,0.3)"}}>{yv}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
