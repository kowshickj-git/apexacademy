"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#0EA5E9";

function getDistanceDecision(d: number) {
  if (d < 20) return { text: "OBSTACLE! — Stop immediately!", color: "#EF4444", emoji: "🛑" };
  if (d < 100) return { text: "Object nearby — Slowing down", color: "#F59E0B", emoji: "⚠️" };
  return { text: "Path clear — Moving forward", color: "#10B981", emoji: "✅" };
}

function getTempDecision(t: number) {
  if (t > 50) return { text: "Overheating! — Activating cooling fan", color: "#EF4444", emoji: "🌡️" };
  if (t > 35) return { text: "Warm — Monitor closely", color: "#F59E0B", emoji: "⚡" };
  return { text: "Temperature normal", color: "#10B981", emoji: "✅" };
}

function getLightDecision(l: number) {
  if (l < 20) return { text: "Dark — Activating headlights", color: COLOR, emoji: "💡" };
  if (l < 50) return { text: "Dim — Adjusting sensors", color: "#F59E0B", emoji: "🔦" };
  return { text: "Good visibility", color: "#10B981", emoji: "✅" };
}

export default function RobotDashboard({ onUsed }: Props) {
  const [distance, setDistance] = useState(150);
  const [temp, setTemp] = useState(28);
  const [light, setLight] = useState(70);
  const [motionDetected, setMotionDetected] = useState(false);
  const [called, setCalled] = useState(false);

  function handleChange() {
    if (!called) {
      setCalled(true);
      onUsed();
    }
  }

  const distDec = getDistanceDecision(distance);
  const tempDec = getTempDecision(temp);
  const lightDec = getLightDecision(light);

  // Robot face mood
  const robotMood = distance < 20 ? "scared" : motionDetected ? "alert" : temp > 50 ? "hot" : "happy";
  const faceColor =
    robotMood === "scared" ? "#EF4444" :
    robotMood === "alert" ? "#F59E0B" :
    robotMood === "hot" ? "#F97316" :
    COLOR;

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 08 · Dashboard
        </p>
        <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>Robot Sensor Dashboard</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          A virtual robot reads all sensors simultaneously and makes real-time decisions. Adjust the sliders to see how the robot brain responds.
        </p>
      </motion.div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(14,165,233,0.03)", borderColor: "rgba(14,165,233,0.2)" }}>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Robot visual */}
            <div>
              <div className="flex flex-col items-center p-6 rounded-2xl mb-4 border" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.07)" }}>
                {/* Robot head */}
                <motion.div
                  className="relative mb-2"
                  animate={{ rotate: robotMood === "scared" ? [-3, 3, -3, 3, 0] : [0] }}
                  transition={{ duration: 0.4, repeat: robotMood === "scared" ? 3 : 0 }}
                >
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    {/* Head */}
                    <rect x="10" y="10" width="60" height="55" rx="10" fill={`${faceColor}15`} stroke={faceColor} strokeWidth="1.5" />
                    {/* Antenna */}
                    <line x1="40" y1="10" x2="40" y2="2" stroke={faceColor} strokeWidth="1.5" />
                    <circle cx="40" cy="1" r="2" fill={faceColor} />

                    {/* Eyes */}
                    {robotMood === "scared" ? (
                      <>
                        <ellipse cx="27" cy="30" rx="6" ry="8" fill={faceColor} opacity="0.9" />
                        <ellipse cx="53" cy="30" rx="6" ry="8" fill={faceColor} opacity="0.9" />
                      </>
                    ) : robotMood === "alert" ? (
                      <>
                        <rect x="21" y="24" width="12" height="10" rx="2" fill="#F59E0B" />
                        <rect x="47" y="24" width="12" height="10" rx="2" fill="#F59E0B" />
                        <circle cx="27" cy="29" r="3" fill="black" />
                        <circle cx="53" cy="29" r="3" fill="black" />
                      </>
                    ) : (
                      <>
                        <circle cx="27" cy="30" r="7" fill={faceColor} opacity="0.2" />
                        <circle cx="27" cy="30" r="5" fill={faceColor} opacity="0.9" />
                        <circle cx="53" cy="30" r="7" fill={faceColor} opacity="0.2" />
                        <circle cx="53" cy="30" r="5" fill={faceColor} opacity="0.9" />
                        <circle cx="29" cy="28" r="2" fill="white" />
                        <circle cx="55" cy="28" r="2" fill="white" />
                      </>
                    )}

                    {/* Mouth */}
                    {robotMood === "happy" ? (
                      <path d="M 28 48 Q 40 58 52 48" stroke={faceColor} strokeWidth="2" fill="none" strokeLinecap="round" />
                    ) : robotMood === "scared" ? (
                      <path d="M 28 52 Q 40 44 52 52" stroke="#EF4444" strokeWidth="2" fill="none" strokeLinecap="round" />
                    ) : robotMood === "hot" ? (
                      <path d="M 28 50 L 52 50" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                    ) : (
                      <rect x="28" y="48" width="24" height="6" rx="2" fill="rgba(245,158,11,0.3)" stroke="#F59E0B" strokeWidth="1" />
                    )}

                    {/* Status light */}
                    <circle cx="70" cy="15" r="4" fill={robotMood === "happy" ? "#10B981" : robotMood === "alert" ? "#F59E0B" : "#EF4444"} />
                  </svg>
                </motion.div>

                <div className="text-sm font-bold mb-1" style={{ color: faceColor }}>
                  APEX Robot v1.0
                </div>
                <div className="text-xs text-center" style={{ color: "rgba(240,240,245,0.45)" }}>
                  {robotMood === "happy" && "All systems nominal — operating normally"}
                  {robotMood === "scared" && "Emergency stop! Obstacle at " + distance + "cm!"}
                  {robotMood === "alert" && "Human detected! Activating alert protocol"}
                  {robotMood === "hot" && "Critical temperature! Cooling needed!"}
                </div>
              </div>

              {/* Sensor LED indicators */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Ultrasonic", active: distance < 100, color: distance < 20 ? "#EF4444" : "#F59E0B", icon: "📡" },
                  { label: "Temperature", active: temp > 35, color: temp > 50 ? "#EF4444" : "#F59E0B", icon: "🌡️" },
                  { label: "Light Sensor", active: light < 50, color: COLOR, icon: "💡" },
                  { label: "PIR Motion", active: motionDetected, color: "#F59E0B", icon: "🚶" },
                ].map(({ label, active, color, icon }) => (
                  <div key={label} className="flex items-center gap-2 p-2 rounded-lg border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: active ? color : "rgba(255,255,255,0.15)" }}
                      animate={active ? { opacity: [1, 0.3, 1] } : { opacity: 0.5 }}
                      transition={{ duration: 0.6, repeat: active ? Infinity : 0 }}
                    />
                    <span className="text-[10px]" style={{ color: active ? color : "rgba(240,240,245,0.35)" }}>
                      {icon} {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Controls + decisions */}
            <div className="space-y-4">
              {/* Distance */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold" style={{ color: "rgba(240,240,245,0.6)" }}>📡 Ultrasonic — Object Distance</span>
                  <span className="text-xs font-mono font-bold" style={{ color: distDec.color }}>{distance} cm</span>
                </div>
                <input type="range" min={5} max={400} value={distance} onChange={e => { setDistance(Number(e.target.value)); handleChange(); }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-1" style={{ accentColor: distDec.color }} />
                <div className="flex items-center gap-1.5 text-xs" style={{ color: distDec.color }}>
                  <span>{distDec.emoji}</span> {distDec.text}
                </div>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold" style={{ color: "rgba(240,240,245,0.6)" }}>🌡️ Temperature Sensor</span>
                  <span className="text-xs font-mono font-bold" style={{ color: tempDec.color }}>{temp}°C</span>
                </div>
                <input type="range" min={-10} max={80} value={temp} onChange={e => { setTemp(Number(e.target.value)); handleChange(); }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-1" style={{ accentColor: tempDec.color }} />
                <div className="flex items-center gap-1.5 text-xs" style={{ color: tempDec.color }}>
                  <span>{tempDec.emoji}</span> {tempDec.text}
                </div>
              </div>

              {/* Light */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold" style={{ color: "rgba(240,240,245,0.6)" }}>☀️ Light Level (LDR)</span>
                  <span className="text-xs font-mono font-bold" style={{ color: lightDec.color }}>{light}%</span>
                </div>
                <input type="range" min={0} max={100} value={light} onChange={e => { setLight(Number(e.target.value)); handleChange(); }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-1" style={{ accentColor: lightDec.color }} />
                <div className="flex items-center gap-1.5 text-xs" style={{ color: lightDec.color }}>
                  <span>{lightDec.emoji}</span> {lightDec.text}
                </div>
              </div>

              {/* Motion toggle */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold" style={{ color: "rgba(240,240,245,0.6)" }}>🚶 PIR Motion Status</span>
                  <button
                    onClick={() => { setMotionDetected(m => !m); handleChange(); }}
                    className="px-3 py-1 rounded-full text-xs font-bold transition-all border"
                    style={{
                      background: motionDetected ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                      borderColor: motionDetected ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)",
                      color: motionDetected ? "#EF4444" : "rgba(240,240,245,0.4)",
                    }}
                  >
                    {motionDetected ? "Motion: ON" : "Motion: OFF"}
                  </button>
                </div>
                {motionDetected && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-xs" style={{ color: "#F59E0B" }}>
                    <span>⚠️</span> Human detected! Activating alert and logging event
                  </motion.div>
                )}
              </div>

              {/* Robot code block */}
              <div className="rounded-xl p-3 font-mono text-[10px]" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "rgba(240,240,245,0.3)" }}>// Robot decision loop</div>
                <div style={{ color: "#F0F0F5" }}>dist = <span style={{ color: distDec.color }}>{distance}</span>; temp = <span style={{ color: tempDec.color }}>{temp}</span>; light = <span style={{ color: lightDec.color }}>{light}</span>;</div>
                <div style={{ color: distDec.color }}>→ {distDec.emoji} {distDec.text}</div>
                <div style={{ color: tempDec.color }}>→ {tempDec.emoji} {tempDec.text}</div>
                <div style={{ color: lightDec.color }}>→ {lightDec.emoji} {lightDec.text}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {called && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs mt-2 text-center font-bold" style={{ color: "#10B981" }}>
          +20 XP earned! Robot dashboard mastered.
        </motion.p>
      )}
    </section>
  );
}
