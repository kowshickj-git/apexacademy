"use client";

import { motion } from "framer-motion";

const mistakes = [
  {
    mistake: "Using 0.7V as the LED forward voltage",
    why: "Silicon rectifier diodes drop 0.7V. LEDs are NOT silicon rectifiers — they use different materials and drop 1.8–3.6V. Using 0.7V in your resistor calculation will result in too little resistance and likely burn the LED.",
    fix: "Always check: Red ≈ 2.0V, Yellow ≈ 2.1V, Green ≈ 2.2V, Blue/White ≈ 3.2–3.4V. Use the correct Vf in R = (Vs − Vf) / If.",
  },
  {
    mistake: "Connecting an LED without a resistor",
    why: "Without a current-limiting resistor, the LED's non-linear IV curve allows exponentially increasing current. Even 0.2V above the forward voltage can push 100s of mA — destroying the LED in milliseconds.",
    fix: "Always add a series resistor. For a 5V supply and red LED: R = (5 − 2) / 0.02 = 150Ω. Round up to 220Ω for safety.",
  },
  {
    mistake: "Connecting the LED backwards (polarity reversed)",
    why: "A reversed LED is in reverse bias — it won't light up. Most beginners spend minutes debugging, thinking the LED is broken, when they just have it backwards.",
    fix: "Look for the longer leg (anode, +) or the flat edge on the LED body (cathode side, −). In circuit diagrams, the triangle points in the direction of current flow.",
  },
  {
    mistake: "Mixing up mA and A in current calculations",
    why: "If you calculate R = (5 − 2) / 20 = 0.15Ω instead of R = (5 − 2) / 0.02 = 150Ω, you'll specify a tiny resistor that lets 20A flow — not 20mA. The LED will instantly die.",
    fix: "Always convert mA to A: 20mA = 0.02A. Write units in your calculations. Check: 'does this answer make sense?' A 0.15Ω resistor is suspicious.",
  },
  {
    mistake: "Thinking any colour LED has the same Vf",
    why: "Blue LEDs need ~3.2V forward voltage, not 2.0V like red LEDs. Using a 5V supply with a 150Ω resistor for a blue LED gives only (5−3.2)/150 = 12mA instead of 20mA — dimmer than expected.",
    fix: "Calculate resistor for each LED color separately. Blue/white LEDs always need different resistors from red/yellow ones for the same supply voltage.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 15 · Mistakes</p>
        <h2 className="text-xl font-bold mb-1">5 Common LED Mistakes</h2>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          These mistakes have burned LEDs for every beginner at least once. Learn them now.
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
                  <p className="text-[10px] text-red-400/60 font-mono uppercase mb-1">Why it happens</p>
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
