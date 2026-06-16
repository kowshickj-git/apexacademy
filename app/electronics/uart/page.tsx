"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import UARTNav from "@/components/lessons/uart/UARTNav";
import LearningPath from "@/components/lessons/uart/LearningPath";
import WhatIsUART from "@/components/lessons/uart/WhatIsUART";
import UARTFrame from "@/components/lessons/uart/UARTFrame";
import BaudRates from "@/components/lessons/uart/BaudRates";
import MessageSender from "@/components/lessons/uart/MessageSender";
import BaudRateSim from "@/components/lessons/uart/BaudRateSim";
import TXRXSim from "@/components/lessons/uart/TXRXSim";
import SerialMonitor from "@/components/lessons/uart/SerialMonitor";
import UARTDebugger from "@/components/lessons/uart/UARTDebugger";
import EngineeringInsights from "@/components/lessons/uart/EngineeringInsights";
import CommonMistakes from "@/components/lessons/uart/CommonMistakes";
import KeyTakeaways from "@/components/lessons/uart/KeyTakeaways";
import Quiz from "@/components/lessons/uart/Quiz";
import UARTComplete from "@/components/lessons/uart/UARTComplete";
import BottomCTA from "@/components/lessons/uart/BottomCTA";

interface Milestones {
  lessonRead: boolean; senderUsed: boolean; baudUsed: boolean;
  txrxUsed: boolean; monitorUsed: boolean; debuggerUsed: boolean;
  quizPassed: boolean; lessonFinished: boolean;
}

export default function UARTPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false, senderUsed: false, baudUsed: false,
    txrxUsed: false, monitorUsed: false, debuggerUsed: false,
    quizPassed: false, lessonFinished: false
  });
  const [showComplete, setShowComplete] = useState(false);

  const earnXP = useCallback((amount: number, key: keyof Milestones) => {
    setMilestones(prev => {
      if (prev[key]) return prev;
      setXp(x => x + amount);
      const next = { ...prev, [key]: true };
      const keys: (keyof Milestones)[] = ["lessonRead", "senderUsed", "baudUsed", "txrxUsed", "monitorUsed", "debuggerUsed", "quizPassed"];
      if (keys.every(k => next[k]) && !prev.lessonFinished) {
        setTimeout(() => { setMilestones(m => ({ ...m, lessonFinished: true })); setShowComplete(true); }, 600);
      }
      return next;
    });
  }, []);

  return (
    <div style={{ background: "#050507", minHeight: "100vh" }}>
      <UARTNav xp={xp} />
      <div className="flex">
        <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto" style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <LearningPath milestones={milestones} />
        </aside>
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-8 space-y-12">
          <WhatIsUART onRead={() => earnXP(20, "lessonRead")} />
          <UARTFrame />
          <BaudRates />
          <MessageSender onUsed={() => earnXP(25, "senderUsed")} />
          <BaudRateSim onUsed={() => earnXP(20, "baudUsed")} />
          <TXRXSim onUsed={() => earnXP(20, "txrxUsed")} />
          <SerialMonitor onUsed={() => earnXP(25, "monitorUsed")} />
          <UARTDebugger onUsed={() => earnXP(20, "debuggerUsed")} />
          <EngineeringInsights />
          <CommonMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(50, "quizPassed")} />
          <BottomCTA />
        </main>
      </div>
      <AnimatePresence>
        {showComplete && <UARTComplete xp={xp} onClose={() => setShowComplete(false)} />}
      </AnimatePresence>
    </div>
  );
}
