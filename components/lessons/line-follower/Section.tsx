"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export const AMBER = "#F59E0B";
export const CYAN = "#22D3EE";
export const GREEN = "#10B981";
export const RED = "#EF4444";
export const PURPLE = "#A78BFA";

export function glass(color = "255,255,255", alpha = 0.03): React.CSSProperties {
  return {
    background: `rgba(${color},${alpha})`,
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  };
}

interface SectionProps {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  color?: string;
  children: ReactNode;
  wide?: boolean;
}

export default function Section({ id, num, title, subtitle, color = AMBER, children, wide }: SectionProps) {
  return (
    <section id={id} className={`px-4 sm:px-8 py-14 sm:py-20 mx-auto ${wide ? "max-w-7xl" : "max-w-5xl"}`}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full border"
            style={{ color, borderColor: `${color}44`, background: `${color}11` }}
          >
            SECTION {num}
          </span>
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}33, transparent)` }} />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">{title}</h2>
        <p className="text-white/40 text-sm sm:text-base max-w-2xl mb-8">{subtitle}</p>
        {children}
      </motion.div>
    </section>
  );
}

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl border border-white/8 ${className}`}
      style={{ ...glass(), ...style }}
    >
      {children}
    </div>
  );
}

export function StatChip({ label, value, color = AMBER }: { label: string; value: string; color?: string }) {
  return (
    <div className="px-3 py-2 rounded-xl border border-white/8 text-center min-w-[86px]" style={glass()}>
      <div className="text-sm sm:text-base font-black tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-white/35 mt-0.5">{label}</div>
    </div>
  );
}
