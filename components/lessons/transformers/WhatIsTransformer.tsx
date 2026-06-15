"use client";

import { motion } from "framer-motion";

export default function WhatIsTransformer() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 2 · Theory
        </p>
        <h2 className="text-xl font-bold mb-1">What Is a Transformer?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          A transformer is two coils of wire wound on a shared magnetic core. AC on the primary coil creates a changing magnetic field that induces AC voltage in the secondary coil via Faraday&apos;s Law — with no electrical connection between the coils.
        </p>

        {/* Key equations */}
        <div className="space-y-3 mb-6">
          {/* Voltage / turns ratio */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.06)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(139,92,246,0.2)", color: "#8B5CF6" }}
              >
                V
              </div>
              <div>
                <p className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1">Voltage Ratio = Turns Ratio</p>
                <div
                  className="font-mono text-base font-bold mb-2"
                  style={{ color: "#8B5CF6" }}
                >
                  V_p / V_s = N_p / N_s
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  Primary voltage over secondary voltage equals primary turns over secondary turns. Double the secondary turns → double the output voltage.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Current ratio */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.05)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA" }}
              >
                I
              </div>
              <div>
                <p className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1">Current Ratio (Inverse)</p>
                <div
                  className="font-mono text-base font-bold mb-2"
                  style={{ color: "#A78BFA" }}
                >
                  I_p / I_s = N_s / N_p
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  Current ratio is the INVERSE of the turns ratio. Double the secondary turns → half the secondary current. High voltage → low current, always.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Power conservation */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.04)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
              >
                P
              </div>
              <div>
                <p className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1">Power Conservation (Ideal)</p>
                <div
                  className="font-mono text-base font-bold mb-2"
                  style={{ color: "#10B981" }}
                >
                  P_in = P_out → V_p × I_p = V_s × I_s
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  In an ideal transformer, input power equals output power. You can&apos;t get more energy out than you put in — transformers change voltage and current, not power.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Historical note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-white/8 p-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚡</span>
            <div>
              <p className="text-xs font-bold text-white/60 mb-1">Historical Note — 1886</p>
              <p className="text-xs text-white/35 leading-relaxed">
                Nikola Tesla and William Stanley Jr. developed the first practical AC transformer in 1886. Stanley demonstrated it in Great Barrington, Massachusetts — powering streetlights from a central generator via transformers. This proved AC power could be transmitted efficiently over distance, winning the "War of Currents" against Edison&apos;s DC system.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
