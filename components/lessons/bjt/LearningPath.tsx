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

interface LearningPathProps {
  milestones: Milestones;
}

const LESSONS = [
  { num: "L01", title: "Voltage", href: "/lessons/voltage", status: "done" },
  { num: "L02", title: "Current", href: "/lessons/current", status: "done" },
  { num: "L03", title: "Resistance", href: "/electronics/resistance", status: "done" },
  { num: "L04", title: "Resistors", href: "/electronics/resistors", status: "done" },
  { num: "L05", title: "Ohm's Law", href: "/electronics/ohms-law", status: "done" },
  { num: "L06", title: "Capacitors", href: "/electronics/capacitors", status: "available" },
  { num: "L07", title: "Diodes", href: "/electronics/diodes", status: "done" },
  { num: "L08", title: "LEDs", href: "/electronics/leds", status: "done" },
  { num: "L09", title: "Breadboards", href: "/electronics/breadboards", status: "done" },
  { num: "L10", title: "Multimeter", href: "/electronics/multimeter", status: "done" },
  { num: "L11", title: "Series Circuits", href: "/electronics/series-circuits", status: "done" },
  { num: "L12", title: "Parallel Circuits", href: "/electronics/parallel-circuits", status: "done" },
  { num: "L13", title: "Switches",     href: "/electronics/switches",        status: "done" },
  { num: "L14", title: "Pull-Up/Down", href: "/electronics/pullup-pulldown", status: "done" },
  { num: "L15", title: "Inductors",    href: "/electronics/inductors",       status: "done" },
  { num: "L16", title: "Transformers", href: "/electronics/transformers",    status: "done" },
  { num: "L17", title: "BJT",          href: "/electronics/bjt",             status: "active" },
  { num: "L18", title: "MOSFET",       href: "/electronics/mosfet",          status: "available" },
  { num: "L19", title: "Logic Gates",  href: "/electronics/logic-gates",     status: "available" },
  { num: "L20", title: "Arduino",      href: "/electronics/arduino",         status: "available" },
  { num: "L21", title: "Sensors",           href: "/electronics/sensors",                 status: "available" },
  { num: "L22", title: "Comm Protocols",    href: "/electronics/communication-protocols", status: "available" },
  { num: "L23", title: "UART",             href: "/electronics/uart",                    status: "available" },
  { num: "L24", title: "I2C",             href: "/electronics/i2c",                     status: "available" },
  { num: "L25", title: "SPI",             href: "/electronics/spi",                     status: "available" },
  { num: "L26", title: "CAN Protocol",    href: "/electronics/can",                     status: "available" },
  { num: "L27", title: "RS485",           href: "/electronics/rs485",                   status: "available" },
  { num: "L28", title: "IoT",             href: "/electronics/iot",                     status: "available" },
  { num: "L29", title: "ESP32",           href: "/electronics/esp32",                   status: "available" },
  { num: "L30", title: "STM32",           href: "/electronics/stm32",                   status: "available" },
  { num: "L31", title: "FreeRTOS",        href: "/electronics/freertos",                status: "locked" },
  { num: "L32", title: "PCB Design",      href: "/electronics/pcb-design",              status: "locked" },
  { num: "L33", title: "Embedded",        href: "/electronics/embedded-projects",       status: "locked" },
  { num: "L34", title: "Robotics",        href: "/electronics/robotics",                status: "locked" },
  { num: "L35", title: "Computer Vision", href: "/electronics/computer-vision",         status: "locked" },
  { num: "L36", title: "AI Robotics",     href: "/electronics/ai-robotics",             status: "locked" },
] as const;

export default function LearningPath({ milestones }: LearningPathProps) {
  const milestoneKeys = [
    "lessonRead",
    "switchUsed",
    "amplifierUsed",
    "baseCurrentUsed",
    "ledDriverUsed",
    "motorDriverUsed",
    "quizPassed",
  ] as const;

  const completedCount = milestoneKeys.filter((k) => milestones[k]).length;
  const lessonProgress = Math.round((completedCount / milestoneKeys.length) * 100);

  return (
    <div className="p-4 flex flex-col gap-1">
      {/* Lesson progress */}
      <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: "rgba(240,240,245,0.55)" }}>Lesson Progress</span>
          <span style={{ color: "#EF4444" }} className="font-bold">{completedCount}/{milestoneKeys.length}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#EF4444,#F87171)" }}
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
        const isLocked = (lesson.status as string) === "locked";

        const inner = (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
            style={{
              background: isActive ? "rgba(239,68,68,0.1)" : "transparent",
              border: isActive ? "1px solid rgba(239,68,68,0.3)" : "1px solid transparent",
            }}
          >
            {/* Icon */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
              style={{
                background: isDone
                  ? "rgba(16,185,129,0.15)"
                  : isActive
                  ? "rgba(239,68,68,0.15)"
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
                  style={{ background: "#EF4444" }}
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
                      ? "#EF4444"
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

        if (isLocked) {
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
          <span className="font-bold" style={{ color: "#10B981" }}>85%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full" style={{ width: "85%", background: "linear-gradient(90deg,#10B981,#0EA5E9)" }} />
        </div>
        <div className="mt-2 text-center" style={{ color: "rgba(240,240,245,0.25)", fontSize: "10px" }}>
          17 / 20 lessons complete
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 text-center" style={{ color: "rgba(240,240,245,0.2)", fontSize: "10px" }}>
        Electronics Fundamentals · 36 Lessons
      </div>
    </div>
  );
}
