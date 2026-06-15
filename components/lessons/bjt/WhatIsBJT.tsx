"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const FACTS = [
  {
    term: "Bipolar",
    def: "Uses BOTH holes and electrons for conduction — unlike FETs which use only one carrier type.",
    color: "#EF4444",
    icon: "⊕⊖",
  },
  {
    term: "Junction",
    def: "Has TWO p-n junctions: Base-Emitter junction (BE) and Base-Collector junction (BC).",
    color: "#F87171",
    icon: "⊔⊔",
  },
  {
    term: "Transistor",
    def: "Transfer + Resistor. Transfers a signal from low-resistance input to high-resistance output.",
    color: "#FCA5A5",
    icon: "T",
  },
];

const TERMINALS = [
  {
    name: "Base (B)",
    role: "Control terminal. Small current input here controls everything.",
    color: "#EF4444",
    symbol: "B",
  },
  {
    name: "Collector (C)",
    role: "Main current inlet. Large current flows IN through here (NPN).",
    color: "#10B981",
    symbol: "C",
  },
  {
    name: "Emitter (E)",
    role: "Current output. ALL current (I_C + I_B) flows OUT here (NPN).",
    color: "#0EA5E9",
    symbol: "E",
  },
];

export default function WhatIsBJT() {
  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Section header */}
        <div className="mb-6">
          <div
            className="inline-block px-2 py-1 rounded-lg text-xs font-mono font-bold mb-2"
            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            FUNDAMENTALS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            What Is a BJT?
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Bipolar Junction Transistor — the fundamental building block of analog electronics.
          </p>
        </div>

        {/* BJT meaning breakdown */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {FACTS.map((f, i) => (
            <motion.div
              key={f.term}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${f.color}20` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black mb-2"
                style={{ background: `${f.color}15`, color: f.color }}
              >
                {f.icon}
              </div>
              <div className="text-sm font-bold mb-1" style={{ color: f.color }}>{f.term}</div>
              <div className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.5)" }}>{f.def}</div>
            </motion.div>
          ))}
        </div>

        {/* Terminals */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: "rgba(240,240,245,0.7)" }}>
            3 Terminals
          </h3>
          <div className="flex flex-col gap-3">
            {TERMINALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30` }}
                >
                  {t.symbol}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: t.color }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key formulas */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <div className="text-xs font-mono mb-2" style={{ color: "rgba(239,68,68,0.7)" }}>KEY FORMULA</div>
            <div className="text-2xl font-black mb-2" style={{ color: "#EF4444" }}>I_C = β × I_B</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
              β (beta) = hFE = DC current gain. Typically 50–300.
              Example: β=100, I_B=1mA → I_C=100mA
            </div>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)" }}
          >
            <div className="text-xs font-mono mb-2" style={{ color: "rgba(14,165,233,0.7)" }}>KIRCHHOFF AT EMITTER</div>
            <div className="text-2xl font-black mb-2" style={{ color: "#0EA5E9" }}>I_E = I_C + I_B</div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
              All current exits at the emitter. With β=100 and I_B=1mA:
              I_E = 100mA + 1mA = 101mA
            </div>
          </div>
        </div>

        {/* NPN vs PNP comparison */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>N</div>
              <span className="font-bold" style={{ color: "#EF4444" }}>NPN Type</span>
            </div>
            <div className="text-xs space-y-1.5" style={{ color: "rgba(240,240,245,0.6)" }}>
              <div>• Doping: <span style={{ color: "#EF4444" }}>N-P-N</span></div>
              <div>• Current flows C→E when I_B &gt; 0</div>
              <div>• V_BE ≈ +0.7V (base positive vs emitter)</div>
              <div>• Most common type (electrons faster)</div>
              <div>• Examples: 2N2222, BC547, 2N3904</div>
            </div>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(14,165,233,0.15)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: "rgba(14,165,233,0.15)", color: "#0EA5E9" }}>P</div>
              <span className="font-bold" style={{ color: "#0EA5E9" }}>PNP Type</span>
            </div>
            <div className="text-xs space-y-1.5" style={{ color: "rgba(240,240,245,0.6)" }}>
              <div>• Doping: <span style={{ color: "#0EA5E9" }}>P-N-P</span></div>
              <div>• Current flows E→C when I_B &lt; 0</div>
              <div>• V_BE ≈ -0.7V (base negative vs emitter)</div>
              <div>• Used for high-side switching</div>
              <div>• Examples: BC557, 2N3906, BC327</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
