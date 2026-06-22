// APEX Open Sensor Lab — realistic device framework.
//
// REALISTIC PRINCIPLE: every device models its real-world behaviour. Inputs
// inject physically-correct values into avr8js (ADC counts / pin levels / bus
// protocol timing); outputs measure what the sketch actually drives (PWM pulse
// width → servo angle, toggle rate → buzzer Hz, pin level → relay/RGB).
//
// Device kinds:
//   analog   — transfer fn → ADC channel        (analogRead)
//   digital  — transfer fn → input pin level     (digitalRead)
//   protocol — real bus model attached to the runner (HC-SR04 trig/echo, …)
//   output   — reads pins the Arduino drives, for actuator visualisation
//
// Adding a device = appending one entry. No engine/UI refactor needed; extends
// cleanly to ESP32/Pico (different ADC/pin maps) later.

import type { AVRRunner } from "./engine/execute";
import type { AVRIOPort } from "avr8js";
import { HCSR04Controller } from "./engine/hc-sr04";
import { DHT22Controller } from "./engine/dht22";
import { I2CBus } from "./engine/i2c-bus";
import { MPU6050Controller } from "./engine/mpu6050";
import { DS1307Controller } from "./engine/ds1307";
import { LCD1602Controller } from "./engine/lcd1602";
import { SSD1306Controller } from "./engine/ssd1306";
import { PulseWidthReader, FrequencyReader, DutyCycleReader } from "./engine/pin-readers";

export type SensorKind = "analog" | "digital" | "protocol" | "output" | "i2c";
export type PinClass = "analog" | "digital";
export type ControlKind = "slider" | "toggle";

export interface ControlSpec {
  key: string;
  label: string;
  kind: ControlKind;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default: number | boolean;
}

export interface PinSlot {
  key: string;
  label: string;
  pinClass: PinClass;
}

export interface SensorReading {
  adc?: number;
  digital?: boolean;
  display: string;
}

/** Live output device state (for actuator/display readouts). */
export interface OutputState {
  display: string;
  angle?: number;
  freq?: number;
  on?: boolean;
  color?: string;
  percent?: number;
  /** Text rows (LCD). */
  text?: string[];
  /** Value rows (MPU6050, RTC). */
  lines?: string[];
  /** Monochrome framebuffer (OLED). */
  pixels?: { data: Uint8Array; w: number; h: number };
}

export type SensorConfig = Record<string, number | boolean>;
export type Pins = Record<string, string>;

/** Context handed to a device when it attaches to a running MCU. */
export interface AttachContext {
  runner: AVRRunner;
  i2cBus: I2CBus;
  millis: () => number;
}

/** Handle returned when a protocol/output/i2c device attaches to a running MCU. */
export interface DeviceHandle {
  update?(cfg: SensorConfig): void;
  read?(): OutputState;
  detach?(): void;
}

export interface SensorInstance {
  instanceId: string;
  defId: string;
  pins: Pins;
  config: SensorConfig;
  /** When true, real browser sensors drive this device instead of the controls. */
  live?: boolean;
}

export interface SensorDef {
  id: string;
  name: string;
  category: string;
  kind: SensorKind;
  slots: PinSlot[];
  defaultPins: Pins;
  blurb: string;
  howItWorks: string;
  applications: string;
  commonMistakes: string;
  controls: ControlSpec[];
  /** Supports a real-input "Live" mode: mouse/touch motion, or device tilt/rotation. */
  liveInput?: "motion" | "orientation";
  example: (pins: Pins) => string;
  /** analog/digital inputs — physical transfer function. */
  compute?: (cfg: SensorConfig) => SensorReading;
  /** protocol/output/i2c devices — wire a real model to the running MCU. */
  attach?: (ctx: AttachContext, pins: Pins, cfg: SensorConfig) => DeviceHandle;
  /** stateless output read (relay/RGB) — no attach needed. */
  readStateless?: (runner: AVRRunner, pins: Pins, cfg: SensorConfig) => OutputState;
}

// ── Helpers ───────────────────────────────────────────────────────────

const VREF = 5.0;
const clampAdc = (v: number) => Math.max(0, Math.min(1023, Math.round(v)));
const voltToAdc = (v: number) => clampAdc((v / VREF) * 1023);
const num = (cfg: SensorConfig, k: string, d = 0) => (typeof cfg[k] === "number" ? (cfg[k] as number) : d);
const bool = (cfg: SensorConfig, k: string) => cfg[k] === true;

export function adcChannelOf(pin: string): number {
  const m = /^A(\d)$/.exec(pin);
  return m ? Number(m[1]) : -1;
}

export function portBitOf(pin: string): { port: "portB" | "portC" | "portD"; bit: number } | null {
  const n = Number(pin);
  if (!Number.isInteger(n)) return null;
  if (n >= 0 && n <= 7) return { port: "portD", bit: n };
  if (n >= 8 && n <= 13) return { port: "portB", bit: n - 8 };
  return null;
}

