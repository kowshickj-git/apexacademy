"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass:()=>void; }
const questions = [
  {q:"What is the output of an AND gate when A=1 and B=1?",options:["0","1","Undefined","Depends on voltage"],correct:1,explain:"AND gate: output=1 only when ALL inputs=1. 1 AND 1 = 1. Truth table: 0·0=0, 0·1=0, 1·0=0, 1·1=1."},
  {q:"What is the output of an OR gate when A=0 and B=0?",options:["0","1","NOT(0)","HIGH"],correct:0,explain:"OR gate: output=1 when ANY input=1. When both are 0: 0+0=0. Output is LOW."},
  {q:"The NOT gate has how many inputs?",options:["Two","Three","One","Four"],correct:2,explain:"NOT gate (inverter) has exactly ONE input and one output. Output = NOT(input). Symbol: triangle with a bubble at the output."},
  {q:"What does a NAND gate output when A=1 and B=1?",options:["1","0","HIGH","Same as AND"],correct:1,explain:"NAND = NOT(AND). When A=1, B=1: AND=1, NOT(1)=0. NAND(1,1)=0. NAND outputs 0 only when ALL inputs are 1."},
  {q:"XOR gate outputs 1 when:",options:["Both inputs are 1","Both inputs are 0","Inputs are DIFFERENT","Inputs are the SAME"],correct:2,explain:"XOR (Exclusive OR): output=1 when inputs are DIFFERENT. XOR(0,1)=1, XOR(1,0)=1. XOR(0,0)=0, XOR(1,1)=0."},
  {q:"A 2-input truth table has how many rows?",options:["2","4","8","16"],correct:1,explain:"2 inputs × 2 possible values each = 2² = 4 combinations: 00, 01, 10, 11. An n-input truth table has 2ⁿ rows."},
  {q:"NAND is called a 'universal gate' because:",options:["It is the cheapest to make","Any Boolean function can be built from NAND gates alone","It has the highest speed","It works with both 3.3V and 5V"],correct:1,explain:"NAND is universal: NOT = NAND(A,A). AND = NOT(NAND(A,B)). OR = NAND(NOT A, NOT B) = NAND(NAND(A,A),NAND(B,B)). Any logic function can be built from only NAND gates."},
  {q:"De Morgan's Law states that NOT(A AND B) equals:",options:["NOT A AND NOT B","NOT A OR NOT B","NOT(A OR B)","A NAND B (same thing)"],correct:1,explain:"De Morgan's First Law: NOT(A AND B) = NOT A OR NOT B. Second law: NOT(A OR B) = NOT A AND NOT B. This means NAND(A,B) = OR(NOT A, NOT B)."},
  {q:"What is the output of XNOR when A=1 and B=1?",options:["0","1","Same as XOR","Undefined"],correct:1,explain:"XNOR = NOT(XOR). XOR(1,1)=0, so XNOR(1,1)=NOT(0)=1. XNOR outputs 1 when inputs are SAME (equality detector)."},
  {q:"In CMOS logic, a NOR gate is made from:",options:["2 NMOS in series + 2 PMOS in parallel","2 NMOS in parallel + 2 PMOS in series","4 NMOS only","2 PMOS only"],correct:1,explain:"CMOS NOR: 2 PMOS in SERIES (pull-up — both must be off to let output go high), 2 NMOS in PARALLEL (pull-down — either on pulls output low). The series PMOS topology distinguishes NOR from NAND."},
  {q:"A=1, B=0, C=1. What is AND(A, OR(B,C))?",options:["0","1","AND(1,1)","Cannot determine"],correct:1,explain:"Step 1: OR(B,C) = OR(0,1) = 1. Step 2: AND(A, 1) = AND(1,1) = 1. Combinational logic is evaluated inside-out like arithmetic with parentheses."},
  {q:"Which gate would you use to detect if two 1-bit numbers are equal?",options:["AND","OR","XOR","XNOR"],correct:3,explain:"XNOR outputs 1 when inputs are SAME (equal). XNOR(0,0)=1, XNOR(1,1)=1, XNOR(0,1)=0, XNOR(1,0)=0. XNOR is called an equality detector."},
  {q:"What is the minimum number of NAND gates needed to build an AND gate?",options:["1","2","3","4"],correct:1,explain:"AND = NOT(NAND(A,B)). NAND gate #1: NAND(A,B). NAND gate #2 as inverter: NAND(output, output) = NOT(output). Total: 2 NAND gates. One NAND = one inverted AND (not an AND itself)."},
  {q:"A 1-bit half adder uses which gates?",options:["AND and OR","AND and XOR","OR and NOT","NAND only"],correct:1,explain:"Half adder: Sum = A XOR B (XOR gives the sum bit). Carry = A AND B (AND gives the carry bit). Two gates: XOR (for sum) and AND (for carry). Full adder adds a third input (carry-in) using more gates."},
  {q:"Logic 1 in a 3.3V system equals approximately:",options:["0V","1.65V",">2V (typically 2.4V–3.3V)","Exactly 3.3V always"],correct:2,explain:"In 3.3V CMOS, logic HIGH is typically defined as V_OH > 2V (output) and V_IH > 2V (input threshold). It is NOT always exactly 3.3V — it just needs to be above the input threshold for the receiving gate."},
  {q:"What does a bubble (small circle) on a gate symbol indicate?",options:["The gate is unpowered","Inversion at that point","The gate is analog","Extra current capacity"],correct:1,explain:"A bubble symbol = inversion. On the output: output is inverted (NAND = AND with output bubble, NOR = OR with output bubble). On inputs: input is inverted before processing. Bubbles are the standard IEEE/ANSI notation for logical inversion."},
  {q:"How many transistors does a typical CMOS NAND gate use?",options:["1","2","4","8"],correct:2,explain:"CMOS NAND: 2 PMOS (in parallel, pull-up) + 2 NMOS (in series, pull-down) = 4 transistors total. NOR also uses 4 transistors. NOT uses 2. This is why standard cell libraries quote transistor count as a complexity metric."},
  {q:"The output of NOR(A,B,C) when A=0, B=0, C=1 is:",options:["1","0","NOT(1)","Same as OR"],correct:1,explain:"NOR = NOT(OR). OR(0,0,1) = 1 (because C=1). NOR = NOT(1) = 0. For a 3-input NOR, output is 1 ONLY when ALL inputs are 0."},
  {q:"In an FPGA, logic gates are implemented using:",options:["Fixed transistor circuits","Look-Up Tables (LUTs) that store truth table outputs","Analog comparators","ROM chips"],correct:1,explain:"FPGAs use Look-Up Tables (LUTs). A 4-input LUT can implement any Boolean function of 4 variables by storing the truth table (2⁴=16 outputs) in SRAM cells. The LUT is programmed (configured) rather than hardwired."},
  {q:"Boolean algebra: simplify A·A (A AND A):",options:["A²","2A","A","0"],correct:2,explain:"In Boolean algebra: A·A = A. Any variable ANDed with itself equals itself. Similarly: A+A = A (idempotent law). This differs from normal algebra where A×A = A². Boolean has only two values so 'squaring' makes no sense."},
];

