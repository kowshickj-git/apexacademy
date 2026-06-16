"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#10B981";

type PinName = "TX" | "RX" | "GND" | "VCC";

interface Connection {
  from: PinName;
  to: PinName;
}

const PINS_A: PinName[] = ["TX", "RX", "GND", "VCC"];
const PINS_B: PinName[] = ["TX", "RX", "GND", "VCC"];

function evaluate(conns: Connection[]): { verdict: string; color: string; icon: string } | null {
  if (conns.length === 0) return null;
  const last = conns[conns.length - 1];
  if (last.from === "TX" && last.to === "RX") return { verdict: "Correct! A transmits to B's receiver", color: COLOR, icon: "✓" };
  if (last.from === "RX" && last.to === "TX") return { verdict: "Correct! B transmits to A's receiver", color: COLOR, icon: "✓" };
  if (last.from === "GND" && last.to === "GND") return { verdict: "Correct! Common ground required for reference", color: COLOR, icon: "✓" };
  if (last.from === "TX" && last.to === "TX") return { verdict: "WRONG! Both transmitting on same wire — nobody is listening!", color: "#EF4444", icon: "✗" };
  if (last.from === "RX" && last.to === "RX") return { verdict: "WRONG! Both receiving, no data flows!", color: "#EF4444", icon: "✗" };
  if (last.from === "VCC" && last.to === "VCC") return { verdict: "WARNING! Connecting two power rails — potential damage!", color: "#F59E0B", icon: "⚠" };
  if (last.from === "TX" && last.to === "GND") return { verdict: "WRONG! TX connected to GND will short the output!", color: "#EF4444", icon: "✗" };
  if (last.from === "RX" && last.to === "GND") return { verdict: "RX grounded — won't receive valid data (always sees LOW)", color: "#F59E0B", icon: "⚠" };
  return { verdict: "Unusual connection — check your wiring", color: "#F59E0B", icon: "?" };
}

function checkWiring(conns: Connection[]): { pass: boolean; message: string } {
  const hasTXtoRX = conns.some(c => c.from === "TX" && c.to === "RX");
  const hasRXtoTX = conns.some(c => c.from === "RX" && c.to === "TX");
  const hasGND = conns.some(c => c.from === "GND" && c.to === "GND");
  const hasBadConn = conns.some(c => (c.from === "TX" && c.to === "TX") || (c.from === "RX" && c.to === "RX"));

  if (hasBadConn) return { pass: false, message: "✗ Bad connection detected! TX→TX or RX→RX is incorrect." };
  if (hasTXtoRX && hasRXtoTX && hasGND) return { pass: true, message: "✓ Wiring correct! TX→RX, RX←TX, GND↔GND all connected." };
  const missing = [];
  if (!hasTXtoRX) missing.push("A.TX → B.RX");
  if (!hasRXtoTX) missing.push("B.TX → A.RX");
  if (!hasGND) missing.push("GND ↔ GND");
  return { pass: false, message: `Incomplete: missing ${missing.join(", ")}` };
}

