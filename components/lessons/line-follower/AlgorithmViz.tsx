"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Section, { AMBER, CYAN, GREEN, PURPLE, RED, Card } from "./Section";

export default function AlgorithmViz() {
  const [left, setLeft] = useState(false);   // true = sees BLACK
  const [right, setRight] = useState(false);

  const action = left && right ? "STOP" : left ? "TURN LEFT" : right ? "TURN RIGHT" : "FORWARD";
  const actionColor = action === "STOP" ? RED : action === "FORWARD" ? GREEN : AMBER;

  // active path through the tree
  const activeLeaf = left && right ? 3 : left && !right ? 1 : !left && right ? 2 : 0;

  const leaves = [
    { label: "MOVE FORWARD", cond: "L=WHITE · R=WHITE", color: GREEN, icon: "⬆", x: 70 },
    { label: "TURN LEFT", cond: "L=BLACK · R=WHITE", color: AMBER, icon: "⬅", x: 230 },
    { label: "TURN RIGHT", cond: "L=WHITE · R=BLACK", color: AMBER, icon: "➡", x: 390 },
    { label: "STOP", cond: "L=BLACK · R=BLACK", color: RED, icon: "⏹", x: 550 },
  ];

  const SensorToggle = ({ side, val, set }: { side: string; val: boolean; set: (v: boolean) => void }) => (
    <button onClick={() => set(!val)}
      className="flex-1 p-4 rounded-2xl border-2 transition-all text-center"
      style={val
        ? { borderColor: `${RED}77`, background: `${RED}12`, boxShadow: `0 0 24px ${RED}22` }
        : { borderColor: `${GREEN}55`, background: `${GREEN}0a` }}>
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5">{side} sensor</div>
      <div className="w-10 h-10 mx-auto rounded-full mb-2 border-2 flex items-center justify-center transition-colors"
        style={{ background: val ? "#000" : "#F8FAFC", borderColor: val ? RED : GREEN }}>
        <span className="text-base">👁️</span>
      </div>
      <div className="text-xs font-black" style={{ color: val ? "#FCA5A5" : "#6EE7B7" }}>
        {val ? "SEES BLACK" : "SEES WHITE"}
      </div>
      <div className="text-[9px] text-white/30 mt-1">tap to flip</div>
    </button>
  );

  return (
    <Section id="algorithm" num="08" title="Algorithm Visualizer"
      subtitle="Flip the sensors and watch the decision tree fire in real time. Four simple rules — that's the robot's entire mind." color={AMBER}>
      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        <div className="space-y-4">
          <div className="flex gap-3">
            <SensorToggle side="Left" val={left} set={setLeft} />
            <SensorToggle side="Right" val={right} set={setRight} />
          </div>
          <Card className="p-4 text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Robot response</div>
            <motion.div key={action} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-black mb-2" style={{ color: actionColor }}>
              {action}
            </motion.div>
            {/* mini robot */}
            <div className="relative h-24 rounded-xl overflow-hidden border border-white/8" style={{ background: "#0D0D13" }}>
              <div className="absolute left-1/2 top-0 bottom-0 w-5 -translate-x-1/2 bg-black" />
              <motion.div
                className="absolute left-1/2 top-1/2 w-12 h-14 -ml-6 -mt-7 rounded-xl border flex items-center justify-center text-lg"
                style={{ background: "#1C1C26", borderColor: "rgba(255,255,255,0.2)" }}
                animate={
                  action === "FORWARD" ? { y: [-4, -12, -4], rotate: 0 }
                    : action === "TURN LEFT" ? { rotate: -18, y: -8 }
                      : action === "TURN RIGHT" ? { rotate: 18, y: -8 }
                        : { rotate: 0, y: -8, opacity: [1, 0.55, 1] }
                }
                transition={action === "FORWARD" || action === "STOP" ? { duration: 1.2, repeat: Infinity } : { type: "spring", stiffness: 200, damping: 14 }}>
                🤖
              </motion.div>
            </div>
            <code className="block mt-3 text-[10px] font-mono p-2 rounded-lg text-left" style={{ background: "rgba(5,5,7,0.7)", color: actionColor }}>
              {left && right ? "if (L==BLACK && R==BLACK) stop();"
                : left ? "if (L==BLACK) turnLeft();"
                  : right ? "if (R==BLACK) turnRight();"
                    : "if (L==WHITE && R==WHITE) forward();"}
            </code>
          </Card>
        </div>

        {/* Decision tree */}
        <Card className="p-4 sm:p-6">
          <svg viewBox="0 0 620 330" className="w-full">
            {/* root */}
            <rect x="235" y="14" width="150" height="42" rx="12" fill={`${CYAN}14`} stroke={`${CYAN}88`} strokeWidth="1.5" />
            <text x="310" y="32" textAnchor="middle" fontSize="11" fontWeight="900" fill={CYAN}>READ SENSORS</text>
            <text x="310" y="47" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="rgba(255,255,255,0.4)">
              L={left ? "BLACK" : "white"} · R={right ? "BLACK" : "white"}
            </text>

            {/* decision node */}
            <g>
              <polygon points="310,86 400,131 310,176 220,131" fill={`${PURPLE}12`} stroke={`${PURPLE}77`} strokeWidth="1.5" />
              <text x="310" y="126" textAnchor="middle" fontSize="10" fontWeight="900" fill={PURPLE}>WHICH SENSORS</text>
              <text x="310" y="140" textAnchor="middle" fontSize="10" fontWeight="900" fill={PURPLE}>SEE BLACK?</text>
            </g>
            <line x1="310" y1="56" x2="310" y2="86" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

            {/* branches */}
            {leaves.map((leaf, i) => {
              const active = activeLeaf === i;
              const startX = i === 0 ? 245 : i === 1 ? 280 : i === 2 ? 340 : 375;
              const startY = i === 0 || i === 3 ? 131 : 160;
              const path = `M${startX},${startY} C ${leaf.x + 55},${200} ${leaf.x + 55},${210} ${leaf.x + 55},${238}`;
              return (
                <g key={leaf.label}>
                  <path d={path} fill="none" stroke={active ? leaf.color : "rgba(255,255,255,0.12)"} strokeWidth={active ? 2.5 : 1.5} />
                  {active && (
                    <circle r="4" fill={leaf.color}>
                      <animateMotion dur="0.9s" repeatCount="indefinite" path={path} />
                    </circle>
                  )}
                  <motion.g animate={{ opacity: active ? 1 : 0.35, scale: active ? 1.04 : 1 }} style={{ originX: `${leaf.x + 55}px`, originY: "265px" }}>
                    <rect x={leaf.x} y="238" width="110" height="56" rx="12"
                      fill={active ? `${leaf.color}16` : "rgba(255,255,255,0.02)"}
                      stroke={active ? leaf.color : "rgba(255,255,255,0.14)"} strokeWidth={active ? 2 : 1.2} />
                    <text x={leaf.x + 55} y="262" textAnchor="middle" fontSize="11" fontWeight="900" fill={active ? leaf.color : "rgba(255,255,255,0.5)"}>
                      {leaf.icon} {leaf.label}
                    </text>
                    <text x={leaf.x + 55} y="280" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="rgba(255,255,255,0.35)">
                      {leaf.cond}
                    </text>
                  </motion.g>
                  {active && (
                    <motion.rect x={leaf.x} y="238" width="110" height="56" rx="12" fill="none" stroke={leaf.color} strokeWidth="1"
                      animate={{ opacity: [0.8, 0.1, 0.8] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  )}
                </g>
              );
            })}

            <text x="310" y="322" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">
              evaluated ~1000× per second · only one branch fires each cycle
            </text>
          </svg>
        </Card>
      </div>
    </Section>
  );
}
