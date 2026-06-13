"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Battery creates voltage",
    desc: "The battery acts as an electron pump. Chemical reactions inside push electrons toward the negative terminal, creating a potential difference.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="6" width="22" height="16" rx="4" stroke="#10B981" strokeWidth="1.8" />
        <rect x="24" y="10" width="4" height="8" rx="2" fill="#10B981" />
        <line x1="11" y1="14" x2="15" y2="14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="12" x2="13" y2="16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="14" x2="9" y2="14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Electric field is created",
    desc: "The voltage difference creates an electric field throughout the wire. This invisible field acts like a push — pointing from positive to negative.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#10B981" strokeWidth="1.6" strokeDasharray="3 3" />
        <circle cx="14" cy="14" r="5" stroke="#10B981" strokeWidth="1.6" />
        <circle cx="14" cy="14" r="1.5" fill="#10B981" />
        <path d="M14 4V2M14 26v-2M4 14H2M26 14h-2" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Electrons start moving",
    desc: "Free electrons in the wire feel the push of the electric field and begin drifting from the negative terminal toward the positive terminal.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="7" cy="14" r="3" fill="#0EA5E9" opacity={0.8} />
        <circle cx="14" cy="14" r="3" fill="#0EA5E9" />
        <circle cx="21" cy="14" r="3" fill="#0EA5E9" opacity={0.6} />
        <path d="M10 14h4M17 14h4" stroke="rgba(14,165,233,0.4)" strokeWidth="1" />
        <path d="M22 11l3 3-3 3" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Current flows through circuit",
    desc: "As electrons move through the wire, electric current flows. We measure this flow in Amperes (A). More electrons per second = higher current.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 14h5l3-7 4 14 3-7h5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Device gets powered",
    desc: "The flowing electrons pass through your device (bulb, motor, phone). They transfer their energy, powering the device before returning to the battery.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2C8.48 2 4 6.48 4 12c0 3.36 1.67 6.34 4.22 8.21V22h11.56v-1.79C22.33 18.34 24 15.36 24 12c0-5.52-4.48-10-10-10Z" stroke="#10B981" strokeWidth="1.8" />
        <rect x="9" y="22" width="10" height="3" rx="1" fill="rgba(16,185,129,0.4)" />
        <path d="M12 10l-2 4h4l-2 4" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowCurrentWorks() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-secondary/50 font-mono font-medium mb-1">#07</p>
        <h2 className="text-2xl font-bold text-white">How Current Works — Step by Step</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.38 }}
            className="flex gap-4"
          >
            {/* Step number + connector */}
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20"
                style={{ background: "rgba(16,185,129,0.08)" }}
              >
                {step.icon}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 mt-2" style={{ background: "rgba(16,185,129,0.12)", minHeight: 16 }} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold text-primary/50">Step {step.num}</span>
              </div>
              <p className="text-sm font-bold text-white mb-1">{step.title}</p>
              <p className="text-xs text-white/50 leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}

        {/* Summary formula */}
        <div
          className="rounded-2xl border border-primary/20 p-4 text-center mt-2"
          style={{ background: "rgba(16,185,129,0.06)" }}
        >
          <p className="text-xs text-white/35 mb-1.5 uppercase tracking-wider font-semibold">The Key Formula</p>
          <p className="text-2xl font-extrabold text-white">
            I = <span className="text-primary">Q</span> / <span className="text-secondary">t</span>
          </p>
          <p className="text-xs text-white/40 mt-1.5">
            Current (I) = Charge (Q) ÷ Time (t)
          </p>
        </div>
      </motion.div>
    </section>
  );
}
