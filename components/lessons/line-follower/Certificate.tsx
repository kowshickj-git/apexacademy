"use client";
import { useEffect, useRef, useState } from "react";
import Section, { AMBER, CYAN, GREEN, Card } from "./Section";

export interface Scores { skill: number; sim: number; project: number }

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** deterministic QR-style verification pattern */
function drawQR(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, seed: string) {
  const N = 21, cell = size / N;
  let h = hashStr(seed);
  const rnd = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x - 8, y - 8, size + 16, size + 16);
  ctx.fillStyle = "#0A0A0F";
  const finder = (fx: number, fy: number) => {
    ctx.fillRect(x + fx * cell, y + fy * cell, cell * 7, cell * 7);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + (fx + 1) * cell, y + (fy + 1) * cell, cell * 5, cell * 5);
    ctx.fillStyle = "#0A0A0F"; ctx.fillRect(x + (fx + 2) * cell, y + (fy + 2) * cell, cell * 3, cell * 3);
  };
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
      if (!inFinder && rnd() > 0.52) ctx.fillRect(x + c * cell, y + r * cell, cell - 0.5, cell - 0.5);
    }
  }
}

export default function Certificate({ scores, unlocked }: { scores: Scores; unlocked: boolean }) {
  const [name, setName] = useState("");
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const total = Math.round((scores.skill + scores.sim + scores.project) / 3);
  const grade = total >= 90 ? "A+" : total >= 75 ? "A" : total >= 60 ? "B+" : total >= 45 ? "B" : "C";
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const certId = name ? `APX-LF-${(hashStr(name + dateStr) % 1000000).toString().padStart(6, "0")}` : "APX-LF-______";

  useEffect(() => {
    if (!generated || !name) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = 1200, H = 850;

    // background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0A0A12"); bg.addColorStop(1, "#101020");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
    for (let i = 0; i < H; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

    // border
    ctx.strokeStyle = AMBER; ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, W - 56, H - 56);
    ctx.strokeStyle = "rgba(245,158,11,0.3)"; ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // corner glows
    const glow = ctx.createRadialGradient(W - 100, 100, 0, W - 100, 100, 300);
    glow.addColorStop(0, "rgba(34,211,238,0.12)"); glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.fillStyle = AMBER;
    ctx.font = "900 26px Inter, sans-serif";
    ctx.fillText("APEX ACADEMY", W / 2, 105);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "600 14px Inter, sans-serif";
    ctx.fillText("ROBOTICS  ·  EMBEDDED SYSTEMS  ·  CONTROL ENGINEERING", W / 2, 130);

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 18px Inter, sans-serif";
    ctx.fillText("This certifies that", W / 2, 210);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 56px Inter, sans-serif";
    ctx.fillText(name.toUpperCase(), W / 2, 280);

    ctx.strokeStyle = "rgba(245,158,11,0.5)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 280, 300); ctx.lineTo(W / 2 + 280, 300); ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 18px Inter, sans-serif";
    ctx.fillText("has successfully completed the full engineering program and is hereby a", W / 2, 345);

    ctx.fillStyle = CYAN;
    ctx.font = "900 36px Inter, sans-serif";
    ctx.fillText("CERTIFIED LINE FOLLOWER ROBOT ENGINEER", W / 2, 400);

    // scores row
    const rows: [string, number, string][] = [["SKILL SCORE", scores.skill, AMBER], ["SIMULATION SCORE", scores.sim, CYAN], ["PROJECT SCORE", scores.project, GREEN]];
    rows.forEach(([label, v, color], i) => {
      const bx = W / 2 - 330 + i * 220;
      ctx.strokeStyle = `${color}66`; ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, 450, 220 - 20, 100);
      ctx.fillStyle = color as string;
      ctx.font = "900 40px Inter, sans-serif";
      ctx.fillText(`${v}`, bx + 100, 508);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "700 12px Inter, sans-serif";
      ctx.fillText(label, bx + 100, 535);
    });

    ctx.fillStyle = AMBER;
    ctx.font = "900 24px Inter, sans-serif";
    ctx.fillText(`FINAL GRADE: ${grade}`, W / 2, 605);

    // footer
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 15px Inter, sans-serif";
    ctx.fillText(`Completion date: ${dateStr}`, 80, 720);
    ctx.fillText(`Certificate ID: ${certId}`, 80, 748);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "500 12px Inter, sans-serif";
    ctx.fillText("Verify at apexacademy.vercel.app/electronics/line-follower", 80, 776);

    // signature
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath(); ctx.moveTo(520, 750); ctx.lineTo(720, 750); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "italic 600 20px Georgia, serif";
    ctx.fillText("APEX Robotics Lab", 528, 740);
    ctx.font = "500 11px Inter, sans-serif";
    ctx.fillText("Program Director", 560, 768);

    // QR
    drawQR(ctx, W - 240, 660, 150, name + dateStr + certId);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "500 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("scan to verify", W - 165, 838);
  }, [generated, name, scores, grade, dateStr, certId]);

  const downloadPNG = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const a = document.createElement("a");
    a.download = `APEX-Certificate-${name.replace(/\s+/g, "-")}.png`;
    a.href = cv.toDataURL("image/png");
    a.click();
  };

  return (
    <Section id="certificate" num="16" title="Digital Engineering Certificate"
      subtitle="Complete the labs and challenges above, enter your name, and mint your certificate — scores are pulled live from your session." color={AMBER} wide>
      {!unlocked ? (
        <Card className="p-10 text-center max-w-xl mx-auto">
          <div className="text-4xl mb-3">🔒</div>
          <div className="text-sm font-black text-white/70 mb-2">Certificate locked</div>
          <p className="text-xs text-white/40 leading-relaxed">
            Finish the core labs to unlock: <b className="text-white/60">assemble the robot</b> (§4),{" "}
            <b className="text-white/60">complete the wiring</b> (§5), and{" "}
            <b className="text-white/60">finish one simulation track</b> (§9).
            Challenge points raise your final grade.
          </p>
        </Card>
      ) : (
        <div className="max-w-3xl mx-auto">
          {!generated ? (
            <Card className="p-8 text-center">
              <div className="text-3xl mb-3">🎓</div>
              <div className="text-lg font-black text-white mb-1">You&apos;ve earned it, Engineer.</div>
              <p className="text-xs text-white/40 mb-6">Enter your name exactly as it should appear on the certificate.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={32}
                  placeholder="Your full name"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/25 outline-none focus:border-amber-500/60 transition-colors"
                />
                <button
                  disabled={name.trim().length < 3}
                  onClick={() => setGenerated(true)}
                  className="px-6 py-3 rounded-xl font-black text-sm text-black transition-all hover:scale-[1.02] disabled:opacity-30 disabled:hover:scale-100"
                  style={{ background: `linear-gradient(90deg, ${AMBER}, #FBBF24)` }}>
                  Generate Certificate
                </button>
              </div>
              <div className="flex justify-center gap-6 mt-6 text-[11px] text-white/40">
                <span>Skill <b style={{ color: AMBER }}>{scores.skill}</b></span>
                <span>Simulation <b style={{ color: CYAN }}>{scores.sim}</b></span>
                <span>Project <b style={{ color: GREEN }}>{scores.project}</b></span>
              </div>
            </Card>
          ) : (
            <div>
              <div className="rounded-2xl overflow-hidden border-2 shadow-2xl" style={{ borderColor: `${AMBER}44`, boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 60px ${AMBER}18` }}>
                <canvas ref={canvasRef} width={1200} height={850} className="w-full block" />
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-5">
                <button onClick={downloadPNG}
                  className="px-6 py-3 rounded-xl font-black text-sm text-black transition-transform hover:scale-[1.02]"
                  style={{ background: `linear-gradient(90deg, ${AMBER}, #FBBF24)` }}>
                  ⬇ Download PNG
                </button>
                <button onClick={() => setGenerated(false)}
                  className="px-6 py-3 rounded-xl font-bold text-sm border border-white/12 text-white/50 hover:bg-white/5 transition-all">
                  ✎ Edit name
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
