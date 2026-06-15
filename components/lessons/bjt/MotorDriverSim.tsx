"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MotorDriverSimProps {
  onMotorDriverUsed: () => void;
}

export default function MotorDriverSim({ onMotorDriverUsed }: MotorDriverSimProps) {
  const [pwm, setPwm] = useState(50);
  const [hasUsed, setHasUsed] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 100), 30);
    return () => clearInterval(id);
  }, []);

  const handlePwm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwm(Number(e.target.value));
    if (!hasUsed) {
      setHasUsed(true);
      onMotorDriverUsed();
    }
  };

  const beta = 100;
  const iMotor_mA = 200; // full load
  const iBneeded_mA = iMotor_mA / beta; // 2mA
  const effectiveCurrent = (pwm / 100) * iMotor_mA;
  const motorSpeed = pwm;

  // PWM waveform: for a given tick position, determine if in "on" or "off"
  const pwmPhase = (tick % 100) / 100;
  const pwmOn = pwmPhase < pwm / 100;

  // Motor rotation angle
  const motorAngle = (tick / 100) * 360 * (pwm / 100);

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="inline-block px-2 py-1 rounded-lg text-xs font-mono font-bold"
              style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              SIM 5
            </div>
            <div className="text-xs" style={{ color: "rgba(240,240,245,0.4)" }}>Interactive</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            PWM Motor Control
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Use an NPN BJT to PWM-drive a DC motor at 200mA. The BJT switches on/off thousands of times per second.
          </p>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {/* PWM Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: "rgba(240,240,245,0.6)" }}>PWM Duty Cycle</span>
              <span style={{ color: "#EF4444" }} className="font-black">{pwm}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={pwm}
              onChange={handlePwm}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#EF4444" }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>
              <span>0% (stop)</span>
              <span>100% (full speed)</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {/* PWM waveform visualization */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-xs font-mono mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>
                PWM SIGNAL ON BASE
              </div>
              <svg viewBox="0 0 200 80" className="w-full" style={{ display: "block" }}>
                {/* Grid */}
                <line x1="0" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                {/* PWM waveform */}
                {Array.from({ length: 4 }, (_, period) => {
                  const startX = period * 50;
                  const onWidth = (pwm / 100) * 50;
                  return (
                    <g key={period}>
                      {/* High part */}
                      <rect x={startX} y="10" width={onWidth} height="28" fill="rgba(239,68,68,0.25)" />
                      <line x1={startX} y1="10" x2={startX + onWidth} y2="10" stroke="#EF4444" strokeWidth="1.5" />
                      <line x1={startX} y1="10" x2={startX} y2="38" stroke="#EF4444" strokeWidth="1.5" />
                      <line x1={startX + onWidth} y1="10" x2={startX + onWidth} y2="38" stroke="#EF4444" strokeWidth="1.5" />
                      {/* Low part */}
                      <line x1={startX + onWidth} y1="38" x2={startX + 50} y2="38" stroke="#EF4444" strokeWidth="1.5" />
                    </g>
                  );
                })}
                {/* Moving cursor */}
                <line
                  x1={(tick % 100) * 2}
                  y1="0"
                  x2={(tick % 100) * 2}
                  y2="80"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />
                {/* Labels */}
                <text x="2" y="8" fill="rgba(239,68,68,0.6)" fontSize="7">HIGH</text>
                <text x="2" y="50" fill="rgba(240,240,245,0.3)" fontSize="7">LOW</text>
                <text x="2" y="74" fill="rgba(240,240,245,0.3)" fontSize="6">Duty: {pwm}%</text>
              </svg>

              {/* Flyback diode note */}
              <div className="mt-2 p-2 rounded-lg" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <div className="text-xs" style={{ color: "rgba(245,158,11,0.8)" }}>
                  ⚡ Flyback diode (D1) across motor prevents back-EMF from destroying the BJT.
                </div>
              </div>
            </div>

            {/* Motor visualization */}
            <div
              className="rounded-2xl p-4 flex flex-col items-center justify-center"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-xs font-mono mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>
                DC MOTOR SPEED
              </div>
              {/* Motor SVG */}
              <svg viewBox="0 0 120 120" className="w-24 h-24">
                {/* Motor body */}
                <circle cx="60" cy="60" r="45" fill="rgba(255,255,255,0.04)" stroke="rgba(239,68,68,0.3)" strokeWidth="2" />
                <circle cx="60" cy="60" r="35" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
                {/* Shaft */}
                <motion.g
                  animate={{ rotate: motorSpeed > 0 ? 360 * (motorSpeed / 100) : 0 }}
                  transition={{ duration: motorSpeed > 0 ? 2 / Math.max(motorSpeed / 100, 0.01) : 0, repeat: Infinity, ease: "linear" }}
                  style={{ originX: "60px", originY: "60px" }}
                >
                  <line x1="60" y1="60" x2="60" y2="20" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                  <line x1="60" y1="60" x2="85" y2="75" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </motion.g>
                {/* Center dot */}
                <circle cx="60" cy="60" r="5" fill="#EF4444" opacity="0.8" />
                {/* M label */}
                <text x="60" y="105" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="10" fontWeight="700">DC MOTOR</text>
              </svg>

              {/* Speed bar */}
              <div className="w-full mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "rgba(240,240,245,0.4)" }}>Speed</span>
                  <span style={{ color: "#EF4444" }} className="font-bold">{motorSpeed}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg,#EF4444,#F87171)" }}
                    animate={{ width: `${motorSpeed}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Circuit stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "PWM Duty", value: `${pwm}%`, color: "#EF4444" },
              { label: "Avg I_motor", value: `${effectiveCurrent.toFixed(0)}mA`, color: "#EF4444" },
              { label: "I_B needed", value: `${iBneeded_mA}mA`, color: "#0EA5E9" },
              { label: "β = 100", value: "2N2222", color: "#F87171" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.4)", fontSize: "9px" }}>{s.label}</div>
                <div className="text-base font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)" }}
          >
            <div className="text-xs font-mono mb-1" style={{ color: "rgba(239,68,68,0.7)" }}>DESIGN NOTES</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.5)" }}>
              Motor: I_max = 200mA, β = 100 → I_B_min = 2mA (use 4mA for overdrive margin).
              V_CC = 12V, V_BE = 0.7V, V_control = 5V → R_B = (5-0.7)/0.004 = 1.075kΩ → use 1kΩ.
              <span style={{ color: "#F59E0B" }}> Always add flyback diode (1N4007) across motor terminals!</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
