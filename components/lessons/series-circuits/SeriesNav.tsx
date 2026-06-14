"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Milestones {
  lessonRead: boolean;
  builderUsed: boolean;
  voltageDropUsed: boolean;
  openCircuitUsed: boolean;
  resistanceCalcUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

interface SeriesNavProps {
  xp: number;
  milestones: Milestones;
  onMenuClick: () => void;
}

const PIPS = [
  { key: "lessonRead", label: "Read" },
  { key: "builderUsed", label: "Builder" },
  { key: "voltageDropUsed", label: "VoltageDrop" },
  { key: "openCircuitUsed", label: "OpenCircuit" },
  { key: "resistanceCalcUsed", label: "Resistance" },
  { key: "quizPassed", label: "Quiz" },
] as const;

export default function SeriesNav({ xp, milestones, onMenuClick }: SeriesNavProps) {
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
          <polygon points="14,3 25,22 3,22" fill="#F97316" opacity="0.9" />
          <polygon points="14,8 22,21 6,21" fill="#050507" />
          <polygon points="14,11 19,20 9,20" fill="#F97316" opacity="0.5" />
        </svg>
      </Link>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs min-w-0">
        <span style={{ color: "rgba(240,240,245,0.35)" }}>Electronics</span>
        <span style={{ color: "rgba(240,240,245,0.2)" }}>/</span>
        <span className="font-semibold truncate" style={{ color: "#F97316" }}>
          Series Circuits
        </span>
      </div>

      {/* L11 of 12 */}
      <span
        className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: "rgba(249,115,22,0.1)",
          color: "rgba(249,115,22,0.7)",
          border: "1px solid rgba(249,115,22,0.2)",
        }}
      >
        L11 of 12
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
          background: "rgba(249,115,22,0.1)",
          border: "1px solid rgba(249,115,22,0.22)",
          boxShadow: "0 0 12px rgba(249,115,22,0.12)",
          color: "#F97316",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="#F97316">
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
        {xp} XP
      </div>

      {/* Prev */}
      <Link
        href="/electronics/multimeter"
        className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
        style={{
          color: "rgba(240,240,245,0.45)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        ← Multimeter
      </Link>

      {/* Next */}
      <Link
        href="/electronics/parallel-circuits"
        className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
        style={{
          color: "#F97316",
          border: "1px solid rgba(249,115,22,0.3)",
          background: "rgba(249,115,22,0.08)",
        }}
      >
        Parallel Circuits →
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
          background: "linear-gradient(90deg, #F97316, #FB923C)",
        }}
      />
    </nav>
  );
}
