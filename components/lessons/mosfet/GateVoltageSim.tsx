"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onGateVoltageUsed:()=>void; }

export default function GateVoltageSim({ onGateVoltageUsed }: Props) {
  const [vgs, setVgs] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const VTH = 2.5;
  const ID = vgs < VTH ? 0 : ((50*(vgs-VTH)**2)/1000); // simplified mA
  const region = vgs < VTH ? "Cutoff" : vgs < 5 ? "Sub-threshold / Active" : "Saturation";

  const handleChange = (v:number) => {
    setVgs(v);
    if(!triggered && v > 1) { setTriggered(true); onGateVoltageUsed(); }
  };

  const points = Array.from({length:101},(_,i)=>{
    const v = i*10/100;
    const id = v < VTH ? 0 : Math.min((50*(v-VTH)**2)/1000,100);
    return {v,id};
  });
  const maxId = 100;
  const W=300; const H=150;
  const toSvg=(v:number,id:number)=>({x:(v/10)*W, y:H-(id/maxId)*H});

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 5 · Simulator 3</p>
        <h2 className="text-xl font-bold mb-1">Gate Voltage Characteristic</h2>
        <p className="text-white/45 text-sm mb-6">Drag V_GS along the transfer curve — see how I_D responds in each region.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(59,130,246,0.2)",background:"rgba(59,130,246,0.04)"}}>
          {/* Transfer curve SVG */}
          <div className="flex justify-center mb-5">
            <svg width={W} height={H+30} viewBox={`0 0 ${W} ${H+30}`}>
              {/* Grid */}
              {[0,0.25,0.5,0.75,1].map((f)=>(
                <g key={f}>
                  <line x1={0} y1={H*f} x2={W} y2={H*f} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                  <line x1={W*f} y1={0} x2={W*f} y2={H} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                </g>
              ))}
              {/* Threshold line */}
              <line x1={(VTH/10)*W} y1={0} x2={(VTH/10)*W} y2={H} stroke="rgba(251,146,60,0.4)" strokeWidth="1" strokeDasharray="4,4"/>
              <text x={(VTH/10)*W+4} y={12} fill="rgba(251,146,60,0.6)" fontSize="9" fontFamily="monospace">V_th</text>
              {/* Curve */}
              <polyline points={points.map(p=>{ const {x,y}=toSvg(p.v,p.id); return `${x},${y}`; }).join(" ")}
                fill="none" stroke="#3B82F6" strokeWidth="2"/>
              {/* Current point */}
              {(() => { const {x,y}=toSvg(vgs,Math.min(ID,maxId)); return (
                <motion.circle cx={x} cy={y} r={6} fill="#3B82F6" style={{filter:"drop-shadow(0 0 6px #3B82F6)"}} animate={{r:[5,7,5]}} transition={{duration:1,repeat:Infinity}}/>
              ); })()}
              {/* Axes labels */}
              <text x={W/2} y={H+22} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle" fontFamily="monospace">V_GS (V)</text>
              <text x={0} y={H+22} fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">0</text>
              <text x={W-10} y={H+22} fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">10</text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{l:"V_GS",v:`${vgs.toFixed(1)}V`},{l:"I_D",v:`${Math.min(ID,maxId).toFixed(1)}mA`},{l:"Region",v:region.split(" ")[0]}].map((s)=>(
              <div key={s.l} className="rounded-xl p-2.5 border border-white/8 text-center">
                <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono mb-1">{s.l}</div>
                <div className="text-xs font-black font-mono" style={{color:"#3B82F6"}}>{s.v}</div>
              </div>
            ))}
          </div>

          <input type="range" min="0" max="10" step="0.1" value={vgs}
            onChange={(e)=>handleChange(+e.target.value)} className="w-full" style={{accentColor:"#3B82F6"}}/>
          <div className="flex justify-between text-[10px] text-white/20 font-mono mt-1">
            <span>0V (Cutoff)</span><span>V_th={VTH}V</span><span>10V (Saturation)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
