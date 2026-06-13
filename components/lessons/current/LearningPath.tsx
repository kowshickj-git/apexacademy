"use client";

import Link from "next/link";

const lessons = [
  { id: 1, title: "Voltage", subtitle: "Electric Pressure", status: "done" as const, href: "/lessons/voltage" },
  { id: 2, title: "Current", subtitle: "Electron Flow", status: "active" as const, href: "/lessons/current" },
  { id: 3, title: "Resistance", subtitle: "Opposition to Flow", status: "locked" as const },
  { id: 4, title: "Ohm's Law", subtitle: "V = I × R", status: "locked" as const },
  { id: 5, title: "Resistors", subtitle: "Controlling Current", status: "locked" as const },
  { id: 6, title: "Capacitors", subtitle: "Storing Energy", status: "locked" as const },
  { id: 7, title: "Diodes", subtitle: "One-Way Valves", status: "locked" as const },
  { id: 8, title: "LEDs", subtitle: "Light from Current", status: "locked" as const },
  { id: 9, title: "Breadboards", subtitle: "Building Circuits", status: "locked" as const },
  { id: 10, title: "Multimeter", subtitle: "Measuring Circuits", status: "locked" as const },
];

function StatusIcon({ status }: { status: "done" | "active" | "locked" }) {
  if (status === "done") {
    return (
      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.2 6L8 1" stroke="#050507" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center shrink-0" style={{ background: "rgba(14,165,233,0.12)" }}>
        <div className="w-2 h-2 rounded-full bg-secondary" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.03)" }}>
      <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
        <rect x="1" y="4" width="6" height="5" rx="1" stroke="#4B5563" strokeWidth="1.2" />
        <path d="M2.5 4V3a1.5 1.5 0 0 1 3 0v1" stroke="#4B5563" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export default function LearningPath() {
  return (
    <div className="p-4">
      <div className="px-1 pt-2 pb-4">
        <p className="text-[10px] text-white/20 uppercase tracking-widest font-semibold">Learning Path</p>
        <p className="text-xs text-white/35 mt-0.5">Electronics Fundamentals</p>
      </div>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[18px] top-1 bottom-1 w-px bg-gradient-to-b from-primary/30 via-white/5 to-white/5" />

        <div className="space-y-0.5">
          {lessons.map((lesson) => {
            const content = (
              <div className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors relative z-10 ${
                lesson.status === "active"
                  ? "bg-secondary/8 border border-secondary/20"
                  : lesson.status === "done"
                  ? "hover:bg-white/3"
                  : "opacity-50 cursor-not-allowed"
              }`}>
                <StatusIcon status={lesson.status} />
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate leading-tight ${
                    lesson.status === "active"
                      ? "text-secondary"
                      : lesson.status === "done"
                      ? "text-white/60"
                      : "text-white/30"
                  }`}>
                    {lesson.title}
                  </p>
                  <p className={`text-[10px] truncate leading-tight mt-0.5 ${
                    lesson.status === "active" ? "text-secondary/45" : "text-white/18"
                  }`}>
                    {lesson.status === "done" ? "✓ Complete" : lesson.status === "active" ? "▶ In Progress" : lesson.subtitle}
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

      {/* Progress */}
      <div className="mt-5 px-2 py-3 bg-surface rounded-xl border border-white/5">
        <div className="flex justify-between text-[10px] text-white/30 mb-2">
          <span>Progress</span>
          <span>2 / 10</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-[20%] bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>
        <p className="text-[10px] text-white/20 mt-1.5 text-center">20% Complete</p>
      </div>
    </div>
  );
}
