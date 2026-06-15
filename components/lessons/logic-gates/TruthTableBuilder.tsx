"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onTruthTableUsed:()=>void; }

const GATE_TRUTHS:{[key:string]:number[]} = {
  AND:[0,0,0,1],OR:[0,1,1,1],NAND:[1,1,1,0],NOR:[1,0,0,0],XOR:[0,1,1,0],XNOR:[1,0,0,1],
};

export default function TruthTableBuilder({ onTruthTableUsed }: Props) {
  const [gate, setGate] = useState("AND");
  const [revealed, setRevealed] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const truths = GATE_TRUTHS[gate];
  const rows:number[][] = [[0,0],[0,1],[1,0],[1,1]];

  const handleGate = (g:string) => {
    setGate(g); setRevealed(false);
    if(!triggered){ setTriggered(true); onTruthTableUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7 · Simulator 5</p>
        <h2 className="text-xl font-bold mb-1">Truth Table Builder</h2>
        <p className="text-white/45 text-sm mb-5">Select a gate, then reveal the truth table row by row with a cascade animation.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(132,204,22,0.2)",background:"rgba(132,204,22,0.04)"}}>
          <div className="flex gap-2 flex-wrap mb-5">
            {Object.keys(GATE_TRUTHS).map((g)=>(
              <button key={g} onClick={()=>handleGate(g)} className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                style={{borderColor:gate===g?"rgba(132,204,22,0.5)":"rgba(255,255,255,0.08)",background:gate===g?"rgba(132,204,22,0.12)":"rgba(255,255,255,0.03)",color:gate===g?"#84CC16":"rgba(255,255,255,0.4)"}}>
                {g}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
            <div className="px-3 py-2 border-b border-white/5 text-xs font-mono" style={{background:"rgba(132,204,22,0.06)",color:"rgba(132,204,22,0.7)"}}>
              Truth Table — {gate} Gate
            </div>
            <table className="w-full text-sm">
              <thead><tr style={{background:"rgba(255,255,255,0.02)"}}><th className="p-3 text-white/35 font-mono text-xs">A</th><th className="p-3 text-white/35 font-mono text-xs">B</th><th className="p-3 text-white/35 font-mono text-xs">Y ({gate})</th></tr></thead>
              <tbody>
                {rows.map((row,i)=>(
                  <AnimatePresence key={`${gate}-${i}`}>
                    {revealed ? (
                      <motion.tr initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:0.3,delay:i*0.15}} style={{background:"rgba(255,255,255,0.01)"}}>
                        {[...row,truths[i]].map((v,j)=>(
                          <td key={j} className="p-3 text-center font-mono font-bold" style={{color:v?"#84CC16":"rgba(255,255,255,0.3)"}}>{v}</td>
                        ))}
                      </motion.tr>
                    ) : (
                      <tr key={i} style={{background:"rgba(255,255,255,0.01)"}}>
                        {[...row,"?"].map((v,j)=>(
                          <td key={j} className="p-3 text-center font-mono" style={{color:j===2?"rgba(132,204,22,0.3)":v?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)"}}>{v}</td>
                        ))}
                      </tr>
                    )}
                  </AnimatePresence>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={()=>setRevealed(v=>!v)} className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all"
            style={{borderColor:"rgba(132,204,22,0.35)",background:"rgba(132,204,22,0.08)",color:"#84CC16"}}>
            {revealed?"🔄 Reset Table":"▶ Reveal Table Row by Row"}
          </button>
        </div>
      </div>
    </section>
  );
}
