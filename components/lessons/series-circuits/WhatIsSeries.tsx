"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const RULES = [
  {
    num: "1",
    title: "Current is the same everywhere",
    formula: "I₁ = I₂ = I₃ = I_total",
    desc: "Every amp that leaves the battery passes through R1, then R2, then R3 — same current, no exceptions.",
    color: "#F97316",
  },
  {
    num: "2",
    title: "Voltages add up",
    formula: "V_total = V₁ + V₂ + V₃",
    desc: "Each component 'uses up' a portion of the total voltage. The portions must add up to the supply voltage.",
    color: "#10B981",
  },
  {
    num: "3",
    title: "Resistances add up",
    formula: "R_total = R₁ + R₂ + R₃",
    desc: "Adding more components to a series circuit always increases total resistance, which decreases current.",
    color: "#0EA5E9",
  },
];

function CircuitLoop() {
  return (
    <div className="relative w-full max-w-xs mx-auto" style={{ height: 160 }}>
      {/* Top wire */}
      <div
        className="absolute"
        style={{ top: 24, left: 60, right: 60, height: 2, background: "rgba(249,115,22,0.35)" }}
      />
      {/* Bottom wire */}
      <div
        className="absolute"
        style={{ bottom: 24, left: 60, right: 60, height: 2, background: "rgba(249,115,22,0.35)" }}
      />
      {/* Left wire */}
      <div
        className="absolute"
        style={{ top: 24, left: 60, width: 2, height: "calc(100% - 48px)", background: "rgba(249,115,22,0.35)" }}
      />
      {/* Right wire */}
      <div
        className="absolute"
        style={{ top: 24, right: 60, width: 2, height: "calc(100% - 48px)", background: "rgba(249,115,22,0.35)" }}
      />

      {/* Battery — left side */}
      <div
        className="absolute flex flex-col items-center justify-center text-xs rounded-lg font-bold"
        style={{
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          width: 44,
          height: 44,
          background: "rgba(249,115,22,0.12)",
          border: "1.5px solid #F97316",
          color: "#F97316",
        }}
      >
        🔋
        <span style={{ fontSize: 9, color: "rgba(249,115,22,0.7)" }}>9V</span>
      </div>

      {/* R1 — top */}
      <div
        className="absolute flex flex-col items-center justify-center text-xs rounded-lg font-bold"
        style={{
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 44,
          height: 30,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(240,240,245,0.7)",
        }}
      >
        R1
      </div>

      {/* R2 — right side */}
      <div
        className="absolute flex flex-col items-center justify-center text-xs rounded-lg font-bold"
        style={{
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          width: 44,
          height: 44,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(240,240,245,0.7)",
        }}
      >
        R2
      </div>

      {/* R3 — bottom */}
      <div
        className="absolute flex flex-col items-center justify-center text-xs rounded-lg font-bold"
        style={{
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 44,
          height: 30,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(240,240,245,0.7)",
        }}
      >
        R3
      </div>

      {/* Current arrow — top */}
      <div
        className="absolute text-xs font-bold"
        style={{ top: 10, left: "55%", color: "rgba(249,115,22,0.6)" }}
      >
        →
      </div>

      {/* I label */}
      <div
        className="absolute text-xs font-mono"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "rgba(249,115,22,0.5)" }}
      >
        I
      </div>
    </div>
  );
}

export default function WhatIsSeries() {
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
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            What is a Series Circuit?
          </h2>
          <p style={{ color: "rgba(240,240,245,0.55)" }}>
            A series circuit connects components end-to-end in a single loop. Current flows through
            each component in sequence, and the only way for current to flow is to go through
            every single component.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {/* Loop diagram */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs font-mono text-center mb-4" style={{ color: "rgba(240,240,245,0.3)" }}>
              SINGLE LOOP — one path
            </p>
            <CircuitLoop />
          </div>

          {/* Ohm's Law formula */}
          <div
            className="rounded-2xl p-6 flex flex-col justify-center"
            style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.15)" }}
          >
            <p className="text-xs font-mono mb-3" style={{ color: "rgba(249,115,22,0.5)" }}>
              OHM'S LAW FOR SERIES
            </p>
            <div className="text-center">
              <div
                className="text-3xl font-black mb-2"
                style={{ color: "#F97316", fontFamily: "monospace" }}
              >
                I = V / R<sub style={{ fontSize: "0.6em" }}>total</sub>
              </div>
              <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
                where R_total = R₁ + R₂ + R₃
              </p>
              <div
                className="mt-4 p-3 rounded-xl text-sm"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(240,240,245,0.6)" }}
              >
                <strong style={{ color: "#F97316" }}>Example:</strong> 9V ÷ (100+200+300)Ω = 15mA
              </div>
            </div>
          </div>
        </div>

        {/* 3 key rules */}
        <div className="flex flex-col gap-4">
          {RULES.map((rule, i) => (
            <motion.div
              key={rule.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl p-5 flex gap-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${rule.color}20`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5"
                style={{ background: `${rule.color}15`, color: rule.color }}
              >
                {rule.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="font-bold" style={{ color: "#F0F0F5" }}>
                    {rule.title}
                  </h3>
                  <code
                    className="text-xs px-2 py-0.5 rounded-lg font-mono"
                    style={{ background: `${rule.color}12`, color: rule.color }}
                  >
                    {rule.formula}
                  </code>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>
                  {rule.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Historical context */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8 rounded-2xl p-5 flex gap-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="text-2xl flex-shrink-0">🎄</div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "rgba(240,240,245,0.8)" }}>
              Historical Context
            </p>
            <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
              Christmas lights were the first widely popular series circuits — invented in the 1880s.
              Their famous flaw? One bulb burns out, the whole string goes dark. That's the defining
              characteristic of series circuits in action.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
