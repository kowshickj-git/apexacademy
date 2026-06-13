"use client";

import { motion } from "framer-motion";

const voltages = [
  {
    name: "AA Battery",
    voltage: "1.5V",
    desc: "Powers remotes, clocks, and small gadgets",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="24" height="24" rx="12" fill="none" stroke="#10B981" strokeWidth="1.8" />
        <rect x="13" y="2" width="10" height="6" rx="2" fill="#10B981" />
        <line x1="18" y1="13" x2="18" y2="23" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="13" y1="18" x2="23" y2="18" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    badge: "Very Low",
    badgeColor: "text-white/40",
  },
  {
    name: "USB Port",
    voltage: "5V",
    desc: "Charges phones, powers microcontrollers",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="26" height="16" rx="3" fill="none" stroke="#10B981" strokeWidth="1.8" />
        <rect x="9" y="14" width="7" height="5" rx="1" fill="#10B981" opacity="0.6" />
        <rect x="20" y="14" width="7" height="5" rx="1" fill="#10B981" opacity="0.6" />
        <rect x="9" y="21" width="18" height="2" rx="1" fill="#10B981" opacity="0.3" />
        <line x1="15" y1="26" x2="21" y2="26" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="26" x2="18" y2="30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    badge: "Low",
    badgeColor: "text-secondary",
  },
  {
    name: "9V Battery",
    voltage: "9V",
    desc: "Powers smoke alarms, guitar pedals",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="9" width="20" height="22" rx="3" fill="none" stroke="#10B981" strokeWidth="1.8" />
        <rect x="11" y="5" width="6" height="6" rx="1.5" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <rect x="19" y="5" width="6" height="6" rx="1.5" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <text x="18" y="24" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">9V</text>
      </svg>
    ),
    badge: "Medium",
    badgeColor: "text-primary",
  },
  {
    name: "Car Battery",
    voltage: "12V",
    desc: "Starts engines, powers car electronics",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="12" width="28" height="18" rx="3" fill="none" stroke="#10B981" strokeWidth="1.8" />
        <rect x="9" y="7" width="7" height="7" rx="1.5" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <rect x="20" y="7" width="7" height="7" rx="1.5" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <line x1="11" y1="19" x2="11" y2="25" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="22" x2="14" y2="22" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="25" y1="22" x2="31" y2="22" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    badge: "High",
    badgeColor: "text-yellow-400",
  },
];

export default function CommonVoltages() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <SectionHeader number="04" title="Common Voltages" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-2 gap-3">
          {voltages.map(({ name, voltage, desc, icon, badge, badgeColor }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="group bg-surface rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center mb-3 group-hover:border-primary/25 transition-colors">
                {icon}
              </div>

              {/* Voltage */}
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-2xl font-extrabold text-white tabular-nums">
                  {voltage}
                </span>
                <span className={`text-xs font-medium ${badgeColor}`}>{badge}</span>
              </div>

              {/* Name */}
              <p className="text-sm font-semibold text-white/80 mb-1">{name}</p>

              {/* Description */}
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Scale visual */}
        <div className="mt-4 bg-surface rounded-2xl border border-white/5 p-4">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">
            Voltage Scale
          </p>
          <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(to right, #0EA5E9, #10B981, #FCD34D)",
                width: "100%",
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {voltages.map(({ voltage }) => (
              <div key={voltage} className="flex flex-col items-center">
                <div className="w-px h-2 bg-white/20 mb-1" />
                <span className="text-[10px] text-white/40 font-mono">{voltage}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-primary/50 font-mono font-medium mb-1">#{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
