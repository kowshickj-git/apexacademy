"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#8B5CF6";

type Proto = "UART" | "I2C" | "SPI" | "CAN" | "RS485";

const PROTOCOLS: { id: Proto; color: string }[] = [
  { id: "UART",  color: "#8B5CF6" },
  { id: "I2C",   color: "#06B6D4" },
  { id: "SPI",   color: "#10B981" },
  { id: "CAN",   color: "#F59E0B" },
  { id: "RS485", color: "#EF4444" },
];

const INFOS: Record<Proto, { wires: string; voltage: string; notes: string }> = {
  UART:  { wires: "2 wires (TX, RX)", voltage: "3.3V or 5V TTL", notes: "TX of one device → RX of other. Wires CROSS. No shared clock. Both must use same baud rate (e.g. 9600 or 115200 8N1)." },
  I2C:   { wires: "2 wires (SDA, SCL)", voltage: "3.3V or 5V + pull-ups", notes: "Open-drain bus. Pull-up resistors (4.7kΩ) to VCC are REQUIRED. All devices share same SDA/SCL. Master controls clock." },
  SPI:   { wires: "4 wires + CS per slave", voltage: "3.3V or 5V", notes: "MOSI/MISO/SCK are shared. Each slave gets its own CS line (active LOW). Full duplex — MOSI and MISO transfer simultaneously." },
  CAN:   { wires: "2 wires (CAN-H, CAN-L)", voltage: "Differential ±1V to ±5V", notes: "Differential pair. 120Ω termination resistors at BOTH ends of the bus. Multi-master. Used in all cars since 2008." },
  RS485: { wires: "2 wires (A, B)", voltage: "Differential ±1.5V to ±5V", notes: "Differential pair. 120Ω termination at both ends. Half-duplex (shared bus). Up to 32 nodes. MODBUS typically runs on RS485." },
};

// UART wiring SVG
function UARTDiagram() {
  return (
    <svg viewBox="0 0 320 130" width="100%" style={{ maxWidth: 320 }}>
      {/* MCU 1 */}
      <rect x="10" y="30" width="80" height="70" rx="8" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
      <text x="50" y="55" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F0F0F5" fontFamily="monospace">MCU 1</text>
      <text x="50" y="72" textAnchor="middle" fontSize="9" fill="rgba(139,92,246,0.8)" fontFamily="monospace">TX</text>
      <text x="50" y="88" textAnchor="middle" fontSize="9" fill="rgba(139,92,246,0.6)" fontFamily="monospace">RX</text>
      {/* Pin dots */}
      <circle cx="90" cy="70" r="3" fill="#8B5CF6" />
      <circle cx="90" cy="86" r="3" fill="rgba(139,92,246,0.5)" />

      {/* MCU 2 */}
      <rect x="230" y="30" width="80" height="70" rx="8" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
      <text x="270" y="55" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F0F0F5" fontFamily="monospace">MCU 2</text>
      <text x="270" y="72" textAnchor="middle" fontSize="9" fill="rgba(139,92,246,0.6)" fontFamily="monospace">RX</text>
      <text x="270" y="88" textAnchor="middle" fontSize="9" fill="rgba(139,92,246,0.8)" fontFamily="monospace">TX</text>
      <circle cx="230" cy="70" r="3" fill="rgba(139,92,246,0.5)" />
      <circle cx="230" cy="86" r="3" fill="#8B5CF6" />

      {/* TX1 → RX2 (crosses) */}
      <line x1="90" y1="70" x2="160" y2="70" stroke="#8B5CF6" strokeWidth="1.5" />
      <line x1="160" y1="70" x2="230" y2="70" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" strokeDasharray="4,2" />
      {/* RX1 ← TX2 */}
      <line x1="90" y1="86" x2="160" y2="86" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" strokeDasharray="4,2" />
      <line x1="160" y1="86" x2="230" y2="86" stroke="#8B5CF6" strokeWidth="1.5" />

      {/* Cross label */}
      <rect x="140" y="60" width="40" height="36" rx="4" fill="rgba(5,5,7,0.9)" />
      <text x="160" y="75" textAnchor="middle" fontSize="8" fill="rgba(139,92,246,0.7)" fontFamily="monospace">TX→RX</text>
      <text x="160" y="89" textAnchor="middle" fontSize="8" fill="rgba(139,92,246,0.5)" fontFamily="monospace">RX←TX</text>

      <text x="160" y="120" textAnchor="middle" fontSize="9" fill="rgba(240,240,245,0.35)" fontFamily="monospace">Wires cross! TX → RX</text>
    </svg>
  );
}

