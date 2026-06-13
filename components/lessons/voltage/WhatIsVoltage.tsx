"use client";

import { motion } from "framer-motion";

export default function WhatIsVoltage() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="01" title="What is Voltage?" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Pull quote */}
        <div className="relative bg-surface rounded-2xl p-4 border border-primary/20 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-2xl" />
          <p className="pl-2 text-base sm:text-lg leading-relaxed font-medium text-white">
            Voltage is the{" "}
            <span className="text-primary">electrical pressure</span> that pushes
            electrons through a circuit.
          </p>
        </div>

        {/* Explanation */}
        <p className="text-sm text-white/60 leading-relaxed">
          Just like water pressure pushes water through a pipe, voltage pushes electrons
          through wires. The higher the voltage, the more forcefully electrons are pushed,
          creating a stronger electrical current. Voltage is measured in{" "}
          <span className="text-white font-semibold">Volts (V)</span>, named after
          scientist Alessandro Volta.
        </p>

        {/* Animated Circuit */}
        <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
              Electron Flow Visualization
            </p>
          </div>
          <CircuitAnimation />
        </div>
      </motion.div>
    </section>
  );
}

function CircuitAnimation() {
  const electrons = [0, 1, 2, 3];

  return (
    <div className="w-full px-2 pb-3">
      <svg
        viewBox="0 0 320 110"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Animated circuit showing electrons flowing from battery to LED"
      >
        <defs>
          <filter id="glow-battery" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-led" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-electron" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Electron motion path */}
          <path id="ePath" d="M 92 55 L 228 55" />
        </defs>

        {/* ── Wire ── */}
        <line x1="90" y1="55" x2="230" y2="55" stroke="#2D3748" strokeWidth="4" strokeLinecap="round" />
        <line x1="90" y1="55" x2="230" y2="55" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

        {/* ── Battery ── */}
        <g filter="url(#glow-battery)">
          {/* Body */}
          <rect x="14" y="28" width="76" height="54" rx="6" fill="#1F2937" stroke="#10B981" strokeWidth="1.5" />
          {/* Internal cell lines */}
          <line x1="42" y1="38" x2="42" y2="72" stroke="#374151" strokeWidth="1" />
          <line x1="56" y1="38" x2="56" y2="72" stroke="#374151" strokeWidth="1" />
          <line x1="70" y1="38" x2="70" y2="72" stroke="#374151" strokeWidth="1" />
          {/* + terminal */}
          <rect x="90" y="44" width="10" height="22" rx="3" fill="#10B981" />
          {/* - terminal */}
          <rect x="4" y="48" width="10" height="14" rx="2" fill="#6B7280" />
          {/* Labels */}
          <text x="52" y="50" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">9V</text>
          <text x="52" y="63" textAnchor="middle" fill="#6B7280" fontSize="7">BATTERY</text>
          <text x="87" y="57" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="bold">+</text>
          <text x="17" y="57" textAnchor="middle" fill="#9CA3AF" fontSize="11">−</text>
        </g>

        {/* ── LED ── */}
        <g filter="url(#glow-led)">
          {/* Outer glow */}
          <circle cx="258" cy="55" r="28" fill="#10B981" opacity="0.06" />
          <circle cx="258" cy="55" r="20" fill="#10B981" opacity="0.1" />
          {/* LED body */}
          <circle cx="258" cy="55" r="14" fill="#0D5C3A" stroke="#10B981" strokeWidth="1.5" />
          {/* Filament cross */}
          <line x1="254" y1="51" x2="262" y2="59" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="262" y1="51" x2="254" y2="59" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
          {/* LED cap */}
          <circle cx="258" cy="55" r="14" fill="none" stroke="#10B981" strokeWidth="1.5" />
          <circle cx="254" cy="50" r="3" fill="white" opacity="0.25" />
          {/* Light rays */}
          {[[-12, -18], [0, -22], [12, -18]].map(([dx, dy], i) => (
            <line
              key={i}
              x1={258 + dx * 0.5}
              y1={55 + dy * 0.5}
              x2={258 + dx}
              y2={55 + dy}
              stroke="#10B981"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.8;0.2;0.8"
                dur="1.4s"
                begin={`${i * 0.45}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
          {/* Leads */}
          <line x1="230" y1="55" x2="244" y2="55" stroke="#6B7280" strokeWidth="2" />
          <line x1="272" y1="55" x2="280" y2="55" stroke="#6B7280" strokeWidth="2" />
        </g>

        {/* ── Labels ── */}
        <text x="52" y="100" textAnchor="middle" fill="#4B5563" fontSize="8">BATTERY</text>
        <text x="258" y="100" textAnchor="middle" fill="#4B5563" fontSize="8">LED</text>
        <text x="160" y="44" textAnchor="middle" fill="#374151" fontSize="7">WIRE</text>

        {/* ── Animated Electrons ── */}
        {electrons.map((i) => (
          <circle key={i} r="4.5" fill="#10B981" filter="url(#glow-electron)">
            <animateMotion
              dur="2.2s"
              begin={`${i * 0.55}s`}
              repeatCount="indefinite"
              path="M 92 55 L 228 55"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.08;0.92;1"
              dur="2.2s"
              begin={`${i * 0.55}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ── Arrow label ── */}
        <text x="160" y="78" textAnchor="middle" fill="#10B981" fontSize="8.5" fontWeight="bold">
          ⟶ Electrons flow from − to +
        </text>
      </svg>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
