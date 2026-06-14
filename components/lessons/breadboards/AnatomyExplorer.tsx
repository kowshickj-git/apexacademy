"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onAnatomyUsed: () => void;
}

type PartKey =
  | "topPosRail"
  | "topNegRail"
  | "leftStrip"
  | "centerGap"
  | "rightStrip"
  | "botNegRail"
  | "botPosRail";

interface PartInfo {
  label: string;
  color: string;
  desc: string;
}

const partInfo: Record<PartKey, PartInfo> = {
  topPosRail: {
    label: "Power Rail (+)",
    color: "#EF4444",
    desc: "Red stripe running the full length of the board. ALL holes in this rail are electrically connected to each other. Connect your battery or power supply positive (+) terminal here. Distributes power to your entire circuit.",
  },
  topNegRail: {
    label: "Power Rail (−)",
    color: "#3B82F6",
    desc: "Blue stripe running the full length. ALL holes connected. Connect battery negative (ground/GND) here. Completes the circuit — current returns here after flowing through your components.",
  },
  leftStrip: {
    label: "Terminal Strip (Left)",
    color: "#6B7280",
    desc: "Columns A–E. Holes in the SAME ROW are internally connected (e.g., A1, B1, C1, D1, E1 all share one electrical node). Place components here. Each row is a separate node.",
  },
  centerGap: {
    label: "Center Gap",
    color: "#1F2937",
    desc: "~7.6mm (0.3\") gap in the middle of the board. This separates left columns (A–E) from right columns (F–J). DIP ICs (chips) sit across this gap — pins go into rows on each side, keeping each pin isolated.",
  },
  rightStrip: {
    label: "Terminal Strip (Right)",
    color: "#6B7280",
    desc: "Columns F–J. Same rule as left: holes in same row are connected (F1, G1, H1, I1, J1 share one node). Completely SEPARATE from the left strip — the center gap breaks the connection.",
  },
  botNegRail: {
    label: "Power Rail (−) Bottom",
    color: "#3B82F6",
    desc: "Second ground rail at the bottom of the board. Connected the same way as the top − rail. Useful for longer boards or when you need ground access on both sides of your circuit.",
  },
  botPosRail: {
    label: "Power Rail (+) Bottom",
    color: "#EF4444",
    desc: "Second positive power rail at the bottom. Mirror of the top + rail. On most breadboards, the top and bottom power rails are NOT connected to each other by default — you may need a jumper wire to link them.",
  },
};

interface Region {
  key: PartKey;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  labelColor: string;
  fill: string;
  hoverFill: string;
}

const regions: Region[] = [
  { key: "topPosRail",  x: 0,   y: 0,   w: 400, h: 24,  label: "+",           labelColor: "#FECACA", fill: "rgba(239,68,68,0.25)",   hoverFill: "rgba(239,68,68,0.5)" },
  { key: "topNegRail",  x: 0,   y: 24,  w: 400, h: 24,  label: "−",           labelColor: "#BFDBFE", fill: "rgba(59,130,246,0.25)",  hoverFill: "rgba(59,130,246,0.5)" },
  { key: "leftStrip",   x: 0,   y: 52,  w: 182, h: 96,  label: "A–E",         labelColor: "#D1D5DB", fill: "rgba(107,114,128,0.2)",  hoverFill: "rgba(107,114,128,0.45)" },
  { key: "centerGap",   x: 182, y: 52,  w: 36,  h: 96,  label: "GAP",         labelColor: "#6B7280", fill: "rgba(0,0,0,0.4)",        hoverFill: "rgba(20,184,166,0.25)" },
  { key: "rightStrip",  x: 218, y: 52,  w: 182, h: 96,  label: "F–J",         labelColor: "#D1D5DB", fill: "rgba(107,114,128,0.2)",  hoverFill: "rgba(107,114,128,0.45)" },
  { key: "botNegRail",  x: 0,   y: 152, w: 400, h: 24,  label: "−",           labelColor: "#BFDBFE", fill: "rgba(59,130,246,0.25)",  hoverFill: "rgba(59,130,246,0.5)" },
  { key: "botPosRail",  x: 0,   y: 176, w: 400, h: 24,  label: "+",           labelColor: "#FECACA", fill: "rgba(239,68,68,0.25)",   hoverFill: "rgba(239,68,68,0.5)" },
];

