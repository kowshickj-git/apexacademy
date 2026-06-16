"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#06B6D4";

const MODES = [
  { name: "Active (240MHz)", current: 240, color: "#EF4444", desc: "CPU + WiFi + BLE all running" },
  { name: "Modem Sleep", current: 20, color: "#F59E0B", desc: "CPU active, WiFi/BT off between beacons" },
  { name: "Light Sleep", current: 2, color: "#F59E0B", desc: "CPU paused, RAM retained, fast wake" },
  { name: "Deep Sleep", current: 0.01, color: "#10B981", desc: "CPU off, only RTC active, 10 µA" },
  { name: "Hibernation", current: 0.005, color: "#10B981", desc: "RTC off, only ext wake, 5 µA" },
];

export default function DeepSleepSim({ onUse }: Props) {
  const [batteryMah, setBatteryMah] = useState(2000);
  const [called, setCalled] = useState(false);

  function handleChange(val: number) {
    if (!called) { setCalled(true); onUse(); }
    setBatteryMah(val);
  }

  function lifeDisplay(mah: number, mA: number): string {
    const hours = mah / mA;
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours < 24) return `${hours.toFixed(1)} h`;
    const days = hours / 24;
    if (days < 365) return `${Math.round(days)} days`;
    return `${(days / 365).toFixed(1)} years`;
  }

  const maxCurrent = MODES[0].current;

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 07 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Power Modes & Deep Sleep</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          ESP32 has 5 power modes. Deep sleep at 10 µA enables months of battery life.
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.2)" }}>
          {/* Battery slider */}
          <div className="mb-6 p-4 rounded-xl border" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: "rgba(240,240,245,0.5)" }}>Battery Capacity</span>
              <span className="font-mono font-bold" style={{ color: COLOR }}>{batteryMah} mAh</span>
            </div>
            <input
              type="range" min={100} max={10000} step={100} value={batteryMah}
              onChange={e => handleChange(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] mt-1" style={{ color: "rgba(240,240,245,0.25)" }}>
              <span>100 mAh</span><span>10,000 mAh</span>
            </div>
          </div>

          {/* Mode comparison */}
          <div className="space-y-3">
            {MODES.map((m, i) => {
              const barPct = (Math.log10(m.current + 0.001) + 3) / (Math.log10(maxCurrent) + 3) * 100;
              const life = lifeDisplay(batteryMah, m.current);
              return (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border p-3"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold" style={{ color: "#F0F0F5" }}>{m.name}</span>
                      <span className="ml-2 text-[10px]" style={{ color: "rgba(240,240,245,0.4)" }}>{m.desc}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold" style={{ color: m.color }}>
                        {m.current >= 1 ? `${m.current} mA` : `${m.current * 1000} µA`}
                      </div>
                      <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.4)" }}>{life}</div>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${barPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ background: m.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Deep sleep code */}
          <div className="mt-5 p-3 rounded-xl text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.6)" }}>
            <div style={{ color: "rgba(240,240,245,0.3)" }}>// Wake up after 30 seconds</div>
            <div><span style={{ color: "#F59E0B" }}>esp_sleep_enable_timer_wakeup</span>(30 * 1000000ULL);</div>
            <div style={{ color: "#10B981" }}>esp_deep_sleep_start();</div>
            <div style={{ color: "rgba(240,240,245,0.3)" }}>// CPU stops here — RTC only (10 µA)</div>
          </div>

          {/* Tip */}
          <div className="mt-4 p-3 rounded-xl border" style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}>
            <div className="text-xs font-bold mb-1" style={{ color: "#10B981" }}>RTC Memory Tip</div>
            <div className="text-[11px]" style={{ color: "rgba(240,240,245,0.5)" }}>
              Use <code className="font-mono px-1 rounded" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>RTC_DATA_ATTR</code> attribute to persist variables across deep sleep cycles. The RTC slow memory (8 KB) stays powered at 10 µA.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
