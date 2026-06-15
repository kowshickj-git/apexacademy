"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const TEAL = "#0EA5E9";

export default function CapacitorsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"var(--background)"}}>
      <motion.div className="max-w-lg w-full text-center" initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>

        {/* Icon */}
        <motion.div className="w-20 h-20 rounded-3xl border mx-auto mb-6 flex items-center justify-center text-3xl"
          style={{borderColor:"rgba(14,165,233,0.3)",background:"rgba(14,165,233,0.08)"}}
          animate={{boxShadow:["0 0 0px rgba(14,165,233,0.2)","0 0 32px rgba(14,165,233,0.35)","0 0 0px rgba(14,165,233,0.2)"]}}
          transition={{duration:2.5,repeat:Infinity}}>
          ⚡
        </motion.div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4"
          style={{borderColor:"rgba(14,165,233,0.3)",background:"rgba(14,165,233,0.08)",color:TEAL}}>
          Lesson 06 · Coming Soon
        </div>

        <h1 className="text-3xl font-black mb-3">Capacitors</h1>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          Capacitors store and release electrical energy — they&apos;re in every power supply, filter, and timing circuit. This lesson is being built and will cover charging curves, RC time constants, filtering, and energy storage.
        </p>

        {/* Topics preview */}
        <div className="rounded-2xl border border-white/8 p-5 mb-8 text-left" style={{background:"rgba(255,255,255,0.02)"}}>
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">What you&apos;ll learn</p>
          <div className="space-y-2">
            {["How capacitors store charge (Q = CV)","Charging and discharging curves","RC time constant: τ = RC","Types: ceramic, electrolytic, tantalum","Capacitors in series and parallel","AC coupling and power filtering","Bypass / decoupling caps in PCB design"].map((item)=>(
              <div key={item} className="flex items-center gap-2.5 text-sm text-white/45">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:"rgba(14,165,233,0.5)"}}/>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-8">
          {Array.from({length:20},(_,i)=>(
            <div key={i} className="h-1.5 rounded-full" style={{width:"16px",background:i<5?"#10B981":i===5?"rgba(14,165,233,0.5)":"rgba(255,255,255,0.08)"}}/>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/electronics/ohms-law" className="px-5 py-2.5 rounded-xl border border-white/12 text-sm font-bold text-white/50 hover:text-white/70 hover:border-white/22 transition-all">
            ← Ohm&apos;s Law
          </Link>
          <Link href="/electronics/diodes" className="px-5 py-2.5 rounded-xl font-bold text-sm border transition-all"
            style={{borderColor:"rgba(14,165,233,0.35)",background:"rgba(14,165,233,0.1)",color:TEAL}}>
            Skip to Diodes →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
