"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#F59E0B";

type FC = "FC01" | "FC03" | "FC06";

interface FrameByte {
  hex: string;
  label: string;
  color: string;
}

function crc16(data: number[]): number {
  let crc = 0xFFFF;
  for (const b of data) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x0001) { crc = (crc >> 1) ^ 0xA001; }
      else { crc >>= 1; }
    }
  }
  return crc;
}

function buildRequest(addr: number, fc: FC, reg: number, value: number): FrameByte[] {
  const fcByte = fc === "FC01" ? 0x01 : fc === "FC03" ? 0x03 : 0x06;
  const data = [addr, fcByte, (reg >> 8) & 0xFF, reg & 0xFF];
  if (fc === "FC06") {
    data.push((value >> 8) & 0xFF, value & 0xFF);
  } else {
    data.push(0x00, 0x02);
  }
  const crcVal = crc16(data);
  data.push(crcVal & 0xFF, (crcVal >> 8) & 0xFF);

  const labels = fc === "FC06"
    ? ["Addr", "FC", "Reg Hi", "Reg Lo", "Val Hi", "Val Lo", "CRC Lo", "CRC Hi"]
    : ["Addr", "FC", "Reg Hi", "Reg Lo", "Cnt Hi", "Cnt Lo", "CRC Lo", "CRC Hi"];
  const colors = ["#60A5FA", COLOR, "#A78BFA", "#A78BFA", "#34D399", "#34D399", "rgba(240,240,245,0.4)", "rgba(240,240,245,0.4)"];

  return data.map((b, i) => ({
    hex: b.toString(16).toUpperCase().padStart(2, "0"),
    label: labels[i] || `B${i}`,
    color: colors[i] || "rgba(240,240,245,0.4)",
  }));
}

function buildResponse(addr: number, fc: FC, reg: number): FrameByte[] {
  const fcByte = fc === "FC01" ? 0x01 : fc === "FC03" ? 0x03 : 0x06;
  let data: number[];
  let labels: string[];

  if (fc === "FC06") {
    data = [addr, fcByte, (reg >> 8) & 0xFF, reg & 0xFF, 0x00, 0x64];
    labels = ["Addr", "FC", "Reg Hi", "Reg Lo", "Val Hi", "Val Lo"];
  } else {
    data = [addr, fcByte, 0x04, 0x02, 0x58, 0x00, 0x1E];
    labels = ["Addr", "FC", "Byte Cnt", "D1 Hi", "D1 Lo", "D2 Hi", "D2 Lo"];
  }

  const crcVal = crc16(data);
  data.push(crcVal & 0xFF, (crcVal >> 8) & 0xFF);
  labels.push("CRC Lo", "CRC Hi");

  const colors = ["#60A5FA", COLOR, "#F97316", "#34D399", "#34D399", "#34D399", "#34D399", "rgba(240,240,245,0.4)", "rgba(240,240,245,0.4)"];

  return data.map((b, i) => ({
    hex: b.toString(16).toUpperCase().padStart(2, "0"),
    label: labels[i] || `B${i}`,
    color: colors[i] || "rgba(240,240,245,0.4)",
  }));
}

