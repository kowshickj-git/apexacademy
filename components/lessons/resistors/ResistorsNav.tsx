"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Milestones {
  lessonRead: boolean;
  visualsViewed: boolean;
  simsUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

interface Props { xp: number; milestones: Milestones; }

export default function ResistorsNav({ xp, milestones }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const milestoneList = [milestones.lessonRead, milestones.visualsViewed, milestones.simsUsed, milestones.quizPassed];
  const completedCount = milestoneList.filter(Boolean).length;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: "rgba(5,5,7,0.9)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-5xl mx-auto px-3 h-14 flex items-center gap-2">
        <Link href="/index.html" className="flex items-center gap-2 shrink-0">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
            <polygon points="13,2 24,22 2,22" fill="#10B981" />
            <polygon points="13,8 20,20 6,20" fill="#050507" />
            <polygon points="13,11 17,18 9,18" fill="#10B981" opacity="0.45" />
          </svg>
          <span className="text-xs font-bold text-white/80 hidden sm:block tracking-wide">APEX Academy</span>
        </Link>

        <span className="text-white/10 hidden sm:block">|</span>

        <div className="hidden md:flex items-center gap-1.5 text-xs">
          <span className="text-white/25">Electronics</span>
          <span className="text-white/15">/</span>
          <span className="text-secondary font-medium">Resistors</span>
        </div>

        <span className="text-[10px] text-white/20 font-mono hidden lg:block">L04 of 10</span>

        <div className="flex-1" />

        {/* Milestone pips */}
        <div className="hidden sm:flex items-center gap-1" title={`${completedCount}/4 milestones`}>
          {["Read", "Visual", "Sim", "Quiz"].map((label, i) => (
            <div
              key={label}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
              style={{ background: milestoneList[i] ? "#10B981" : "rgba(255,255,255,0.1)" }}
              title={label}
            />
          ))}
        </div>

        {/* XP badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
          style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.22)" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="#10B981">
            <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
          </svg>
          <span className="text-xs font-bold text-primary tabular-nums">{xp} XP</span>
        </div>

        {/* Prev */}
        <Link
          href="/electronics/resistance"
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Resistance</span>
        </Link>

        {/* Next - coming soon */}
        <div
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border cursor-not-allowed select-none"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.22)" }}
          title="Lesson 5: Ohm's Law — Coming Soon"
        >
          <span className="hidden sm:inline">Ohm's Law</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="h-[2px] bg-white/4">
        <motion.div
          className="h-full origin-left"
          style={{ scaleX: scrollProgress / 100, background: "linear-gradient(to right, #0EA5E9, #10B981)" }}
        />
      </div>
    </header>
  );
}
