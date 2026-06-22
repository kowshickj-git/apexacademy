"use client";
// Root of the Circuit Lab: four-zone layout + global interactions.
// Toolbar (top) · Library (left) · Workspace (center) · Properties (right) · Console (bottom).

import { useEffect, useState } from "react";
import { actions, getState } from "@/lib/simulator/store";
import Workspace from "./Workspace";
import { Toolbar, Library, Properties, Console } from "./Panels";

export default function CircuitLab() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  // Keyboard shortcuts (ignored while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      const s = getState();
      if ((e.key === "Delete" || e.key === "Backspace") && s.selectedId) {
        e.preventDefault();
        actions.deletePart(s.selectedId);
      } else if (e.key === "Escape") {
        actions.cancelWire();
        actions.selectPart(null);
        setLeftOpen(false);
        setRightOpen(false);
      } else if ((e.key === "r" || e.key === "R") && s.selectedId) {
        actions.rotatePart(s.selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-[#050507] text-white select-none">
      <Toolbar />

      <div className="flex flex-1 min-h-0 relative">
        {/* Left: component library (slide-over on small screens) */}
        <div
          className={`absolute lg:static z-30 h-full transition-transform duration-200 lg:translate-x-0 ${leftOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Library />
        </div>

        {/* Center: workspace */}
        <div className="flex-1 min-w-0 relative">
          <Workspace />

          {/* Back to site */}
          <a
            href="/index.html"
            className="absolute top-3 left-3 z-10 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-black/50 backdrop-blur text-white/70 hover:text-white border border-white/10"
          >
            ← APEX
          </a>

          {/* Mobile panel toggles */}
          <button
            onClick={() => setLeftOpen((v) => !v)}
            className="lg:hidden absolute bottom-3 left-3 z-20 px-3 py-2 rounded-lg text-xs font-bold bg-primary/20 text-primary border border-primary/40 backdrop-blur"
          >
            Parts
          </button>
          <button
            onClick={() => setRightOpen((v) => !v)}
            className="lg:hidden absolute bottom-3 right-3 z-20 px-3 py-2 rounded-lg text-xs font-bold bg-secondary/20 text-secondary border border-secondary/40 backdrop-blur"
          >
            Edit
          </button>
        </div>

        {/* Right: properties (slide-over on small screens) */}
        <div
          className={`absolute right-0 lg:static z-30 h-full transition-transform duration-200 lg:translate-x-0 ${rightOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <Properties />
        </div>
      </div>

      <Console />
    </div>
  );
}
