"use client";
import { motion } from "framer-motion";

const insights = [
  {title:"FPGA Basics",body:"FPGAs are chips with millions of configurable logic blocks — each can be any gate. Program them in HDL (VHDL/Verilog) to build custom digital hardware. Used in video processing, crypto, radio, radar.",icon:"🔮"},
  {title:"CPU as Logic Gates",body:"Your CPU is billions of NAND/NOR gates wired to perform arithmetic, comparison, and memory operations. A 1-bit adder = XOR + AND. A 64-bit ALU = thousands of those adders chained.",icon:"💻"},
  {title:"Hardware Security",body:"Logic gates enable hardware security: TPM chips use XOR-based crypto, hash functions are implemented in gates, and physical unclonable functions (PUFs) exploit gate manufacturing variations.",icon:"🔐"},
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 8 · Engineering</p>
        <h2 className="text-xl font-bold mb-1">Engineering Insights</h2>
        <p className="text-white/45 text-sm mb-5">Where logic gates appear in the real world.</p>
        <div className="space-y-3">
          {insights.map((c,i)=>(
            <motion.div key={c.title} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35,delay:i*0.1}}
              className="rounded-xl border p-4 flex items-start gap-3" style={{borderColor:"rgba(132,204,22,0.2)",background:"rgba(132,204,22,0.04)"}}>
              <span className="text-2xl flex-shrink-0">{c.icon}</span>
              <div><h3 className="text-sm font-bold mb-1" style={{color:"#84CC16"}}>{c.title}</h3><p className="text-xs text-white/45 leading-relaxed">{c.body}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
