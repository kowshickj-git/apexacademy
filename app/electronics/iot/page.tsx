"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import IoTNav from "@/components/lessons/iot/IoTNav";
import LearningPath from "@/components/lessons/iot/LearningPath";
import WhatIsIoT from "@/components/lessons/iot/WhatIsIoT";
import IoTArchitecture from "@/components/lessons/iot/IoTArchitecture";
import SmartHomeDashboard from "@/components/lessons/iot/SmartHomeDashboard";
import SensorToCloud from "@/components/lessons/iot/SensorToCloud";
import IoTNetworkBuilder from "@/components/lessons/iot/IoTNetworkBuilder";
import SmartFarmSim from "@/components/lessons/iot/SmartFarmSim";
import IndustrialIoTSim from "@/components/lessons/iot/IndustrialIoTSim";
import EngineeringInsights from "@/components/lessons/iot/EngineeringInsights";
import CommonMistakes from "@/components/lessons/iot/CommonMistakes";
import KeyTakeaways from "@/components/lessons/iot/KeyTakeaways";
import Quiz from "@/components/lessons/iot/Quiz";
import IoTComplete from "@/components/lessons/iot/IoTComplete";
import BottomCTA from "@/components/lessons/iot/BottomCTA";

interface Milestones {
  lessonRead: boolean;
  dashboardUsed: boolean;
  cloudUsed: boolean;
  networkUsed: boolean;
  farmUsed: boolean;
  industrialUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function IoTPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    dashboardUsed: false,
    cloudUsed: false,
    networkUsed: false,
    farmUsed: false,
    industrialUsed: false,
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
        "lessonRead",
        "dashboardUsed",
        "cloudUsed",
        "networkUsed",
        "farmUsed",
        "industrialUsed",
        "quizPassed",
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
      <IoTNav xp={xp} />
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
          <WhatIsIoT onRead={() => earnXP(20, "lessonRead")} />
          <IoTArchitecture />
          <SmartHomeDashboard onUsed={() => earnXP(25, "dashboardUsed")} />
          <SensorToCloud onUsed={() => earnXP(20, "cloudUsed")} />
          <IoTNetworkBuilder onUsed={() => earnXP(25, "networkUsed")} />
          <SmartFarmSim onUsed={() => earnXP(20, "farmUsed")} />
          <IndustrialIoTSim onUsed={() => earnXP(25, "industrialUsed")} />
          <EngineeringInsights />
          <CommonMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(50, "quizPassed")} />
          <BottomCTA />
        </main>
      </div>
      <AnimatePresence>
        {showComplete && (
          <IoTComplete xp={xp} onClose={() => setShowComplete(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