export default function AnatomyExplorer({ onAnatomyUsed }: Props) {
  const [selectedPart, setSelectedPart] = useState<PartKey | null>(null);
  const [used, setUsed] = useState(false);

  const handleClick = (key: PartKey) => {
    setSelectedPart(key);
    if (!used) {
      setUsed(true);
      onAnatomyUsed();
    }
  };

  const info = selectedPart ? partInfo[selectedPart] : null;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 2 · Simulator 1
        </p>
        <h2 className="text-xl font-bold mb-1">Anatomy Explorer</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Click any part of the breadboard diagram to learn what it does and how it connects.
        </p>

        {/* SVG breadboard diagram */}
        <div
          className="rounded-2xl border border-white/8 p-4 mb-5 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* Column labels */}
          <div className="flex justify-between px-1 mb-1 text-[8px] font-mono text-white/20 select-none">
            <span style={{ marginLeft: "2px" }}>+</span>
            <span style={{ marginLeft: "2px" }}>−</span>
            <span className="ml-auto" style={{ marginRight: "180px" }}>A B C D E</span>
            <span style={{ marginLeft: "10px" }}>F G H I J</span>
            <span>−</span>
            <span>+</span>
          </div>

          <svg
            viewBox="0 0 400 200"
            className="w-full"
            style={{ maxHeight: 220 }}
          >
            {/* Background */}
            <rect x="0" y="0" width="400" height="200" fill="rgba(10,12,18,0.8)" rx="8" />

            {/* Hole dots pattern for terminal strips */}
            {[0,1,2,3,4,5,6,7,8,9].map((row) =>
              ["A","B","C","D","E"].map((col, ci) => (
                <circle
                  key={`L${row}${col}`}
                  cx={18 + ci * 32}
                  cy={62 + row * 8.5}
                  r="2"
                  fill="rgba(255,255,255,0.08)"
                />
              ))
            )}
            {[0,1,2,3,4,5,6,7,8,9].map((row) =>
              ["F","G","H","I","J"].map((col, ci) => (
                <circle
                  key={`R${row}${col}`}
                  cx={222 + ci * 32}
                  cy={62 + row * 8.5}
                  r="2"
                  fill="rgba(255,255,255,0.08)"
                />
              ))
            )}

            {/* Power rail dots */}
            {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
              <g key={`pr${i}`}>
                <circle cx={10 + i * 34} cy={8}  r="2" fill="rgba(239,68,68,0.35)" />
                <circle cx={10 + i * 34} cy={34} r="2" fill="rgba(59,130,246,0.35)" />
                <circle cx={10 + i * 34} cy={162} r="2" fill="rgba(59,130,246,0.35)" />
                <circle cx={10 + i * 34} cy={188} r="2" fill="rgba(239,68,68,0.35)" />
              </g>
            ))}

            {/* Clickable regions */}
            {regions.map((r) => (
              <g key={r.key}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill={selectedPart === r.key ? r.hoverFill : r.fill}
                  rx={r.key === "centerGap" ? 2 : 4}
                  className="cursor-pointer transition-all"
                  style={{ outline: "none" }}
                  onClick={() => handleClick(r.key)}
                />
                {selectedPart === r.key && (
                  <rect
                    x={r.x + 1}
                    y={r.y + 1}
                    width={r.w - 2}
                    height={r.h - 2}
                    fill="none"
                    stroke={partInfo[r.key].color}
                    strokeWidth="1.5"
                    rx={r.key === "centerGap" ? 1 : 3}
                  />
                )}
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={selectedPart === r.key ? r.labelColor : "rgba(255,255,255,0.25)"}
                  fontSize={r.h < 30 ? "9" : "11"}
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {r.label}
                </text>
              </g>
            ))}

            {/* Row numbers */}
            {[1,3,5,7,10].map((n, i) => (
              <text
                key={`rn${n}`}
                x="196"
                y={62 + i * 17}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.15)"
                fontSize="7"
                fontFamily="monospace"
                className="pointer-events-none select-none"
              >
                {n}
              </text>
            ))}
          </svg>
        </div>

        {/* Description panel */}
        <AnimatePresence mode="wait">
          {info ? (
            <motion.div
              key={selectedPart}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl border"
              style={{
                borderColor: `${info.color}40`,
                background: `${info.color}0D`,
              }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: info.color }}>
                {info.label}
              </p>
              <p className="text-xs text-white/55 leading-relaxed">{info.desc}</p>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl border border-white/8 text-center"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-xs text-white/30">
                Click any part of the breadboard to learn about it
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
