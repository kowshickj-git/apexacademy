"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#F59E0B";

const DEVICES = [
  { id: 1, name: "PLC (Master)", icon: "🖥️", addr: 0 },
  { id: 2, name: "Motor Drive 1", icon: "⚙️", addr: 1 },
  { id: 3, name: "Motor Drive 2", icon: "⚙️", addr: 2 },
  { id: 4, name: "Motor Drive 3", icon: "⚙️", addr: 3 },
  { id: 5, name: "Temp Sensor 1", icon: "🌡️", addr: 4 },
  { id: 6, name: "Temp Sensor 2", icon: "🌡️", addr: 5 },
  { id: 7, name: "Flow Meter", icon: "💧", addr: 6 },
];

const COMMANDS: Record<string, string[]> = {
  "Motor Drive 1": ["Start Motor", "Stop Motor", "Set Speed 50%", "Read Status"],
  "Motor Drive 2": ["Start Motor", "Stop Motor", "Set Speed 75%", "Read Status"],
  "Motor Drive 3": ["Start Motor", "Stop Motor", "Emergency Stop", "Read Status"],
  "Temp Sensor 1": ["Read Temperature", "Read Humidity", "Set Alarm Threshold"],
  "Temp Sensor 2": ["Read Temperature", "Set Offset", "Read Alarm Status"],
  "Flow Meter": ["Read Flow Rate", "Read Total Volume", "Reset Counter"],
};

interface LogEntry {
  id: number;
  msg: string;
  type: "tx" | "rx" | "info";
}

export default function IndustrialNetworkSim({ onUsed }: Props) {
  const [targetDevice, setTargetDevice] = useState("Motor Drive 1");
  const [command, setCommand] = useState("Start Motor");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [sending, setSending] = useState(false);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const [called, setCalled] = useState(false);
  const [msgId, setMsgId] = useState(0);

  function addLog(msg: string, type: LogEntry["type"]) {
    setMsgId(id => {
      const newId = id + 1;
      setLog(l => [{ id: newId, msg, type }, ...l].slice(0, 10));
      return newId;
    });
  }

  function sendCommand() {
    if (sending) return;
    if (!called) { setCalled(true); onUsed(); }
    const addr = DEVICES.find(d => d.name === targetDevice)?.addr ?? 1;

    setSending(true);
    setActiveDevice(null);
    addLog(`[TX] PLC → Broadcast: DE=HIGH (transmit mode)`, "info");

    setTimeout(() => {
      addLog(`[TX] PLC → Addr:${addr.toString(16).toUpperCase().padStart(2,"0")} | CMD: ${command}`, "tx");
    }, 300);

    setTimeout(() => {
      // Other devices ignore
      DEVICES.filter(d => d.name !== "PLC (Master)" && d.name !== targetDevice).forEach(d => {
        addLog(`[--] ${d.name} (Addr:${d.addr.toString(16).toUpperCase().padStart(2,"0")}): Not addressed, ignoring`, "info");
      });
    }, 800);

    setTimeout(() => {
      setActiveDevice(targetDevice);
      addLog(`[RX] ${targetDevice} received command: DE=LOW (receive mode)`, "rx");
    }, 1400);

    setTimeout(() => {
      const responses: Record<string, string> = {
        "Start Motor": "OK — Motor started, Speed: 0→50%",
        "Stop Motor": "OK — Motor stopped",
        "Set Speed 50%": "OK — Speed set: 50%",
        "Set Speed 75%": "OK — Speed set: 75%",
        "Emergency Stop": "OK — E-STOP activated",
        "Read Status": "OK — Status: RUNNING, I=2.4A",
        "Read Temperature": "OK — Temp: 24.7°C",
        "Read Humidity": "OK — Humidity: 62%",
        "Set Alarm Threshold": "OK — Alarm set: 80°C",
        "Set Offset": "OK — Offset: +0.5°C",
        "Read Alarm Status": "OK — No alarms active",
        "Read Flow Rate": "OK — Flow: 12.4 L/min",
        "Read Total Volume": "OK — Total: 4823 L",
        "Reset Counter": "OK — Counter reset to 0",
      };
      addLog(`[RX] ${targetDevice} → PLC: ${responses[command] ?? "OK — Acknowledged"}`, "rx");
      setSending(false);
      setActiveDevice(null);
    }, 2000);
  }

  const availableCommands = COMMANDS[targetDevice] || [];

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 06 · Industrial Network
        </p>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#F0F0F5" }}>Industrial Network Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          A factory RS485 bus with PLC master and 6 slave devices. Send commands and watch direction switching
          (DE/RE) and selective addressing in action.
        </p>

        {/* Device grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
          {DEVICES.map(d => (
            <motion.div
              key={d.id}
              animate={{
                borderColor: activeDevice === d.name
                  ? COLOR
                  : d.name === "PLC (Master)" && sending
                  ? "#10B981"
                  : "rgba(255,255,255,0.08)",
                background: activeDevice === d.name
                  ? "rgba(245,158,11,0.12)"
                  : d.name === "PLC (Master)" && sending
                  ? "rgba(16,185,129,0.08)"
                  : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3 border text-center"
            >
              <div className="text-xl mb-1">{d.icon}</div>
              <div className="text-[9px] font-bold truncate" style={{ color: activeDevice === d.name ? COLOR : "#F0F0F5" }}>
                {d.name}
              </div>
              <div className="text-[8px] font-mono mt-0.5" style={{ color: "rgba(240,240,245,0.3)" }}>
                Addr: 0x{d.addr.toString(16).toUpperCase().padStart(2,"0")}
              </div>
              {d.name === "PLC (Master)" && sending && (
                <div className="text-[8px] mt-0.5" style={{ color: "#10B981" }}>DE=HIGH</div>
              )}
              {activeDevice === d.name && (
                <div className="text-[8px] mt-0.5" style={{ color: COLOR }}>DE=LOW</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(240,240,245,0.45)" }}>Target Device</label>
            <select
              value={targetDevice}
              onChange={e => {
                setTargetDevice(e.target.value);
                setCommand(COMMANDS[e.target.value]?.[0] || "");
              }}
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#F0F0F5" }}
            >
              {DEVICES.filter(d => d.name !== "PLC (Master)").map(d => (
                <option key={d.id} value={d.name} style={{ background: "#111" }}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(240,240,245,0.45)" }}>Command</label>
            <select
              value={command}
              onChange={e => setCommand(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#F0F0F5" }}
            >
              {availableCommands.map(c => (
                <option key={c} value={c} style={{ background: "#111" }}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={sendCommand}
          disabled={sending}
          className="w-full py-3 rounded-xl font-bold text-sm mb-5 transition-all disabled:opacity-50"
          style={{
            background: sending ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.15)",
            border: `1px solid rgba(245,158,11,${sending ? 0.2 : 0.4})`,
            color: COLOR,
          }}
        >
          {sending ? "Transmitting..." : "Send Command →"}
        </button>

        {/* Log */}
        <div className="rounded-2xl border p-4" style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="text-xs font-mono mb-3" style={{ color: "rgba(240,240,245,0.3)" }}>Message Log</div>
          {log.length === 0 ? (
            <div className="text-xs text-center py-4" style={{ color: "rgba(240,240,245,0.2)" }}>No messages yet — send a command above</div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {log.map(entry => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-mono py-0.5"
                    style={{
                      color: entry.type === "tx" ? COLOR : entry.type === "rx" ? "#10B981" : "rgba(240,240,245,0.3)",
                    }}
                  >
                    {entry.msg}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
