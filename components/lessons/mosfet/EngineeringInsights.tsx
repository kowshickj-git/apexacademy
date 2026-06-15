"use client";
import { motion } from "framer-motion";

const insights = [
  {title:"Power Electronics",body:"MOSFETs handle kW power in inverters, motor drives, and EV chargers. Low R_DS(on) × high current = minimal heat. Modern SiC MOSFETs operate at 1700V — impossible with BJTs.",icon:"⚡"},
  {title:"Logic Level vs Standard",body:"Standard MOSFETs need V_GS=10V. Logic-level MOSFETs turn fully on at V_GS=3.3V or 5V — directly driven by microcontrollers without level shifters.",icon:"🔌"},
  {title:"Gate Driver ICs",body:"Fast switching (100kHz+) needs dedicated gate drivers to charge/discharge gate capacitance quickly. Without them, switching is slow and losses increase.",icon:"🏎️"},
];

export default function EngineeringInsights() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 8 · Engineering</p>
        <h2 className="text-xl font-bold mb-1">Engineering Insights</h2>
        <p className="text-white/45 text-sm mb-5">How MOSFETs are used in real products.</p>
        <div className="space-y-3">
          {insights.map((c,i)=>(
            <motion.div key={c.title} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35,delay:i*0.1}}
              className="rounded-xl border p-4 flex items-start gap-3"
              style={{borderColor:"rgba(59,130,246,0.2)",background:"rgba(59,130,246,0.04)"}}>
              <span className="text-2xl flex-shrink-0">{c.icon}</span>
              <div>
                <h3 className="text-sm font-bold mb-1" style={{color:"#3B82F6"}}>{c.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
