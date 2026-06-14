"use client";

import { motion } from "framer-motion";

const takeaways = [
  { text: "Voltage (V) is the electrical push — measured in Volts. It drives electrons through a circuit.", color: "#EAB308" },
  { text: "Current (I) is the flow of electrons — measured in Amperes. It tells you how many electrons move.", color: "#0EA5E9" },
  { text: "Resistance (R) is the opposition — measured in Ohms (Ω). It limits how many electrons can flow.", color: "#F97316" },
  { text: "Ohm's Law: V = I × R — the most fundamental equation in electronics. All three are always connected.", color: "#10B981" },
  { text: "To find current: I = V ÷ R. To find voltage: V = I × R. To find resistance: R = V ÷ I.", color: "#8B5CF6" },
  { text: "Increasing voltage increases current. Increasing resistance decreases current. Always.", color: "#EC4899" },
  { text: "Engineers use Ohm's Law every day — from sizing LED resistors to designing 400V electric vehicle motors.", color: "#10B981" },
];

export default function KeyTakeaways() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 18</p>
        <h2 className="text-xl font-bold mb-6">Key Takeaways</h2>

        <div className="space-y-2.5">
          {takeaways.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${t.color}18`, borderColor: `${t.color}45` }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke={t.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-white/55 leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Formula recap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-5 rounded-2xl border border-primary/20 text-center"
          style={{ background: "rgba(16,185,129,0.06)" }}
        >
          <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-2 font-mono">The law in one line</p>
          <p className="text-4xl font-black font-mono text-primary mb-2">V = I × R</p>
          <div className="flex justify-center gap-6 text-xs">
            <span className="text-yellow-400">V = I × R</span>
            <span className="text-secondary">I = V ÷ R</span>
            <span className="text-orange-400">R = V ÷ I</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
