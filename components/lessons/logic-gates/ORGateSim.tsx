"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onOrGateUsed:()=>void; }

export default function ORGateSim({ onOrGateUsed }: Props) {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const out = a || b;

  const toggle = (which:"a"|"b") => {
    if(which==="a") setA(v=>!v); else setB(v=>!v);
    if(!triggered){ setTriggered(true); onOrGateUsed(); }
  };

  const wire=(on:boolean)=>on?"#84CC16":"rgba(255,255,255,0.2)";

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 4 · Simulator 2</p>
        <h2 className="text-xl font-bold mb-1">OR Gate</h2>
        <p className="text-white/45 text-sm mb-6">Output is HIGH when <strong className="text-lime-400">ANY</strong> input is HIGH. Two paths, either path can trigger output.</p>

        <div className="rounded-2xl border p-6" style={{borderColor:"rgba(132,204,22,0.2)",background:"rgba(132,204,22,0.04)"}}>
          <div className="flex justify-center mb-6">
            <svg width="300" height="120" viewBox="0 0 300 120">
              <line x1="20" y1="40" x2="120" y2="40" stroke={wire(a)} strokeWidth="3" style={{transition:"stroke 0.2s"}}/>
              <line x1="20" y1="80" x2="120" y2="80" stroke={wire(b)} strokeWidth="3" style={{transition:"stroke 0.2s"}}/>
              {/* OR gate body (curved) */}
              <path d="M120 20 Q130 60 120 100 Q150 90 170 60 Q150 30 120 20 Z" fill={out?"rgba(132,204,22,0.15)":"rgba(255,255,255,0.04)"} stroke={out?"#84CC16":"rgba(255,255,255,0.2)"} strokeWidth="2" style={{transition:"all 0.3s"}}/>
              <text x="148" y="64" fill={out?"#84CC16":"rgba(255,255,255,0.4)"} fontSize="10" textAnchor="middle" fontFamily="monospace">OR</text>
              <line x1="170" y1="60" x2="280" y2="60" stroke={wire(out)} strokeWidth="3" style={{transition:"stroke 0.2s"}}/>
              <text x="10" y="44" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">A</text>
              <text x="10" y="84" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">B</text>
              <text x="282" y="64" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">Y</text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[{label:"Input A",val:a,onClick:()=>toggle("a")},{label:"Input B",val:b,onClick:()=>toggle("b")},{label:"Output Y",val:out,onClick:undefined}].map((item)=>(
              <button key={item.label} onClick={item.onClick} disabled={!item.onClick} className="rounded-xl p-3 border text-center transition-all"
                style={{borderColor:item.val?"rgba(132,204,22,0.4)":"rgba(255,255,255,0.1)",background:item.val?"rgba(132,204,22,0.1)":"rgba(255,255,255,0.03)",cursor:item.onClick?"pointer":"default"}}>
                <div className="text-[9px] text-white/30 uppercase tracking-wider font-mono mb-1">{item.label}</div>
                <div className="text-lg font-black" style={{color:item.val?"#84CC16":"rgba(255,255,255,0.3)"}}>{item.val?"HIGH":"LOW"}</div>
                <div className="text-[10px] font-mono mt-1" style={{color:item.val?"rgba(132,204,22,0.5)":"rgba(255,255,255,0.15)"}}>{item.val?"1":"0"}</div>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/8 overflow-hidden">
            <div className="px-3 py-1.5 text-[10px] font-mono text-white/30 border-b border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>Truth Table — Y = A + B</div>
            <table className="w-full text-xs">
              <thead><tr><th className="p-2 text-white/30 font-mono">A</th><th className="p-2 text-white/30 font-mono">B</th><th className="p-2 text-white/30 font-mono">Y</th></tr></thead>
              <tbody>
                {[[0,0,0],[0,1,1],[1,0,1],[1,1,1]].map(([av,bv,yv],i)=>{
                  const active=av===+(a)&&bv===+(b);
                  return <tr key={i} style={{background:active?"rgba(132,204,22,0.08)":"transparent",transition:"background 0.2s"}}>{[av,bv,yv].map((v,j)=><td key={j} className="p-2 text-center font-mono" style={{color:v?"#84CC16":"rgba(255,255,255,0.3)"}}>{v}</td>)}</tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
