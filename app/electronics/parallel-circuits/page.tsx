"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParallelNav from "@/components/lessons/parallel-circuits/ParallelNav";
import LearningPath from "@/components/lessons/parallel-circuits/LearningPath";
import LessonHeader from "@/components/lessons/parallel-circuits/LessonHeader";
import BigIdea from "@/components/lessons/parallel-circuits/BigIdea";
import WhatIsParallel from "@/components/lessons/parallel-circuits/WhatIsParallel";
import CircuitBuilder from "@/components/lessons/parallel-circuits/CircuitBuilder";
import CurrentSplitSim from "@/components/lessons/parallel-circuits/CurrentSplitSim";
import OpenBranchSim from "@/components/lessons/parallel-circuits/OpenBranchSim";
import ResistanceSim from "@/components/lessons/parallel-circuits/ResistanceSim";
import SeriesVsParallel from "@/components/lessons/parallel-circuits/SeriesVsParallel";
import CommonMistakes from "@/components/lessons/parallel-circuits/CommonMistakes";
import EngineeringInsights from "@/components/lessons/parallel-circuits/EngineeringInsights";
import KeyTakeaways from "@/components/lessons/parallel-circuits/KeyTakeaways";
import Quiz from "@/components/lessons/parallel-circuits/Quiz";
import BottomCTA from "@/components/lessons/parallel-circuits/BottomCTA";
import ParallelComplete from "@/components/lessons/parallel-circuits/ParallelComplete";

type MilestoneKey =
  | "lessonRead"
  | "builderUsed"
  | "currentSplitUsed"
  | "openBranchUsed"
  | "resistanceSimUsed"
  | "quizPassed"
  | "lessonFinished";

interface Milestones {
  lessonRead: boolean;
  builderUsed: boolean;
  currentSplitUsed: boolean;
  openBranchUsed: boolean;
  resistanceSimUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

const XP_VALUES: Record<MilestoneKey, number> = {
  lessonRead: 10,
  builderUsed: 25,
  currentSplitUsed: 25,
  openBranchUsed: 20,
  resistanceSimUsed: 20,
  quizPassed: 50,
  lessonFinished: 50,
};

export default function ParallelCircuitsPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Milestones>({
    lessonRead: false,
    builderUsed: false,
    currentSplitUsed: false,
    openBranchUsed: false,
    resistanceSimUsed: false,
    quizPassed: false,
    lessonFinished: false,
  });
  const [showXpPopup, setShowXpPopup] = useState<{ amount: number; id: number } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const readRef = useRef<HTMLDivElement>(null);
  const popupCounter = useRef(0);

  useEffect(() => {
    window.history.pushState(null, "");
    const handler = (e: PopStateEvent) => {
      e.stopImmediatePropagation();
      window.history.pushState(null, "");
      window.location.replace("/electronics/series-circuits");
    };
    window.addEventListener("popstate", handler, true);
    return () => window.removeEventListener("popstate", handler, true);
  }, []);

  useEffect(() => {
    const el = readRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) earnXP(10, "lessonRead");
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const earnXP = useCallback((amount: number, key: MilestoneKey) => {
    setMilestones((prev) => {
      if (prev[key]) return prev;
      const next = { ...prev, [key]: true };
      setXp((x) => x + amount);
      popupCounter.current += 1;
      setShowXpPopup({ amount, id: popupCounter.current });
      setTimeout(() => setShowXpPopup(null), 1800);
      const readyKeys: MilestoneKey[] = [
        "lessonRead",
        "builderUsed",
        "currentSplitUsed",
        "openBranchUsed",
        "resistanceSimUsed",
        "quizPassed",
      ];
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

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <ParallelNav xp={xp} milestones={milestones} onMenuClick={() => setSidebarOpen(true)} />

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-72 z-50 border-l border-white/8 overflow-y-auto"
              style={{ background: "rgba(18,18,27,0.98)", backdropFilter: "blur(16px)" }}
            >
              <div className="p-4 flex justify-between items-center border-b border-white/5">
                <span className="text-sm font-bold text-white/70">Course Progress</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/30 hover:text-white/60 text-lg"
                >
                  ✕
                </button>
              </div>
              <LearningPath milestones={milestones} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXpPopup && (
          <motion.div
            key={showXpPopup.id}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-xl"
            style={{
              background: "rgba(99,102,241,0.12)",
              borderColor: "rgba(99,102,241,0.3)",
              backdropFilter: "blur(12px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="#6366F1">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            <span className="text-sm font-black" style={{ color: "#6366F1" }}>
              +{showXpPopup.amount} XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-14 max-w-5xl mx-auto">
        <LessonHeader />
        <BigIdea />
        <WhatIsParallel />
        <CircuitBuilder onBuilderUsed={() => earnXP(25, "builderUsed")} />
        <CurrentSplitSim onCurrentSplitUsed={() => earnXP(25, "currentSplitUsed")} />
        <OpenBranchSim onOpenBranchUsed={() => earnXP(20, "openBranchUsed")} />
        <ResistanceSim onResistanceSimUsed={() => earnXP(20, "resistanceSimUsed")} />
        <SeriesVsParallel />
        <CommonMistakes />
        <EngineeringInsights />
        <div ref={readRef}>
          <KeyTakeaways />
        </div>
        <Quiz onPass={() => earnXP(50, "quizPassed")} />
        <BottomCTA />
      </main>

      <AnimatePresence>
        {showComplete && (
          <ParallelComplete xp={xp} onClose={() => setShowComplete(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
