"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onSerialUsed:()=>void; }

export default function SerialSim({ onSerialUsed }: Props) {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<{type:"send"|"recv";text:string}[]>([
    {type:"recv",text:"Serial Monitor ready at 9600 baud"},
  ]);
  const [triggered, setTriggered] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if(!input.trim()) return;
    const msg = input.trim();
    // Echo reversed as demo
    const reversed = msg.split("").reverse().join("");
    setLog(prev=>[...prev,{type:"send",text:msg},{type:"recv",text:`Echo: "${reversed}"`}]);
    setInput("");
    if(!triggered){ setTriggered(true); onSerialUsed(); }
    setTimeout(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },50);
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 6 · Simulator 4</p>
        <h2 className="text-xl font-bold mb-1">Serial Monitor</h2>
        <p className="text-white/45 text-sm mb-6">Type a message and send it — Arduino echoes it back reversed. Watch the terminal update in real time.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(5,150,105,0.2)",background:"rgba(5,150,105,0.04)"}}>
          {/* Terminal */}
          <div className="rounded-xl overflow-hidden border border-white/8 mb-4">
            <div className="px-3 py-1.5 text-[10px] font-mono border-b border-white/5 flex justify-between items-center" style={{background:"rgba(0,0,0,0.7)",color:"rgba(5,150,105,0.7)"}}>
              <span>Serial Monitor — COM3 @ 9600</span>
              <button onClick={()=>setLog([{type:"recv",text:"Serial Monitor ready at 9600 baud"}])} className="text-white/20 hover:text-white/40 text-xs">Clear</button>
            </div>
            <div ref={logRef} className="p-3 font-mono text-[11px] min-h-[150px] max-h-[200px] overflow-y-auto space-y-1" style={{background:"rgba(0,0,0,0.6)"}}>
              {log.map((l,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:0.2}}
                  style={{color:l.type==="send"?"rgba(255,255,255,0.5)":"rgba(5,150,105,0.85)"}}>
                  {l.type==="send"?`> ${l.text}`:l.text}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()}
              placeholder="Type a message and press Enter or Send..."
              className="flex-1 px-3 py-2 rounded-xl text-sm font-mono outline-none border border-white/8"
              style={{background:"rgba(0,0,0,0.4)",color:"rgba(255,255,255,0.8)"}}/>
            <button onClick={send} className="px-4 py-2 rounded-xl font-bold text-sm border transition-all" style={{borderColor:"rgba(5,150,105,0.4)",background:"rgba(5,150,105,0.12)",color:"#059669"}}>Send</button>
          </div>

          <div className="mt-3 rounded-lg p-2.5 border border-white/6">
            <p className="text-[10px] font-mono text-white/30">
              Arduino code: Serial.begin(9600); → while(Serial.available()) &#123; char c=Serial.read(); &#125;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
