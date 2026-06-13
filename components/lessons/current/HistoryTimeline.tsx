"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "1752",
    name: "Benjamin Franklin",
    role: "Inventor · Philadelphia",
    fact: "Flew a kite in a thunderstorm to prove lightning is electrical. First to show that electricity exists freely in nature.",
    color: "primary" as const,
  },
  {
    year: "1800",
    name: "Alessandro Volta",
    role: "Physicist · Italy",
    fact: "Invented the first electric battery — the Voltaic Pile. Made it possible to produce a continuous, steady flow of current.",
    color: "secondary" as const,
  },
  {
    year: "1820",
    name: "André-Marie Ampère",
    role: "Mathematician · France",
    fact: "Discovered that electric currents create magnetic fields. Founded electrodynamics. The unit of current — the Ampere — is named after him.",
    color: "primary" as const,
  },
  {
    year: "Today",
    name: "The Electric Age",
    role: "Modern World",
    fact: "Electric current powers every device around you — smartphones, laptops, electric vehicles, hospitals, and even spacecraft.",
    color: "secondary" as const,
  },
];

const scientists = [
  {
    initials: "BF",
    name: "Benjamin\nFranklin",
    years: "1706–1790",
    role: "Proved electricity exists in lightning",
    color: "primary" as const,
  },
  {
    initials: "AV",
    name: "Alessandro\nVolta",
    years: "1745–1827",
    role: "Invented the first battery",
    color: "secondary" as const,
  },
  {
    initials: "AA",
    name: "André-Marie\nAmpère",
    years: "1775–1836",
    role: "Discovered electrodynamics",
    color: "primary" as const,
  },
];

export default function HistoryTimeline() {
  return (
    <>
      {/* Section 4 — History */}
      <section className="px-4 py-6 max-w-2xl mx-auto">
        <div className="mb-5">
          <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#04</p>
          <h2 className="text-2xl font-bold text-white">A Little History</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="relative pl-8"
        >
          {/* Timeline spine */}
          <div
            className="absolute left-3 top-2 bottom-2 w-px"
            style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.3), rgba(14,165,233,0.2), rgba(255,255,255,0.04))" }}
          />

          <div className="space-y-4">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.38 }}
                className="flex gap-3"
              >
                {/* Dot */}
                <div
                  className="absolute -left-0.5 flex items-center justify-center"
                  style={{ marginTop: "1rem" }}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: item.color === "primary" ? "rgba(16,185,129,0.5)" : "rgba(14,165,233,0.5)",
                      background: item.color === "primary" ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color === "primary" ? "#10B981" : "#0EA5E9" }} />
                  </div>
                </div>

                {/* Card */}
                <div className="rounded-xl border border-white/5 p-4 w-full" style={{ background: "#18181B" }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        color: item.color === "primary" ? "#10B981" : "#0EA5E9",
                        background: item.color === "primary" ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)",
                        borderColor: item.color === "primary" ? "rgba(16,185,129,0.25)" : "rgba(14,165,233,0.25)",
                      }}
                    >
                      {item.year}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mb-0.5">{item.name}</p>
                  <p className="text-[10px] text-white/30 mb-2 font-mono">{item.role}</p>
                  <p className="text-xs text-white/52 leading-relaxed">{item.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 5 — Scientist Cards */}
      <section className="px-4 py-4 max-w-2xl mx-auto">
        <div className="mb-5">
          <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#05</p>
          <h2 className="text-2xl font-bold text-white">Meet the Scientists</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-3 gap-3">
            {scientists.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="rounded-xl border p-3 text-center"
                style={{
                  background: "#18181B",
                  borderColor: s.color === "primary" ? "rgba(16,185,129,0.15)" : "rgba(14,165,233,0.15)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full mx-auto mb-2.5 flex items-center justify-center text-sm font-extrabold"
                  style={{
                    background: s.color === "primary" ? "rgba(16,185,129,0.12)" : "rgba(14,165,233,0.12)",
                    color: s.color === "primary" ? "#10B981" : "#0EA5E9",
                  }}
                >
                  {s.initials}
                </div>
                <p
                  className="text-[11px] font-bold leading-tight whitespace-pre-line"
                  style={{ color: s.color === "primary" ? "#10B981" : "#0EA5E9" }}
                >
                  {s.name}
                </p>
                <p className="text-[9px] text-white/22 font-mono mt-0.5">{s.years}</p>
                <p className="text-[10px] text-white/42 mt-2 leading-tight">{s.role}</p>
              </motion.div>
            ))}
          </div>

          {/* Ampere unit callout */}
          <div
            className="rounded-xl border border-primary/20 p-4 flex gap-3 items-start"
            style={{ background: "rgba(16,185,129,0.05)" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-xl font-extrabold text-primary"
              style={{ background: "rgba(16,185,129,0.12)" }}
            >
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Current is measured in <span className="text-primary">Amperes (A)</span>
              </p>
              <p className="text-xs text-white/42 mt-0.5 leading-relaxed">
                Named after André-Marie Ampère, who founded the science of electrodynamics in 1820.
                1 Ampere = 1 coulomb of charge flowing per second.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
