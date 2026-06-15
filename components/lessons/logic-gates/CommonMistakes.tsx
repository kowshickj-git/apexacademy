"use client";
import { motion } from "framer-motion";

const mistakes = [
  {num:"01",title:"XOR vs OR Confusion",problem:"Using OR when XOR is needed (or vice versa) when 'exactly one' input is required.",consequence:"OR output is 1 when BOTH inputs are 1. XOR output is 0 when BOTH are 1. Using OR in a parity circuit outputs wrong parity when multiple bits are set.",fix:"Remember: OR = any input → output. XOR = ODD number of HIGH inputs → output. For equality checking use XNOR, not OR."},
  {num:"02",title:"NAND ≠ NOT AND",problem:"Treating NAND as 'AND then separately invert', missing that it's a single atomic operation.",consequence:"In transistor-level design: incorrectly thinking NOT(AND) requires 2 separate gates. NAND is one gate — actually simpler than AND (AND = NAND + NOT).",fix:"NAND is the fundamental gate. AND = NAND + NOT inverter. NAND is 'universal' — any Boolean function can be built from NAND gates alone."},
  {num:"03",title:"Floating Inputs",problem:"Leaving an input pin of a logic gate unconnected.",consequence:"Floating inputs pick up noise, oscillate, or sit at intermediate voltage. Gate output becomes undefined — can damage CMOS inputs (latch-up) or cause logic glitches.",fix:"Always tie unused inputs to VCC or GND as appropriate. NAND/NOR: unused inputs tied to 1/0 respectively to keep them inactive."},
  {num:"04",title:"5V Logic to 3.3V Logic",problem:"Connecting 5V logic gate output directly to 3.3V logic input.",consequence:"3.3V CMOS inputs max out at VCC+0.3V = 3.6V. 5V output = 5V on input → ESD clamping → device current limiting → device damage or premature failure.",fix:"Use a level shifter (74LVC or dedicated chips) or a resistor voltage divider to safely interface 5V and 3.3V logic."},
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9 · Pitfalls</p>
        <h2 className="text-xl font-bold mb-1">Common Mistakes</h2>
        <p className="text-white/45 text-sm mb-5">Errors engineers make with logic gates — and how to avoid them.</p>
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
