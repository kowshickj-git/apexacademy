"use client";
import { motion } from "framer-motion";

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 pt-10 pb-8 border-b border-white/5">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{color:"rgba(132,204,22,0.6)"}}>Lesson 19 · Logic Gates</p>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight" style={{background:"linear-gradient(135deg,#84CC16,#A3E635,#D9F99D)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Logic Gates</h1>
        <p className="text-white/50 text-base mb-6 max-w-xl">AND, OR, NOT, NAND, NOR, XOR — seven gates that make every computer, phone, and digital device think.</p>
        <div className="flex flex-wrap gap-3">
          {[{label:"200 XP",icon:"⚡"},{label:"5 Simulators",icon:"🎮"},{label:"20-Q Quiz",icon:"📝"},{label:"L19 of 20",icon:"📍"}].map((b)=>(
            <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{borderColor:"rgba(132,204,22,0.25)",background:"rgba(132,204,22,0.06)",color:"rgba(132,204,22,0.8)"}}>
              <span>{b.icon}</span><span>{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
