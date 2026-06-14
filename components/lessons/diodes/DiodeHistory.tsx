"use client";

import { motion } from "framer-motion";

const events = [
  { year: "1874", title: "Metal-Semiconductor Effect", who: "Karl Braun", body: "Braun discovers that a metal point touching a crystal passes current more easily in one direction — the birth of the diode concept." },
  { year: "1904", title: "First Vacuum Tube Diode", who: "John Ambrose Fleming", body: "Fleming patents the vacuum tube diode — a glass tube with two electrodes that rectifies radio signals. First practical diode." },
  { year: "1906", title: "Crystal Radio", who: "Various inventors", body: "Crystal radios use cat-whisker diodes (metal wire on galena crystal) to detect radio broadcasts. No power needed." },
  { year: "1940s", title: "WWII Radar Diodes", who: "Bell Labs & MIT", body: "Silicon and germanium point-contact diodes are miniaturised for WWII radar systems — the first modern semiconductor diodes." },
  { year: "1949", title: "P-N Junction Theory", who: "William Shockley", body: "Shockley explains the P-N junction mathematically, enabling diodes to be designed precisely. Nobel Prize 1956." },
  { year: "1958", title: "Tunnel Diode", who: "Leo Esaki", body: "Esaki discovers quantum tunnelling in diodes, enabling ultrafast operation. Nobel Prize 1973. Used in microwave circuits." },
  { year: "1970s", title: "Power Diodes Scale Up", who: "Industry-wide", body: "Silicon rectifier diodes scale to handle hundreds of amperes and thousands of volts. Power electronics revolution begins." },
  { year: "Today", title: "Billions in Every Device", who: "Everywhere", body: "Every smartphone contains thousands of diodes. Silicon carbide (SiC) diodes revolutionise EV chargers with 98% efficiency." },
];

export default function DiodeHistory() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 8 · History</p>
        <h2 className="text-xl font-bold mb-1">The Diode Timeline</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          From Braun&apos;s crystal to the SiC diodes powering electric cars — 150 years of one-way current.
        </p>

        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.3) 10%, rgba(139,92,246,0.3) 90%, transparent)" }} />

          <div className="space-y-6">
            {events.map((e, i) => (
              <motion.div
                key={e.year}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-[52px] text-right">
                  <span className="text-[10px] font-mono font-bold" style={{ color: "#A78BFA" }}>{e.year}</span>
                </div>
                <div
                  className="w-3 h-3 rounded-full shrink-0 mt-0.5 border-2 border-background"
                  style={{ background: i === events.length - 1 ? "#10B981" : "#A78BFA" }}
                />
                <div className="flex-1 pb-1">
                  <p className="text-sm font-bold text-white/80 mb-0.5">{e.title}</p>
                  <p className="text-[10px] text-purple-400/50 mb-1 font-mono">{e.who}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{e.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
