"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OhmsLawNav from "@/components/lessons/ohms-law/OhmsLawNav";
import LearningPath from "@/components/lessons/ohms-law/LearningPath";
import LessonHeader from "@/components/lessons/ohms-law/LessonHeader";
import RecapSection from "@/components/lessons/ohms-law/RecapSection";
import BigQuestion from "@/components/lessons/ohms-law/BigQuestion";
import WaterTankAnalogy from "@/components/lessons/ohms-law/WaterTankAnalogy";
import OhmHistory from "@/components/lessons/ohms-law/OhmHistory";
import GeorgOhm from "@/components/lessons/ohms-law/GeorgOhm";
import IntroFormula from "@/components/lessons/ohms-law/IntroFormula";
import FormulaBreakdown from "@/components/lessons/ohms-law/FormulaBreakdown";
import OhmsTriangle from "@/components/lessons/ohms-law/OhmsTriangle";
import OhmsSimulator from "@/components/lessons/ohms-law/OhmsSimulator";
import RealWorldExamples from "@/components/lessons/ohms-law/RealWorldExamples";
import GuidedExamples from "@/components/lessons/ohms-law/GuidedExamples";
import PracticeMode from "@/components/lessons/ohms-law/PracticeMode";
import InteractiveChallenge from "@/components/lessons/ohms-law/InteractiveChallenge";
import CommonMistakes from "@/components/lessons/ohms-law/CommonMistakes";
import UnitsExplained from "@/components/lessons/ohms-law/UnitsExplained";
import FunFacts from "@/components/lessons/ohms-law/FunFacts";
import EngineeringInsight from "@/components/lessons/ohms-law/EngineeringInsight";
import KeyTakeaways from "@/components/lessons/ohms-law/KeyTakeaways";
import Quiz from "@/components/lessons/ohms-law/Quiz";
import SummaryCard from "@/components/lessons/ohms-law/SummaryCard";
import OhmsLawComplete from "@/components/lessons/ohms-law/OhmsLawComplete";
import BottomCTA from "@/components/lessons/ohms-law/BottomCTA";

type MilestoneKey = "lessonRead" | "simUsed" | "practiceUsed" | "quizPassed" | "lessonFinished";

interface Milestones {
  lessonRead: boolean;
  simUsed: boolean;
  practiceUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

export default function OhmsLawPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    simUsed: false,
    practiceUsed: false,
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

  const onSimUsed = useCallback(() => earnXP(20, "simUsed"), [earnXP]);
  const onPracticeUsed = useCallback(() => earnXP(20, "practiceUsed"), [earnXP]);

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
      milestones.simUsed &&
      milestones.practiceUsed &&
      milestones.quizPassed &&
      !milestones.lessonFinished
    ) {
      setMilestones((prev) => ({ ...prev, lessonFinished: true }));
      setXp((x) => x + 75);
      setTimeout(() => setShowComplete(true), 600);
    }
  }, [milestones]);

  useEffect(() => {
    window.history.pushState(null, "");
    const onPop = (e: PopStateEvent) => {
      e.stopImmediatePropagation();
      window.location.replace("/electronics/resistors");
    };
    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, { capture: true });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <OhmsLawNav xp={xp} milestones={milestones} />

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
          <RecapSection />
          <div ref={readTriggerRef} className="h-px" />
          <BigQuestion />
          <WaterTankAnalogy onSimUsed={onSimUsed} />
          <OhmHistory />
          <GeorgOhm />
          <IntroFormula />
          <FormulaBreakdown />
          <OhmsTriangle onSimUsed={onSimUsed} />
          <OhmsSimulator onSimUsed={onSimUsed} />
          <RealWorldExamples />
          <GuidedExamples />
          <PracticeMode onPracticeUsed={onPracticeUsed} />
          <InteractiveChallenge onSimUsed={onSimUsed} />
          <CommonMistakes />
          <UnitsExplained />
          <FunFacts />
          <EngineeringInsight />
          <KeyTakeaways />
          <Quiz onPass={() => earnXP(40, "quizPassed")} />
          <SummaryCard />
          <BottomCTA />
        </main>
      </div>

      <AnimatePresence>
        {showComplete && <OhmsLawComplete xp={xp} onClose={() => setShowComplete(false)} />}
      </AnimatePresence>
    </div>
  );
}
