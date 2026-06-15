"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props { xp:number; onClose:()=>void; }

const COLORS = ["#059669","#10B981","#6EE7B7","#FFD700","#FFC107","#FFFFFF","#A7F3D0","#FBBF24"];

const LESSONS = [
  "Electricity Basics","Ohm's Law","Series Circuits — wait","Parallel Circuits","Capacitors","Diodes",
  "AC/DC","Transistors","Breadboards","Multimeter","Series Circuits","Parallel Circuits",
  "Switches","Pull-Up/Down","Inductors","Transformers","BJT","MOSFET","Logic Gates","Arduino"
];

export default function ArduinoComplete({ xp, onClose }:Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{x:number;y:number;vx:number;vy:number;color:string;size:number;life:number}[]>([]);
  const rafRef = useRef<number|null>(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    particlesRef.current = Array.from({length:100},()=>({
      x:W/2+(Math.random()-0.5)*W*0.6,
      y:H*0.4,
      vx:(Math.random()-0.5)*8,
      vy:-(Math.random()*12+4),
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      size:Math.random()*8+4,
      life:1,
    }));

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      particlesRef.current.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.25; p.life-=0.008;
        ctx.globalAlpha=Math.max(0,p.life);
        ctx.fillStyle=p.color;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha=1;
      if(particlesRef.current.some(p=>p.life>0)) rafRef.current=requestAnimationFrame(draw);
    };
    rafRef.current=requestAnimationFrame(draw);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[]);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,0.92)"}}
      initial={{opacity:0}} animate={{opacity:1}}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{zIndex:0}}/>

      <motion.div className="relative z-10 max-w-2xl w-full mx-4 rounded-3xl border p-8 overflow-y-auto max-h-[90vh]"
        style={{borderColor:"rgba(5,150,105,0.4)",background:"rgba(5,150,105,0.08)"}}
        initial={{scale:0.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:260,damping:22,delay:0.1}}>

        <div className="text-center mb-8">
          <motion.div className="text-7xl mb-3" animate={{rotate:[0,10,-10,8,-8,0]}} transition={{duration:0.8,delay:0.3}}>🏆</motion.div>
          <h2 className="text-3xl font-black mb-1" style={{color:"#059669"}}>Course Complete!</h2>
          <p className="text-white/55 text-sm mb-3">All 20 Lessons Done · APEX Academy Electronics</p>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border font-black text-lg" style={{borderColor:"rgba(5,150,105,0.4)",background:"rgba(5,150,105,0.12)",color:"#059669"}}>
            +{xp} XP Total
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2 font-mono text-white/40">
            <span>Course Progress</span><span>100% Complete 🏆</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
            <motion.div className="h-full rounded-full" style={{background:"linear-gradient(90deg,#059669,#10B981)"}}
              initial={{width:"0%"}} animate={{width:"100%"}} transition={{duration:1,delay:0.4}}/>
          </div>
        </div>

        {/* All 20 lesson badges */}
        <div className="mb-6">
          <p className="text-xs text-white/30 font-mono mb-3">All Lessons Completed</p>
          <div className="grid grid-cols-4 gap-2">
            {LESSONS.map((name,i)=>(
              <motion.div key={name} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.5+i*0.04,type:"spring",stiffness:300,damping:20}}
                className="rounded-xl border p-2 text-center" style={{borderColor:"rgba(5,150,105,0.25)",background:"rgba(5,150,105,0.07)"}}>
                <div className="text-[9px] font-black font-mono mb-0.5" style={{color:"rgba(5,150,105,0.7)"}}>L{String(i+1).padStart(2,"0")}</div>
                <div className="text-[8px] text-white/40 leading-tight">{name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievement badges */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {icon:"⚡",label:"Electronics Master",sub:"All 20 lessons done"},
            {icon:"🔬",label:"Lab Experimenter",sub:"100+ simulations run"},
            {icon:"📡",label:"Circuit Designer",sub:"Series to Arduino"},
            {icon:"🎓",label:"APEX Graduate",sub:"Full course complete"},
          ].map((b)=>(
            <div key={b.label} className="flex items-center gap-3 rounded-xl border px-3 py-2.5" style={{borderColor:"rgba(5,150,105,0.2)",background:"rgba(5,150,105,0.05)"}}>
              <span className="text-xl">{b.icon}</span>
              <div><div className="text-xs font-bold" style={{color:"#059669"}}>{b.label}</div><div className="text-[10px] text-white/35">{b.sub}</div></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm" style={{borderColor:"rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.5)"}}>
            ✕ Close
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm" style={{background:"linear-gradient(135deg,#059669,#10B981)",color:"white"}}>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
