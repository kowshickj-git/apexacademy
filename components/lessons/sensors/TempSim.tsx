"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#0EA5E9";

function getTempColor(temp: number): string {
  if (temp < 0) return "#60A5FA";
  if (temp < 15) return "#06B6D4";
  if (temp < 25) return "#10B981";
  if (temp < 40) return "#F59E0B";
  return "#EF4444";
}

function getTempLabel(temp: number): string {
  if (temp < 0) return "Below Freezing — Water turns to ice";
  if (temp < 10) return "Very Cold — Near freezing";
  if (temp < 15) return "Cool — Light jacket weather";
  if (temp < 20) return "Comfortable Room Temperature";
  if (temp < 25) return "Ideal Room Temperature";
  if (temp < 35) return "Warm — Summer day";
  if (temp < 40) return "Hot — Tropical heat";
  if (temp < 50) return "Very Hot — Desert conditions";
  return "Extreme Heat — Electronic danger zone";
}

export default function TempSim({ onUsed }: Props) {
  const [temp, setTemp] = useState(25);
  const [positions, setPositions] = useState<Set<number>>(new Set([2]));
  const [called, setCalled] = useState(false);

  const lm35Voltage = temp * 10; // mV
  const tempF = (temp * 9 / 5 + 32).toFixed(1);
  const adcReading = Math.round((lm35Voltage / 3300) * 1023);
  const thermFillPct = ((temp + 10) / 95) * 100; // -10 to 85
  const tempColor = getTempColor(temp);

  function handleSlider(val: number) {
    setTemp(val);
    const bucket = Math.floor((val + 10) / 32);
    setPositions(prev => {
      const next = new Set(prev).add(bucket);
      if (next.size >= 3 && !called) {
        setCalled(true);
        onUsed();
      }
      return next;
    });
  }

  const dht11InRange = temp >= 0 && temp <= 50;

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 05 · Simulator
        </p>
        <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>Temperature Sensor Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Compare LM35 (analog) vs DHT11 (digital) temperature sensors. See how temperature converts to voltage and ADC values.
        </p>
      </motion.div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(14,165,233,0.04)", borderColor: "rgba(14,165,233,0.2)" }}>
        <div className="p-6">
          {/* Thermometer + readings */}
          <div className="flex gap-6 mb-6">
            {/* Animated thermometer */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.4)" }}>{temp}°C</div>
              <div className="relative w-8 h-40 flex items-end justify-center">
                {/* Tube */}
                <div className="absolute inset-x-2 top-0 bottom-6 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 rounded-full"
                    style={{ background: `linear-gradient(to top, ${tempColor}, ${tempColor}99)` }}
                    animate={{ height: `${Math.max(5, Math.min(100, thermFillPct))}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                {/* Bulb */}
                <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: tempColor, boxShadow: `0 0 16px ${tempColor}60` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>
              <div className="text-xs font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>{tempF}°F</div>
            </div>

            {/* Right side readings */}
            <div className="flex-1 space-y-3">
              {/* LM35 */}
              <div className="rounded-xl p-3 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="text-xs font-bold mb-2" style={{ color: "#F0F0F5" }}>LM35 Analog Temperature Sensor</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Output Voltage</div>
                    <div className="text-base font-black font-mono" style={{ color: tempColor }}>
                      {lm35Voltage} mV
                    </div>
                    <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.3)" }}>{temp}°C × 10mV/°C</div>
                  </div>
                  <div>
                    <div className="text-[10px] mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Arduino ADC</div>
                    <div className="text-base font-black font-mono" style={{ color: COLOR }}>
                      {adcReading}
                    </div>
                    <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.3)" }}>({lm35Voltage}mV / 3300mV) × 1023</div>
                  </div>
                </div>
              </div>

              {/* DHT11 */}
              <div className="rounded-xl p-3 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: dht11InRange ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-xs font-bold" style={{ color: "#F0F0F5" }}>DHT11 Digital Sensor</div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono`} style={{ background: dht11InRange ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: dht11InRange ? "#10B981" : "#EF4444", border: `1px solid ${dht11InRange ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                    {dht11InRange ? "IN RANGE" : "OUT OF RANGE"}
                  </span>
                </div>
                <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.4)" }}>
                  Range: 0–50°C ±2°C | Humidity: 20–90% RH ±5% | Outputs 40-bit serial frame
                </div>
                {dht11InRange ? (
                  <div className="text-[10px] mt-1 font-mono" style={{ color: "#10B981" }}>
                    Reading: {temp}°C, humidity data available via DHT library
                  </div>
                ) : (
                  <div className="text-[10px] mt-1" style={{ color: "#EF4444" }}>
                    {temp < 0 ? "Too cold for DHT11. Use DHT22 (−40°C to 80°C)" : "Too hot. Use DS18B20 for −55°C to +125°C"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: "rgba(240,240,245,0.4)" }}>Temperature</span>
              <span className="font-mono font-bold" style={{ color: tempColor }}>{temp}°C / {tempF}°F</span>
            </div>
            <input
              type="range" min={-10} max={85} value={temp}
              onChange={e => handleSlider(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: tempColor }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: "rgba(240,240,245,0.25)" }}>
              <span>-10°C</span><span>0°C (Ice)</span><span>25°C (Room)</span><span>85°C</span>
            </div>
          </div>

          {/* Real-world label */}
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: `${tempColor}10`, border: `1px solid ${tempColor}30` }}>
            <motion.div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tempColor }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <span className="text-sm font-semibold" style={{ color: tempColor }}>{getTempLabel(temp)}</span>
          </div>
        </div>

        {/* Arduino code */}
        <div className="px-6 pb-6 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="rounded-xl p-3 font-mono text-xs" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "rgba(240,240,245,0.3)" }}>// LM35 on Arduino Uno (5V reference)</div>
            <div><span style={{ color: "#10B981" }}>int</span> <span style={{ color: "#F0F0F5" }}>raw = </span><span style={{ color: COLOR }}>analogRead</span><span style={{ color: "#F0F0F5" }}>(A0); </span><span style={{ color: "rgba(240,240,245,0.3)" }}>// 0–1023</span></div>
            <div><span style={{ color: "#10B981" }}>float</span> <span style={{ color: "#F0F0F5" }}>voltage = raw * (</span><span style={{ color: "#F59E0B" }}>5000.0</span><span style={{ color: "#F0F0F5" }}>/</span><span style={{ color: "#F59E0B" }}>1024</span><span style={{ color: "#F0F0F5" }}>); </span><span style={{ color: "rgba(240,240,245,0.3)" }}>// mV</span></div>
            <div><span style={{ color: "#10B981" }}>float</span> <span style={{ color: "#F0F0F5" }}>temp = voltage / </span><span style={{ color: "#F59E0B" }}>10.0</span><span style={{ color: "#F0F0F5" }}>; </span><span style={{ color: "rgba(240,240,245,0.3)" }}>// °C</span></div>
            <div className="mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>// Current: raw={adcReading} → {lm35Voltage}mV → {temp}°C</div>
          </div>
        </div>
      </div>

      {called && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs mt-2 text-center font-bold" style={{ color: "#10B981" }}>
          +25 XP earned! Temperature sensor mastered.
        </motion.p>
      )}
    </section>
  );
}
