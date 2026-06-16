"use client";
import Link from "next/link";

const COLOR = "#6366F1";

interface Milestones {
  lessonRead: boolean;
  dashboardUsed: boolean;
  cloudUsed: boolean;
  networkUsed: boolean;
  farmUsed: boolean;
  industrialUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

interface Props {
  milestones: Milestones;
}

type LessonStatus = "done" | "active" | "available" | "locked";

interface Lesson {
  id: string;
  label: string;
  href: string;
  status: LessonStatus;
}

const lessons: Lesson[] = [
  { id: "L01", label: "Voltage", href: "/lessons/voltage", status: "done" },
  { id: "L02", label: "Current", href: "/lessons/current", status: "done" },
  { id: "L03", label: "Resistance", href: "/electronics/resistance", status: "done" },
  { id: "L04", label: "Resistors", href: "/electronics/resistors", status: "done" },
  { id: "L05", label: "Ohm's Law", href: "/electronics/ohms-law", status: "done" },
  { id: "L06", label: "Capacitors", href: "/electronics/capacitors", status: "done" },
  { id: "L07", label: "Diodes", href: "/electronics/diodes", status: "done" },
  { id: "L08", label: "LEDs", href: "/electronics/leds", status: "done" },
  { id: "L09", label: "Breadboards", href: "/electronics/breadboards", status: "done" },
  { id: "L10", label: "Multimeter", href: "/electronics/multimeter", status: "done" },
  { id: "L11", label: "Series Circuits", href: "/electronics/series-circuits", status: "done" },
  { id: "L12", label: "Parallel Circuits", href: "/electronics/parallel-circuits", status: "done" },
  { id: "L13", label: "Switches", href: "/electronics/switches", status: "done" },
  { id: "L14", label: "Pull-Up/Down", href: "/electronics/pullup-pulldown", status: "done" },
  { id: "L15", label: "Inductors", href: "/electronics/inductors", status: "done" },
  { id: "L16", label: "Transformers", href: "/electronics/transformers", status: "done" },
  { id: "L17", label: "BJT", href: "/electronics/bjt", status: "done" },
  { id: "L18", label: "MOSFET", href: "/electronics/mosfet", status: "done" },
  { id: "L19", label: "Logic Gates", href: "/electronics/logic-gates", status: "done" },
  { id: "L20", label: "Arduino", href: "/electronics/arduino", status: "done" },
  { id: "L21", label: "Sensors", href: "/electronics/sensors", status: "done" },
  { id: "L22", label: "Comms Protocols", href: "/electronics/communication-protocols", status: "done" },
  { id: "L23", label: "UART", href: "/electronics/uart", status: "done" },
  { id: "L24", label: "I2C", href: "/electronics/i2c", status: "done" },
  { id: "L25", label: "SPI", href: "/electronics/spi", status: "done" },
  { id: "L26", label: "CAN Protocol", href: "/electronics/can", status: "done" },
  { id: "L27", label: "RS485", href: "/electronics/rs485", status: "done" },
  { id: "L28", label: "IoT", href: "/electronics/iot", status: "active" },
  { id: "L29", label: "ESP32", href: "/electronics/esp32", status: "available" },
  { id: "L30", label: "STM32", href: "/electronics/stm32", status: "available" },
  { id: "L31", label: "FreeRTOS", href: "/electronics/freertos", status: "locked" },
  { id: "L32", label: "PCB Design", href: "/electronics/pcb-design", status: "locked" },
  { id: "L33", label: "Embedded Proj.", href: "/electronics/embedded-project", status: "locked" },
  { id: "L34", label: "Robotics", href: "/electronics/robotics", status: "locked" },
  { id: "L35", label: "Comp. Vision", href: "/electronics/computer-vision", status: "locked" },
  { id: "L36", label: "AI Robotics", href: "/electronics/ai-robotics", status: "locked" },
];

const milestoneKeys: (keyof Milestones)[] = [
  "lessonRead",
  "dashboardUsed",
  "cloudUsed",
  "networkUsed",
  "farmUsed",
  "industrialUsed",
  "quizPassed",
];

const milestoneLabels: Record<keyof Omit<Milestones, "lessonFinished">, string> = {
  lessonRead: "Read Intro",
  dashboardUsed: "Smart Home",
  cloudUsed: "Sensor → Cloud",
  networkUsed: "Network Builder",
  farmUsed: "Smart Farm",
  industrialUsed: "Industrial IoT",
  quizPassed: "Quiz Passed",
};

export default function LearningPath({ milestones }: Props) {
  const completedCount = milestoneKeys.filter(k => milestones[k]).length;
  const progressPct = Math.round((completedCount / milestoneKeys.length) * 100);

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>
          IoT Milestones
        </p>
        <div className="w-full rounded-full h-1.5" style={{ background: "rgba(99,102,241,0.15)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: COLOR }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          {completedCount}/{milestoneKeys.length} milestones
        </p>
      </div>

      <div className="space-y-1">
        {milestoneKeys.map(k => (
          <div key={k} className="flex items-center gap-2 py-0.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300"
              style={{
                background: milestones[k] ? COLOR : "rgba(255,255,255,0.1)",
                boxShadow: milestones[k] ? `0 0 6px ${COLOR}` : "none",
              }}
            />
            <span
              className="text-xs"
              style={{ color: milestones[k] ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}
            >
              {milestoneLabels[k as keyof typeof milestoneLabels]}
            </span>
            {milestones[k] && (
              <span className="ml-auto text-xs" style={{ color: COLOR }}>✓</span>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          All Lessons
        </p>
        <div className="space-y-0.5">
          {lessons.map(lesson => {
            const isDone = lesson.status === "done";
            const isActive = lesson.status === "active";
            const isAvailable = lesson.status === "available";
            const isLocked = lesson.status === "locked";

            const content = (
              <div
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: isActive ? `rgba(99,102,241,0.15)` : "transparent",
                  border: isActive ? `1px solid rgba(99,102,241,0.3)` : "1px solid transparent",
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0"
                  style={{
                    background: isDone
                      ? `rgba(99,102,241,0.3)`
                      : isActive
                      ? COLOR
                      : isAvailable
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.04)",
                  }}
                >
                  {isDone ? (
                    <span style={{ color: COLOR }}>✓</span>
                  ) : isActive ? (
                    <span style={{ color: "#fff", fontSize: "8px" }}>▶</span>
                  ) : isLocked ? (
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "8px" }}>🔒</span>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "8px" }}>○</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-xs block truncate"
                    style={{
                      color: isDone
                        ? "rgba(255,255,255,0.6)"
                        : isActive
                        ? "#fff"
                        : isAvailable
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.2)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {lesson.id} {lesson.label}
                  </span>
                </div>
              </div>
            );

            if (isLocked) {
              return <div key={lesson.id}>{content}</div>;
            }

            return (
              <Link key={lesson.id} href={lesson.href} className="block">
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="pt-3 text-center text-xs"
        style={{ color: "rgba(255,255,255,0.2)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        Embedded Systems · 36 Lessons
      </div>
    </div>
  );
}
