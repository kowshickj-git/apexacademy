"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR = "#6366F1";

const takeaways = [
  {
    title: "What is IoT?",
    content:
      "IoT (Internet of Things) is a network of physical devices embedded with sensors, software, and connectivity that enables them to collect and exchange data over the internet. Any device with a sensor, processor, and internet connection qualifies.",
  },
  {
    title: "IoT Architecture",
    content:
      "Four layers: (1) Perception Layer — sensors and actuators. (2) Network Layer — WiFi, BLE, Zigbee, LoRa, NB-IoT. (3) Processing Layer — cloud and edge computing. (4) Application Layer — dashboards, apps, automation, alerts.",
  },
  {
    title: "MQTT Protocol",
    content:
      "MQTT is a lightweight publish/subscribe messaging protocol designed for constrained devices. Port 1883 (plain text — development only). Port 8883 (TLS — always use in production). 2-byte fixed header. QoS levels: 0 (fire & forget), 1 (at least once), 2 (exactly once).",
  },
  {
    title: "Connectivity Options",
    content:
      "WiFi: fast, high bandwidth, high power (~80–240mA) — best for mains-powered devices. BLE: short range, very low power (~8mA) — best for wearables. LoRa: 2–15km range, ultra-low power — best for agriculture and smart cities. NB-IoT: cellular, 10km range, years of battery life — best for asset tracking.",
  },
  {
    title: "Edge vs Cloud Computing",
    content:
      "Edge: process data locally on the device. Latency <1ms, works offline, privacy-friendly. Cloud: long-term storage, ML training, global access, infinite scale. Best practice: filter and process at the edge, sync summaries and anomalies to the cloud.",
  },
  {
    title: "IoT Security",
    content:
      "Always use TLS (mqtts:// on port 8883). Use X.509 certificates for device authentication. Never use default credentials. Implement OTA (Over-The-Air) firmware updates. Use unique credentials per device. Mirai botnet 2016 was a lesson: 600,000 IoT devices taken over due to default passwords.",
  },
];

export default function KeyTakeaways() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
          Key Takeaways
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          The essential concepts from IoT Fundamentals.
        </p>
      </div>

      <div className="space-y-2">
        {takeaways.map((item, i) => (
          <div
            key={item.title}
            className="rounded-xl overflow-hidden"
            style={{ border: openIndex === i ? `1px solid rgba(99,102,241,0.4)` : "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
              style={{ background: openIndex === i ? `rgba(99,102,241,0.12)` : "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: openIndex === i ? COLOR : "rgba(99,102,241,0.2)", color: "#fff" }}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                  {item.title}
                </span>
              </div>
              <span
                className="transition-transform duration-200 text-sm"
                style={{
                  color: COLOR,
                  transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}
              >
                ▾
              </span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="px-4 pb-4 pt-2 text-sm"
                    style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, background: "rgba(255,255,255,0.02)" }}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
