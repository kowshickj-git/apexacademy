"use client";
// SVG artwork for each component (presentation only).
// Receives the part + its solved result; draws in local space (origin = part center).
// The Workspace positions/rotates the group and overlays clickable terminals.

import type { Part, PartResult } from "@/lib/simulator/types";
import { LED_GLOW } from "@/lib/simulator/catalog";
import { fmtV, fmtOhm } from "@/lib/simulator/format";

interface ArtProps {
  part: Part;
  result?: PartResult;
  running: boolean;
}

const STROKE = "#cbd5e1";
const LEAD = "#64748b";

export function PartArt({ part, result, running }: ArtProps) {
  switch (part.type) {
    case "supply":
      return <SupplyArt part={part} result={result} running={running} />;
    case "ground":
      return <GroundArt />;
    case "resistor":
      return <ResistorArt part={part} result={result} running={running} />;
    case "potentiometer":
      return <PotentiometerArt part={part} result={result} running={running} />;
    case "led":
      return <LedArt part={part} result={result} running={running} />;
    case "button":
      return <ButtonArt part={part} />;
    case "switch":
      return <SwitchArt part={part} />;
    case "voltmeter":
      return <VoltmeterArt result={result} running={running} />;
    default:
      return null;
  }
}

function SupplyArt({ part, result, running }: ArtProps) {
  const on = part.props.on !== false;
  const v = Number(part.props.voltage ?? 5);
  return (
    <g>
      <rect x={-50} y={-30} width={80} height={60} rx={8} fill="#1e293b" stroke={STROKE} strokeWidth={1.5} />
      <text x={-40} y={-14} fontSize={8} fill="#94a3b8" fontFamily="monospace">
        DC SUPPLY
      </text>
      <text x={-40} y={6} fontSize={16} fontWeight="700" fill="#e2e8f0" fontFamily="monospace">
        {v.toFixed(1)}V
      </text>
      {/* power LED */}
      <circle cx={18} cy={-16} r={3.5} fill={on && running ? "#22c55e" : "#334155"} />
      {/* terminal leads */}
      <line x1={30} y1={-20} x2={40} y2={-20} stroke={LEAD} strokeWidth={2} />
      <line x1={30} y1={20} x2={40} y2={20} stroke={LEAD} strokeWidth={2} />
      <text x={20} y={-26} fontSize={11} fill="#f87171" fontWeight="700">+</text>
      <text x={21} y={30} fontSize={13} fill="#60a5fa" fontWeight="700">−</text>
      {running && result?.active && (
        <text x={-40} y={24} fontSize={8} fill="#22c55e" fontFamily="monospace">
          {result.current >= 1 ? `${result.current.toFixed(2)}A` : `${(result.current * 1000).toFixed(0)}mA`}
        </text>
      )}
    </g>
  );
}

function GroundArt() {
  return (
    <g>
      <line x1={0} y1={-40} x2={0} y2={-8} stroke={LEAD} strokeWidth={2} />
      <line x1={-14} y1={-8} x2={14} y2={-8} stroke={STROKE} strokeWidth={2.5} />
      <line x1={-9} y1={-2} x2={9} y2={-2} stroke={STROKE} strokeWidth={2.5} />
      <line x1={-4} y1={4} x2={4} y2={4} stroke={STROKE} strokeWidth={2.5} />
    </g>
  );
}

