"use client";

import { motion } from "framer-motion";

const objectives = [
  "Understand Voltage",
  "Understand Electrical Pressure",
  "Understand Battery Voltage",
  "Visualize Electron Movement",
];

export default function LessonHeader() {
  return (
    <section className="px-4 pt-8 pb-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Beginner
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
            5 min read
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
            Electronics
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1.5 leading-tight tracking-tight">
          What is Voltage?
        </h1>
        <p className="text-white/40 text-sm mb-6">
          Electronics Fundamentals &nbsp;·&nbsp; Lesson 1
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-primary/30 via-white/5 to-transparent mb-5" />

        {/* Learning Objectives */}
        <div className="bg-surface rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">
            Learning Objectives
          </p>
          <div className="space-y-2.5">
            {objectives.map((obj, i) => (
              <motion.div
                key={obj}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3.5L3 6L8 1"
                      stroke="#10B981"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm text-white/75">{obj}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
