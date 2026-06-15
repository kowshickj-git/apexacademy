"use client";

import Link from "next/link";

interface Milestones {
  lessonRead: boolean;
  simUsed: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

const lessons = [
  { id: "L01", title: "Voltage",     href: "/lessons/voltage",        done: true  },
  { id: "L02", title: "Current",     href: "/lessons/current",        done: true  },
  { id: "L03", title: "Resistance",  href: "/electronics/resistance", done: true  },
  { id: "L04", title: "Resistors",   href: "/electronics/resistors",  done: true  },
  { id: "L05", title: "Ohm's Law",   href: "/electronics/ohms-law",   done: true  },
  { id: "L06", title: "Capacitors",  href: "/electronics/capacitors", available: true },
  { id: "L07", title: "Diodes",      href: "/electronics/diodes",     active: true },
  { id: "L08", title: "LEDs",        href: "/electronics/leds",       available: true },
  { id: "L09", title: "Breadboards", href: "/electronics/breadboards", available: true },
  { id: "L10", title: "Multimeter",        href: "/electronics/multimeter",        available: true },
  { id: "L11", title: "Series Circuits",   href: "/electronics/series-circuits",   available: true },
  { id: "L12", title: "Parallel Circuits", href: "/electronics/parallel-circuits", available: true },
  { id: "L13", title: "Switches",     href: "/electronics/switches",        available: true },
  { id: "L14", title: "Pull-Up/Down", href: "/electronics/pullup-pulldown", available: true },
  { id: "L15", title: "Inductors",    href: "/electronics/inductors",       available: true },
  { id: "L16", title: "Transformers", href: "/electronics/transformers",    available: true },
  { id: "L17", title: "BJT",          href: "/electronics/bjt",             available: true },
  { id: "L18", title: "MOSFET",       href: "/electronics/mosfet",          available: true },
  { id: "L19", title: "Logic Gates",  href: "/electronics/logic-gates",     available: true },
  { id: "L20", title: "Arduino",      href: "/electronics/arduino",         available: true },
];

interface Props { milestones: Milestones; }

export default function LearningPath({ milestones }: Props) {
  const progress = Object.values(milestones).filter(Boolean).length;
  const total = Object.keys(milestones).length;

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-1.5">
          <span>Lesson progress</span>
          <span>{progress}/{total}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(progress / total) * 100}%`, background: "linear-gradient(to right, #8B5CF6, #10B981)" }}
          />
        </div>
      </div>

      <div className="space-y-1">
        {lessons.map((l) => (
          <div key={l.id}>
            {(l as any).locked ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-30 cursor-not-allowed">
                <div className="w-6 h-6 rounded-lg border border-white/10 flex items-center justify-center text-[9px] font-mono text-white/30">{l.id.slice(1)}</div>
                <span className="text-xs text-white/35">{l.title}</span>
                <svg className="ml-auto" width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="5" width="8" height="6" rx="1" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                  <path d="M4 5V3.5a2 2 0 014 0V5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                </svg>
              </div>
            ) : l.available ? (
              <Link href={l.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors group">
                <div className="w-6 h-6 rounded-lg border border-white/20 flex items-center justify-center text-[9px] font-mono text-white/35 group-hover:border-white/35 transition-colors">{l.id.slice(1)}</div>
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{l.title}</span>
                <svg className="ml-auto opacity-50" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3 5h4M5 3l2 2-2 2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : l.active ? (
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                style={{ background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.3)" }}
              >
                <div
                  className="w-6 h-6 rounded-lg border flex items-center justify-center text-[9px] font-mono font-bold"
                  style={{ background: "rgba(139,92,246,0.2)", borderColor: "rgba(139,92,246,0.4)", color: "#A78BFA" }}
                >
                  {l.id.slice(1)}
                </div>
                <span className="text-xs font-semibold" style={{ color: "#A78BFA" }}>{l.title}</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              </div>
            ) : (
              <Link
                href={l.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0"
                  style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.25)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="#10B981">
                    <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <span className="text-xs text-white/55">{l.title}</span>
                <span className="ml-auto text-[9px] text-primary/50 font-mono">✓</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[10px] text-white/20 text-center">Electronics Fundamentals · 12 Lessons</p>
      </div>
    </div>
  );
}
