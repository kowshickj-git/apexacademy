"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BottomCTA() {
  const dots = Array.from({length:36},(_,i)=>i);
  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-2xl">
        {/* Progress dots */}
        <div className="flex gap-1 mb-8 flex-wrap">
          {dots.map(i=>(
            <motion.div key={i} className="h-2 rounded-full" initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.03,type:"spring"}}
              style={{width:"16px",background:i<20?"#059669":i===20?"rgba(14,165,233,0.6)":"rgba(255,255,255,0.08)"}}/>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🚀</div>
          <h2 className="text-2xl font-black mb-1" style={{color:"#059669"}}>Arduino Complete!</h2>
          <p className="text-white/40 text-sm">L20 done · 16 more lessons in the Embedded Systems track.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/electronics/logic-gates" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:bg-white/3"
            style={{borderColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.45)"}}>
            ← Logic Gates
          </Link>
          <Link href="/electronics/sensors" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:opacity-90"
            style={{borderColor:"rgba(14,165,233,0.4)",color:"#0EA5E9",background:"rgba(14,165,233,0.1)"}}>
            Sensors →
          </Link>
        </div>
      </div>
    </section>
  );
}
