"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const types = [
  {
    id: "stepdown",
    label: "Step-Down",
    icon: "⬇",
    ratio: "N_p > N_s",
    example: "12:1 (240V → 20V)",
    apps: ["Phone charger", "Wall adapter", "DC power supply"],
    color: "#8B5CF6",
    colorAlpha: "rgba(139,92,246,",
    desc: "Primary has MORE turns than secondary. Voltage decreases, current increases. The most common transformer in everyday electronics.",
    svgPrimary: 9,
    svgSecondary: 3,
  },
  {
    id: "stepup",
    label: "Step-Up",
    icon: "⬆",
    ratio: "N_s > N_p",
    example: "1:400 (1kV → 400kV)",
    apps: ["Power grid transmission", "CRT TV flyback", "Tesla coil"],
    color: "#F59E0B",
    colorAlpha: "rgba(245,158,11,",
    desc: "Secondary has MORE turns than primary. Voltage increases, current decreases. Used to boost voltage for long-distance power transmission.",
    svgPrimary: 3,
    svgSecondary: 9,
  },
  {
    id: "isolation",
    label: "Isolation",
    icon: "🛡",
    ratio: "N_p = N_s (1:1)",
    example: "1:1 (230V → 230V)",
    apps: ["Medical equipment", "Oscilloscope probes", "Safety isolation"],
    color: "#10B981",
    colorAlpha: "rgba(16,185,129,",
    desc: "Equal turns on both sides. Same voltage in and out. Purpose: break the electrical connection to earth ground for safety. Used where shock hazard must be eliminated.",
    svgPrimary: 6,
    svgSecondary: 6,
  },
  {
    id: "auto",
    label: "Auto-transformer",
    icon: "🔄",
    ratio: "Single winding, tapped",
    example: "Variable (Variac 0-270V)",
    apps: ["Variable voltage (Variac)", "Motor starter", "Audio amplifier output"],
    color: "#0EA5E9",
    colorAlpha: "rgba(14,165,233,",
    desc: "Uses a SINGLE winding with a moveable tap. More efficient than two-winding transformers but no electrical isolation. The Variac laboratory power supply uses this design.",
    svgPrimary: 8,
    svgSecondary: 5,
  },
];

function CoilSVG({ primary, secondary, color }: { primary: number; secondary: number; color: string }) {
  return (
    <svg width="180" height="80" viewBox="0 0 180 80">
      {/* Core */}
      <rect x="84" y="10" width="12" height="60" rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="0.5" strokeOpacity="0.4" />

      {/* Primary coil loops */}
      {Array.from({ length: primary }).map((_, i) => (
        <ellipse
          key={`p${i}`}
          cx={75 - i * (55 / primary)}
          cy={40}
          rx={4}
          ry={16}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.7"
        />
      ))}

      {/* Primary label */}
      <text x="22" y="76" fill={color} fontSize="8" opacity="0.6" textAnchor="middle">Np={primary}</text>

      {/* Secondary coil loops */}
      {Array.from({ length: secondary }).map((_, i) => (
        <ellipse
          key={`s${i}`}
          cx={105 + i * (55 / secondary)}
          cy={40}
          rx={4}
          ry={16}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.55"
        />
      ))}

      {/* Secondary label */}
      <text x="158" y="76" fill={color} fontSize="8" opacity="0.6" textAnchor="middle">Ns={secondary}</text>

      {/* Wire lines */}
      <line x1="4" y1="40" x2="20" y2="40" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="160" y1="40" x2="176" y2="40" stroke={color} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

export default function CoreExplorer() {
  const [selected, setSelected] = useState(0);
  const t = types[selected];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 3 · Explorer
        </p>
        <h2 className="text-xl font-bold mb-1">Transformer Types</h2>
        <p className="text-white/45 text-sm mb-5">
          Click each type to explore the design, turns ratio, and applications.
        </p>

        {/* Type selector tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {types.map((tp, i) => (
            <button
              key={tp.id}
              onClick={() => setSelected(i)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all"
              style={{
                background: selected === i ? `${tp.colorAlpha}0.12)` : "rgba(255,255,255,0.03)",
                borderColor: selected === i ? `${tp.colorAlpha}0.35)` : "rgba(255,255,255,0.08)",
                color: selected === i ? tp.color : "rgba(255,255,255,0.4)",
              }}
            >
              <span>{tp.icon}</span>
              {tp.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border p-5"
            style={{ borderColor: `${t.colorAlpha}0.25)`, background: `${t.colorAlpha}0.05)` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <h3 className="font-bold text-white/85">{t.label} Transformer</h3>
                <p className="text-xs font-mono" style={{ color: t.color }}>{t.ratio}</p>
              </div>
            </div>

            {/* SVG Diagram */}
            <div
              className="rounded-xl mb-4 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.3)", padding: "12px" }}
            >
              <CoilSVG primary={t.svgPrimary} secondary={t.svgSecondary} color={t.color} />
            </div>

            <p className="text-sm text-white/55 leading-relaxed mb-3">{t.desc}</p>

            <div className="flex gap-4 mb-3">
              <div>
                <p className="text-[10px] text-white/25 uppercase font-mono tracking-wider mb-1">Example Ratio</p>
                <p className="text-xs font-mono" style={{ color: t.color }}>{t.example}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/25 uppercase font-mono tracking-wider mb-2">Applications</p>
              <div className="flex flex-wrap gap-2">
                {t.apps.map((app) => (
                  <span
                    key={app}
                    className="px-2.5 py-1 rounded-full text-[11px] border font-medium"
                    style={{ borderColor: `${t.colorAlpha}0.25)`, background: `${t.colorAlpha}0.08)`, color: t.color }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
