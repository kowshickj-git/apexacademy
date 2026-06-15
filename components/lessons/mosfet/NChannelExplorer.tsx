"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onNChannelUsed:()=>void; }

export default function NChannelExplorer({ onNChannelUsed }: Props) {
  const [active, setActive] = useState<"n"|"p">("n");
  const [triggered, setTriggered] = useState(false);

  const handle = (t:"n"|"p") => {
    setActive(t);
    if(!triggered){ setTriggered(true); onNChannelUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 6 · Simulator 4</p>
        <h2 className="text-xl font-bold mb-1">N-Channel vs P-Channel</h2>
        <p className="text-white/45 text-sm mb-6">Click each type to see how current direction and gate polarity differ.</p>

        <div className="flex gap-3 mb-5">
          {[{key:"n" as const,label:"N-Channel MOSFET",col:"#3B82F6"},{key:"p" as const,label:"P-Channel MOSFET",col:"#A78BFA"}].map((t)=>(
            <button key={t.key} onClick={()=>handle(t.key)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
              style={{borderColor:active===t.key?`${t.col}66`:"rgba(255,255,255,0.08)",
                background:active===t.key?`${t.col}15`:"rgba(255,255,255,0.03)",
                color:active===t.key?t.col:"rgba(255,255,255,0.4)"}}>
              {t.label}
            </button>
          ))}
        </div>

        <motion.div key={active} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3}}
          className="rounded-2xl border p-5 mb-5"
          style={{borderColor:active==="n"?"rgba(59,130,246,0.3)":"rgba(167,139,250,0.3)",background:active==="n"?"rgba(59,130,246,0.04)":"rgba(167,139,250,0.04)"}}>
          <div className="flex justify-center mb-4">
            <svg width="180" height="140" viewBox="0 0 180 140">
              {/* Drain */}
              <text x="90" y="15" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">D {active==="n"?"(+V)":"(GND)"}</text>
              <line x1="90" y1="18" x2="90" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              {/* Body */}
              <rect x="75" y="40" width="30" height="60" rx="3" fill={active==="n"?"rgba(59,130,246,0.1)":"rgba(167,139,250,0.1)"} stroke={active==="n"?"#3B82F6":"#A78BFA"} strokeWidth="1.5"/>
              <text x="90" y="73" textAnchor="middle" fill={active==="n"?"#3B82F6":"#A78BFA"} fontSize="9" fontFamily="monospace">{active==="n"?"NMOS":"PMOS"}</text>
              {/* Gate */}
              <line x1="35" y1="70" x2="75" y2="70" stroke={active==="n"?"#3B82F6":"#A78BFA"} strokeWidth="2"/>
              <text x="15" y="74" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">G</text>
              <text x="50" y="62" textAnchor="middle" fill={active==="n"?"rgba(59,130,246,0.6)":"rgba(167,139,250,0.6)"} fontSize="9" fontFamily="monospace">{active==="n"?"+V_GS":"-V_SG"}</text>
              {/* Source */}
              <line x1="90" y1="100" x2="90" y2="125" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              <text x="90" y="138" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">S {active==="n"?"(GND)":"(+V)"}</text>
              {/* Current arrow */}
              {active==="n" ? (
                <motion.polygon points="90,42 85,54 95,54" fill="#3B82F6" animate={{y:[0,5,0]}} transition={{duration:1,repeat:Infinity}}/>
              ) : (
                <motion.polygon points="90,98 85,86 95,86" fill="#A78BFA" animate={{y:[0,-5,0]}} transition={{duration:1,repeat:Infinity}}/>
              )}
            </svg>
          </div>
        </motion.div>

        <div className="rounded-xl border border-white/8 overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr style={{background:"rgba(255,255,255,0.03)"}}>
              <th className="text-left p-3 text-white/40 font-mono">Property</th>
              <th className="text-center p-3" style={{color:"#3B82F6"}}>N-Channel</th>
              <th className="text-center p-3" style={{color:"#A78BFA"}}>P-Channel</th>
            </tr></thead>
            <tbody>
              {[["Turns ON when","V_GS > +V_th","V_SG > +V_tp (V_GS < -V_tp)"],
                ["Current flows","Drain → Source","Source → Drain"],
                ["Common use","Low-side switch","High-side switch"],
                ["Relative speed","Faster (higher μ_n)","Slower (lower μ_p)"]].map(([prop,n,p])=>(
                <tr key={prop} className="border-t border-white/5">
                  <td className="p-3 text-white/35 font-mono">{prop}</td>
                  <td className="p-3 text-center text-white/60">{n}</td>
                  <td className="p-3 text-center text-white/60">{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
