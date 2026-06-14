"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onBuilderUsed: () => void;
}

const voltages = [3, 5, 9, 12];
const resistors = [100, 220, 470];
const V_LED = 2.0; // Forward voltage of LED

export default function CircuitBuilder({ onBuilderUsed }: Props) {
  const [voltage, setVoltage] = useState(9);
  const [branches, setBranches] = useState([true, true, false]);
  const [resistances, setResistances] = useState([220, 220, 220]);
  const [used, setUsed] = useState(false);

  const handleInteract = () => {
    if (!used) {
      setUsed(true);
      onBuilderUsed();
    }
  };

  const activeBranches = branches.map((on, i) => {
    if (!on) return null;
    const vDrop = voltage > V_LED ? voltage - V_LED : 0;
    const current = voltage > V_LED ? vDrop / resistances[i] : 0;
    return { current, resistance: resistances[i] };
  });

  const totalCurrent = activeBranches.reduce(
    (sum, b) => sum + (b ? b.current : 0),
    0
  );

  return (
    <section className="px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/8 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {/* Header */}
        <div
          className="p-5 border-b border-white/5"
          style={{ background: "rgba(99,102,241,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="text-xs font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: "#6366F1",
                borderColor: "rgba(99,102,241,0.3)",
                background: "rgba(99,102,241,0.1)",
              }}
            >
              SIMULATOR 1
            </div>
            <span className="text-xs text-white/30">Interactive</span>
          </div>
          <h2 className="text-lg font-bold text-white">Parallel Circuit Builder</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(240,240,245,0.5)" }}>
            Toggle LED branches, change voltage and resistors — watch each branch operate independently.
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Voltage selector */}
            <div>
              <label className="text-xs font-bold text-white/60 mb-2 block">Battery Voltage</label>
              <div className="flex gap-2 flex-wrap">
                {voltages.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setVoltage(v); handleInteract(); }}
                    className="px-3 py-1.5 rounded-xl text-sm font-bold border transition-all"
                    style={{
                      background: voltage === v ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                      borderColor: voltage === v ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)",
                      color: voltage === v ? "#818CF8" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {v}V
                  </button>
                ))}
              </div>
            </div>

            {/* Branch controls */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-white/60">LED Branches</label>
              {branches.map((on, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 border transition-all"
                  style={{
                    background: on ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.02)",
                    borderColor: on ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: on ? "#818CF8" : "rgba(255,255,255,0.3)" }}>
                      Branch {i + 1}
                    </span>
                    <button
                      onClick={() => {
                        setBranches((b) => b.map((v, j) => (j === i ? !v : v)));
                        handleInteract();
                      }}
                      className="text-xs px-2 py-1 rounded-lg border font-bold transition-all"
                      style={{
                        background: on ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                        borderColor: on ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)",
                        color: on ? "#818CF8" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {on ? "ON" : "OFF"}
                    </button>
                  </div>

                  {on && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/30">Resistor:</span>
                      <div className="flex gap-1">
                        {resistors.map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setResistances((rs) => rs.map((v, j) => (j === i ? r : v)));
                              handleInteract();
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded-lg border transition-all"
                            style={{
                              background:
                                resistances[i] === r ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                              borderColor:
                                resistances[i] === r ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
                              color:
                                resistances[i] === r ? "#A5B4FC" : "rgba(255,255,255,0.3)",
                            }}
                          >
                            {r}Ω
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visual circuit + results */}
          <div className="flex flex-col gap-4">
            {/* Circuit visual */}
            <div
              className="rounded-2xl p-4 border border-white/6 flex flex-col items-center"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Circuit</p>

              <div className="flex items-stretch gap-3 w-full">
                {/* Battery */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div
                    className="w-8 rounded-xl flex flex-col items-center justify-center py-3 border text-xs font-bold gap-0.5"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      borderColor: "rgba(99,102,241,0.35)",
                      color: "#818CF8",
                    }}
                  >
                    <span>+</span>
                    <div className="w-4 h-3 border-t-2 border-b border-current" />
                    <div className="w-3 h-0.5 bg-current" />
                    <div className="w-4 h-0.5 bg-current" />
                    <span>−</span>
                    <span className="text-[9px] mt-1">{voltage}V</span>
                  </div>
                </div>

                {/* Branches */}
                <div className="flex-1 flex flex-col gap-2">
                  {branches.map((on, i) => {
                    const branchData = activeBranches[i];
                    const currentMA = branchData ? (branchData.current * 1000).toFixed(1) : 0;
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        {/* Wire in */}
                        <div
                          className="h-[2px] w-3 rounded"
                          style={{ background: on ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.08)" }}
                        />
                        {/* Resistor */}
                        <div
                          className="h-6 w-10 rounded border text-[8px] font-mono flex items-center justify-center shrink-0"
                          style={{
                            background: on ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.03)",
                            borderColor: on ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.06)",
                            color: on ? "#FBB724" : "rgba(255,255,255,0.2)",
                          }}
                        >
                          {resistances[i]}Ω
                        </div>
                        {/* Wire mid */}
                        <div
                          className="h-[2px] w-2 rounded"
                          style={{ background: on ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)" }}
                        />
                        {/* LED */}
                        <motion.div
                          animate={on && voltage > V_LED ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.25 }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="w-6 h-6 rounded-full border-2 text-[10px] flex items-center justify-center shrink-0"
                          style={{
                            background:
                              on && voltage > V_LED
                                ? "rgba(99,102,241,0.3)"
                                : "rgba(255,255,255,0.04)",
                            borderColor:
                              on && voltage > V_LED ? "#6366F1" : "rgba(255,255,255,0.1)",
                          }}
                        >
                          {on && voltage > V_LED ? "💡" : "○"}
                        </motion.div>
                        {/* Wire out */}
                        <div
                          className="h-[2px] flex-1 rounded"
                          style={{ background: on ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)" }}
                        />
                        {/* Current display */}
                        <span
                          className="text-[10px] font-mono shrink-0"
                          style={{ color: on ? "#818CF8" : "rgba(255,255,255,0.2)" }}
                        >
                          {on ? `${currentMA}mA` : "off"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3 border border-white/6 text-center"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="text-lg font-black" style={{ color: "#6366F1" }}>
                  {voltage}V
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">Each branch voltage</div>
              </div>
              <div
                className="rounded-xl p-3 border border-white/6 text-center"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="text-lg font-black" style={{ color: "#10B981" }}>
                  {(totalCurrent * 1000).toFixed(1)}mA
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">Total current</div>
              </div>
            </div>

            <div
              className="rounded-xl p-3 border text-xs"
              style={{
                background: "rgba(99,102,241,0.07)",
                borderColor: "rgba(99,102,241,0.2)",
                color: "#A5B4FC",
              }}
            >
              💡 Each LED sees the full {voltage}V supply minus its 2V forward drop = {Math.max(0, voltage - 2)}V across its resistor.
              Branches are independent — toggle one without affecting others!
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
