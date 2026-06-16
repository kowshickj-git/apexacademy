"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#6366F1";

interface Props {
  onUsed: () => void;
}

interface Alert {
  machine: string;
  message: string;
  severity: "critical" | "warning";
  topic: string;
  payload: string;
}

interface MachineState {
  vibration: number;
  temperature: number;
  current: number;
}

function getAlerts(id: string, state: MachineState): Alert[] {
  const alerts: Alert[] = [];
  if (state.vibration > 80) {
    alerts.push({
      machine: id,
      message: `${id}: Bearing failure predicted in 48h`,
      severity: "critical",
      topic: `iiot/${id.toLowerCase().replace(" ", "")}/alert`,
      payload: `{"type":"vibration","value":${state.vibration},"action":"schedule_maintenance"}`,
    });
  }
  if (state.temperature > 150) {
    alerts.push({
      machine: id,
      message: `${id}: Overheating! Reduce load.`,
      severity: "critical",
      topic: `iiot/${id.toLowerCase().replace(" ", "")}/alert`,
      payload: `{"type":"temperature","value":${state.temperature},"action":"reduce_load"}`,
    });
  }
  if (state.current > 40) {
    alerts.push({
      machine: id,
      message: `${id}: Overcurrent! Check motor.`,
      severity: "warning",
      topic: `iiot/${id.toLowerCase().replace(" ", "")}/alert`,
      payload: `{"type":"current","value":${state.current},"action":"inspect_motor"}`,
    });
  }
  return alerts;
}

const machineIds = ["Machine A", "Machine B", "Machine C"];

export default function IndustrialIoTSim({ onUsed }: Props) {
  const called = useRef(false);
  const [machines, setMachines] = useState<Record<string, MachineState>>({
    "Machine A": { vibration: 30, temperature: 80, current: 20 },
    "Machine B": { vibration: 50, temperature: 100, current: 25 },
    "Machine C": { vibration: 20, temperature: 60, current: 15 },
  });

  const markUsed = () => {
    if (!called.current) {
      called.current = true;
      onUsed();
    }
  };

  const handleChange = (machine: string, param: keyof MachineState, val: number) => {
    markUsed();
    setMachines(prev => ({ ...prev, [machine]: { ...prev[machine], [param]: val } }));
  };

  const allAlerts = machineIds.flatMap(id => getAlerts(id, machines[id]));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          Industrial IoT Simulator
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Adjust machine sensors to trigger predictive maintenance alerts.
        </p>
      </div>

      {/* Machines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {machineIds.map(id => {
          const state = machines[id];
          const alerts = getAlerts(id, state);
          const hasAlert = alerts.length > 0;
          return (
            <div
              key={id}
              className="rounded-xl p-4 transition-all duration-300"
              style={{
                background: hasAlert ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)",
                border: hasAlert ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: hasAlert ? "0 0 15px rgba(239,68,68,0.1)" : "none",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚙️</span>
                  <span className="text-sm font-bold" style={{ color: "#fff" }}>
                    {id}
                  </span>
                </div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: hasAlert ? "#ef4444" : "#10b981",
                    boxShadow: hasAlert ? "0 0 6px #ef4444" : "0 0 6px #10b981",
                  }}
                />
              </div>

              {/* Vibration */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Vibration</span>
                  <span style={{ color: state.vibration > 80 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>
                    {state.vibration}g
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={state.vibration}
                  onChange={e => handleChange(id, "vibration", Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: state.vibration > 80 ? "#ef4444" : COLOR }}
                />
                {state.vibration > 80 && (
                  <div className="text-xs mt-0.5" style={{ color: "#ef4444" }}>
                    ⚠ Threshold: 80g
                  </div>
                )}
              </div>

              {/* Temperature */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Temperature</span>
                  <span style={{ color: state.temperature > 150 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>
                    {state.temperature}°C
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={state.temperature}
                  onChange={e => handleChange(id, "temperature", Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: state.temperature > 150 ? "#ef4444" : COLOR }}
                />
                {state.temperature > 150 && (
                  <div className="text-xs mt-0.5" style={{ color: "#ef4444" }}>
                    ⚠ Threshold: 150°C
                  </div>
                )}
              </div>

              {/* Current */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Current</span>
                  <span style={{ color: state.current > 40 ? "#f59e0b" : "#10b981", fontWeight: "bold" }}>
                    {state.current}A
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={state.current}
                  onChange={e => handleChange(id, "current", Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: state.current > 40 ? "#f59e0b" : COLOR }}
                />
                {state.current > 40 && (
                  <div className="text-xs mt-0.5" style={{ color: "#f59e0b" }}>
                    ⚠ Threshold: 40A
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts Panel */}
      <AnimatePresence>
        {allAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl p-4 space-y-3"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: "#ef4444" }}>
                🚨 Active Alerts — Sending to Cloud Dashboard
              </span>
            </div>
            {allAlerts.map((alert, i) => (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{
                  background: alert.severity === "critical" ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)",
                  border: alert.severity === "critical" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(251,191,36,0.3)",
                }}
              >
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: alert.severity === "critical" ? "#ef4444" : "#fbbf24" }}
                >
                  {alert.message}
                </div>
                <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Topic: <span style={{ color: COLOR }}>{alert.topic}</span>
                </div>
                <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Payload: <span style={{ color: "#10b981" }}>{alert.payload}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {allAlerts.length === 0 && (
        <div
          className="rounded-xl p-4 text-center text-sm"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}
        >
          ✅ All machines operating within normal parameters
        </div>
      )}

      <div
        className="rounded-xl p-3 text-center text-sm font-semibold"
        style={{ background: `rgba(99,102,241,0.08)`, color: COLOR, border: `1px solid rgba(99,102,241,0.2)` }}
      >
        Predictive Maintenance: Prevents unplanned downtime · Saves up to 25% maintenance costs
      </div>
    </motion.section>
  );
}
