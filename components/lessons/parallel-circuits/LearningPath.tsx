"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Milestones {
  lessonRead: boolean;
  builderUsed: boolean;
  currentSplitUsed: boolean;
  openBranchUsed: boolean;
  resistanceSimUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

interface Props {
  milestones: Milestones;
}

const lessons = [
  { id: "L01", title: "Voltage", href: "/lessons/voltage", done: true },
  { id: "L02", title: "Current", href: "/lessons/current", done: true },
  { id: "L03", title: "Resistance", href: "/electronics/resistance", done: true },
  { id: "L04", title: "Resistors", href: "/electronics/resistors", done: true },
  { id: "L05", title: "Ohm's Law", href: "/electronics/ohms-law", done: true },
  { id: "L06", title: "Capacitors", href: "/electronics/capacitors", done: false },
  { id: "L07", title: "Diodes", href: "/electronics/diodes", done: true },
  { id: "L08", title: "LEDs", href: "/electronics/leds", done: true },
  { id: "L09", title: "Breadboards", href: "/electronics/breadboards", done: true },
  { id: "L10", title: "Multimeter", href: "/electronics/multimeter", done: true },
  { id: "L11", title: "Series Circuits", href: "/electronics/series-circuits", done: true },
  { id: "L12", title: "Parallel Circuits", href: "/electronics/parallel-circuits", done: false, active: true },
  { id: "L13", title: "Switches",     href: "/electronics/switches",        done: false },
  { id: "L14", title: "Pull-Up/Down", href: "/electronics/pullup-pulldown", done: false },
  { id: "L15", title: "Inductors",    href: "/electronics/inductors",       done: false },
  { id: "L16", title: "Transformers", href: "/electronics/transformers",    done: false },
  { id: "L17", title: "BJT",          href: "/electronics/bjt",             done: false },
  { id: "L18", title: "MOSFET",       href: "/electronics/mosfet",          done: false },
  { id: "L19", title: "Logic Gates",  href: "/electronics/logic-gates",     done: false },
  { id: "L20", title: "Arduino",      href: "/electronics/arduino",         done: false },
];

export default function LearningPath({ milestones }: Props) {
  const completedMilestones = Object.values(milestones).filter(Boolean).length;
  const totalMilestones = 7;
  const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="p-4 flex flex-col gap-2">
      {/* Milestone progress */}
      <div className="mb-3 p-3 rounded-xl border border-white/5" style={{ background: "rgba(99,102,241,0.06)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/50">Lesson Progress</span>
          <span className="text-xs font-bold" style={{ color: "#6366F1" }}>{completedMilestones}/{totalMilestones}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #6366F1, #10B981)" }}
            initial={{ width: 0 }}
            animate={{ width: `${milestoneProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex flex-col gap-1">
        {lessons.map((lesson) => {
          const isActive = !!lesson.active;
          const isLocked = !!(lesson as any).locked;
          const isDone = lesson.done;

          const content = (
            <div
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all ${
                isActive
                  ? "border-indigo-500/30"
                  : isDone
                  ? "border-white/5 hover:border-white/10"
                  : isLocked
                  ? "border-white/3 opacity-40"
                  : "border-white/5"
              }`}
              style={{
                background: isActive
                  ? "rgba(99,102,241,0.12)"
                  : isDone
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Status indicator */}
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                style={{
                  background: isActive
                    ? "#6366F1"
                    : isDone
                    ? "rgba(16,185,129,0.2)"
                    : "rgba(255,255,255,0.06)",
                  color: isActive ? "#fff" : isDone ? "#10B981" : "rgba(255,255,255,0.3)",
                }}
              >
                {isDone && !isActive ? "✓" : isLocked ? "🔒" : isActive ? "▶" : ""}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-mono"
                    style={{
                      color: isActive ? "#6366F1" : isDone ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {lesson.id}
                  </span>
                  <span
                    className="text-xs font-medium truncate"
                    style={{
                      color: isActive
                        ? "#fff"
                        : isDone
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {lesson.title}
                  </span>
                </div>
              </div>

              {isActive && (
                <div
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(99,102,241,0.25)", color: "#818CF8" }}
                >
                  NOW
                </div>
              )}
            </div>
          );

          if (isLocked || (!lesson.href && !isActive)) {
            return <div key={lesson.id}>{content}</div>;
          }

          return (
            <Link key={lesson.id} href={lesson.href || "#"}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* Course stats */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/40">Course: 12/20</span>
          <span className="text-xs font-bold" style={{ color: "#10B981" }}>100%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full w-full" style={{ background: "linear-gradient(to right, #6366F1, #10B981)" }} />
        </div>
        <p className="text-[10px] text-white/25 mt-2 text-center">Electronics Fundamentals · 20 Lessons</p>
      </div>
    </div>
  );
}
