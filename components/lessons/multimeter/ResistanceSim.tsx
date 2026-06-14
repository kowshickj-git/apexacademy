"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onResistanceUsed: () => void;
}

// Color code hex values
const BAND_COLORS: Record<string, string> = {
  black: "#111111",
  brown: "#92400E",
  red: "#DC2626",
  orange: "#EA580C",
  yellow: "#CA8A04",
  green: "#16A34A",
  gold: "#D97706",
};

interface Resistor {
  label: string;
  display: string;
  bands: [string, string, string, string];
}

const resistors: Resistor[] = [
  { label: "220Ω", display: "220 Ω", bands: ["red", "red", "brown", "gold"] },
  { label: "1kΩ", display: "1.00 kΩ", bands: ["brown", "black", "red", "gold"] },
  { label: "10kΩ", display: "10.0 kΩ", bands: ["brown", "black", "orange", "gold"] },
  { label: "100kΩ", display: "100 kΩ", bands: ["brown", "black", "yellow", "gold"] },
  { label: "1MΩ", display: "1.00 MΩ", bands: ["brown", "black", "green", "gold"] },
];

function ResistorVisual({ bands }: { bands: [string, string, string, string] }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {/* Lead left */}
      <div className="w-6 h-0.5 bg-white/20" />
      {/* Body */}
      <div
        className="relative flex items-center h-5 rounded-md overflow-hidden"
        style={{ background: "#C4A876", width: 80 }}
      >
        {bands.map((color, i) => (
          <div
            key={i}
            className="absolute h-full"
            style={{
              background: BAND_COLORS[color] ?? "#888",
              width: 10,
              left: 8 + i * 16,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      {/* Lead right */}
      <div className="w-6 h-0.5 bg-white/20" />
    </div>
  );
}

export default function ResistanceSim({ onResistanceUsed }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [used, setUsed] = useState(false);

  const handleSelect = (label: string) => {
    setSelected(label);
    if (!used) {
      setUsed(true);
      onResistanceUsed();
    }
  };

  const selectedR = resistors.find((r) => r.label === selected);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 6 · Simulator 3
        </p>
        <h2 className="text-xl font-bold mb-1">Resistance Measurement Simulator</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Select a resistor to see how the multimeter reads it. Power must be OFF for resistance measurements.
        </p>

        {/* Resistor selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {resistors.map((r) => (
            <button
              key={r.label}
              onClick={() => handleSelect(r.label)}
              className="flex-1 min-w-[4.5rem] py-2.5 rounded-xl border text-xs font-bold transition-all"
              style={
                selected === r.label
                  ? { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.45)", color: "#10B981" }
                  : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Result panel */}
        <AnimatePresence mode="wait">
          {selectedR ? (
            <motion.div
              key={selectedR.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/8 p-5 mb-5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Resistor visual */}
                <div className="flex flex-col items-center gap-3">
                  <ResistorVisual bands={selectedR.bands} />
                  <div className="flex gap-1.5">
                    {selectedR.bands.map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-4 h-4 rounded-sm border border-white/10"
                          style={{ background: BAND_COLORS[color] ?? "#888" }}
                        />
                        <span className="text-[8px] text-white/30 capitalize font-mono">
                          {color.slice(0, 3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DMM reading */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-28 h-16 rounded-xl border-2 flex items-center justify-center font-mono font-black text-lg transition-all"
                    style={{
                      borderColor: "rgba(16,185,129,0.5)",
                      background: "rgba(16,185,129,0.08)",
                      color: "#10B981",
                      boxShadow: "0 0 14px rgba(16,185,129,0.15)",
                    }}
                  >
                    {selectedR.display}
                  </div>
                  <p className="text-[9px] text-white/30 font-mono">Multimeter reading</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/6 p-6 mb-5 text-center"
              style={{ background: "rgba(255,255,255,0.01)" }}
            >
              <p className="text-xs text-white/25">Select a resistor above to see the measurement</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key facts */}
        <div className="space-y-2">
          {[
            "Power MUST be OFF when measuring resistance",
            "Meter uses its own internal battery to push a tiny current through the resistor",
            "Unit: Ω (ohms), kΩ (kilohms = 1,000Ω), MΩ (megaohms = 1,000,000Ω)",
          ].map((fact, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-xl border border-white/6 p-3"
              style={{ background: "rgba(167,139,250,0.04)" }}
            >
              <span className="text-[10px] shrink-0 mt-0.5" style={{ color: "#A78BFA" }}>•</span>
              <p className="text-xs text-white/50 leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
