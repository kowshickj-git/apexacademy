"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    title: "Confusing NO and NC",
    what: "NO = Normally Open (open at rest — only closes when pressed). NC = Normally Closed (closed at rest — opens when pressed). Getting these backwards causes circuits to behave the opposite of expected.",
    fix: "Always label your switch type. Test the default state (unpressed/untoggled) with a multimeter in continuity mode before wiring.",
  },
  {
    title: "Forgetting switch type matters — SPST vs SPDT",
    what: "SPST and SPDT look similar but work completely differently. An SPDT has a third connection (common terminal). Wiring SPDT as SPST by ignoring one output can create unexpected short circuits.",
    fix: "Read the datasheet and identify COM, NO, and NC terminals. Wire only the connections your circuit actually needs.",
  },
  {
    title: "Mechanical bounce (debouncing) ignored",
    what: "Physical buttons bounce 50–200 times in the first 1–10ms when pressed. A microcontroller reading at MHz speed detects each bounce as a separate press — one button press can register as dozens of presses.",
    fix: "Add a 10ms software delay after first edge detection, or use a state-machine debounce. Hardware: add a 100nF capacitor across the switch with a pull-up/pull-down resistor.",
  },
  {
    title: "Exceeding current or voltage ratings",
    what: "Every switch has a maximum voltage and current rating (e.g., 12V / 1A). Exceeding these causes contact arcing, welding, or burning. Small signal switches cannot control mains-powered devices.",
    fix: "Check switch ratings in the datasheet. Use a relay or MOSFET to control high-power loads. Size your switch for the actual load current plus a 50% safety margin.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 9 · Common Mistakes
        </p>
        <h2 className="text-xl font-bold mb-5">Common Switch Mistakes</h2>

        <div className="space-y-3">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="p-4 rounded-2xl border"
              style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.04)" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">🔴</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white/85 mb-2">{m.title}</p>
                  <p className="text-xs text-white/45 leading-relaxed mb-2">{m.what}</p>
                  <div
                    className="flex gap-2 p-2.5 rounded-lg"
                    style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
                  >
                    <span className="text-xs shrink-0" style={{ color: "#06B6D4" }}>✓ Fix:</span>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(6,182,212,0.8)" }}>{m.fix}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
