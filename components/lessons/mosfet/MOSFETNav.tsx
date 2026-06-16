"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Milestones { lessonRead:boolean; switchModeUsed:boolean; amplifierUsed:boolean; gateVoltageUsed:boolean; nChannelUsed:boolean; motorDriverUsed:boolean; quizPassed:boolean; lessonFinished:boolean; }
interface Props { xp:number; milestones:Milestones; onMenuClick:()=>void; }
const PIPS = [
  {key:"lessonRead",label:"Read"},{key:"switchModeUsed",label:"Switch"},{key:"amplifierUsed",label:"Amplifier"},
  {key:"gateVoltageUsed",label:"Gate"},{key:"nChannelUsed",label:"NvP"},{key:"motorDriverUsed",label:"Motor"},{key:"quizPassed",label:"Quiz"},
] as const;

export default function MOSFETNav({ xp, milestones, onMenuClick }: Props) {
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => { const el=document.documentElement; setScrollPct(el.scrollHeight-el.clientHeight>0?(el.scrollTop/(el.scrollHeight-el.clientHeight))*100:0); };
    window.addEventListener("scroll",onScroll,{passive:true}); return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-3"
      style={{background:"rgba(5,5,7,0.92)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <Link href="/" className="flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon points="14,3 25,22 3,22" fill="#3B82F6" opacity="0.9"/>
          <polygon points="14,8 22,21 6,21" fill="#050507"/>
          <polygon points="14,11 19,20 9,20" fill="#3B82F6" opacity="0.5"/>
        </svg>
      </Link>
      <div className="flex items-center gap-1.5 text-xs min-w-0">
        <span style={{color:"rgba(240,240,245,0.35)"}}>Electronics</span>
        <span style={{color:"rgba(240,240,245,0.2)"}}>/</span>
        <span className="font-semibold truncate" style={{color:"#3B82F6"}}>MOSFET Fundamentals</span>
      </div>
      <span className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
        style={{background:"rgba(59,130,246,0.1)",color:"rgba(59,130,246,0.7)",border:"1px solid rgba(59,130,246,0.2)"}}>
        L18 of 36
      </span>
      <div className="flex-1"/>
      <div className="hidden md:flex items-center gap-1.5">
        {PIPS.map((pip)=>{ const done=milestones[pip.key]; return (
          <div key={pip.key} title={pip.label} className="w-2 h-2 rounded-full transition-all duration-300"
            style={{background:done?"#10B981":"rgba(255,255,255,0.1)",boxShadow:done?"0 0 6px rgba(16,185,129,0.6)":"none"}}/>
        );})}
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black flex-shrink-0"
        style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.22)",boxShadow:"0 0 12px rgba(59,130,246,0.12)",color:"#3B82F6"}}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="#3B82F6"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg>
        {xp} XP
      </div>
      <Link href="/electronics/bjt" className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
        style={{color:"rgba(240,240,245,0.45)",border:"1px solid rgba(255,255,255,0.08)"}}>← BJT</Link>
      <Link href="/electronics/logic-gates" className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
        style={{color:"#3B82F6",border:"1px solid rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.08)"}}>Logic Gates →</Link>
      <button onClick={onMenuClick} className="flex flex-col gap-1 p-2 rounded-lg transition-colors hover:bg-white/5" aria-label="Open menu">
        <span className="block w-4 h-0.5 bg-white/50 rounded"/>
        <span className="block w-4 h-0.5 bg-white/50 rounded"/>
        <span className="block w-3 h-0.5 bg-white/50 rounded self-end"/>
      </button>
      <motion.div className="absolute bottom-0 left-0 h-0.5 transition-all duration-100"
        style={{width:`${scrollPct}%`,background:"linear-gradient(90deg, #3B82F6, #60A5FA)"}}/>
    </nav>
  );
}