export default function Quiz({ onPass }: Props) {
  const [answers, setAnswers] = useState<(number|null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passTriggered, setPassTriggered] = useState(false);
  const PASS=14;
  const handleSelect=(qi:number,oi:number)=>{ if(submitted) return; setAnswers(p=>{ const n=[...p]; n[qi]=oi; return n; }); };
  const handleSubmit=()=>{ const s=answers.reduce<number>((a,v,i)=>a+(v===questions[i].correct?1:0),0); setScore(s); setSubmitted(true); if(s>=PASS&&!passTriggered){ setPassTriggered(true); onPass(); } };
  const handleRetry=()=>{ setAnswers(Array(questions.length).fill(null)); setSubmitted(false); setScore(0); };
  const allAnswered=answers.every(a=>a!==null);
  const passed=submitted&&score>=PASS;
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Quiz</p>
        <h2 className="text-xl font-bold mb-1">Logic Gates Quiz</h2>
        <p className="text-white/45 text-sm mb-4">20 questions — pass at 14/20 to earn <span style={{color:"#84CC16"}}>+50 XP</span></p>
        <AnimatePresence>
          {submitted&&(<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mb-5 p-4 rounded-2xl border text-center" style={{borderColor:passed?"rgba(132,204,22,0.4)":"rgba(239,68,68,0.35)",background:passed?"rgba(132,204,22,0.08)":"rgba(239,68,68,0.07)"}}>
            <p className="text-2xl font-black mb-1" style={{color:passed?"#84CC16":"#EF4444"}}>{score}/20</p>
            <p className="text-sm font-semibold mb-2" style={{color:passed?"#84CC16":"#EF4444"}}>{passed?"Passed! +50 XP earned":`Need ${PASS-score} more correct`}</p>
            {!passed&&<button onClick={handleRetry} className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-white/50 hover:text-white/70 transition-all" style={{background:"rgba(255,255,255,0.03)"}}>Try Again →</button>}
          </motion.div>)}
        </AnimatePresence>
        <div className="space-y-5 mb-6">
          {questions.map((q,qi)=>{
            const ua=answers[qi]; const iC=submitted&&ua===q.correct; const iW=submitted&&ua!==null&&ua!==q.correct;
            const iB=qi<10; const iI=qi>=10&&qi<15;
            return (
              <div key={qi} className="rounded-2xl border border-white/8 overflow-hidden" style={{background:"rgba(255,255,255,0.015)"}}>
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono text-white/20">Q{qi+1}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono" style={{background:iB?"rgba(132,204,22,0.1)":iI?"rgba(14,165,233,0.1)":"rgba(251,146,60,0.1)",color:iB?"#84CC16":iI?"#0EA5E9":"#FB923C"}}>{iB?"Beginner":iI?"Intermediate":"Advanced"}</span>
                    {submitted&&<span className="ml-auto text-sm">{iC?"✅":"❌"}</span>}
                  </div>
                  <p className="text-sm text-white/85 font-medium leading-relaxed">{q.q}</p>
                </div>
                <div className="px-4 pb-3 grid gap-1.5">
                  {q.options.map((opt,oi)=>{
                    let s:React.CSSProperties={background:"rgba(255,255,255,0.03)",borderColor:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)"};
                    if(submitted){ if(oi===q.correct) s={background:"rgba(132,204,22,0.12)",borderColor:"rgba(132,204,22,0.4)",color:"#84CC16"}; else if(oi===ua&&oi!==q.correct) s={background:"rgba(239,68,68,0.1)",borderColor:"rgba(239,68,68,0.35)",color:"#EF4444"}; }
                    else if(ua===oi) s={background:"rgba(132,204,22,0.1)",borderColor:"rgba(132,204,22,0.3)",color:"rgba(255,255,255,0.85)"};
                    return <button key={oi} onClick={()=>handleSelect(qi,oi)} disabled={submitted} className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all disabled:cursor-default" style={s}><span className="font-mono text-[10px] opacity-50 mr-2">{["A","B","C","D"][oi]}.</span>{opt}</button>;
                  })}
                </div>
                <AnimatePresence>{submitted&&(<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} transition={{duration:0.25,delay:qi*0.02}} className="overflow-hidden"><div className="px-4 pb-4 pt-2 border-t border-white/5" style={{background:iC?"rgba(132,204,22,0.04)":iW?"rgba(239,68,68,0.04)":"transparent"}}><p className="text-[11px] leading-relaxed text-white/40">{q.explain}</p></div></motion.div>)}</AnimatePresence>
              </div>
            );
          })}
        </div>
        {!submitted&&<button onClick={handleSubmit} disabled={!allAnswered} className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{background:allAnswered?"rgba(132,204,22,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${allAnswered?"rgba(132,204,22,0.4)":"rgba(255,255,255,0.08)"}`,color:allAnswered?"#84CC16":"rgba(255,255,255,0.3)"}}>{allAnswered?"Submit Quiz →":`Answer all ${questions.length} questions to submit`}</button>}
        {submitted&&passed&&<div className="w-full py-3 rounded-xl font-bold text-sm text-center" style={{background:"rgba(132,204,22,0.1)",border:"1px solid rgba(132,204,22,0.3)",color:"#84CC16"}}>Quiz Passed! +50 XP earned</div>}
      </div>
    </section>
  );
}
