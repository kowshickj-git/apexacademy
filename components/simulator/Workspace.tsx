"use client";
// The infinite SVG canvas: pan/zoom, grid, parts, terminals, wires, wiring.
// Screen↔world transforms keep interaction correct at any zoom. See design doc §7.

import { useEffect, useRef, useState } from "react";
import { useLab, actions, getState, GRID } from "@/lib/simulator/store";
import type { Part, TerminalRef } from "@/lib/simulator/types";
import { CATALOG, terminalWorld } from "@/lib/simulator/catalog";
import { PartArt } from "./Parts";

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;

type Drag =
  | { mode: "pan"; startX: number; startY: number; panX: number; panY: number }
  | { mode: "part"; id: string; grabDX: number; grabDY: number }
  | null;

function termWorldPos(partId: string, terminalId: string) {
  const part = getState().schematic.parts.find((p) => p.id === partId);
  if (!part) return null;
  const t = CATALOG[part.type].terminals.find((x) => x.id === terminalId);
  if (!t) return null;
  return terminalWorld(part, t);
}

export default function Workspace() {
  const state = useLab((s) => s);
  const { schematic, view, selectedId, pendingWire, mode, grid, result } = state;
  const energized = mode === "running" || mode === "paused";
  const locked = mode === "running";
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const toWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    const sx = clientX - (rect?.left ?? 0);
    const sy = clientY - (rect?.top ?? 0);
    return { x: (sx - view.panX) / view.zoom, y: (sy - view.panY) / view.zoom, sx, sy };
  };

  // Native wheel listener so we can preventDefault (zoom-to-cursor).
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = getState().view;
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
      const wx = (sx - v.panX) / v.zoom;
      const wy = (sy - v.panY) / v.zoom;
      actions.setView({ zoom: nz, panX: sx - wx * nz, panY: sy - wy * nz });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onBackgroundPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    actions.selectPart(null);
    actions.cancelWire();
    drag.current = { mode: "pan", startX: e.clientX, startY: e.clientY, panX: view.panX, panY: view.panY };
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const onPartPointerDown = (e: React.PointerEvent, part: Part) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    actions.selectPart(part.id);
    if (locked) return; // RUN mode: selection only, no dragging
    const w = toWorld(e.clientX, e.clientY);
    drag.current = { mode: "part", id: part.id, grabDX: w.x - part.x, grabDY: w.y - part.y };
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d?.mode === "pan") {
      actions.setView({ panX: d.panX + (e.clientX - d.startX), panY: d.panY + (e.clientY - d.startY) });
    } else if (d?.mode === "part") {
      const w = toWorld(e.clientX, e.clientY);
      actions.movePart(d.id, w.x - d.grabDX, w.y - d.grabDY);
    }
    if (getState().pendingWire) {
      const w = toWorld(e.clientX, e.clientY);
      setCursor({ x: w.x, y: w.y });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    drag.current = null;
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be released */
    }
  };

  const onTerminalPointerDown = (e: React.PointerEvent, ref: TerminalRef) => {
    e.stopPropagation();
    actions.terminalClick(ref);
    const w = toWorld(e.clientX, e.clientY);
    setCursor({ x: w.x, y: w.y });
  };

  // Drag-and-drop from the component library.
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/x-apex-part");
    if (!type) return;
    const w = toWorld(e.clientX, e.clientY);
    actions.addPart(type as Part["type"], w.x, w.y);
  };

  const t = `translate(${view.panX},${view.panY}) scale(${view.zoom})`;
  const gridSize = GRID * view.zoom;

  return (
    <svg
      ref={svgRef}
      className="w-full h-full block touch-none"
      style={{ background: "#0a0a0f", cursor: drag.current?.mode === "pan" ? "grabbing" : "default" }}
      onPointerDown={onBackgroundPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {grid && (
        <>
          <defs>
            <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse" patternTransform={`translate(${view.panX % gridSize},${view.panY % gridSize})`}>
              <circle cx={0.5} cy={0.5} r={0.75} fill="#1e293b" />
            </pattern>
          </defs>
          <rect x={0} y={0} width="100%" height="100%" fill="url(#grid)" />
        </>
      )}

      <g transform={t}>
        {/* Wires (under parts) */}
        {schematic.wires.map((w) => {
          const a = termWorldPos(w.a.partId, w.a.terminalId);
          const b = termWorldPos(w.b.partId, w.b.terminalId);
          if (!a || !b) return null;
          const co = Math.max(24, Math.abs(b.x - a.x) * 0.4);
          const energised = energized && result.ok;
          return (
            <g key={w.id} className="apex-wire">
              <path
                d={`M ${a.x} ${a.y} C ${a.x + co} ${a.y}, ${b.x - co} ${b.y}, ${b.x} ${b.y}`}
                fill="none"
                stroke={w.color}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={energised ? 1 : 0.7}
              />
              {/* invisible thick hit-line for delete */}
              <path
                d={`M ${a.x} ${a.y} C ${a.x + co} ${a.y}, ${b.x - co} ${b.y}, ${b.x} ${b.y}`}
                fill="none"
                stroke="transparent"
                strokeWidth={12}
                style={{ cursor: "pointer" }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  if (e.altKey || e.button === 0) actions.deleteWire(w.id);
                }}
              >
                <title>Click to delete wire</title>
              </path>
            </g>
          );
        })}

        {/* Wire-in-progress preview */}
        {pendingWire && cursor && (() => {
          const a = termWorldPos(pendingWire.partId, pendingWire.terminalId);
          if (!a) return null;
          return <line x1={a.x} y1={a.y} x2={cursor.x} y2={cursor.y} stroke="#38bdf8" strokeWidth={2} strokeDasharray="5 4" />;
        })()}

        {/* Parts */}
        {schematic.parts.map((part) => {
          const model = CATALOG[part.type];
          const selected = part.id === selectedId;
          return (
            <g key={part.id} transform={`translate(${part.x},${part.y}) rotate(${part.rotation})`}>
              {selected && <rect x={-54} y={-46} width={108} height={92} rx={10} fill="#38bdf8" opacity={0.08} stroke="#38bdf8" strokeWidth={1} strokeDasharray="4 3" />}
              <g onPointerDown={(e) => onPartPointerDown(e, part)} style={{ cursor: locked ? "default" : "grab" }}>
                <PartArt part={part} result={result.parts[part.id]} running={energized} />
              </g>
              {/* Clickable terminals */}
              {model.terminals.map((term) => {
                const isPending = pendingWire?.partId === part.id && pendingWire?.terminalId === term.id;
                return (
                  <circle
                    key={term.id}
                    cx={term.dx}
                    cy={term.dy}
                    r={5}
                    fill={isPending ? "#38bdf8" : "#0a0a0f"}
                    stroke={isPending ? "#7dd3fc" : "#64748b"}
                    strokeWidth={1.5}
                    style={{ cursor: "crosshair" }}
                    className="apex-terminal"
                    onPointerDown={(e) => onTerminalPointerDown(e, { partId: part.id, terminalId: term.id })}
                  >
                    <title>{`${model.label} · ${term.id}`}</title>
                  </circle>
                );
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
