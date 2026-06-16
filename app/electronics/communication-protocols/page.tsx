"use client";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CommsNav from "@/components/lessons/communication-protocols/CommsNav";
import LearningPath from "@/components/lessons/communication-protocols/LearningPath";
import WhatIsComms from "@/components/lessons/communication-protocols/WhatIsComms";
import SerialVsParallel from "@/components/lessons/communication-protocols/SerialVsParallel";
import ProtocolComparison from "@/components/lessons/communication-protocols/ProtocolComparison";
import SerialSim from "@/components/lessons/communication-protocols/SerialSim";
import SyncAsyncSim from "@/components/lessons/communication-protocols/SyncAsyncSim";
import DuplexSim from "@/components/lessons/communication-protocols/DuplexSim";
import ProtocolChooser from "@/components/lessons/communication-protocols/ProtocolChooser";
import WiringComparison from "@/components/lessons/communication-protocols/WiringComparison";
import EngineeringInsights from "@/components/lessons/communication-protocols/EngineeringInsights";
import CommonMistakes from "@/components/lessons/communication-protocols/CommonMistakes";
import KeyTakeaways from "@/components/lessons/communication-protocols/KeyTakeaways";
import Quiz from "@/components/lessons/communication-protocols/Quiz";
import CommsComplete from "@/components/lessons/communication-protocols/CommsComplete";
import BottomCTA from "@/components/lessons/communication-protocols/BottomCTA";

interface Milestones {
  lessonRead: boolean; serialSimUsed: boolean; syncAsyncUsed: boolean;
  duplexUsed: boolean; chooserUsed: boolean; wiringUsed: boolean;
  quizPassed: boolean; lessonFinished: boolean;
}

export default function CommsPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({ lessonRead:false, serialSimUsed:false, syncAsyncUsed:false, duplexUsed:false, chooserUsed:false, wiringUsed:false, quizPassed:false, lessonFinished:false });
  const [showComplete, setShowComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const earnXP = useCallback((amount: number, key: keyof Milestones) => {
    setMilestones(prev => {
      if (prev[key]) return prev;
      setXp(x => x + amount);
      const next = { ...prev, [key]: true };
      const keys: (keyof Milestones)[] = ["lessonRead","serialSimUsed","syncAsyncUsed","duplexUsed","chooserUsed","wiringUsed","quizPassed"];
      if (keys.every(k => next[k]) && !prev.lessonFinished) {
        setTimeout(() => { setMilestones(m=>({...m,lessonFinished:true})); setShowComplete(true); }, 600);
      }
      return next;
    });
  }, []);

  return (
    <div style={{background:"#050507",minHeight:"100vh"}}>
      <CommsNav xp={xp} onMenuClick={() => setSidebarOpen(true)} />
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:260}} className="fixed top-0 right-0 h-full w-72 z-50 border-l border-white/[0.08] overflow-y-auto" style={{background:"rgba(18,18,27,0.98)",backdropFilter:"blur(16px)"}}>
              <div className="p-4 flex justify-between items-center border-b border-white/5">
                <span className="text-sm font-bold text-white/70">Course Progress</span>
                <button onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white/60 text-lg leading-none">✕</button>
              </div>
              <LearningPath milestones={milestones} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex">
        <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto" style={{background:"rgba(255,255,255,0.02)",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
          <LearningPath milestones={milestones}/>
        </aside>
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-8 space-y-12">
          <WhatIsComms onRead={()=>earnXP(20,"lessonRead")}/>
          <SerialVsParallel/>
          <ProtocolComparison/>
          <SerialSim onUsed={()=>earnXP(25,"serialSimUsed")}/>
          <SyncAsyncSim onUsed={()=>earnXP(20,"syncAsyncUsed")}/>
          <DuplexSim onUsed={()=>earnXP(20,"duplexUsed")}/>
          <ProtocolChooser onUsed={()=>earnXP(25,"chooserUsed")}/>
          <WiringComparison onUsed={()=>earnXP(15,"wiringUsed")}/>
          <EngineeringInsights/>
          <CommonMistakes/>
          <KeyTakeaways/>
          <Quiz onPass={()=>earnXP(50,"quizPassed")}/>
          <BottomCTA/>
        </main>
      </div>
      <AnimatePresence>
        {showComplete && <CommsComplete xp={xp} onClose={()=>setShowComplete(false)}/>}
      </AnimatePresence>
    </div>
  );
}
