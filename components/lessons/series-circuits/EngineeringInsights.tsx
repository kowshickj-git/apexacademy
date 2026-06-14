"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const INSIGHTS = [
  {
    icon: "🎄",
    title: "Christmas Lights",
    subtitle: "The Classic Series Problem",
    body: "Old-style incandescent Christmas lights were wired in series — every bulb shared the same single current path. One bulb fails (opens), the entire string goes dark. Modern LED lights use parallel circuits so individual failures don't kill the whole string.",
    tech: "Series → entire string fails | Parallel → individual LEDs fail independently",
    color: "#F97316",
  },
  {
    icon: "🔋",
    title: "Battery Packs",
    subtitle: "Voltage Addition in Series",
    body: "When batteries are connected in series (positive to negative), their voltages add. Three 3.7V lithium cells in series produce 11.1V — used in laptop batteries, power tools, and electric vehicles. Current capacity stays the same as a single cell.",
    tech: "V_total = 3.7 + 3.7 + 3.7 = 11.1V | I_max stays at single-cell rating",
    color: "#10B981",
  },
  {
    icon: "🏭",
    title: "Sensor Safety Chains",
    subtitle: "Industrial Fail-Safe Design",
    body: "Industrial machines use series-wired safety sensors intentionally. Emergency stops, door interlocks, and light curtains are all in series: ANY sensor triggering breaks the loop and stops the machine. The series fault behavior is a feature, not a bug.",
    tech: "E-Stop₁ — E-Stop₂ — Door Sensor — Light Curtain → all in series",
    color: "#0EA5E9",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-6">
          <div
            className="inline-block px-2 py-1 rounded-lg text-xs font-mono font-bold mb-2"
            style={{ background: "rgba(249,115,22,0.1)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            REAL WORLD
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            Engineering Insights
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            How series circuits appear in products and systems you use every day.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {INSIGHTS.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${ins.color}20`,
              }}
            >
              {/* Header */}
              <div
                className="px-5 pt-5 pb-4"
                style={{ borderBottom: `1px solid ${ins.color}15` }}
              >
                <div className="text-3xl mb-3">{ins.icon}</div>
                <h3 className="font-black text-base mb-0.5" style={{ color: ins.color }}>
                  {ins.title}
                </h3>
                <p className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>
                  {ins.subtitle}
                </p>
              </div>

              {/* Body */}
              <div className="px-5 py-4 flex-1">
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,240,245,0.6)" }}>
                  {ins.body}
                </p>
              </div>

              {/* Tech note */}
              <div
                className="px-4 py-3 mx-4 mb-4 rounded-xl"
                style={{ background: `${ins.color}08`, border: `1px solid ${ins.color}18` }}
              >
                <code className="text-xs" style={{ color: `${ins.color}90` }}>
                  {ins.tech}
                </code>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
