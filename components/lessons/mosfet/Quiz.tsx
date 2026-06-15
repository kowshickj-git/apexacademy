"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass:()=>void; }
const questions = [
  {q:"What does MOSFET stand for?",options:["Metal-Oxide-Semiconductor Field-Effect Transistor","Metal-Oxide-Silicon Field-Effect Transistor","Modulated-Output Switching Field-Effect Transistor","Micro-Oxide Semiconductor FET"],correct:0,explain:"MOSFET = Metal-Oxide-Semiconductor Field-Effect Transistor. The gate is separated from the semiconductor body by a thin metal oxide (SiO₂) insulating layer."},
  {q:"MOSFET is controlled by:",options:["Base current (like BJT)","Gate voltage (no gate current needed)","Collector-emitter voltage","Drain current directly"],correct:1,explain:"MOSFET is voltage-controlled. The gate is insulated — it draws near-zero steady-state current. Only voltage on the gate creates the electric field that opens/closes the channel."},
  {q:"An N-channel MOSFET turns ON when:",options:["V_GS is negative","V_GS exceeds the threshold voltage V_th","V_DS is maximum","Gate current flows in"],correct:1,explain:"N-channel: MOSFET turns on when V_GS > V_th (positive threshold). The positive gate voltage attracts electrons, forming an N-type channel between drain and source."},
  {q:"The threshold voltage (V_th) is:",options:["Maximum allowed gate voltage","Minimum V_GS to create a conductive channel","The voltage at which gate current begins","The drain-source breakdown voltage"],correct:1,explain:"V_th is the minimum gate-to-source voltage required to invert the channel and allow drain current to flow. Below V_th: off. Above V_th: channel forms."},
  {q:"In which operating region is the MOSFET when used as a switch (fully ON)?",options:["Cutoff","Subthreshold","Saturation (pinch-off)","Linear (triode)"],correct:3,explain:"As a switch, MOSFET operates in the Linear (Triode) region when fully on — V_DS is small and R_DS(on) is the dominant parameter. Saturation is used for amplification (constant I_D despite rising V_DS)."},
  {q:"The body diode in a MOSFET is:",options:["An external protection diode","An inherent P-N junction from source to drain (N-ch)","A Zener diode for gate protection","Part of the gate oxide"],correct:1,explain:"Every MOSFET has an intrinsic body diode formed by the body-drain P-N junction. N-channel: anode at source, cathode at drain. It conducts in reverse direction. Used as freewheeling diode in motor drives."},
  {q:"R_DS(on) refers to:",options:["Reverse drain-source resistance","On-resistance when MOSFET is fully conducting","Gate input resistance","Drain series resistance"],correct:1,explain:"R_DS(on) is the drain-source resistance when the MOSFET is fully on. Power loss = I_D² × R_DS(on). Lower is better. Modern power MOSFETs achieve milliohm R_DS(on)."},
  {q:"PWM stands for:",options:["Power Width Modulator","Pulse Width Modulation","Phase Wave Measurement","Periodic Waveform Mode"],correct:1,explain:"PWM = Pulse Width Modulation. Switch MOSFET rapidly on/off at fixed frequency. The duty cycle (% time on) determines average voltage to the load. Used to control motor speed, LED brightness, power converters."},
  {q:"A logic-level MOSFET differs from a standard MOSFET in that:",options:["It can handle higher voltage","Its V_th is low enough to be driven directly by 3.3V or 5V logic","It has a built-in gate resistor","It cannot be used for switching"],correct:1,explain:"Logic-level MOSFETs have V_th < 2V, so they fully turn on at 3.3V or 5V gate drive. Standard MOSFETs need V_GS = 10V. Logic-level variants are essential for microcontroller-driven circuits."},
  {q:"Why must you never leave a MOSFET gate floating?",options:["It increases gate capacitance","Static charge accumulates, causing unpredictable switching","It reduces threshold voltage","It prevents the MOSFET from turning off"],correct:1,explain:"The gate is a capacitor — floating gate accumulates static charge from EMI, nearby signals, or handling. This can partially or fully turn on the MOSFET unexpectedly. Always tie gate to GND (N-ch) or V+ (P-ch) with a pulldown/pullup resistor."},
  {q:"A MOSFET has V_th = 2V, V_GS = 8V. I_D = k(V_GS - V_th)². With k=0.5, I_D = ?",options:["18mA","36mA","16mA","8mA"],correct:0,explain:"I_D = 0.5 × (8-2)² = 0.5 × 36 = 18mA. This is the simplified saturation region equation. (V_GS - V_th)² is the overdrive voltage squared."},
  {q:"Which MOSFET type is better for high-side switching?",options:["N-channel (easier to drive, lower R_DS(on))","P-channel (source connected to V+, gate goes negative to turn on)","Either works equally well","Depletion-mode only"],correct:1,explain:"P-channel is natural for high-side switching — emitter at V+, gate pulled below V+ to turn on (V_SG > V_tp). N-channel high-side needs a bootstrap circuit to generate V_GS > V_DS — more complex but lower R_DS(on)."},
  {q:"What happens to R_DS(on) as temperature increases?",options:["Decreases (better performance)","Stays constant","Increases (positive temperature coefficient)","Goes to zero"],correct:2,explain:"R_DS(on) has a positive temperature coefficient — increases with temperature. Hot MOSFET = higher on-resistance = more power loss = even hotter. This positive feedback can cause thermal runaway. Design with adequate heatsinking and thermal margin."},
  {q:"SiC (Silicon Carbide) MOSFETs are used in high-power applications because:",options:["They are cheaper than silicon","They handle higher voltages, temperatures, and have lower R_DS(on) at high voltages","They are easier to drive","They have lower gate capacitance than silicon"],correct:1,explain:"SiC MOSFETs: 10× higher breakdown field than silicon → rated for 650V–3300V. Lower R_DS(on) than silicon at same voltage rating. Operate at 175°C+ junction temperature. Higher cost, but enables smaller/lighter power converters in EVs, solar, grid."},
  {q:"Gate charge (Q_G) matters for:",options:["DC bias point","Switching speed — higher Q_G = slower switching, more driver power","Output power of the amplifier","Threshold voltage accuracy"],correct:1,explain:"Q_G is the total charge needed to drive the gate to V_GS. Gate driver must supply/remove Q_G each switching cycle. Power = Q_G × V_GS × f_sw. Higher Q_G = more switching losses. Fast switching needs low Q_G MOSFET and strong gate driver."},
  {q:"What is a depletion-mode MOSFET?",options:["Off by default, needs positive V_GS to turn on","On by default, needs negative V_GS to turn off","Has no threshold voltage","Can only operate at high temperatures"],correct:1,explain:"Enhancement-mode (common): off at V_GS=0, positive V_GS turns on. Depletion-mode: on at V_GS=0 (channel is built-in), negative V_GS turns off. Depletion-mode is rarer but used in self-bias circuits and some RF applications."},
  {q:"In an H-bridge motor controller using MOSFETs, the 'dead time' is:",options:["Time motor takes to stop","Brief delay between turning off one MOSFET and on of the complementary MOSFET to prevent shoot-through","Delay in PWM generation","Time constant of gate charging"],correct:1,explain:"Shoot-through: both high-side and low-side MOSFETs on simultaneously → direct short from V+ to GND → catastrophic failure. Dead time is a brief period (50ns–500ns) where both are off, preventing shoot-through during transitions."},
  {q:"The transconductance g_m of a MOSFET determines:",options:["Gate leakage current","How much drain current changes per unit change in V_GS — the amplifier gain"],correct:1,explain:"g_m = dI_D/dV_GS [A/V or S (siemens)]. It's the key parameter for amplifier gain: A_v = -g_m × R_D (common-source). Higher g_m = more amplification. g_m increases with W/L ratio and overdrive voltage (V_GS - V_th)."},
  {q:"Safe Operating Area (SOA) of a MOSFET defines:",options:["The temperature range for storage","The combined V_DS and I_D limits that can be sustained without damage","The gate voltage swing range","The maximum switching frequency"],correct:1,explain:"SOA is the V_DS vs I_D region where the MOSFET can operate without thermal or electrical damage. At high V_DS and I_D simultaneously, power dissipation exceeds thermal limits. SOA curves (from datasheet) bound the safe operating region."},
  {q:"Which formula gives power dissipation in a switching MOSFET?",options:["P = V_GS × I_G","P = I_D² × R_DS(on) + Q_G × V_GS × f","P = V_DS × I_D only","P = C_GS × V_GS²"],correct:1,explain:"P_total = P_conduction + P_switching. P_cond = I_D(rms)² × R_DS(on). P_switch ≈ Q_G × V_GS × f_sw (gate drive loss) + V_DS × I_D × (t_rise + t_fall) × f / 2 (transition loss). Both increase with frequency."},
];

