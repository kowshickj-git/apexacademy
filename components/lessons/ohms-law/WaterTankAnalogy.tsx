"use client";

import { useState, useEffect, useRef } from "react";

interface Props { onSimUsed: () => void; }

const drops = Array.from({ length: 8 }, (_, i) => i);

export default function WaterTankAnalogy({ onSimUsed }: Props) {
  const [pressure, setPressure] = useState(50);
  const [pipeWidth, setPipeWidth] = useState(50);
  const [used, setUsed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const flow = Math.round((pressure / 100) * (pipeWidth / 100) * 100);
  const voltage = Math.round(pressure / 10);
  const resistance = Math.round(100 - pipeWidth);
  const current = resistance < 5 ? 100 : Math.round((voltage / (resistance / 10)) * 10);

  const handleChange = () => {
    if (!used) { setUsed(true); onSimUsed(); }
  };

  const dropSpeed = 0.6 + (1 - flow / 100) * 2.4;
  const pipeH = 16 + (pipeWidth / 100) * 24;

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 3 · Analogy</p>
        <h2 className="text-xl font-bold mb-1">The Water Tank Analogy</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Electricity is invisible, but water isn&apos;t. Use this analogy to feel how voltage, current, and resistance are connected — before seeing the math.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 text-center mb-6">
          {[
            { label: "Voltage", value: `${voltage}V`, sub: "= Water Pressure", color: "#EAB308" },
            { label: "Current", value: `${Math.max(0, Math.min(99, current))}%`, sub: "= Flow Rate", color: "#0EA5E9" },
            { label: "Resistance", value: `${resistance}%`, sub: "= Pipe Restriction", color: "#F97316" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-white/6 py-3 px-2" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xl font-black font-mono" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[10px] text-white/40">{m.label}</p>
              <p className="text-[9px] text-white/20 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Visual */}
        <div className="relative rounded-2xl border border-white/6 overflow-hidden mb-6" style={{ background: "rgba(14,165,233,0.04)", height: 180 }}>
          {/* Tank */}
          <div className="absolute left-4 top-4 bottom-4 w-16 rounded-xl border-2 border-secondary/30 overflow-hidden" style={{ background: "rgba(14,165,233,0.06)" }}>
            <div
              className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-500"
              style={{ height: `${pressure}%`, background: "rgba(14,165,233,0.35)" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-secondary/70 font-bold rotate-90 whitespace-nowrap">Water Tank</span>
            </div>
          </div>

          {/* Pipe */}
          <div
            className="absolute left-20 top-1/2 -translate-y-1/2 rounded-r-full transition-all duration-300"
            style={{
              width: "calc(100% - 150px)",
              height: pipeH,
              background: "rgba(14,165,233,0.15)",
              border: "1px solid rgba(14,165,233,0.2)",
            }}
          >
            {/* Flow drops */}
            {drops.map((i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                style={{
                  background: "#0EA5E9",
                  boxShadow: "0 0 5px rgba(14,165,233,0.8)",
                  animation: flow > 5 ? `ant-march ${dropSpeed + i * 0.2}s linear infinite` : "none",
                  animationDelay: `${i * (dropSpeed / 8)}s`,
                  left: "-12px",
                  opacity: flow > 5 ? 0.85 : 0.1,
                }}
              />
            ))}
          </div>

          {/* Output */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-full border-2 border-secondary/30 flex items-center justify-center text-lg"
              style={{ background: `rgba(14,165,233,${0.05 + (flow / 100) * 0.25})`, opacity: 0.6 + (flow / 100) * 0.4 }}
            >
              💧
            </div>
            <span className="text-[8px] text-white/25">Flow: {flow}%</span>
          </div>

          {/* Pipe restriction indicator */}
          <div
            className="absolute transition-all duration-300 rounded-full border-2 border-orange-400/50"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 20,
              height: pipeH + 8,
              background: "rgba(249,115,22,0.15)",
            }}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-orange-400 font-bold">R</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>💧 Water Pressure (Voltage)</span>
              <span className="font-mono text-yellow-400">{pressure}%</span>
            </div>
            <input
              type="range" min={5} max={100} value={pressure}
              onChange={(e) => { setPressure(Number(e.target.value)); handleChange(); }}
              className="w-full"
              style={{ background: `linear-gradient(to right, #EAB308 ${pressure}%, rgba(255,255,255,0.08) ${pressure}%)` }}
            />
            <div className="flex justify-between text-[10px] text-white/20 mt-1"><span>Low pressure</span><span>High pressure</span></div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>🔧 Pipe Width (Inverse Resistance)</span>
              <span className="font-mono text-orange-400">{pipeWidth}%</span>
            </div>
            <input
              type="range" min={5} max={100} value={pipeWidth}
              onChange={(e) => { setPipeWidth(Number(e.target.value)); handleChange(); }}
              className="w-full slider-orange"
              style={{ background: `linear-gradient(to right, #F97316 ${pipeWidth}%, rgba(255,255,255,0.08) ${pipeWidth}%)` }}
            />
            <div className="flex justify-between text-[10px] text-white/20 mt-1"><span>Narrow (high R)</span><span>Wide (low R)</span></div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl border border-primary/15 flex gap-3" style={{ background: "rgba(16,185,129,0.05)" }}>
          <span className="text-sm">💡</span>
          <p className="text-xs text-white/50 leading-relaxed">
            <strong className="text-white/75">Notice:</strong> More pressure AND wider pipe = more flow. Narrow pipe always restricts flow no matter the pressure.
            This <em>is</em> Ohm&apos;s Law — just with water instead of electrons.
          </p>
        </div>
      </div>
    </section>
  );
}
