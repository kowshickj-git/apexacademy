"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onPass:()=>void; }

const QUESTIONS = [
  // Beginner (10)
  {q:"What does pinMode(13, OUTPUT) do?",o:["Sets pin 13 as an output pin","Reads pin 13 voltage","Connects pin 13 to GND","Turns on the built-in LED"],a:0},
  {q:"Which function makes an Arduino LED blink?",o:["digitalWrite()","analogRead()","Serial.print()","map()"],a:0},
  {q:"How many digital I/O pins does Arduino Uno have?",o:["14","6","20","8"],a:0},
  {q:"What value does analogRead() return for 5V input?",o:["1023","255","5","100"],a:0},
  {q:"Which pin on Arduino Uno supports PWM?",o:["Pin 9","Pin 4","Pin 7","Pin 0"],a:0},
  {q:"What does setup() do?",o:["Runs once at startup","Runs in a loop forever","Reads sensor data","Sets baud rate only"],a:0},
  {q:"What function sends data to Serial Monitor?",o:["Serial.println()","Serial.read()","Serial.open()","Serial.start()"],a:0},
  {q:"analogWrite(pin, 128) sets what duty cycle?",o:["50%","100%","25%","0%"],a:0},
  {q:"What does INPUT_PULLUP do?",o:["Connects internal resistor to 5V","Connects pin to GND","Makes pin an output","Reads analog voltage"],a:0},
  {q:"Which board uses ATmega328P at 16MHz?",o:["Arduino Uno","Raspberry Pi","ESP32","Teensy 4.0"],a:0},
  // Intermediate (5)
  {q:"Why is delay() in every loop() iteration potentially problematic?",o:["It blocks all other code including interrupts","It uses too much RAM","It stops Serial Monitor","It resets the MCU"],a:0},
  {q:"What happens if baud rates don't match in Serial?",o:["Garbled or no output","LED blinks faster","Analog pins fail","MCU resets"],a:0},
  {q:"The map() function in Arduino does what?",o:["Re-maps a number from one range to another","Maps pin numbers to interrupts","Maps analog to digital","Creates a memory map"],a:0},
  {q:"Which Arduino family is NOT 5V tolerant on I/O pins?",o:["Arduino MKR / Nano 33","Arduino Uno R3","Arduino Mega","Arduino Nano (classic)"],a:0},
  {q:"What is the ADC resolution on Arduino Uno?",o:["10-bit (0-1023)","8-bit (0-255)","12-bit (0-4095)","16-bit (0-65535)"],a:0},
  // Advanced (5)
  {q:"In production, how do you deploy Arduino code without USB?",o:["Use ISP programmer to burn directly to ATmega","Use WiFi OTA only","Connect UART to PC","Burn via SD card"],a:0},
  {q:"Which timer controls PWM on pins 9 and 10 on Arduino Uno?",o:["Timer1 (16-bit)","Timer0 (8-bit)","Timer2 (8-bit)","External timer IC"],a:0},
  {q:"What happens when analogWrite() is called on a non-PWM pin?",o:["Pin is set HIGH (255) or LOW (0) only","Analog signal is output","Pin is disabled","Compilation error"],a:0},
  {q:"Why add a 10kΩ resistor in series with a button to digital pin?",o:["Current limiting — prevents short circuit to GND/5V","Increases signal strength","Acts as a pull-down","Filters noise only"],a:0},
  {q:"Serial.begin(9600) sets communication to approximately how many bytes/second?",o:["960 bytes/sec","9600 bytes/sec","1200 bytes/sec","96 bytes/sec"],a:0},
];

export default function Quiz({ onPass }:Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [calledPass, setCalledPass] = useState(false);

  const isLast = current === QUESTIONS.length-1;
  const q = QUESTIONS[current];

  const choose = (i:number) => { if(!submitted) setSelected(i); };

  const next = () => {
    if(selected===null) return;
    const correct = selected === q.a;
    const newAnswers = [...answers, correct];
    if(isLast){
      const score = newAnswers.filter(Boolean).length;
      const pass = score >= 14;
      setAnswers(newAnswers);
      setPassed(pass);
      setSubmitted(true);
      if(pass && !calledPass){ setCalledPass(true); onPass(); }
    } else {
      setAnswers(newAnswers);
      setCurrent(c=>c+1);
      setSelected(null);
    }
  };

  const retry = () => {
    setCurrent(0); setSelected(null); setAnswers([]); setSubmitted(false); setPassed(false); setCalledPass(false);
  };

  if(submitted){
    const score = answers.filter(Boolean).length;
    return (
      <section className="px-4 sm:px-8 py-10 border-b border-white/5">
        <div className="max-w-2xl">
          <div className="rounded-2xl border p-8 text-center" style={{borderColor:passed?"rgba(5,150,105,0.3)":"rgba(239,68,68,0.3)",background:passed?"rgba(5,150,105,0.06)":"rgba(239,68,68,0.06)"}}>
            <div className="text-4xl mb-3">{passed?"🏆":"📖"}</div>
            <div className="text-2xl font-black mb-1" style={{color:passed?"#059669":"#EF4444"}}>{score}/20</div>
            <div className="text-sm text-white/50 mb-4">{passed?"Passed! You mastered Arduino.":"Need 14/20 to pass."}</div>
            {!passed&&<button onClick={retry} className="px-6 py-2 rounded-xl font-bold text-sm border" style={{borderColor:"rgba(5,150,105,0.4)",background:"rgba(5,150,105,0.12)",color:"#059669"}}>Retry Quiz</button>}
          </div>
        </div>
      </section>
    );
  }

  const LEVELS = ["Beginner","Beginner","Beginner","Beginner","Beginner","Beginner","Beginner","Beginner","Beginner","Beginner","Intermediate","Intermediate","Intermediate","Intermediate","Intermediate","Advanced","Advanced","Advanced","Advanced","Advanced"];

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 11 · Quiz</p>
        <h2 className="text-xl font-bold mb-1">Arduino Quiz</h2>
        <p className="text-white/40 text-xs mb-5">20 questions · Pass with 14/20</p>

        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
          <motion.div className="h-full rounded-full" style={{background:"#059669"}} animate={{width:`${(current/20)*100}%`}}/>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{duration:0.2}}>
            <div className="rounded-2xl border p-5 mb-4" style={{borderColor:"rgba(5,150,105,0.18)",background:"rgba(5,150,105,0.04)"}}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-white/30">{current+1}/20</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full border font-mono" style={{borderColor:"rgba(5,150,105,0.3)",color:"rgba(5,150,105,0.7)"}}>{LEVELS[current]}</span>
              </div>
              <p className="font-semibold text-sm mb-4">{q.q}</p>
              <div className="space-y-2">
                {q.o.map((opt,i)=>(
                  <button key={i} onClick={()=>choose(i)} className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                    style={{borderColor:selected===i?"rgba(5,150,105,0.6)":"rgba(255,255,255,0.07)",background:selected===i?"rgba(5,150,105,0.1)":"rgba(255,255,255,0.02)",color:selected===i?"#059669":"rgba(255,255,255,0.6)"}}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={next} disabled={selected===null} className="w-full py-3 rounded-xl font-bold text-sm border transition-all disabled:opacity-30"
              style={{borderColor:"rgba(5,150,105,0.4)",background:"rgba(5,150,105,0.12)",color:"#059669"}}>
              {isLast?"Submit Quiz →":"Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