function resolve(runner: AVRRunner, pin: string): { port: AVRIOPort; bit: number; letter: "B" | "C" | "D" } | null {
  const pb = portBitOf(pin);
  if (!pb) return null;
  const letter = pb.port === "portB" ? "B" : pb.port === "portC" ? "C" : "D";
  return { port: runner[pb.port], bit: pb.bit, letter };
}

export const ANALOG_PINS = ["A0", "A1", "A2", "A3", "A4", "A5"];
export const DIGITAL_PINS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

const analogSlot: PinSlot[] = [{ key: "pin", label: "Signal", pinClass: "analog" }];
const digitalSlot: PinSlot[] = [{ key: "pin", label: "Signal", pinClass: "digital" }];

// ── Device registry ───────────────────────────────────────────────────

export const SENSORS: SensorDef[] = [
  // ===== ANALOG SENSORS (real transfer functions) =====
  {
    id: "ldr",
    name: "LDR (Photoresistor)",
    category: "Light",
    kind: "analog",
    slots: analogSlot,
    defaultPins: { pin: "A0" },
    blurb: "Resistance falls as light rises",
    howItWorks:
      "A CdS photoresistor drops resistance as light increases. In a divider with a fixed 10 kΩ (LDR→+5 V, 10 kΩ→GND), the junction voltage rises with light. R_ldr ≈ R₁₀·(10/lux)^0.7.",
    applications: "Night lights, backlight control, light-seeking robots.",
    commonMistakes: "Omitting the divider resistor; reading the wrong end so values invert.",
    controls: [{ key: "light", label: "Light intensity", kind: "slider", min: 0, max: 100, step: 1, unit: "%", default: 50 }],
    compute: (cfg) => {
      const pct = num(cfg, "light", 50);
      const lux = Math.max(1, (pct / 100) ** 2 * 2000);
      const rLdr = 12000 * Math.pow(10 / lux, 0.7);
      const v = VREF * (10000 / (10000 + rLdr));
      const adc = voltToAdc(v);
      return { adc, display: `${pct}% · ${Math.round(lux)} lux → ${v.toFixed(2)} V → ${adc}` };
    },
    example: (p) => `// LDR on ${p.pin}: more light -> higher reading
void setup(){ Serial.begin(115200); }
void loop(){
  int raw = analogRead(${p.pin});
  Serial.print("Light raw="); Serial.println(raw);
  delay(300);
}
`,
  },
  {
    id: "lm35",
    name: "LM35 Temperature",
    category: "Environmental",
    kind: "analog",
    slots: analogSlot,
    defaultPins: { pin: "A0" },
    blurb: "Linear 10 mV per °C",
    howItWorks: "Outputs 10 mV/°C, 0 V at 0 °C. °C = analogRead × 5 / 1023 / 0.01.",
    applications: "Thermostats, weather stations, fan controllers.",
    commonMistakes: "Treating raw counts as °C; 3.3 V code on a 5 V board.",
    controls: [{ key: "temp", label: "Temperature", kind: "slider", min: 0, max: 100, step: 0.5, unit: "°C", default: 25 }],
    compute: (cfg) => {
      const t = num(cfg, "temp", 25);
      const v = t * 0.01;
      const adc = voltToAdc(v);
      return { adc, display: `${t.toFixed(1)} °C → ${v.toFixed(3)} V → ${adc}` };
    },
    example: (p) => `// LM35 on ${p.pin}: 10mV per degree C
void setup(){ Serial.begin(115200); }
void loop(){
  float c = analogRead(${p.pin}) * 5.0 / 1023.0 / 0.01;
  Serial.print("Temp: "); Serial.print(c,1); Serial.println(" C");
  delay(500);
}
`,
  },
  {
    id: "pot",
    name: "Potentiometer",
    category: "Position",
    kind: "analog",
    slots: analogSlot,
    defaultPins: { pin: "A0" },
    blurb: "0–5 V wiper divider",
    howItWorks: "The wiper taps a fraction of the supply: 0 V → 5 V across the rotation → 0–1023 counts.",
    applications: "Knobs, calibration, servo angle, menus.",
    commonMistakes: "Floating end pin; wiper wired to power not the ADC pin.",
    controls: [{ key: "pos", label: "Wiper position", kind: "slider", min: 0, max: 100, step: 1, unit: "%", default: 50 }],
    compute: (cfg) => {
      const pct = num(cfg, "pos", 50);
      const adc = clampAdc((pct / 100) * 1023);
      return { adc, display: `${pct}% → ${((pct / 100) * VREF).toFixed(2)} V → ${adc}` };
    },
    example: (p) => `// Potentiometer on ${p.pin}
void setup(){ Serial.begin(115200); }
void loop(){ Serial.println(analogRead(${p.pin})); delay(200); }
`,
  },
  {
    id: "soil",
    name: "Soil Moisture",
    category: "Water",
    kind: "analog",
    slots: analogSlot,
    defaultPins: { pin: "A0" },
    blurb: "Dry → high, wet → low",
    howItWorks: "Water lowers soil resistance, dropping the divider output. Dry ≈ 1023, saturated ≈ 300.",
    applications: "Auto-watering, greenhouses, irrigation alarms.",
    commonMistakes: "Assuming higher = wetter (it's inverted); probe corrosion from DC.",
    controls: [{ key: "moisture", label: "Soil moisture", kind: "slider", min: 0, max: 100, step: 1, unit: "%", default: 40 }],
    compute: (cfg) => {
      const pct = num(cfg, "moisture", 40);
      const adc = clampAdc(1023 - (pct / 100) * (1023 - 300));
      const s = pct < 30 ? "DRY" : pct > 70 ? "WET" : "MOIST";
      return { adc, display: `${pct}% → ${adc} (${s})` };
    },
    example: (p) => `// Soil moisture on ${p.pin} (dry=high, wet=low)
void setup(){ Serial.begin(115200); }
void loop(){
  int raw = analogRead(${p.pin});
  Serial.println(raw > 800 ? "DRY - water me!" : "ok");
  delay(500);
}
`,
  },
  {
    id: "rain",
    name: "Rain Sensor",
    category: "Water",
    kind: "analog",
    slots: analogSlot,
    defaultPins: { pin: "A0" },
    blurb: "More water → lower counts",
    howItWorks: "Rain bridges interdigitated traces, lowering resistance. Dry ≈ 1023, soaked ≈ 200.",
    applications: "Rain detection, auto wipers, weather logging.",
    commonMistakes: "Confusing analog (AO) and digital (DO) outputs.",
    controls: [{ key: "wetness", label: "Rainfall / wetness", kind: "slider", min: 0, max: 100, step: 1, unit: "%", default: 0 }],
    compute: (cfg) => {
      const pct = num(cfg, "wetness", 0);
      const adc = clampAdc(1023 - (pct / 100) * (1023 - 200));
      return { adc, display: `${pct}% wet → ${adc} ${pct > 60 ? "(RAIN)" : ""}` };
    },
    example: (p) => `// Rain sensor on ${p.pin}
void setup(){ Serial.begin(115200); }
void loop(){ Serial.println(analogRead(${p.pin}) < 500 ? "WET" : "dry"); delay(400); }
`,
  },
  {
    id: "mq2",
    name: "MQ-2 Gas Sensor",
    category: "Gas",
    kind: "analog",
    slots: analogSlot,
    defaultPins: { pin: "A0" },
    blurb: "Higher gas → higher reading",
    howItWorks: "A heated SnO₂ element drops resistance as combustible gas rises; output ≈ log(ppm).",
    applications: "Smoke/LPG/CO alarms, leak detection.",
    commonMistakes: "Reading ppm without calibrating R₀; ignoring heater warm-up.",
    controls: [{ key: "ppm", label: "Gas concentration", kind: "slider", min: 200, max: 10000, step: 50, unit: "ppm", default: 400 }],
    compute: (cfg) => {
      const ppm = Math.max(200, num(cfg, "ppm", 400));
      const t = (Math.log10(ppm) - Math.log10(200)) / (Math.log10(10000) - Math.log10(200));
      const v = 0.5 + t * (4.4 - 0.5);
      const adc = voltToAdc(v);
      return { adc, display: `${ppm} ppm → ${v.toFixed(2)} V → ${adc} ${ppm > 2000 ? "(ALARM)" : ""}` };
    },
    example: (p) => `// MQ-2 gas on ${p.pin}
void setup(){ Serial.begin(115200); pinMode(13,OUTPUT); }
void loop(){
  int raw = analogRead(${p.pin});
  digitalWrite(13, raw > 600);
  Serial.print("Gas="); Serial.println(raw);
  delay(300);
}
`,
  },

  // ===== DIGITAL SENSORS =====
  {
    id: "pir",
    name: "PIR Motion Sensor",
    category: "Motion",
    kind: "digital",
    slots: digitalSlot,
    defaultPins: { pin: "2" },
    blurb: "HIGH while motion present",
    howItWorks: "Detects moving infrared (a warm body). Output goes HIGH on motion for a retrigger period.",
    applications: "Alarms, automatic lighting, occupancy.",
    commonMistakes: "Reading it as analog; skipping the 30–60 s warm-up.",
    controls: [{ key: "motion", label: "Motion detected", kind: "toggle", default: false }],
    liveInput: "motion",
    compute: (cfg) => {
      const m = bool(cfg, "motion");
      return { digital: m, display: m ? "MOTION → HIGH" : "idle → LOW" };
    },
    example: (p) => `// PIR on ${p.pin}
void setup(){ Serial.begin(115200); pinMode(${p.pin}, INPUT); pinMode(13,OUTPUT); }
void loop(){
  bool m = digitalRead(${p.pin});
  digitalWrite(13, m);
  if (m) Serial.println("Motion detected!");
  delay(150);
}
`,
  },
  {
    id: "touch",
    name: "TTP223 Touch",
    category: "Touch",
    kind: "digital",
    slots: digitalSlot,
    defaultPins: { pin: "4" },
    blurb: "HIGH while touched",
    howItWorks: "A capacitive IC senses a finger's added capacitance and drives its output HIGH.",
    applications: "Touch buttons, lamps, hidden switches.",
    commonMistakes: "Expecting a physical click; long wires causing false triggers.",
    controls: [{ key: "touched", label: "Touch pad", kind: "toggle", default: false }],
    compute: (cfg) => {
      const t = bool(cfg, "touched");
      return { digital: t, display: t ? "TOUCH → HIGH" : "released → LOW" };
    },
    example: (p) => `// TTP223 touch on ${p.pin}
void setup(){ Serial.begin(115200); pinMode(${p.pin}, INPUT); pinMode(13,OUTPUT); }
void loop(){ digitalWrite(13, digitalRead(${p.pin})); delay(100); }
`,
  },
  {
    id: "reed",
    name: "Reed Switch / Hall",
    category: "Magnetic",
    kind: "digital",
    slots: digitalSlot,
    defaultPins: { pin: "3" },
    blurb: "Closes (LOW) near a magnet",
    howItWorks: "Contacts close in a magnetic field. With INPUT_PULLUP the pin reads HIGH normally, LOW near a magnet.",
    applications: "Door/window sensors, RPM counters.",
    commonMistakes: "No pull-up (floating input); exceeding contact current.",
    controls: [{ key: "magnet", label: "Magnet near", kind: "toggle", default: false }],
    compute: (cfg) => {
      const near = bool(cfg, "magnet");
      return { digital: !near, display: near ? "magnet → CLOSED (LOW)" : "open (HIGH)" };
    },
    example: (p) => `// Reed on ${p.pin} with pull-up (LOW = magnet)
void setup(){ Serial.begin(115200); pinMode(${p.pin}, INPUT_PULLUP); }
void loop(){ Serial.println(digitalRead(${p.pin}) == LOW ? "closed" : "open"); delay(200); }
`,
  },

  // ===== PROTOCOL SENSOR =====
  {
    id: "hcsr04",
    name: "HC-SR04 Ultrasonic",
    category: "Distance",
    kind: "protocol",
    slots: [
      { key: "trig", label: "Trig", pinClass: "digital" },
      { key: "echo", label: "Echo", pinClass: "digital" },
    ],
    defaultPins: { trig: "9", echo: "10" },
    blurb: "Echo pulse = distance × 58 µs",
    howItWorks:
      "A 10 µs TRIG pulse fires an ultrasonic burst; ECHO stays HIGH for the round-trip time. Distance(cm) = pulse(µs) / 58. The model reproduces the real ECHO timing cycle-accurately, so pulseIn() behaves exactly as on hardware.",
    applications: "Obstacle avoidance, parking sensors, level measurement.",
    commonMistakes: "Forgetting the pulseIn timeout; swapping TRIG/ECHO; reading distance with no settle delay.",
    controls: [{ key: "distance", label: "Object distance", kind: "slider", min: 2, max: 400, step: 1, unit: "cm", default: 100 }],
    attach: (ctx, pins, cfg) => {
      const runner = ctx.runner;
      const t = resolve(runner, pins.trig);
      const e = resolve(runner, pins.echo);
      if (!t || !e) return {};
      const ctrl = new HCSR04Controller(runner.cpu, t.port, t.bit, e.port, e.bit, runner.frequency);
      ctrl.distance = num(cfg, "distance", 100);
      return { update: (c) => (ctrl.distance = num(c, "distance", 100)) };
    },
    example: (p) => `// HC-SR04: TRIG=${p.trig}, ECHO=${p.echo}
#define TRIG ${p.trig}
#define ECHO ${p.echo}
void setup(){ Serial.begin(115200); pinMode(TRIG,OUTPUT); pinMode(ECHO,INPUT); }
void loop(){
  digitalWrite(TRIG,LOW); delayMicroseconds(2);
  digitalWrite(TRIG,HIGH); delayMicroseconds(10); digitalWrite(TRIG,LOW);
  long us = pulseIn(ECHO, HIGH, 30000);
  long cm = us / 58;
  Serial.print("Distance: "); Serial.print(cm); Serial.println(" cm");
  delay(200);
}
`,
  },

  // ===== OUTPUT ACTUATORS =====
  {
    id: "servo",
    name: "Servo Motor",
    category: "Actuator",
    kind: "output",
    slots: [{ key: "pin", label: "Signal", pinClass: "digital" }],
    defaultPins: { pin: "9" },
    blurb: "PWM pulse width → shaft angle",
    howItWorks: "A 50 Hz PWM pulse (≈544–2400 µs) sets the shaft angle 0–180°. The model measures the real pulse the Servo library generates → angle.",
    applications: "Robot arms, pan/tilt, RC steering, locks.",
    commonMistakes: "Powering the servo from the 5 V pin under load; blocking delays starving the pulse train.",
    controls: [],
    attach: (ctx, pins) => {
      const runner = ctx.runner;
      const r = resolve(runner, pins.pin);
      if (!r) return {};
      const reader = new PulseWidthReader(runner.cpu, r.port, r.bit, runner.frequency);
      return {
        read: () => {
          const us = reader.lastUs;
          if (us < 100) return { display: "no signal", angle: 0 };
          const angle = Math.max(0, Math.min(180, Math.round(((us - 544) / (2400 - 544)) * 180)));
          return { angle, display: `${angle}° (${Math.round(us)} µs)` };
        },
      };
    },
    example: (p) => `// Servo on ${p.pin}: sweep 0..180
#include <Servo.h>
Servo myservo;
void setup(){ myservo.attach(${p.pin}); }
void loop(){
  for (int a = 0; a <= 180; a += 5) { myservo.write(a); delay(40); }
  for (int a = 180; a >= 0; a -= 5) { myservo.write(a); delay(40); }
}
`,
  },
  {
    id: "buzzer",
    name: "Piezo Buzzer",
    category: "Actuator",
    kind: "output",
    slots: [{ key: "pin", label: "Signal", pinClass: "digital" }],
    defaultPins: { pin: "8" },
    blurb: "tone() frequency → pitch",
    howItWorks: "tone() toggles the pin at the note frequency; the piezo vibrates at that rate. The model measures the toggle rate → Hz.",
    applications: "Alarms, melodies, UI feedback, Morse code.",
    commonMistakes: "Expecting tone() on every pin while another tone is active; passive vs active buzzer mix-ups.",
    controls: [],
    attach: (ctx, pins) => {
      const runner = ctx.runner;
      const r = resolve(runner, pins.pin);
      if (!r) return {};
      const reader = new FrequencyReader(runner.cpu, r.port, r.bit, runner.frequency);
      return {
        read: () => {
          const hz = reader.currentHz(runner.cpu.cycles);
          return { freq: hz, display: hz > 0 ? `${Math.round(hz)} Hz ♪` : "silent" };
        },
      };
    },
    example: (p) => `// Buzzer on ${p.pin}: play a few notes
void setup(){}
void loop(){
  tone(${p.pin}, 262); delay(300);   // C
  tone(${p.pin}, 330); delay(300);   // E
  tone(${p.pin}, 392); delay(300);   // G
  noTone(${p.pin});    delay(500);
}
`,
  },
  {
    id: "relay",
    name: "Relay Module",
    category: "Actuator",
    kind: "output",
    slots: [{ key: "pin", label: "IN", pinClass: "digital" }],
    defaultPins: { pin: "7" },
    blurb: "Digital pin → switch mains load",
    howItWorks: "A small coil current (via a transistor) closes high-power contacts. The pin level directly sets the relay state.",
    applications: "Switching lamps, pumps, fans, appliances.",
    commonMistakes: "Driving the coil straight from a pin (needs a transistor + flyback diode); active-LOW vs active-HIGH modules.",
    controls: [],
    readStateless: (runner, pins) => {
      const r = resolve(runner, pins.pin);
      if (!r) return { display: "—" };
      const on = (runner.getPortOutputValue(r.letter) & (1 << r.bit)) !== 0;
      return { on, display: on ? "ON · contacts closed" : "OFF · contacts open" };
    },
    example: (p) => `// Relay on ${p.pin}: click on/off every second
void setup(){ pinMode(${p.pin}, OUTPUT); }
void loop(){
  digitalWrite(${p.pin}, HIGH); delay(1000);
  digitalWrite(${p.pin}, LOW);  delay(1000);
}
`,
  },
  {
    id: "rgb",
    name: "RGB LED",
    category: "Actuator",
    kind: "output",
    slots: [
      { key: "r", label: "R", pinClass: "digital" },
      { key: "g", label: "G", pinClass: "digital" },
      { key: "b", label: "B", pinClass: "digital" },
    ],
    defaultPins: { r: "9", g: "10", b: "11" },
    blurb: "Three pins → mixed colour",
    howItWorks: "Red, green and blue elements share a common pin; driving each channel HIGH/LOW mixes 8 base colours (PWM gives full colour).",
    applications: "Status indicators, mood lighting, colour feedback.",
    commonMistakes: "Wrong common-anode vs common-cathode polarity; missing per-channel resistors.",
    controls: [],
    readStateless: (runner, pins) => {
      const ch = (slot: string) => {
        const r = resolve(runner, pins[slot]);
        return r ? (runner.getPortOutputValue(r.letter) & (1 << r.bit)) !== 0 : false;
      };
      const r = ch("r");
      const g = ch("g");
      const b = ch("b");
      return { color: `rgb(${r ? 255 : 35},${g ? 255 : 35},${b ? 255 : 35})`, display: `R${r ? 1 : 0} G${g ? 1 : 0} B${b ? 1 : 0}` };
    },
    example: (p) => `// RGB LED: R=${p.r} G=${p.g} B=${p.b}
int pins[3] = {${p.r}, ${p.g}, ${p.b}};
void setup(){ for (int i=0;i<3;i++) pinMode(pins[i], OUTPUT); }
void loop(){
  for (int i=0;i<3;i++){
    for (int j=0;j<3;j++) digitalWrite(pins[j], i==j);
    delay(500);
  }
}
`,
  },
  {
    id: "dcmotor",
    name: "DC Motor (driver)",
    category: "Actuator",
    kind: "output",
    slots: [
      { key: "pwm", label: "ENA (PWM)", pinClass: "digital" },
      { key: "dir", label: "IN1 (dir)", pinClass: "digital" },
    ],
    defaultPins: { pwm: "9", dir: "7" },
    blurb: "analogWrite duty → speed; dir pin → direction",
    howItWorks: "Through an H-bridge (L298N), a PWM signal on the enable pin sets average voltage → speed; the direction pins set rotation. The model measures the real PWM duty the sketch generates.",
    applications: "Robot wheels, fans, conveyors, pumps.",
    commonMistakes: "Driving a motor straight from a pin (needs a driver); no flyback protection; shared ground missing.",
    controls: [],
    attach: (ctx, pins) => {
      const runner = ctx.runner;
      const pwm = resolve(runner, pins.pwm);
      const dir = resolve(runner, pins.dir);
      if (!pwm) return {};
      const reader = new DutyCycleReader(runner.cpu, pwm.port, pwm.bit);
      return {
        read: () => {
          const speed = Math.round(reader.duty() * 100);
          const fwd = dir ? (runner.getPortOutputValue(dir.letter) & (1 << dir.bit)) !== 0 : true;
          return { percent: speed, on: speed > 2, display: speed > 2 ? `${speed}% · ${fwd ? "▶ FWD" : "◀ REV"}` : "stopped" };
        },
      };
    },
    example: (p) => `// DC motor via H-bridge: ENA=${p.pwm} (PWM), IN1=${p.dir}
void setup(){ pinMode(${p.pwm}, OUTPUT); pinMode(${p.dir}, OUTPUT); }
void loop(){
  digitalWrite(${p.dir}, HIGH);          // forward
  for (int s=0; s<=255; s+=5){ analogWrite(${p.pwm}, s); delay(40); }
  for (int s=255; s>=0; s-=5){ analogWrite(${p.pwm}, s); delay(40); }
}
`,
  },
  {
    id: "dht22",
    name: "DHT22 Temp/Humidity",
    category: "Environmental",
    kind: "protocol",
    slots: [{ key: "pin", label: "Data", pinClass: "digital" }],
    defaultPins: { pin: "2" },
    blurb: "Single-wire digital temp + humidity",
    howItWorks:
      "After a start pulse, the DHT22 replies with a timing-encoded 40-bit frame (humidity ×10, temperature ×10, checksum). The model reproduces that one-wire timing exactly, so the DHT library decodes the values you set.",
    applications: "Weather stations, HVAC, greenhouses, data logging.",
    commonMistakes: "Polling faster than every 2 s; missing pull-up on the data line; confusing DHT11 (integer) with DHT22 (decimal).",
    controls: [
      { key: "temp", label: "Temperature", kind: "slider", min: -10, max: 50, step: 0.5, unit: "°C", default: 22.5 },
      { key: "humidity", label: "Humidity", kind: "slider", min: 0, max: 100, step: 1, unit: "%", default: 60 },
    ],
    attach: (ctx, pins, cfg) => {
      const runner = ctx.runner;
      const p = resolve(runner, pins.pin);
      if (!p) return {};
      const ctrl = new DHT22Controller(runner.cpu, p.port, p.bit, runner.frequency);
      const apply = (c: SensorConfig) => {
        ctrl.temperature = num(c, "temp", 22.5);
        ctrl.humidity = num(c, "humidity", 60);
      };
      apply(cfg);
      return { update: apply };
    },
    example: (p) => `// DHT22 on ${p.pin}
#include <DHT.h>
DHT dht(${p.pin}, DHT22);
void setup(){ Serial.begin(115200); dht.begin(); }
void loop(){
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  Serial.print("Temp: "); Serial.print(t,1);
  Serial.print(" C  Humidity: "); Serial.print(h,1); Serial.println(" %");
  delay(2000);
}
`,
  },
  {
    id: "mpu6050",
    name: "MPU-6050 (I²C)",
    category: "Motion",
    kind: "i2c",
    slots: [],
    defaultPins: {},
    blurb: "6-axis accel + gyro on I²C (A4/A5)",
    howItWorks:
      "A 3-axis accelerometer + gyroscope. The Arduino reads registers over I²C (SDA=A4, SCL=A5). The model answers register reads with the orientation you set — drive it with raw Wire.h (no library needed).",
    applications: "Tilt sensing, drones/quadcopters, gesture control, balancing robots.",
    commonMistakes: "Forgetting to wake it (write 0 to PWR_MGMT_1 0x6B); wrong I²C address (0x68/0x69); not scaling raw counts to g/°/s.",
    liveInput: "orientation",
    controls: [
      { key: "ax", label: "Accel X", kind: "slider", min: -2, max: 2, step: 0.05, unit: "g", default: 0 },
      { key: "ay", label: "Accel Y", kind: "slider", min: -2, max: 2, step: 0.05, unit: "g", default: 0 },
      { key: "az", label: "Accel Z", kind: "slider", min: -2, max: 2, step: 0.05, unit: "g", default: 1 },
      { key: "gx", label: "Gyro X", kind: "slider", min: -250, max: 250, step: 5, unit: "°/s", default: 0 },
      { key: "gy", label: "Gyro Y", kind: "slider", min: -250, max: 250, step: 5, unit: "°/s", default: 0 },
      { key: "gz", label: "Gyro Z", kind: "slider", min: -250, max: 250, step: 5, unit: "°/s", default: 0 },
    ],
    attach: (ctx, _pins, cfg) => {
      const dev = new MPU6050Controller(ctx.millis);
      ctx.i2cBus.registerDevice(0x68, dev);
      const apply = (c: SensorConfig) => {
        dev.setAccel("x", num(c, "ax", 0));
        dev.setAccel("y", num(c, "ay", 0));
        dev.setAccel("z", num(c, "az", 1));
        dev.setGyro("x", num(c, "gx", 0));
        dev.setGyro("y", num(c, "gy", 0));
        dev.setGyro("z", num(c, "gz", 0));
      };
      apply(cfg);
      return {
        update: apply,
        read: () => ({
          display: `a ${dev.getAccel("x").toFixed(2)},${dev.getAccel("y").toFixed(2)},${dev.getAccel("z").toFixed(2)}g`,
          lines: [
            `accel  ${dev.getAccel("x").toFixed(2)}, ${dev.getAccel("y").toFixed(2)}, ${dev.getAccel("z").toFixed(2)} g`,
            `gyro   ${dev.getGyro("x").toFixed(0)}, ${dev.getGyro("y").toFixed(0)}, ${dev.getGyro("z").toFixed(0)} °/s`,
          ],
        }),
      };
    },
    example: () => `// MPU-6050 over raw Wire.h (SDA=A4, SCL=A5) — accel + gyro, no library
#include <Wire.h>
const int MPU = 0x68;
void setup(){
  Serial.begin(115200); Wire.begin();
  Wire.beginTransmission(MPU); Wire.write(0x6B); Wire.write(0); Wire.endTransmission(); // wake
}
void loop(){
  Wire.beginTransmission(MPU); Wire.write(0x3B); Wire.endTransmission(false);
  Wire.requestFrom(MPU, 14, true);              // accel(6) + temp(2) + gyro(6)
  int16_t ax = Wire.read()<<8 | Wire.read();
  int16_t ay = Wire.read()<<8 | Wire.read();
  int16_t az = Wire.read()<<8 | Wire.read();
  Wire.read(); Wire.read();                      // skip temperature
  int16_t gx = Wire.read()<<8 | Wire.read();
  int16_t gy = Wire.read()<<8 | Wire.read();
  int16_t gz = Wire.read()<<8 | Wire.read();
  Serial.print("accel "); Serial.print(ax/16384.0,2); Serial.print(","); Serial.print(ay/16384.0,2); Serial.print(","); Serial.print(az/16384.0,2);
  Serial.print("  gyro "); Serial.print(gx/131.0,1); Serial.print(","); Serial.print(gy/131.0,1); Serial.print(","); Serial.println(gz/131.0,1);
  delay(300);
}
`,
  },
  {
    id: "ds1307",
    name: "DS1307 RTC (I²C)",
    category: "Time",
    kind: "i2c",
    slots: [],
    defaultPins: {},
    blurb: "Real-time clock on I²C (A4/A5)",
    howItWorks: "A battery-backed real-time clock. Registers 0x00–0x06 hold seconds…year in BCD. The model returns the live system time, so RTClib reads the real wall-clock.",
    applications: "Clocks, data-logger timestamps, alarms, schedulers.",
    commonMistakes: "Leaving the clock-halt bit set; reading BCD as decimal; missing the backup battery on real hardware.",
    controls: [],
    attach: (ctx) => {
      ctx.i2cBus.registerDevice(0x68, new DS1307Controller());
      return { read: () => ({ display: new Date().toLocaleTimeString(), lines: [new Date().toLocaleString()] }) };
    },
    example: () => `// DS1307 RTC with RTClib (SDA=A4, SCL=A5)
#include <Wire.h>
#include <RTClib.h>
RTC_DS1307 rtc;
void setup(){
  Serial.begin(115200); Wire.begin(); rtc.begin();
}
void loop(){
  DateTime now = rtc.now();
  Serial.print(now.hour()); Serial.print(':');
  Serial.print(now.minute()); Serial.print(':');
  Serial.println(now.second());
  delay(1000);
}
`,
  },
  {
    id: "lcd1602",
    name: "LCD 16×2 (I²C)",
    category: "Display",
    kind: "i2c",
    slots: [],
    defaultPins: {},
    blurb: "16×2 character display on I²C (A4/A5)",
    howItWorks: "An HD44780 display behind a PCF8574 I²C backpack (addr 0x27). The model decodes the 4-bit command/data stream into a 16×2 character buffer, shown live below.",
    applications: "Menus, readouts, status text, simple UIs.",
    commonMistakes: "Wrong I²C address (0x27 vs 0x3F); forgetting lcd.init()/backlight; nibble-order mistakes.",
    controls: [],
    attach: (ctx) => {
      const dev = new LCD1602Controller(ctx.millis);
      ctx.i2cBus.registerDevice(0x27, dev);
      const decode = (b: number) => (b < 32 || b > 126 ? " " : String.fromCharCode(b));
      return {
        read: () => {
          const chars = dev.render().characters;
          const row1 = Array.from(chars.slice(0, 16)).map(decode).join("");
          const row2 = Array.from(chars.slice(16, 32)).map(decode).join("");
          return { display: "LCD 16×2", text: [row1, row2] };
        },
      };
    },
    example: () => `// LCD 16x2 I2C (addr 0x27, SDA=A4, SCL=A5)
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);
void setup(){
  lcd.init(); lcd.backlight();
  lcd.setCursor(0,0); lcd.print("APEX Playground");
  lcd.setCursor(0,1); lcd.print("LCD works!");
}
void loop(){}
`,
  },
  {
    id: "oled",
    name: "OLED 128×64 (I²C)",
    category: "Display",
    kind: "i2c",
    slots: [],
    defaultPins: {},
    blurb: "SSD1306 graphic display on I²C (A4/A5)",
    howItWorks: "A 128×64 monochrome SSD1306 OLED. The model decodes the command/GDDRAM stream into a real framebuffer, rendered live below pixel-for-pixel.",
    applications: "Graphics, sensor dashboards, menus, games, logos.",
    commonMistakes: "Wrong address (0x3C vs 0x3D); forgetting display.display(); buffer/rotation mismatches.",
    controls: [],
    attach: (ctx) => {
      const dev = new SSD1306Controller(ctx.millis);
      ctx.i2cBus.registerDevice(0x3c, dev);
      return { read: () => ({ display: "OLED 128×64", pixels: { data: dev.pixels, w: dev.width, h: dev.height } }) };
    },
    example: () => `// SSD1306 OLED with raw Wire.h (addr 0x3C) — draws a filled box
#include <Wire.h>
const int OLED = 0x3C;
void cmd(uint8_t c){ Wire.beginTransmission(OLED); Wire.write(0x00); Wire.write(c); Wire.endTransmission(); }
void setup(){
  Wire.begin();
  uint8_t init[] = {0xAE,0x20,0x00,0xA1,0xC8,0x81,0x7F,0xA6,0xAF};
  for (uint8_t c : init) cmd(c);
  cmd(0x21); cmd(0); cmd(127);   // column range
  cmd(0x22); cmd(0); cmd(7);     // page range
  for (int i=0;i<1024;i++){ Wire.beginTransmission(OLED); Wire.write(0x40); Wire.write(0xFF); Wire.endTransmission(); }
}
void loop(){}
`,
  },
];

export const SENSOR_MAP: Record<string, SensorDef> = Object.fromEntries(SENSORS.map((s) => [s.id, s]));
export const SENSOR_CATEGORIES = Array.from(new Set(SENSORS.map((s) => s.category)));

export function defaultConfig(def: SensorDef): SensorConfig {
  const cfg: SensorConfig = {};
  for (const c of def.controls) cfg[c.key] = c.default;
  return cfg;
}

export function pinsFor(pin: string, pinClass: PinClass): string[] {
  return pinClass === "analog" ? ANALOG_PINS : DIGITAL_PINS;
}
