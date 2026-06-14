"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const insights = [
  {
    icon: "🏠",
    title: "Home Wiring",
    subtitle: "The most common parallel circuit",
    body: "Every outlet in your home is wired in parallel. Each socket receives the same 120V (US) or 230V (EU). Adding an appliance draws more current from the breaker, but doesn't affect your other devices. This is why you can plug in a 1200W heater without dimming your lights — they're on different branches.",
    tags: ["120V / 230V", "Independent outlets", "Circuit breakers"],
  },
  {
    icon: "✈️",
    title: "Redundant Systems",
    subtitle: "Aerospace, medical, nuclear",
    body: "Critical systems use parallel redundancy so one failure can't kill the whole system. Aircraft have multiple parallel hydraulic circuits — if one leaks, the others keep the wings flying. Hospital life-support machines have parallel power supplies. Nuclear plants have parallel cooling loops. Parallel circuits save lives.",
    tags: ["Fault tolerance", "High reliability", "Safety critical"],
  },
  {
    icon: "⚡",
    title: "Current Carrying Capacity",
    subtitle: "High-power engineering applications",
    body: "Parallel wiring is used to share current load across multiple conductors. EV motors use parallel windings to handle hundreds of amps without burning any single wire. Industrial motors, server power supplies, and battery packs wire cells in parallel to multiply current capacity while keeping voltage the same.",
    tags: ["EV motors", "Battery packs", "Industrial power"],
  },
];

export default function EngineeringInsights() {
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
            Engineering
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Where Parallel Circuits Shine</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Real engineering applications that depend on parallel circuit principles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.14 }}
              className="rounded-2xl p-5 border overflow-hidden relative"
              style={{
                background: "rgba(99,102,241,0.05)",
                borderColor: "rgba(99,102,241,0.15)",
              }}
            >
              {/* Indigo top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(to right, #6366F1, rgba(99,102,241,0))" }}
              />

              <div className="text-3xl mb-3">{ins.icon}</div>
              <h3 className="text-base font-black text-white mb-0.5">{ins.title}</h3>
              <p className="text-xs font-medium mb-3" style={{ color: "#818CF8" }}>
                {ins.subtitle}
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(240,240,245,0.55)" }}>
                {ins.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {ins.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      borderColor: "rgba(99,102,241,0.25)",
                      color: "#A5B4FC",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