export default function TXRXSim({ onUsed }: Props) {
  const [selectedPin, setSelectedPin] = useState<PinName | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [feedback, setFeedback] = useState<{ verdict: string; color: string; icon: string } | null>(null);
  const [checkResult, setCheckResult] = useState<{ pass: boolean; message: string } | null>(null);
  const calledRef = useRef(false);

  function handlePinAClick(pin: PinName) {
    if (!calledRef.current) { calledRef.current = true; onUsed(); }
    setSelectedPin(pin);
    setCheckResult(null);
  }

  function handlePinBClick(pin: PinName) {
    if (!selectedPin) return;
    if (!calledRef.current) { calledRef.current = true; onUsed(); }
    const conn: Connection = { from: selectedPin, to: pin };
    const newConns = [...connections, conn];
    setConnections(newConns);
    const res = evaluate(newConns);
    setFeedback(res);
    setSelectedPin(null);
    setCheckResult(null);
  }

  function handleCheck() {
    setCheckResult(checkWiring(connections));
  }

  function handleReset() {
    setConnections([]);
    setFeedback(null);
    setSelectedPin(null);
    setCheckResult(null);
  }

  const PIN_COLORS: Record<PinName, string> = {
    TX: COLOR,
    RX: "#3B82F6",
    GND: "rgba(240,240,245,0.4)",
    VCC: "#F59E0B",
  };

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 06 · TX/RX Wiring</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>UART Wiring Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
          Click a pin on Device A, then click a pin on Device B to connect them. Build the correct wiring!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
        className="rounded-2xl border p-5 mb-5"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        {selectedPin && (
          <div className="mb-4 text-xs text-center font-bold" style={{ color: COLOR }}>
            Selected: Device A · {selectedPin} — now click a pin on Device B
          </div>
        )}

        <div className="flex items-stretch gap-6 justify-center">
          {/* Device A */}
          <div className="flex-1 max-w-[180px]">
            <div className="rounded-2xl border p-4 text-center" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.06)" }}>
              <div className="text-xs font-black mb-3" style={{ color: COLOR }}>Device A</div>
              <div className="text-[10px] mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>Arduino Uno (5V)</div>
              <div className="space-y-2">
                {PINS_A.map(pin => (
                  <button
                    key={pin}
                    onClick={() => handlePinAClick(pin)}
                    className="w-full py-2 rounded-xl text-xs font-bold border transition-all"
                    style={{
                      borderColor: selectedPin === pin ? PIN_COLORS[pin] : `${PIN_COLORS[pin]}40`,
                      background: selectedPin === pin ? `${PIN_COLORS[pin]}20` : `${PIN_COLORS[pin]}08`,
                      color: PIN_COLORS[pin],
                      boxShadow: selectedPin === pin ? `0 0 8px ${PIN_COLORS[pin]}40` : "none",
                    }}
                  >
                    {pin}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Connection visualization */}
          <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
            <div className="text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.3)" }}>Connections</div>
            {connections.length === 0 ? (
              <div className="text-[10px] text-center" style={{ color: "rgba(240,240,245,0.2)" }}>
                No connections yet.<br />Click a pin to start.
              </div>
            ) : (
              <div className="space-y-1">
                {connections.map((c, i) => {
                  const res = (() => {
                    if ((c.from === "TX" && c.to === "RX") || (c.from === "RX" && c.to === "TX") || (c.from === "GND" && c.to === "GND")) return "ok";
                    if ((c.from === "TX" && c.to === "TX") || (c.from === "RX" && c.to === "RX")) return "bad";
                    return "warn";
                  })();
                  return (
                    <div key={i} className="flex items-center gap-1 text-[10px]">
                      <span style={{ color: PIN_COLORS[c.from] }}>A.{c.from}</span>
                      <span style={{ color: res === "ok" ? COLOR : res === "bad" ? "#EF4444" : "#F59E0B" }}>
                        {res === "ok" ? "→" : res === "bad" ? "✗" : "?"}
                      </span>
                      <span style={{ color: PIN_COLORS[c.to] }}>B.{c.to}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Device B */}
          <div className="flex-1 max-w-[180px]">
            <div className="rounded-2xl border p-4 text-center" style={{ borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.06)" }}>
              <div className="text-xs font-black mb-3" style={{ color: "#34D399" }}>Device B</div>
              <div className="text-[10px] mb-3" style={{ color: "rgba(240,240,245,0.4)" }}>ESP32 (3.3V)</div>
              <div className="space-y-2">
                {PINS_B.map(pin => (
                  <button
                    key={pin}
                    onClick={() => handlePinBClick(pin)}
                    disabled={!selectedPin}
                    className="w-full py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-30"
                    style={{
                      borderColor: selectedPin ? `${PIN_COLORS[pin]}60` : `${PIN_COLORS[pin]}25`,
                      background: selectedPin ? `${PIN_COLORS[pin]}12` : `${PIN_COLORS[pin]}04`,
                      color: PIN_COLORS[pin],
                    }}
                  >
                    {pin}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 rounded-xl px-4 py-2.5 text-xs font-bold text-center"
              style={{ background: `${feedback.color}12`, border: `1px solid ${feedback.color}30`, color: feedback.color }}
            >
              {feedback.icon} {feedback.verdict}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCheck}
            disabled={connections.length === 0}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-30"
            style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.1)", color: COLOR }}
          >
            Check My Wiring
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs border transition-all"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(240,240,245,0.4)" }}
          >
            Reset
          </button>
        </div>

        <AnimatePresence>
          {checkResult && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-3 rounded-xl px-4 py-3 text-xs"
              style={{
                background: checkResult.pass ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${checkResult.pass ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: checkResult.pass ? COLOR : "#EF4444",
              }}
            >
              {checkResult.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Voltage warning panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
        className="rounded-2xl border p-5"
        style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚡</span>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: "#F59E0B" }}>Voltage Compatibility Warning!</h3>
            <p className="text-xs mb-3" style={{ color: "rgba(240,240,245,0.55)" }}>
              Device A (Arduino Uno) is <strong style={{ color: "#F59E0B" }}>5V</strong>. Device B (ESP32) is <strong style={{ color: "#EF4444" }}>3.3V</strong>.
              A.TX outputs 5V HIGH which <strong style={{ color: "#EF4444" }}>may permanently damage B.RX</strong> (ESP32 GPIO max is 3.6V)!
            </p>
            <div className="text-xs font-bold mb-2" style={{ color: "rgba(240,240,245,0.5)" }}>Solutions:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl p-3 border" style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}>
                <div className="text-[10px] font-bold mb-1" style={{ color: COLOR }}>Voltage Divider</div>
                <pre className="text-[9px] font-mono" style={{ color: "rgba(240,240,245,0.6)", whiteSpace: "pre-wrap" }}>
{`A.TX ── 1kΩ ──┬── B.RX
               └── 2kΩ ── GND
Vout = 5V × 2k/(1k+2k) = 3.33V ✓`}
                </pre>
              </div>
              <div className="rounded-xl p-3 border" style={{ background: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.2)" }}>
                <div className="text-[10px] font-bold mb-1" style={{ color: "#3B82F6" }}>Level Shifter IC</div>
                <pre className="text-[9px] font-mono" style={{ color: "rgba(240,240,245,0.6)", whiteSpace: "pre-wrap" }}>
{`BSS138 FET level shifter
TXB0108 bidirectional shifter
Fully handles 5V ↔ 3.3V safely`}
                </pre>
              </div>
            </div>
            <p className="text-[10px] mt-2" style={{ color: "rgba(240,240,245,0.35)" }}>
              Note: B.TX (3.3V) → A.RX (5V) is safe — 3.3V HIGH is above the 5V logic HIGH threshold (2.4V min).
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
