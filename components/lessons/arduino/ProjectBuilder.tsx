"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onProjectUsed:()=>void; }

const DEFAULT_TIMES = [2000, 5000, 1500]; // red, green, yellow ms

export default function ProjectBuilder({ onProjectUsed }: Props) {
  const [times, setTimes] = useState(DEFAULT_TIMES);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0); // 0=red,1=green,2=yellow
  const [triggered, setTriggered] = useState(false);
  const phaseRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  const LIGHTS = [
    {name:"RED",color:"#EF4444",glow:"rgba(239,68,68,0.5)"},
    {name:"GREEN",color:"#22C55E",glow:"rgba(34,197,94,0.5)"},
    {name:"YELLOW",color:"#EAB308",glow:"rgba(234,179,8,0.5)"},
  ];

  const step = () => {
    const next = (phaseRef.current+1)%3;
    phaseRef.current = next;
    setPhase(next);
    timerRef.current = setTimeout(step, DEFAULT_TIMES[next]);
  };

  useEffect(()=>{
    if(running){
      phaseRef.current=0; setPhase(0);
      timerRef.current=setTimeout(step,DEFAULT_TIMES[0]);
      if(!triggered){ setTriggered(true); onProjectUsed(); }
    } else {
      if(timerRef.current) clearTimeout(timerRef.current);
    }
    return ()=>{ if(timerRef.current) clearTimeout(timerRef.current); };
  },[running]);

  const code = `// Traffic Light Controller
const int RED_PIN=2, GREEN_PIN=3, YEL_PIN=4;
void setup(){
  pinMode(RED_PIN,OUTPUT);
  pinMode(GREEN_PIN,OUTPUT);
  pinMode(YEL_PIN,OUTPUT);
}
void loop(){
  digitalWrite(RED_PIN,HIGH);
  delay(${times[0]});
  digitalWrite(RED_PIN,LOW);
  digitalWrite(GREEN_PIN,HIGH);
  delay(${times[1]});
  digitalWrite(GREEN_PIN,LOW);
  digitalWrite(YEL_PIN,HIGH);
  delay(${times[2]});
  digitalWrite(YEL_PIN,LOW);
}`;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7 · Simulator 5</p>
        <h2 className="text-xl font-bold mb-1">Project: Traffic Light Controller</h2>
        <p className="text-white/45 text-sm mb-6">Set the timing for each light, then run the simulation. Code auto-generates as you adjust.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(5,150,105,0.2)",background:"rgba(5,150,105,0.04)"}}>
          <div className="flex gap-5 mb-5">
            {/* Traffic light hardware */}
            <div className="flex flex-col gap-2.5 items-center">
              <div className="rounded-2xl border border-white/10 px-3 py-4 flex flex-col items-center gap-3" style={{background:"rgba(0,0,0,0.5)"}}>
                {LIGHTS.map((l,i)=>(
                  <motion.div key={l.name} className="w-10 h-10 rounded-full border-2"
                    animate={{background:running&&phase===i?l.color:"rgba(255,255,255,0.05)",borderColor:running&&phase===i?l.color:"rgba(255,255,255,0.1)",boxShadow:running&&phase===i?`0 0 18px ${l.glow}`:"none"}}
                    transition={{duration:0.12}}/>
                ))}
              </div>
              <div className="text-[9px] text-white/30 font-mono">Traffic Light</div>
            </div>

            {/* Timing sliders */}
            <div className="flex-1 space-y-3">
              {LIGHTS.map((l,i)=>(
                <div key={l.name}>
                  <div className="flex justify-between text-[10px] mb-1 font-mono">
                    <span style={{color:l.color}}>{l.name}</span>
                    <span className="text-white/40">{(times[i]/1000).toFixed(1)}s</span>
                  </div>
                  <input type="range" min="500" max="8000" step="500" value={times[i]}
                    onChange={e=>setTimes(t=>t.map((v,j)=>j===i?+e.target.value:v))}
                    className="w-full" style={{accentColor:l.color}}/>
                </div>
              ))}
            </div>
          </div>

          {/* Generated code */}
          <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
            <div className="px-3 py-1.5 text-[10px] font-mono text-white/30 border-b border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>traffic_light.ino</div>
            <pre className="p-3 text-[9px] font-mono overflow-x-auto" style={{color:"rgba(5,150,105,0.7)",background:"rgba(0,0,0,0.5)"}}>
              {code}
            </pre>
          </div>

          <button onClick={()=>setRunning(v=>!v)} className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all"
            style={{borderColor:"rgba(5,150,105,0.4)",background:running?"rgba(239,68,68,0.1)":"rgba(5,150,105,0.12)",color:running?"#EF4444":"#059669"}}>
            {running?"⏹ Stop Simulation":"▶ Run Simulation"}
          </button>
        </div>
      </div>
    </section>
  );
}
