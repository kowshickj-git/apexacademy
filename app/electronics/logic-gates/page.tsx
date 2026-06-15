"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogicNav from "@/components/lessons/logic-gates/LogicNav";
import LearningPath from "@/components/lessons/logic-gates/LearningPath";
import LessonHeader from "@/components/lessons/logic-gates/LessonHeader";
import BigIdea from "@/components/lessons/logic-gates/BigIdea";
import WhatIsLogic from "@/components/lessons/logic-gates/WhatIsLogic";
import ANDGateSim from "@/components/lessons/logic-gates/ANDGateSim";
import ORGateSim from "@/components/lessons/logic-gates/ORGateSim";
import NOTGateSim from "@/components/lessons/logic-gates/NOTGateSim";
import ComboGateExplorer from "@/components/lessons/logic-gates/ComboGateExplorer";
import TruthTableBuilder from "@/components/lessons/logic-gates/TruthTableBuilder";
import EngineeringInsights from "@/components/lessons/logic-gates/EngineeringInsights";
import CommonMistakes from "@/components/lessons/logic-gates/CommonMistakes";
import KeyTakeaways from "@/components/lessons/logic-gates/KeyTakeaways";
import Quiz from "@/components/lessons/logic-gates/Quiz";
import BottomCTA from "@/components/lessons/logic-gates/BottomCTA";
import LogicComplete from "@/components/lessons/logic-gates/LogicComplete";

type MilestoneKey = "lessonRead"|"andGateUsed"|"orGateUsed"|"notGateUsed"|"combinedUsed"|"truthTableUsed"|"quizPassed"|"lessonFinished";
interface Milestones { lessonRead:boolean; andGateUsed:boolean; orGateUsed:boolean; notGateUsed:boolean; combinedUsed:boolean; truthTableUsed:boolean; quizPassed:boolean; lessonFinished:boolean; }
const XP_VALUES:Record<MilestoneKey,number> = { lessonRead:10, andGateUsed:20, orGateUsed:15, notGateUsed:15, combinedUsed:20, truthTableUsed:20, quizPassed:50, lessonFinished:50 };

export default function LogicGatesPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({ lessonRead:false, andGateUsed:false, orGateUsed:false, notGateUsed:false, combinedUsed:false, truthTableUsed:false, quizPassed:false, lessonFinished:false });
  const [showXpPopup, setShowXpPopup] = useState<{amount:number;id:number}|null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const readRef = useRef<HTMLDivElement>(null);
  const popupCounter = useRef(0);

  useEffect(() => {
    window.history.pushState(null,"");
    const h=(e:PopStateEvent)=>{ e.stopImmediatePropagation(); window.history.pushState(null,""); window.location.replace("/electronics/mosfet"); };
    window.addEventListener("popstate",h,true); return ()=>window.removeEventListener("popstate",h,true);
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
      const readyKeys:MilestoneKey[]=["lessonRead","andGateUsed","orGateUsed","notGateUsed","combinedUsed","truthTableUsed","quizPassed"];
      const allDone=readyKeys.every(k=>k===key?true:prev[k]);
      if(allDone&&!prev.lessonFinished&&key!=="lessonFinished"){
        setTimeout(()=>{ setMilestones(m=>{ if(m.lessonFinished) return m; setXp(x=>x+XP_VALUES.lessonFinished); setShowComplete(true); return {...m,lessonFinished:true}; }); },600);
      }
      return next;
    });
  },[]);

  return (
    <div className="min-h-screen" style={{background:"var(--background)"}}>
      <LogicNav xp={xp} milestones={milestones} onMenuClick={()=>setSidebarOpen(true)}/>
      <AnimatePresence>{sidebarOpen&&(<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 bg-black/60" onClick={()=>setSidebarOpen(false)}/><motion.aside initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:260}} className="fixed top-0 right-0 h-full w-72 z-50 border-l border-white/8 overflow-y-auto" style={{background:"rgba(18,18,27,0.98)",backdropFilter:"blur(16px)"}}><div className="p-4 flex justify-between items-center border-b border-white/5"><span className="text-sm font-bold text-white/70">Course Progress</span><button onClick={()=>setSidebarOpen(false)} className="text-white/30 hover:text-white/60 text-lg">✕</button></div><LearningPath milestones={milestones}/></motion.aside></>)}</AnimatePresence>
      <AnimatePresence>{showXpPopup&&(<motion.div key={showXpPopup.id} initial={{opacity:0,y:20,scale:0.85}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-16,scale:0.9}} transition={{duration:0.35}} className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-xl" style={{borderColor:"rgba(132,204,22,0.3)",background:"rgba(132,204,22,0.12)",backdropFilter:"blur(12px)"}}><svg width="14" height="14" viewBox="0 0 12 12" fill="#84CC16"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg><span className="text-sm font-black" style={{color:"#84CC16"}}>+{showXpPopup.amount} XP</span></motion.div>)}</AnimatePresence>
      <main className="pt-14 max-w-5xl mx-auto">
        <LessonHeader/><BigIdea/><WhatIsLogic/>
        <ANDGateSim onAndGateUsed={()=>earnXP(20,"andGateUsed")}/>
        <ORGateSim onOrGateUsed={()=>earnXP(15,"orGateUsed")}/>
        <NOTGateSim onNotGateUsed={()=>earnXP(15,"notGateUsed")}/>
        <ComboGateExplorer onCombinedUsed={()=>earnXP(20,"combinedUsed")}/>
        <TruthTableBuilder onTruthTableUsed={()=>earnXP(20,"truthTableUsed")}/>
        <EngineeringInsights/><CommonMistakes/>
        <div ref={readRef}><KeyTakeaways/></div>
        <Quiz onPass={()=>earnXP(50,"quizPassed")}/>
        <BottomCTA/>
      </main>
      <AnimatePresence>{showComplete&&<LogicComplete xp={xp} onClose={()=>setShowComplete(false)}/>}</AnimatePresence>
    </div>
  );
}
