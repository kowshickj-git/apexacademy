"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props { onAmplifierUsed:()=>void; }

export default function AmplifierSim({ onAmplifierUsed }: Props) {
  const [inputV, setInputV] = useState(0.2);
  const [triggered, setTriggered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const gm = 50; // mA/V transconductance
  const RD = 2000; // Ohms
  const gain = -(gm/1000)*RD; // ≈ -100
  const outputAmplitude = Math.abs(gain) * inputV;

  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d"); if(!ctx) return;
    const W = canvas.width; const H = canvas.height;
    const midH = H/2;

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = "rgba(5,5,7,0.9)";
      ctx.fillRect(0,0,W,H);
      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for(let y=0;y<=H;y+=H/4){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      for(let x=0;x<=W;x+=W/4){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      // Midline
      ctx.strokeStyle="rgba(255,255,255,0.1)"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(0,midH); ctx.lineTo(W,midH); ctx.stroke(); ctx.setLineDash([]);
      // Input signal (blue)
      ctx.strokeStyle="#3B82F6"; ctx.lineWidth=2;
      ctx.beginPath();
      for(let x=0;x<W;x++){
        const t=(x/W)*Math.PI*4+timeRef.current;
        const y=midH - (inputV/0.5)*(midH*0.3)*Math.sin(t);
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();
      // Output signal (orange, inverted & amplified)
      const maxOut = Math.min(outputAmplitude,2);
      ctx.strokeStyle="#F97316"; ctx.lineWidth=2;
      ctx.beginPath();
      for(let x=0;x<W;x++){
        const t=(x/W)*Math.PI*4+timeRef.current;
        const y=midH + (maxOut/2)*(midH*0.35)*Math.sin(t); // inverted
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();
      // Labels
      ctx.fillStyle="rgba(59,130,246,0.8)"; ctx.font="10px monospace"; ctx.fillText("IN",4,14);
      ctx.fillStyle="rgba(249,115,22,0.8)"; ctx.fillText("OUT (inverted)",4,26);
      timeRef.current += 0.04;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[inputV,outputAmplitude]);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 4 · Simulator 2</p>
        <h2 className="text-xl font-bold mb-1">Common-Source Amplifier</h2>
        <p className="text-white/45 text-sm mb-6">Adjust input amplitude — output is amplified and <strong className="text-orange-400">inverted</strong>. Watch the phase flip live.</p>

        <div className="rounded-2xl border p-5" style={{borderColor:"rgba(59,130,246,0.2)",background:"rgba(59,130,246,0.04)"}}>
          <canvas ref={canvasRef} width={480} height={150} className="w-full rounded-xl mb-4" style={{background:"rgba(5,5,7,0.9)"}}/>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{label:"Input",val:`${inputV.toFixed(2)} V`,col:"#3B82F6"},
              {label:"Gain (A_v)",val:`${gain.toFixed(0)}×`,col:"#F97316"},
              {label:"Output",val:`${Math.min(outputAmplitude,2).toFixed(2)} V`,col:"#F97316"}].map((s)=>(
              <div key={s.label} className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono mb-1">{s.label}</div>
                <div className="text-sm font-black font-mono" style={{color:s.col}}>{s.val}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-white/40">Input Amplitude</span>
              <span style={{color:"#3B82F6"}}>{inputV.toFixed(2)} V</span>
            </div>
            <input type="range" min="0.05" max="0.5" step="0.05" value={inputV}
              onChange={(e)=>{ setInputV(+e.target.value); if(!triggered){ setTriggered(true); onAmplifierUsed(); } }}
              className="w-full" style={{accentColor:"#3B82F6"}}/>
          </div>

          <div className="mt-3 rounded-lg p-3 border border-white/6 text-center">
            <p className="text-[11px] font-mono" style={{color:"rgba(59,130,246,0.7)"}}>
              A_v = −g_m × R_D = −{gm}mA/V × {RD/1000}kΩ = {gain}×
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
