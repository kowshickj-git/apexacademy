"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#0EA5E9";

export default function UltrasonicSim({ onUsed }: Props) {
  const [distance, setDistance] = useState(100);
  const [positionsUsed, setPositionsUsed] = useState<Set<number>>(new Set());
  const [called, setCalled] = useState(false);
  const [animate, setAnimate] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const echoTimeUs = Math.round((distance * 2 / 34300) * 1_000_000);
  const arduinoCalc = (echoTimeUs / 58.2).toFixed(1);

  const distanceColor =
    distance < 30 ? "#EF4444" :
    distance < 100 ? "#F59E0B" :
    "#10B981";

  const distanceLabel =
    distance < 30 ? "OBSTACLE! Stop!" :
    distance < 100 ? "Nearby — Slow down" :
    "Path clear — Move forward";

  function handleSlider(val: number) {
    setDistance(val);
    const bucket = Math.floor(val / 40);
    setPositionsUsed(prev => {
      const next = new Set(prev).add(bucket);
      if (next.size >= 3 && !called) {
        setCalled(true);
        onUsed();
      }
      return next;
    });
    setAnimate(a => a + 1);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setAnimate(a => a + 1), 1200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const waves = [1, 2, 3, 4];

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(14,165,233,0.6)" }}>
          Section 04 · Simulator
        </p>
        <h2 className="text-2xl font-black mb-1" style={{ color: "#F0F0F5" }}>HC-SR04 Ultrasonic Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          The HC-SR04 sends a 40 kHz ultrasonic pulse and measures the echo time. Distance = echo time &times; speed of sound / 2.
        </p>
      </motion.div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(14,165,233,0.04)", borderColor: "rgba(14,165,233,0.2)" }}>
        {/* Sensor visualization */}
        <div className="p-6 pb-0">
          <div className="relative h-36 flex items-center justify-center overflow-hidden rounded-xl mb-4" style={{ background: "rgba(0,0,0,0.3)" }}>
            {/* Sensor */}
            <div className="absolute left-4 flex flex-col items-center gap-1 z-10">
              <div className="w-12 h-8 rounded-lg flex items-center justify-center text-xs font-bold border" style={{ background: "rgba(14,165,233,0.15)", borderColor: "rgba(14,165,233,0.4)", color: COLOR }}>
                HC-SR04
              </div>
              <div className="flex gap-1">
                {["TRIG", "ECHO"].map(pin => (
                  <div key={pin} className="text-[7px] px-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,240,245,0.4)" }}>{pin}</div>
                ))}
              </div>
            </div>

            {/* Ultrasonic waves */}
            <AnimatePresence mode="wait">
              {waves.map((w) => (
                <motion.div
                  key={`${animate}-${w}`}
                  className="absolute left-12 border-r-2 border-t-2 border-b-2 rounded-r-full"
                  style={{
                    width: `${w * (distance / 400) * 160 + 10}px`,
                    height: `${40 + w * 12}px`,
                    borderColor: `rgba(14,165,233,${0.6 - w * 0.1})`,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: [0, 0.7, 0], scaleX: 1 }}
                  transition={{ duration: 0.8, delay: w * 0.15, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>

            {/* Object */}
            <motion.div
              className="absolute right-0 flex flex-col items-center"
              style={{ right: `${Math.max(8, 100 - (distance / 400) * 70)}%` }}
              animate={{ right: `${Math.max(4, 100 - (distance / 400) * 72)}%` }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-8 h-20 rounded-lg"
                style={{ background: `${distanceColor}30`, border: `2px solid ${distanceColor}60` }}
              />
            </motion.div>

            {/* Distance line */}
            <div className="absolute bottom-2 left-16 right-12 h-px" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-mono" style={{ color: distanceColor }}>
                {distance} cm
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: "rgba(240,240,245,0.4)" }}>Object Distance</span>
              <span className="font-mono font-bold" style={{ color: distanceColor }}>{distance} cm</span>
            </div>
            <input
              type="range" min={2} max={400} value={distance}
              onChange={e => handleSlider(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: COLOR }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: "rgba(240,240,245,0.25)" }}>
              <span>2 cm (min)</span><span>400 cm (max)</span>
            </div>
          </div>
        </div>

        {/* Readings */}
        <div className="grid grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
          {[
            { label: "Distance", value: `${distance} cm`, color: distanceColor },
            { label: "Echo Time", value: `${echoTimeUs} µs`, color: COLOR },
            { label: "Arduino Calc", value: `${arduinoCalc} cm`, color: "#10B981" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 text-center" style={{ background: "rgba(5,5,7,0.5)" }}>
              <div className="text-xs mb-1" style={{ color: "rgba(240,240,245,0.35)" }}>{label}</div>
              <div className="text-lg font-black font-mono" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="px-6 py-3 flex items-center gap-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <motion.div className="w-2 h-2 rounded-full" style={{ background: distanceColor }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          <span className="text-sm font-bold" style={{ color: distanceColor }}>{distanceLabel}</span>
        </div>

        {/* TRIG/ECHO timing diagram */}
        <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="text-xs mb-3 font-bold" style={{ color: "rgba(240,240,245,0.4)" }}>TRIG / ECHO Timing Diagram</div>
          <svg viewBox="0 0 320 60" className="w-full h-14">
            {/* TRIG pulse (10µs) */}
            <text x="2" y="10" fontSize="7" fill="rgba(240,240,245,0.35)">TRIG</text>
            <polyline points="30,12 30,12 30,4 44,4 44,12 200,12" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
            <text x="34" y="3" fontSize="6" fill="#F59E0B">10µs</text>
            {/* ECHO pulse */}
            <text x="2" y="35" fontSize="7" fill="rgba(240,240,245,0.35)">ECHO</text>
            <polyline
              points={`30,35 60,35 60,27 ${60 + Math.min(200, echoTimeUs / 60)},27 ${60 + Math.min(200, echoTimeUs / 60)},35 310,35`}
              stroke={COLOR} strokeWidth="1.2" fill="none"
            />
            <text x="62" y="26" fontSize="6" fill={COLOR}>{echoTimeUs}µs</text>
            {/* Labels */}
            <text x="30" y="55" fontSize="6" fill="rgba(240,240,245,0.2)">Trigger</text>
            <text x="100" y="55" fontSize="6" fill="rgba(240,240,245,0.2)">← Echo pulse (proportional to distance) →</text>
          </svg>
        </div>

        {/* Arduino code */}
        <div className="px-6 pb-6">
          <div className="rounded-xl p-3 font-mono text-xs" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "rgba(240,240,245,0.3)" }}>// Arduino HC-SR04 formula</div>
            <div><span style={{ color: "#10B981" }}>long</span> <span style={{ color: "#F0F0F5" }}>duration = </span><span style={{ color: COLOR }}>pulseIn</span><span style={{ color: "#F0F0F5" }}>(ECHO_PIN, HIGH);</span></div>
            <div><span style={{ color: "#10B981" }}>float</span> <span style={{ color: "#F0F0F5" }}>distance = duration / </span><span style={{ color: "#F59E0B" }}>58.2</span><span style={{ color: "#F0F0F5" }}>; </span><span style={{ color: "rgba(240,240,245,0.3)" }}>// cm</span></div>
            <div className="mt-1" style={{ color: "rgba(240,240,245,0.3)" }}>// Current: {echoTimeUs} µs → {arduinoCalc} cm</div>
          </div>
        </div>
      </div>

      {!called && (
        <p className="text-xs mt-2 text-center" style={{ color: "rgba(240,240,245,0.3)" }}>
          Move the slider to at least 3 different positions to earn XP +25
        </p>
      )}
      {called && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs mt-2 text-center font-bold" style={{ color: "#10B981" }}>
          +25 XP earned! Ultrasonic simulator mastered.
        </motion.p>
      )}
    </section>
  );
}
