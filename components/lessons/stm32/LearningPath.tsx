"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface Milestones {
  lessonRead: boolean;
  clockUsed: boolean;
  gpioUsed: boolean;
  timerUsed: boolean;
  adcUsed: boolean;
  uartUsed: boolean;
  spiI2cUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}
interface Props { milestones: Milestones; }

const COLOR = "#0891B2";

const lessons = [
  { num: "L01", title: "Voltage",            href: "/lessons/voltage",                     status: "done" },
  { num: "L02", title: "Current",            href: "/lessons/current",                     status: "done" },
  { num: "L03", title: "Resistance",         href: "/electronics/resistance",              status: "done" },
  { num: "L04", title: "Resistors",          href: "/electronics/resistors",               status: "done" },
  { num: "L05", title: "Ohm's Law",          href: "/electronics/ohms-law",                status: "done" },
  { num: "L06", title: "Capacitors",         href: "/electronics/capacitors",              status: "done" },
  { num: "L07", title: "Diodes",             href: "/electronics/diodes",                  status: "done" },
  { num: "L08", title: "LEDs",               href: "/electronics/leds",                    status: "done" },
  { num: "L09", title: "Breadboards",        href: "/electronics/breadboards",             status: "done" },
  { num: "L10", title: "Multimeter",         href: "/electronics/multimeter",              status: "done" },
  { num: "L11", title: "Series Circuits",    href: "/electronics/series-circuits",         status: "done" },
  { num: "L12", title: "Parallel Circuits",  href: "/electronics/parallel-circuits",       status: "done" },
  { num: "L13", title: "Switches",           href: "/electronics/switches",                status: "done" },
  { num: "L14", title: "Pull-Up/Down",       href: "/electronics/pullup-pulldown",         status: "done" },
  { num: "L15", title: "Inductors",          href: "/electronics/inductors",               status: "done" },
  { num: "L16", title: "Transformers",       href: "/electronics/transformers",            status: "done" },
  { num: "L17", title: "BJT",                href: "/electronics/bjt",                     status: "done" },
  { num: "L18", title: "MOSFET",             href: "/electronics/mosfet",                  status: "done" },
  { num: "L19", title: "Logic Gates",        href: "/electronics/logic-gates",             status: "done" },
  { num: "L20", title: "Arduino",            href: "/electronics/arduino",                 status: "done" },
  { num: "L21", title: "Sensors",            href: "/electronics/sensors",                 status: "done" },
  { num: "L22", title: "Comm Protocols",     href: "/electronics/communication-protocols", status: "done" },
  { num: "L23", title: "UART",               href: "/electronics/uart",                    status: "done" },
  { num: "L24", title: "I2C",                href: "/electronics/i2c",                     status: "done" },
  { num: "L25", title: "SPI",                href: "/electronics/spi",                     status: "done" },
  { num: "L26", title: "CAN Protocol",       href: "/electronics/can",                     status: "done" },
  { num: "L27", title: "RS485",              href: "/electronics/rs485",                   status: "done" },
  { num: "L28", title: "IoT",                href: "/electronics/iot",                     status: "done" },
  { num: "L29", title: "ESP32",              href: "/electronics/esp32",                   status: "done" },
  { num: "L30", title: "STM32",              href: "/electronics/stm32",                   status: "active" },
  { num: "L31", title: "FreeRTOS",           status: "locked" },
  { num: "L32", title: "PCB Design",         status: "locked" },
  { num: "L33", title: "Embedded Projects",  status: "locked" },
  { num: "L34", title: "Robotics",           status: "locked" },
  { num: "L35", title: "Computer Vision",    status: "locked" },
  { num: "L36", title: "AI Robotics",        status: "locked" },
];

export default function LearningPath({ milestones }: Props) {
  const milestoneKeys: (keyof Milestones)[] = ["lessonRead", "clockUsed", "gpioUsed", "timerUsed", "adcUsed", "uartUsed", "spiI2cUsed", "quizPassed"];
  const progress = milestoneKeys.filter(k => milestones[k]).length;
  const total = milestoneKeys.length;

  return (
    <div className="p-4 pt-16">
      <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(8,145,178,0.06)", border: "1px solid rgba(8,145,178,0.15)" }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: "rgba(240,240,245,0.55)" }}>Lesson Progress</span>
          <span className="font-bold" style={{ color: COLOR }}>{progress}/{total}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg,${COLOR},#06B6D4)` }}
            initial={{ width: 0 }}
            animate={{ width: `${(progress / total) * 100}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      <div className="space-y-0.5">
        {lessons.map((l) => {
          const isLocked = l.status === "locked";
          const isDone = l.status === "done";
          const isActive = l.status === "active";
          const href = (l as { href?: string }).href;

          const inner = (
            <div
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? "border" : "border border-transparent"}`}
              style={{
                background: isActive ? "rgba(8,145,178,0.10)" : "transparent",
                borderColor: isActive ? "rgba(8,145,178,0.3)" : "transparent",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: isDone ? "rgba(16,185,129,0.15)" : isActive ? "rgba(8,145,178,0.15)" : "rgba(255,255,255,0.06)" }}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isActive ? (
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: COLOR }}
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
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono mr-1.5" style={{ color: isDone ? "rgba(16,185,129,0.7)" : isActive ? COLOR : "rgba(240,240,245,0.25)" }}>
                  {l.num}
                </span>
                <span
                  className="text-xs truncate"
                  style={{
                    color: isDone ? "rgba(240,240,245,0.7)" : isActive ? "#F0F0F5" : isLocked ? "rgba(240,240,245,0.2)" : "rgba(240,240,245,0.45)",
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {l.title}
                </span>
              </div>
            </div>
          );

          if (isLocked || !href) return <div key={l.num}>{inner}</div>;
          return (
            <Link key={l.num} href={href} className="block hover:opacity-90 transition-opacity">
              {inner}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 text-center" style={{ color: "rgba(240,240,245,0.2)", fontSize: "10px" }}>
        Embedded Systems · 36 Lessons
      </div>
    </div>
  );
}
