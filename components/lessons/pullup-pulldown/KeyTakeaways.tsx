"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    q: "What is a floating input?",
    a: "A microcontroller input pin with no defined voltage when the button is open. The pin 'floats' and picks up electrical noise, giving random HIGH/LOW readings. Solution: always use a pull-up or pull-down resistor to give the pin a defined default state.",
  },
  {
    q: "How does a pull-up resistor work?",
    a: "Connects Vcc → R → Pin, with button from pin to GND. When button OPEN: no current path to GND through the button, pin stays at Vcc (HIGH). When pressed: GND short overrides R, pin goes LOW. Logic is INVERTED — pressed = LOW.",
  },
  {
    q: "How does a pull-down resistor work?",
    a: "Connects Pin → R → GND, with button from pin to Vcc. When button OPEN: no path to Vcc through the button, pin held at GND (LOW). When pressed: Vcc overrides R, pin goes HIGH. Logic is NORMAL — pressed = HIGH.",
  },
  {
    q: "What resistor value should I use?",
    a: "10kΩ is the standard. Practical range: 1kΩ (strong pull, more current) to 100kΩ (weak pull, less noise immunity). Too low wastes power; too high = slow edge transitions and more noise susceptibility. Arduino internal pull-ups are ~20–50kΩ.",
  },
  {
    q: "What is INPUT_PULLUP in Arduino?",
    a: "`pinMode(pin, INPUT_PULLUP)` enables the microcontroller's internal pull-up resistor (~20–50kΩ). No external resistor needed — saves BOM cost and PCB space. Button pressed = reads LOW (inverted logic). Available on Arduino Uno, Mega, ESP32, STM32, and most modern MCUs.",
  },
  {
    q: "When to use pull-down vs pull-up?",
    a: "Pull-up: most common for buttons, matches NC safety logic, buttons wired to GND. Pull-down: when an active-high signal is needed, buttons/sensors connected to Vcc, or when the sensor has open-drain output. MOSFET gate inputs often need pull-down to ensure gate is OFF (LOW) by default.",
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 8 · Key Takeaways
        </p>
        <h2 className="text-xl font-bold mb-5">6 Things to Remember</h2>

        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold text-white/80">{item.q}</span>
                </div>
                <motion.svg
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="shrink-0 ml-2"
                >
                  <path d="M2 4l4 4 4-4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 pb-4 pt-1 border-t border-white/5"
                      style={{ background: "rgba(245,158,11,0.04)" }}
                    >
                      <p className="text-sm text-white/60 leading-relaxed">{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
