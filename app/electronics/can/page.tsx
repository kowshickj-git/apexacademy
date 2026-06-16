"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import CANNav from "@/components/lessons/can/CANNav";
import LearningPath from "@/components/lessons/can/LearningPath";
import WhatIsCAN from "@/components/lessons/can/WhatIsCAN";
import CANBusViz from "@/components/lessons/can/CANBusViz";
import CANFrameAnim from "@/components/lessons/can/CANFrameAnim";
import CANMessageSim from "@/components/lessons/can/CANMessageSim";
import CANNodeSim from "@/components/lessons/can/CANNodeSim";
import ArbitrationSim from "@/components/lessons/can/ArbitrationSim";
import ErrorDetectionSim from "@/components/lessons/can/ErrorDetectionSim";
import EVNetworkSim from "@/components/lessons/can/EVNetworkSim";
import EngineeringInsights from "@/components/lessons/can/EngineeringInsights";
import CommonMistakes from "@/components/lessons/can/CommonMistakes";
import KeyTakeaways from "@/components/lessons/can/KeyTakeaways";
import Quiz from "@/components/lessons/can/Quiz";
import CANComplete from "@/components/lessons/can/CANComplete";
import BottomCTA from "@/components/lessons/can/BottomCTA";

interface Milestones {
  lessonRead: boolean;
  messageSent: boolean;
  nodeSimUsed: boolean;
  arbitrationUsed: boolean;
  errorUsed: boolean;
  evUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function CANPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    messageSent: false,
    nodeSimUsed: false,
    arbitrationUsed: false,
    errorUsed: false,
    evUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [showComplete, setShowComplete] = useState(false);

  const earnXP = useCallback((amount: number, key: keyof Milestones) => {
    setMilestones((prev) => {
      if (prev[key]) return prev;
      setXp((x) => x + amount);
      const next = { ...prev, [key]: true };
      const keys: (keyof Milestones)[] = [
        "lessonRead",
        "messageSent",
        "nodeSimUsed",
        "arbitrationUsed",
        "errorUsed",
        "evUsed",
        "quizPassed",
      ];
      if (keys.every((k) => next[k]) && !prev.lessonFinished) {
        setTimeout(() => {
          setMilestones((m) => ({ ...m, lessonFinished: true }));
          setShowComplete(true);
        }, 600);
      }
      return next;
    });
  }, []);

  return (
    <div style={{ background: "#050507", minHeight: "100vh" }}>
      <CANNav xp={xp} />
      <div className="flex">
        <aside
          className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <LearningPath milestones={milestones} />
        </aside>
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-8 space-y-12">
          <WhatIsCAN onRead={() => earnXP(20, "lessonRead")} />
          <CANBusViz />
          <CANFrameAnim />
          <CANMessageSim onUsed={() => earnXP(25, "messageSent")} />
          <CANNodeSim onUsed={() => earnXP(20, "nodeSimUsed")} />
          <ArbitrationSim onUsed={() => earnXP(25, "arbitrationUsed")} />
          <ErrorDetectionSim onUsed={() => earnXP(20, "errorUsed")} />
          <EVNetworkSim onUsed={() => earnXP(25, "evUsed")} />
          <EngineeringInsights />
          <CommonMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(50, "quizPassed")} />
          <BottomCTA />
        </main>
      </div>
      <AnimatePresence>
        {showComplete && (
          <CANComplete xp={xp} onClose={() => setShowComplete(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
