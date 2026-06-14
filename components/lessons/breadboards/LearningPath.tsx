"use client";

import Link from "next/link";

interface Milestones {
  lessonRead: boolean;
  anatomyUsed: boolean;
  connectionUsed: boolean;
  circuitBuilt: boolean;
  quizPassed: boolean;
  lessonFinished: boolean;
}

interface Props {
  milestones: Milestones;
}

const lessons = [
  { id: "L01", title: "Voltage",      href: "/lessons/voltage",          done: true },
  { id: "L02", title: "Current",      href: "/lessons/current",          done: true },
  { id: "L03", title: "Resistance",   href: "/electronics/resistance",   done: true },
  { id: "L04", title: "Resistors",    href: "/electronics/resistors",    done: true },
  { id: "L05", title: "Ohm's Law",    href: "/electronics/ohms-law",     done: true },
  { id: "L06", title: "Capacitors",   href: "#",                         locked: true },
  { id: "L07", title: "Diodes",       href: "/electronics/diodes",       done: true },
  { id: "L08", title: "LEDs",         href: "/electronics/leds",         done: true },
  { id: "L09", title: "Breadboards",  href: "/electronics/breadboards",  active: true },
  { id: "L10", title: "Multimeter",   href: "/electronics/multimeter",   available: true },
];

export default function LearningPath({ milestones }: Props) {
  const progress = Object.values(milestones).filter(Boolean).length;
  const total = Object.keys(milestones).length;

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-1.5">
          <span>Course progress</span>
          <span>9/10 lessons</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: "90%", background: "linear-gradient(to right, #14B8A6, #10B981)" }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/30 mt-1.5">
          <span>Lesson milestones</span>
          <span>{progress}/{total}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden mt-1" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(progress / total) * 100}%`, background: "rgba(20,184,166,0.5)" }}
          />
        </div>
      </div>

      <div className="space-y-1">
        {lessons.map((l) => {
          if (l.locked) {
            return (
              <div key={l.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-30 cursor-not-allowed">
                <div className="w-6 h-6 rounded-lg border border-white/10 flex items-center justify-center text-[9px] font-mono text-white/30">
                  {l.id.slice(1)}
                </div>
                <span className="text-xs text-white/35">{l.title}</span>
                <svg className="ml-auto" width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="5" width="8" height="6" rx="1" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                  <path d="M4 5V3.5a2 2 0 014 0V5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                </svg>
              </div>
            );
          }
          if (l.available) {
            return (
              <Link key={l.id} href={l.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors group">
                <div className="w-6 h-6 rounded-lg border border-white/20 flex items-center justify-center text-[9px] font-mono text-white/35 group-hover:border-white/35 transition-colors">
                  {l.id.slice(1)}
                </div>
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{l.title}</span>
                <svg className="ml-auto opacity-50" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3 5h4M5 3l2 2-2 2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            );
          }
          if (l.active) {
            return (
              <div
                key={l.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                style={{ background: "rgba(20,184,166,0.10)", borderColor: "rgba(20,184,166,0.3)" }}
              >
                <div
                  className="w-6 h-6 rounded-lg border flex items-center justify-center text-[9px] font-mono font-bold"
                  style={{ background: "rgba(20,184,166,0.2)", borderColor: "rgba(20,184,166,0.4)", color: "#14B8A6" }}
                >
                  {l.id.slice(1)}
                </div>
                <span className="text-xs font-semibold" style={{ color: "#14B8A6" }}>{l.title}</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#14B8A6" }} />
              </div>
            );
          }
          // done
          return (
            <Link key={l.id} href={l.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors">
              <div
                className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0"
                style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.25)" }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs text-white/55">{l.title}</span>
              <span className="ml-auto text-[9px] text-primary/50 font-mono">✓</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[10px] text-white/20 text-center">Electronics Fundamentals · 10 Lessons</p>
      </div>
    </div>
  );
}
