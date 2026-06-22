/**
 * Pin readers — measure signals the Arduino *outputs*, for actuator simulation.
 * Cycle-accurate, listener-based (no polling). Part of the APEX Sensor Lab.
 */
import { CPU, AVRIOPort } from "avr8js";

/** Measures the width (µs) of the most recent HIGH pulse on a pin (servo PWM). */
export class PulseWidthReader {
  lastUs = 0;
  private readonly cyclesPerUs: number;
  private rise = 0;
  private was = false;

  constructor(cpu: CPU, port: AVRIOPort, bit: number, frequency: number) {
    this.cyclesPerUs = frequency / 1e6;
    port.addListener(() => {
      const high = port.pinState(bit) === 1;
      if (high && !this.was) this.rise = cpu.cycles;
      if (!high && this.was) this.lastUs = (cpu.cycles - this.rise) / this.cyclesPerUs;
      this.was = high;
    });
  }
}

/** Measures PWM duty cycle (0..1) on a pin (analogWrite → DC motor speed). */
export class DutyCycleReader {
  private readonly cpu: CPU;
  private was = false;
  private last = 0;
  private high = 0;
  private total = 0;

  constructor(cpu: CPU, port: AVRIOPort, bit: number) {
    this.cpu = cpu;
    this.last = cpu.cycles;
    port.addListener(() => {
      const high = port.pinState(bit) === 1;
      const now = cpu.cycles;
      const dt = now - this.last;
      if (this.was) this.high += dt;
      this.total += dt;
      this.last = now;
      this.was = high;
    });
  }

  /** Average duty since the last call (accounts for the in-progress level). */
  duty(): number {
    const now = this.cpu.cycles;
    const dt = now - this.last;
    let h = this.high;
    let t = this.total;
    if (this.was) h += dt;
    t += dt;
    const d = t > 0 ? h / t : 0;
    this.high = 0;
    this.total = 0;
    this.last = now;
    return d;
  }
}

/** Measures the toggle frequency (Hz) on a pin (buzzer tone()). */
export class FrequencyReader {
  private readonly cyclesPerUs: number;
  private lastRise = 0;
  private was = false;
  private hz = 0;

  constructor(cpu: CPU, port: AVRIOPort, bit: number, frequency: number) {
    this.cyclesPerUs = frequency / 1e6;
    port.addListener(() => {
      const high = port.pinState(bit) === 1;
      if (high && !this.was) {
        if (this.lastRise) {
          const periodUs = (cpu.cycles - this.lastRise) / this.cyclesPerUs;
          if (periodUs > 0) this.hz = 1e6 / periodUs;
        }
        this.lastRise = cpu.cycles;
      }
      this.was = high;
    });
  }

  /** Current frequency, or 0 if the pin has been idle for >50 ms. */
  currentHz(nowCycles: number): number {
    if (!this.lastRise || nowCycles - this.lastRise > this.cyclesPerUs * 50_000) return 0;
    return this.hz;
  }
}
