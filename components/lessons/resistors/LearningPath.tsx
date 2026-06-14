"use client";

import Link from "next/link";

const lessons = [
  { num: "01", title: "Voltage",     href: "/lessons/voltage",           status: "done"      },
  { num: "02", title: "Current",     href: "/lessons/current",           status: "done"      },
  { num: "03", title: "Resistance",  href: "/electronics/resistance",    status: "done"      },
  { num: "04", title: "Resistors",   href: "/electronics/resistors",     status: "active"    },
  { num: "05", title: "Ohm's Law",   href: "/electronics/ohms-law",      status: "available" },
  { num: "06", title: "Capacitors",  href: "#",                          status: "locked"    },
  { num: "07", title: "Diodes",      href: "/electronics/diodes",        status: "available" },
  { num: "08", title: "LEDs",        href: "/electronics/leds",          status: "available" },
  { num: "09", title: "Breadboards", href: "/electronics/breadboards",   status: "available" },
  { num: "10", title: "Multimeter",  href: "/electronics/multimeter",    status: "available" },
];

export default function LearningPath() {
  return (
    <div className="p-4">
      <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3 font-mono">Learning Path</p>

      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-white/25 mb-1.5">
          <span>Progress</span><span>4 / 10</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full" style={{ width: "40%", background: "linear-gradient(to right, #10B981, #0EA5E9)" }} />
        </div>
      </div>

      <div className="space-y-0.5">
        {lessons.map((l) => {
          if (l.status === "locked") return (
            <div key={l.num} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-not-allowed select-none">
              <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0">
                <svg width="8" height="9" viewBox="0 0 10 11" fill="none">
                  <rect x="1.5" y="5" width="7" height="5.5" rx="1" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                  <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                </svg>
              </div>
              <span className="text-[11px] text-white/20">L{l.num} · {l.title}</span>
            </div>
          );
          if (l.status === "available") return (
            <Link key={l.num} href={l.href} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/4 transition-colors group">
              <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:border-white/35 transition-colors">
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M2 4h4M4.5 2l2 2-2 2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[11px] text-white/38 group-hover:text-white/55 transition-colors">L{l.num} · {l.title}</span>
            </Link>
          );
          if (l.status === "done") return (
            <Link key={l.num} href={l.href} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/4 transition-colors">
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/35 flex items-center justify-center flex-shrink-0">
                <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[11px] text-white/50">L{l.num} · {l.title}</span>
            </Link>
          );
          return (
            <div key={l.num} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-secondary/15" style={{ background: "rgba(14,165,233,0.07)" }}>
              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span className="text-[11px] text-secondary font-semibold">L{l.num} · {l.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
