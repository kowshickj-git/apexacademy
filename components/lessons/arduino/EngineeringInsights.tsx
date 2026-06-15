"use client";
import { motion } from "framer-motion";

const INSIGHTS = [
  {
    title:"From Arduino to Embedded Linux",
    body:"Once your project outgrows 32KB flash, you move to Raspberry Pi (Linux) or STM32 (bare-metal C). Arduino teaches the workflow; professional firmware uses the same setup()/loop() pattern with HAL libraries.",
    icon:"🐧",
  },
  {
    title:"Shields, HATs, and Grove Modules",
    body:"Arduino shields plug directly on top — motor shields, WiFi shields, LCD shields. They follow the same pin-header standard, letting you stack hardware without any wiring. Grove modules add click-to-connect simplicity.",
    icon:"🛡️",
  },
  {
    title:"Arduino in Industry",
    body:"Arduino Uno is a prototyping board. For production: Arduino Pro Mini (no USB), Arduino Nano Every, or custom PCBs with the same ATmega chip. NASA used Arduino-derived boards in CubeSat student payloads.",
    icon:"🏭",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 8</p>
        <h2 className="text-xl font-bold mb-6">Engineering Insights</h2>
        <div className="grid gap-4">
          {INSIGHTS.map((ins,i)=>(
            <motion.div key={ins.title} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.12}}
              className="rounded-2xl border p-5 flex gap-4" style={{borderColor:"rgba(5,150,105,0.2)",background:"rgba(5,150,105,0.05)"}}>
              <div className="text-2xl flex-shrink-0 mt-0.5">{ins.icon}</div>
              <div>
                <h3 className="font-bold text-sm mb-1" style={{color:"#059669"}}>{ins.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{ins.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
