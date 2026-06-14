"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CurrentNav from "@/components/lessons/current/CurrentNav";
import LearningPath from "@/components/lessons/current/LearningPath";
import LessonHeader from "@/components/lessons/current/LessonHeader";
import WhatIsCurrent from "@/components/lessons/current/WhatIsCurrent";
import AntRoad from "@/components/lessons/current/AntRoad";
import WaterPipe from "@/components/lessons/current/WaterPipe";
import ElectronFlow from "@/components/lessons/current/ElectronFlow";
import HistoryTimeline from "@/components/lessons/current/HistoryTimeline";
import CurrentUsages from "@/components/lessons/current/CurrentUsages";
import HowCurrentWorks from "@/components/lessons/current/HowCurrentWorks";
import CurrentSimulator from "@/components/lessons/current/CurrentSimulator";
import FunFacts from "@/components/lessons/current/FunFacts";
import KeyTakeaways from "@/components/lessons/current/KeyTakeaways";
import Quiz from "@/components/lessons/current/Quiz";
import SummaryCard from "@/components/lessons/current/SummaryCard";
import LessonComplete from "@/components/lessons/current/LessonComplete";
import BottomCTA from "@/components/lessons/current/BottomCTA";

type MilestoneKey = "lessonRead" | "simsUsed" | "quizPassed" | "lessonFinished";

interface Milestones {
  lessonRead: boolean;
  simsUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function CurrentPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    simsUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [simsCount, setSimsCount] = useState(0);
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

  const onSimUsed = useCallback(() => {
    setSimsCount((prev) => {
      const next = prev + 1;
      if (next === 2) {
        setMilestones((m) => {
          if (m.simsUsed) return m;
          setXp((x) => x + 20);
          showXPPopup(20);
          return { ...m, simsUsed: true };
        });
      }
      return next;
    });
  }, [showXPPopup]);

  // Intercept browser back gesture → go to voltage
  useEffect(() => {
    window.history.pushState(null, '');
    const onPop = (e: PopStateEvent) => {
      e.stopImmediatePropagation();
      window.location.replace('/lessons/voltage');
    };
    window.addEventListener('popstate', onPop, { capture: true });
    return () => window.removeEventListener('popstate', onPop, { capture: true });
  }, []);

  // Award lesson read XP when user scrolls to mid-page
  useEffect(() => {
    const el = readTriggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) earnXP(10, "lessonRead");
      },
      { threshold: 0.8 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [earnXP]);

  // Trigger lesson completion overlay
  useEffect(() => {
    if (
      milestones.lessonRead &&
      milestones.simsUsed &&
      milestones.quizPassed &&
      !milestones.lessonFinished
    ) {
      setMilestones((prev) => ({ ...prev, lessonFinished: true }));
      setXp((x) => x + 50);
      setTimeout(() => setShowComplete(true), 600);
    }
  }, [milestones]);

  return (
    <div className="min-h-screen bg-background">
      <CurrentNav xp={xp} milestones={milestones} />

      {/* Floating XP popup */}
      <AnimatePresence>
        {xpPopup && (
          <motion.div
            key={xpPopup.id}
            initial={{ opacity: 0, y: -8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.22 }}
            className="fixed top-16 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-sm text-background"
            style={{
              background: "#10B981",
              boxShadow: "0 0 20px rgba(16,185,129,0.55)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            +{xpPopup.amount} XP
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex pt-14">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-r border-white/5">
            <LearningPath />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 pb-24">
          <LessonHeader />
          <WhatIsCurrent />
          <div ref={readTriggerRef} className="h-px" />
          <AntRoad onSimUsed={onSimUsed} />
          <WaterPipe onSimUsed={onSimUsed} />
          <ElectronFlow onSimUsed={onSimUsed} />
          <HistoryTimeline />
          <CurrentUsages />
          <HowCurrentWorks />
          <CurrentSimulator onSimUsed={onSimUsed} />
          <FunFacts />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(30, "quizPassed")} />
          <SummaryCard />
          <BottomCTA />
        </main>
      </div>

      <AnimatePresence>
        {showComplete && (
          <LessonComplete xp={xp} onClose={() => setShowComplete(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
