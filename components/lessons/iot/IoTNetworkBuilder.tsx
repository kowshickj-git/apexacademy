"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#6366F1";

interface Props {
  onUsed: () => void;
}

interface DeviceType {
  id: string;
  label: string;
  icon: string;
  protocol: string;
  protocolColor: string;
  powerMa: number;
  dataKBDay: number;
}

const deviceTypes: DeviceType[] = [
  { id: "temp", label: "Temperature Sensor", icon: "🌡️", protocol: "Zigbee", protocolColor: "#10b981", powerMa: 3, dataKBDay: 12 },
  { id: "motion", label: "Motion Sensor", icon: "🚶", protocol: "BLE", protocolColor: "#06b6d4", powerMa: 5, dataKBDay: 8 },
  { id: "bulb", label: "Smart Bulb", icon: "💡", protocol: "WiFi", protocolColor: "#3b82f6", powerMa: 85, dataKBDay: 20 },
  { id: "plug", label: "Smart Plug", icon: "🔌", protocol: "WiFi", protocolColor: "#3b82f6", powerMa: 90, dataKBDay: 30 },
  { id: "door", label: "Door Sensor", icon: "🚪", protocol: "Zigbee", protocolColor: "#10b981", powerMa: 2, dataKBDay: 5 },
];

interface PlacedDevice {
  uid: string;
  type: DeviceType;
  x: number;
  y: number;
}

export default function IoTNetworkBuilder({ onUsed }: Props) {
  const called = useRef(false);
  const [devices, setDevices] = useState<PlacedDevice[]>([]);
  const uidRef = useRef(0);

  const markUsed = () => {
    if (!called.current) {
      called.current = true;
      onUsed();
    }
  };

  const addDevice = (type: DeviceType) => {
    markUsed();
    const uid = `dev-${++uidRef.current}`;
    const x = 10 + Math.random() * 60;
    const y = 10 + Math.random() * 70;
    setDevices(prev => [...prev, { uid, type, x, y }]);
  };

  const clearAll = () => {
    setDevices([]);
  };

  const totalDataKBDay = devices.reduce((s, d) => s + d.type.dataKBDay, 0);
  const totalDataMBMonth = ((totalDataKBDay * 30) / 1024).toFixed(1);
  const showHub = devices.length >= 2;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          IoT Network Builder
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Build your own IoT network. Add devices and see how the system scales.
        </p>
      </div>

      {/* Device buttons */}
      <div className="flex flex-wrap gap-2">
        {deviceTypes.map(dt => (
          <button
            key={dt.id}
            onClick={() => addDevice(dt)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          >
            <span>{dt.icon}</span>
            <span>{dt.label}</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ background: `${dt.protocolColor}25`, color: dt.protocolColor }}
            >
              {dt.protocol}
            </span>
          </button>
        ))}
        {devices.length > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Canvas */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          height: "320px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {devices.length === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Add devices to build your network
          </div>
        )}

        {/* Hub */}
        <AnimatePresence>
          {showHub && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg border-2"
                style={{
                  background: `rgba(99,102,241,0.2)`,
                  borderColor: COLOR,
                  boxShadow: `0 0 20px rgba(99,102,241,0.3)`,
                }}
              >
                🌐
              </div>
              <span className="text-xs font-bold" style={{ color: COLOR }}>
                Gateway
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Devices */}
        <AnimatePresence>
          {devices.map(d => (
            <motion.div
              key={d.uid}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: `1px solid ${d.type.protocolColor}55`,
                }}
              >
                {d.type.icon}
              </div>
              <span
                className="px-1.5 py-0.5 rounded text-xs font-bold"
                style={{ background: `${d.type.protocolColor}20`, color: d.type.protocolColor }}
              >
                {d.type.protocol}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Chain display (when hub visible) */}
        {showHub && (
          <div
            className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 text-xs"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <span>Hub</span>
            <span>→</span>
            <span>Router</span>
            <span>→</span>
            <span>Internet</span>
            <span>→</span>
            <span style={{ color: COLOR }}>Cloud</span>
          </div>
        )}
      </div>

      {/* Stats */}
      {devices.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xl font-black" style={{ color: COLOR }}>
              {devices.length}
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Devices</div>
          </div>
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xl font-black" style={{ color: "#818cf8" }}>
              {totalDataMBMonth}MB
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Cloud data/month</div>
          </div>
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xl font-black" style={{ color: "#10b981" }}>
              {[...new Set(devices.map(d => d.type.protocol))].length}
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Protocols used</div>
          </div>
        </motion.div>
      )}

      {/* Device list */}
      {devices.length > 0 && (
        <div className="space-y-1">
          {devices.map(d => (
            <div
              key={d.uid}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span>{d.type.icon}</span>
              <span style={{ color: "#fff" }}>{d.type.label}</span>
              <span
                className="px-1.5 py-0.5 rounded"
                style={{ background: `${d.type.protocolColor}20`, color: d.type.protocolColor }}
              >
                {d.type.protocol}
              </span>
              <span className="ml-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
                {d.type.powerMa}mA · {d.type.dataKBDay}KB/day
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
