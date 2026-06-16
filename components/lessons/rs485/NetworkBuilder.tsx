"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#F59E0B";

export default function NetworkBuilder({ onUsed }: Props) {
  const [deviceCount, setDeviceCount] = useState(4);
  const [called, setCalled] = useState(false);

  function handleChange(v: number) {
    setDeviceCount(v);
    if (!called) { setCalled(true); onUsed(); }
  }

  const busWidth = 560;
  const busY = 80;
  const deviceSpacing = busWidth / (deviceCount + 1);

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 03 · Interactive Simulator
        </p>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#F0F0F5" }}>RS485 Network Builder</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Drag the slider to add devices to the RS485 bus. Notice the 120Ω termination resistors at each end
          and the direction control (DE/RE) on every transceiver.
        </p>

        {/* Slider */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.5)" }}>Devices: 2</span>
          <input
            type="range"
            min={2}
            max={10}
            value={deviceCount}
            onChange={e => handleChange(Number(e.target.value))}
            className="flex-1 accent-amber-400"
            style={{ accentColor: COLOR }}
          />
          <span className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.5)" }}>10</span>
          <div
            className="px-3 py-1 rounded-lg font-black text-sm"
            style={{ background: "rgba(245,158,11,0.15)", color: COLOR, border: "1px solid rgba(245,158,11,0.3)", minWidth: 60, textAlign: "center" }}
          >
            {deviceCount} dev
          </div>
        </div>

        {/* Network SVG */}
        <div className="rounded-2xl border p-4 overflow-x-auto" style={{ background: "rgba(245,158,11,0.03)", borderColor: "rgba(245,158,11,0.15)" }}>
          <svg width={busWidth} height={220} viewBox={`0 0 ${busWidth} 220`} className="w-full" style={{ minWidth: 320 }}>

            {/* Bus line A */}
            <line x1="0" y1={busY} x2={busWidth} y2={busY} stroke={COLOR} strokeWidth="3" />
            {/* Bus line B */}
            <line x1="0" y1={busY + 16} x2={busWidth} y2={busY + 16} stroke="#60A5FA" strokeWidth="3" />

            {/* A/B labels */}
            <text x="4" y={busY - 6} fill={COLOR} fontSize="10" fontFamily="monospace">A</text>
            <text x="4" y={busY + 28} fill="#60A5FA" fontSize="10" fontFamily="monospace">B</text>

            {/* Left termination resistor */}
            <rect x="8" y={busY - 6} width="24" height={28} rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="20" y={busY + 8} fill="rgba(255,255,255,0.7)" fontSize="7" textAnchor="middle" fontFamily="monospace">120Ω</text>
            <text x="20" y={busY + 18} fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle" fontFamily="monospace">TERM</text>

            {/* Right termination resistor */}
            <rect x={busWidth - 32} y={busY - 6} width="24" height={28} rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x={busWidth - 20} y={busY + 8} fill="rgba(255,255,255,0.7)" fontSize="7" textAnchor="middle" fontFamily="monospace">120Ω</text>
            <text x={busWidth - 20} y={busY + 18} fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle" fontFamily="monospace">TERM</text>

            {/* Devices */}
            {Array.from({ length: deviceCount }, (_, i) => {
              const x = deviceSpacing * (i + 1);
              const isFirst = i === 0;
              return (
                <g key={i}>
                  {/* Drop line */}
                  <line x1={x} y1={busY + 16} x2={x} y2={120} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 2" />

                  {/* MAX485 chip */}
                  <motion.g
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <rect x={x - 30} y={122} width={60} height={52} rx="6" fill="rgba(245,158,11,0.12)" stroke={isFirst ? COLOR : "rgba(245,158,11,0.35)"} strokeWidth={isFirst ? 2 : 1} />
                    <text x={x} y={138} fill={COLOR} fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">MAX485</text>
                    <text x={x} y={150} fill="rgba(240,240,245,0.6)" fontSize="7" textAnchor="middle" fontFamily="monospace">
                      {isFirst ? "Master" : `Slave ${i}`}
                    </text>
                    {/* DE/RE label */}
                    <rect x={x - 22} y={156} width={44} height={12} rx="3" fill="rgba(255,255,255,0.05)" />
                    <text x={x} y={165} fill="rgba(240,240,245,0.45)" fontSize="7" textAnchor="middle" fontFamily="monospace">DE/RE ctrl</text>
                  </motion.g>

                  {/* Device number */}
                  <text x={x} y={188} fill="rgba(240,240,245,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    D{String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info bar */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)" }}>
            <div className="text-sm font-black" style={{ color: COLOR }}>{deviceCount}</div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.45)" }}>Devices on bus</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-sm font-black" style={{ color: "#F0F0F5" }}>2</div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.45)" }}>120Ω terminators</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: deviceCount >= 32 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.06)", border: `1px solid ${deviceCount >= 32 ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.15)"}` }}>
            <div className="text-sm font-black" style={{ color: deviceCount >= 32 ? "#EF4444" : "#10B981" }}>
              {32 - deviceCount} left
            </div>
            <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.45)" }}>of 32 max unit loads</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
