"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const concepts = [
  {
    title: "Floating",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    desc: "Pin voltage is undefined — drifts randomly from electrical noise.",
    icon: "?",
  },
  {
    title: "Pull-Up",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
    desc: "Defaults HIGH. When button pressed → LOW. Logic is inverted.",
    icon: "H",
  },
  {
    title: "Pull-Down",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
    desc: "Defaults LOW. When button pressed → HIGH. Logic is normal.",
    icon: "L",
  },
];

type CoinPhase = "spinning" | "pullup" | "pulldown";

export default function BigIdea() {
  const [phase, setPhase] = useState<CoinPhase>("spinning");
  const [randomSide, setRandomSide] = useState(0);

  // Randomly flip the spinning coin label
  useEffect(() => {
    if (phase !== "spinning") return;
    const iv = setInterval(() => setRandomSide(s => (s === 0 ? 1 : 0)), 300);
    return () => clearInterval(iv);
  }, [phase]);

  // Auto-advance demo
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("pullup"), 3000);
    const t2 = setTimeout(() => setPhase("pulldown"), 6000);
    const t3 = setTimeout(() => setPhase("spinning"), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-4 font-mono">
          The Big Idea
        </p>

        {/* Coin toss visualization */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="relative flex flex-col items-center mb-4">
            {/* Coin */}
            <AnimatePresence mode="wait">
              {phase === "spinning" && (
                <motion.div
                  key="spinning"
                  initial={{ rotateY: 0, y: -40, opacity: 0 }}
                  animate={{ rotateY: 720, y: 0, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ rotateY: { duration: 0.6, repeat: Infinity, ease: "linear" }, y: { duration: 0.4 }, opacity: { duration: 0.3 } }}
                  className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center shadow-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))" }}
                >
                  <span className="text-2xl font-black text-white/60">{randomSide === 0 ? "H" : "T"}</span>
                </motion.div>
              )}
              {phase === "pullup" && (
                <motion.div
                  key="pullup"
                  initial={{ y: -30, opacity: 0, rotateZ: -15 }}
                  animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 14 }}
                  className="w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1))", borderColor: "#10B981" }}
                >
                  <span className="text-2xl font-black" style={{ color: "#10B981" }}>H</span>
                </motion.div>
              )}
              {phase === "pulldown" && (
                <motion.div
                  key="pulldown"
                  initial={{ y: -20, opacity: 0, rotateZ: 10 }}
                  animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 14 }}
                  className="w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))", borderColor: "#3B82F6" }}
                >
                  <span className="text-2xl font-black" style={{ color: "#3B82F6" }}>L</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Table surface */}
            <div
              className="w-32 h-1.5 rounded-full mt-3"
              style={{ background: phase === "spinning" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)" }}
            />
          </div>

          {/* Caption */}
          <AnimatePresence mode="wait">
            {phase === "spinning" && (
              <motion.p key="cap-spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-center text-white/50 max-w-xs">
                <span className="text-red-400 font-bold">Floating Pin</span> = Coin in the air — could land heads <span className="font-mono text-white/70">HIGH</span> or tails <span className="font-mono text-white/70">LOW</span>. Unpredictable.
              </motion.p>
            )}
            {phase === "pullup" && (
              <motion.p key="cap-up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-center text-white/50 max-w-xs">
                <span className="font-bold" style={{ color: "#10B981" }}>Pull-Up</span>: Coin always lands{" "}
                <span className="font-mono font-bold" style={{ color: "#10B981" }}>HIGH</span> — guaranteed default.
              </motion.p>
            )}
            {phase === "pulldown" && (
              <motion.p key="cap-down" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-center text-white/50 max-w-xs">
                <span className="font-bold" style={{ color: "#3B82F6" }}>Pull-Down</span>: Coin always lands{" "}
                <span className="font-mono font-bold" style={{ color: "#3B82F6" }}>LOW</span> — guaranteed default.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Phase dots */}
          <div className="flex gap-2 mt-4">
            {(["spinning", "pullup", "pulldown"] as CoinPhase[]).map(p => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: phase === p ? "#F59E0B" : "rgba(255,255,255,0.15)" }}
              />
            ))}
          </div>
        </div>

        {/* Concept cards */}
        <div className="grid sm:grid-cols-3 gap-3">
          {concepts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-4 rounded-2xl border"
              style={{ background: c.bg, borderColor: c.border }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black mb-3"
                style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
              >
                {c.icon}
              </div>
              <h3 className="text-sm font-bold mb-1" style={{ color: c.color }}>{c.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
