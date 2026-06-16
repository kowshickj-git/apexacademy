"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#8B5CF6";

interface Protocol {
  name: string;
  wires: string;
  speed: string;
  distance: string;
  devices: string;
  mode: string;
  color: string;
  use: string;
  notes: string;
}

const PROTOCOLS: Protocol[] = [
  { name: "UART", wires: "2 (TX, RX)", speed: "Up to 1 Mbps", distance: "~15m TTL", devices: "Point-to-point", mode: "Full duplex", color: "#8B5CF6", use: "Debug, GPS, Bluetooth modules", notes: "No shared clock. Both sides must agree on baud rate. Simple but only 2 devices." },
  { name: "I2C", wires: "2 (SDA, SCL)", speed: "100k / 400k / 1Mbps", distance: "~1m", devices: "Up to 127", mode: "Half duplex", color: "#06B6D4", use: "Sensors, EEPROMs, RTCs", notes: "Requires pull-up resistors. Master controls clock. Address-based multi-device." },
  { name: "SPI", wires: "4 (MOSI, MISO, SCK, CS)", speed: "Up to 50+ MHz", distance: "Short (<30cm)", devices: "Master + slaves", mode: "Full duplex", color: "#10B981", use: "Displays, SD cards, ADCs", notes: "Fastest of all. Each slave needs own CS line. More wires but maximum speed." },
  { name: "CAN", wires: "2 (CAN-H, CAN-L)", speed: "Up to 1 Mbps", distance: "Up to 500m", devices: "Up to 112", mode: "Half duplex", color: "#F59E0B", use: "Automotive, industrial machinery", notes: "Differential signaling = high noise immunity. Multi-master. Used in every car since 2008." },
  { name: "RS485", wires: "2 (A, B)", speed: "Up to 10 Mbps", distance: "Up to 1200m", devices: "Up to 32", mode: "Half duplex", color: "#EF4444", use: "Industrial, MODBUS, building automation", notes: "Longest range protocol. Differential pair. 120Ω termination resistors at both ends." },
];

const FILTERS = ["All", "Full Duplex", "Half Duplex", "Long Range"];

export default function ProtocolComparison() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = PROTOCOLS.filter(p => {
    if (filter === "All") return true;
    if (filter === "Full Duplex") return p.mode === "Full duplex";
    if (filter === "Half Duplex") return p.mode === "Half duplex";
    if (filter === "Long Range") return p.name === "CAN" || p.name === "RS485";
    return true;
  });

  const detail = PROTOCOLS.find(p => p.name === selected);

  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 03 · Protocol Overview</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Protocol Comparison Table</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.45)" }}>
          Five major embedded protocols — click any row to see details.
        </p>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{
                borderColor: filter === f ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)",
                background: filter === f ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                color: filter === f ? COLOR : "rgba(240,240,245,0.4)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border mb-4" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {/* Header */}
          <div className="grid grid-cols-5 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(240,240,245,0.3)" }}>
            <div>Protocol</div>
            <div>Wires</div>
            <div>Speed</div>
            <div>Distance</div>
            <div>Mode</div>
          </div>

          {/* Rows */}
          {filtered.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(selected === p.name ? null : p.name)}
              className="grid grid-cols-5 px-4 py-3 cursor-pointer transition-all"
              style={{
                background: selected === p.name ? `rgba(139,92,246,0.10)` : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                borderLeft: selected === p.name ? `2px solid ${p.color}` : "2px solid transparent",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <span className="text-sm font-bold" style={{ color: selected === p.name ? p.color : "#F0F0F5" }}>{p.name}</span>
              </div>
              <div className="text-xs self-center" style={{ color: "rgba(240,240,245,0.55)" }}>{p.wires}</div>
              <div className="text-xs self-center" style={{ color: "rgba(240,240,245,0.55)" }}>{p.speed}</div>
              <div className="text-xs self-center" style={{ color: "rgba(240,240,245,0.55)" }}>{p.distance}</div>
              <div className="text-xs self-center">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: p.mode === "Full duplex" ? "rgba(139,92,246,0.12)" : "rgba(245,158,11,0.1)",
                    color: p.mode === "Full duplex" ? COLOR : "#F59E0B",
                    border: `1px solid ${p.mode === "Full duplex" ? "rgba(139,92,246,0.25)" : "rgba(245,158,11,0.25)"}`,
                  }}
                >
                  {p.mode}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {detail && (
            <motion.div
              key={detail.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-5 border"
              style={{ borderColor: `${detail.color}40`, background: `rgba(5,5,7,0.8)` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: detail.color }} />
                <h3 className="text-lg font-black" style={{ color: detail.color }}>{detail.name}</h3>
                <span className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>— details</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { label: "Wires", value: detail.wires },
                  { label: "Speed", value: detail.speed },
                  { label: "Max Distance", value: detail.distance },
                  { label: "Devices", value: detail.devices },
                  { label: "Duplex Mode", value: detail.mode },
                  { label: "Common Uses", value: detail.use },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-[10px] font-mono mb-0.5" style={{ color: `${detail.color}80` }}>{item.label}</div>
                    <div className="text-xs font-semibold" style={{ color: "#F0F0F5" }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(240,240,245,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="font-bold" style={{ color: detail.color }}>Note: </span>{detail.notes}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
