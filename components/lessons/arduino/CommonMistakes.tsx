"use client";
import { motion } from "framer-motion";

const MISTAKES = [
  {
    title:"No delay() in loop() — crashes MCU",
    wrong:"void loop() { analogRead(A0); }",
    right:"void loop() { val=analogRead(A0); delay(10); }",
    why:"Without any delay the MCU runs millions of reads per second, starving serial and hanging interrupts. Even delay(1) helps.",
  },
  {
    title:"Wrong pinMode — pin reads garbage",
    wrong:"int v = digitalRead(7); // no pinMode",
    right:"void setup(){ pinMode(7,INPUT_PULLUP); }",
    why:"Uninitialized pins float between HIGH and LOW, giving random readings. Always set INPUT, OUTPUT, or INPUT_PULLUP in setup().",
  },
  {
    title:"Connecting 5V sensor to 3.3V Arduino",
    wrong:"sensor.VCC → 3.3V Arduino 5V pin (pulls up to 5V on data line)",
    right:"Use a level shifter or select a 3.3V-compatible sensor.",
    why:"3.3V boards (Nano 33, MKR family) are NOT 5V tolerant on I/O pins. 5V signals will permanently damage the MCU.",
  },
  {
    title:"Forgetting Serial.begin() — no output",
    wrong:"void setup(){ } void loop(){ Serial.println(val); }",
    right:"void setup(){ Serial.begin(9600); }",
    why:"Serial is not active until Serial.begin(baud) is called. Without it, println silently does nothing.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 9</p>
        <h2 className="text-xl font-bold mb-6">Common Mistakes</h2>
        <div className="grid gap-4">
          {MISTAKES.map((m,i)=>(
            <motion.div key={m.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
              className="rounded-2xl border p-5" style={{borderColor:"rgba(239,68,68,0.18)",background:"rgba(239,68,68,0.04)"}}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">⚠️</span>
                <h3 className="font-bold text-sm text-red-400">{m.title}</h3>
              </div>
              <div className="grid gap-2 mb-3">
                <div className="rounded-lg p-2.5 border border-red-500/20">
                  <div className="text-[9px] text-red-400/60 font-mono mb-1">WRONG</div>
                  <code className="text-[10px] font-mono text-red-400/70">{m.wrong}</code>
                </div>
                <div className="rounded-lg p-2.5 border border-emerald-500/20">
                  <div className="text-[9px] text-emerald-400/60 font-mono mb-1">CORRECT</div>
                  <code className="text-[10px] font-mono" style={{color:"rgba(5,150,105,0.7)"}}>{m.right}</code>
                </div>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">{m.why}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
