"use client";

import { motion } from "framer-motion";

export default function PolarityGuide() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 4 · Polarity</p>
        <h2 className="text-xl font-bold mb-1">Anode (+) and Cathode (−)</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          LEDs only work when connected the right way around. The <strong className="text-white/70">anode</strong> must connect to the positive (+) side,
          and the <strong className="text-white/70">cathode</strong> to ground (−). Connect them backwards — nothing happens. No explosion, no drama — just no light.
        </p>

        {/* Visual guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-4 mb-6"
        >
          {/* 5mm LED diagram */}
          <div className="rounded-2xl border border-white/8 p-5 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-xs font-bold text-white/50 mb-4">Physical LED (5mm)</p>
            <svg width="80" height="120" viewBox="0 0 80 120" className="mx-auto mb-3">
              {/* LED dome */}
              <ellipse cx="40" cy="30" rx="28" ry="28" fill="rgba(239,68,68,0.3)" stroke="#FCA5A5" strokeWidth="1.5" />
              <ellipse cx="40" cy="22" rx="16" ry="12" fill="rgba(239,68,68,0.15)" />
              {/* LED body flat bottom */}
              <path d="M12 44 Q12 62 40 62 Q68 62 68 44" fill="rgba(239,68,68,0.25)" stroke="#FCA5A5" strokeWidth="1.5" />
              {/* Flat edge indicator */}
              <rect x="52" y="44" width="16" height="4" rx="0" fill="rgba(239,68,68,0.6)" />
              {/* Legs */}
              <line x1="34" y1="62" x2="34" y2="115" stroke="#9CA3AF" strokeWidth="2.5" />
              <line x1="46" y1="62" x2="46" y2="110" stroke="#9CA3AF" strokeWidth="2.5" />
              {/* Anode bend line */}
              <line x1="34" y1="105" x2="46" y2="105" stroke="#9CA3AF" strokeWidth="1.2" />
              {/* Labels */}
              <text x="20" y="112" fontSize="9" fill="rgba(16,185,129,0.8)" fontFamily="monospace" fontWeight="bold">+</text>
              <text x="52" y="108" fontSize="9" fill="rgba(239,68,68,0.8)" fontFamily="monospace" fontWeight="bold">−</text>
            </svg>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-[10px] text-white/55">Long leg = <strong className="text-primary">Anode (+)</strong></p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <p className="text-[10px] text-white/55">Short leg = <strong className="text-red-400">Cathode (−)</strong></p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <p className="text-[10px] text-white/55">Flat side body = Cathode side</p>
              </div>
            </div>
          </div>

          {/* Circuit symbol */}
          <div className="rounded-2xl border border-white/8 p-5 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-xs font-bold text-white/50 mb-4">Circuit Symbol (LED)</p>
            <svg width="130" height="70" viewBox="0 0 130 70" className="mx-auto mb-3">
              {/* Wires */}
              <line x1="0" y1="35" x2="25" y2="35" stroke="#A78BFA" strokeWidth="2" />
              <line x1="85" y1="35" x2="130" y2="35" stroke="#A78BFA" strokeWidth="2" />
              {/* Triangle (current direction) */}
              <polygon points="25,12 25,58 65,35" fill="rgba(239,68,68,0.3)" stroke="#FCA5A5" strokeWidth="1.8" />
              {/* Cathode bar */}
              <line x1="65" y1="12" x2="65" y2="58" stroke="#FCA5A5" strokeWidth="2.5" />
              {/* Light rays */}
              <line x1="75" y1="20" x2="90" y2="8" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="80" y1="28" x2="98" y2="20" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
              {/* Arrow heads on rays */}
              <polygon points="90,8 85,11 88,14" fill="#EAB308" />
              <polygon points="98,20 93,20 95,25" fill="#EAB308" />
              {/* +/- labels */}
              <text x="8" y="30" fontSize="12" fill="rgba(16,185,129,0.8)" fontFamily="monospace" fontWeight="bold">+</text>
              <text x="110" y="30" fontSize="12" fill="rgba(239,68,68,0.8)" fontFamily="monospace" fontWeight="bold">−</text>
              {/* A/K labels */}
              <text x="14" y="66" fontSize="9" fill="rgba(167,139,250,0.6)" fontFamily="monospace">A</text>
              <text x="61" y="66" fontSize="9" fill="rgba(167,139,250,0.6)" fontFamily="monospace">K</text>
            </svg>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-[10px] text-white/55">Triangle base = <strong className="text-primary">Anode (+)</strong></p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <p className="text-[10px] text-white/55">Vertical bar = <strong className="text-red-400">Cathode (−)</strong></p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <p className="text-[10px] text-white/55">Rays = light emitted</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="p-4 rounded-xl border border-yellow-500/20" style={{ background: "rgba(234,179,8,0.07)" }}>
          <p className="text-xs font-bold text-yellow-400 mb-1">Memory Trick: &quot;LED is a Diode, Diodes have A before K&quot;</p>
          <p className="text-[11px] text-white/45 leading-relaxed">
            A = Anode = Arrives (+). K = Kathode (old spelling) = exits. Conventional current always flows A→K. If current flows → light. If you can&apos;t remember, look for the flat side or the shorter leg.
          </p>
        </div>
      </div>
    </section>
  );
}
