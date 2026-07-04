"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { AMBER, CYAN, GREEN } from "./Section";
import { COMPONENTS, ComponentDef } from "./data";

/** Stylized SVG art for each component */
function ComponentArt({ id, color }: { id: string; color: string }) {
  switch (id) {
    case "esp32":
    case "arduino":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect x="18" y="22" width="84" height="76" rx="8" fill={id === "esp32" ? "#0E2A33" : "#0B3B57"} stroke={color} strokeWidth="1.5" />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <rect x={24 + i * 9.5} y="14" width="4" height="10" rx="1" fill="#C0C6CE" />
              <rect x={24 + i * 9.5} y="96" width="4" height="10" rx="1" fill="#C0C6CE" />
            </g>
          ))}
          <rect x="38" y="40" width="34" height="30" rx="3" fill="#111" stroke="#444" />
          <text x="55" y="58" textAnchor="middle" fontSize="8" fill="#888" fontFamily="monospace">{id === "esp32" ? "ESP32" : "ATmega"}</text>
          <rect x="80" y="42" width="14" height="10" rx="2" fill="#222" stroke="#555" />
          <circle cx="87" cy="66" r="3" fill={color}>
            <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
          </circle>
          {id === "esp32" && <path d="M30 30 h18 M30 34 h14 M30 38 h18" stroke="#C89B3C" strokeWidth="1.6" fill="none" />}
        </svg>
      );
    case "l298n":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect x="20" y="26" width="80" height="68" rx="6" fill="#7F1D1D" stroke={color} strokeWidth="1.5" />
          <rect x="44" y="18" width="32" height="34" rx="3" fill="#18181B" stroke="#555" />
          <rect x="48" y="8" width="24" height="14" rx="2" fill="#333" stroke="#666" />
          <text x="60" y="40" textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">L298N</text>
          {[0, 1].map((s) => (
            <g key={s}>
              <rect x={s ? 88 : 22} y="56" width="10" height="18" rx="2" fill="#0891B2" stroke="#2DD4BF" />
              <circle cx={s ? 93 : 27} cy="61" r="1.5" fill="#111" />
              <circle cx={s ? 93 : 27} cy="69" r="1.5" fill="#111" />
            </g>
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={38 + i * 8} y="82" width="3.5" height="9" rx="1" fill="#E8C34A" />
          ))}
        </svg>
      );
    case "ir":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect x="30" y="30" width="60" height="70" rx="5" fill="#1E3A5F" stroke={color} strokeWidth="1.5" />
          <circle cx="46" cy="48" r="8" fill="#111" stroke="#3B0764" strokeWidth="2" />
          <circle cx="74" cy="48" r="8" fill="#0A0A14" stroke="#0EA5E9" strokeWidth="2" />
          <rect x="50" y="68" width="20" height="12" rx="2" fill="#0EA5E9" opacity="0.8" />
          <circle cx="60" cy="74" r="3" fill="#F1F5F9" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={48 + i * 9} y="100" width="3.5" height="12" rx="1" fill="#C0C6CE" />
          ))}
          <motion.path d="M46 58 L40 78 M46 58 L52 78" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3"
            animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }} />
        </svg>
      );
    case "bo-motor":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect x="22" y="42" width="56" height="38" rx="8" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <rect x="30" y="48" width="40" height="26" rx="4" fill="none" stroke="#A16207" strokeDasharray="2 3" />
          <rect x="76" y="50" width="20" height="22" rx="3" fill="#D4D4D8" stroke="#71717A" />
          <rect x="94" y="57" width="16" height="8" rx="2" fill="#FAFAFA" stroke="#71717A" />
          <circle cx="40" cy="86" r="4" fill="#DC2626" />
          <circle cx="56" cy="86" r="4" fill="#111" stroke="#555" />
          <motion.g style={{ originX: "102px", originY: "61px" }} animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <line x1="102" y1="53" x2="102" y2="69" stroke="#71717A" strokeWidth="2" />
          </motion.g>
        </svg>
      );
    case "wheels":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <motion.g style={{ originX: "60px", originY: "60px" }} animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
            <circle cx="60" cy="60" r="40" fill="#18181B" stroke="#3F3F46" strokeWidth="7" />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return <line key={i} x1={60 + Math.cos(a) * 34} y1={60 + Math.sin(a) * 34} x2={60 + Math.cos(a) * 43} y2={60 + Math.sin(a) * 43} stroke="#52525B" strokeWidth="3" />;
            })}
            <circle cx="60" cy="60" r="16" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <rect x="56" y="52" width="8" height="16" rx="2" fill="#0A0A0F" />
          </motion.g>
        </svg>
      );
    case "caster":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect x="36" y="28" width="48" height="10" rx="3" fill="#71717A" />
          <circle cx="46" cy="33" r="2.5" fill="#27272A" /><circle cx="74" cy="33" r="2.5" fill="#27272A" />
          <path d="M48 38 L48 60 Q48 70 60 70 Q72 70 72 60 L72 38" fill="none" stroke="#A1A1AA" strokeWidth="5" />
          <circle cx="60" cy="76" r="18" fill="#D4D4D8" stroke="#71717A" strokeWidth="2" />
          <circle cx="54" cy="70" r="5" fill="#F4F4F5" opacity="0.7" />
        </svg>
      );
    case "chassis":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect x="22" y="30" width="76" height="60" rx="12" fill="rgba(16,185,129,0.12)" stroke={color} strokeWidth="1.5" />
          {[[34, 42], [86, 42], [34, 78], [86, 78], [60, 60]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
          ))}
          <rect x="20" y="44" width="8" height="24" rx="2" fill="none" stroke="rgba(255,255,255,0.25)" />
          <rect x="92" y="44" width="8" height="24" rx="2" fill="none" stroke="rgba(255,255,255,0.25)" />
          <text x="60" y="106" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">acrylic deck</text>
        </svg>
      );
    case "battery":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {[0, 1].map((i) => (
            <g key={i}>
              <rect x="26" y={36 + i * 26} width="60" height="20" rx="6" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
              <rect x="86" y={42 + i * 26} width="6" height="8" rx="2" fill="#A7F3D0" />
              <text x="56" y={50 + i * 26} textAnchor="middle" fontSize="8" fill="#A7F3D0" fontFamily="monospace">18650 · 3.7V</text>
            </g>
          ))}
          <motion.path d="M100 46 L100 78" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <text x="104" y="66" fontSize="10" fill="#EF4444" fontWeight="bold">+</text>
        </svg>
      );
    case "jumpers":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {["#EF4444", "#F59E0B", "#22D3EE", "#10B981", "#A78BFA"].map((c, i) => (
            <path key={c} d={`M20 ${30 + i * 14} C 50 ${18 + i * 16}, 76 ${46 + i * 12}, 100 ${32 + i * 14}`} fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" />
          ))}
          {["#EF4444", "#F59E0B", "#22D3EE", "#10B981", "#A78BFA"].map((c, i) => (
            <g key={i}>
              <rect x="12" y={26 + i * 14} width="9" height="7" rx="1.5" fill="#18181B" stroke="#52525B" />
              <rect x="99" y={28 + i * 14} width="9" height="7" rx="1.5" fill="#18181B" stroke="#52525B" />
            </g>
          ))}
        </svg>
      );
    case "switch":
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect x="34" y="36" width="52" height="50" rx="8" fill="#27272A" stroke="#52525B" strokeWidth="1.5" />
          <rect x="42" y="44" width="36" height="34" rx="5" fill="#DC2626" stroke="#991B1B" />
          <motion.rect x="46" width="28" height="14" rx="3" fill="#FCA5A5"
            animate={{ y: [48, 62, 62, 48] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.6, 0.7] }} />
          <text x="60" y="100" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)">ON / OFF</text>
        </svg>
      );
    default:
      return null;
  }
}

