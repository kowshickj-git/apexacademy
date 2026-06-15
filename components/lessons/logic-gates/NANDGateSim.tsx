"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#F97316";
const TRUTH = [[0,0,1],[0,1,1],[1,0,1],[1,1,0]] as const;

export default function NANDGateSim() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const out = !(a && b) ? 1 : 0;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 7 · NAND Gate Simulator</p>
        <h2 className="text-xl font-bold mb-1">NAND Gate</h2>
        <p className="text-white/45 text-sm mb-6">
          NAND = AND + NOT. Output is LOW <em>only</em> when both inputs are HIGH. Called the &quot;Universal Gate&quot; — any logic circuit can be built using only NAND gates.
        </p>

        <div className="rounded-2xl border p-5 mb-4" style={{borderColor:"rgba(249,115,22,0.22)",background:"rgba(249,115,22,0.05)"}}>
          {/* Gate SVG */}
          <div className="flex items-center gap-6 mb-5">
            <svg width="110" height="80" viewBox="0 0 110 80">
              {/* Input wires */}
              <line x1="0" y1="25" x2="28" y2="25" stroke={a?"#F97316":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <line x1="0" y1="55" x2="28" y2="55" stroke={b?"#F97316":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              {/* AND body */}
              <path d="M28,12 L28,68 L55,68 Q82,68 82,40 Q82,12 55,12 Z" fill="rgba(249,115,22,0.1)" stroke={COLOR} strokeWidth="1.8"/>
              {/* NOT bubble */}
              <circle cx="88" cy="40" r="6" fill="none" stroke={COLOR} strokeWidth="1.8"/>
              {/* Output wire */}
              <line x1="94" y1="40" x2="110" y2="40" stroke={out?"#F97316":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              {/* Labels */}
              <text x="5" y="22" fill={a?"#F97316":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">A={a?1:0}</text>
              <text x="5" y="52" fill={b?"#F97316":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">B={b?1:0}</text>
              <text x="47" y="43" fill={COLOR} fontSize="9" fontFamily="monospace" textAnchor="middle">NAND</text>
              <text x="102" y="37" fill={out?"#F97316":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace" textAnchor="middle">Y={out}</text>
            </svg>

            {/* Output indicator */}
            <div className="flex flex-col items-center gap-2">
              <motion.div className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                animate={{background:out?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)",borderColor:out?"#22C55E":"#EF4444",boxShadow:out?"0 0 16px rgba(34,197,94,0.4)":"0 0 16px rgba(239,68,68,0.3)"}}
                transition={{duration:0.2}}>
                <span className="text-lg font-black font-mono" style={{color:out?"#22C55E":"#EF4444"}}>{out}</span>
              </motion.div>
              <span className="text-[10px] font-mono" style={{color:out?"#22C55E":"#EF4444"}}>{out?"HIGH":"LOW"}</span>
            </div>
          </div>

          {/* Input toggles */}
          <div className="flex gap-3 mb-5">
            {[{label:"A",val:a,set:()=>setA(v=>!v)},{label:"B",val:b,set:()=>setB(v=>!v)}].map(inp=>(
              <button key={inp.label} onClick={inp.set}
                className="flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all"
                style={{borderColor:inp.val?"rgba(249,115,22,0.5)":"rgba(255,255,255,0.1)",background:inp.val?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.03)",color:inp.val?COLOR:"rgba(255,255,255,0.4)"}}>
                {inp.label} = {inp.val?<span style={{color:COLOR}}>1 (HIGH)</span>:<span>0 (LOW)</span>}
              </button>
            ))}
          </div>

          {/* Truth table */}
          <div className="rounded-xl overflow-hidden border border-white/8">
            <table className="w-full text-xs">
              <thead><tr style={{background:"rgba(249,115,22,0.08)"}}><th className="py-2 px-3 text-left font-mono text-white/40">A</th><th className="py-2 px-3 text-left font-mono text-white/40">B</th><th className="py-2 px-3 text-left font-mono text-white/40">Y = NAND</th></tr></thead>
              <tbody>
                {TRUTH.map(([av,bv,yv],i)=>{
                  const isActive = av===+a && bv===+b;
                  return (
                    <tr key={i} style={{background:isActive?"rgba(249,115,22,0.12)":"transparent",transition:"background 0.2s"}}>
                      <td className="py-2 px-3 font-mono" style={{color:av?COLOR:"rgba(255,255,255,0.4)"}}>{av}</td>
                      <td className="py-2 px-3 font-mono" style={{color:bv?COLOR:"rgba(255,255,255,0.4)"}}>{bv}</td>
                      <td className="py-2 px-3 font-mono font-bold flex items-center gap-2" style={{color:yv?"#22C55E":"#EF4444"}}>
                        {yv} {isActive&&<span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(249,115,22,0.2)",color:COLOR}}>← now</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-world application */}
        <div className="rounded-xl p-4 border border-white/6" style={{background:"rgba(255,255,255,0.02)"}}>
          <p className="text-xs font-bold mb-2" style={{color:COLOR}}>Real-World Use: Universal Gate</p>
          <p className="text-xs text-white/40 leading-relaxed">
            NAND gates are called &quot;universal&quot; because any logic function (AND, OR, NOT, XOR…) can be built from NAND gates alone. Early microprocessors like the Intel 8080 used NAND-based logic extensively. Safety interlocks in industrial machines use NAND logic: both conditions must be met to allow the dangerous action.
          </p>
        </div>
      </div>
    </section>
  );
}
