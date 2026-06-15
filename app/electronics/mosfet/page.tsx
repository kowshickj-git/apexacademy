"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MOSFETNav from "@/components/lessons/mosfet/MOSFETNav";
import LearningPath from "@/components/lessons/mosfet/LearningPath";
import LessonHeader from "@/components/lessons/mosfet/LessonHeader";
import BigIdea from "@/components/lessons/mosfet/BigIdea";
import WhatIsMOSFET from "@/components/lessons/mosfet/WhatIsMOSFET";
import MOSFETSwitchSim from "@/components/lessons/mosfet/MOSFETSwitchSim";
import AmplifierSim from "@/components/lessons/mosfet/AmplifierSim";
import GateVoltageSim from "@/components/lessons/mosfet/GateVoltageSim";
import NChannelExplorer from "@/components/lessons/mosfet/NChannelExplorer";
import MotorDriverSim from "@/components/lessons/mosfet/MotorDriverSim";
import EngineeringInsights from "@/components/lessons/mosfet/EngineeringInsights";
import CommonMistakes from "@/components/lessons/mosfet/CommonMistakes";
import KeyTakeaways from "@/components/lessons/mosfet/KeyTakeaways";
import Quiz from "@/components/lessons/mosfet/Quiz";
import BottomCTA from "@/components/lessons/mosfet/BottomCTA";
import MOSFETComplete from "@/components/lessons/mosfet/MOSFETComplete";

type MilestoneKey = "lessonRead"|"switchModeUsed"|"amplifierUsed"|"gateVoltageUsed"|"nChannelUsed"|"motorDriverUsed"|"quizPassed"|"lessonFinished";
interface Milestones { lessonRead:boolean; switchModeUsed:boolean; amplifierUsed:boolean; gateVoltageUsed:boolean; nChannelUsed:boolean; motorDriverUsed:boolean; quizPassed:boolean; lessonFinished:boolean; }
const XP_VALUES:Record<MilestoneKey,number> = { lessonRead:10, switchModeUsed:20, amplifierUsed:20, gateVoltageUsed:15, nChannelUsed:15, motorDriverUsed:20, quizPassed:50, lessonFinished:50 };

export default function MOSFETPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({ lessonRead:false, switchModeUsed:false, amplifierUsed:false, gateVoltageUsed:false, nChannelUsed:false, motorDriverUsed:false, quizPassed:false, lessonFinished:false });
  const [showXpPopup, setShowXpPopup] = useState<{amount:number;id:number}|null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const readRef = useRef<HTMLDivElement>(null);
  const popupCounter = useRef(0);

  useEffect(() => {
    window.history.pushState(null,"");
    const h=(e:PopStateEvent)=>{ e.stopImmediatePropagation(); window.history.pushState(null,""); window.location.replace("/electronics/bjt"); };
    window.addEventListener("popstate",h,true);
    return ()=>window.removeEventListener("popstate",h,true);
  },[]);

  useEffect(() => {
    const el=readRef.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting) earnXP(10,"lessonRead"); },{threshold:0.5});
    obs.observe(el); return ()=>obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const earnXP = useCallback((amount:number,key:MilestoneKey) => {
    setMilestones(prev=>{ if(prev[key]) return prev;
      const next={...prev,[key]:true};
      setXp(x=>x+amount);
      popupCounter.current+=1;
      setShowXpPopup({amount,id:popupCounter.current});
      setTimeout(()=>setShowXpPopup(null),1800);
      const readyKeys:MilestoneKey[]=["lessonRead","switchModeUsed","amplifierUsed","gateVoltageUsed","nChannelUsed","motorDriverUsed","quizPassed"];
      const allDone=readyKeys.every(k=>k===key?true:prev[k]);
      if(allDone&&!prev.lessonFinished&&key!=="lessonFinished"){
        setTimeout(()=>{ setMilestones(m=>{ if(m.lessonFinished) return m; setXp(x=>x+XP_VALUES.lessonFinished); setShowComplete(true); return {...m,lessonFinished:true}; }); },600);
      }
      return next;
    });
  },[]);

  return (
    <div className="min-h-screen" style={{background:"var(--background)"}}>
      <MOSFETNav xp={xp} milestones={milestones} onMenuClick={()=>setSidebarOpen(true)}/>
      <AnimatePresence>{sidebarOpen&&(<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 bg-black/60" onClick={()=>setSidebarOpen(false)}/><motion.aside initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:260}} className="fixed top-0 right-0 h-full w-72 z-50 border-l border-white/8 overflow-y-auto" style={{background:"rgba(18,18,27,0.98)",backdropFilter:"blur(16px)"}}><div className="p-4 flex justify-between items-center border-b border-white/5"><span className="text-sm font-bold text-white/70">Course Progress</span><button onClick={()=>setSidebarOpen(false)} className="text-white/30 hover:text-white/60 text-lg">✕</button></div><LearningPath milestones={milestones}/></motion.aside></>)}</AnimatePresence>
      <AnimatePresence>{showXpPopup&&(<motion.div key={showXpPopup.id} initial={{opacity:0,y:20,scale:0.85}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-16,scale:0.9}} transition={{duration:0.35}} className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-blue-500/30 shadow-xl" style={{background:"rgba(59,130,246,0.12)",backdropFilter:"blur(12px)"}}><svg width="14" height="14" viewBox="0 0 12 12" fill="#3B82F6"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg><span className="text-sm font-black" style={{color:"#3B82F6"}}>+{showXpPopup.amount} XP</span></motion.div>)}</AnimatePresence>
      <main className="pt-14 max-w-5xl mx-auto">
        <LessonHeader/><BigIdea/><WhatIsMOSFET/>
        <MOSFETSwitchSim onSwitchModeUsed={()=>earnXP(20,"switchModeUsed")}/>
        <AmplifierSim onAmplifierUsed={()=>earnXP(20,"amplifierUsed")}/>
        <GateVoltageSim onGateVoltageUsed={()=>earnXP(15,"gateVoltageUsed")}/>
        <NChannelExplorer onNChannelUsed={()=>earnXP(15,"nChannelUsed")}/>
        <MotorDriverSim onMotorDriverUsed={()=>earnXP(20,"motorDriverUsed")}/>
        <EngineeringInsights/><CommonMistakes/>
        <div ref={readRef}><KeyTakeaways/></div>
        <Quiz onPass={()=>earnXP(50,"quizPassed")}/>
        <BottomCTA/>
      </main>
      <AnimatePresence>{showComplete&&<MOSFETComplete xp={xp} onClose={()=>setShowComplete(false)}/>}</AnimatePresence>
    </div>
  );
}
