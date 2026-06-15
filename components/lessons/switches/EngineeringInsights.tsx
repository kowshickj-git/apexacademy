"use client";

import { motion } from "framer-motion";

const CYAN = "#06B6D4";

const insights = [
  {
    icon: "⚡",
    title: "Debouncing in Software",
    desc: "Why does software read a button press multiple times? Because the mechanical contacts physically bounce 50–200 times in the first 5ms. Each bounce looks like a separate press to a microcontroller running at MHz. Engineers use a state machine (record time of first edge, ignore all events for 10ms) or a simple delay to \"debounce\" the input. More sophisticated systems use interrupts + timers to avoid blocking code.",
  },
  {
    icon: "🛑",
    title: "Emergency Stop (E-Stop) Design",
    desc: "Industrial machines use NC (Normally Closed) switches for emergency stops — not NO. Why? If the wire to an NO switch breaks, the machine never knows — it stays ON and is dangerous. With NC: wire break = contacts open = machine stops. This is called \"fail-safe\" design. The E-stop loop is wired in series: all NC contacts must remain closed for the machine to run. One open contact anywhere in the chain stops everything.",
  },
  {
    icon: "🏠",
    title: "Smart Home = Button + MCU + Relay",
    desc: "A modern smart light switch is just a momentary push button connected to a microcontroller (usually ESP32 or similar). The MCU reads the button, controls a relay (an electrically-operated switch) to switch mains power, sends status over Wi-Fi, and responds to voice commands. The light itself never knows it's \"smart\" — from its perspective, it's just a switch turning on and off.",
  },
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 10 · Engineering Insights
        </p>
        <h2 className="text-xl font-bold mb-5">How Engineers Think About Switches</h2>

        <div className="space-y-4">
          {insights.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 rounded-2xl border"
              style={{ borderColor: "rgba(6,182,212,0.25)", background: "rgba(6,182,212,0.05)" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{ins.icon}</span>
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color: CYAN }}>{ins.title}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{ins.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
