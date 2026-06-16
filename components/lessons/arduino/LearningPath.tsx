"use client";
import Link from "next/link";

interface Milestones { lessonRead:boolean; blinkUsed:boolean; digitalReadUsed:boolean; analogUsed:boolean; serialUsed:boolean; projectUsed:boolean; quizPassed:boolean; lessonFinished:boolean; }
interface Props { milestones:Milestones; }

const lessons = [
  {num:"01",title:"Voltage",href:"/lessons/voltage",status:"done"},
  {num:"02",title:"Current",href:"/lessons/current",status:"done"},
  {num:"03",title:"Resistance",href:"/electronics/resistance",status:"done"},
  {num:"04",title:"Ohm's Law",href:"/electronics/ohms-law",status:"done"},
  {num:"05",title:"Resistors",href:"/electronics/resistors",status:"done"},
  {num:"06",title:"Capacitors",href:"/electronics/capacitors",status:"available"},
  {num:"07",title:"LEDs",href:"/electronics/leds",status:"done"},
  {num:"08",title:"Diodes",href:"/electronics/diodes",status:"done"},
  {num:"09",title:"Breadboards",href:"/electronics/breadboards",status:"done"},
  {num:"10",title:"Multimeter",href:"/electronics/multimeter",status:"done"},
  {num:"11",title:"Series Circuits",href:"/electronics/series-circuits",status:"done"},
  {num:"12",title:"Parallel Circuits",href:"/electronics/parallel-circuits",status:"done"},
  {num:"13",title:"Switches",href:"/electronics/switches",status:"done"},
  {num:"14",title:"Pull-Up/Pull-Down",href:"/electronics/pullup-pulldown",status:"done"},
  {num:"15",title:"Inductors",href:"/electronics/inductors",status:"done"},
  {num:"16",title:"Transformers",href:"/electronics/transformers",status:"done"},
  {num:"17",title:"BJT Transistors",href:"/electronics/bjt",status:"done"},
  {num:"18",title:"MOSFET",href:"/electronics/mosfet",status:"done"},
  {num:"19",title:"Logic Gates",href:"/electronics/logic-gates",status:"done"},
  {num:"20",title:"Arduino",href:"/electronics/arduino",status:"active"},
  {num:"21",title:"Sensors",href:"/electronics/sensors",status:"available"},
  {num:"22",title:"Comm Protocols",href:"/electronics/communication-protocols",status:"available"},
  {num:"23",title:"UART",href:"/electronics/uart",status:"available"},
  {num:"24",title:"I2C",href:"/electronics/i2c",status:"available"},
  {num:"25",title:"SPI",href:"/electronics/spi",status:"available"},
  {num:"26",title:"CAN Protocol",href:"/electronics/can",status:"available"},
  {num:"27",title:"RS485",href:"/electronics/rs485",status:"available"},
  {num:"28",title:"IoT",href:"/electronics/iot",status:"available"},
  {num:"29",title:"ESP32",href:"/electronics/esp32",status:"available"},
  {num:"30",title:"STM32",href:"/electronics/stm32",status:"available"},
  {num:"31",title:"FreeRTOS",href:"/electronics/freertos",status:"locked"},
  {num:"32",title:"PCB Design",href:"/electronics/pcb-design",status:"locked"},
  {num:"33",title:"Embedded",href:"/electronics/embedded-projects",status:"locked"},
  {num:"34",title:"Robotics",href:"/electronics/robotics",status:"locked"},
  {num:"35",title:"Computer Vision",href:"/electronics/computer-vision",status:"locked"},
  {num:"36",title:"AI Robotics",href:"/electronics/ai-robotics",status:"locked"},
];

export default function LearningPath({ milestones }: Props) {
  const totalDone = Object.values(milestones).filter(Boolean).length;
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-white/30 mb-1 font-mono"><span>Overall progress</span><span>20/36 = 56%</span></div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}><div className="h-full rounded-full" style={{width:"100%",background:"linear-gradient(90deg,#059669,#10B981,#34D399)"}}/></div>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-white/25 mb-1 font-mono"><span>Lesson XP</span><span>{totalDone}/8 milestones</span></div>
        <div className="h-1 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}><div className="h-full rounded-full transition-all duration-500" style={{width:`${(totalDone/8)*100}%`,background:"rgba(5,150,105,0.6)"}}/></div>
      </div>
      <div className="space-y-0.5">
        {lessons.map((l)=>{
          if(l.status==="done") return (
            <Link key={l.num} href={l.href} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/3 transition-colors group">
              <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"rgba(16,185,129,0.15)"}}><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l2 2 3-3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg></span>
              <span className="text-[10px] font-mono text-white/25 flex-shrink-0">L{l.num}</span>
              <span className="text-xs text-white/45 group-hover:text-white/65 transition-colors truncate">{l.title}</span>
            </Link>
          );
          if(l.status==="active") return (
            <div key={l.num} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg" style={{background:"rgba(5,150,105,0.08)",border:"1px solid rgba(5,150,105,0.18)"}}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 relative" style={{background:"rgba(5,150,105,0.2)"}}><span className="w-1.5 h-1.5 rounded-full" style={{background:"#059669"}}/><span className="absolute inset-0 rounded-full animate-ping" style={{background:"rgba(5,150,105,0.3)"}}/></span>
              <span className="text-[10px] font-mono flex-shrink-0" style={{color:"rgba(5,150,105,0.6)"}}>L{l.num}</span>
              <span className="text-xs font-semibold truncate" style={{color:"#059669"}}>{l.title} 🏆</span>
            </div>
          );
          return (
            <div key={l.num} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg opacity-40">
              <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.06)"}}><svg width="7" height="8" viewBox="0 0 7 8"><rect x="1" y="3.5" width="5" height="4" rx="0.8" fill="rgba(255,255,255,0.3)"/><path d="M2 3.5V2.5a1.5 1.5 0 013 0v1" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/></svg></span>
              <span className="text-[10px] font-mono text-white/15 flex-shrink-0">L{l.num}</span>
              <span className="text-xs text-white/25 truncate">{l.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
