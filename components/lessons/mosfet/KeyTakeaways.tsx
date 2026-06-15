"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const qaPairs = [
  {q:"How is MOSFET different from BJT?",a:"MOSFET is voltage-controlled (gate current ≈ 0). BJT is current-controlled (needs continuous I_B). MOSFET gate draws only charging/discharging current transiently. At steady state, gate current = 0. This means a microcontroller pin can directly drive a MOSFET gate without a current-limiting resistor (though a gate resistor is good practice to limit switching transients)."},
  {q:"What is threshold voltage V_th?",a:"V_th is the minimum V_GS needed to create a conductive channel. Below V_th: MOSFET is off (cutoff region). At V_th: channel just begins to form. Above V_th: channel conducts, I_D flows. V_th is typically 0.5V–4V depending on MOSFET type. Temperature increases reduce V_th (hotter = turns on easier)."},
  {q:"N-channel vs P-channel — when to use which?",a:"N-channel: more common, faster, lower R_DS(on). Used for low-side switching (MOSFET between load and GND). P-channel: used for high-side switching (MOSFET between V+ and load). Gate needs to be pulled LOW (below V_S) to turn on. Complementary pairs (N+P) used in H-bridges and push-pull output stages."},
  {q:"What is R_DS(on)?",a:"On-resistance when MOSFET is fully conducting. Power dissipated = I_D² × R_DS(on). Lower is better. Modern power MOSFETs achieve R_DS(on) < 1mΩ for 100A+ applications. R_DS(on) increases with temperature — a concern for thermal runaway prevention. SiC MOSFETs have much lower R_DS(on) than silicon at high voltages."},
  {q:"What does PWM do with a MOSFET?",a:"Pulse Width Modulation: rapidly switch MOSFET on and off at fixed frequency (1kHz–100kHz+). Average voltage delivered to load = duty cycle × V_supply. 50% duty = 50% average voltage. The load (motor, LED, heater) integrates the pulses — sees an average value. MOSFETs switch faster than BJTs, making them ideal for PWM at high frequencies."},
  {q:"What is the body diode?",a:"Every MOSFET has an inherent body diode from source to drain (N-ch: anode at source, cathode at drain). It forms from the P-N junction between the body and drain regions. In normal operation it doesn't conduct. In H-bridge motor control, body diodes act as freewheeling diodes. Can be a problem in bidirectional power flow — separate Schottky diodes are sometimes added."},
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
                    <div className="px-4 pb-4 pt-1 border-t border-white/5" style={{background:"rgba(59,130,246,0.05)"}}>
                      <p className="text-xs leading-relaxed" style={{color:"rgba(59,130,246,0.85)"}}>{item.a}</p>
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
