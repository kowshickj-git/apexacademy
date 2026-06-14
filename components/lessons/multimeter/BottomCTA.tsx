"use client";

import Link from "next/link";

export default function BottomCTA() {
  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-2xl">
        {/* Next lesson card — coming soon */}
        <div
          className="rounded-2xl border border-white/8 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="text-3xl">🔗</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-white/40 font-mono uppercase">Next Lesson</p>
              <span
                className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA" }}
              >
                COMING SOON
              </span>
            </div>
            <p className="text-base font-bold text-white/60">Series Circuits Fundamentals</p>
            <p className="text-xs text-white/30 mt-1">
              Learn how components in series share current and divide voltage.
            </p>
          </div>
          <div
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Coming Soon
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/electronics/breadboards"
            className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Breadboards
          </Link>

          <div
            className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-white/6 text-white/20 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            Series Circuits
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Back to Academy */}
        <div className="text-center">
          <Link
            href="/index.html"
            className="inline-flex items-center gap-2 text-xs text-white/25 hover:text-white/45 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 26 26" fill="none">
              <polygon points="13,2 24,22 2,22" fill="#10B981" />
            </svg>
            Back to APEX Academy
          </Link>
        </div>
      </div>
    </section>
  );
}
