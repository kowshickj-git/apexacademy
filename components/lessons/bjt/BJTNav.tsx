"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Milestones {
  lessonRead: boolean;
  switchUsed: boolean;
  amplifierUsed: boolean;
  baseCurrentUsed: boolean;
  ledDriverUsed: boolean;
  motorDriverUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

interface BJTNavProps {
  xp: number;
  milestones: Milestones;
  onMenuClick: () => void;
}

const PIPS = [
  { key: "lessonRead", label: "Read" },
  { key: "switchUsed", label: "Switch" },
  { key: "amplifierUsed", label: "Amplifier" },
  { key: "baseCurrentUsed", label: "BaseCurrent" },
  { key: "ledDriverUsed", label: "LEDDriver" },
  { key: "motorDriverUsed", label: "MotorDriver" },
  { key: "quizPassed", label: "Quiz" },
] as const;

export default function BJTNav({ xp, milestones, onMenuClick }: BJTNavProps) {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-3"
      style={{
        background: "rgba(5,5,7,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon points="14,3 25,22 3,22" fill="#EF4444" opacity="0.9" />
          <polygon points="14,8 22,21 6,21" fill="#050507" />
          <polygon points="14,11 19,20 9,20" fill="#EF4444" opacity="0.5" />
        </svg>
      </Link>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs min-w-0">
        <span style={{ color: "rgba(240,240,245,0.35)" }}>Electronics</span>
        <span style={{ color: "rgba(240,240,245,0.2)" }}>/</span>
        <span className="font-semibold truncate" style={{ color: "#EF4444" }}>
          BJT Fundamentals
        </span>
      </div>

      {/* L17 of 36 */}
      <span
        className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: "rgba(239,68,68,0.1)",
          color: "rgba(239,68,68,0.7)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        L17 of 36
      </span>

      <div className="flex-1" />

      {/* Milestone pips */}
      <div className="hidden md:flex items-center gap-1.5">
        {PIPS.map((pip) => {
          const done = milestones[pip.key];
          return (
            <div
              key={pip.key}
              title={pip.label}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: done ? "#10B981" : "rgba(255,255,255,0.1)",
                boxShadow: done ? "0 0 6px rgba(16,185,129,0.6)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* XP Badge */}
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black flex-shrink-0"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.22)",
          boxShadow: "0 0 12px rgba(239,68,68,0.12)",
          color: "#EF4444",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="#EF4444">
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
        {xp} XP
      </div>

      {/* Prev */}
      <Link
        href="/electronics/transformers"
        className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
        style={{
          color: "rgba(240,240,245,0.45)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        ← Transformers
      </Link>

      {/* Next */}
      <Link
        href="/electronics/mosfet"
        className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
        style={{
          color: "#EF4444",
          border: "1px solid rgba(239,68,68,0.3)",
          background: "rgba(239,68,68,0.08)",
        }}
      >
        MOSFET →
      </Link>

      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="flex flex-col gap-1 p-2 rounded-lg transition-colors hover:bg-white/5"
        aria-label="Open menu"
      >
        <span className="block w-4 h-0.5 bg-white/50 rounded" />
        <span className="block w-4 h-0.5 bg-white/50 rounded" />
        <span className="block w-3 h-0.5 bg-white/50 rounded self-end" />
      </button>

      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-100"
        style={{
          width: `${scrollPct}%`,
          background: "linear-gradient(90deg, #EF4444, #F87171)",
        }}
      />
    </nav>
  );
}
