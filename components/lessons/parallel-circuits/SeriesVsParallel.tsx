"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rows = [
  {
    label: "Current paths",
    series: "One path only",
    parallel: "Multiple paths",
    explanation:
      "In series, all current must travel the same single loop. In parallel, current splits at each junction and travels multiple routes simultaneously.",
  },
  {
    label: "Current flow",
    series: "Same everywhere",
    parallel: "Splits between branches",
    explanation:
      "Series: I is identical at every point in the circuit. Parallel: I_total splits — each branch carries only its share based on its resistance (I = V/R).",
  },
  {
    label: "Voltage",
    series: "Divides across components",
    parallel: "Same across all branches",
    explanation:
      "Series: Voltage drops add up to V_supply (V₁+V₂+V₃=V_s). Parallel: Every branch receives the FULL supply voltage. This is why home outlets are parallel!",
  },
  {
    label: "Resistance formula",
    series: "R_total = R₁+R₂+R₃",
    parallel: "1/R_eq = 1/R₁+1/R₂+1/R₃",
    explanation:
      "Series resistances simply add. Parallel uses the reciprocal formula — adding branches adds conductance, REDUCING total resistance below any individual branch.",
  },
  {
    label: "R_total vs components",
    series: "Greater than largest R",
    parallel: "Less than smallest R",
    explanation:
      "Series R_total grows with each component. Parallel R_eq SHRINKS with each branch — more paths means easier for current to flow overall.",
  },
  {
    label: "One component fails",
    series: "Entire circuit stops",
    parallel: "Only that branch stops",
    explanation:
      "Series failure is catastrophic — one break stops all current. Parallel failure is isolated — the broken branch goes dark but all others continue normally.",
  },
  {
    label: "Real example",
    series: "Old Christmas lights",
    parallel: "Home wiring",
    explanation:
      "Old Christmas lights were series — one bulb blew and the whole string went dark! Home wiring is parallel — one appliance breaking doesn't affect your other outlets.",
  },
];

export default function SeriesVsParallel() {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6366F1" }}>
            Comparison
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Series vs. Parallel</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Click any row to see a detailed explanation of the difference.
        </p>

        <div
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* Table header */}
          <div className="grid grid-cols-3 border-b border-white/8">
            <div className="p-3 text-xs font-bold text-white/40 uppercase tracking-wider">Property</div>
            <div
              className="p-3 text-xs font-bold uppercase tracking-wider text-center border-l border-white/5"
              style={{ color: "#F97316", background: "rgba(249,115,22,0.05)" }}
            >
              Series
            </div>
            <div
              className="p-3 text-xs font-bold uppercase tracking-wider text-center border-l border-white/5"
              style={{ color: "#6366F1", background: "rgba(99,102,241,0.05)" }}
            >
              Parallel
            </div>
          </div>

          {/* Table rows */}
          {rows.map((row, i) => {
            const isActive = activeRow === i;
            return (
              <div key={i}>
                <button
                  className="w-full grid grid-cols-3 border-b border-white/5 transition-all text-left hover:bg-white/3"
                  style={{
                    background: isActive ? "rgba(99,102,241,0.08)" : undefined,
                  }}
                  onClick={() => setActiveRow(isActive ? null : i)}
                >
                  <div className="p-3 text-xs text-white/60 font-medium">{row.label}</div>
                  <div
                    className="p-3 text-xs text-center border-l border-white/5 font-mono"
                    style={{ color: isActive ? "#FB923C" : "rgba(249,115,22,0.7)" }}
                  >
                    {row.series}
                  </div>
                  <div
                    className="p-3 text-xs text-center border-l border-white/5 font-mono"
                    style={{ color: isActive ? "#818CF8" : "rgba(99,102,241,0.8)" }}
                  >
                    {row.parallel}
                  </div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 py-3 border-b border-white/5"
                        style={{ background: "rgba(99,102,241,0.07)" }}
                      >
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.65)" }}>
                          {row.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center mt-3" style={{ color: "rgba(240,240,245,0.3)" }}>
          Click any row to expand its explanation
        </p>
      </motion.div>
    </section>
  );
}
