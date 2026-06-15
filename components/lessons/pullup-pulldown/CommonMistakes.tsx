"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    title: "Using INPUT without pull-up/pull-down",
    what: "Pin floats — gives random HIGH/LOW reads. The button appears to behave randomly. Extremely common beginner mistake on Arduino.",
    fix: "Always use `INPUT_PULLUP` or add an external 10kΩ pull resistor. Never leave a digital input undefined.",
  },
  {
    title: "Using too low a pull-up resistor (e.g. 100Ω)",
    what: "When button is pressed, 33–50mA flows through the resistor to GND. This can exceed the MCU GPIO sink current limit (~20–40mA), damage the pin, and drains battery fast.",
    fix: "Use 10kΩ (0.33mA at 3.3V). Minimum practical value is ~1kΩ for most applications.",
  },
  {
    title: "Forgetting INPUT_PULLUP inverts logic",
    what: "`INPUT_PULLUP` makes the pin HIGH by default. Pressing connects it to GND → reads LOW. Many beginners test `if (digitalRead(pin) == HIGH)` and think the button never works.",
    fix: "With pull-up: `if (digitalRead(pin) == LOW)` means button is pressed. Document this clearly in your code.",
  },
  {
    title: "Using pull-up when pull-down is needed (or vice versa)",
    what: "Active-high sensors output HIGH when triggered. If you add a pull-up, the pin is already HIGH — you can't detect the HIGH trigger. Same for MOSFET gates that need a pull-down to default OFF.",
    fix: "Match resistor polarity to signal polarity. Active-high sensor → pull-DOWN. Active-low button → pull-UP.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 7 · Common Mistakes
        </p>
        <h2 className="text-xl font-bold mb-5">4 Classic Pull Resistor Mistakes</h2>

        <div className="space-y-3">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="p-4 rounded-2xl border"
              style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.04)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full border border-red-500/40 flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white/85 mb-2">{m.title}</p>
                  <p className="text-xs text-white/45 leading-relaxed mb-2">{m.what}</p>
                  <div
                    className="flex gap-2 p-2.5 rounded-lg"
                    style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    <span className="text-xs shrink-0" style={{ color: "#F59E0B" }}>✓ Fix:</span>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(245,158,11,0.8)" }}>{m.fix}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
