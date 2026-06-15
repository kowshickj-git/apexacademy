"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onCombinedUsed:()=>void; }

const GATES = [
  {name:"NAND",symbol:"NOT(A·B)",rule:"LOW only when both A=1 AND B=1",color:"#F97316",
    truth:[[0,0,1],[0,1,1],[1,0,1],[1,1,0]],note:"Universal Gate — any logic can be built from NAND gates only"},
  {name:"NOR",symbol:"NOT(A+B)",rule:"HIGH only when both A=0 AND B=0",color:"#A78BFA",
    truth:[[0,0,1],[0,1,0],[1,0,0],[1,1,0]],note:"Also Universal — any logic can be built from NOR gates only"},
  {name:"XOR",symbol:"A⊕B",rule:"HIGH when inputs are DIFFERENT",color:"#06B6D4",
    truth:[[0,0,0],[0,1,1],[1,0,1],[1,1,0]],note:"Used in adders, comparators, parity checkers"},
  {name:"XNOR",symbol:"NOT(A⊕B)",rule:"HIGH when inputs are SAME",color:"#EC4899",
    truth:[[0,0,1],[0,1,0],[1,0,0],[1,1,1]],note:"Equality detector — output HIGH means A equals B"},
];

export default function ComboGateExplorer({ onCombinedUsed }: Props) {
  const [active, setActive] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const gate = GATES[active];
  const row = gate.truth.find(([a,b])=>a===+(inputA)&&b===+(inputB));
  const out = row ? row[2] : 0;

  const handleTab = (i:number) => { setActive(i); if(!triggered){ setTriggered(true); onCombinedUsed(); } };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 6 · Simulator 4</p>
        <h2 className="text-xl font-bold mb-1">Combo Gate Explorer</h2>
        <p className="text-white/45 text-sm mb-5">NAND, NOR, XOR, XNOR — click each to explore. Gate symbol pulses when output changes.</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {GATES.map((g,i)=>(
            <button key={g.name} onClick={()=>handleTab(i)} className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
              style={{borderColor:active===i?`${g.color}66`:"rgba(255,255,255,0.08)",background:active===i?`${g.color}18`:"rgba(255,255,255,0.03)",color:active===i?g.color:"rgba(255,255,255,0.4)"}}>
              {g.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={gate.name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}
            className="rounded-2xl border p-5" style={{borderColor:`${gate.color}33`,background:`${gate.color}08`}}>
            <div className="flex items-start gap-4 mb-4">
              <motion.div className="rounded-xl px-4 py-3 text-center border flex-shrink-0"
                style={{borderColor:`${gate.color}44`,background:`${gate.color}15`}}
                animate={{scale:out?[1,1.08,1]:[1]}} transition={{duration:0.3}} key={out}>
                <div className="text-lg font-black font-mono" style={{color:gate.color}}>{gate.name}</div>
                <div className="text-[10px] font-mono mt-1" style={{color:`${gate.color}99`}}>{gate.symbol}</div>
              </motion.div>
              <div>
                <p className="text-sm text-white/70 mb-1 leading-relaxed"><strong style={{color:gate.color}}>Rule:</strong> {gate.rule}</p>
                <p className="text-[11px] text-white/35 leading-relaxed">{gate.note}</p>
              </div>
            </div>

            {/* Interactive inputs */}
            <div className="flex items-center gap-3 mb-4">
              {[{label:"A",val:inputA,set:()=>setInputA(v=>!v)},{label:"B",val:inputB,set:()=>setInputB(v=>!v)}].map((inp)=>(
                <button key={inp.label} onClick={inp.set} className="rounded-lg px-4 py-2 border text-sm font-bold transition-all"
                  style={{borderColor:inp.val?`${gate.color}44`:"rgba(255,255,255,0.1)",background:inp.val?`${gate.color}12`:"rgba(255,255,255,0.03)",color:inp.val?gate.color:"rgba(255,255,255,0.4)"}}>
                  {inp.label} = {inp.val?1:0}
                </button>
              ))}
              <div className="text-white/25 font-mono">→</div>
              <motion.div className="rounded-lg px-4 py-2 border text-sm font-bold" animate={{scale:[1,1.1,1]}} transition={{duration:0.2}} key={out}
                style={{borderColor:out?`${gate.color}44`:"rgba(255,255,255,0.1)",background:out?`${gate.color}12`:"rgba(255,255,255,0.03)",color:out?gate.color:"rgba(255,255,255,0.4)"}}>
                Y = {out}
              </motion.div>
            </div>

            {/* Truth table */}
            <table className="w-full text-xs rounded-xl overflow-hidden">
              <thead><tr style={{background:"rgba(255,255,255,0.03)"}}><th className="p-2 text-white/30 font-mono">A</th><th className="p-2 text-white/30 font-mono">B</th><th className="p-2 text-white/30 font-mono">Y</th></tr></thead>
              <tbody>
                {gate.truth.map(([av,bv,yv],i)=>{
                  const active2=av===+(inputA)&&bv===+(inputB);
                  return <tr key={i} style={{background:active2?`${gate.color}12`:"transparent",transition:"background 0.2s"}}>
                    {[av,bv,yv].map((v,j)=><td key={j} className="p-2 text-center font-mono" style={{color:v?gate.color:"rgba(255,255,255,0.3)"}}>{v}</td>)}
                  </tr>;
                })}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
