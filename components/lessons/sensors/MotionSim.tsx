"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#0EA5E9";

type PIRState = "standby" | "detected" | "cooldown";

export default function MotionSim({ onUsed }: Props) {
  const [pirState, setPIRState] = useState<PIRState>("standby");
  const [figureX, setFigureX] = useState(10);
  const [called, setCalled] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const standbyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const detectionZoneStart = 30; // % from left

  function triggerMotion() {
    if (pirState !== "standby") return;

    // Move figure into detection zone
    setFigureX(50);
    setPIRState("detected");
    setTriggerCount(c => {
      const next = c + 1;
      if (!called) {
        setCalled(true);
        onUsed();
      }
      return next;
    });

    cooldownRef.current = setTimeout(() => {
      setPIRState("cooldown");
      standbyRef.current = setTimeout(() => {
        setPIRState("standby");
        setFigureX(10);
      }, 3000);
    }, 2500);
  }

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
      if (standbyRef.current) clearTimeout(standbyRef.current);
    };
  }, []);

  const statusColor = pirState === "detected" ? "#EF4444" : pirState === "cooldown" ? "#F59E0B" : "#10B981";
  const statusText = pirState === "detected" ? "MOTION DETECTED!" : pirState === "cooldown" ? "Cooldown (3s)..." : "Standby — Waiting";
  const outputHigh = pirState === "detected";

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 07 · Simulator
        </p>
        <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>PIR Motion Sensor Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          The HC-SR501 PIR sensor detects changes in infrared radiation from moving warm bodies. It has a detection range of 5–7m and 120° field of view.
        </p>
      </motion.div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(14,165,233,0.04)", borderColor: "rgba(14,165,233,0.2)" }}>
        {/* Room scene */}
        <div className="p-6 pb-0">
          <div className="relative h-48 rounded-xl overflow-hidden mb-5" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Room floor */}
            <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)" }} />

            {/* Detection zone (Fresnel lens FOV) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <radialGradient id="pirGrad" cx="100%" cy="50%">
                  <stop offset="0%" stopColor={pirState === "detected" ? "#EF4444" : "#0EA5E9"} stopOpacity="0.15" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <path
                d={`M 100 50 L ${detectionZoneStart} 10 L ${detectionZoneStart} 90 Z`}
                fill="url(#pirGrad)"
                stroke={pirState === "detected" ? "rgba(239,68,68,0.3)" : "rgba(14,165,233,0.2)"}
                strokeWidth="0.3"
              />
            </svg>

            {/* PIR sensor (right wall) */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                style={{
                  background: pirState === "detected" ? "rgba(239,68,68,0.2)" : "rgba(14,165,233,0.1)",
                  borderColor: pirState === "detected" ? "#EF4444" : COLOR,
                  boxShadow: pirState === "detected" ? "0 0 20px rgba(239,68,68,0.5)" : "0 0 10px rgba(14,165,233,0.2)",
                }}
                animate={pirState === "detected" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3, repeat: pirState === "detected" ? Infinity : 0 }}
              >
                <div className="text-lg">👁️</div>
              </motion.div>
              <div className="text-[8px] font-mono text-center" style={{ color: "rgba(240,240,245,0.4)" }}>HC-SR501</div>
              {/* LED indicator */}
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: outputHigh ? "#EF4444" : "#10B981" }}
                animate={outputHigh ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                transition={{ duration: 0.4, repeat: outputHigh ? Infinity : 0 }}
              />
            </div>

            {/* Stick figure */}
            <motion.div
              className="absolute bottom-8"
              animate={{ left: `${figureX}%` }}
              transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            >
              <svg width="24" height="36" viewBox="0 0 24 36">
                {/* Head */}
                <circle cx="12" cy="5" r="4" fill="rgba(240,240,245,0.7)" />
                {/* Body */}
                <line x1="12" y1="9" x2="12" y2="24" stroke="rgba(240,240,245,0.7)" strokeWidth="2" />
                {/* Arms */}
                {pirState !== "standby" ? (
                  <>
                    <line x1="12" y1="14" x2="4" y2="10" stroke="rgba(240,240,245,0.7)" strokeWidth="1.5" />
                    <line x1="12" y1="14" x2="20" y2="10" stroke="rgba(240,240,245,0.7)" strokeWidth="1.5" />
                  </>
                ) : (
                  <>
                    <line x1="12" y1="14" x2="4" y2="18" stroke="rgba(240,240,245,0.7)" strokeWidth="1.5" />
                    <line x1="12" y1="14" x2="20" y2="18" stroke="rgba(240,240,245,0.7)" strokeWidth="1.5" />
                  </>
                )}
                {/* Legs */}
                <line x1="12" y1="24" x2="6" y2="34" stroke="rgba(240,240,245,0.7)" strokeWidth="1.5" />
                <line x1="12" y1="24" x2="18" y2="34" stroke="rgba(240,240,245,0.7)" strokeWidth="1.5" />
              </svg>
            </motion.div>

            {/* Status overlay */}
            <AnimatePresence>
              {pirState === "detected" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-lg font-bold text-xs border"
                  style={{ background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.5)", color: "#EF4444" }}
                >
                  ⚠ MOTION DETECTED
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Readings and control */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="text-[9px] mb-1" style={{ color: "rgba(240,240,245,0.35)" }}>PIR State</div>
              <div className="text-xs font-bold" style={{ color: statusColor }}>{statusText}</div>
            </div>
            <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="text-[9px] mb-1" style={{ color: "rgba(240,240,245,0.35)" }}>Output Pin</div>
              <div className="text-base font-black font-mono" style={{ color: outputHigh ? "#EF4444" : "#10B981" }}>
                {outputHigh ? "HIGH (3.3V)" : "LOW (0V)"}
              </div>
            </div>
            <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="text-[9px] mb-1" style={{ color: "rgba(240,240,245,0.35)" }}>Triggers</div>
              <div className="text-base font-black font-mono" style={{ color: COLOR }}>{triggerCount}</div>
            </div>
          </div>

          {/* Trigger button */}
          <button
            onClick={triggerMotion}
            disabled={pirState !== "standby"}
            className="w-full py-3.5 rounded-xl font-bold text-sm mb-4 transition-all disabled:opacity-40"
            style={{
              background: pirState === "standby" ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${pirState === "standby" ? "rgba(14,165,233,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: pirState === "standby" ? COLOR : "rgba(240,240,245,0.3)",
            }}
          >
            {pirState === "standby" ? "🚶 Walk Into Detection Zone" : pirState === "detected" ? "⚠️ Motion Detected!" : "⏳ Sensor Cooldown..."}
          </button>

          {/* PIR specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: "Range", value: "5 – 7 m" },
              { label: "FOV", value: "120°" },
              { label: "Supply", value: "5 – 20V" },
              { label: "Output", value: "3.3V HIGH" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[9px]" style={{ color: "rgba(240,240,245,0.3)" }}>{label}</div>
                <div className="text-xs font-bold font-mono" style={{ color: "rgba(240,240,245,0.7)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Arduino code */}
          <div className="rounded-xl p-3 font-mono text-xs" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "rgba(240,240,245,0.3)" }}>// PIR on digital pin 2</div>
            <div><span style={{ color: "#10B981" }}>const int</span><span style={{ color: "#F0F0F5" }}> PIR_PIN = </span><span style={{ color: "#F59E0B" }}>2</span><span style={{ color: "#F0F0F5" }}>;</span></div>
            <div><span style={{ color: "#10B981" }}>void</span><span style={{ color: COLOR }}> loop</span><span style={{ color: "#F0F0F5" }}>() {"{"}</span></div>
            <div><span style={{ color: "#F0F0F5" }}>  </span><span style={{ color: "#10B981" }}>if</span><span style={{ color: "#F0F0F5" }}>(</span><span style={{ color: COLOR }}>digitalRead</span><span style={{ color: "#F0F0F5" }}>(PIR_PIN) == HIGH) {"{"}</span></div>
            <div><span style={{ color: "#F0F0F5" }}>    Serial.</span><span style={{ color: COLOR }}>println</span><span style={{ color: "#F0F0F5" }}>("Motion detected!");</span></div>
            <div><span style={{ color: "#F0F0F5" }}>  {"}"}</span></div>
            <div><span style={{ color: "#F0F0F5" }}>{"}"}</span></div>
          </div>
        </div>
      </div>

      {called && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs mt-2 text-center font-bold" style={{ color: "#10B981" }}>
          +25 XP earned! PIR motion sensor mastered.
        </motion.p>
      )}
    </section>
  );
}
