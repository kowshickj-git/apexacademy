"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onDigitalReadUsed:()=>void; }

export default function DigitalReadSim({ onDigitalReadUsed }: Props) {
  const [btnHeld, setBtnHeld] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [triggered, setTriggered] = useState(false);
  const ledOn = btnHeld;

  const press = () => {
    setBtnHeld(true);
    setLog(prev=>[...prev.slice(-8),`Button: HIGH | LED: ON`]);
    if(!triggered){ setTriggered(true); onDigitalReadUsed(); }
  };
  const release = () => {
    setBtnHeld(false);
    setLog(prev=>[...prev.slice(-8),`Button: LOW | LED: OFF`]);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 4 · Simulator 2</p>
        <h2 className="text-xl font-bold mb-1">digitalRead — Button Input</h2>
        <p className="text-white/45 text-sm mb-6">Hold the button. The LED mirrors the button state. Serial monitor logs every change.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(5,150,105,0.2)",background:"rgba(5,150,105,0.04)"}}>
          <div className="flex justify-center gap-8 mb-5">
            {/* Button */}
            <div className="flex flex-col items-center gap-2">
              <motion.button onMouseDown={press} onMouseUp={release} onTouchStart={press} onTouchEnd={release}
                className="w-16 h-16 rounded-xl border-4 font-bold text-xs select-none" whileTap={{scale:0.92,y:4}}
                style={{borderColor:btnHeld?"rgba(5,150,105,0.8)":"rgba(255,255,255,0.2)",background:btnHeld?"rgba(5,150,105,0.3)":"rgba(255,255,255,0.04)",color:btnHeld?"#059669":"rgba(255,255,255,0.4)",cursor:"pointer"}}>
                HOLD
              </motion.button>
              <span className="text-[9px] text-white/30 font-mono">Pin 2</span>
            </div>
            {/* LED */}
            <div className="flex flex-col items-center gap-2">
              <motion.div className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
                animate={{background:ledOn?"rgba(245,158,11,0.4)":"rgba(245,158,11,0.08)",borderColor:ledOn?"#F59E0B":"rgba(245,158,11,0.2)",boxShadow:ledOn?"0 0 20px rgba(245,158,11,0.5)":"none"}}>
                <span className="text-2xl">{ledOn?"💡":"🔌"}</span>
              </motion.div>
              <span className="text-[9px] text-white/30 font-mono">Pin 13</span>
            </div>
          </div>

          {/* Serial monitor */}
          <div className="rounded-xl overflow-hidden border border-white/8">
            <div className="px-3 py-1.5 text-[10px] font-mono border-b border-white/5 flex justify-between" style={{background:"rgba(0,0,0,0.5)",color:"rgba(5,150,105,0.7)"}}>
              <span>Serial Monitor (9600 baud)</span>
              <button onClick={()=>setLog([])} className="text-white/20 hover:text-white/40 text-xs">Clear</button>
            </div>
            <div className="p-3 font-mono text-[10px] min-h-[100px]" style={{background:"rgba(0,0,0,0.4)"}}>
              {log.length===0&&<span className="text-white/20">— waiting for input —</span>}
              {log.map((l,i)=><div key={i} style={{color:"rgba(5,150,105,0.8)"}}>{`> ${l}`}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
