"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ResistorsNav from "@/components/lessons/resistors/ResistorsNav";
import LearningPath from "@/components/lessons/resistors/LearningPath";
import LessonHeader from "@/components/lessons/resistors/LessonHeader";
import WhatIsResistor from "@/components/lessons/resistors/WhatIsResistor";
import ResistanceVsResistor from "@/components/lessons/resistors/ResistanceVsResistor";
import WhyResistorInvented from "@/components/lessons/resistors/WhyResistorInvented";
import ResistorHistory from "@/components/lessons/resistors/ResistorHistory";
import ResistorGallery from "@/components/lessons/resistors/ResistorGallery";
import HowResistorWorks from "@/components/lessons/resistors/HowResistorWorks";
import ResistorValues from "@/components/lessons/resistors/ResistorValues";
import ColorCodes from "@/components/lessons/resistors/ColorCodes";
import ResistorUsages from "@/components/lessons/resistors/ResistorUsages";
import TypesOfResistors from "@/components/lessons/resistors/TypesOfResistors";
import LEDDemo from "@/components/lessons/resistors/LEDDemo";
import FunFacts from "@/components/lessons/resistors/FunFacts";
import BeginnerMistakes from "@/components/lessons/resistors/BeginnerMistakes";
import KeyTakeaways from "@/components/lessons/resistors/KeyTakeaways";
import Quiz from "@/components/lessons/resistors/Quiz";
import SummaryCard from "@/components/lessons/resistors/SummaryCard";
import ResistorsComplete from "@/components/lessons/resistors/ResistorsComplete";
import BottomCTA from "@/components/lessons/resistors/BottomCTA";

type MilestoneKey = "lessonRead" | "visualsViewed" | "simsUsed" | "quizPassed" | "lessonFinished";

interface Milestones {
  lessonRead: boolean;
  visualsViewed: boolean;
  simsUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function ResistorsPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    visualsViewed: false,
    simsUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [xpPopup, setXpPopup] = useState<{ amount: number; id: number } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const readTriggerRef = useRef<HTMLDivElement>(null);

  const showXPPopup = useCallback((amount: number) => {
    setXpPopup({ amount, id: Date.now() });
    setTimeout(() => setXpPopup(null), 2200);
  }, []);

  const earnXP = useCallback(
    (amount: number, key: MilestoneKey) => {
      setMilestones((prev) => {
        if (prev[key]) return prev;
        setXp((x) => x + amount);
        showXPPopup(amount);
        return { ...prev, [key]: true };
      });
    },
    [showXPPopup]
  );

  const onVisualView = useCallback(() => earnXP(10, "visualsViewed"), [earnXP]);
  const onSimUsed = useCallback(() => earnXP(20, "simsUsed"), [earnXP]);

  useEffect(() => {
    const el = readTriggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) earnXP(10, "lessonRead"); },
      { threshold: 0.8 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [earnXP]);

  useEffect(() => {
    if (
      milestones.lessonRead &&
      milestones.visualsViewed &&
      milestones.simsUsed &&
      milestones.quizPassed &&
      !milestones.lessonFinished
    ) {
      setMilestones((prev) => ({ ...prev, lessonFinished: true }));
      setXp((x) => x + 50);
      setTimeout(() => setShowComplete(true), 600);
    }
  }, [milestones]);

  useEffect(() => {
    window.history.pushState(null, "");
    const onPop = (e: PopStateEvent) => {
      e.stopImmediatePropagation();
      window.location.replace("/electronics/resistance");
    };
    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, { capture: true });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ResistorsNav xp={xp} milestones={milestones} />

      <AnimatePresence>
        {xpPopup && (
          <motion.div
            key={xpPopup.id}
            initial={{ opacity: 0, y: -8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.22 }}
            className="fixed top-16 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-sm text-background"
            style={{ background: "#10B981", boxShadow: "0 0 20px rgba(16,185,129,0.55)" }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            +{xpPopup.amount} XP
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex pt-14">
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-r border-white/5">
            <LearningPath />
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-24">
          <LessonHeader />
          <WhatIsResistor onVisualView={onVisualView} />
          <div ref={readTriggerRef} className="h-px" />
          <ResistanceVsResistor />
          <WhyResistorInvented onVisualView={onVisualView} />
          <ResistorHistory />
          <ResistorGallery onVisualView={onVisualView} />
          <HowResistorWorks onVisualView={onVisualView} />
          <ResistorValues />
          <ColorCodes onSimUsed={onSimUsed} />
          <ResistorUsages />
          <TypesOfResistors onVisualView={onVisualView} />
          <LEDDemo onSimUsed={onSimUsed} />
          <FunFacts />
          <BeginnerMistakes />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(30, "quizPassed")} />
          <SummaryCard />
          <BottomCTA />
        </main>
      </div>

      <AnimatePresence>
        {showComplete && <ResistorsComplete xp={xp} onClose={() => setShowComplete(false)} />}
      </AnimatePresence>
    </div>
  );
}
