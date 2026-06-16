"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#06B6D4";

interface MsgLog {
  id: number;
  topic: string;
  payload: string;
  qos: number;
  ts: string;
  dir: "pub" | "sub";
}

const TOPICS = [
  "home/temperature",
  "home/humidity",
  "home/light",
  "factory/sensor1",
  "device/status",
];

const SAMPLE_PAYLOADS: Record<string, string[]> = {
  "home/temperature": ["23.5", "24.1", "22.8", "25.0"],
  "home/humidity":    ["62", "58", "65", "70"],
  "home/light":       ["ON", "OFF", "DIM:50"],
  "factory/sensor1":  ["1023", "876", "934", "1010"],
  "device/status":    ["online", "idle", "busy"],
};

let msgIdCounter = 0;

export default function MQTTSim({ onUse }: Props) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [payload, setPayload] = useState("23.5");
  const [qos, setQos] = useState(0);
  const [msgs, setMsgs] = useState<MsgLog[]>([]);
  const [flowing, setFlowing] = useState(false);
  const [called, setCalled] = useState(false);

  function publish() {
    if (!called) { setCalled(true); onUse(); }
    setFlowing(true);
    const ts = new Date().toLocaleTimeString();
    const id = ++msgIdCounter;
    setTimeout(() => {
      setMsgs(prev => [{ id, topic, payload, qos, ts, dir: "pub" as const }, ...prev].slice(0, 12));
    }, 300);
    setTimeout(() => {
      setMsgs(prev => [{ id: ++msgIdCounter, topic, payload, qos, ts, dir: "sub" as const }, ...prev].slice(0, 12));
      setFlowing(false);
    }, 900);
  }

  function randomPayload() {
    const arr = SAMPLE_PAYLOADS[topic] || ["42"];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 08 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>MQTT Client</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          Simulate publishing and subscribing to MQTT topics. Default broker port: 1883.
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.2)" }}>
          {/* Broker diagram */}
          <div className="flex items-center gap-3 mb-5 p-3 rounded-xl border" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.07)" }}>
            {/* Publisher */}
            <div className="flex-1 rounded-lg border p-2 text-center" style={{ background: "rgba(6,182,212,0.08)", borderColor: "rgba(6,182,212,0.25)" }}>
              <div className="text-[9px] font-mono mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Publisher</div>
              <div className="text-xs font-bold" style={{ color: COLOR }}>ESP32</div>
            </div>
            {/* Arrow */}
            <div className="flex flex-col items-center gap-0.5">
              <motion.div
                className="w-8 h-0.5 rounded"
                style={{ background: COLOR }}
                animate={flowing ? { scaleX: [0, 1], opacity: [0, 1, 0] } : { opacity: 0.3 }}
                transition={{ duration: 0.6 }}
              />
              <span className="text-[8px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>PUBLISH</span>
            </div>
            {/* Broker */}
            <div className="rounded-lg border p-2 text-center" style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.25)" }}>
              <div className="text-[9px] font-mono mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Broker</div>
              <div className="text-xs font-bold" style={{ color: "#8B5CF6" }}>:1883</div>
            </div>
            {/* Arrow */}
            <div className="flex flex-col items-center gap-0.5">
              <motion.div
                className="w-8 h-0.5 rounded"
                style={{ background: "#10B981" }}
                animate={flowing ? { scaleX: [0, 1], opacity: [0, 1, 0] } : { opacity: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <span className="text-[8px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>DELIVER</span>
            </div>
            {/* Subscriber */}
            <div className="flex-1 rounded-lg border p-2 text-center" style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.25)" }}>
              <div className="text-[9px] font-mono mb-0.5" style={{ color: "rgba(240,240,245,0.4)" }}>Subscriber</div>
              <div className="text-xs font-bold" style={{ color: "#10B981" }}>Dashboard</div>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[10px] mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Topic</div>
              <select
                value={topic}
                onChange={e => { setTopic(e.target.value); setPayload(randomPayload()); }}
                className="w-full rounded-lg px-3 py-2 text-xs font-mono"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(6,182,212,0.25)", color: COLOR, outline: "none" }}
              >
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className="text-[10px] mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Payload</div>
              <input
                value={payload}
                onChange={e => setPayload(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-xs font-mono"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#F0F0F5", outline: "none" }}
              />
            </div>
          </div>

          {/* QoS */}
          <div className="flex gap-2 mb-4">
            <span className="text-xs self-center" style={{ color: "rgba(240,240,245,0.4)" }}>QoS:</span>
            {[0, 1, 2].map(q => (
              <button
                key={q}
                onClick={() => setQos(q)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: qos === q ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${qos === q ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.08)"}`,
                  color: qos === q ? COLOR : "rgba(240,240,245,0.35)",
                }}
              >
                QoS {q}
              </button>
            ))}
            <span className="text-[10px] self-center ml-2" style={{ color: "rgba(240,240,245,0.3)" }}>
              {qos === 0 ? "At most once" : qos === 1 ? "At least once" : "Exactly once"}
            </span>
          </div>

          <button
            onClick={publish}
            disabled={flowing}
            className="w-full py-2.5 rounded-xl font-bold text-sm border mb-4 transition-all disabled:opacity-50"
            style={{ borderColor: "rgba(6,182,212,0.4)", background: "rgba(6,182,212,0.12)", color: COLOR }}
          >
            {flowing ? "Publishing..." : "Publish Message"}
          </button>

          {/* Message log */}
          <div className="space-y-2 max-h-56 overflow-y-auto">
            <AnimatePresence>
              {msgs.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-2.5 rounded-xl text-[10px] font-mono border"
                  style={{
                    background: m.dir === "pub" ? "rgba(6,182,212,0.06)" : "rgba(16,185,129,0.06)",
                    borderColor: m.dir === "pub" ? "rgba(6,182,212,0.2)" : "rgba(16,185,129,0.2)",
                  }}
                >
                  <span style={{ color: m.dir === "pub" ? COLOR : "#10B981" }}>{m.dir === "pub" ? "PUB" : "SUB"}</span>
                  <span style={{ color: "rgba(240,240,245,0.5)" }}>{m.ts}</span>
                  <span style={{ color: "#F0F0F5" }}>{m.topic}</span>
                  <span style={{ color: "rgba(240,240,245,0.6)" }}>→ {m.payload}</span>
                  <span className="ml-auto" style={{ color: "rgba(240,240,245,0.3)" }}>QoS{m.qos}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {msgs.length === 0 && (
              <div className="text-center py-4 text-xs" style={{ color: "rgba(240,240,245,0.2)" }}>
                Publish a message to see the flow
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
