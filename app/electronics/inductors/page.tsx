"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InductorsNav from "@/components/lessons/inductors/InductorsNav";
import LearningPath from "@/components/lessons/inductors/LearningPath";
import LessonHeader from "@/components/lessons/inductors/LessonHeader";
import BigIdea from "@/components/lessons/inductors/BigIdea";
import WhatIsInductor from "@/components/lessons/inductors/WhatIsInductor";
import MagneticFieldExplorer from "@/components/lessons/inductors/MagneticFieldExplorer";
import ChargingSim from "@/components/lessons/inductors/ChargingSim";
import DischargeSim from "@/components/lessons/inductors/DischargeSim";
import MagneticFieldSim from "@/components/lessons/inductors/MagneticFieldSim";
import CurrentChangeSim from "@/components/lessons/inductors/CurrentChangeSim";
import RLCircuitSim from "@/components/lessons/inductors/RLCircuitSim";
import EngineeringSection from "@/components/lessons/inductors/EngineeringSection";
import CommonMistakes from "@/components/lessons/inductors/CommonMistakes";
import KeyTakeaways from "@/components/lessons/inductors/KeyTakeaways";
import Quiz from "@/components/lessons/inductors/Quiz";
import BottomCTA from "@/components/lessons/inductors/BottomCTA";
import InductorsComplete from "@/components/lessons/inductors/InductorsComplete";

type MilestoneKey = "lessonRead"|"chargingUsed"|"dischargeUsed"|"magneticUsed"|"currentChangeUsed"|"rlCircuitUsed"|"quizPassed"|"lessonFinished";
interface Milestones { lessonRead:boolean; chargingUsed:boolean; dischargeUsed:boolean; magneticUsed:boolean; currentChangeUsed:boolean; rlCircuitUsed:boolean; quizPassed:boolean; lessonFinished:boolean; }
const XP_VALUES:Record<MilestoneKey,number> = { lessonRead:10, chargingUsed:20, dischargeUsed:20, magneticUsed:15, currentChangeUsed:15, rlCircuitUsed:20, quizPassed:50, lessonFinished:50 };
// Total: 200 XP

export default function InductorsPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({ lessonRead:false, chargingUsed:false, dischargeUsed:false, magneticUsed:false, currentChangeUsed:false, rlCircuitUsed:false, quizPassed:false, lessonFinished:false });
  const [showXpPopup, setShowXpPopup] = useState<{amount:number;id:number}|null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const readRef = useRef<HTMLDivElement>(null);
  const popupCounter = useRef(0);

  useEffect(() => {
    window.history.pushState(null,"");
    const handler=(e:PopStateEvent)=>{ e.stopImmediatePropagation(); window.history.pushState(null,""); window.location.replace("/electronics/pullup-pulldown"); };
    window.addEventListener("popstate",handler,true); return ()=>window.removeEventListener("popstate",handler,true);
  },[]);
  useEffect(() => {
    const el=readRef.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting) earnXP(10,"lessonRead"); },{threshold:0.5});
    obs.observe(el); return ()=>obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  const earnXP = useCallback((amount:number,key:MilestoneKey) => {
    setMilestones(prev=>{
      if(prev[key]) return prev;
      const next={...prev,[key]:true};
      setXp(x=>x+amount); popupCounter.current+=1; setShowXpPopup({amount,id:popupCounter.current}); setTimeout(()=>setShowXpPopup(null),1800);
      const readyKeys:MilestoneKey[]=["lessonRead","chargingUsed","dischargeUsed","magneticUsed","currentChangeUsed","rlCircuitUsed","quizPassed"];
      const allDone=readyKeys.every(k=>k===key?true:prev[k]);
      if(allDone&&!prev.lessonFinished&&key!=="lessonFinished"){ setTimeout(()=>{ setMilestones(m=>{ if(m.lessonFinished) return m; setXp(x=>x+XP_VALUES.lessonFinished); setShowComplete(true); return {...m,lessonFinished:true}; }); },600); }
      return next;
    });
  },[]);

  return (
    <div className="min-h-screen" style={{background:"var(--background)"}}>
      <InductorsNav xp={xp} milestones={milestones} onMenuClick={()=>setSidebarOpen(true)}/>
      <AnimatePresence>
        {sidebarOpen&&(<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 bg-black/60" onClick={()=>setSidebarOpen(false)}/><motion.aside initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:260}} className="fixed top-0 right-0 h-full w-72 z-50 border-l border-white/8 overflow-y-auto" style={{background:"rgba(18,18,27,0.98)",backdropFilter:"blur(16px)"}}><div className="p-4 flex justify-between items-center border-b border-white/5"><span className="text-sm font-bold text-white/70">Course Progress</span><button onClick={()=>setSidebarOpen(false)} className="text-white/30 hover:text-white/60 text-lg">✕</button></div><LearningPath milestones={milestones}/></motion.aside></>)}
      </AnimatePresence>
      <AnimatePresence>
        {showXpPopup&&(<motion.div key={showXpPopup.id} initial={{opacity:0,y:20,scale:0.85}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-16,scale:0.9}} transition={{duration:0.35}} className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-primary/30 shadow-xl" style={{background:"rgba(16,185,129,0.12)",backdropFilter:"blur(12px)"}}><svg width="14" height="14" viewBox="0 0 12 12" fill="#10B981"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg><span className="text-sm font-black text-primary">+{showXpPopup.amount} XP</span></motion.div>)}
      </AnimatePresence>
      <main className="pt-14 max-w-5xl mx-auto">
        <LessonHeader/>
        <BigIdea/>
        <WhatIsInductor/>
        <MagneticFieldExplorer/>
        <ChargingSim onChargingUsed={()=>earnXP(20,"chargingUsed")}/>
        <DischargeSim onDischargeUsed={()=>earnXP(20,"dischargeUsed")}/>
        <MagneticFieldSim onMagneticUsed={()=>earnXP(15,"magneticUsed")}/>
        <CurrentChangeSim onCurrentChangeUsed={()=>earnXP(15,"currentChangeUsed")}/>
        <RLCircuitSim onRLCircuitUsed={()=>earnXP(20,"rlCircuitUsed")}/>
        <EngineeringSection/>
        <CommonMistakes/>
        <div ref={readRef}><KeyTakeaways/></div>
        <Quiz onPass={()=>earnXP(50,"quizPassed")}/>
        <BottomCTA/>
      </main>
      <AnimatePresence>{showComplete&&<InductorsComplete xp={xp} onClose={()=>setShowComplete(false)}/>}</AnimatePresence>
    </div>
  );
}
