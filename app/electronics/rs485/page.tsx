"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import RS485Nav from "@/components/lessons/rs485/RS485Nav";
import LearningPath from "@/components/lessons/rs485/LearningPath";
import WhatIsRS485 from "@/components/lessons/rs485/WhatIsRS485";
import DifferentialSignaling from "@/components/lessons/rs485/DifferentialSignaling";
import NetworkBuilder from "@/components/lessons/rs485/NetworkBuilder";
import NoiseImmunitySim from "@/components/lessons/rs485/NoiseImmunitySim";
import DifferentialSim from "@/components/lessons/rs485/DifferentialSim";
import IndustrialNetworkSim from "@/components/lessons/rs485/IndustrialNetworkSim";
import ModbusSim from "@/components/lessons/rs485/ModbusSim";
import EngineeringInsights from "@/components/lessons/rs485/EngineeringInsights";
import CommonMistakes from "@/components/lessons/rs485/CommonMistakes";
import KeyTakeaways from "@/components/lessons/rs485/KeyTakeaways";
import Quiz from "@/components/lessons/rs485/Quiz";
import RS485Complete from "@/components/lessons/rs485/RS485Complete";
import BottomCTA from "@/components/lessons/rs485/BottomCTA";

interface Milestones {
  lessonRead: boolean;
  networkBuilt: boolean;
  noiseUsed: boolean;
  diffUsed: boolean;
  industrialUsed: boolean;
  modbusUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function RS485Page() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    networkBuilt: false,
    noiseUsed: false,
    diffUsed: false,
    industrialUsed: false,
    modbusUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [showComplete, setShowComplete] = useState(false);

  const earnXP = useCallback((amount: number, key: keyof Milestones) => {
    setMilestones(prev => {
      if (prev[key]) return prev;
      setXp(x => x + amount);
      const next = { ...prev, [key]: true };
      const keys: (keyof Milestones)[] = [
        "lessonRead", "networkBuilt", "noiseUsed", "diffUsed",
        "industrialUsed", "modbusUsed", "quizPassed",
      ];
      if (keys.every(k => next[k]) && !prev.lessonFinished) {
        setTimeout(() => {
          setMilestones(m => ({ ...m, lessonFinished: true }));
          setShowComplete(true);
        }, 600);
      }
      return next;
    });
  }, []);

  return (
    <div style={{ background: "#050507", minHeight: "100vh" }}>
      <RS485Nav xp={xp} />
      <div className="flex">
        <aside
          className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto"
          style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <LearningPath milestones={milestones} />
        </aside>
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-8 space-y-12">
          <WhatIsRS485 onRead={() => earnXP(20, "lessonRead")} />
          <DifferentialSignaling />
          <NetworkBuilder onUsed={() => earnXP(25, "networkBuilt")} />
          <NoiseImmunitySim onUsed={() => earnXP(20, "noiseUsed")} />
          <DifferentialSim onUsed={() => earnXP(25, "diffUsed")} />
          <IndustrialNetworkSim onUsed={() => earnXP(20, "industrialUsed")} />
          <ModbusSim onUsed={() => earnXP(25, "modbusUsed")} />
          <EngineeringInsights />
          <CommonMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(50, "quizPassed")} />
          <BottomCTA />
        </main>
      </div>
      <AnimatePresence>
        {showComplete && <RS485Complete xp={xp} onClose={() => setShowComplete(false)} />}
      </AnimatePresence>
    </div>
  );
}
