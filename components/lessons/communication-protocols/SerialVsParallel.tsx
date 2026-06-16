"use client";
import { motion } from "framer-motion";

const COLOR = "#8B5CF6";

const SERIAL_BITS = [1, 0, 1, 1, 0, 0, 1, 0];

export default function SerialVsParallel() {
  return (
    <section className="py-10 border-b border-white/5">
      <div className="max-w-3xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 02 · Data Transmission</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#F0F0F5" }}>Serial vs Parallel Communication</h2>
        <p className="text-sm mb-8" style={{ color: "rgba(240,240,245,0.45)" }}>
          Two fundamental ways to send binary data between devices — each with distinct trade-offs.
        </p>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Serial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-5 border"
            style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔗</span>
              <h3 className="text-lg font-bold" style={{ color: "#F0F0F5" }}>Serial</h3>
              <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}>
                Modern Standard
              </span>
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(240,240,245,0.55)" }}>
              Bits are sent <strong style={{ color: COLOR }}>one at a time</strong> on a single wire. Slower raw bit rate but fewer wires, less crosstalk, and works over long distances.
            </p>

            {/* Serial animation */}
            <div className="relative h-12 rounded-xl overflow-hidden mb-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <div className="absolute inset-0 flex items-center px-3">
                <div className="w-full h-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.2)" }} />
              </div>
              <div className="absolute inset-0 flex items-center px-3 gap-1">
                {SERIAL_BITS.map((bit, i) => (
                  <motion.div
                    key={i}
                    className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0"
                    style={{
                      background: bit ? `rgba(139,92,246,0.3)` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${bit ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                      color: bit ? COLOR : "rgba(240,240,245,0.3)",
                    }}
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.18, duration: 0.35, repeat: Infinity, repeatDelay: 1.5 }}
                  >
                    {bit}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="text-[10px] font-mono mb-1" style={{ color: "rgba(240,240,245,0.3)" }}>1 wire · bits flow one by one</div>

            <div className="space-y-1 mt-3">
              {["Fewer wires (1-4)", "Long distance friendly", "Less electromagnetic interference", "Examples: UART, I2C, SPI, CAN"].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
                  <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round" fill="none" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Parallel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-5 border"
            style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔀</span>
              <h3 className="text-lg font-bold" style={{ color: "#F0F0F5" }}>Parallel</h3>
              <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
                Legacy
              </span>
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(240,240,245,0.55)" }}>
              Multiple bits travel <strong style={{ color: "#F59E0B" }}>simultaneously</strong> on multiple wires. Faster at low speeds but many wires cause crosstalk at high frequencies.
            </p>

            {/* Parallel animation */}
            <div className="relative rounded-xl overflow-hidden mb-4 p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(245,158,11,0.12)" }}>
              <div className="space-y-1.5">
                {SERIAL_BITS.map((bit, i) => (
                  <div key={i} className="flex items-center gap-2 h-5">
                    <div className="w-3 text-[8px] font-mono text-right flex-shrink-0" style={{ color: "rgba(245,158,11,0.4)" }}>D{i}</div>
                    <div className="flex-1 h-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)" }} />
                    <motion.div
                      className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold font-mono"
                      style={{
                        background: bit ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${bit ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.06)"}`,
                        color: bit ? "#F59E0B" : "rgba(240,240,245,0.25)",
                      }}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                    >
                      {bit}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] font-mono mb-1" style={{ color: "rgba(240,240,245,0.3)" }}>8 wires · all bits at once</div>

            <div className="space-y-1 mt-3">
              {["8 wires for 8-bit data", "Crosstalk at high frequencies", "Short distance (< 30cm)", "Examples: Old printer port, CPU buses"].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
                  <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="2.5" fill="rgba(245,158,11,0.5)" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Modern trend callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl p-5 border"
          style={{ background: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.25)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <div className="text-sm font-bold mb-1" style={{ color: COLOR }}>The Modern Trend: Serial Wins at High Speed</div>
              <p className="text-xs" style={{ color: "rgba(240,240,245,0.55)" }}>
                At high frequencies, serial beats parallel! Parallel buses suffer from <strong style={{ color: "#F0F0F5" }}>crosstalk</strong> (wires interfering with each other),
                <strong style={{ color: "#F0F0F5" }}> skew</strong> (bits arriving at different times), and require massive connectors.
                USB 3.0, PCIe, SATA, Thunderbolt — all modern high-speed buses are <span style={{ color: COLOR, fontWeight: 700 }}>serial</span>.
                Fewer pins, easier PCB routing, less EMI.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
