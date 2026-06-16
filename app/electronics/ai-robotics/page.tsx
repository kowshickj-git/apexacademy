"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const COLOR = "#84CC16";
const TOPICS = ["TinyML & Edge AI","Neural networks on MCU","SLAM & mapping","Path planning algorithms","Reinforcement learning","Autonomous decision making"];

export default function AIRoboticsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"var(--background)"}}>
      <motion.div className="max-w-lg w-full text-center" initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <motion.div className="w-20 h-20 rounded-3xl border mx-auto mb-6 flex items-center justify-center text-3xl"
          style={{borderColor:"rgba(132,204,22,0.3)",background:"rgba(132,204,22,0.08)"}}
          animate={{boxShadow:["0 0 0px rgba(132,204,22,0.2)","0 0 32px rgba(132,204,22,0.35)","0 0 0px rgba(132,204,22,0.2)"]}}
          transition={{duration:2.5,repeat:Infinity}}>
          🧠
        </motion.div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4"
          style={{borderColor:"rgba(132,204,22,0.3)",background:"rgba(132,204,22,0.08)",color:COLOR}}>
          Lesson 36 · Coming Soon
        </div>
        <h1 className="text-3xl font-black mb-3 text-white">AI Robotics</h1>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          The final frontier — intelligent autonomous systems. This lesson combines embedded AI, computer vision, and robotics to build machines that sense, think, and act in the real world.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          {TOPICS.map(t => (
            <div key={t} className="flex items-center gap-2 text-xs text-white/35 p-3 rounded-xl border border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>
              <span style={{color:COLOR}}>○</span>{t}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/electronics/computer-vision" className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5"
            style={{borderColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)"}}>← Computer Vision</Link>
          <Link href="/" className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{background:"rgba(132,204,22,0.15)",border:"1px solid rgba(132,204,22,0.3)",color:COLOR}}>Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
