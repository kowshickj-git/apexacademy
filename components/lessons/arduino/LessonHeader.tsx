"use client";
import { motion } from "framer-motion";

export default function LessonHeader() {
  return (
    <section className="px-4 sm:px-8 pt-10 pb-8 border-b border-white/5">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{color:"rgba(5,150,105,0.6)"}}>Lesson 20 · Arduino · FINAL</p>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight" style={{background:"linear-gradient(135deg,#059669,#10B981,#34D399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Arduino Fundamentals</h1>
        <p className="text-white/50 text-base mb-6 max-w-xl">The final lesson. Write real C++, control LEDs, read buttons, drive motors — and understand every electron flowing through your circuit.</p>
        <div className="flex flex-wrap gap-3">
          {[{label:"200 XP",icon:"⚡"},{label:"5 Simulators",icon:"🎮"},{label:"20-Q Quiz",icon:"📝"},{label:"Final Lesson 🏆",icon:"🎓"}].map((b)=>(
            <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{borderColor:"rgba(5,150,105,0.25)",background:"rgba(5,150,105,0.06)",color:"rgba(5,150,105,0.8)"}}>
              <span>{b.icon}</span><span>{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
