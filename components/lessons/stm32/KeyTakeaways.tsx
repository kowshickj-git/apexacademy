"use client";
import { motion } from "framer-motion";

const TAKEAWAYS = [
  { icon: "🧠", text: "ARM Cortex-M4 @ 168 MHz with hardware FPU and DSP instructions — ideal for real-time signal processing" },
  { icon: "📊", text: "3× 12-bit ADC at 2.4 MSPS, 2× 12-bit DAC — high-precision analog I/O" },
  { icon: "📚", text: "HAL library for portable, readable code; LL library for performance-critical low-level access" },
  { icon: "🚀", text: "DMA for zero-CPU data transfers: UART/SPI/I2C background transfers free the CPU for real-time tasks" },
  { icon: "🔌", text: "4 GPIO modes: Input (float/pull), Output (PP/OD), Alternate Function, Analog. Always enable peripheral clock first!" },
  { icon: "⚡", text: "5V tolerant pins (FT-marked in datasheet) allow direct Arduino interfacing — verify per pin, ADC pins are NOT 5V tolerant" },
  { icon: "⏱️", text: "Timer formula: f = TimerCLK / (PSC+1) / (ARR+1). APB1 max 42 MHz, APB2 max 84 MHz" },
];

export default function KeyTakeaways() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Summary</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Key Takeaways</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>Everything you need to remember about STM32 fundamentals.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TAKEAWAYS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`flex items-start gap-3 rounded-xl border p-4 ${i === TAKEAWAYS.length - 1 && TAKEAWAYS.length % 2 !== 0 ? "sm:col-span-2" : ""}`}
              style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.14)" }}
            >
              <span className="text-lg flex-shrink-0">{t.icon}</span>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.65)" }}>{t.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
