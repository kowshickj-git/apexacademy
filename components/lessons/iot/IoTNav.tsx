"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const COLOR = "#6366F1";

interface Props {
  xp: number;
  onMenuClick?: () => void;
}

export default function IoTNav({ xp, onMenuClick }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-3"
      style={{
        background: "rgba(5,5,7,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon points="14,3 25,22 3,22" fill={COLOR} opacity="0.9" />
          <polygon points="14,8 21,20 7,20" fill="#050507" opacity="0.6" />
        </svg>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
        <span style={{ color: "rgba(255,255,255,0.35)" }} className="hidden sm:inline">
          Embedded Systems
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)" }} className="hidden sm:inline">
          /
        </span>
        <span style={{ color: "rgba(255,255,255,0.85)" }} className="font-medium truncate">
          IoT Fundamentals
        </span>
      </div>

      {/* L28 Badge */}
      <div
        className="shrink-0 px-2 py-0.5 rounded text-xs font-bold"
        style={{ background: `rgba(99,102,241,0.2)`, color: COLOR, border: `1px solid rgba(99,102,241,0.3)` }}
      >
        L28 of 36
      </div>

      {/* XP Badge */}
      <div
        className="shrink-0 px-2 py-0.5 rounded text-xs font-bold"
        style={{ background: `rgba(99,102,241,0.15)`, color: COLOR }}
      >
        {xp} XP
      </div>

      {/* Navigation Links */}
      <Link
        href="/electronics/rs485"
        className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
        style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)" }}
      >
        ← RS485
      </Link>
      <Link
        href="/electronics/esp32"
        className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all"
        style={{ background: COLOR, color: "#fff" }}
      >
        ESP32 →
      </Link>

      {/* Hamburger */}
      <button onClick={onMenuClick} className="ml-1 p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors" aria-label="Open course menu">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/></svg>
      </button>

      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, ${COLOR}, #818cf8)`,
        }}
      />
    </nav>
  );
}