// I2C wiring SVG
function I2CDiagram() {
  return (
    <svg viewBox="0 0 320 160" width="100%" style={{ maxWidth: 320 }}>
      {/* VCC line */}
      <line x1="60" y1="20" x2="260" y2="20" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
      <text x="10" y="24" fontSize="9" fill="rgba(239,68,68,0.7)" fontFamily="monospace">VCC</text>

      {/* Pull-up resistors */}
      <rect x="110" y="20" width="12" height="20" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <text x="116" y="46" textAnchor="middle" fontSize="7" fill="rgba(240,240,245,0.4)" fontFamily="monospace">4.7k</text>
      <rect x="150" y="20" width="12" height="20" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <text x="156" y="46" textAnchor="middle" fontSize="7" fill="rgba(240,240,245,0.4)" fontFamily="monospace">4.7k</text>

      {/* SDA / SCL lines */}
      <line x1="20" y1="55" x2="290" y2="55" stroke="#06B6D4" strokeWidth="1.5" />
      <line x1="20" y1="70" x2="290" y2="70" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" />

      {/* Pull-up connections */}
      <line x1="116" y1="40" x2="116" y2="55" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2,2" />
      <line x1="156" y1="40" x2="156" y2="70" stroke="rgba(6,182,212,0.5)" strokeWidth="1" strokeDasharray="2,2" />

      {/* SDA/SCL labels */}
      <text x="10" y="59" fontSize="9" fill="#06B6D4" fontFamily="monospace">SDA</text>
      <text x="10" y="74" fontSize="9" fill="rgba(6,182,212,0.6)" fontFamily="monospace">SCL</text>

      {/* Master */}
      <rect x="20" y="80" width="70" height="50" rx="6" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
      <text x="55" y="100" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#F0F0F5" fontFamily="monospace">Master</text>
      <text x="55" y="115" textAnchor="middle" fontSize="8" fill="rgba(6,182,212,0.6)" fontFamily="monospace">MCU</text>
      <line x1="55" y1="80" x2="55" y2="70" stroke="#06B6D4" strokeWidth="1" />

      {/* Devices */}
      {[{ label: "0x48", x: 130 }, { label: "0x76", x: 185 }, { label: "0x3C", x: 240 }].map(d => (
        <g key={d.label}>
          <rect x={d.x} y="80" width="50" height="50" rx="6" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.2" />
          <text x={d.x + 25} y="101" textAnchor="middle" fontSize="8" fill="rgba(240,240,245,0.6)" fontFamily="monospace">Device</text>
          <text x={d.x + 25} y="116" textAnchor="middle" fontSize="8" fill={COLOR} fontFamily="monospace">{d.label}</text>
          <line x1={d.x + 25} y1="80" x2={d.x + 25} y2="55" stroke="#06B6D4" strokeWidth="1" />
        </g>
      ))}

      <text x="160" y="152" textAnchor="middle" fontSize="9" fill="rgba(240,240,245,0.3)" fontFamily="monospace">All share SDA + SCL · addresses keep them separate</text>
    </svg>
  );
}

