"use client";
import { motion } from "framer-motion";

const COLOR = "#10B981";

const INSIGHTS = [
  {
    icon: "🛰️",
    title: "GPS Modules & UART",
    subtitle: "NEO-6M · 9600 baud · NMEA 0183",
    color: COLOR,
    content: [
      "GPS modules (e.g., NEO-6M, NEO-M8N) communicate via UART at 9600 baud by default, outputting NMEA 0183 sentences once per second.",
      "Example NMEA sentence: $GPRMC,092927.000,A,2235.9058,N,11400.0518,E,0.000,74.11,100410,,*27 — contains time, lat/lon, speed, and heading.",
      "Parse GPS data easily using the TinyGPS++ library: latitude = gps.location.lat(); longitude = gps.location.lng();",
      "Each NMEA sentence ends with *XX where XX is a checksum (XOR of all bytes between $ and *). Malformed sentences fail checksum and are discarded.",
    ],
    highlight: "Used in: vehicle tracking, drone navigation, smartwatches, weather stations",
    code: `#include <TinyGPS++.h>
#include <SoftwareSerial.h>

SoftwareSerial gpsSerial(4, 3); // RX, TX
TinyGPSPlus gps;

void loop() {
  while (gpsSerial.available() > 0)
    gps.encode(gpsSerial.read());
  if (gps.location.isUpdated()) {
    Serial.print(gps.location.lat(), 6);
    Serial.print(",");
    Serial.println(gps.location.lng(), 6);
  }
}`,
  },
  {
    icon: "🔌",
    title: "UART vs USB — The CH340G Bridge",
    subtitle: "How Arduino USB works under the hood",
    color: "#8B5CF6",
    content: [
      "Your Arduino Uno doesn't have native USB-to-UART — it uses a CH340G or CP2102 chip that converts USB packets into simple UART signals at 5V TTL.",
      "When you select a COM port and click Upload in the IDE, the IDE sends UART data through this bridge chip to the ATmega328P bootloader.",
      "The CH340G appears as a virtual COM port on your PC. Linux: /dev/ttyUSB0. Windows: COM3. macOS: /dev/cu.usbserial-XXXX.",
      "Modern microcontrollers (ESP32-S3, RP2040, STM32 with USB FS) have native USB, avoiding the need for a bridge chip entirely — they appear as CDC ACM devices.",
    ],
    highlight: "This is why you need the CH340G driver on Windows — without it, the COM port won't appear",
    code: `// The CH340G bridge is transparent to your code.
// This exact same code works whether you use
// CH340G bridge OR native USB:
void setup() {
  Serial.begin(115200);
  Serial.println("Hello via USB-UART bridge!");
}
// The bridge handles USB ↔ UART conversion
// at the hardware level, invisibly.`,
  },
  {
    icon: "⚙️",
    title: "Hardware vs Software UART (SoftwareSerial)",
    subtitle: "Bit-banging when hardware UARTs run out",
    color: "#F59E0B",
    content: [
      "Arduino Uno has exactly 1 hardware UART on pins 0 (RX) and 1 (TX). For projects needing multiple UARTs (GPS + GSM + Serial Monitor), you need more.",
      "SoftwareSerial library bit-bangs UART on any digital pins using timer interrupts to control bit timing in software.",
      "Limitation: max ~57600 baud reliable with SoftwareSerial; blocks all interrupts during transmission; can cause jitter in servo/PWM signals.",
      "Arduino Mega has 4 hardware UARTs (Serial, Serial1, Serial2, Serial3) — always prefer hardware UART for reliability above 57600 baud.",
    ],
    highlight: "ESP32 has 3 hardware UARTs and also supports UART on virtually any GPIO via IO_MUX",
    code: `#include <SoftwareSerial.h>

// GPS on pins 4 (RX) and 5 (TX)
SoftwareSerial gpsSerial(4, 5);

// GSM on pins 6 (RX) and 7 (TX)
SoftwareSerial gsmSerial(6, 7);

void setup() {
  Serial.begin(115200);    // Hardware UART (debug)
  gpsSerial.begin(9600);   // Software UART (GPS)
  // Note: only one SoftwareSerial can listen at a time
  gpsSerial.listen();
}`,
  },
];

export default function EngineeringInsights() {
  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 09 · Engineering Insights</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Engineering Insights</h2>
        <p className="text-sm mb-8 max-w-2xl" style={{ color: "rgba(240,240,245,0.5)" }}>
          Real-world UART applications and how professional engineers use serial communication in production systems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5">
        {INSIGHTS.map((ins, i) => (
          <motion.div
            key={ins.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl border p-6"
            style={{ background: `${ins.color}05`, borderColor: `${ins.color}20` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${ins.color}12`, border: `1px solid ${ins.color}30` }}
              >
                {ins.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="text-base font-black" style={{ color: "#F0F0F5" }}>{ins.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: `${ins.color}12`, color: ins.color, border: `1px solid ${ins.color}25` }}>
                    {ins.subtitle}
                  </span>
                </div>
                <div className="space-y-1.5 mt-2 mb-3">
                  {ins.content.map((line, li) => (
                    <div key={li} className="flex items-start gap-2 text-sm" style={{ color: "rgba(240,240,245,0.6)" }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: ins.color }}>▸</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                {/* Code snippet */}
                <pre className="rounded-xl px-4 py-3 text-[10px] font-mono overflow-x-auto mb-3" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)", color: ins.color, whiteSpace: "pre-wrap" }}>
                  {ins.code}
                </pre>
                <div className="p-3 rounded-xl" style={{ background: `${ins.color}08`, border: `1px solid ${ins.color}20` }}>
                  <span className="text-xs" style={{ color: ins.color }}>💡 {ins.highlight}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
