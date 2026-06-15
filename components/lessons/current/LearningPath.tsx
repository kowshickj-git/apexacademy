"use client";

import Link from "next/link";

const lessons = [
  { id: 1,  title: "Voltage",     subtitle: "Electric Pressure",   status: "done"      as const, href: "/lessons/voltage"          },
  { id: 2,  title: "Current",     subtitle: "Electron Flow",       status: "active"    as const, href: "/lessons/current"          },
  { id: 3,  title: "Resistance",  subtitle: "Opposition to Flow",  status: "available" as const, href: "/electronics/resistance"   },
  { id: 4,  title: "Resistors",   subtitle: "Color Codes & Calc",  status: "available" as const, href: "/electronics/resistors"    },
  { id: 5,  title: "Ohm's Law",   subtitle: "V = I × R",          status: "available" as const, href: "/electronics/ohms-law"     },
  { id: 6,  title: "Capacitors",  subtitle: "Storing Energy",      status: "locked"    as const                                   },
  { id: 7,  title: "Diodes",      subtitle: "One-Way Valves",      status: "available" as const, href: "/electronics/diodes"      },
  { id: 8,  title: "LEDs",        subtitle: "Light from Current",  status: "available" as const, href: "/electronics/leds"        },
  { id: 9,  title: "Breadboards", subtitle: "Building Circuits",   status: "available" as const, href: "/electronics/breadboards" },
  { id: 10, title: "Multimeter",        subtitle: "Measuring Circuits",  status: "available" as const, href: "/electronics/multimeter"        },
  { id: 11, title: "Series Circuits",   subtitle: "One Path",            status: "available" as const, href: "/electronics/series-circuits"   },
  { id: 12, title: "Parallel Circuits", subtitle: "Multiple Paths",      status: "available" as const, href: "/electronics/parallel-circuits" },
  { id: 13, title: "Switches",     subtitle: "Push & Toggle",           status: "available" as const, href: "/electronics/switches"        },
  { id: 14, title: "Pull-Up/Down", subtitle: "Resistor Biasing",        status: "available" as const, href: "/electronics/pullup-pulldown" },
  { id: 15, title: "Inductors",    subtitle: "Magnetic Energy Storage", status: "available" as const, href: "/electronics/inductors"       },
  { id: 16, title: "Transformers", subtitle: "Voltage Conversion",      status: "available" as const, href: "/electronics/transformers"    },
  { id: 17, title: "BJT",          subtitle: "Bipolar Transistors",     status: "available" as const, href: "/electronics/bjt"             },
  { id: 18, title: "MOSFET",       subtitle: "Field Effect",            status: "available" as const, href: "/electronics/mosfet"          },
  { id: 19, title: "Logic Gates",  subtitle: "AND OR NOT",              status: "available" as const, href: "/electronics/logic-gates"     },
  { id: 20, title: "Arduino",      subtitle: "Microcontrollers",        status: "available" as const, href: "/electronics/arduino"         },
];

function StatusIcon({ status }: { status: "done" | "active" | "locked" | "available" }) {
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
  if (status === "available") {
    return (
      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.03)" }}>
        <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
          <path d="M2 4h4M4.5 2l2 2-2 2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
                  : lesson.status === "done" || lesson.status === "available"
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
                      : lesson.status === "available"
                      ? "text-white/38"
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
                {(lesson.status === "done" || lesson.status === "available") && lesson.href ? (
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
          <span>2 / 12</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-[20%] bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>
        <p className="text-[10px] text-white/20 mt-1.5 text-center">20% Complete</p>
      </div>
    </div>
  );
}