// SPI wiring SVG
function SPIDiagram() {
  return (
    <svg viewBox="0 0 320 160" width="100%" style={{ maxWidth: 320 }}>
      {/* Master */}
      <rect x="10" y="10" width="80" height="100" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="50" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F0F0F5" fontFamily="monospace">Master</text>
      {["MOSI", "MISO", "SCK", "CS1", "CS2", "CS3"].map((p, i) => (
        <g key={p}>
          <text x="85" y={50 + i * 14} textAnchor="end" fontSize="8" fill="rgba(16,185,129,0.7)" fontFamily="monospace">{p}</text>
          <circle cx="88" cy={47 + i * 14} r="2.5" fill="#10B981" />
        </g>
      ))}

      {/* Lines: MOSI, MISO, SCK shared; CS separate */}
      <line x1="88" y1="47" x2="230" y2="47" stroke="#10B981" strokeWidth="1.5" />
      <line x1="88" y1="61" x2="230" y2="61" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      <line x1="88" y1="75" x2="230" y2="75" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      {/* CS lines */}
      <line x1="88" y1="89" x2="165" y2="89" stroke="rgba(239,68,68,0.6)" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="88" y1="103" x2="200" y2="103" stroke="rgba(239,68,68,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="88" y1="117" x2="235" y2="117" stroke="rgba(239,68,68,0.4)" strokeWidth="1" strokeDasharray="3,2" />

      {/* Slaves */}
      {[{ x: 230, y: 30, label: "Slave 1", csY: 89 }, { x: 230, y: 70, label: "Slave 2", csY: 103 }, { x: 230, y: 110, label: "Slave 3", csY: 117 }].map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y={s.y} width="75" height="36" rx="6" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
          <text x={s.x + 37} y={s.y + 15} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F0F0F5" fontFamily="monospace">{s.label}</text>
          <text x={s.x + 37} y={s.y + 28} textAnchor="middle" fontSize="7" fill="rgba(16,185,129,0.5)" fontFamily="monospace">CS{i + 1}  MOSI MISO SCK</text>
          <line x1={s.x} y1={s.y + 10} x2={s.x - 5} y2={s.y + 10} stroke="#10B981" strokeWidth="1" />
          <line x1={s.x} y1={s.csY - s.y} x2={s.x} y2={s.csY} stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
        </g>
      ))}

      <text x="160" y="155" textAnchor="middle" fontSize="9" fill="rgba(240,240,245,0.3)" fontFamily="monospace">MOSI/MISO/SCK shared · each slave gets own CS</text>
    </svg>
  );
}

// CAN wiring SVG
function CANDiagram() {
  return (
    <svg viewBox="0 0 320 120" width="100%" style={{ maxWidth: 320 }}>
      {/* CAN-H */}
      <line x1="60" y1="45" x2="260" y2="45" stroke="#F59E0B" strokeWidth="2" />
      {/* CAN-L */}
      <line x1="60" y1="65" x2="260" y2="65" stroke="rgba(245,158,11,0.5)" strokeWidth="2" />
      <text x="10" y="49" fontSize="9" fill="#F59E0B" fontFamily="monospace">CAN-H</text>
      <text x="10" y="69" fontSize="9" fill="rgba(245,158,11,0.6)" fontFamily="monospace">CAN-L</text>

      {/* Term resistors */}
      <rect x="50" y="48" width="10" height="14" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text x="55" y="76" textAnchor="middle" fontSize="7" fill="rgba(240,240,245,0.5)" fontFamily="monospace">120Ω</text>
      <rect x="260" y="48" width="10" height="14" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text x="265" y="76" textAnchor="middle" fontSize="7" fill="rgba(240,240,245,0.5)" fontFamily="monospace">120Ω</text>

      {/* Nodes */}
      {[{ x: 90, label: "ECU 1" }, { x: 155, label: "ECU 2" }, { x: 220, label: "ECU 3" }].map(n => (
        <g key={n.label}>
          <rect x={n.x - 25} y="82" width="50" height="30" rx="5" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.35)" strokeWidth="1.2" />
          <text x={n.x} y="100" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F0F0F5" fontFamily="monospace">{n.label}</text>
          <line x1={n.x} y1="82" x2={n.x} y2="65" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
          <line x1={n.x} y1="82" x2={n.x} y2="45" stroke="#F59E0B" strokeWidth="1" />
          <circle cx={n.x} cy="45" r="2.5" fill="#F59E0B" />
          <circle cx={n.x} cy="65" r="2.5" fill="rgba(245,158,11,0.6)" />
        </g>
      ))}

      <text x="160" y="120" textAnchor="middle" fontSize="9" fill="rgba(240,240,245,0.3)" fontFamily="monospace">120Ω at each end · differential pair</text>
    </svg>
  );
}

