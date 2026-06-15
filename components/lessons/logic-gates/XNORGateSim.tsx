"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#EC4899";
const TRUTH = [[0,0,1],[0,1,0],[1,0,0],[1,1,1]] as const;

export default function XNORGateSim() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const out = (a === b) ? 1 : 0;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · XNOR Gate Simulator</p>
        <h2 className="text-xl font-bold mb-1">XNOR Gate — Exclusive NOR</h2>
        <p className="text-white/45 text-sm mb-6">
          XNOR (Exclusive NOR) = XOR + NOT. Output is HIGH <em>only when both inputs are the SAME</em>. It&apos;s an &quot;equality checker&quot;: if A equals B, output is 1. If A differs from B, output is 0.
        </p>

        <div className="rounded-2xl border p-5 mb-4" style={{borderColor:"rgba(236,72,153,0.22)",background:"rgba(236,72,153,0.05)"}}>
          {/* Equality comparison visual */}
          <div className="rounded-xl p-3 border border-white/8 mb-5" style={{background:"rgba(236,72,153,0.06)"}}>
            <p className="text-[10px] text-white/30 font-mono mb-2 uppercase tracking-wider">Equality Detector</p>
            <div className="flex items-center gap-3">
              <div className="rounded-lg px-3 py-2 border font-mono text-sm font-bold flex-1 text-center"
                style={{borderColor:a?"rgba(236,72,153,0.4)":"rgba(255,255,255,0.1)",background:a?"rgba(236,72,153,0.1)":"transparent",color:a?COLOR:"rgba(255,255,255,0.4)"}}>
                A = {+a}
              </div>
              <div className="text-white/30 font-mono text-lg">
                {a===b ? "=" : "≠"}
              </div>
              <div className="rounded-lg px-3 py-2 border font-mono text-sm font-bold flex-1 text-center"
                style={{borderColor:b?"rgba(236,72,153,0.4)":"rgba(255,255,255,0.1)",background:b?"rgba(236,72,153,0.1)":"transparent",color:b?COLOR:"rgba(255,255,255,0.4)"}}>
                B = {+b}
              </div>
              <div className="text-white/30 font-mono">→</div>
              <motion.div className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                animate={{background:out?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)",borderColor:out?"#22C55E":"#EF4444",boxShadow:out?"0 0 14px rgba(34,197,94,0.4)":"0 0 14px rgba(239,68,68,0.3)"}}
                transition={{duration:0.2}}>
                <span className="text-base font-black font-mono" style={{color:out?"#22C55E":"#EF4444"}}>{out}</span>
              </motion.div>
            </div>
            <p className="text-[10px] text-center mt-2" style={{color:a===b?"#22C55E":"#EF4444"}}>
              {a===b?"✓ Inputs MATCH — XNOR outputs 1 (HIGH)":"✗ Inputs DIFFER — XNOR outputs 0 (LOW)"}
            </p>
          </div>

          {/* Gate SVG */}
          <div className="flex items-center gap-6 mb-5">
            <svg width="110" height="80" viewBox="0 0 110 80">
              <path d="M20,12 Q35,12 50,40 Q35,68 20,68 Q38,40 20,12 Z" fill="rgba(236,72,153,0.1)" stroke={COLOR} strokeWidth="1.8"/>
              <path d="M13,12 Q30,40 13,68" fill="none" stroke={COLOR} strokeWidth="1.8"/>
              <line x1="0" y1="25" x2="23" y2="25" stroke={a?"#EC4899":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <line x1="0" y1="55" x2="23" y2="55" stroke={b?"#EC4899":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <line x1="50" y1="40" x2="60" y2="40" stroke={out?"#EC4899":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <circle cx="66" cy="40" r="6" fill="none" stroke={COLOR} strokeWidth="1.8"/>
              <line x1="72" y1="40" x2="110" y2="40" stroke={out?"#EC4899":"rgba(255,255,255,0.2)"} strokeWidth="2.5"/>
              <text x="28" y="43" fill={COLOR} fontSize="9" fontFamily="monospace" textAnchor="middle">XNOR</text>
              <text x="5" y="22" fill={a?"#EC4899":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">A={a?1:0}</text>
              <text x="5" y="52" fill={b?"#EC4899":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">B={b?1:0}</text>
              <text x="100" y="37" fill={out?"#EC4899":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace">Y={out}</text>
            </svg>

            <div className="flex-1 space-y-1.5">
              {TRUTH.map(([av,bv,yv],i)=>{
                const isActive = av===+a && bv===+b;
                return (
                  <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style={{borderColor:isActive?"rgba(236,72,153,0.4)":"rgba(255,255,255,0.05)",background:isActive?"rgba(236,72,153,0.1)":"transparent",transition:"all 0.2s"}}>
                    <span className="font-mono text-[11px]" style={{color:"rgba(255,255,255,0.4)"}}>{av}⊙{bv}</span>
                    <span className="font-mono text-[11px] mx-1" style={{color:"rgba(255,255,255,0.2)"}}>→</span>
                    <span className="font-mono text-[11px] font-bold" style={{color:yv?"#22C55E":"#EF4444"}}>{yv}</span>
                    <span className="text-[9px] ml-auto" style={{color:"rgba(255,255,255,0.2)"}}>{av===bv?"same":"diff"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            {[{label:"A",val:a,set:()=>setA(v=>!v)},{label:"B",val:b,set:()=>setB(v=>!v)}].map(inp=>(
              <button key={inp.label} onClick={inp.set}
                className="flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all"
                style={{borderColor:inp.val?"rgba(236,72,153,0.5)":"rgba(255,255,255,0.1)",background:inp.val?"rgba(236,72,153,0.15)":"rgba(255,255,255,0.03)",color:inp.val?COLOR:"rgba(255,255,255,0.4)"}}>
                {inp.label} = {inp.val?<span style={{color:COLOR}}>1 (HIGH)</span>:<span>0 (LOW)</span>}
              </button>
            ))}
          </div>

          <div className="rounded-xl overflow-hidden border border-white/8">
            <table className="w-full text-xs">
              <thead><tr style={{background:"rgba(236,72,153,0.08)"}}><th className="py-2 px-3 text-left font-mono text-white/40">A</th><th className="py-2 px-3 text-left font-mono text-white/40">B</th><th className="py-2 px-3 text-left font-mono text-white/40">Y = XNOR</th></tr></thead>
              <tbody>
                {TRUTH.map(([av,bv,yv],i)=>{
                  const isActive = av===+a && bv===+b;
                  return (
                    <tr key={i} style={{background:isActive?"rgba(236,72,153,0.12)":"transparent",transition:"background 0.2s"}}>
                      <td className="py-2 px-3 font-mono" style={{color:av?COLOR:"rgba(255,255,255,0.4)"}}>{av}</td>
                      <td className="py-2 px-3 font-mono" style={{color:bv?COLOR:"rgba(255,255,255,0.4)"}}>{bv}</td>
                      <td className="py-2 px-3 font-mono font-bold flex items-center gap-2" style={{color:yv?"#22C55E":"#EF4444"}}>
                        {yv} {isActive&&<span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(236,72,153,0.2)",color:COLOR}}>← now</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl p-4 border border-white/6" style={{background:"rgba(255,255,255,0.02)"}}>
          <p className="text-xs font-bold mb-2" style={{color:COLOR}}>Real-World Use: Comparators &amp; Error Detection</p>
          <p className="text-xs text-white/40 leading-relaxed">
            XNOR gates build digital comparators: compare two n-bit numbers bit-by-bit. If all XNOR outputs are 1, both numbers are identical. Used in data integrity checks (memory verification), address decoding in microcontrollers, clock phase detectors (PLLs), and RFID reader chips that compare a stored code with a presented card.
          </p>
        </div>
      </div>
    </section>
  );
}
