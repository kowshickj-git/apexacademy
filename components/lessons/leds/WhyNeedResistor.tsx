"use client";

import { motion } from "framer-motion";

export default function WhyNeedResistor() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 8 · Resistor</p>
        <h2 className="text-xl font-bold mb-1">Why Does an LED Need a Resistor?</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          An LED is not a resistive load — its current is determined by the voltage across it, not a fixed resistance.
          Once forward voltage is exceeded, current increases exponentially. Without a limiting resistor, current goes to infinity and the LED burns out instantly.
        </p>

        {/* Without vs with comparison */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-red-500/25 p-4"
            style={{ background: "rgba(239,68,68,0.06)" }}
          >
            <p className="text-xs font-bold text-red-400 mb-2">❌ Without resistor</p>
            <svg width="100%" height="60" viewBox="0 0 200 60" className="mb-2">
              <line x1="0" y1="30" x2="50" y2="30" stroke="#EF4444" strokeWidth="2" />
              <rect x="50" y="18" width="20" height="24" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <text x="60" y="34" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="monospace">5V</text>
              <line x1="70" y1="30" x2="120" y2="30" stroke="#EF4444" strokeWidth="2" />
              <polygon points="120,18 120,42 145,30" fill="rgba(239,68,68,0.4)" stroke="#EF4444" strokeWidth="1.5" />
              <rect x="144" y="18" width="3" height="24" rx="1" fill="#EF4444" />
              <line x1="147" y1="30" x2="200" y2="30" stroke="#EF4444" strokeWidth="2" />
              <text x="60" y="55" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.5)" fontFamily="monospace">∞ current!</text>
            </svg>
            <p className="text-[10px] text-white/40 leading-relaxed">
              5V battery connected directly to LED (Vf=2V). Voltage across LED&apos;s non-linear junction causes runaway current → instant burnout (milliseconds).
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-primary/25 p-4"
            style={{ background: "rgba(16,185,129,0.06)" }}
          >
            <p className="text-xs font-bold text-primary mb-2">✅ With 150Ω resistor</p>
            <svg width="100%" height="60" viewBox="0 0 200 60" className="mb-2">
              <line x1="0" y1="30" x2="30" y2="30" stroke="#10B981" strokeWidth="2" />
              <rect x="30" y="18" width="16" height="24" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <text x="38" y="35" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="monospace">5V</text>
              <line x1="46" y1="30" x2="70" y2="30" stroke="#10B981" strokeWidth="2" />
              {/* Resistor zigzag */}
              <polyline points="70,30 75,20 80,40 85,20 90,40 95,20 100,40 105,30"
                fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="87" y="55" textAnchor="middle" fontSize="7" fill="rgba(249,115,22,0.6)" fontFamily="monospace">150Ω</text>
              <line x1="105" y1="30" x2="130" y2="30" stroke="#10B981" strokeWidth="2" />
              <polygon points="130,18 130,42 155,30" fill="rgba(16,185,129,0.4)" stroke="#10B981" strokeWidth="1.5" />
              <rect x="154" y="18" width="3" height="24" rx="1" fill="#10B981" />
              <line x1="157" y1="30" x2="200" y2="30" stroke="#10B981" strokeWidth="2" />
              <text x="90" y="10" textAnchor="middle" fontSize="7" fill="rgba(16,185,129,0.5)" fontFamily="monospace">20mA ✓</text>
            </svg>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Resistor drops the extra voltage (5V − 2V = 3V across 150Ω = 20mA). LED operates at safe, rated current.
            </p>
          </motion.div>
        </div>

        {/* Formula */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-orange-500/25 p-5"
          style={{ background: "rgba(249,115,22,0.06)" }}
        >
          <p className="text-xs font-bold text-orange-400 mb-3">The Resistor Formula</p>
          <div className="text-center mb-4">
            <p className="text-2xl font-black font-mono" style={{ color: "#F97316" }}>R = (Vs − Vf) / If</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div>
              <p className="text-lg font-black font-mono text-yellow-400">Vs</p>
              <p className="text-[10px] text-white/35">Supply voltage</p>
              <p className="text-[10px] text-white/25">e.g. 5V or 9V</p>
            </div>
            <div>
              <p className="text-lg font-black font-mono text-red-400">Vf</p>
              <p className="text-[10px] text-white/35">LED forward voltage</p>
              <p className="text-[10px] text-white/25">1.8–3.6V (colour)</p>
            </div>
            <div>
              <p className="text-lg font-black font-mono text-blue-400">If</p>
              <p className="text-[10px] text-white/35">Target current</p>
              <p className="text-[10px] text-white/25">10–20mA typical</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: "5V, red LED (Vf=2.0V), If=20mA", calc: "(5 − 2.0) / 0.02 = 150Ω → use 220Ω (safer)" },
              { label: "9V, red LED (Vf=2.0V), If=20mA", calc: "(9 − 2.0) / 0.02 = 350Ω → use 470Ω" },
              { label: "5V, blue LED (Vf=3.2V), If=15mA", calc: "(5 − 3.2) / 0.015 = 120Ω → use 150Ω" },
            ].map(({ label, calc }) => (
              <div key={label} className="rounded-lg border border-white/6 px-3 py-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[10px] text-white/35 mb-0.5">{label}</p>
                <p className="text-[10px] font-mono" style={{ color: "#F97316" }}>{calc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