function ResistorArt({ part, result, running }: ArtProps) {
  const r = Number(part.props.resistance ?? 1000);
  const hot = running && result ? Math.min(1, result.power / 0.25) : 0;
  return (
    <g>
      <line x1={-40} y1={0} x2={-22} y2={0} stroke={LEAD} strokeWidth={2} />
      <line x1={22} y1={0} x2={40} y2={0} stroke={LEAD} strokeWidth={2} />
      <rect x={-22} y={-9} width={44} height={18} rx={3} fill="#3f2d1a" stroke={STROKE} strokeWidth={1.5} />
      {/* color bands */}
      <rect x={-14} y={-9} width={3} height={18} fill="#f59e0b" />
      <rect x={-6} y={-9} width={3} height={18} fill="#ef4444" />
      <rect x={2} y={-9} width={3} height={18} fill="#a16207" />
      <rect x={12} y={-9} width={3} height={18} fill="#eab308" />
      {hot > 0.5 && <rect x={-22} y={-9} width={44} height={18} rx={3} fill="#ef4444" opacity={(hot - 0.5) * 0.7} />}
      <text x={0} y={-15} fontSize={9} fill="#cbd5e1" textAnchor="middle" fontFamily="monospace">
        {fmtOhm(r)}
      </text>
      {running && result?.active && (
        <text x={0} y={22} fontSize={8} fill="#38bdf8" textAnchor="middle" fontFamily="monospace">
          {result.current >= 1e-3 ? `${(result.current * 1000).toFixed(1)}mA` : `${(result.current * 1e6).toFixed(0)}µA`}
        </text>
      )}
    </g>
  );
}

function PotentiometerArt({ part, result, running }: ArtProps) {
  const pos = Math.min(1, Math.max(0, Number(part.props.position ?? 0.5)));
  const max = Number(part.props.maxResistance ?? 10000);
  const r = pos * max;
  const wiperX = -18 + pos * 36;
  return (
    <g>
      <line x1={-40} y1={0} x2={-22} y2={0} stroke={LEAD} strokeWidth={2} />
      <line x1={22} y1={0} x2={40} y2={0} stroke={LEAD} strokeWidth={2} />
      <rect x={-22} y={-9} width={44} height={18} rx={3} fill="#26303f" stroke={STROKE} strokeWidth={1.5} />
      {/* wiper track + arrow */}
      <line x1={-18} y1={-15} x2={18} y2={-15} stroke="#475569" strokeWidth={1.5} />
      <line x1={wiperX} y1={-15} x2={0} y2={-7} stroke="#eab308" strokeWidth={2} strokeLinecap="round" />
      <polygon points={`${wiperX - 3},-15 ${wiperX + 3},-15 ${wiperX},-10`} fill="#eab308" />
      <text x={0} y={-19} fontSize={8} fill="#cbd5e1" textAnchor="middle" fontFamily="monospace">
        {fmtOhm(r)}
      </text>
      {running && result?.active && (
        <text x={0} y={22} fontSize={8} fill="#38bdf8" textAnchor="middle" fontFamily="monospace">
          {result.current >= 1e-3 ? `${(result.current * 1000).toFixed(1)}mA` : `${(result.current * 1e6).toFixed(0)}µA`}
        </text>
      )}
    </g>
  );
}

function LedArt({ part, result, running }: ArtProps) {
  const color = String(part.props.color ?? "red");
  const glow = LED_GLOW[color] ?? "#ff3b30";
  const damaged = !!part.props.damaged;
  const b = !damaged && running && result?.brightness ? result.brightness : 0;

  if (damaged) {
    return (
      <g>
        <line x1={-40} y1={0} x2={-14} y2={0} stroke={LEAD} strokeWidth={2} />
        <line x1={14} y1={0} x2={40} y2={0} stroke={LEAD} strokeWidth={2} />
        {/* burnt body */}
        <path d="M -12 -11 L -12 11 L 12 0 Z" fill="#171717" stroke="#3f3f46" strokeWidth={1.2} />
        <line x1={12} y1={-11} x2={12} y2={11} stroke="#3f3f46" strokeWidth={2.5} />
        {/* scorch + smoke wisp */}
        <circle cx={0} cy={0} r={5} fill="#000" />
        <path d="M 0 -12 q 7 -5 1 -12 q -6 -5 1 -11" stroke="#6b7280" strokeWidth={1.4} fill="none" opacity={0.55} strokeLinecap="round" />
        <text x={0} y={24} fontSize={8} fill="#f87171" textAnchor="middle" fontFamily="monospace" fontWeight="700">
          BURNT
        </text>
      </g>
    );
  }

  return (
    <g>
      <line x1={-40} y1={0} x2={-14} y2={0} stroke={LEAD} strokeWidth={2} />
      <line x1={14} y1={0} x2={40} y2={0} stroke={LEAD} strokeWidth={2} />
      {/* glow halo */}
      {b > 0.02 && <circle cx={0} cy={0} r={18 + b * 10} fill={glow} opacity={0.35 * b} />}
      {/* diode triangle (anode → cathode) + cathode bar */}
      <path d="M -12 -11 L -12 11 L 12 0 Z" fill={b > 0.02 ? glow : "#475569"} stroke={STROKE} strokeWidth={1.2} opacity={b > 0.02 ? 0.5 + 0.5 * b : 1} />
      <line x1={12} y1={-11} x2={12} y2={11} stroke={STROKE} strokeWidth={2.5} />
      <circle cx={0} cy={0} r={5} fill={glow} opacity={0.2 + 0.8 * b} />
      {/* LED emission arrows — what distinguishes an LED from a plain diode */}
      <g
        stroke={b > 0.02 ? glow : "#94a3b8"}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={b > 0.02 ? 0.55 + 0.45 * b : 0.85}
      >
        <line x1={-2} y1={-13} x2={8} y2={-23} />
        <polyline points="3,-23 8,-23 8,-18" />
        <line x1={4} y1={-13} x2={14} y2={-23} />
        <polyline points="9,-23 14,-23 14,-18" />
      </g>
      {running && result && result.current > 1e-4 && (
        <text x={0} y={24} fontSize={8} fill={glow} textAnchor="middle" fontFamily="monospace">
          {(result.current * 1000).toFixed(1)}mA
        </text>
      )}
    </g>
  );
}

