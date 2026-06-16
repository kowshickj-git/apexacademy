"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const COLOR = "#F97316";
const TOPICS = ["Four-wire (MOSI/MISO/SCK/CS)","Full-duplex communication","Up to 50+ MHz speed","CPOL/CPHA clock modes","Daisy-chain topology","No addressing overhead"];

export default function SPIPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"var(--background)"}}>
      <motion.div className="max-w-lg w-full text-center" initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <motion.div className="w-20 h-20 rounded-3xl border mx-auto mb-6 flex items-center justify-center text-3xl"
          style={{borderColor:"rgba(249,115,22,0.3)",background:"rgba(249,115,22,0.08)"}}
          animate={{boxShadow:["0 0 0px rgba(249,115,22,0.2)","0 0 32px rgba(249,115,22,0.35)","0 0 0px rgba(249,115,22,0.2)"]}}
          transition={{duration:2.5,repeat:Infinity}}>
          ⚡
        </motion.div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4"
          style={{borderColor:"rgba(249,115,22,0.3)",background:"rgba(249,115,22,0.08)",color:COLOR}}>
          Lesson 25 · Coming Soon
        </div>
        <h1 className="text-3xl font-black mb-3 text-white">SPI Protocol</h1>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          SPI (Serial Peripheral Interface) is a fast, full-duplex four-wire protocol. This lesson covers MOSI/MISO/SCK/CS lines, clock polarity and phase modes, and interfacing displays, ADCs, and flash memory.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          {TOPICS.map(t => (
            <div key={t} className="flex items-center gap-2 text-xs text-white/35 p-3 rounded-xl border border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>
              <span style={{color:COLOR}}>○</span>{t}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/electronics/i2c" className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5"
            style={{borderColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)"}}>← I2C</Link>
          <Link href="/electronics/can" className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.3)",color:COLOR}}>CAN →</Link>
        </div>
      </motion.div>
    </div>
  );
}
