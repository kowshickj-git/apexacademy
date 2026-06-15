"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onAnalogUsed:()=>void; }

export default function AnalogSim({ onAnalogUsed }: Props) {
  const [knob, setKnob] = useState(512);
  const [triggered, setTriggered] = useState(false);
  const voltage = (knob/1023*5).toFixed(2);
  const brightness = Math.round(knob/1023*255);
  const duty = Math.round(brightness/255*100);

  const handleChange = (v:number) => {
    setKnob(v);
    if(!triggered && Math.abs(v-512)>50){ setTriggered(true); onAnalogUsed(); }
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 5 · Simulator 3</p>
        <h2 className="text-xl font-bold mb-1">analogRead & analogWrite (PWM)</h2>
        <p className="text-white/45 text-sm mb-6">Drag the potentiometer — see raw ADC value, voltage, and LED brightness update live.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(5,150,105,0.2)",background:"rgba(5,150,105,0.04)"}}>
          {/* Knob */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <motion.div className="w-20 h-20 rounded-full border-4 flex items-center justify-center cursor-pointer"
                style={{borderColor:"rgba(5,150,105,0.5)",background:"rgba(5,150,105,0.1)"}}
                animate={{rotate:(knob/1023)*270-135}} transition={{type:"spring",stiffness:300,damping:25}}>
                <div className="w-1 h-8 rounded-full" style={{background:"#059669",transformOrigin:"bottom center"}}/>
              </motion.div>
              <div className="text-[10px] text-center text-white/30 font-mono mt-1">A0 Potentiometer</div>
            </div>
          </div>

          <input type="range" min="0" max="1023" value={knob} onChange={(e)=>handleChange(+e.target.value)} className="w-full mb-5" style={{accentColor:"#059669"}}/>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{l:"analogRead(A0)",v:knob.toString()},{l:"Voltage",v:`${voltage}V`},{l:"analogWrite",v:brightness.toString()}].map((s)=>(
              <div key={s.l} className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono mb-1">{s.l}</div>
                <div className="text-sm font-black font-mono" style={{color:"#059669"}}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* LED brightness display */}
          <div className="flex items-center gap-4 mb-3">
            <motion.div className="w-10 h-10 rounded-full" animate={{background:`rgba(245,158,11,${brightness/255})`,boxShadow:brightness>50?`0 0 ${brightness/8}px rgba(245,158,11,0.6)`:"none"}}/>
            <div className="flex-1">
              <div className="text-[10px] text-white/30 font-mono mb-1">PWM Duty Cycle: {duty}%</div>
              <div className="h-3 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
                <motion.div className="h-full rounded-full" animate={{width:`${duty}%`}} style={{background:"rgba(245,158,11,0.8)"}}/>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2.5 border border-white/6 text-center">
            <p className="text-[11px] font-mono" style={{color:"rgba(5,150,105,0.6)"}}>
              int mapped = map(analogRead(A0), 0, 1023, 0, 255);<br/>
              analogWrite(9, mapped); // PWM on pin 9
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
