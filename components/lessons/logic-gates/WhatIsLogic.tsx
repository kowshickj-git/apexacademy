"use client";
import { motion } from "framer-motion";

export default function WhatIsLogic() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 2 · Concepts</p>
        <h2 className="text-xl font-bold mb-4">Boolean Logic & Digital Signals</h2>
        <p className="text-white/55 text-sm leading-relaxed mb-6">
          George Boole invented Boolean algebra in 1854 — a math system with only two values: TRUE and FALSE. In electronics, HIGH voltage (e.g. 3.3V or 5V) = 1 = TRUE. LOW voltage (0V) = 0 = FALSE. Logic gates perform Boolean operations on these signals.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[{label:"HIGH (1)",v:"3.3V or 5V",col:"#84CC16"},{label:"LOW (0)",v:"0V (GND)",col:"rgba(255,255,255,0.3)"}].map((s)=>(
            <div key={s.label} className="rounded-xl p-4 border text-center" style={{borderColor:`${s.col}33`,background:`${s.col}0A`}}>
              <div className="text-lg font-black font-mono mb-1" style={{color:s.col}}>{s.label}</div>
              <div className="text-xs text-white/40">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
          <div className="px-4 py-2 border-b border-white/5" style={{background:"rgba(132,204,22,0.06)"}}>
            <p className="text-xs font-bold" style={{color:"#84CC16"}}>The 7 Standard Logic Gates</p>
          </div>
          <table className="w-full text-xs">
            <thead><tr style={{background:"rgba(255,255,255,0.02)"}}><th className="text-left p-2.5 text-white/35 font-mono">Gate</th><th className="text-left p-2.5 text-white/35 font-mono">Symbol</th><th className="text-left p-2.5 text-white/35 font-mono">Rule</th></tr></thead>
            <tbody>
              {[["AND","A·B","Output HIGH only if ALL inputs are HIGH"],
                ["OR","A+B","Output HIGH if ANY input is HIGH"],
                ["NOT","Ā","Output is opposite of input (inverter)"],
                ["NAND","NOT(A·B)","Output LOW only if ALL inputs HIGH (inverted AND)"],
                ["NOR","NOT(A+B)","Output HIGH only if ALL inputs LOW (inverted OR)"],
                ["XOR","A⊕B","Output HIGH if inputs are DIFFERENT"],
                ["XNOR","NOT(A⊕B)","Output HIGH if inputs are SAME"]].map(([gate,sym,rule])=>(
                <tr key={gate} className="border-t border-white/5">
                  <td className="p-2.5 font-black font-mono text-xs" style={{color:"#84CC16"}}>{gate}</td>
                  <td className="p-2.5 font-mono text-white/60 text-xs">{sym}</td>
                  <td className="p-2.5 text-white/40 text-[10px]">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
