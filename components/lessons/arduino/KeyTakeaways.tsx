"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS = [
  {q:"What does setup() vs loop() do?",a:"setup() runs once at power-on — initialize pins, serial, libraries. loop() runs forever — your main logic. It's equivalent to init() + while(true){} in C."},
  {q:"How does analogRead() work?",a:"The ATmega328P has a 10-bit ADC (Analog-to-Digital Converter). It measures 0–5V and maps it to 0–1023. analogRead(A0) takes ~100μs. Use map() to convert to useful units."},
  {q:"What is PWM and how does analogWrite() use it?",a:"Pulse-Width Modulation rapidly switches a pin between HIGH and LOW. analogWrite(pin, 0-255) sets the duty cycle: 0=always OFF, 255=always ON, 128=50% on. Works only on ~ pins (3,5,6,9,10,11)."},
  {q:"Why use INPUT_PULLUP instead of INPUT?",a:"Floating inputs (not connected to a defined voltage) read random values. INPUT_PULLUP connects an internal 20–50kΩ resistor to 5V, so the pin reads HIGH when open and LOW when grounded — common for buttons."},
  {q:"What are the Serial Monitor baud rates and why do they matter?",a:"Baud rate must match between Serial.begin(rate) in code and the monitor setting. Common rates: 9600, 115200. A mismatch shows garbled characters. 9600 is slow (960 bytes/sec); 115200 is fast enough for most logging."},
  {q:"How do you go from Arduino prototype to a real product?",a:"Strip down to bare ATmega328P chip (~$2), add a 16MHz crystal, decoupling caps, and a RESET circuit. Upload via ISP programmer. This is how commercial products using Arduino-compatible chips are built."},
];

export default function KeyTakeaways() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 10</p>
        <h2 className="text-xl font-bold mb-6">Key Takeaways</h2>
        <div className="space-y-2">
          {ITEMS.map((item,i)=>(
            <div key={i} className="rounded-2xl border border-white/8 overflow-hidden">
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-white/2 transition-colors">
                <span className="text-sm font-semibold pr-4">{item.q}</span>
                <motion.span className="text-white/30 text-lg flex-shrink-0" animate={{rotate:open===i?45:0}} transition={{type:"spring",stiffness:300,damping:25}}>+</motion.span>
              </button>
              <AnimatePresence>
                {open===i&&(
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.25}}>
                    <div className="px-5 pb-4 text-sm text-white/55 leading-relaxed border-t border-white/5 pt-3" style={{background:"rgba(5,150,105,0.05)"}}>
                      {item.a}
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
