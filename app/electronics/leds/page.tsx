"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LEDsNav from "@/components/lessons/leds/LEDsNav";
import LearningPath from "@/components/lessons/leds/LearningPath";
import LessonHeader from "@/components/lessons/leds/LessonHeader";
import WhatIsLED from "@/components/lessons/leds/WhatIsLED";
import LEDvsDiode from "@/components/lessons/leds/LEDvsDiode";
import ElectronToLight from "@/components/lessons/leds/ElectronToLight";
import PolarityGuide from "@/components/lessons/leds/PolarityGuide";
import PolaritySimulator from "@/components/lessons/leds/PolaritySimulator";
import ForwardReverseBias from "@/components/lessons/leds/ForwardReverseBias";
import LEDStructure from "@/components/lessons/leds/LEDStructure";
import WhyNeedResistor from "@/components/lessons/leds/WhyNeedResistor";
import ResistorSimulator from "@/components/lessons/leds/ResistorSimulator";
import BurnoutSimulator from "@/components/lessons/leds/BurnoutSimulator";
import LEDColors from "@/components/lessons/leds/LEDColors";
import RGBMixer from "@/components/lessons/leds/RGBMixer";
import LEDHistory from "@/components/lessons/leds/LEDHistory";
import Applications from "@/components/lessons/leds/Applications";
import CommonMistakes from "@/components/lessons/leds/CommonMistakes";
import EngineeringInsights from "@/components/lessons/leds/EngineeringInsights";
import Quiz from "@/components/lessons/leds/Quiz";
import SummaryCard from "@/components/lessons/leds/SummaryCard";
import LEDsComplete from "@/components/lessons/leds/LEDsComplete";
import BottomCTA from "@/components/lessons/leds/BottomCTA";

type MilestoneKey = "lessonRead" | "polarityUsed" | "resistorUsed" | "rgbUsed" | "quizPassed" | "lessonFinished";

interface Milestones {
  lessonRead: boolean;
  polarityUsed: boolean;
  resistorUsed: boolean;
  rgbUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

const XP_VALUES: Record<MilestoneKey, number> = {
  lessonRead: 10,
  polarityUsed: 15,
  resistorUsed: 15,
  rgbUsed: 15,
  quizPassed: 50,
  lessonFinished: 75,
};

export default function LEDsPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    polarityUsed: false,
    resistorUsed: false,
    rgbUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [showXpPopup, setShowXpPopup] = useState<{ amount: number; id: number } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const readRef = useRef<HTMLDivElement>(null);
  const popupCounter = useRef(0);

  // Swipe-back fix
  useEffect(() => {
    window.history.pushState(null, "");
    const onPop = (e: PopStateEvent) => {
      e.stopImmediatePropagation();
      window.location.replace("/electronics/diodes");
    };
    window.addEventListener("popstate", onPop, true);
    return () => window.removeEventListener("popstate", onPop, true);
  }, []);

  // lessonRead trigger
  useEffect(() => {
    const el = readRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) earnXP(10, "lessonRead"); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const earnXP = useCallback((amount: number, key: MilestoneKey) => {
    setMilestones((prev) => {
      if (prev[key]) return prev;
      const next = { ...prev, [key]: true };
      setXp((x) => x + amount);
      popupCounter.current += 1;
      setShowXpPopup({ amount, id: popupCounter.current });
      setTimeout(() => setShowXpPopup(null), 1800);

      // Check completion
      const readyKeys: MilestoneKey[] = ["lessonRead", "polarityUsed", "resistorUsed", "rgbUsed", "quizPassed"];
      const allDone = readyKeys.every((k) => (k === key ? true : prev[k]));
      if (allDone && !prev.lessonFinished && key !== "lessonFinished") {
        setTimeout(() => {
          setMilestones((m) => {
            if (m.lessonFinished) return m;
            setXp((x) => x + XP_VALUES.lessonFinished);
            setShowComplete(true);
            return { ...m, lessonFinished: true };
          });
        }, 600);
      }
      return next;
    });
  }, []);

  const canComplete = milestones.lessonRead && milestones.polarityUsed && milestones.resistorUsed && milestones.rgbUsed && milestones.quizPassed;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <LEDsNav xp={xp} milestones={milestones} onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-72 z-50 border-l border-white/8 overflow-y-auto"
              style={{ background: "rgba(18,18,27,0.98)", backdropFilter: "blur(16px)" }}
            >
              <div className="p-4 flex justify-between items-center border-b border-white/5">
                <span className="text-sm font-bold text-white/70">Course Progress</span>
                <button onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white/60 text-lg">✕</button>
              </div>
              <LearningPath milestones={milestones} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* XP Popup */}
      <AnimatePresence>
        {showXpPopup && (
          <motion.div
            key={showXpPopup.id}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-primary/30 shadow-xl"
            style={{ background: "rgba(16,185,129,0.12)", backdropFilter: "blur(12px)" }}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="#10B981">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            <span className="text-sm font-black text-primary">+{showXpPopup.amount} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-14 max-w-5xl mx-auto">
        <LessonHeader />

        <div ref={readRef}>
          <WhatIsLED />
          <LEDvsDiode />
        </div>

        <ElectronToLight />
        <PolarityGuide />
        <PolaritySimulator onPolarityUsed={() => earnXP(15, "polarityUsed")} />
        <ForwardReverseBias />
        <LEDStructure />
        <WhyNeedResistor />
        <ResistorSimulator onResistorUsed={() => earnXP(15, "resistorUsed")} />
        <BurnoutSimulator onResistorUsed={() => earnXP(15, "resistorUsed")} />
        <LEDColors />
        <RGBMixer onRgbUsed={() => earnXP(15, "rgbUsed")} />
        <LEDHistory />
        <Applications />
        <CommonMistakes />
        <EngineeringInsights />

        <Quiz onPass={() => earnXP(50, "quizPassed")} />
        <SummaryCard />

        {/* Manual complete button */}
        {canComplete && !milestones.lessonFinished && (
          <div className="px-4 sm:px-8 py-6 text-center">
            <button
              onClick={() => {
                earnXP(XP_VALUES.lessonFinished, "lessonFinished");
                setShowComplete(true);
              }}
              className="px-8 py-3 rounded-2xl font-bold text-sm bg-primary text-background hover:opacity-90 transition-opacity"
            >
              Complete Lesson →
            </button>
          </div>
        )}

        <BottomCTA />
      </main>

      {/* Completion overlay */}
      <AnimatePresence>
        {showComplete && (
          <LEDsComplete xp={xp} onClose={() => setShowComplete(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
