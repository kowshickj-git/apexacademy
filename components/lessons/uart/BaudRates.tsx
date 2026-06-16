"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const COLOR = "#10B981";

const BAUD_RATES = [
  { baud: 300,    usPerBit: "3333",  label: "Very slow (legacy modems)",    bytesPerSec: 30    },
  { baud: 1200,   usPerBit: "833",   label: "Legacy",                        bytesPerSec: 120   },
  { baud: 2400,   usPerBit: "417",   label: "Legacy",                        bytesPerSec: 240   },
  { baud: 4800,   usPerBit: "208",   label: "Legacy",                        bytesPerSec: 480   },
  { baud: 9600,   usPerBit: "104",   label: "Standard / GPS default",        bytesPerSec: 960   },
  { baud: 19200,  usPerBit: "52",    label: "Common",                        bytesPerSec: 1920  },
  { baud: 38400,  usPerBit: "26",    label: "Common",                        bytesPerSec: 3840  },
  { baud: 57600,  usPerBit: "17",    label: "Fast",                          bytesPerSec: 5760  },
  { baud: 115200, usPerBit: "8.7",   label: "Arduino default recommended",   bytesPerSec: 11520 },
  { baud: 230400, usPerBit: "4.3",   label: "High speed",                    bytesPerSec: 23040 },
  { baud: 921600, usPerBit: "1.1",   label: "Very high speed",               bytesPerSec: 92160 },
];

const MAX_BAUD = 921600;

function formatBytes(b: number): string {
  if (b >= 1024) return `${(b / 1024).toFixed(2)} KB/s`;
  return `${b} bytes/s`;
}

function helloTime(baud: number): string {
  // "Hello World" = 11 chars, 8N1 = 110 bits
  const ms = (110 / baud) * 1000;
  if (ms < 1) return `${(ms * 1000).toFixed(1)} µs`;
  return `${ms.toFixed(3)} ms`;
}

export default function BaudRates() {
  const [highlighted, setHighlighted] = useState<number | null>(8); // default 115200

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 03 · Baud Rates</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Baud Rates Reference</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
          Baud rate = symbols (bits) per second. Both devices must match exactly. Hover a row to see timing details.
        </p>
      </motion.div>

      {/* Bar chart + table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
        className="rounded-2xl border overflow-hidden mb-6"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="px-4 py-3 border-b" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="grid grid-cols-4 gap-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(240,240,245,0.3)" }}>
            <span>Baud Rate</span>
            <span>µs / bit</span>
            <span>Effective Rate</span>
            <span>Speed</span>
          </div>
        </div>
        {BAUD_RATES.map((row, i) => {
          const pct = (row.baud / MAX_BAUD) * 100;
          const isHl = highlighted === i;
          return (
            <div
              key={row.baud}
              className="grid grid-cols-4 gap-2 px-4 py-2.5 items-center cursor-pointer border-b transition-all duration-150"
              style={{
                borderColor: "rgba(255,255,255,0.04)",
                background: isHl ? "rgba(16,185,129,0.08)" : "transparent",
              }}
              onMouseEnter={() => setHighlighted(i)}
              onMouseLeave={() => setHighlighted(null)}
            >
              <span className="text-xs font-mono font-bold" style={{ color: isHl ? COLOR : "rgba(240,240,245,0.7)" }}>
                {row.baud.toLocaleString()}
              </span>
              <span className="text-xs font-mono" style={{ color: isHl ? "#34D399" : "rgba(240,240,245,0.4)" }}>
                {row.usPerBit}
              </span>
              <span className="text-xs font-mono" style={{ color: isHl ? "#6EE7B7" : "rgba(240,240,245,0.4)" }}>
                {formatBytes(row.bytesPerSec)}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: isHl ? `linear-gradient(90deg,${COLOR},#34D399)` : "rgba(16,185,129,0.3)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.04 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Detail panel when highlighted */}
      {highlighted !== null && (
        <motion.div
          key={highlighted}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-5 mb-6"
          style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}
        >
          <div className="text-sm font-black mb-2" style={{ color: COLOR }}>
            {BAUD_RATES[highlighted].baud.toLocaleString()} baud — {BAUD_RATES[highlighted].label}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-mono font-bold" style={{ color: COLOR }}>{BAUD_RATES[highlighted].usPerBit} µs</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>per bit</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-mono font-bold" style={{ color: "#34D399" }}>{formatBytes(BAUD_RATES[highlighted].bytesPerSec)}</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>effective (8N1)</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-mono font-bold" style={{ color: "#6EE7B7" }}>{helloTime(BAUD_RATES[highlighted].baud)}</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>"Hello World" (110 bits)</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-mono font-bold" style={{ color: "#A7F3D0" }}>{((BAUD_RATES[highlighted].baud / MAX_BAUD) * 100).toFixed(1)}%</div>
              <div className="text-[10px]" style={{ color: "rgba(240,240,245,0.35)" }}>of max speed</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transmission time comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
        className="rounded-2xl border p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-sm font-bold mb-3" style={{ color: "#F0F0F5" }}>
          &quot;Hello World&quot; (11 chars = 110 bits at 8N1) Transmission Time
        </h3>
        <div className="space-y-2">
          {[
            { baud: 9600, label: "9600 baud", time: "11.46 ms", color: "rgba(240,240,245,0.3)" },
            { baud: 115200, label: "115200 baud", time: "0.955 ms", color: COLOR },
            { baud: 921600, label: "921600 baud", time: "0.119 ms", color: "#34D399" },
          ].map(item => (
            <div key={item.baud} className="flex items-center gap-3">
              <div className="w-24 text-xs font-mono text-right" style={{ color: item.color }}>{item.label}</div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(9600 / item.baud) * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="w-20 text-xs font-mono" style={{ color: item.color }}>{item.time}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Best practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        className="rounded-2xl border p-5"
        style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💡</span>
          <span className="text-sm font-bold" style={{ color: COLOR }}>Best Practices</span>
        </div>
        <div className="space-y-2">
          {[
            "Use 115200 baud for most Arduino and ESP32 projects — it's fast and universally supported",
            "Use 9600 baud for GPS modules (NEO-6M, u-blox) — their hardware default",
            "Check the module datasheet before assuming baud rate — some default to 57600 or 38400",
            "Higher baud rates require shorter cables and good signal integrity",
            "SoftwareSerial (Arduino) is reliable only up to ~57600 baud; prefer hardware UART",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "rgba(240,240,245,0.6)" }}>
              <span style={{ color: COLOR, flexShrink: 0 }}>▸</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
