"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const qaPairs = [
  {q:"What are the 7 standard logic gates?",a:"AND (·), OR (+), NOT (¬/overbar), NAND (not-AND), NOR (not-OR), XOR (⊕), XNOR (not-XOR). Every digital circuit — from a flip-flop to a CPU — is made from combinations of these. NAND and NOR are each 'universal' — you can build any Boolean function from NAND-only or NOR-only."},
  {q:"What is a truth table?",a:"A truth table lists all possible input combinations and the corresponding output for a logic gate or circuit. A 2-input gate has 4 rows (2² = 4 combinations: 00, 01, 10, 11). A 3-input gate has 8 rows (2³). Truth tables are the fundamental way to define and verify Boolean logic."},
  {q:"Why is NAND called a 'universal gate'?",a:"Any Boolean function can be implemented using only NAND gates. NOT A = NAND(A,A). AND = NAND(NAND(A,B), NAND(A,B)) [NOT the NAND]. OR = NAND(NAND(A,A), NAND(B,B)). This universality means chip designers can use one cell library (just NAND gates) to implement any logic, simplifying manufacturing."},
  {q:"How does XOR differ from OR?",a:"OR: output=1 when ANY input is 1 (including when ALL are 1). XOR: output=1 only when inputs are DIFFERENT. For 2 inputs: XOR=0 when 00 or 11 (same), XOR=1 when 01 or 10 (different). XOR is used in adders (1-bit sum = A XOR B), parity generators, and encryption."},
  {q:"How are logic gates made from transistors?",a:"CMOS (Complementary MOS): each gate uses PMOS and NMOS transistors in a pull-up/pull-down network. NAND: 2 NMOS in series (both must be ON to pull output low) + 2 PMOS in parallel (either OFF to isolate). Only 4 transistors. NOR: 2 NMOS in parallel + 2 PMOS in series. NOT: 1 PMOS + 1 NMOS."},
  {q:"What are De Morgan's Laws?",a:"De Morgan's Laws: (1) NOT(A AND B) = NOT A OR NOT B. (2) NOT(A OR B) = NOT A AND NOT B. Practical use: NAND(A,B) = OR(NOT A, NOT B). A NAND gate with inverted inputs equals an OR gate. NOR(A,B) = AND(NOT A, NOT B). These identities are crucial for converting between gate types and optimizing logic circuits."},
];

export default function KeyTakeaways() {
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10 · Revision</p>
        <h2 className="text-xl font-bold mb-1">Key Takeaways</h2>
        <p className="text-white/45 text-sm mb-5">Click each question to reveal the answer.</p>
        <div className="space-y-2">
          {qaPairs.map((item,i)=>(
            <div key={i} className="rounded-xl border border-white/8 overflow-hidden" style={{background:"rgba(255,255,255,0.02)"}}>
              <button className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 hover:bg-white/3 transition-colors" onClick={()=>setOpenIdx(openIdx===i?null:i)}>
                <span className="text-sm text-white/75 font-medium">{item.q}</span>
                <motion.span animate={{rotate:openIdx===i?45:0}} transition={{duration:0.2}} className="text-white/30 shrink-0 text-lg leading-none">+</motion.span>
              </button>
              <AnimatePresence>
                {openIdx===i&&(
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.25}} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1 border-t border-white/5" style={{background:"rgba(132,204,22,0.05)"}}>
                      <p className="text-xs leading-relaxed" style={{color:"rgba(132,204,22,0.85)"}}>{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
