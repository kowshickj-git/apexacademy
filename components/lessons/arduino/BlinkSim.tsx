"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onBlinkUsed:()=>void; }

const CODE = (ms:number) => `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(${ms});
  digitalWrite(13, LOW);
  delay(${ms});
}`;

export default function BlinkSim({ onBlinkUsed }: Props) {
  const [delay, setDelay] = useState(500);
  const [running, setRunning] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [typing, setTyping] = useState("");
  const [typed, setTyped] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const handleUpload = () => {
    if(!typed){
      setTyped(true);
      const code = CODE(delay);
      let i = 0;
      const tid = setInterval(()=>{
        setTyping(code.slice(0,i+1));
        i++;
        if(i>=code.length){ clearInterval(tid); setTimeout(()=>{ setRunning(true); if(!triggered){ setTriggered(true); onBlinkUsed(); } },400); }
      },18);
    } else {
      setRunning(v=>!v);
    }
  };

  useEffect(() => {
    if(running){
      let on=true;
      intervalRef.current=setInterval(()=>{ setLedOn(on); on=!on; },delay);
    } else {
      if(intervalRef.current) clearInterval(intervalRef.current);
      setLedOn(false);
    }
    return ()=>{ if(intervalRef.current) clearInterval(intervalRef.current); };
  },[running,delay]);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 3 · Simulator 1</p>
        <h2 className="text-xl font-bold mb-1">Blink — The Hello World of Hardware</h2>
        <p className="text-white/45 text-sm mb-6">Upload the Blink sketch — watch code type itself, then the LED blink. Adjust speed with the slider.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(5,150,105,0.2)",background:"rgba(5,150,105,0.04)"}}>
          <div className="flex gap-4 items-start mb-5">
            {/* Code panel */}
            <div className="flex-1 rounded-xl border border-white/8 overflow-hidden">
              <div className="px-3 py-1.5 text-[10px] font-mono text-white/30 border-b border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>sketch.ino</div>
              <pre className="p-3 text-[10px] font-mono leading-relaxed overflow-auto" style={{color:"rgba(5,150,105,0.8)",background:"rgba(0,0,0,0.5)",minHeight:"120px"}}>
                {typing || CODE(delay)}
              </pre>
            </div>
            {/* LED display */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="relative">
                <motion.div className="w-12 h-12 rounded-full" animate={{background:ledOn?"#F59E0B":"rgba(245,158,11,0.15)",boxShadow:ledOn?"0 0 20px #F59E0B, 0 0 40px rgba(245,158,11,0.4)":"none"}} transition={{duration:0.05}}>
                  <div className="w-full h-full rounded-full border-2" style={{borderColor:ledOn?"#F59E0B":"rgba(245,158,11,0.3)"}}/>
                </motion.div>
                <div className="text-[9px] text-center text-white/30 font-mono mt-1">Pin 13</div>
              </div>
              <div className="text-xs font-mono font-bold" style={{color:ledOn?"#F59E0B":"rgba(255,255,255,0.2)"}}>{ledOn?"HIGH":"LOW"}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1 font-mono"><span className="text-white/40">Delay</span><span style={{color:"#059669"}}>{delay}ms</span></div>
            <input type="range" min="100" max="2000" step="100" value={delay} onChange={(e)=>setDelay(+e.target.value)} className="w-full" style={{accentColor:"#059669"}}/>
            <div className="flex justify-between text-[10px] text-white/20 font-mono mt-1"><span>Fast (100ms)</span><span>Slow (2000ms)</span></div>
          </div>

          <button onClick={handleUpload} className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all" style={{borderColor:"rgba(5,150,105,0.4)",background:"rgba(5,150,105,0.12)",color:"#059669"}}>
            {!typed?"▶ Upload Sketch":running?"⏸ Stop":"▶ Run Again"}
          </button>
        </div>
      </div>
    </section>
  );
}
