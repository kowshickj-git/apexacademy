"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props { onRead: () => void; }

const COLOR = "#06B6D4";

const specs = [
  { label: "CPU", value: "Dual-core Xtensa LX6 @ 240MHz" },
  { label: "SRAM", value: "520 KB" },
  { label: "Flash", value: "4 MB (external)" },
  { label: "WiFi", value: "802.11 b/g/n (2.4 GHz)" },
  { label: "Bluetooth", value: "BT 4.2 + BLE 5.0" },
  { label: "GPIO", value: "34 pins" },
  { label: "ADC", value: "18× (12-bit)" },
  { label: "DAC", value: "2× (8-bit)" },
  { label: "Touch", value: "10× capacitive" },
  { label: "PWM", value: "16 channels" },
  { label: "Deep Sleep", value: "10 µA" },
  { label: "Logic Level", value: "3.3 V" },
];

export default function WhatIsESP32({ onRead }: Props) {
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
        <h2 className="text-2xl font-black mb-3" style={{ color: "#F0F0F5" }}>What is the ESP32?</h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>
          The <span style={{ color: COLOR, fontWeight: 700 }}>ESP32</span> is Espressif's flagship System-on-Chip (SoC) — a dual-core Xtensa LX6
          processor running at up to 240 MHz with built-in WiFi 802.11 b/g/n and Bluetooth 4.2 / BLE 5.0. It packs 520 KB of SRAM,
          support for external flash, and a rich peripheral set into a single affordable chip. With deep sleep current as low as
          10 µA, it's the go-to choice for battery-powered IoT applications, smart home devices, wearables, and industrial sensors.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {specs.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border p-3"
              style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.15)" }}
            >
              <div className="text-[10px] font-mono mb-0.5" style={{ color: "rgba(6,182,212,0.6)" }}>{s.label}</div>
              <div className="text-xs font-bold" style={{ color: "#F0F0F5" }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,182,212,0.05)", borderColor: "rgba(6,182,212,0.2)" }}>
          <div className="text-xs font-bold mb-2" style={{ color: COLOR }}>Why ESP32 dominates IoT</div>
          <ul className="space-y-1.5">
            {[
              "Dual-core lets you run WiFi networking on one core and your application on the other simultaneously",
              "Built-in WiFi + BLE eliminates external radio modules, reducing BOM cost and PCB complexity",
              "Ultra-low power modes (10 µA deep sleep) enable months of battery life on a single charge",
              "Rich peripheral set: 4× SPI, 2× I2S, 2× I2C, 3× UART, 16× PWM, 18× ADC, 2× DAC, 10× touch",
              "Large ecosystem: Arduino, ESP-IDF, MicroPython, FreeRTOS — all supported out of the box",
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "rgba(240,240,245,0.6)" }}>
                <svg className="mt-0.5 flex-shrink-0" width="8" height="8" viewBox="0 0 8 8">
                  <path d="M1 4l2 2 4-4" stroke={COLOR} strokeWidth="1.3" strokeLinecap="round" fill="none" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
