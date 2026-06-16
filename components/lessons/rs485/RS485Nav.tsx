"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props { xp: number; onMenuClick?: () => void; }

const COLOR = "#F59E0B";

export default function RS485Nav({ xp, onMenuClick }: Props) {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const f = () => {
      const el = document.documentElement;
      setScrollPct(
        el.scrollHeight - el.clientHeight > 0
          ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
          : 0
      );
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-3"
      style={{
        background: "rgba(5,5,7,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon points="14,3 25,22 3,22" fill={COLOR} opacity="0.9" />
          <polygon points="14,8 22,21 6,21" fill="#050507" />
          <polygon points="14,11 19,20 9,20" fill={COLOR} opacity="0.5" />
        </svg>
      </Link>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs min-w-0">
        <span style={{ color: "rgba(240,240,245,0.35)" }}>Embedded Systems</span>
        <span style={{ color: "rgba(240,240,245,0.2)" }}>/</span>
        <span className="font-semibold truncate" style={{ color: COLOR }}>RS485 Fundamentals</span>
      </div>

      {/* Lesson badge */}
      <span
        className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: "rgba(245,158,11,0.1)",
          color: "rgba(245,158,11,0.7)",
          border: "1px solid rgba(245,158,11,0.2)",
        }}
      >
        L27 of 36
      </span>

      <div className="flex-1" />

      {/* XP Badge */}
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black flex-shrink-0"
        style={{
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.22)",
          color: COLOR,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill={COLOR}>
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
        {xp} XP
      </div>

      {/* Back link */}
      <Link
        href="/electronics/can"
        className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors hover:bg-white/5"
        style={{ color: "rgba(240,240,245,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        ← CAN
      </Link>

      {/* Next link */}
      <Link
        href="/electronics/iot"
        className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
        style={{
          color: COLOR,
          border: `1px solid rgba(245,158,11,0.3)`,
          background: "rgba(245,158,11,0.07)",
        }}
      >
        IoT →
      </Link>

      {/* Hamburger */}
      <button onClick={onMenuClick} className="ml-1 p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors" aria-label="Open course menu">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/></svg>
      </button>

      {/* Scroll progress */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5"
        style={{ width: `${scrollPct}%`, background: `linear-gradient(90deg, ${COLOR}, #FCD34D)` }}
      />
    </nav>
  );
}
