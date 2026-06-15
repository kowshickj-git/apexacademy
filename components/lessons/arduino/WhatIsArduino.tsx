"use client";
import { motion } from "framer-motion";

export default function WhatIsArduino() {
  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 2 · Concepts</p>
        <h2 className="text-xl font-bold mb-4">What is Arduino?</h2>
        <p className="text-white/55 text-sm leading-relaxed mb-6">
          Arduino is an open-source microcontroller platform. The Uno uses an ATmega328P chip running at 16MHz with 32KB flash, 2KB RAM. It has 14 digital I/O pins (6 PWM), 6 analog inputs, USB for programming, and runs on 5V.
        </p>

        <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
          <div className="px-4 py-2 border-b border-white/5" style={{background:"rgba(5,150,105,0.06)"}}>
            <p className="text-xs font-bold" style={{color:"#059669"}}>Arduino Uno Pin Reference</p>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {[{term:"Digital Pins 0–13",def:"HIGH (5V) or LOW (0V). Pins 3,5,6,9,10,11 support PWM (~)."},
              {term:"Analog Pins A0–A5",def:"Read voltages 0–5V as numbers 0–1023 (10-bit ADC)."},
              {term:"Power: 5V, 3.3V, GND",def:"Regulated 5V and 3.3V outputs. GND is the reference (0V)."},
              {term:"Vin / USB",def:"Power in: Vin pin (7–12V) or USB (5V from computer)."}].map((item,i)=>(
              <div key={item.term} className="p-3 border-white/5" style={{borderBottom:i<2?"1px solid rgba(255,255,255,0.05)":"none",borderRight:i%2===0?"1px solid rgba(255,255,255,0.05)":"none"}}>
                <div className="text-[10px] font-black font-mono mb-1" style={{color:"rgba(5,150,105,0.7)"}}>{item.term}</div>
                <div className="text-[10px] text-white/40 leading-relaxed">{item.def}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 border border-white/6" style={{background:"rgba(255,255,255,0.02)"}}>
          <p className="text-xs text-white/30 font-mono mb-3">Essential Functions</p>
          {[{f:"setup()",d:"Runs once at startup — initialize pins, serial, etc."},
            {f:"loop()",d:"Runs forever — your main program logic"},
            {f:"pinMode(pin, MODE)",d:"Set pin as INPUT, OUTPUT, or INPUT_PULLUP"},
            {f:"digitalWrite(pin, HIGH/LOW)",d:"Set digital pin voltage"},
            {f:"digitalRead(pin)",d:"Read pin: returns HIGH or LOW"},
            {f:"analogRead(A0)",d:"Read analog 0–1023 (maps to 0–5V)"},
            {f:"analogWrite(pin, 0-255)",d:"PWM output on ~ pins"},
            {f:"delay(ms)",d:"Pause execution for ms milliseconds"}].map((item)=>(
            <div key={item.f} className="flex items-start gap-2 mb-2 last:mb-0">
              <code className="text-[10px] font-mono px-2 py-1 rounded flex-shrink-0" style={{background:"rgba(5,150,105,0.1)",color:"#059669"}}>{item.f}</code>
              <span className="text-[10px] text-white/35 pt-1">{item.d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
