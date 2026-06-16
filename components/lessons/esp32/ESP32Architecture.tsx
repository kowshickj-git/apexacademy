"use client";
import { motion } from "framer-motion";

const COLOR = "#06B6D4";

const blocks = [
  { label: "Core 0\nXtensa LX6", sub: "App CPU", col: 1, row: 1, color: "#06B6D4" },
  { label: "Core 1\nXtensa LX6", sub: "PRO CPU", col: 2, row: 1, color: "#06B6D4" },
  { label: "520 KB\nSRAM", sub: "Internal Memory", col: 3, row: 1, color: "#8B5CF6" },
  { label: "WiFi\nMAC/BB/RF", sub: "802.11 b/g/n", col: 1, row: 2, color: "#10B981" },
  { label: "BT/BLE\nController", sub: "4.2 + BLE 5.0", col: 2, row: 2, color: "#10B981" },
  { label: "RTC\n& ULP", sub: "Ultra Low Power", col: 3, row: 2, color: "#F59E0B" },
  { label: "GPIO Matrix\n34 Pins", sub: "Configurable", col: 1, row: 3, color: "#EF4444" },
  { label: "ADC/DAC\n18×12-bit / 2×8-bit", sub: "Analog I/O", col: 2, row: 3, color: "#EF4444" },
  { label: "Peripherals\nSPI/I2C/UART/PWM", sub: "Communication", col: 3, row: 3, color: "#EF4444" },
];

export default function ESP32Architecture() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 02 · Architecture</p>
        <h2 className="text-2xl font-black mb-3" style={{ color: "#F0F0F5" }}>ESP32 Internal Architecture</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          The ESP32 integrates two Xtensa LX6 cores connected via an internal bus to memory, radio subsystems, and peripheral controllers.
        </p>

        {/* Chip diagram */}
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{ background: "rgba(6,182,212,0.03)", borderColor: "rgba(6,182,212,0.2)" }}
        >
          <div className="text-center text-xs font-mono mb-4" style={{ color: "rgba(6,182,212,0.5)" }}>ESP32-D0WDQ6 Die</div>
          <div className="grid grid-cols-3 gap-2">
            {blocks.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border p-3 text-center"
                style={{
                  background: `${b.color}10`,
                  borderColor: `${b.color}30`,
                }}
              >
                <div className="text-[10px] font-black leading-tight mb-1 whitespace-pre-line" style={{ color: b.color }}>{b.label}</div>
                <div className="text-[8px]" style={{ color: "rgba(240,240,245,0.35)" }}>{b.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Bus line */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-0.5 rounded" style={{ background: `linear-gradient(90deg, ${COLOR}40, ${COLOR}80, ${COLOR}40)` }} />
            <span className="text-[9px] font-mono" style={{ color: "rgba(6,182,212,0.5)" }}>Internal Bus Matrix</span>
            <div className="flex-1 h-0.5 rounded" style={{ background: `linear-gradient(90deg, ${COLOR}40, ${COLOR}80, ${COLOR}40)` }} />
          </div>
        </div>

        {/* Core specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4" style={{ background: "rgba(6,182,212,0.05)", borderColor: "rgba(6,182,212,0.2)" }}>
            <div className="text-xs font-bold mb-3" style={{ color: COLOR }}>Xtensa LX6 Core</div>
            <div className="space-y-1.5">
              {[
                ["Architecture", "32-bit RISC"],
                ["Frequency", "Up to 240 MHz"],
                ["Cores", "2 (symmetric)"],
                ["Pipeline", "5-stage"],
                ["Cache", "32 KB instruction + 32 KB data per core"],
                ["FPU", "Hardware floating point"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span style={{ color: "rgba(240,240,245,0.4)" }}>{k}</span>
                  <span style={{ color: "rgba(240,240,245,0.75)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}>
            <div className="text-xs font-bold mb-3" style={{ color: "#10B981" }}>Radio Block</div>
            <div className="space-y-1.5">
              {[
                ["WiFi Standard", "802.11 b/g/n"],
                ["WiFi Band", "2.4 GHz"],
                ["Max PHY rate", "150 Mbps"],
                ["BT Classic", "v4.2 BR/EDR"],
                ["BLE", "v5.0"],
                ["Range", "~200m open air"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span style={{ color: "rgba(240,240,245,0.4)" }}>{k}</span>
                  <span style={{ color: "rgba(240,240,245,0.75)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