/** Drag-to-rotate pseudo-3D viewer */
function Viewer3D({ comp }: { comp: ComponentDef }) {
  const [rot, setRot] = useState({ x: -12, y: 24 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const idle = useRef(true);

  useEffect(() => {
    let raf = 0;
    const spin = () => {
      if (idle.current) setRot((r) => ({ ...r, y: r.y + 0.35 }));
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative h-52 sm:h-64 rounded-2xl border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ background: "radial-gradient(circle at 50% 40%, #14141E, #050507)", perspective: 700 }}
      onPointerDown={(e) => { dragging.current = true; idle.current = false; last.current = { x: e.clientX, y: e.clientY }; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const dx = e.clientX - last.current.x, dy = e.clientY - last.current.y;
        last.current = { x: e.clientX, y: e.clientY };
        setRot((r) => ({ x: Math.max(-70, Math.min(70, r.x - dy * 0.5)), y: r.y + dx * 0.6 }));
      }}
      onPointerUp={() => { dragging.current = false; setTimeout(() => { idle.current = true; }, 2200); }}
    >
      <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        <div className="w-40 h-40 sm:w-48 sm:h-48 relative" style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`, transformStyle: "preserve-3d" }}>
          {/* front face */}
          <div className="absolute inset-0" style={{ transform: "translateZ(10px)" }}>
            <ComponentArt id={comp.id} color={comp.color} />
          </div>
          {/* back face */}
          <div className="absolute inset-0 opacity-40" style={{ transform: "translateZ(-10px) rotateY(180deg)", filter: "grayscale(0.6)" }}>
            <ComponentArt id={comp.id} color={comp.color} />
          </div>
          {/* edge glow */}
          <div className="absolute inset-6 rounded-2xl" style={{ transform: "translateZ(0px)", boxShadow: `0 0 60px ${comp.color}33` }} />
        </div>
      </div>
      {/* floor reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-14" style={{ background: `linear-gradient(to top, ${comp.color}0f, transparent)` }} />
      <span className="absolute bottom-2 right-3 text-[10px] text-white/25 pointer-events-none">↔ drag to rotate</span>
    </div>
  );
}

function DetailPanel({ comp, onClose }: { comp: ComponentDef; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70"
      onClick={onClose}
      style={{ backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/12 p-5 sm:p-7"
        style={{ background: "rgba(14,14,20,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{comp.emoji}</span>
              <h3 className="text-xl font-black text-white">{comp.name}</h3>
            </div>
            <p className="text-xs text-white/40">{comp.tagline}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl px-2">✕</button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Viewer3D comp={comp} />
          <div className="p-4 rounded-2xl border border-white/8" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: comp.color }}>Working principle</div>
            <p className="text-xs text-white/55 leading-relaxed">{comp.principle}</p>
          </div>
        </div>

        {comp.pins.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/40">Pinout</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {comp.pins.map((p) => (
                <div key={p.name} className="p-2.5 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-[11px] font-black font-mono text-white">{p.name}</span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 leading-snug">{p.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/40">Specifications</div>
            <div className="rounded-xl border border-white/8 overflow-hidden">
              {comp.specs.map(([k, v], i) => (
                <div key={k} className="flex justify-between gap-3 px-3 py-2 text-[11px]" style={{ background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <span className="text-white/35">{k}</span>
                  <span className="text-white/70 font-mono text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: `${GREEN}33`, background: `${GREEN}0a` }}>
              <span className="text-[11px] font-bold text-white/50">Typical cost (India)</span>
              <span className="text-sm font-black" style={{ color: GREEN }}>{comp.cost}</span>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1.5 text-white/40">Advantages</div>
              <div className="flex flex-wrap gap-1.5">
                {comp.advantages.map((a) => (
                  <span key={a} className="text-[10px] px-2 py-1 rounded-lg border" style={{ borderColor: `${GREEN}33`, color: "#6EE7B7", background: `${GREEN}0a` }}>✓ {a}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1.5 text-white/40">Alternatives</div>
              <div className="flex flex-wrap gap-1.5">
                {comp.alternatives.map((a) => (
                  <span key={a} className="text-[10px] px-2 py-1 rounded-lg border border-white/10 text-white/45" style={{ background: "rgba(255,255,255,0.02)" }}>{a}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1.5 text-white/40">Real-world applications</div>
              <div className="flex flex-wrap gap-1.5">
                {comp.applications.map((a) => (
                  <span key={a} className="text-[10px] px-2 py-1 rounded-lg border" style={{ borderColor: `${CYAN}33`, color: "#67E8F9", background: `${CYAN}0a` }}>{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ComponentExplorer({ onExplored }: { onExplored: () => void }) {
  const [open, setOpen] = useState<ComponentDef | null>(null);
  const visited = useRef(new Set<string>());

  const openComp = (c: ComponentDef) => {
    setOpen(c);
    visited.current.add(c.id);
    if (visited.current.size >= 4) onExplored();
  };

  return (
    <Section id="components" num="03" title="Component Explorer"
      subtitle="Every part of your robot, dissected. Click a card for pinouts, specs, cost, and a rotating 3D view. Explore at least 4 to earn XP." wide>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {COMPONENTS.map((c, i) => (
          <motion.button
            key={c.id}
            onClick={() => openComp(c)}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-4 rounded-2xl border border-white/8 text-left group overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `radial-gradient(circle at 50% 0%, ${c.color}14, transparent 70%)` }} />
            <div className="h-24 sm:h-28 mb-2 relative">
              <ComponentArt id={c.id} color={c.color} />
            </div>
            <div className="text-xs sm:text-sm font-black text-white mb-0.5">{c.name}</div>
            <div className="text-[10px] text-white/35 leading-snug mb-2 line-clamp-2">{c.tagline}</div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black" style={{ color: GREEN }}>{c.cost}</span>
              <span className="text-[10px] font-bold transition-colors" style={{ color: visited.current.has(c.id) ? GREEN : AMBER }}>
                {visited.current.has(c.id) ? "✓ explored" : "inspect →"}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>{open && <DetailPanel comp={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </Section>
  );
}
