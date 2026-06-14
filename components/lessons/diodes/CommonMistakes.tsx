"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    mistake: "Connecting the diode backwards",
    why: "Reverse bias = no current flow. Circuit appears dead, or worse — if it's in a protection circuit and you insert a battery backwards, nothing is protected.",
    fix: "Look for the silver/white band on real diodes = cathode (−). In symbols, current flows in the direction the triangle points.",
  },
  {
    mistake: "Forgetting the 0.7V forward voltage drop",
    why: "A silicon diode drops 0.7V across it when conducting. In a 3.3V circuit, that leaves only 2.6V — calculations that ignore this will be wrong.",
    fix: "Always subtract 0.7V (silicon) or 0.3V (Schottky) from your supply voltage when calculating current through downstream components.",
  },
  {
    mistake: "Using a rectifier diode where a Schottky is needed",
    why: "Standard diodes are slow — they take time to 'turn off' when voltage reverses (reverse recovery time). In fast switching circuits, this causes current to leak backwards.",
    fix: "Use Schottky diodes (e.g. 1N5819) in switching power supplies and DC-DC converters where frequency is above ~10kHz.",
  },
  {
    mistake: "Confusing LED forward voltage with silicon diode",
    why: "LEDs have 1.8–3.6V forward voltage, not 0.7V. Using 0.7V in an LED resistor calculation will give you the wrong resistance and burn out the LED.",
    fix: "Check your LED's datasheet for Vf. Use the correct value in R = (Vsupply − Vf) / If.",
  },
  {
    mistake: "Exceeding peak inverse voltage (PIV)",
    why: "If you apply more reverse voltage than the diode's PIV rating, it breaks down and conducts in reverse — destroying itself permanently.",
    fix: "Pick a diode with PIV at least 2x your circuit's max reverse voltage. The 1N4007 handles 1000V PIV — use it for mains circuits.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Mistakes</p>
        <h2 className="text-xl font-bold mb-1">Common Diode Mistakes</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          These mistakes catch even experienced builders. Knowing them in advance saves frustration and blown components.
        </p>

        <div className="space-y-3">
          {mistakes.map(({ mistake, why, fix }, i) => (
            <motion.div
              key={mistake}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/7 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
                <span className="text-base">⚠️</span>
                <p className="text-sm font-bold text-white/75">{mistake}</p>
              </div>
              <div className="p-4 grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-red-400/60 font-mono uppercase mb-1">Why it matters</p>
                  <p className="text-xs text-white/45 leading-relaxed">{why}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/60 font-mono uppercase mb-1">The fix</p>
                  <p className="text-xs text-white/45 leading-relaxed">{fix}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
