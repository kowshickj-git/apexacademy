"use client";

import { motion } from "framer-motion";

const events = [
  { year: "1907", title: "Electroluminescence Discovered", who: "H.J. Round (Marconi Labs)", body: "Round observes that silicon carbide crystals emit yellow light when voltage is applied — the first observation of electroluminescence. He publishes a brief 24-line note but doesn't pursue it." },
  { year: "1927", title: "First LED Patent", who: "Oleg Losev (Soviet Union)", body: "Losev patents the 'light relay' — a zinc oxide LED. He fully understands the quantum emission mechanism. His work is ignored for decades due to the Iron Curtain." },
  { year: "1962", title: "First Practical Visible-Light LED", who: "Nick Holonyak Jr. (GE)", body: "Holonyak creates the first red LED using gallium arsenide phosphide (GaAsP). Known as the 'father of the LED.' He is still alive and receiving awards for this breakthrough." },
  { year: "1972", title: "High-Brightness Yellow and Green", who: "M. George Craford", body: "Craford invents the first yellow LED and improves the brightness of green and red LEDs tenfold. Craford was a student of Holonyak." },
  { year: "1976", title: "Infrared LED in Remote Controls", who: "Industry-wide", body: "IR LEDs replace ultrasonic remote control systems. By 1980, almost all TV remote controls use IR LED communication at 38kHz." },
  { year: "1994", title: "Blue LED — The Missing Colour", who: "Nakamura, Akasaki & Amano (Japan)", body: "Blue InGaN LED is invented after decades of failed attempts. This enables white LEDs by combining blue with yellow phosphor. Nobel Prize in Physics awarded in 2014." },
  { year: "1996", title: "White LED Invented", who: "Nichia Corporation", body: "Nichia combines a blue InGaN LED chip with a cerium-doped yttrium aluminium garnet (YAG) phosphor to produce the first practical white LED." },
  { year: "2000s", title: "LED Lighting Revolution", who: "Industry-wide", body: "LED efficiency surpasses fluorescent bulbs. LED street lights, car headlamps, and TV backlights become standard. Global electricity savings: billions of kWh per year." },
  { year: "2014", title: "Nobel Prize for Blue LED", who: "Nakamura, Akasaki & Amano", body: "The Nobel Committee states: 'LED lamps will light the 21st century in the same way that incandescent lamps lit the 20th century.' The blue LED enabled modern lighting." },
  { year: "Today", title: "MicroLEDs & OLEDs", who: "Apple, Samsung, Sony...", body: "MicroLED arrays (each pixel = a tiny LED) are replacing OLED in phones. Efficiency: up to 200 lm/W. Flexible OLED screens are now in every premium smartphone." },
];

export default function LEDHistory() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 13 · History</p>
        <h2 className="text-xl font-bold mb-1">The LED Timeline</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          From a forgotten 24-line note in 1907 to Nobel Prizes and the lighting revolution — the LED story spans over a century.
        </p>

        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(239,68,68,0.3) 10%, rgba(239,68,68,0.3) 90%, transparent)" }} />

          <div className="space-y-6">
            {events.map((e, i) => (
              <motion.div
                key={e.year}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-[52px] text-right">
                  <span className="text-[10px] font-mono font-bold text-red-400/70">{e.year}</span>
                </div>
                <div
                  className="w-3 h-3 rounded-full shrink-0 mt-0.5 border-2 border-background"
                  style={{ background: i === events.length - 1 ? "#10B981" : i === 6 ? "#EAB308" : "#EF4444" }}
                />
                <div className="flex-1 pb-1">
                  <p className="text-sm font-bold text-white/80 mb-0.5">{e.title}</p>
                  <p className="text-[10px] text-red-400/45 mb-1 font-mono">{e.who}</p>
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
