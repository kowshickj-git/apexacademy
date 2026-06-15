"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#06B6D4";

const items = [
  {
    q: "What is the difference between NO and NC?",
    a: "Normally Open (NO) contacts are OPEN when the switch is at rest — current can only flow when the switch is pressed/activated. Normally Closed (NC) contacts are CLOSED when at rest — current flows normally until the switch is pressed (which opens the contact). NC is used in safety systems because a wire break or switch failure causes the circuit to open, stopping the machine safely.",
  },
  {
    q: "What is SPST vs SPDT?",
    a: "SPST (Single Pole Single Throw) has one input and one output — a simple on/off switch. SPDT (Single Pole Double Throw) has one input and TWO outputs — it routes current to one of two paths. Used in selector switches and 3-way light switches (two switches controlling one light from different locations).",
  },
  {
    q: "What is a latching vs momentary switch?",
    a: "A latching (toggle) switch stays in its last position — stays ON or stays OFF after you release it. A momentary switch (push button) springs back to its default state when released. Keyboards and doorbells use momentary buttons; wall light switches use latching toggles.",
  },
  {
    q: "What is switch bounce and why does it matter?",
    a: "When a mechanical switch closes, the metal contacts physically bounce 50–200 times in 1–10 milliseconds before settling. A microcontroller reads this as multiple rapid presses. Solution: add a 10ms software delay after the first detection (debounce delay), or use a debouncing capacitor circuit (100nF across the switch contacts with a pull-up/down resistor).",
  },
  {
    q: "How does a push button connect to Arduino?",
    a: "Connect one leg to a digital input pin (e.g., Pin 2), the other leg to GND. Add a 10kΩ pull-up resistor from Pin 2 to 5V — or use the built-in pull-up: pinMode(2, INPUT_PULLUP). With INPUT_PULLUP: button pressed = Pin reads LOW; button released = reads HIGH. The internal pull-up eliminates the need for an external resistor.",
  },
  {
    q: "Where are switches used in engineering?",
    a: "Emergency stops (NC, fail-safe), relay control (switch → relay coil → relay contacts), limit switches in robots (detect end-of-travel position), keyboard and keypad inputs (momentary matrix), industrial control panels, door sensors and alarm systems, start/stop motor control, and automotive switches (ignition, windows, mirrors).",
  },
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 11 · Key Takeaways
        </p>
        <h2 className="text-xl font-bold mb-5">Key Takeaways</h2>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden transition-colors duration-300"
              style={{
                borderColor: open === i ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.07)",
                background: open === i ? "rgba(6,182,212,0.05)" : "rgba(255,255,255,0.015)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <span className="text-sm font-medium text-white/75 pr-4">{item.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0 text-white/25"
                >
                  ▾
                </motion.span>
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
                    <div className="px-4 pb-4 border-t border-white/5 pt-3">
                      <p className="text-xs text-white/55 leading-relaxed">{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
