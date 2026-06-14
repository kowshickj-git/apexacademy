"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LessonNav from "@/components/lessons/voltage/LessonNav";
import VoltageLearningPath from "@/components/lessons/voltage/VoltageLearningPath";
import LessonHeader from "@/components/lessons/voltage/LessonHeader";
import WhatIsVoltage from "@/components/lessons/voltage/WhatIsVoltage";
import WaterAnalogy from "@/components/lessons/voltage/WaterAnalogy";
import InteractiveDemo from "@/components/lessons/voltage/InteractiveDemo";
import CommonVoltages from "@/components/lessons/voltage/CommonVoltages";
import KeyPoints from "@/components/lessons/voltage/KeyPoints";
import Quiz from "@/components/lessons/voltage/Quiz";
import Summary from "@/components/lessons/voltage/Summary";
import VoltageComplete from "@/components/lessons/voltage/VoltageComplete";

type MilestoneKey = "lessonRead" | "simsUsed" | "quizPassed" | "lessonFinished";

interface Milestones {
  lessonRead: boolean;
  simsUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function VoltagePage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    simsUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [_simsCount, setSimsCount] = useState(0);
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

  // Intercept browser back gesture → go to home
  useEffect(() => {
    window.history.pushState(null, '');
    const onPop = () => { window.location.replace('/index.html'); };
    window.addEventListener('popstate', onPop, { capture: true });
    return () => window.removeEventListener('popstate', onPop, { capture: true });
  }, []);

  // Award lesson-read XP on scroll
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

  // Trigger completion overlay
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
      <LessonNav xp={xp} milestones={milestones} />

      {/* XP popup */}
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
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-r border-white/5">
            <VoltageLearningPath />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 pb-24">
          <LessonHeader />
          <WhatIsVoltage />
          <div ref={readTriggerRef} className="h-px" />
          <WaterAnalogy onSimUsed={onSimUsed} />
          <InteractiveDemo onSimUsed={onSimUsed} />
          <CommonVoltages />
          <KeyPoints />
          <Quiz onPass={() => earnXP(30, "quizPassed")} />
          <Summary />
        </main>
      </div>

      <AnimatePresence>
        {showComplete && (
          <VoltageComplete xp={xp} onClose={() => setShowComplete(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
