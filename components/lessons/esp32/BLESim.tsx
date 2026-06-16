"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#06B6D4";

const BLE_DEVICES = [
  { name: "APEX_Sensor_01", mac: "24:6F:28:B1:C2:D3", rssi: -44, services: ["0x180D Heart Rate", "0x180F Battery"] },
  { name: "SmartWatch_Pro", mac: "A4:C1:38:44:55:66", rssi: -58, services: ["0x1800 Generic Access", "0x1801 Generic Attr"] },
  { name: "BLE_Beacon_Lab", mac: "CC:50:E3:AA:BB:CC", rssi: -65, services: ["0x1802 Immediate Alert"] },
  { name: "ESP32_Gateway",  mac: "30:AE:A4:DD:EE:FF", rssi: -72, services: ["0xFF00 Custom", "0x1800 Generic Access"] },
  { name: "Unknown Device", mac: "5C:CF:7F:12:34:56", rssi: -83, services: [] },
];

function rssiColor(rssi: number) {
  return rssi > -60 ? "#10B981" : rssi > -75 ? "#F59E0B" : "#EF4444";
}

export default function BLESim({ onUse }: Props) {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<typeof BLE_DEVICES>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [called, setCalled] = useState(false);

  function startScan() {
    if (!called) { setCalled(true); onUse(); }
    setDevices([]);
    setSelected(null);
    setScanning(true);
    BLE_DEVICES.forEach((d, i) => {
      setTimeout(() => {
        setDevices(prev => [...prev, d]);
        if (i === BLE_DEVICES.length - 1) setTimeout(() => setScanning(false), 400);
      }, (i + 1) * 400);
    });
  }

  const selectedDev = BLE_DEVICES.find(d => d.mac === selected);

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 04 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>BLE Scanner</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          Simulate BLE advertisement scanning with <code className="font-mono text-xs px-1 rounded" style={{ background: "rgba(6,182,212,0.1)", color: COLOR }}>BLEScan</code>
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.2)" }}>
          <div className="mb-4 p-3 rounded-xl text-xs font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.6)" }}>
            <div><span style={{ color: COLOR }}>BLEScan</span>* pBLEScan = <span style={{ color: COLOR }}>BLEDevice</span>::getScan();</div>
            <div>pBLEScan-{">"}<span style={{ color: "#10B981" }}>setActiveScan</span>(<span style={{ color: "#F59E0B" }}>true</span>);</div>
            <div><span style={{ color: "#8B5CF6" }}>BLEScanResults</span> results = pBLEScan-{">"}<span style={{ color: "#10B981" }}>start</span>(5, <span style={{ color: "#F59E0B" }}>false</span>);</div>
          </div>

          <button
            onClick={startScan}
            disabled={scanning}
            className="w-full py-2.5 rounded-xl font-bold text-sm border mb-4 transition-all disabled:opacity-50"
            style={{ borderColor: "rgba(6,182,212,0.4)", background: "rgba(6,182,212,0.12)", color: COLOR }}
          >
            {scanning ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="inline-block">⟳</motion.span>
                Scanning for BLE devices...
              </span>
            ) : "Start BLE Scan"}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <AnimatePresence>
                {devices.map((d, i) => (
                  <motion.div
                    key={d.mac}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all"
                    onClick={() => setSelected(d.mac === selected ? null : d.mac)}
                    style={{
                      background: selected === d.mac ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selected === d.mac ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                      style={{ background: `${rssiColor(d.rssi)}15`, border: `1px solid ${rssiColor(d.rssi)}30`, color: rssiColor(d.rssi) }}
                    >
                      BT
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: "#F0F0F5" }}>{d.name}</div>
                      <div className="text-[10px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>{d.mac}</div>
                      <div className="text-[10px]" style={{ color: rssiColor(d.rssi) }}>{d.rssi} dBm</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {selectedDev && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl border h-fit"
                  style={{ background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.25)" }}
                >
                  <div className="text-xs font-bold mb-3" style={{ color: COLOR }}>Advertising Packet</div>
                  <div className="space-y-1.5 text-[10px] font-mono">
                    <div className="flex justify-between">
                      <span style={{ color: "rgba(240,240,245,0.4)" }}>Name</span>
                      <span style={{ color: "#F0F0F5" }}>{selectedDev.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "rgba(240,240,245,0.4)" }}>MAC</span>
                      <span style={{ color: "#F0F0F5" }}>{selectedDev.mac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "rgba(240,240,245,0.4)" }}>RSSI</span>
                      <span style={{ color: rssiColor(selectedDev.rssi) }}>{selectedDev.rssi} dBm</span>
                    </div>
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: "rgba(6,182,212,0.15)" }}>
                      <div className="mb-1" style={{ color: "rgba(240,240,245,0.4)" }}>Services:</div>
                      {selectedDev.services.length > 0 ? selectedDev.services.map(s => (
                        <div key={s} className="text-[9px] mb-0.5" style={{ color: COLOR }}>{s}</div>
                      )) : <div style={{ color: "rgba(240,240,245,0.3)" }}>No services advertised</div>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