export default function Quiz({ onPass }: Props) {
  const [answers, setAnswers] = useState<(number|null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passTriggered, setPassTriggered] = useState(false);
  const PASS = 14;

  const handleSelect = (qi:number,oi:number) => { if(submitted) return; setAnswers(prev=>{ const n=[...prev]; n[qi]=oi; return n; }); };
  const handleSubmit = () => { const s=answers.reduce<number>((a,v,i)=>a+(v===questions[i].correct?1:0),0); setScore(s); setSubmitted(true); if(s>=PASS&&!passTriggered){ setPassTriggered(true); onPass(); } };
  const handleRetry = () => { setAnswers(Array(questions.length).fill(null)); setSubmitted(false); setScore(0); };
  const allAnswered = answers.every(a=>a!==null);
  const passed = submitted&&score>=PASS;

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Quiz</p>
        <h2 className="text-xl font-bold mb-1">MOSFET Quiz</h2>
        <p className="text-white/45 text-sm mb-4">20 questions — pass at 14/20 to earn <span style={{color:"#3B82F6"}}>+50 XP</span></p>
        <AnimatePresence>
          {submitted&&(
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mb-5 p-4 rounded-2xl border text-center"
              style={{borderColor:passed?"rgba(59,130,246,0.4)":"rgba(239,68,68,0.35)",background:passed?"rgba(59,130,246,0.08)":"rgba(239,68,68,0.07)"}}>
              <p className="text-2xl font-black mb-1" style={{color:passed?"#3B82F6":"#EF4444"}}>{score}/20</p>
              <p className="text-sm font-semibold mb-2" style={{color:passed?"#3B82F6":"#EF4444"}}>{passed?"Passed! +50 XP earned":`Not yet — need ${PASS-score} more correct`}</p>
              {!passed&&<button onClick={handleRetry} className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-white/50 hover:text-white/70 transition-all" style={{background:"rgba(255,255,255,0.03)"}}>Try Again →</button>}
            </motion.div>
          )}
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
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono" style={{background:iB?"rgba(59,130,246,0.1)":iI?"rgba(14,165,233,0.1)":"rgba(251,146,60,0.1)",color:iB?"#3B82F6":iI?"#0EA5E9":"#FB923C"}}>
                      {iB?"Beginner":iI?"Intermediate":"Advanced"}
                    </span>
                    {submitted&&<span className="ml-auto text-sm">{iC?"✅":"❌"}</span>}
                  </div>
                  <p className="text-sm text-white/85 font-medium leading-relaxed">{q.q}</p>
                </div>
                <div className="px-4 pb-3 grid gap-1.5">
                  {q.options.map((opt,oi)=>{
                    let s:React.CSSProperties={background:"rgba(255,255,255,0.03)",borderColor:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)"};
                    if(submitted){ if(oi===q.correct) s={background:"rgba(59,130,246,0.12)",borderColor:"rgba(59,130,246,0.4)",color:"#3B82F6"}; else if(oi===ua&&oi!==q.correct) s={background:"rgba(239,68,68,0.1)",borderColor:"rgba(239,68,68,0.35)",color:"#EF4444"}; }
                    else if(ua===oi) s={background:"rgba(59,130,246,0.1)",borderColor:"rgba(59,130,246,0.3)",color:"rgba(255,255,255,0.85)"};
                    return <button key={oi} onClick={()=>handleSelect(qi,oi)} disabled={submitted} className="w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all disabled:cursor-default hover:opacity-90" style={s}><span className="font-mono text-[10px] opacity-50 mr-2">{["A","B","C","D"][oi]}.</span>{opt}</button>;
                  })}
                </div>
                <AnimatePresence>{submitted&&(<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} transition={{duration:0.25,delay:qi*0.02}} className="overflow-hidden"><div className="px-4 pb-4 pt-2 border-t border-white/5" style={{background:iC?"rgba(59,130,246,0.04)":iW?"rgba(239,68,68,0.04)":"transparent"}}><p className="text-[11px] leading-relaxed text-white/40">{q.explain}</p></div></motion.div>)}</AnimatePresence>
              </div>
            );
          })}
        </div>
        {!submitted&&<button onClick={handleSubmit} disabled={!allAnswered} className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{background:allAnswered?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${allAnswered?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.08)"}`,color:allAnswered?"#3B82F6":"rgba(255,255,255,0.3)"}}>{allAnswered?"Submit Quiz →":`Answer all ${questions.length} questions to submit`}</button>}
        {submitted&&passed&&<div className="w-full py-3 rounded-xl font-bold text-sm text-center" style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",color:"#3B82F6"}}>Quiz Passed! +50 XP earned</div>}
      </div>
    </section>
  );
}