function ButtonArt({ part }: { part: Part }) {
  const closed = !!part.props.closed;
  return (
    <g>
      <line x1={-40} y1={0} x2={-16} y2={0} stroke={LEAD} strokeWidth={2} />
      <line x1={16} y1={0} x2={40} y2={0} stroke={LEAD} strokeWidth={2} />
      <rect x={-16} y={-14} width={32} height={20} rx={4} fill="#1e293b" stroke={STROKE} strokeWidth={1.5} />
      <rect x={-7} y={-22} width={14} height={10} rx={2} fill={closed ? "#22c55e" : "#475569"} stroke={STROKE} strokeWidth={1.2} />
      <circle cx={-16} cy={0} r={2.5} fill={STROKE} />
      <circle cx={16} cy={0} r={2.5} fill={STROKE} />
      {closed && <line x1={-16} y1={0} x2={16} y2={0} stroke="#22c55e" strokeWidth={2} />}
      <text x={0} y={20} fontSize={8} fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
        {closed ? "CLOSED" : "OPEN"}
      </text>
    </g>
  );
}

function SwitchArt({ part }: { part: Part }) {
  const closed = !!part.props.closed;
  return (
    <g>
      <line x1={-40} y1={0} x2={-16} y2={0} stroke={LEAD} strokeWidth={2} />
      <line x1={16} y1={0} x2={40} y2={0} stroke={LEAD} strokeWidth={2} />
      <circle cx={-16} cy={0} r={3} fill={STROKE} />
      <circle cx={16} cy={0} r={3} fill={STROKE} />
      <line x1={-16} y1={0} x2={closed ? 16 : 12} y2={closed ? 0 : -12} stroke={closed ? "#22c55e" : "#cbd5e1"} strokeWidth={2.5} strokeLinecap="round" />
      <text x={0} y={22} fontSize={8} fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
        {closed ? "ON" : "OFF"}
      </text>
    </g>
  );
}

function VoltmeterArt({ result, running }: { result?: PartResult; running: boolean }) {
  return (
    <g>
      <line x1={-40} y1={0} x2={-18} y2={0} stroke={LEAD} strokeWidth={2} />
      <line x1={18} y1={0} x2={40} y2={0} stroke={LEAD} strokeWidth={2} />
      <circle cx={0} cy={0} r={18} fill="#0f172a" stroke={STROKE} strokeWidth={1.5} />
      <text x={0} y={-3} fontSize={12} fill="#38bdf8" textAnchor="middle" fontWeight="700">
        V
      </text>
      <text x={0} y={9} fontSize={7} fill="#e2e8f0" textAnchor="middle" fontFamily="monospace">
        {running && result?.reading !== undefined ? fmtV(result.reading) : "— —"}
      </text>
    </g>
  );
}
