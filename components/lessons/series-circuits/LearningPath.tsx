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

interface LearningPathProps {
  milestones: Milestones;
}

const LESSONS = [
  { num: "L01", title: "Voltage", href: "/lessons/voltage", status: "done" },
  { num: "L02", title: "Current", href: "/lessons/current", status: "done" },
  { num: "L03", title: "Resistance", href: "/electronics/resistance", status: "done" },
  { num: "L04", title: "Resistors", href: "/electronics/resistors", status: "done" },
  { num: "L05", title: "Ohm's Law", href: "/electronics/ohms-law", status: "done" },
  { num: "L06", title: "Capacitors", href: null, status: "locked" },
  { num: "L07", title: "Diodes", href: "/electronics/diodes", status: "done" },
  { num: "L08", title: "LEDs", href: "/electronics/leds", status: "done" },
  { num: "L09", title: "Breadboards", href: "/electronics/breadboards", status: "done" },
  { num: "L10", title: "Multimeter", href: "/electronics/multimeter", status: "done" },
  { num: "L11", title: "Series Circuits", href: "/electronics/series-circuits", status: "active" },
  { num: "L12", title: "Parallel Circuits", href: "/electronics/parallel-circuits", status: "available" },
] as const;

export default function LearningPath({ milestones }: LearningPathProps) {
  const milestoneKeys = [
    "lessonRead",
    "builderUsed",
    "voltageDropUsed",
    "openCircuitUsed",
    "resistanceCalcUsed",
    "quizPassed",
  ] as const;

  const completedCount = milestoneKeys.filter((k) => milestones[k]).length;
  const lessonProgress = Math.round((completedCount / milestoneKeys.length) * 100);

  return (
    <div className="p-4 flex flex-col gap-1">
      {/* Lesson progress */}
      <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: "rgba(240,240,245,0.55)" }}>Lesson Progress</span>
          <span style={{ color: "#F97316" }} className="font-bold">{completedCount}/{milestoneKeys.length}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#F97316,#FB923C)" }}
            initial={{ width: 0 }}
            animate={{ width: `${lessonProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Lesson list */}
      {LESSONS.map((lesson) => {
        const isDone = lesson.status === "done";
        const isActive = lesson.status === "active";
        const isLocked = lesson.status === "locked";
        const isAvailable = lesson.status === "available";

        const inner = (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
            style={{
              background: isActive
                ? "rgba(249,115,22,0.1)"
                : "transparent",
              border: isActive
                ? "1px solid rgba(249,115,22,0.3)"
                : "1px solid transparent",
            }}
          >
            {/* Icon */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
              style={{
                background: isDone
                  ? "rgba(16,185,129,0.15)"
                  : isActive
                  ? "rgba(249,115,22,0.15)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              {isDone ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : isActive ? (
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#F97316" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              ) : isLocked ? (
                <svg width="9" height="9" viewBox="0 0 10 12" fill="none">
                  <rect x="2" y="5" width="6" height="6" rx="1" fill="rgba(240,240,245,0.2)" />
                  <path d="M3.5 5V3.5a1.5 1.5 0 013 0V5" stroke="rgba(240,240,245,0.2)" strokeWidth="1.2" />
                </svg>
              ) : (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M3 5h4M5.5 3.5L7 5l-1.5 1.5" stroke="rgba(240,240,245,0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>

            {/* Num + title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-mono"
                  style={{
                    color: isDone
                      ? "rgba(16,185,129,0.7)"
                      : isActive
                      ? "#F97316"
                      : "rgba(240,240,245,0.25)",
                  }}
                >
                  {lesson.num}
                </span>
                <span
                  className="text-xs truncate"
                  style={{
                    color: isDone
                      ? "rgba(240,240,245,0.7)"
                      : isActive
                      ? "#F0F0F5"
                      : isLocked
                      ? "rgba(240,240,245,0.2)"
                      : "rgba(240,240,245,0.45)",
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {lesson.title}
                </span>
              </div>
            </div>
          </div>
        );

        if (isLocked || !lesson.href) {
          return <div key={lesson.num}>{inner}</div>;
        }

        return (
          <Link key={lesson.num} href={lesson.href} className="block hover:opacity-90 transition-opacity">
            {inner}
          </Link>
        );
      })}

      {/* Course progress */}
      <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: "rgba(240,240,245,0.4)" }}>Course Progress</span>
          <span className="font-bold" style={{ color: "#10B981" }}>92%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full" style={{ width: "92%", background: "linear-gradient(90deg,#10B981,#0EA5E9)" }} />
        </div>
        <div className="mt-2 text-center" style={{ color: "rgba(240,240,245,0.25)", fontSize: "10px" }}>
          11 / 12 lessons complete
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 text-center" style={{ color: "rgba(240,240,245,0.2)", fontSize: "10px" }}>
        Electronics Fundamentals · 12 Lessons
      </div>
    </div>
  );
}
