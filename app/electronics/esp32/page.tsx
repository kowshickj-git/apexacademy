"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ESP32Nav from "@/components/lessons/esp32/ESP32Nav";
import LearningPath from "@/components/lessons/esp32/LearningPath";
import WhatIsESP32 from "@/components/lessons/esp32/WhatIsESP32";
import ESP32Architecture from "@/components/lessons/esp32/ESP32Architecture";
import WiFiSim from "@/components/lessons/esp32/WiFiSim";
import BLESim from "@/components/lessons/esp32/BLESim";
import GPIOSim from "@/components/lessons/esp32/GPIOSim";
import PWMSim from "@/components/lessons/esp32/PWMSim";
import DeepSleepSim from "@/components/lessons/esp32/DeepSleepSim";
import MQTTSim from "@/components/lessons/esp32/MQTTSim";
import EngineeringInsights from "@/components/lessons/esp32/EngineeringInsights";
import CommonMistakes from "@/components/lessons/esp32/CommonMistakes";
import KeyTakeaways from "@/components/lessons/esp32/KeyTakeaways";
import Quiz from "@/components/lessons/esp32/Quiz";
import ESP32Complete from "@/components/lessons/esp32/ESP32Complete";
import BottomCTA from "@/components/lessons/esp32/BottomCTA";

interface Milestones {
  lessonRead: boolean;
  wifiScanUsed: boolean;
  bleScanUsed: boolean;
  gpioUsed: boolean;
  pwmUsed: boolean;
  deepSleepUsed: boolean;
  mqttUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function ESP32Page() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    wifiScanUsed: false,
    bleScanUsed: false,
    gpioUsed: false,
    pwmUsed: false,
    deepSleepUsed: false,
    mqttUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [showComplete, setShowComplete] = useState(false);

  const earnXP = useCallback((amount: number, key: keyof Milestones) => {
    setMilestones(prev => {
      if (prev[key]) return prev;
      setXp(x => x + amount);
      const next = { ...prev, [key]: true };
      const keys: (keyof Milestones)[] = ["lessonRead", "wifiScanUsed", "bleScanUsed", "gpioUsed", "pwmUsed", "deepSleepUsed", "mqttUsed", "quizPassed"];
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
      <ESP32Nav xp={xp} />
      <div className="flex">
        <aside
          className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto"
          style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <LearningPath milestones={milestones} />
        </aside>
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-8 space-y-12">
          <WhatIsESP32 onRead={() => earnXP(20, "lessonRead")} />
          <ESP32Architecture />
          <WiFiSim onUse={() => earnXP(25, "wifiScanUsed")} />
          <BLESim onUse={() => earnXP(25, "bleScanUsed")} />
          <GPIOSim onUse={() => earnXP(20, "gpioUsed")} />
          <PWMSim onUse={() => earnXP(20, "pwmUsed")} />
          <DeepSleepSim onUse={() => earnXP(25, "deepSleepUsed")} />
          <MQTTSim onUse={() => earnXP(25, "mqttUsed")} />
          <EngineeringInsights />
          <CommonMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(50, "quizPassed")} />
          <BottomCTA />
        </main>
      </div>
      <AnimatePresence>
        {showComplete && <ESP32Complete xp={xp} onClose={() => setShowComplete(false)} />}
      </AnimatePresence>
    </div>
  );
}
