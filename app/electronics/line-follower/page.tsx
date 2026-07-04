"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LFNav from "@/components/lessons/line-follower/LFNav";
import Hero from "@/components/lessons/line-follower/Hero";
import WhatIsLF from "@/components/lessons/line-follower/WhatIsLF";
import HowItWorks from "@/components/lessons/line-follower/HowItWorks";
import ComponentExplorer from "@/components/lessons/line-follower/ComponentExplorer";
import BuildLab from "@/components/lessons/line-follower/BuildLab";
import WiringLab from "@/components/lessons/line-follower/WiringLab";
import CircuitSim from "@/components/lessons/line-follower/CircuitSim";
import CodeLab from "@/components/lessons/line-follower/CodeLab";
import AlgorithmViz from "@/components/lessons/line-follower/AlgorithmViz";
import SimArena, { SimResult } from "@/components/lessons/line-follower/SimArena";
import Troubleshoot from "@/components/lessons/line-follower/Troubleshoot";
import OptimizeLab from "@/components/lessons/line-follower/OptimizeLab";
import AdvancedMode from "@/components/lessons/line-follower/AdvancedMode";
import ChallengeMode, { LabFlags } from "@/components/lessons/line-follower/ChallengeMode";
import KnowledgeHub from "@/components/lessons/line-follower/KnowledgeHub";
import RealBuild from "@/components/lessons/line-follower/RealBuild";
import Certificate from "@/components/lessons/line-follower/Certificate";
import Portfolio from "@/components/lessons/line-follower/Portfolio";
import { SimParams, DEFAULT_PARAMS } from "@/components/lessons/line-follower/simParams";

type MilestoneKey =
  | "read" | "explored" | "built" | "wired" | "circuitUsed"
  | "coded" | "simFinished" | "diagnosed" | "tuned" | "advanced";

const XP_VALUES: Record<MilestoneKey, number> = {
  read: 10, explored: 15, built: 30, wired: 30, circuitUsed: 15,
  coded: 20, simFinished: 35, diagnosed: 10, tuned: 15, advanced: 20,
};

const MILESTONE_COUNT = Object.keys(XP_VALUES).length;

export default function LineFollowerPage() {
  const [xp, setXp] = useState(0);
  const [milestones, setMilestones] = useState<Record<MilestoneKey, boolean>>({
    read: false, explored: false, built: false, wired: false, circuitUsed: false,
    coded: false, simFinished: false, diagnosed: false, tuned: false, advanced: false,
  });
  const [popup, setPopup] = useState<{ amount: number; id: number } | null>(null);
  const [params, setParams] = useState<SimParams>(DEFAULT_PARAMS);
  const [bestSim, setBestSim] = useState<SimResult | null>(null);
  const [challenge, setChallenge] = useState({ pts: 0, badges: 0 });
  const popupCounter = useRef(0);

  // hydrate saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem("apex-lf-progress");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.xp) setXp(s.xp);
        if (s.milestones) setMilestones((m) => ({ ...m, ...s.milestones }));
        if (s.bestSim) setBestSim(s.bestSim);
      }
    } catch { /* fresh start */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("apex-lf-progress", JSON.stringify({ xp, milestones, bestSim }));
    } catch { /* storage unavailable */ }
  }, [xp, milestones, bestSim]);

  const earnXP = useCallback((key: MilestoneKey) => {
    setMilestones((prev) => {
      if (prev[key]) return prev;
      const amount = XP_VALUES[key];
      setXp((x) => x + amount);
      popupCounter.current += 1;
      setPopup({ amount, id: popupCounter.current });
      setTimeout(() => setPopup(null), 1800);
      return { ...prev, [key]: true };
    });
  }, []);

  const onSimResult = useCallback((r: SimResult) => {
    setBestSim((prev) => (!prev || r.accuracy > prev.accuracy ? r : prev));
    earnXP("simFinished");
  }, [earnXP]);

  const onChallengeScore = useCallback((pts: number, badges: number) => {
    setChallenge((c) => (c.pts === pts && c.badges === badges ? c : { pts, badges }));
  }, []);

  const flags: LabFlags = {
    built: milestones.built,
    wired: milestones.wired,
    coded: milestones.coded,
    simFinished: milestones.simFinished,
    tuned: milestones.tuned,
  };

  const doneCount = Object.values(milestones).filter(Boolean).length;
  const progress = Math.round((doneCount / MILESTONE_COUNT) * 100);

  const scores = {
    skill: Math.min(100, Math.round((challenge.pts / 285) * 100)),
    sim: bestSim ? bestSim.accuracy : 0,
    project: progress,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <LFNav xp={xp} progress={progress} />

      {/* XP popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-24 right-4 z-[70] flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-xl"
            style={{ background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.35)", backdropFilter: "blur(12px)" }}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="#F59E0B">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            <span className="text-sm font-black" style={{ color: "#F59E0B" }}>+{popup.amount} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero />
        <WhatIsLF onRead={() => earnXP("read")} />
        <HowItWorks />
        <ComponentExplorer onExplored={() => earnXP("explored")} />
        <BuildLab onBuilt={() => earnXP("built")} />
        <WiringLab onWired={() => earnXP("wired")} />
        <CircuitSim onUsed={() => earnXP("circuitUsed")} />
        <CodeLab onCoded={() => earnXP("coded")} />
        <AlgorithmViz />
        <SimArena params={params} onResult={onSimResult} />
        <Troubleshoot onDiagnosed={() => earnXP("diagnosed")} />
        <OptimizeLab params={params} setParams={setParams} onTuned={() => earnXP("tuned")} />
        <AdvancedMode onExplored={() => earnXP("advanced")} />
        <ChallengeMode flags={flags} onScore={onChallengeScore} />
        <KnowledgeHub />
        <RealBuild />
        <Certificate scores={scores} unlocked={milestones.built && milestones.wired && milestones.simFinished} />
        <Portfolio flags={flags} scores={scores} xp={xp} />

        {/* footer */}
        <footer className="px-4 py-14 text-center border-t border-white/5 mt-8">
          <p className="text-white/25 text-xs mb-3">
            🤖 You just completed an entire engineering program in one page.
          </p>
          <p className="text-white/15 text-[10px]">
            APEX Academy · Interactive STEM Laboratory · Build real things.
          </p>
        </footer>
      </main>
    </div>
  );
}
