"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onMotorDriverUsed:()=>void; }

export default function MotorDriverSim({ onMotorDriverUsed }: Props) {
  const [duty, setDuty] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const VCC = 12;
  const avgV = (duty/100)*VCC;
  const rpm = Math.round((duty/100)*3000);

  const handleChange = (v:number) => {
    setDuty(v);
    if(!triggered && v>5){ setTriggered(true); onMotorDriverUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7 · Simulator 5</p>
        <h2 className="text-xl font-bold mb-1">MOSFET Motor Driver (PWM)</h2>
        <p className="text-white/45 text-sm mb-6">Adjust PWM duty cycle — motor speed and average voltage scale proportionally.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(59,130,246,0.2)",background:"rgba(59,130,246,0.04)"}}>
          <div className="flex justify-center items-center gap-8 mb-6">
            {/* Motor */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <motion.div className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
                style={{borderColor:"rgba(59,130,246,0.4)",background:"rgba(59,130,246,0.08)"}}
                animate={{rotate:360}} transition={{duration:duty>0?Math.max(0.3,3-duty*0.025):10,repeat:Infinity,ease:"linear"}}>
                <div className="w-2 h-8 rounded-full" style={{background:"#3B82F6",opacity:0.7}}/>
              </motion.div>
              <div className="absolute bottom-0 right-0 text-[10px] font-mono text-center" style={{color:"#3B82F6"}}>{rpm}<br/>RPM</div>
            </div>

            {/* PWM wave visualization */}
            <div className="flex-1">
              <svg width="100%" height="60" viewBox="0 0 200 60">
                {/* PWM wave */}
                {Array.from({length:4},(_,i)=>{
                  const w=50; const onW=(duty/100)*w; const offW=w-onW;
                  const x=i*w;
                  return (
                    <g key={i}>
                      <rect x={x} y={10} width={onW} height={30} fill={onW>0?"rgba(59,130,246,0.5)":"none"} rx="1"/>
                      <rect x={x+onW} y={40} width={offW} height={0} fill="none"/>
                      {/* Step */}
                      {onW>0&&<line x1={x} y1={10} x2={x+onW} y2={10} stroke="#3B82F6" strokeWidth="2"/>}
                      {offW>0&&<line x1={x+onW} y1={40} x2={x+w} y2={40} stroke="#3B82F6" strokeWidth="2"/>}
                      {onW>0&&offW>0&&<line x1={x+onW} y1={10} x2={x+onW} y2={40} stroke="#3B82F6" strokeWidth="2"/>}
                      {i>0&&<line x1={x} y1={duty>0?10:40} x2={x} y2={duty>0?10:40} stroke="#3B82F6" strokeWidth="2"/>}
                    </g>
                  );
                })}
                <text x="100" y="58" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">PWM Signal</text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{l:"Duty Cycle",v:`${duty}%`},{l:"Avg Voltage",v:`${avgV.toFixed(1)}V`},{l:"Speed",v:`${rpm} RPM`}].map((s)=>(
              <div key={s.l} className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono mb-1">{s.l}</div>
                <div className="text-sm font-black font-mono" style={{color:"#3B82F6"}}>{s.v}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-white/40">PWM Duty Cycle</span>
              <span style={{color:"#3B82F6"}}>{duty}%</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={duty} onChange={(e)=>handleChange(+e.target.value)} className="w-full" style={{accentColor:"#3B82F6"}}/>
          </div>

          <div className="mt-3 rounded-lg p-2.5 border border-white/6 text-center">
            <p className="text-[11px] font-mono" style={{color:"rgba(59,130,246,0.6)"}}>
              V_avg = {duty}% × {VCC}V = {avgV.toFixed(1)}V
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
