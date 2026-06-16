"use client";
import { motion } from "framer-motion";

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 pt-10 pb-8 border-b border-white/5">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{color:"rgba(59,130,246,0.6)"}}>Lesson 18 · MOSFET</p>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight"
          style={{background:"linear-gradient(135deg,#3B82F6,#60A5FA,#93C5FD)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          MOSFET Fundamentals
        </h1>
        <p className="text-white/50 text-base mb-6 max-w-xl">
          Zero gate current. Voltage-controlled. The transistor that powers everything from your phone to electric cars.
        </p>
        <div className="flex flex-wrap gap-3">
          {[{label:"200 XP",icon:"⚡"},{label:"5 Simulators",icon:"🎮"},{label:"20-Q Quiz",icon:"📝"},{label:"L18 of 36",icon:"📍"}].map((b)=>(
            <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{borderColor:"rgba(59,130,246,0.25)",background:"rgba(59,130,246,0.06)",color:"rgba(59,130,246,0.8)"}}>
              <span>{b.icon}</span><span>{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
