// Virtual oscilloscope sampler — REAL signal capture from the avr8js sim.
// Inspired by WaveSense's live-signal viewer + measurement model, but the data
// is the true state of the simulated circuit (no synthetic waveforms).
//
// Sampling runs at 10 kHz via a recurring CPU clock event, so it captures PWM
// and digital edges faithfully (not aliased to the 60 Hz render frame).

import type { AVRRunner } from "./execute";

const SAMPLE_HZ = 10_000;
const BUFFER = 32_000; // ~3.2 s at 10 kHz

function adcCh(pin: string): number {
  const m = /^A(\d)$/.exec(pin);
  return m ? Number(m[1]) : -1;
}
function digBit(pin: string): { letter: "B" | "D"; bit: number } | null {
  const n = Number(pin);
  if (!Number.isInteger(n)) return null;
  if (n >= 0 && n <= 7) return { letter: "D", bit: n };
  if (n >= 8 && n <= 13) return { letter: "B", bit: n - 8 };
  return null;
}

export interface ScopeWindow {
  t: number[]; // ms
  v: number[]; // volts
}

export interface ScopeMeasurements {
  max: number;
  min: number;
  avg: number;
  pp: number;
  rms: number;
  freq: number; // Hz
  period: number; // ms
  duty: number; // %
}

export class ScopeSampler {
  probeA: string | null = "13";
  probeB: string | null = null;

  private readonly runner: AVRRunner;
  private readonly msPerCycle: number;
  private readonly intervalCycles: number;
  private readonly t = new Float64Array(BUFFER);
  private readonly va = new Float32Array(BUFFER);
  private readonly vb = new Float32Array(BUFFER);
  private head = 0;
  private count = 0;
  private stopped = false;

  constructor(runner: AVRRunner) {
    this.runner = runner;
    this.msPerCycle = 1000 / runner.frequency;
    this.intervalCycles = Math.max(1, Math.round(runner.frequency / SAMPLE_HZ));
    this.schedule();
  }

  private schedule() {
    if (this.stopped) return;
    this.runner.cpu.addClockEvent(() => this.tick(), this.intervalCycles);
  }

  private tick() {
    if (this.stopped) return;
    this.t[this.head] = this.runner.cpu.cycles * this.msPerCycle;
    this.va[this.head] = this.probeA ? this.voltage(this.probeA) : 0;
    this.vb[this.head] = this.probeB ? this.voltage(this.probeB) : 0;
    this.head = (this.head + 1) % BUFFER;
    if (this.count < BUFFER) this.count++;
    this.schedule();
  }

  /** True pin voltage: digital/PWM pins → 0/5 V level; analog pins → ADC voltage. */
  private voltage(pin: string): number {
    const ch = adcCh(pin);
    if (ch >= 0) return (this.runner.adcRegistry.getChannel(ch) / 1023) * 5;
    const db = digBit(pin);
    if (db) {
      // Use pinState (not the PORT register) so timer-driven PWM outputs are seen.
      const port = db.letter === "B" ? this.runner.portB : this.runner.portD;
      const s = port.pinState(db.bit);
      return s === 1 || s === 3 ? 5 : 0; // High or InputPullUp → 5 V
    }
    return 0;
  }

  nowMs(): number {
    return this.runner.cpu.cycles * this.msPerCycle;
  }

  stop() {
    this.stopped = true;
  }

  /** Samples within the last `windowMs`, oldest→newest, for channel A or B. */
  window(channel: "A" | "B", windowMs: number): ScopeWindow {
    const arr = channel === "A" ? this.va : this.vb;
    const from = this.nowMs() - windowMs;
    const t: number[] = [];
    const v: number[] = [];
    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - 1 - i + BUFFER * 2) % BUFFER;
      const tt = this.t[idx];
      if (tt < from) break;
      t.push(tt);
      v.push(arr[idx]);
    }
    t.reverse();
    v.reverse();
    return { t, v };
  }
}

/** Oscilloscope measurements over a captured window (WaveSense-style + scope math). */
export function measure(win: ScopeWindow): ScopeMeasurements | null {
  const { t, v } = win;
  if (v.length < 2) return null;
  let max = -Infinity;
  let min = Infinity;
  let sum = 0;
  let sumSq = 0;
  for (const x of v) {
    if (x > max) max = x;
    if (x < min) min = x;
    sum += x;
    sumSq += x * x;
  }
  const avg = sum / v.length;
  const rms = Math.sqrt(sumSq / v.length);
  const pp = max - min;

  // Frequency / period / duty via mid-level crossings (works for digital + analog).
  const threshold = (max + min) / 2;
  const hysteresis = Math.max(0.05, pp * 0.1);
  const risings: number[] = [];
  let above = v[0] > threshold;
  let highTime = 0;
  let totalTime = 0;
  for (let i = 1; i < v.length; i++) {
    const dt = t[i] - t[i - 1];
    totalTime += dt;
    if (v[i - 1] > threshold) highTime += dt;
    if (!above && v[i] > threshold + hysteresis) {
      risings.push(t[i]);
      above = true;
    } else if (above && v[i] < threshold - hysteresis) {
      above = false;
    }
  }
  let period = 0;
  let freq = 0;
  if (risings.length >= 2) {
    let acc = 0;
    for (let i = 1; i < risings.length; i++) acc += risings[i] - risings[i - 1];
    period = acc / (risings.length - 1);
    freq = period > 0 ? 1000 / period : 0;
  }
  const duty = totalTime > 0 ? (highTime / totalTime) * 100 : 0;
  return { max, min, avg, pp, rms, freq, period, duty };
}

/** Find the latest trigger crossing time (ms) for stable display, or null. */
export function findTrigger(win: ScopeWindow, level: number, edge: "rising" | "falling"): number | null {
  const { t, v } = win;
  for (let i = v.length - 1; i >= 1; i--) {
    const a = v[i - 1];
    const b = v[i];
    if (edge === "rising" && a < level && b >= level) return t[i];
    if (edge === "falling" && a > level && b <= level) return t[i];
  }
  return null;
}
