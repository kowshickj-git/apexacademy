"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SYMBOLS = ["AND","OR","NOT","NAND","NOR","XOR","1","0","HIGH","LOW","TRUE","FALSE"];

export default function BigIdea() {
  const [cols] = useState(() => Array.from({length:12},(_,i)=>({x:i*8+1,symbol:SYMBOLS[i%SYMBOLS.length],speed:1+Math.random()*2,delay:Math.random()*3})));

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 1 · The Big Idea</p>
        <h2 className="text-xl font-bold mb-1">Binary Thinking</h2>
        <p className="text-white/45 text-sm mb-6">Logic gates are the building blocks of all digital electronics — they make decisions using only 1s and 0s.</p>

        {/* Matrix rain animation */}
        <div className="rounded-2xl border overflow-hidden mb-6 relative" style={{borderColor:"rgba(132,204,22,0.2)",background:"rgba(0,0,0,0.8)",height:"160px"}}>
          <svg width="100%" height="160" className="absolute inset-0">
            {cols.map((col,i)=>(
              <motion.text key={i} x={`${col.x}%`} fontSize="11" fill="#84CC16" fontFamily="monospace" opacity="0.7" textAnchor="middle"
                animate={{y:["-10%","110%"]}} transition={{duration:col.speed+2,repeat:Infinity,ease:"linear",delay:col.delay}}>
                {col.symbol}
              </motion.text>
            ))}
          </svg>
          {/* Center gate display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl px-6 py-3 text-center" style={{background:"rgba(0,0,0,0.8)",border:"1px solid rgba(132,204,22,0.4)"}}>
              <p className="text-2xl font-black font-mono" style={{color:"#84CC16"}}>1 AND 1 = <span className="text-white">1</span></p>
              <p className="text-xs text-white/40 mt-1">Logic gates make decisions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[{t:"Boolean Logic",d:"All digital decisions reduce to TRUE/FALSE, 1/0, HIGH/LOW",icon:"🧠"},
            {t:"7 Universal Gates",d:"AND, OR, NOT, NAND, NOR, XOR, XNOR — combine to make any logic",icon:"🔧"},
            {t:"Built from MOSFETs",d:"Every gate is 2–6 transistors. A CPU has billions of gates",icon:"💻"}].map((c)=>(
            <div key={c.t} className="rounded-xl p-3 border border-white/6" style={{background:"rgba(255,255,255,0.02)"}}>
              <div className="text-lg mb-1">{c.icon}</div>
              <div className="text-xs font-bold text-white/75 mb-1">{c.t}</div>
              <div className="text-[10px] text-white/35 leading-relaxed">{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
