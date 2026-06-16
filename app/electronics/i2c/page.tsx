"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const COLOR = "#3B82F6";
const TOPICS = ["Two-wire (SDA + SCL)","7-bit addressing (128 devices)","400kHz Fast Mode","ACK/NACK handshaking","Multi-master arbitration","Clock stretching"];

export default function I2CPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"var(--background)"}}>
      <motion.div className="max-w-lg w-full text-center" initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <motion.div className="w-20 h-20 rounded-3xl border mx-auto mb-6 flex items-center justify-center text-3xl"
          style={{borderColor:"rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.08)"}}
          animate={{boxShadow:["0 0 0px rgba(59,130,246,0.2)","0 0 32px rgba(59,130,246,0.35)","0 0 0px rgba(59,130,246,0.2)"]}}
          transition={{duration:2.5,repeat:Infinity}}>
          🔗
        </motion.div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4"
          style={{borderColor:"rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.08)",color:COLOR}}>
          Lesson 24 · Coming Soon
        </div>
        <h1 className="text-3xl font-black mb-3 text-white">I2C Protocol</h1>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          I2C (Inter-Integrated Circuit) is a two-wire serial protocol for connecting sensors and peripherals. This lesson covers addressing, clock stretching, multi-master, and reading common I2C sensors.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          {TOPICS.map(t => (
            <div key={t} className="flex items-center gap-2 text-xs text-white/35 p-3 rounded-xl border border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>
              <span style={{color:COLOR}}>○</span>{t}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/electronics/uart" className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5"
            style={{borderColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)"}}>← UART</Link>
          <Link href="/electronics/spi" className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{background:"rgba(59,130,246,0.15)",border:"1px solid rgba(59,130,246,0.3)",color:COLOR}}>SPI →</Link>
        </div>
      </motion.div>
    </div>
  );
}