// RS485 wiring SVG
function RS485Diagram() {
  return (
    <svg viewBox="0 0 320 120" width="100%" style={{ maxWidth: 320 }}>
      {/* A line */}
      <line x1="60" y1="45" x2="270" y2="45" stroke="#EF4444" strokeWidth="2" />
      {/* B line */}
      <line x1="60" y1="65" x2="270" y2="65" stroke="rgba(239,68,68,0.5)" strokeWidth="2" />
      <text x="10" y="49" fontSize="9" fill="#EF4444" fontFamily="monospace">A (+)</text>
      <text x="10" y="69" fontSize="9" fill="rgba(239,68,68,0.6)" fontFamily="monospace">B (−)</text>

      {/* Termination */}
      <rect x="50" y="48" width="10" height="14" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text x="55" y="76" textAnchor="middle" fontSize="7" fill="rgba(240,240,245,0.5)" fontFamily="monospace">120Ω</text>
      <rect x="268" y="48" width="10" height="14" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text x="273" y="76" textAnchor="middle" fontSize="7" fill="rgba(240,240,245,0.5)" fontFamily="monospace">120Ω</text>

      {/* Nodes */}
      {[{ x: 90, label: "Node 1" }, { x: 155, label: "Node 2" }, { x: 220, label: "Node 3" }].map(n => (
        <g key={n.label}>
          <rect x={n.x - 28} y="82" width="56" height="30" rx="5" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.2" />
          <text x={n.x} y="100" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F0F0F5" fontFamily="monospace">{n.label}</text>
          <line x1={n.x} y1="82" x2={n.x} y2="65" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
          <line x1={n.x} y1="82" x2={n.x} y2="45" stroke="#EF4444" strokeWidth="1" />
          <circle cx={n.x} cy="45" r="2.5" fill="#EF4444" />
          <circle cx={n.x} cy="65" r="2.5" fill="rgba(239,68,68,0.6)" />
        </g>
      ))}

      <text x="160" y="120" textAnchor="middle" fontSize="9" fill="rgba(240,240,245,0.3)" fontFamily="monospace">Up to 32 nodes · 1200m range · 120Ω termination</text>
    </svg>
  );
}

const DIAGRAMS: Record<Proto, React.ReactNode> = {
  UART: <UARTDiagram />,
  I2C: <I2CDiagram />,
  SPI: <SPIDiagram />,
  CAN: <CANDiagram />,
  RS485: <RS485Diagram />,
};

export default function WiringComparison({ onUsed }: Props) {
  const [selected, setSelected] = useState<Proto>("UART");
  const usedRef = useRef(false);

  function handleSelect(p: Proto) {
    setSelected(p);
    if (!usedRef.current) { usedRef.current = true; onUsed(); }
  }

  const info = INFOS[selected];
  const protoColor = PROTOCOLS.find(p => p.id === selected)?.color ?? COLOR;

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 08 · Wiring Diagrams</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Protocol Wiring Diagrams</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          Select a protocol to see how devices are physically wired together.
        </p>

        {/* Protocol tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {PROTOCOLS.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="px-4 py-1.5 rounded-xl font-bold text-sm border transition-all"
              style={{
                background: selected === p.id ? `${p.color}18` : "rgba(255,255,255,0.03)",
                borderColor: selected === p.id ? `${p.color}50` : "rgba(255,255,255,0.08)",
                color: selected === p.id ? p.color : "rgba(240,240,245,0.4)",
              }}
            >
              {p.id}
            </button>
          ))}
        </div>

        {/* Diagram */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl p-5 border mb-4"
          style={{ background: "rgba(0,0,0,0.5)", borderColor: `${protoColor}25` }}
        >
          <div className="text-xs font-mono mb-4" style={{ color: `${protoColor}70` }}>{selected} Wiring Diagram</div>
          {DIAGRAMS[selected]}
        </motion.div>

        {/* Info card */}
        <motion.div
          key={`info-${selected}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl p-4 border"
          style={{ background: `${protoColor}08`, borderColor: `${protoColor}25` }}
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-[10px] font-mono mb-0.5" style={{ color: `${protoColor}70` }}>Wire Count</div>
              <div className="text-sm font-bold" style={{ color: "#F0F0F5" }}>{info.wires}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono mb-0.5" style={{ color: `${protoColor}70` }}>Voltage</div>
              <div className="text-sm font-bold" style={{ color: "#F0F0F5" }}>{info.voltage}</div>
            </div>
          </div>
          <div className="text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
            <span className="font-bold" style={{ color: protoColor }}>Note: </span>{info.notes}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
