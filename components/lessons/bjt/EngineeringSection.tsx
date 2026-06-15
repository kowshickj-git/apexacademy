"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const CARDS = [
  {
    title: "Three Operating Regions",
    icon: "⚡",
    color: "#EF4444",
    content: [
      { label: "CUTOFF (OFF)", desc: "I_B = 0, I_C ≈ 0, V_CE = V_CC. Transistor acts as open switch. Use for digital OFF.", highlight: "#EF4444" },
      { label: "ACTIVE (Amplify)", desc: "I_C = β × I_B. Linear region — output proportional to input. Use for analog amplification.", highlight: "#10B981" },
      { label: "SATURATION (ON)", desc: "I_C at maximum, V_CE ≈ 0.2V. Transistor acts as closed switch. Use for digital ON.", highlight: "#0EA5E9" },
    ],
    extra: "Rule of thumb: for switching, use at least 2× overdrive of I_B to guarantee saturation.",
  },
  {
    title: "Gain (Beta / hFE)",
    icon: "×",
    color: "#F87171",
    content: [
      { label: "Definition", desc: "β = hFE = I_C / I_B. This is the DC current gain of the transistor.", highlight: "#F87171" },
      { label: "Typical Range", desc: "β typically 50–500, but varies widely between units and temperature. 2N2222: β ≈ 100–300.", highlight: "#F97316" },
      { label: "Design Rule", desc: "NEVER design for exact β. Design for worst-case β_min with overdrive factor (typically 2–5×).", highlight: "#EF4444" },
    ],
    extra: "β increases with temperature. β also varies with collector current — check the datasheet graphs.",
  },
  {
    title: "NPN vs PNP Choice",
    icon: "⇄",
    color: "#FCA5A5",
    content: [
      { label: "NPN (most common)", desc: "Current INTO base enables C→E flow. V_B > V_E by 0.7V. N-channel equivalent. Examples: 2N2222, BC547, 2N3904.", highlight: "#EF4444" },
      { label: "PNP (high-side)", desc: "Current OUT of base enables E→C flow. V_B < V_E by 0.7V. Used when you need to switch the positive supply rail.", highlight: "#0EA5E9" },
      { label: "Speed factor", desc: "NPN preferred because electrons have higher mobility than holes → faster switching, lower saturation voltage.", highlight: "#10B981" },
    ],
    extra: "H-bridges for motor direction control use two NPN + two PNP (or 4 NPN) transistors.",
  },
  {
    title: "Real Applications",
    icon: "🔧",
    color: "#10B981",
    content: [
      { label: "Audio Amplifiers", desc: "Class A/AB amplifiers for audio — BJTs preferred for low noise (superior 1/f noise vs MOSFETs in audio range).", highlight: "#10B981" },
      { label: "Relay & LED Drivers", desc: "Microcontroller can't drive relays (100-500mA coil). NPN BJT provides current gain to bridge the gap.", highlight: "#0EA5E9" },
      { label: "Motor H-Bridge", desc: "Four transistors forming an H let you reverse DC motor direction. PWM on base pins controls speed.", highlight: "#EF4444" },
      { label: "GPIO Expansion", desc: "Arduino 5mA GPIO → BJT buffer → 500mA+ load. Essential pattern for solenoids, high-power LEDs.", highlight: "#F87171" },
    ],
    extra: "Bandgap references in voltage regulators exploit the predictable V_BE ≈ 0.7V temperature behavior.",
  },
];

export default function EngineeringSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div
            className="inline-block px-2 py-1 rounded-lg text-xs font-mono font-bold mb-2"
            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            ENGINEERING
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>
            Engineering Deep Dive
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
            Click each card to expand engineering details and design rules.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {CARDS.map((card, i) => {
            const isOpen = expanded === i;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: isOpen ? `${card.color}08` : "rgba(255,255,255,0.03)",
                  border: isOpen ? `1px solid ${card.color}35` : "1px solid rgba(255,255,255,0.07)",
                  transition: "background 0.25s, border-color 0.25s",
                }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 p-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                    style={{ background: `${card.color}15`, color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold" style={{ color: isOpen ? "#F0F0F5" : "rgba(240,240,245,0.8)" }}>
                      {card.title}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs flex-shrink-0"
                    style={{ color: isOpen ? card.color : "rgba(240,240,245,0.3)" }}
                  >
                    ▾
                  </motion.div>
                </div>

                {/* Expandable content */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-4 pb-4 flex flex-col gap-2.5">
                    {card.content.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl p-3"
                        style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${item.highlight}18` }}
                      >
                        <div className="text-xs font-bold mb-1" style={{ color: item.highlight }}>{item.label}</div>
                        <div className="text-xs leading-relaxed" style={{ color: "rgba(240,240,245,0.6)" }}>{item.desc}</div>
                      </div>
                    ))}
                    <div
                      className="rounded-xl p-3 mt-1"
                      style={{ background: `${card.color}08`, border: `1px solid ${card.color}20` }}
                    >
                      <div className="text-xs" style={{ color: "rgba(240,240,245,0.5)" }}>
                        <span style={{ color: card.color }}>Tip: </span>{card.extra}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
