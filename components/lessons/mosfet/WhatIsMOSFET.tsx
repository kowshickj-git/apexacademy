"use client";
import { motion } from "framer-motion";

export default function WhatIsMOSFET() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 2 · Concepts</p>
        <h2 className="text-xl font-bold mb-4">What is a MOSFET?</h2>
        <p className="text-white/55 text-sm leading-relaxed mb-6">
          MOSFET = Metal-Oxide-Semiconductor Field-Effect Transistor. The gate is insulated from the semiconductor by a thin oxide layer — so the gate draws virtually <em>zero</em> current. The electric field from the gate voltage opens or closes a conductive channel between drain and source.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[{t:"BJT (Current Controlled)",d:"Requires I_B continuously. More power to stay on.",col:"#EF4444"},
            {t:"MOSFET (Voltage Controlled)",d:"Only V_GS needed. Gate current ≈ 0. More efficient.",col:"#3B82F6"}].map((item)=>(
            <div key={item.t} className="rounded-xl p-3 border" style={{borderColor:`${item.col}33`,background:`${item.col}0A`}}>
              <div className="text-xs font-bold mb-1" style={{color:item.col}}>{item.t}</div>
              <div className="text-[11px] text-white/45">{item.d}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
          <div className="px-4 py-2 border-b border-white/5" style={{background:"rgba(59,130,246,0.06)"}}>
            <p className="text-xs font-bold" style={{color:"#3B82F6"}}>MOSFET Anatomy</p>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {[{term:"Gate (G)",def:"Control terminal. Electric field from V_GS opens channel. Insulated by SiO₂."},
              {term:"Drain (D)",def:"Where conventional current exits (N-ch). Connected to +V or load."},
              {term:"Source (S)",def:"Current source/reference. Connected to GND (N-ch) or V+ (P-ch)."},
              {term:"Body (B)",def:"Substrate. Usually tied to Source. Affects threshold voltage."}].map((item,i)=>(
              <div key={item.term} className="p-3 border-white/5" style={{borderBottom:i<2?"1px solid rgba(255,255,255,0.05)":"none",borderRight:i%2===0?"1px solid rgba(255,255,255,0.05)":"none"}}>
                <div className="text-[10px] font-black font-mono mb-1" style={{color:"rgba(59,130,246,0.7)"}}>{item.term}</div>
                <div className="text-[10px] text-white/40 leading-relaxed">{item.def}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 border border-white/6" style={{background:"rgba(255,255,255,0.02)"}}>
          <p className="text-xs text-white/30 font-mono mb-2">Key Formulas</p>
          {[{f:"I_D = (μₙCₒₓW/2L)(V_GS - V_th)²","n":"Saturation region (simplified)"},
            {f:"I_D ≈ 0","n":"Cutoff — V_GS < V_th"},
            {f:"R_DS(on) ≈ 1/(μₙCₒₓ(W/L)(V_GS−V_th))","n":"On-resistance in linear region"}].map((item)=>(
            <div key={item.f} className="flex items-start gap-2 mb-2 last:mb-0">
              <code className="text-[10px] font-mono px-2 py-1 rounded" style={{background:"rgba(59,130,246,0.1)",color:"#3B82F6"}}>{item.f}</code>
              <span className="text-[10px] text-white/30 pt-1 flex-1">{item.n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
