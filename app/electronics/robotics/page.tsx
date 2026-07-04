"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const COLOR = "#F59E0B";
const TOPICS = ["DC & stepper motors","Encoder feedback","PID control loops","Servo systems","Robot kinematics","Autonomous navigation"];

export default function RoboticsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"var(--background)"}}>
      <motion.div className="max-w-lg w-full text-center" initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <motion.div className="w-20 h-20 rounded-3xl border mx-auto mb-6 flex items-center justify-center text-3xl"
          style={{borderColor:"rgba(245,158,11,0.3)",background:"rgba(245,158,11,0.08)"}}
          animate={{boxShadow:["0 0 0px rgba(245,158,11,0.2)","0 0 32px rgba(245,158,11,0.35)","0 0 0px rgba(245,158,11,0.2)"]}}
          transition={{duration:2.5,repeat:Infinity}}>
          🤖
        </motion.div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4"
          style={{borderColor:"rgba(245,158,11,0.3)",background:"rgba(245,158,11,0.08)",color:COLOR}}>
          Lesson 34 · Coming Soon
        </div>
        <h1 className="text-3xl font-black mb-3 text-white">Robotics</h1>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          Build autonomous robots from scratch. This lesson covers motor control, encoder feedback, PID controllers, kinematics, and integrating sensors to navigate the physical world.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          {TOPICS.map(t => (
            <div key={t} className="flex items-center gap-2 text-xs text-white/35 p-3 rounded-xl border border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>
              <span style={{color:COLOR}}>○</span>{t}
            </div>
          ))}
        </div>
        <Link href="/electronics/line-follower" className="block mb-8 p-4 rounded-2xl border text-left transition-all hover:scale-[1.02]"
          style={{borderColor:"rgba(245,158,11,0.4)",background:"linear-gradient(120deg, rgba(245,158,11,0.12), rgba(34,211,238,0.08))"}}>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1" style={{color:COLOR}}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:COLOR}} />
            Available now · Interactive Project Lab
          </div>
          <div className="text-sm font-black text-white mb-0.5">🏁 Build a Line Follower Robot From Scratch</div>
          <div className="text-[11px] text-white/40">17 interactive labs: assemble, wire, code, simulate, tune PID, and earn a certificate — all in your browser →</div>
        </Link>
        <div className="flex gap-3 justify-center">
          <Link href="/electronics/embedded-projects" className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5"
            style={{borderColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)"}}>← Embedded Projects</Link>
          <Link href="/" className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:COLOR}}>Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
