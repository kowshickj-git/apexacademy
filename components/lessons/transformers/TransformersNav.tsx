"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Milestones {
  lessonRead: boolean;
  stepUpUsed: boolean;
  stepDownUsed: boolean;
  turnsRatioUsed: boolean;
  voltageConversionUsed: boolean;
  powerTransmissionUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

interface Props {
  xp: number;
  milestones: Milestones;
  onMenuClick: () => void;
}

export default function TransformersNav({ xp, milestones, onMenuClick }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pipData = [
    { label: "Read", done: milestones.lessonRead },
    { label: "StepUp", done: milestones.stepUpUsed },
    { label: "StepDown", done: milestones.stepDownUsed },
    { label: "TurnsRatio", done: milestones.turnsRatioUsed },
    { label: "VoltConv", done: milestones.voltageConversionUsed },
    { label: "PowerTrans", done: milestones.powerTransmissionUsed },
    { label: "Quiz", done: milestones.quizPassed },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: "rgba(5,5,7,0.9)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-5xl mx-auto px-3 h-14 flex items-center gap-2">
        {/* Logo */}
        <Link href="/index.html" className="flex items-center gap-2 shrink-0">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
            <polygon points="13,2 24,22 2,22" fill="#10B981" />
            <polygon points="13,8 20,20 6,20" fill="#050507" />
            <polygon points="13,11 17,18 9,18" fill="#10B981" opacity="0.45" />
          </svg>
          <span className="text-xs font-bold text-white/80 hidden sm:block tracking-wide">APEX Academy</span>
        </Link>

        <span className="text-white/10 hidden sm:block">|</span>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1.5 text-xs">
          <span className="text-white/25">Electronics</span>
          <span className="text-white/15">/</span>
          <span className="font-medium" style={{ color: "#8B5CF6" }}>Transformers</span>
        </div>

        <span className="text-[10px] text-white/20 font-mono hidden lg:block">L16 of 36</span>

        <div className="flex-1" />

        {/* Milestone pips */}
        <div className="hidden sm:flex items-center gap-1" title={`${pipData.filter(p => p.done).length}/7 milestones`}>
          {pipData.map((pip) => (
            <div
              key={pip.label}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
              style={{ background: pip.done ? "#8B5CF6" : "rgba(255,255,255,0.1)" }}
              title={pip.label}
            />
          ))}
        </div>

        {/* XP badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
          style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.22)" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="#8B5CF6">
            <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
          </svg>
          <span className="text-xs font-bold tabular-nums" style={{ color: "#8B5CF6" }}>{xp} XP</span>
        </div>

        {/* Prev: Inductors */}
        <Link
          href="/electronics/inductors"
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Inductors</span>
        </Link>

        {/* Next: BJT */}
        <Link
          href="/electronics/bjt"
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-all"
          style={{ background: "rgba(139,92,246,0.09)", borderColor: "rgba(139,92,246,0.22)", color: "#8B5CF6" }}
        >
          <span className="hidden sm:inline">BJT</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Hamburger */}
        <button onClick={onMenuClick} className="ml-1 text-white/30 hover:text-white/60 transition-colors p-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Scroll progress bar */}
      <div className="h-[2px] bg-white/4">
        <motion.div
          className="h-full origin-left"
          style={{ scaleX: scrollProgress / 100, background: "linear-gradient(to right, #8B5CF6, #7C3AED)" }}
        />
      </div>
    </header>
  );
}
