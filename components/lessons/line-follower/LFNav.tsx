"use client";
import Link from "next/link";
import { AMBER } from "./Section";

const JUMPS: [string, string][] = [
  ["hero", "Top"],
  ["what-is", "Learn"],
  ["components", "Parts"],
  ["build", "Build"],
  ["wiring", "Wire"],
  ["code-lab", "Code"],
  ["arena", "Simulate"],
  ["challenges", "Challenges"],
  ["certificate", "Certify"],
];

export default function LFNav({ xp, progress }: { xp: number; progress: number }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/8"
      style={{ background: "rgba(5,5,7,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: `${AMBER}1a`, border: `1px solid ${AMBER}44`, color: AMBER }}>
            A
          </span>
          <span className="text-sm font-black text-white hidden sm:block">
            APEX <span style={{ color: AMBER }}>· Line Follower Lab</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {JUMPS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-widest text-white/30">Mission progress</span>
            <div className="w-28 h-1.5 rounded-full bg-white/8 mt-1 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${AMBER}, #22D3EE)` }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ borderColor: `${AMBER}44`, background: `${AMBER}11` }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill={AMBER}>
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            <span className="text-xs font-black tabular-nums" style={{ color: AMBER }}>{xp} XP</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
