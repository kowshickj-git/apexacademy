"use client";

import Link from "next/link";

const lessons = [
  { id: 1, title: "Voltage", subtitle: "Electric Pressure", status: "active" as const, href: "/lessons/voltage" },
  { id: 2, title: "Current", subtitle: "Electron Flow", status: "available" as const, href: "/lessons/current" },
  { id: 3, title: "Resistance", subtitle: "Opposition to Flow", status: "locked" as const },
  { id: 4, title: "Ohm's Law", subtitle: "V = I × R", status: "locked" as const },
  { id: 5, title: "Resistors", subtitle: "Controlling Current", status: "locked" as const },
  { id: 6, title: "Capacitors", subtitle: "Storing Energy", status: "available" as const, href: "/electronics/capacitors" },
  { id: 7, title: "Diodes", subtitle: "One-Way Valves", status: "locked" as const },
  { id: 8, title: "LEDs", subtitle: "Light from Current", status: "locked" as const },
  { id: 9, title: "Breadboards", subtitle: "Building Circuits", status: "locked" as const },
  { id: 10, title: "Multimeter",        subtitle: "Measuring Circuits",      status: "locked" as const },
  { id: 11, title: "Series Circuits",   subtitle: "One Path",                status: "locked" as const },
  { id: 12, title: "Parallel Circuits", subtitle: "Multiple Paths",          status: "locked" as const },
  { id: 13, title: "Switches",          subtitle: "Push & Toggle",           status: "locked" as const },
  { id: 14, title: "Pull-Up/Down",      subtitle: "Resistor Biasing",        status: "locked" as const },
  { id: 15, title: "Inductors",         subtitle: "Magnetic Storage",        status: "locked" as const },
  { id: 16, title: "Transformers",      subtitle: "Voltage Conversion",      status: "locked" as const },
  { id: 17, title: "BJT",              subtitle: "Bipolar Transistors",     status: "locked" as const },
  { id: 18, title: "MOSFET",           subtitle: "Field Effect",            status: "locked" as const },
  { id: 19, title: "Logic Gates",      subtitle: "AND OR NOT",              status: "locked" as const },
  { id: 20, title: "Arduino",          subtitle: "Microcontrollers",        status: "locked" as const },
  { id: 21, title: "Sensors",          subtitle: "Environmental Sensing",   status: "locked" as const },
  { id: 22, title: "Comm Protocols",   subtitle: "UART/I2C/SPI/CAN",       status: "locked" as const },
  { id: 23, title: "UART",            subtitle: "Serial Communication",    status: "locked" as const },
  { id: 24, title: "I2C",            subtitle: "Two-Wire Protocol",       status: "locked" as const },
  { id: 25, title: "SPI",            subtitle: "Four-Wire Protocol",      status: "locked" as const },
  { id: 26, title: "CAN Protocol",   subtitle: "Automotive Networking",   status: "locked" as const },
  { id: 27, title: "RS485",          subtitle: "Industrial Serial",       status: "locked" as const },
  { id: 28, title: "IoT",            subtitle: "Connected Devices",       status: "locked" as const },
  { id: 29, title: "ESP32",          subtitle: "WiFi & BLE MCU",         status: "locked" as const },
  { id: 30, title: "STM32",          subtitle: "ARM Cortex MCU",         status: "locked" as const },
  { id: 31, title: "FreeRTOS",       subtitle: "Real-Time OS",           status: "locked" as const },
  { id: 32, title: "PCB Design",     subtitle: "Circuit Boards",         status: "locked" as const },
  { id: 33, title: "Embedded",       subtitle: "Build Devices",          status: "locked" as const },
  { id: 34, title: "Robotics",       subtitle: "Mechanical Systems",     status: "locked" as const },
  { id: 35, title: "Comp. Vision",   subtitle: "Image Processing",       status: "locked" as const },
  { id: 36, title: "AI Robotics",    subtitle: "Intelligent Machines",   status: "locked" as const },
];

function StatusIcon({ status }: { status: "active" | "available" | "locked" }) {
  if (status === "active") {
    return (
      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.12)" }}>
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
    );
  }
  if (status === "available") {
    return (
      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
        <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
          <path d="M3 2l3 2.5L3 7" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full border border-white/8 flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.02)" }}>
      <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
        <rect x="1" y="4" width="6" height="5" rx="1" stroke="#374151" strokeWidth="1.2" />
        <path d="M2.5 4V3a1.5 1.5 0 0 1 3 0v1" stroke="#374151" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export default function VoltageLearningPath() {
  return (
    <div className="p-4">
      <div className="px-1 pt-2 pb-4">
        <p className="text-[10px] text-white/20 uppercase tracking-widest font-semibold">Learning Path</p>
        <p className="text-xs text-white/35 mt-0.5">Electronics Fundamentals</p>
      </div>

      <div className="relative">
        <div className="absolute left-[18px] top-1 bottom-1 w-px" style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.3), rgba(255,255,255,0.04))" }} />

        <div className="space-y-0.5">
          {lessons.map((lesson) => {
            const content = (
              <div className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors relative z-10 ${
                lesson.status === "active"
                  ? "border border-primary/22"
                  : lesson.status === "available"
                  ? "hover:bg-white/3"
                  : "opacity-40 cursor-not-allowed"
              }`}
              style={lesson.status === "active" ? { background: "rgba(16,185,129,0.08)" } : {}}>
                <StatusIcon status={lesson.status} />
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate leading-tight ${
                    lesson.status === "active" ? "text-primary" : lesson.status === "available" ? "text-white/55" : "text-white/25"
                  }`}>
                    {lesson.title}
                  </p>
                  <p className={`text-[10px] truncate leading-tight mt-0.5 ${
                    lesson.status === "active" ? "text-primary/45" : "text-white/18"
                  }`}>
                    {lesson.status === "active" ? "▶ In Progress" : lesson.status === "available" ? lesson.subtitle : lesson.subtitle}
                  </p>
                </div>
              </div>
            );

            return (
              <div key={lesson.id}>
                {lesson.status !== "locked" && lesson.href ? (
                  <Link href={lesson.href}>{content}</Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 px-2 py-3 rounded-xl border border-white/5" style={{ background: "#18181B" }}>
        <div className="flex justify-between text-[10px] text-white/30 mb-2">
          <span>Progress</span>
          <span>1 / 36</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full w-[10%] rounded-full" style={{ background: "linear-gradient(to right, #10B981, #0EA5E9)" }} />
        </div>
        <p className="text-[10px] text-white/20 mt-1.5 text-center">3% Complete</p>
      </div>
    </div>
  );
}