export default function ModbusSim({ onUsed }: Props) {
  const [addr, setAddr] = useState(1);
  const [fc, setFc] = useState<FC>("FC03");
  const [reg, setReg] = useState(0);
  const [value, setValue] = useState(100);
  const [sent, setSent] = useState(false);
  const [called, setCalled] = useState(false);

  function sendRequest() {
    if (!called) { setCalled(true); onUsed(); }
    setSent(true);
  }

  const reqFrame = buildRequest(addr, fc, reg, value);
  const resFrame = buildResponse(addr, fc, reg);

  const fcDescriptions: Record<FC, string> = {
    FC01: "Read Coils — reads digital output (coil) status bits",
    FC03: "Read Holding Registers — reads 16-bit register values",
    FC06: "Write Single Register — writes one 16-bit register value",
  };

  return (
    <section className="py-10 border-b border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
          Section 07 · Modbus Protocol
        </p>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#F0F0F5" }}>Modbus RTU Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.5)" }}>
          Modbus RTU is the most common protocol over RS485 in industrial systems.
          Build a real Modbus frame and see the byte breakdown with CRC-16.
        </p>

        {/* Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(240,240,245,0.45)" }}>Device Address (1–10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={addr}
              onChange={e => setAddr(Math.min(10, Math.max(1, Number(e.target.value))))}
              className="w-full px-3 py-2 rounded-xl text-sm font-mono"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#60A5FA" }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(240,240,245,0.45)" }}>Function Code</label>
            <select
              value={fc}
              onChange={e => setFc(e.target.value as FC)}
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: COLOR }}
            >
              <option value="FC01" style={{ background: "#111" }}>FC01 – Read Coils</option>
              <option value="FC03" style={{ background: "#111" }}>FC03 – Read Holding Regs</option>
              <option value="FC06" style={{ background: "#111" }}>FC06 – Write Single Reg</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(240,240,245,0.45)" }}>Register (0–9999)</label>
            <input
              type="number"
              min={0}
              max={9999}
              value={reg}
              onChange={e => setReg(Math.min(9999, Math.max(0, Number(e.target.value))))}
              className="w-full px-3 py-2 rounded-xl text-sm font-mono"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#A78BFA" }}
            />
          </div>
          {fc === "FC06" && (
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "rgba(240,240,245,0.45)" }}>Write Value</label>
              <input
                type="number"
                min={0}
                max={65535}
                value={value}
                onChange={e => setValue(Math.min(65535, Math.max(0, Number(e.target.value))))}
                className="w-full px-3 py-2 rounded-xl text-sm font-mono"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#34D399" }}
              />
            </div>
          )}
        </div>

        {/* FC description */}
        <div className="rounded-xl px-4 py-2.5 mb-4 text-xs" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)", color: "rgba(240,240,245,0.55)" }}>
          {fcDescriptions[fc]}
        </div>

        <button
          onClick={sendRequest}
          className="w-full py-3 rounded-xl font-bold text-sm mb-6 transition-all hover:opacity-90"
          style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: COLOR }}
        >
          Send Modbus Request →
        </button>

        {/* Request frame */}
        <div className="mb-5">
          <div className="text-xs font-mono mb-2" style={{ color: "rgba(240,240,245,0.4)" }}>
            REQUEST Frame ({reqFrame.length} bytes):
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {reqFrame.map((b, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={sent ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.4 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-12 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm"
                  style={{ background: `${b.color}18`, border: `1px solid ${b.color}50`, color: b.color }}
                >
                  {b.hex}
                </div>
                <div className="text-[8px] mt-1 text-center font-mono" style={{ color: "rgba(240,240,245,0.35)" }}>
                  {b.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Response frame */}
        {sent && fc !== "FC06" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-5"
          >
            <div className="text-xs font-mono mb-2" style={{ color: "rgba(240,240,245,0.4)" }}>
              RESPONSE Frame ({resFrame.length} bytes):
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {resFrame.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.06 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-12 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm"
                    style={{ background: `${b.color}18`, border: `1px solid ${b.color}50`, color: b.color }}
                  >
                    {b.hex}
                  </div>
                  <div className="text-[8px] mt-1 text-center font-mono" style={{ color: "rgba(240,240,245,0.35)" }}>
                    {b.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CRC explanation */}
        {sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="rounded-xl p-4 text-xs"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,240,245,0.5)" }}
          >
            <span className="font-bold" style={{ color: "rgba(240,240,245,0.7)" }}>CRC-16 Error Detection:</span>{" "}
            Modbus RTU uses the CRC-16/IBM polynomial (0xA001 reflected).
            The receiver recalculates CRC over all bytes; if it doesn&apos;t match, the frame is discarded.
            CRC Lo byte comes first (little-endian), CRC Hi second.
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
