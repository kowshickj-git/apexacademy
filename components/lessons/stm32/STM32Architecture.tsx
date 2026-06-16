"use client";
import { motion } from "framer-motion";

const COLOR = "#0891B2";

const busBlocks = [
  { label: "ARM Cortex-M4", sub: "168MHz + FPU + DSP", color: "#0891B2", bus: "AHB" },
  { label: "DMA1 / DMA2", sub: "8 streams each", color: "#8B5CF6", bus: "AHB" },
  { label: "Flash / SRAM", sub: "2MB / 256KB", color: "#6366F1", bus: "AHB" },
];

const apb2Blocks = [
  { label: "TIM1/TIM8", sub: "Advanced timers" },
  { label: "USART1/6", sub: "High-speed UART" },
  { label: "SPI1/SPI4", sub: "High-speed SPI" },
  { label: "ADC1-3", sub: "12-bit, 2.4MSPS" },
  { label: "SDIO", sub: "SD card interface" },
];

const apb1Blocks = [
  { label: "TIM2-TIM14", sub: "General timers" },
  { label: "USART2-5", sub: "General UART" },
  { label: "SPI2/SPI3", sub: "General SPI" },
  { label: "I2C1-3", sub: "I2C buses" },
  { label: "CAN1/CAN2", sub: "CAN bus" },
];

export default function STM32Architecture() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 02 · Architecture</p>
        <h2 className="text-2xl font-black mb-3" style={{ color: "#F0F0F5" }}>STM32 Bus Architecture</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          AHB (Advanced High-performance Bus) connects the core and DMA. APB1 (max 42 MHz) and APB2 (max 84 MHz) connect peripherals.
        </p>

        <div className="space-y-4">
          {/* AHB row */}
          <div>
            <div className="text-[10px] font-mono mb-2 px-1" style={{ color: "rgba(8,145,178,0.6)" }}>AHB Bus — 168 MHz</div>
            <div className="grid grid-cols-3 gap-2">
              {busBlocks.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl border p-3 text-center"
                  style={{ background: `${b.color}10`, borderColor: `${b.color}30` }}
                >
                  <div className="text-xs font-black mb-0.5" style={{ color: b.color }}>{b.label}</div>
                  <div className="text-[9px]" style={{ color: "rgba(240,240,245,0.35)" }}>{b.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* APB bridge */}
          <div className="flex gap-2 items-center px-2">
            <div className="flex-1 h-0.5 rounded" style={{ background: "rgba(8,145,178,0.3)" }} />
            <span className="text-[9px] font-mono px-2" style={{ color: "rgba(240,240,245,0.3)" }}>APB Bridge</span>
            <div className="flex-1 h-0.5 rounded" style={{ background: "rgba(8,145,178,0.3)" }} />
          </div>

          {/* APB buses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-mono mb-2 px-1" style={{ color: "rgba(245,158,11,0.6)" }}>APB2 — max 84 MHz</div>
              <div className="space-y-1.5">
                {apb2Blocks.map((b, i) => (
                  <motion.div
                    key={b.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                    style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.15)" }}
                  >
                    <div className="text-xs font-bold" style={{ color: "#F59E0B" }}>{b.label}</div>
                    <div className="text-[9px]" style={{ color: "rgba(240,240,245,0.35)" }}>{b.sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono mb-2 px-1" style={{ color: "rgba(16,185,129,0.6)" }}>APB1 — max 42 MHz</div>
              <div className="space-y-1.5">
                {apb1Blocks.map((b, i) => (
                  <motion.div
                    key={b.label}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                    style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.15)" }}
                  >
                    <div className="text-xs font-bold" style={{ color: "#10B981" }}>{b.label}</div>
                    <div className="text-[9px]" style={{ color: "rgba(240,240,245,0.35)" }}>{b.sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* GPIO ports */}
          <div className="rounded-2xl border p-4" style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.15)" }}>
            <div className="text-xs font-bold mb-2" style={{ color: COLOR }}>GPIO Ports (AHB1)</div>
            <div className="flex gap-2 flex-wrap">
              {["GPIOA", "GPIOB", "GPIOC", "GPIOD", "GPIOE", "GPIOF", "GPIOG", "GPIOH", "GPIOI"].map(p => (
                <span key={p} className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: "rgba(8,145,178,0.1)", color: COLOR }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
