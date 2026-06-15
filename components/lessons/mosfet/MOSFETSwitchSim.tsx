"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onSwitchModeUsed:()=>void; }

export default function MOSFETSwitchSim({ onSwitchModeUsed }: Props) {
  const [vgs, setVgs] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const VTH = 2.5;
  const on = vgs >= VTH;
  const region = vgs < VTH ? "Cutoff" : vgs < 4 ? "Active" : "Saturation";

  const handleChange = (v:number) => {
    setVgs(v);
    if(!triggered && v >= VTH) { setTriggered(true); onSwitchModeUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 3 · Simulator 1</p>
        <h2 className="text-xl font-bold mb-1">MOSFET Switch Simulator</h2>
        <p className="text-white/45 text-sm mb-6">Drag V_GS past threshold and watch the load switch on. Current dots speed up with higher V_GS.</p>

        <div className="rounded-2xl border p-6" style={{borderColor:"rgba(59,130,246,0.2)",background:"rgba(59,130,246,0.04)"}}>
          <div className="flex justify-center gap-12 mb-6">
            {/* Circuit */}
            <div className="relative">
              <svg width="160" height="200" viewBox="0 0 160 200">
                {/* V+ rail */}
                <text x="65" y="15" fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle">+V</text>
                <line x1="65" y1="18" x2="65" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                {/* Load (bulb) */}
                <circle cx="65" cy="55" r="15" fill="none" stroke={on?"#F59E0B":"rgba(255,255,255,0.2)"} strokeWidth="2" style={{transition:"stroke 0.3s"}}/>
                <circle cx="65" cy="55" r="15" fill={on?"rgba(245,158,11,0.15)":"rgba(255,255,255,0.02)"} style={{transition:"fill 0.3s"}}/>
                <text x="65" y="59" fill={on?"#F59E0B":"rgba(255,255,255,0.3)"} fontSize="12" textAnchor="middle" style={{transition:"fill 0.3s"}}>💡</text>
                {/* Wire drain-to-load */}
                <line x1="65" y1="70" x2="65" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                {/* MOSFET body */}
                <rect x="50" y="100" width="30" height="50" rx="4" fill="rgba(59,130,246,0.1)" stroke={on?"#3B82F6":"rgba(59,130,246,0.3)"} strokeWidth="1.5" style={{transition:"stroke 0.3s"}}/>
                <text x="65" y="129" fill={on?"#3B82F6":"rgba(59,130,246,0.5)"} fontSize="9" textAnchor="middle" fontFamily="monospace" style={{transition:"fill 0.3s"}}>NMOS</text>
                {/* Gate line */}
                <line x1="20" y1="125" x2="50" y2="125" stroke={on?"#3B82F6":"rgba(255,255,255,0.2)"} strokeWidth="2" style={{transition:"stroke 0.3s"}}/>
                <text x="10" y="129" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">G</text>
                {/* Source to GND */}
                <line x1="65" y1="150" x2="65" y2="175" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <line x1="50" y1="175" x2="80" y2="175" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                <line x1="55" y1="180" x2="75" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                <line x1="60" y1="185" x2="70" y2="185" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* Current dots */}
                {on && [0,0.33,0.66].map((offset)=>(
                  <motion.circle key={offset} cx="65" r="3" fill="#3B82F6"
                    animate={{cy:[100,70,55,70,100,150]}}
                    transition={{duration:Math.max(0.3,1.2-(vgs-VTH)*0.1),repeat:Infinity,ease:"linear",delay:offset*0.4}}/>
                ))}
              </svg>
            </div>
            {/* Status panel */}
            <div className="flex flex-col justify-center gap-3 min-w-[120px]">
              <div className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono mb-1">Region</div>
                <div className="text-sm font-black" style={{color:region==="Cutoff"?"rgba(255,255,255,0.3)":region==="Active"?"#F59E0B":"#3B82F6"}}>{region}</div>
              </div>
              <div className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono mb-1">V_GS</div>
                <div className="text-lg font-black font-mono" style={{color:"#3B82F6"}}>{vgs.toFixed(1)}V</div>
              </div>
              <div className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono mb-1">Load</div>
                <div className="text-sm font-black" style={{color:on?"#F59E0B":"rgba(255,255,255,0.3)"}}>{on?"ON ⚡":"OFF"}</div>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs mb-2 font-mono">
              <span className="text-white/40">V_GS</span>
              <span style={{color:"#3B82F6"}}>{vgs.toFixed(1)}V / 10V</span>
            </div>
            <input type="range" min="0" max="10" step="0.5" value={vgs} onChange={(e)=>handleChange(+e.target.value)} className="w-full" style={{accentColor:"#3B82F6"}}/>
            <div className="flex justify-between text-[10px] text-white/20 font-mono mt-1">
              <span>0V</span><span>V_th = {VTH}V</span><span>10V</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
