"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import STM32Nav from "@/components/lessons/stm32/STM32Nav";
import LearningPath from "@/components/lessons/stm32/LearningPath";
import WhatIsSTM32 from "@/components/lessons/stm32/WhatIsSTM32";
import STM32Architecture from "@/components/lessons/stm32/STM32Architecture";
import ClockSim from "@/components/lessons/stm32/ClockSim";
import GPIOSim from "@/components/lessons/stm32/GPIOSim";
import TimerSim from "@/components/lessons/stm32/TimerSim";
import ADCSim from "@/components/lessons/stm32/ADCSim";
import UARTSim from "@/components/lessons/stm32/UARTSim";
import EngineeringInsights from "@/components/lessons/stm32/EngineeringInsights";
import CommonMistakes from "@/components/lessons/stm32/CommonMistakes";
import KeyTakeaways from "@/components/lessons/stm32/KeyTakeaways";
import Quiz from "@/components/lessons/stm32/Quiz";
import STM32Complete from "@/components/lessons/stm32/STM32Complete";
import BottomCTA from "@/components/lessons/stm32/BottomCTA";

interface Milestones {
  lessonRead: boolean;
  clockUsed: boolean;
  gpioUsed: boolean;
  timerUsed: boolean;
  adcUsed: boolean;
  uartUsed: boolean;
  spiI2cUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function STM32Page() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    clockUsed: false,
    gpioUsed: false,
    timerUsed: false,
    adcUsed: false,
    uartUsed: false,
    spiI2cUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [showComplete, setShowComplete] = useState(false);

  const earnXP = useCallback((amount: number, key: keyof Milestones) => {
    setMilestones(prev => {
      if (prev[key]) return prev;
      setXp(x => x + amount);
      const next = { ...prev, [key]: true };
      const keys: (keyof Milestones)[] = ["lessonRead", "clockUsed", "gpioUsed", "timerUsed", "adcUsed", "uartUsed", "spiI2cUsed", "quizPassed"];
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
      <STM32Nav xp={xp} />
      <div className="flex">
        <aside
          className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto"
          style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <LearningPath milestones={milestones} />
        </aside>
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-8 space-y-12">
          <WhatIsSTM32 onRead={() => earnXP(20, "lessonRead")} />
          <STM32Architecture />
          <ClockSim onUse={() => earnXP(25, "clockUsed")} />
          <GPIOSim onUse={() => earnXP(20, "gpioUsed")} />
          <TimerSim onUse={() => earnXP(25, "timerUsed")} />
          <ADCSim onUse={() => earnXP(20, "adcUsed")} />
          <UARTSim onUse={() => { earnXP(20, "uartUsed"); earnXP(20, "spiI2cUsed"); }} />
          <EngineeringInsights />
          <CommonMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(50, "quizPassed")} />
          <BottomCTA />
        </main>
      </div>
      <AnimatePresence>
        {showComplete && <STM32Complete xp={xp} onClose={() => setShowComplete(false)} />}
      </AnimatePresence>
    </div>
  );
}
