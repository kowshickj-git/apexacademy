"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SensorsNav from "@/components/lessons/sensors/SensorsNav";
import LearningPath from "@/components/lessons/sensors/LearningPath";
import WhatIsSensor from "@/components/lessons/sensors/WhatIsSensor";
import SensorTypes from "@/components/lessons/sensors/SensorTypes";
import SensorSpecs from "@/components/lessons/sensors/SensorSpecs";
import UltrasonicSim from "@/components/lessons/sensors/UltrasonicSim";
import TempSim from "@/components/lessons/sensors/TempSim";
import LDRSim from "@/components/lessons/sensors/LDRSim";
import MotionSim from "@/components/lessons/sensors/MotionSim";
import RobotDashboard from "@/components/lessons/sensors/RobotDashboard";
import EngineeringInsights from "@/components/lessons/sensors/EngineeringInsights";
import CommonMistakes from "@/components/lessons/sensors/CommonMistakes";
import KeyTakeaways from "@/components/lessons/sensors/KeyTakeaways";
import Quiz from "@/components/lessons/sensors/Quiz";
import SensorsComplete from "@/components/lessons/sensors/SensorsComplete";
import BottomCTA from "@/components/lessons/sensors/BottomCTA";

interface Milestones {
  lessonRead: boolean;
  ultrasonicUsed: boolean;
  tempUsed: boolean;
  ldrUsed: boolean;
  motionUsed: boolean;
  dashboardUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function SensorsPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    ultrasonicUsed: false,
    tempUsed: false,
    ldrUsed: false,
    motionUsed: false,
    dashboardUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [showComplete, setShowComplete] = useState(false);

  const earnXP = useCallback((amount: number, key: keyof Milestones) => {
    setMilestones(prev => {
      if (prev[key]) return prev;
      setXp(x => x + amount);
      const next = { ...prev, [key]: true };
      const keys: (keyof Milestones)[] = ["lessonRead", "ultrasonicUsed", "tempUsed", "ldrUsed", "motionUsed", "dashboardUsed", "quizPassed"];
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
      <SensorsNav xp={xp} />
      <div className="flex">
        <aside
          className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto"
          style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <LearningPath milestones={milestones} />
        </aside>
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-8 space-y-12">
          <WhatIsSensor onRead={() => earnXP(20, "lessonRead")} />
          <SensorTypes />
          <SensorSpecs />
          <UltrasonicSim onUsed={() => earnXP(25, "ultrasonicUsed")} />
          <TempSim onUsed={() => earnXP(25, "tempUsed")} />
          <LDRSim onUsed={() => earnXP(25, "ldrUsed")} />
          <MotionSim onUsed={() => earnXP(25, "motionUsed")} />
          <RobotDashboard onUsed={() => earnXP(20, "dashboardUsed")} />
          <EngineeringInsights />
          <CommonMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(50, "quizPassed")} />
          <BottomCTA />
        </main>
      </div>
      <AnimatePresence>
        {showComplete && <SensorsComplete xp={xp} onClose={() => setShowComplete(false)} />}
      </AnimatePresence>
    </div>
  );
}
