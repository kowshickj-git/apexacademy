"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BigIdea() {
  const [pinStates, setPinStates] = useState<boolean[]>(Array(14).fill(false));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setPinStates(prev => {
        const next = [...prev];
        // Pin 13 blinks
        next[13] = !prev[13];
        // Ripple other pins
        if (tick % 4 === 0) { for(let i = 0; i < 13; i++) next[i] = Math.random() > 0.7; }
        return next;
      });
    }, 600);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 1 · The Big Idea</p>
        <h2 className="text-xl font-bold mb-1">Hardware Meets Software</h2>
        <p className="text-white/45 text-sm mb-6">Arduino bridges the digital world of code with the physical world of electrons. Watch the board come alive:</p>

        {/* Arduino board animation */}
        <div className="rounded-2xl border overflow-hidden mb-6 p-4" style={{borderColor:"rgba(5,150,105,0.25)",background:"rgba(0,50,30,0.3)"}}>
          <div className="relative">
            {/* Board outline */}
            <div className="rounded-xl p-4 mx-auto" style={{background:"rgba(0,100,50,0.2)",border:"2px solid rgba(5,150,105,0.3)",maxWidth:"340px"}}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs font-black" style={{color:"#059669"}}>ARDUINO</p>
                  <p className="text-[9px] text-white/30 font-mono">UNO R3</p>
                </div>
                {/* Built-in LED L (pin 13) */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 font-mono">L (pin 13)</span>
                  <motion.div className="w-4 h-4 rounded-full" style={{background:pinStates[13]?"#F59E0B":"rgba(245,158,11,0.2)",boxShadow:pinStates[13]?"0 0 10px #F59E0B":"none",transition:"all 0.3s"}}/>
                </div>
              </div>
              {/* Digital pins */}
              <div className="flex gap-1 justify-center mb-2">
                {pinStates.map((on, i) => (
                  <motion.div key={i} className="w-2.5 h-5 rounded-sm" animate={{background:on?"#059669":"rgba(5,150,105,0.15)"}} transition={{duration:0.2}}
                    style={{boxShadow:on?"0 0 4px #059669":"none"}}>
                    {i===0&&<div className="text-[6px] text-center text-white/20 font-mono mt-0.5">0</div>}
                  </motion.div>
                ))}
              </div>
              <p className="text-[9px] text-white/25 text-center font-mono">Digital pins 0–13 — each toggles independently</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[{t:"Open Source",d:"Free IDE, free libraries, massive community — 50M+ boards shipped",icon:"🌍"},
            {t:"C++ Simplified",d:"Arduino wraps C++ with beginner-friendly functions: pinMode, digitalRead, delay",icon:"💻"},
            {t:"Real Hardware",d:"Control LEDs, motors, sensors, displays with actual physical circuits",icon:"🔌"}].map((c)=>(
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
