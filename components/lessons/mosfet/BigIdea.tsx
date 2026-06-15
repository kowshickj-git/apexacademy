"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BigIdea() {
  const [vgs, setVgs] = useState(0);
  const on = vgs >= 3;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 1 · The Big Idea</p>
        <h2 className="text-xl font-bold mb-1">A Gate with No Current</h2>
        <p className="text-white/45 text-sm mb-6">Drag the slider to charge the gate capacitor and watch the channel open.</p>

        <div className="rounded-2xl border p-6 mb-6" style={{borderColor:"rgba(59,130,246,0.2)",background:"rgba(59,130,246,0.04)"}}>
          {/* MOSFET diagram */}
          <div className="flex justify-center mb-6">
            <svg width="200" height="160" viewBox="0 0 200 160">
              {/* Source */}
              <text x="20" y="140" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">S</text>
              <line x1="30" y1="130" x2="80" y2="130" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              {/* Drain */}
              <text x="165" y="30" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">D</text>
              <line x1="30" y1="30" x2="80" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              {/* Body */}
              <rect x="80" y="20" width="4" height="120" rx="1" fill="rgba(255,255,255,0.2)"/>
              {/* Gate oxide */}
              <rect x="88" y="20" width="6" height="120" rx="1" fill={on?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.05)"} style={{transition:"fill 0.4s"}}/>
              {/* Gate metal */}
              <rect x="96" y="20" width="8" height="120" rx="1" fill={on?"rgba(59,130,246,0.7)":"rgba(255,255,255,0.15)"} style={{transition:"fill 0.4s"}}/>
              {/* Gate line */}
              <line x1="104" y1="80" x2="150" y2="80" stroke={on?"#3B82F6":"rgba(255,255,255,0.3)"} strokeWidth="2" style={{transition:"stroke 0.4s"}}/>
              <text x="155" y="84" fill={on?"#3B82F6":"rgba(255,255,255,0.5)"} fontSize="11" fontFamily="monospace">G</text>
              {/* Channel */}
              <AnimatePresence>
                {on && (
                  <motion.rect x="80" y="20" width="8" height="120" rx="1" fill="rgba(59,130,246,0.25)"
                    initial={{opacity:0,scaleY:0}} animate={{opacity:1,scaleY:1}} exit={{opacity:0}}
                    style={{originY:"50%",transformBox:"fill-box"}}/>
                )}
              </AnimatePresence>
              {/* Current dots */}
              {on && [0.2,0.4,0.6,0.8].map((frac)=>(
                <motion.circle key={frac} cx="84" r="3" fill="#3B82F6"
                  animate={{cy:[130*frac+20,130*(frac-0.15)+20]}} transition={{duration:0.8,repeat:Infinity,ease:"linear",delay:frac}}/>
              ))}
            </svg>
          </div>

          {/* V_GS slider */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/40 font-mono">V_GS</span>
              <span className="font-black font-mono" style={{color:on?"#3B82F6":"rgba(255,255,255,0.4)"}}>{vgs}V {on?"— Channel OPEN":"— Channel CLOSED"}</span>
            </div>
            <input type="range" min="0" max="10" step="0.5" value={vgs} onChange={(e)=>setVgs(+e.target.value)}
              className="w-full" style={{accentColor:"#3B82F6"}}/>
            <div className="flex justify-between text-[10px] text-white/20 font-mono mt-1"><span>0V</span><span>Vth ≈ 3V</span><span>10V</span></div>
          </div>

          <p className="text-xs text-center font-mono" style={{color:"rgba(59,130,246,0.7)"}}>
            {on?"⚡ Gate capacitor charged → channel conducts → current flows":"🔒 V_GS below threshold → channel blocked → no current"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[{t:"Voltage Controlled",d:"Gate draws near-zero current — only voltage needed",icon:"⚡"},
            {t:"Gate Capacitor",d:"Gate oxide capacitor — charges up, opens the channel",icon:"🔋"},
            {t:"Faster Than BJT",d:"No minority carrier storage — switches in nanoseconds",icon:"💨"}].map((c)=>(
            <div key={c.t} className="rounded-xl p-3 border border-white/6" style={{background:"rgba(255,255,255,0.02)"}}>
              <div className="text-lg mb-1">{c.icon}</div>
              <div className="text-xs font-bold text-white/75 mb-1">{c.t}</div>
              <div className="text-[10px] text-white/35 leading-relaxed">{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
