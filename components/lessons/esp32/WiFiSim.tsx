"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onUse: () => void; }

const COLOR = "#06B6D4";

const NETWORKS = [
  { ssid: "HomeNetwork_5G", rssi: -42, channel: 6, security: "WPA3", bssid: "AA:BB:CC:11:22:33" },
  { ssid: "APEX_IoT_Lab", rssi: -55, channel: 1, security: "WPA2", bssid: "DE:AD:BE:EF:00:01" },
  { ssid: "ESP32_Demo", rssi: -61, channel: 11, security: "WPA2", bssid: "24:6F:28:AA:BB:CC" },
  { ssid: "NeighborWifi", rssi: -74, channel: 6, security: "WPA2", bssid: "FC:EC:DA:12:34:56" },
  { ssid: "OpenHotspot", rssi: -79, channel: 1, security: "Open", bssid: "00:11:22:33:44:55" },
  { ssid: "Office_Guest", rssi: -88, channel: 11, security: "WPA2", bssid: "B8:27:EB:FF:EE:DD" },
];

function rssiBar(rssi: number) {
  const pct = Math.max(0, Math.min(100, ((rssi + 100) / 70) * 100));
  const color = rssi > -60 ? "#10B981" : rssi > -75 ? "#F59E0B" : "#EF4444";
  return { pct, color };
}

export default function WiFiSim({ onUse }: Props) {
  const [scanning, setScanning] = useState(false);
  const [networks, setNetworks] = useState<typeof NETWORKS>([]);
  const [connected, setConnected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [ip, setIp] = useState<string | null>(null);
  const [called, setCalled] = useState(false);

  function startScan() {
    if (!called) { setCalled(true); onUse(); }
    setNetworks([]);
    setConnected(null);
    setIp(null);
    setScanning(true);
    NETWORKS.forEach((n, i) => {
      setTimeout(() => {
        setNetworks(prev => [...prev, n]);
        if (i === NETWORKS.length - 1) setScanning(false);
      }, (i + 1) * 350);
    });
  }

  function connect(ssid: string) {
    if (ssid === "OpenHotspot" || connecting) return;
    setConnecting(ssid);
    setConnected(null);
    setIp(null);
    setTimeout(() => {
      setConnected(ssid);
      setConnecting(null);
      setIp(`192.168.1.${Math.floor(Math.random() * 200 + 10)}`);
    }, 1800);
  }

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 03 · Simulator</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>WiFi Scanner</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(240,240,245,0.4)" }}>
          Simulate ESP32 WiFi scanning with <code className="font-mono text-xs px-1 rounded" style={{ background: "rgba(6,182,212,0.1)", color: COLOR }}>WiFi.scanNetworks()</code>
        </p>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,182,212,0.04)", borderColor: "rgba(6,182,212,0.2)" }}>
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#10B981" }} />
            <span className="ml-2 text-xs font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>ESP32 Serial Monitor</span>
          </div>

          {/* Code snippet */}
          <div className="mb-4 p-3 rounded-xl text-xs font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(240,240,245,0.6)" }}>
            <div><span style={{ color: "#F59E0B" }}>int</span> n = <span style={{ color: COLOR }}>WiFi</span>.scanNetworks();</div>
            <div><span style={{ color: "#8B5CF6" }}>for</span> (<span style={{ color: "#F59E0B" }}>int</span> i=0; i{"<"}n; i++) {"{"}</div>
            <div>  Serial.println(<span style={{ color: COLOR }}>WiFi</span>.SSID(i) + <span style={{ color: "#10B981" }}>" RSSI:"</span> + <span style={{ color: COLOR }}>WiFi</span>.RSSI(i));</div>
            <div>{"}"}</div>
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
                Scanning...
              </span>
            ) : "Scan Networks"}
          </button>

          <AnimatePresence>
            {networks.map((n, i) => {
              const { pct, color } = rssiBar(n.rssi);
              const isCon = connected === n.ssid;
              const isConning = connecting === n.ssid;
              return (
                <motion.div
                  key={n.ssid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all"
                  style={{
                    background: isCon ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isCon ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"}`,
                  }}
                  onClick={() => connect(n.ssid)}
                >
                  {/* Signal icon */}
                  <div className="flex items-end gap-0.5 flex-shrink-0">
                    {[25, 50, 75, 100].map((t, j) => (
                      <div key={j} className="w-1 rounded-sm" style={{ height: `${(j + 1) * 4}px`, background: pct >= t ? color : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate" style={{ color: "#F0F0F5" }}>{n.ssid}</span>
                      {n.security === "Open" && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>OPEN</span>}
                      {n.security === "WPA3" && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>WPA3</span>}
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>
                      {n.bssid} · Ch {n.channel} · {n.rssi} dBm
                    </div>
                  </div>
                  <div className="text-xs flex-shrink-0" style={{ color: isCon ? "#10B981" : isConning ? COLOR : "rgba(240,240,245,0.25)" }}>
                    {isCon ? "Connected" : isConning ? "Connecting..." : n.security !== "Open" ? "Connect" : "—"}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {connected && ip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl border text-xs font-mono"
              style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.25)", color: "#10B981" }}
            >
              <div>Connected to: {connected}</div>
              <div>IP Address: {ip}</div>
              <div>Gateway: 192.168.1.1</div>
              <div>DNS: 8.8.8.8</div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
