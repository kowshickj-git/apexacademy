"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onConnectionUsed: () => void;
}

type ColName = "+" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "-";

interface SelectedHole {
  row: number;
  col: ColName;
}

const LEFT_COLS: ColName[] = ["A", "B", "C", "D", "E"];
const RIGHT_COLS: ColName[] = ["F", "G", "H", "I", "J"];
const ALL_COLS: ColName[] = ["+", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "-"];
const ROWS = [1, 2, 3, 4, 5, 6];

function getConnectedHoles(sel: SelectedHole): SelectedHole[] {
  const { row, col } = sel;
  if (col === "+") {
    return ROWS.filter((r) => r !== row).map((r) => ({ row: r, col: "+" }));
  }
  if (col === "-") {
    return ROWS.filter((r) => r !== row).map((r) => ({ row: r, col: "-" }));
  }
  if ((LEFT_COLS as ColName[]).includes(col)) {
    return LEFT_COLS.filter((c) => c !== col).map((c) => ({ row, col: c }));
  }
  if ((RIGHT_COLS as ColName[]).includes(col)) {
    return RIGHT_COLS.filter((c) => c !== col).map((c) => ({ row, col: c }));
  }
  return [];
}

function isConnected(sel: SelectedHole, hole: SelectedHole): boolean {
  const { row: sr, col: sc } = sel;
  const { row: hr, col: hc } = hole;
  if (sc === hc) return false; // same hole is selected, not "connected"
  if (sc === "+" && hc === "+") return true;
  if (sc === "-" && hc === "-") return true;
  if ((LEFT_COLS as ColName[]).includes(sc) && (LEFT_COLS as ColName[]).includes(hc) && sr === hr) return true;
  if ((RIGHT_COLS as ColName[]).includes(sc) && (RIGHT_COLS as ColName[]).includes(hc) && sr === hr) return true;
  return false;
}

function isSelected(sel: SelectedHole | null, row: number, col: ColName): boolean {
  return sel !== null && sel.row === row && sel.col === col;
}

function formatConnectedList(sel: SelectedHole): string {
  const connected = getConnectedHoles(sel);
  if (connected.length === 0) return "None";
  return connected.map((h) => `${h.col}${h.row}`).join(", ");
}

function getColLabel(col: ColName): string {
  return col;
}

export default function ConnectionTester({ onConnectionUsed }: Props) {
  const [selectedHole, setSelectedHole] = useState<SelectedHole | null>(null);
  const [used, setUsed] = useState(false);

  const handleClick = (row: number, col: ColName) => {
    if (isSelected(selectedHole, row, col)) {
      setSelectedHole(null);
      return;
    }
    setSelectedHole({ row, col });
    if (!used) {
      setUsed(true);
      onConnectionUsed();
    }
  };

  const getHoleStyle = (row: number, col: ColName) => {
    const sel = isSelected(selectedHole, row, col);
    if (sel) {
      return { background: "#14B8A6", boxShadow: "0 0 8px #14B8A6" };
    }
    if (selectedHole && isConnected(selectedHole, { row, col })) {
      return { background: "rgba(20,184,166,0.35)", border: "1px solid rgba(20,184,166,0.5)" };
    }
    if (col === "+") return { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" };
    if (col === "-") return { background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" };
    return { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };
  };

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">
          Section 3 · Simulator 2
        </p>
        <h2 className="text-xl font-bold mb-1">Connection Tester</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          Click any hole to see which other holes it connects to. The highlighted holes share one electrical node.
        </p>

        {/* Grid */}
        <div
          className="rounded-2xl border border-white/8 p-4 mb-4 overflow-x-auto"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* Column headers */}
          <div className="flex items-center gap-1 mb-2 pl-8">
            {ALL_COLS.map((col, i) => (
              <div key={`${col}-${i}`} className="flex items-center">
                {col === "F" && <div className="w-3" />}
                <div className="w-5 text-center text-[9px] font-mono text-white/20">
                  {getColLabel(col)}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-1 mb-1">
              <div className="w-6 text-[9px] font-mono text-white/20 text-right mr-1">{row}</div>
              {ALL_COLS.map((col, ci) => (
                <div key={`${col}-${ci}`} className="flex items-center">
                  {col === "F" && (
                    <div className="w-3 flex items-center justify-center">
                      <div className="w-px h-4 bg-white/10" />
                    </div>
                  )}
                  <button
                    onClick={() => handleClick(row, col)}
                    className="w-5 h-5 rounded-full transition-all duration-150 hover:scale-110 cursor-pointer"
                    style={getHoleStyle(row, col)}
                    title={`${col}${row}`}
                  />
                </div>
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#14B8A6", boxShadow: "0 0 6px #14B8A6" }} />
              <span className="text-[9px] text-white/30">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(20,184,166,0.35)" }} />
              <span className="text-[9px] text-white/30">Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(239,68,68,0.2)" }} />
              <span className="text-[9px] text-white/30">+ rail</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(59,130,246,0.2)" }} />
              <span className="text-[9px] text-white/30">− rail</span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <AnimatePresence mode="wait">
          {selectedHole ? (
            <motion.div
              key={`${selectedHole.col}${selectedHole.row}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl border"
              style={{ borderColor: "rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.06)" }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: "#14B8A6" }}>
                Hole {selectedHole.col}{selectedHole.row} is selected
              </p>
              <p className="text-xs text-white/55 mb-2">
                <span className="text-white/70 font-semibold">Connected holes: </span>
                {formatConnectedList(selectedHole)}
              </p>
              <p className="text-[11px] text-white/35 leading-relaxed">
                {(LEFT_COLS as ColName[]).includes(selectedHole.col)
                  ? `In row ${selectedHole.row}, holes A through E share one electrical connection. This is the LEFT side — completely separate from the right side (F–J).`
                  : (RIGHT_COLS as ColName[]).includes(selectedHole.col)
                  ? `In row ${selectedHole.row}, holes F through J share one electrical connection. This is the RIGHT side — completely separate from the left side (A–E).`
                  : selectedHole.col === "+"
                  ? "All + holes in every row are connected along the positive power rail."
                  : "All − holes in every row are connected along the ground power rail."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl border border-white/8 text-center"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-xs text-white/30">Click any hole to test its connections</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
