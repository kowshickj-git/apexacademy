"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LessonNav() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
            <polygon points="13,2 24,22 2,22" fill="#10B981" />
            <polygon points="13,8 20,20 6,20" fill="#050507" />
            <polygon points="13,11 17,18 9,18" fill="#10B981" opacity="0.5" />
          </svg>
          <span className="text-sm font-bold text-white hidden xs:block">APEX Academy</span>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs min-w-0">
          <span className="text-white/30 truncate hidden sm:block">Electronics</span>
          <span className="text-white/20 hidden sm:block">/</span>
          <span className="text-primary font-medium truncate">Voltage</span>
        </div>

        {/* Next Lesson button */}
        <Link
          href="#"
          className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all"
        >
          Next
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary origin-left"
          style={{ scaleX: scrollProgress / 100, transformOrigin: "left" }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </header>
  );
}
