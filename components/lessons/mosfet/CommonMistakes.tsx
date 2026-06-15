"use client";
import { motion } from "framer-motion";

const mistakes = [
  {num:"01",title:"Floating Gate",problem:"Leaving gate unconnected when MOSFET should be off.",consequence:"Static charge accumulates on gate capacitor → MOSFET partially or fully turns on randomly → load powered unexpectedly.",fix:"Always pull gate to GND (N-ch) or V+ (P-ch) via 10kΩ–100kΩ resistor when no driver is connected."},
  {num:"02",title:"Standard MOSFET with 3.3V Logic",problem:"Using a standard MOSFET (V_th=4V) with a 3.3V microcontroller pin.",consequence:"V_GS barely reaches 3.3V, never exceeds V_th → MOSFET never turns on. Load doesn't switch.",fix:"Use logic-level MOSFETs (e.g. 2N7000, IRLZ44N) with V_th <2V — guaranteed on at 3.3V or 5V."},
  {num:"03",title:"No Snubber / Flyback Diode",problem:"Switching inductive loads (motors, solenoids) without protection.",consequence:"Inductive kickback generates high-voltage spikes → V_DS can exceed MOSFET's breakdown → device fails immediately.",fix:"Add a freewheeling diode across the load (anode to GND, cathode to +V) to absorb kickback energy."},
  {num:"04",title:"Exceeding V_GS Max",problem:"Applying more than the rated V_GS to the gate (typically 20V max).",consequence:"Gate oxide is only nanometers thick. Overvoltage punctures the oxide permanently → MOSFET short-circuits or becomes leaky → irreversible failure.",fix:"Keep V_GS within datasheet limits. Use zener diodes to clamp gate voltage in high-voltage applications."},
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9 · Pitfalls</p>
        <h2 className="text-xl font-bold mb-1">Common Mistakes</h2>
        <p className="text-white/45 text-sm mb-5">Errors that damage or confuse MOSFETs in real circuits.</p>
        <div className="space-y-3">
          {mistakes.map((m,i)=>(
            <motion.div key={m.num} initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.35,delay:i*0.07}}
              className="rounded-xl border p-4" style={{borderColor:"rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.04)"}}>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono" style={{background:"rgba(239,68,68,0.15)",color:"#EF4444"}}>{m.num}</div>
                <div>
                  <h3 className="text-sm font-bold text-white/80 mb-2">{m.title}</h3>
                  <div className="space-y-2">
                    <div><span className="text-[9px] font-mono uppercase text-white/25 tracking-wider">Problem</span><p className="text-xs text-white/45 leading-relaxed mt-0.5">{m.problem}</p></div>
                    <div><span className="text-[9px] font-mono uppercase text-red-400/40 tracking-wider">Consequence</span><p className="text-xs text-red-400/60 leading-relaxed mt-0.5">{m.consequence}</p></div>
                    <div className="rounded-lg p-2.5" style={{background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.15)"}}>
                      <span className="text-[9px] font-mono uppercase text-green-400/50 tracking-wider">Fix</span>
                      <p className="text-xs leading-relaxed mt-0.5" style={{color:"rgba(16,185,129,0.7)"}}>{m.fix}</p>
                    </div>
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
