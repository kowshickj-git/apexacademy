"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props { onRead: () => void; }

const COLOR = "#0891B2";

const families = [
  { name: "STM32F0", core: "Cortex-M0", freq: "48 MHz", flash: "4–256 KB", use: "Entry-level, cost-sensitive" },
  { name: "STM32F1", core: "Cortex-M3", freq: "72 MHz", flash: "16 KB–1 MB", use: "General purpose" },
  { name: "STM32F4", core: "Cortex-M4 + FPU", freq: "168 MHz", flash: "256 KB–2 MB", use: "High performance, DSP" },
  { name: "STM32H7", core: "Cortex-M7 + FPU", freq: "480 MHz", flash: "1–2 MB", use: "Ultra-high performance" },
  { name: "STM32L4", core: "Cortex-M4 + FPU", freq: "80 MHz", flash: "256 KB–2 MB", use: "Ultra-low power" },
  { name: "STM32G4", core: "Cortex-M4 + FPU", freq: "170 MHz", flash: "32 KB–512 KB", use: "Motor control, power" },
];

export default function WhatIsSTM32({ onRead }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [called, setCalled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !called) { setCalled(true); onRead(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [called, onRead]);

  return (
    <section ref={ref} className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 01 · Overview</p>
        <h2 className="text-2xl font-black mb-3" style={{ color: "#F0F0F5" }}>What is the STM32?</h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>
          The <span style={{ color: COLOR, fontWeight: 700 }}>STM32</span> is STMicroelectronics' family of 32-bit microcontrollers based on ARM Cortex-M cores.
          The popular <span style={{ color: COLOR, fontWeight: 600 }}>STM32F4</span> series features a Cortex-M4 running at 168 MHz with a hardware FPU and DSP
          instructions — making it ideal for motor control, audio processing, and real-time control applications.
          STM32 is the industry standard in professional embedded systems: you'll find it in drones, medical devices, industrial controllers, and automotive ECUs.
        </p>

        <div className="rounded-2xl border p-5 mb-6" style={{ background: "rgba(8,145,178,0.05)", borderColor: "rgba(8,145,178,0.2)" }}>
          <div className="text-xs font-bold mb-3" style={{ color: COLOR }}>STM32F4 Key Specifications</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              ["Core", "ARM Cortex-M4 + FPU"],
              ["Frequency", "168 MHz"],
              ["Flash", "256 KB – 2 MB"],
              ["SRAM", "64 KB – 256 KB"],
              ["ADC", "3× 12-bit (2.4 MSPS)"],
              ["DAC", "2× 12-bit"],
              ["Timers", "Up to 17 (16/32-bit)"],
              ["GPIO Ports", "A through K"],
              ["UART/USART", "Up to 6"],
              ["SPI", "Up to 3"],
              ["I2C", "Up to 3"],
              ["Logic Level", "3.3V (5V tolerant pins)"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border p-2.5" style={{ background: "rgba(8,145,178,0.04)", borderColor: "rgba(8,145,178,0.14)" }}>
                <div className="text-[9px] font-mono mb-0.5" style={{ color: "rgba(8,145,178,0.6)" }}>{k}</div>
                <div className="text-xs font-bold" style={{ color: "#F0F0F5" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Family table */}
        <div>
          <div className="text-xs font-bold mb-3" style={{ color: "rgba(240,240,245,0.6)" }}>STM32 Family Overview</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Family", "Core", "Max Freq", "Flash", "Use Case"].map(h => (
                    <th key={h} className="text-left pb-2 pr-4" style={{ color: "rgba(240,240,245,0.35)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {families.map((f, i) => (
                  <motion.tr
                    key={f.name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-2 pr-4 font-mono font-bold" style={{ color: f.name === "STM32F4" ? COLOR : "#F0F0F5" }}>{f.name}</td>
                    <td className="py-2 pr-4" style={{ color: "rgba(240,240,245,0.6)" }}>{f.core}</td>
                    <td className="py-2 pr-4 font-mono" style={{ color: "rgba(240,240,245,0.6)" }}>{f.freq}</td>
                    <td className="py-2 pr-4" style={{ color: "rgba(240,240,245,0.5)" }}>{f.flash}</td>
                    <td className="py-2" style={{ color: "rgba(240,240,245,0.45)" }}>{f.use}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
