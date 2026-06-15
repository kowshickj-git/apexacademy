"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#06B6D4";
const TRUTH = [[0,0,0],[0,1,1],[1,0,1],[1,1,0]] as const;

export default function XORGateSim() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const out = (a !== b) ? 1 : 0;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9 · XOR Gate Simulator</p>
        <h2 className="text-xl font-bold mb-1">XOR Gate — Exclusive OR</h2>
        <p className="text-white/45 text-sm mb-6">
          XOR (Exclusive OR) outputs HIGH <em>only when the inputs are different</em>. Think of it as a &quot;difference detector.&quot; Same inputs → 0. Different inputs → 1. The core of binary addition and parity checkers.
        </p>

        <div className="rounded-2xl border p-5 mb-4" style={{borderColor:"rgba(6,182,212,0.22)",background:"rgba(6,182,212,0.05)"}}>
          {/* Visual rule cards */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {TRUTH.map(([av,bv,yv],i)=>{
              const isCurrent = av===+a && bv===+b;
              return (
                <motion.div key={i} className="rounded-xl p-2 text-center border" animate={{borderColor:isCurrent?"rgba(6,182,212,0.6)":"rgba(255,255,255,0.06)",background:isCurrent?"rgba(6,182,212,0.15)":"rgba(255,255,255,0.02)",scale:isCurrent?1.04:1}} transition={{duration:0.2}}>
                  <div className="text-[10px] font-mono mb-1" style={{color:"rgba(255,255,255,0.35)"}}>{av}⊕{bv}</div>
                  <div className="text-base font-black font-mono" style={{color:yv?"#22C55E":"#EF4444"}}>{yv}</div>
                  <div className="text-[8px] mt-0.5" style={{color:"rgba(255,255,255,0.25)"}}>{av===bv?"same":"diff"}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Gate SVG + output */}
          <div className="flex items-center gap-6 mb-5">
            <svg width="110" height="80" viewBox="0 0 110 80">
              {/* XOR body — OR shape with extra curved line */}
              <path d="M20,12 Q35,12 55,40 Q35,68 20,68 Q38,40 20,12 Z" fill="rgba(6,182,212,0.1)" stroke={COLOR} strokeWidth="1.8"/>
              {/* Extra arc for XOR */}
              <path d="M13,12 Q30,40 13,68" fill="none" stroke={COLOR} strokeWidth="1.8"/>
              <line x1="0" y1="25" x2="23" y2="25" stroke={a?"#06B6D4":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <line x1="0" y1="55" x2="23" y2="55" stroke={b?"#06B6D4":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <line x1="55" y1="40" x2="110" y2="40" stroke={out?"#06B6D4":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <text x="30" y="43" fill={COLOR} fontSize="9" fontFamily="monospace" textAnchor="middle">XOR</text>
              <text x="5" y="22" fill={a?"#06B6D4":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">A={a?1:0}</text>
              <text x="5" y="52" fill={b?"#06B6D4":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">B={b?1:0}</text>
              <text x="100" y="37" fill={out?"#06B6D4":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">Y={out}</text>
            </svg>

            <div className="flex-1 rounded-xl p-3 border border-white/8">
              <p className="text-[10px] text-white/30 font-mono mb-1">Current state</p>
              <p className="text-sm font-bold font-mono" style={{color:COLOR}}>{+a} ⊕ {+b} = {out}</p>
              <p className="text-[11px] mt-1" style={{color:"rgba(255,255,255,0.4)"}}>
                {a===b ? "Inputs are the SAME → output 0" : "Inputs are DIFFERENT → output 1"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mb-5">
            {[{label:"A",val:a,set:()=>setA(v=>!v)},{label:"B",val:b,set:()=>setB(v=>!v)}].map(inp=>(
              <button key={inp.label} onClick={inp.set}
                className="flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all"
                style={{borderColor:inp.val?"rgba(6,182,212,0.5)":"rgba(255,255,255,0.1)",background:inp.val?"rgba(6,182,212,0.15)":"rgba(255,255,255,0.03)",color:inp.val?COLOR:"rgba(255,255,255,0.4)"}}>
                {inp.label} = {inp.val?<span style={{color:COLOR}}>1 (HIGH)</span>:<span>0 (LOW)</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 rounded-xl overflow-hidden border border-white/8">
              <table className="w-full text-xs">
                <thead><tr style={{background:"rgba(6,182,212,0.08)"}}><th className="py-2 px-3 text-left font-mono text-white/40">A</th><th className="py-2 px-3 text-left font-mono text-white/40">B</th><th className="py-2 px-3 text-left font-mono text-white/40">Y = XOR</th></tr></thead>
                <tbody>
                  {TRUTH.map(([av,bv,yv],i)=>{
                    const isActive = av===+a && bv===+b;
                    return (
                      <tr key={i} style={{background:isActive?"rgba(6,182,212,0.12)":"transparent",transition:"background 0.2s"}}>
                        <td className="py-2 px-3 font-mono" style={{color:av?COLOR:"rgba(255,255,255,0.4)"}}>{av}</td>
                        <td className="py-2 px-3 font-mono" style={{color:bv?COLOR:"rgba(255,255,255,0.4)"}}>{bv}</td>
                        <td className="py-2 px-3 font-mono font-bold flex items-center gap-2" style={{color:yv?"#22C55E":"#EF4444"}}>
                          {yv} {isActive&&<span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(6,182,212,0.2)",color:COLOR}}>← now</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-center gap-2">
              <motion.div className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                animate={{background:out?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)",borderColor:out?"#22C55E":"#EF4444",boxShadow:out?"0 0 16px rgba(34,197,94,0.4)":"0 0 16px rgba(239,68,68,0.3)"}}
                transition={{duration:0.2}}>
                <span className="text-lg font-black font-mono" style={{color:out?"#22C55E":"#EF4444"}}>{out}</span>
              </motion.div>
              <span className="text-[9px] font-mono" style={{color:out?"#22C55E":"#EF4444"}}>{out?"HIGH":"LOW"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4 border border-white/6" style={{background:"rgba(255,255,255,0.02)"}}>
          <p className="text-xs font-bold mb-2" style={{color:COLOR}}>Real-World Use: Binary Addition</p>
          <p className="text-xs text-white/40 leading-relaxed">
            XOR is the core of binary addition: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (carry). The half-adder circuit is an XOR gate for the sum bit + AND gate for the carry bit. Every ALU (Arithmetic Logic Unit) in every CPU uses XOR chains for addition. Also used in CRC checksums, AES encryption S-boxes, and RAID storage parity.
          </p>
        </div>
      </div>
    </section>
  );
}
