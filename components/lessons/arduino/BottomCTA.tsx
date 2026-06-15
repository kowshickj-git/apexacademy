"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BottomCTA() {
  const dots = Array.from({length:20},(_,i)=>i);
  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-2xl">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-8 flex-wrap">
          {dots.map(i=>(
            <motion.div key={i} className="h-2 rounded-full" initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.04,type:"spring"}}
              style={{width:i<20?"20px":"12px",background:i<20?"#059669":"rgba(255,255,255,0.1)"}}/>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-2xl font-black mb-1" style={{color:"#059669"}}>You Finished the Course!</h2>
          <p className="text-white/40 text-sm">All 20 lessons of APEX Academy Electronics completed.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/electronics/logic-gates" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:bg-white/3"
            style={{borderColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.45)"}}>
            ← Logic Gates
          </Link>
          <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-sm cursor-not-allowed"
            style={{borderColor:"rgba(5,150,105,0.2)",color:"rgba(5,150,105,0.4)",background:"rgba(5,150,105,0.04)"}}>
            Sensors — Coming Soon
          </div>
        </div>
      </div>
    </section>
  );
}
