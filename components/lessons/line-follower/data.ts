// Shared data for the Line Follower lesson

export interface PinDef {
  name: string;
  role: string;
  color: string;
}

export interface ComponentDef {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  color: string;
  pins: PinDef[];
  principle: string;
  specs: [string, string][];
  cost: string;
  advantages: string[];
  alternatives: string[];
  applications: string[];
}

export const COMPONENTS: ComponentDef[] = [
  {
    id: "esp32",
    name: "ESP32 DevKit",
    emoji: "🧠",
    tagline: "Dual-core Wi-Fi microcontroller — the robot's brain",
    color: "#22D3EE",
    pins: [
      { name: "3V3", role: "3.3V power output", color: "#EF4444" },
      { name: "GND", role: "Ground reference", color: "#94A3B8" },
      { name: "GPIO34", role: "Left IR sensor input", color: "#22D3EE" },
      { name: "GPIO35", role: "Right IR sensor input", color: "#22D3EE" },
      { name: "GPIO25/26", role: "Motor A direction (IN1/IN2)", color: "#F59E0B" },
      { name: "GPIO27/14", role: "Motor B direction (IN3/IN4)", color: "#F59E0B" },
      { name: "GPIO32/33", role: "PWM speed (ENA/ENB)", color: "#A78BFA" },
      { name: "VIN", role: "5V input from regulator", color: "#EF4444" },
    ],
    principle:
      "The ESP32 runs your control loop thousands of times per second: it reads the IR sensors on its GPIO pins, decides which way to steer, and outputs PWM signals to the motor driver. Its 240 MHz dual-core CPU is massively overpowered for line following — which means room to grow into Wi-Fi telemetry, PID tuning dashboards, and camera upgrades.",
    specs: [
      ["CPU", "Xtensa LX6 dual-core @ 240 MHz"],
      ["RAM / Flash", "520 KB SRAM / 4 MB flash"],
      ["GPIO", "34 pins, 3.3V logic"],
      ["PWM channels", "16 (LEDC peripheral)"],
      ["ADC", "18 channels, 12-bit"],
      ["Connectivity", "Wi-Fi 802.11 b/g/n + Bluetooth 4.2"],
      ["Operating voltage", "3.3V (5V via VIN regulator)"],
    ],
    cost: "₹350–450",
    advantages: ["Wi-Fi + Bluetooth built in", "Very fast dual-core CPU", "16 hardware PWM channels", "Cheap for the power"],
    alternatives: ["Arduino Uno (simpler, 5V logic)", "Arduino Nano (smaller Uno)", "Raspberry Pi Pico (RP2040)", "STM32 Blue Pill"],
    applications: ["IoT sensor nodes", "Robot controllers", "Smart home devices", "Wearables telemetry"],
  },
  {
    id: "arduino",
    name: "Arduino Uno",
    emoji: "🎛️",
    tagline: "The classic beginner-friendly 8-bit microcontroller",
    color: "#0EA5E9",
    pins: [
      { name: "5V", role: "5V power output", color: "#EF4444" },
      { name: "GND", role: "Ground reference", color: "#94A3B8" },
      { name: "A0", role: "Left IR sensor (analog)", color: "#22D3EE" },
      { name: "A1", role: "Right IR sensor (analog)", color: "#22D3EE" },
      { name: "D2–D5", role: "Motor direction IN1–IN4", color: "#F59E0B" },
      { name: "D9 / D10", role: "PWM speed ENA/ENB (~)", color: "#A78BFA" },
      { name: "VIN", role: "7–12V battery input", color: "#EF4444" },
    ],
    principle:
      "The Uno's ATmega328P reads sensor voltages with its 10-bit ADC and drives the motor driver with PWM from pins marked '~'. It runs at 16 MHz — thousands of times slower than an ESP32, yet still fast enough to make hundreds of steering corrections every second. Its 5V logic makes it extremely forgiving for beginners.",
    specs: [
      ["MCU", "ATmega328P, 8-bit @ 16 MHz"],
      ["RAM / Flash", "2 KB SRAM / 32 KB flash"],
      ["Digital I/O", "14 pins (6 PWM)"],
      ["Analog inputs", "6 channels, 10-bit ADC"],
      ["Logic level", "5V"],
      ["USB", "Type-B, built-in programmer"],
    ],
    cost: "₹400–800",
    advantages: ["Huge community & tutorials", "5V logic — hard to damage", "Plug-and-play USB programming", "Shield ecosystem"],
    alternatives: ["ESP32 (faster + wireless)", "Arduino Nano (breadboard-friendly)", "ATtiny85 (minimal builds)"],
    applications: ["Education & prototyping", "Simple robots", "Home automation", "Art installations"],
  },
  {
    id: "l298n",
    name: "L298N Motor Driver",
    emoji: "⚡",
    tagline: "Dual H-bridge — muscle between brain and motors",
    color: "#EF4444",
    pins: [
      { name: "12V", role: "Battery positive input", color: "#EF4444" },
      { name: "GND", role: "Common ground", color: "#94A3B8" },
      { name: "5V", role: "5V regulator out (jumper on)", color: "#F97316" },
      { name: "IN1 / IN2", role: "Motor A direction logic", color: "#F59E0B" },
      { name: "IN3 / IN4", role: "Motor B direction logic", color: "#F59E0B" },
      { name: "ENA / ENB", role: "PWM speed enable", color: "#A78BFA" },
      { name: "OUT1–OUT4", role: "Motor terminals", color: "#22D3EE" },
    ],
    principle:
      "A microcontroller pin can only supply ~40 mA — a motor wants hundreds. The L298N contains two H-bridges: four electronic switches per motor arranged like an 'H'. Closing diagonal pairs sends current through the motor in either direction, so IN1=HIGH, IN2=LOW spins forward and reversed logic spins backward. PWM on the EN pin chops the power thousands of times per second to control speed.",
    specs: [
      ["Channels", "2 (dual H-bridge)"],
      ["Motor voltage", "5–35V"],
      ["Peak current", "2A per channel"],
      ["Logic voltage", "5V (onboard regulator)"],
      ["Voltage drop", "~1.4–2.5V (Darlington loss)"],
      ["Protection", "Onboard flyback diodes"],
    ],
    cost: "₹120–180",
    advantages: ["Cheap and rugged", "Drives 2 motors independently", "Built-in 5V regulator", "Handles up to 35V"],
    alternatives: ["TB6612FNG (efficient MOSFET)", "DRV8833 (3.3V friendly)", "L293D (lighter loads)"],
    applications: ["Line followers", "RC cars", "Conveyor drives", "CNC hobby axes"],
  },
  {
    id: "ir",
    name: "IR Sensor Module",
    emoji: "👁️",
    tagline: "The robot's eyes — sees black vs white",
    color: "#A78BFA",
    pins: [
      { name: "VCC", role: "3.3–5V power", color: "#EF4444" },
      { name: "GND", role: "Ground", color: "#94A3B8" },
      { name: "OUT", role: "Digital HIGH/LOW output", color: "#22D3EE" },
    ],
    principle:
      "An IR LED shines invisible infrared light at the floor. A white surface reflects most of it back into the photodiode next door; a black line absorbs it. The onboard LM393 comparator compares the photodiode voltage against a threshold you set with the potentiometer, and snaps OUT to LOW (line detected) or HIGH (floor). Digital certainty from an analog world.",
    specs: [
      ["Sensing range", "2–30 mm (adjustable)"],
      ["Output", "Digital (LM393 comparator)"],
      ["Supply", "3.3–5V"],
      ["Emitter wavelength", "~940 nm infrared"],
      ["Adjustment", "Onboard trim potentiometer"],
    ],
    cost: "₹40–60 each",
    advantages: ["Dirt cheap", "Simple digital output", "Adjustable sensitivity", "Fast response (<1 ms)"],
    alternatives: ["TCRT5000 (compact reflective)", "QTR-8A array (8 sensors, analog)", "Camera + OpenCV (advanced)"],
    applications: ["Line following", "Edge detection on tables", "Object counting", "Proximity switches"],
  },
  {
    id: "bo-motor",
    name: "BO Motors (×2)",
    emoji: "🔄",
    tagline: "Geared DC motors — the robot's legs",
    color: "#F59E0B",
    pins: [
      { name: "M+", role: "Motor terminal (to OUT1/OUT3)", color: "#EF4444" },
      { name: "M−", role: "Motor terminal (to OUT2/OUT4)", color: "#94A3B8" },
    ],
    principle:
      "A DC motor spins fast but weak — 12,000 RPM with almost no torque. The yellow BO (Battery Operated) motor packs a plastic gearbox that trades speed for torque: roughly 48:1 reduction gives ~200 RPM with enough force to move a robot. Reverse the current, reverse the spin. Two motors driven at different speeds is how the robot steers — no steering wheel needed (differential drive).",
    specs: [
      ["Voltage", "3–9V (6V nominal)"],
      ["Speed", "~200 RPM @ 6V"],
      ["Torque", "~0.5 kg·cm"],
      ["Gear ratio", "~48:1"],
      ["Current", "100–250 mA loaded"],
      ["Shaft", "Double-sided dual flat"],
    ],
    cost: "₹60–90 each",
    advantages: ["Very cheap", "Built-in gearbox", "Light weight (30 g)", "Fits standard wheels"],
    alternatives: ["N20 micro gear motor (compact)", "Motors with encoders (feedback)", "Continuous-rotation servos"],
    applications: ["Hobby robots", "Toy cars", "Small conveyor rigs", "STEM kits"],
  },
  {
    id: "chassis",
    name: "Robot Chassis",
    emoji: "🛹",
    tagline: "Acrylic skeleton that holds everything together",
    color: "#10B981",
    pins: [],
    principle:
      "The chassis is your robot's mechanical frame. Sensor position matters more than you'd think: mounting the IR sensors ahead of the wheels gives the controller 'preview' of the line — like looking ahead while driving instead of at your feet. Keep the battery (the heaviest part) low and centered over the drive wheels for traction.",
    specs: [
      ["Material", "3 mm acrylic / ABS"],
      ["Size", "~20 × 15 cm typical"],
      ["Layers", "1–2 deck"],
      ["Mounting", "Pre-cut slots for BO motors"],
      ["Weight", "~100 g"],
    ],
    cost: "₹150–250 (kit)",
    advantages: ["Pre-drilled holes", "Light and rigid", "Cheap to replace", "Kit includes hardware"],
    alternatives: ["3D-printed frame", "Laser-cut plywood/MDF", "Cardboard prototype (works!)"],
    applications: ["All wheeled robots", "Sensor platforms", "Competition bots"],
  },
  {
    id: "wheels",
    name: "Wheels (×2)",
    emoji: "🛞",
    tagline: "Rubber-tyred drive wheels",
    color: "#0EA5E9",
    pins: [],
    principle:
      "Wheel diameter is a gear ratio in disguise: bigger wheels mean more speed but less pushing force, smaller wheels the opposite. The rubber tyre provides grip — if wheels slip, the robot's motion no longer matches what the controller commanded, and the line is lost. 65 mm BO wheels are the sweet spot for classroom robots.",
    specs: [
      ["Diameter", "65 mm"],
      ["Width", "27 mm"],
      ["Bore", "Fits BO dual-flat shaft"],
      ["Tyre", "Soft rubber, treaded"],
    ],
    cost: "₹40–60 each",
    advantages: ["Push-fit, no tools", "Good grip on paper tracks", "Standard size"],
    alternatives: ["Smaller 42 mm (more torque)", "Mecanum wheels (omnidirectional)", "Tracks (rough ground)"],
    applications: ["Drive wheels for hobby robots"],
  },
  {
    id: "caster",
    name: "Caster Wheel",
    emoji: "⚪",
    tagline: "Free-spinning third contact point",
    color: "#94A3B8",
    pins: [],
    principle:
      "Two drive wheels alone would tip over. A caster — a metal ball or swivel wheel — is the third contact point that completes the tripod. Because it swivels freely in any direction, it never fights the differential steering: the robot can spin on the spot around its wheel axis.",
    specs: [
      ["Type", "Ball caster / swivel"],
      ["Height", "~25 mm (match wheel radius!)"],
      ["Load", "Up to 5 kg"],
    ],
    cost: "₹30–50",
    advantages: ["Zero steering resistance", "No power needed", "Keeps chassis level"],
    alternatives: ["Ball caster (smoothest)", "Swivel office-chair style", "Teflon skid (competition, lightest)"],
    applications: ["Any differential-drive robot"],
  },
  {
    id: "battery",
    name: "Battery Pack",
    emoji: "🔋",
    tagline: "Portable power plant — 18650 Li-ion or AA pack",
    color: "#10B981",
    pins: [
      { name: "+", role: "Positive → switch → L298N 12V", color: "#EF4444" },
      { name: "−", role: "Negative → common GND", color: "#94A3B8" },
    ],
    principle:
      "Two 18650 Li-ion cells in series give 7.4V nominal — enough for the L298N to feed ~5.5V to the motors after its internal drop, with the driver's onboard regulator making clean 5V for the controller. Golden rule: all grounds must connect. Voltage is measured between two points, so every part of the circuit must share the same reference.",
    specs: [
      ["Chemistry", "Li-ion 18650 ×2 (7.4V)"],
      ["Capacity", "2000–3400 mAh"],
      ["Runtime", "~1–2 h driving"],
      ["Alternative", "6×AA pack (9V)"],
      ["Protection", "Use protected cells/BMS"],
    ],
    cost: "₹250–400 (with holder)",
    advantages: ["Rechargeable", "High energy density", "Stable voltage under load"],
    alternatives: ["6×AA holder (safest for kids)", "9V PP3 (NOT recommended — weak)", "2S LiPo (advanced, more current)"],
    applications: ["All mobile robots", "Portable electronics"],
  },
  {
    id: "jumpers",
    name: "Jumper Wires",
    emoji: "🧵",
    tagline: "The robot's nervous system",
    color: "#F97316",
    pins: [],
    principle:
      "Jumper wires carry both power and signals. Convention keeps you sane: red for power, black for ground, other colors for signals. Female-female jumpers connect module pins directly. Loose jumpers are the #1 cause of 'my robot suddenly stopped working' — hot-glue or tape them once tested.",
    specs: [
      ["Types", "M-M, M-F, F-F"],
      ["Length", "10–20 cm"],
      ["Wire", "26 AWG stranded"],
      ["Connector", "2.54 mm DuPont"],
    ],
    cost: "₹60–100 (40 pcs)",
    advantages: ["No soldering needed", "Reusable", "Color coding"],
    alternatives: ["Soldered wires (permanent)", "Ribbon cable (tidy)", "Custom PCB (pro)"],
    applications: ["Prototyping everything"],
  },
  {
    id: "switch",
    name: "Power Switch",
    emoji: "🎚️",
    tagline: "Master ON/OFF between battery and everything",
    color: "#EF4444",
    pins: [
      { name: "IN", role: "From battery +", color: "#EF4444" },
      { name: "OUT", role: "To L298N 12V input", color: "#F97316" },
    ],
    principle:
      "A switch simply breaks the positive wire from the battery. Always switch the positive line, never ground — and always add a switch. Debugging a robot you can't turn off while its wheels spin across the desk is a rite of passage nobody enjoys twice.",
    specs: [
      ["Type", "SPST rocker / slide"],
      ["Rating", "3A @ 12V DC min"],
    ],
    cost: "₹10–20",
    advantages: ["Instant kill switch", "Saves battery", "Protects during wiring"],
    alternatives: ["Toggle switch", "Key switch (competitions)", "XT60 connector unplug"],
    applications: ["Every battery-powered build"],
  },
];

// ---------- Code samples ----------

export const ARDUINO_CODE = `// Line Follower Robot — Arduino Uno + L298N + 2× IR sensors
// APEX Academy · Beginner-friendly bang-bang control

// ---- Pin map ----
const int IR_LEFT  = A0;   // Left IR sensor OUT
const int IR_RIGHT = A1;   // Right IR sensor OUT
const int ENA = 9;         // Left motor speed  (PWM ~)
const int IN1 = 2;         // Left motor direction
const int IN2 = 3;
const int ENB = 10;        // Right motor speed (PWM ~)
const int IN3 = 4;         // Right motor direction
const int IN4 = 5;

const int BASE_SPEED = 160;   // 0-255. Start slow!
const int TURN_SPEED = 110;

void setup() {
  pinMode(IR_LEFT, INPUT);
  pinMode(IR_RIGHT, INPUT);
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // LOW = black line detected (typical module: less reflection)
  bool leftOnLine  = (digitalRead(IR_LEFT)  == LOW);
  bool rightOnLine = (digitalRead(IR_RIGHT) == LOW);

  if (!leftOnLine && !rightOnLine) {
    forward(BASE_SPEED);            // line between sensors
  } else if (leftOnLine && !rightOnLine) {
    turnLeft(TURN_SPEED);           // line drifted left → steer left
  } else if (!leftOnLine && rightOnLine) {
    turnRight(TURN_SPEED);          // line drifted right → steer right
  } else {
    stopMotors();                   // both black: crossing or finish
  }
}

void forward(int speed) {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, speed); analogWrite(ENB, speed);
}

void turnLeft(int speed) {
  digitalWrite(IN1, LOW);  digitalWrite(IN2, HIGH);  // left wheel back
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);   // right wheel fwd
  analogWrite(ENA, speed); analogWrite(ENB, speed);
}

void turnRight(int speed) {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);  digitalWrite(IN4, HIGH);
  analogWrite(ENA, speed); analogWrite(ENB, speed);
}

void stopMotors() {
  analogWrite(ENA, 0); analogWrite(ENB, 0);
}`;

export const ESP32_CODE = `// Line Follower Robot — ESP32 + L298N + 2× IR sensors
// APEX Academy · PID control with LEDC hardware PWM

// ---- Pin map (3.3V logic!) ----
const int IR_LEFT  = 34;   // input-only pin, perfect for sensors
const int IR_RIGHT = 35;
const int IN1 = 25, IN2 = 26;   // Left motor direction
const int IN3 = 27, IN4 = 14;   // Right motor direction
const int ENA = 32, ENB = 33;   // PWM speed pins

// ---- PID gains — tune in the Optimization Lab! ----
float Kp = 45.0, Ki = 0.0, Kd = 22.0;
int   BASE_SPEED = 170;         // 0-255

float integral = 0, lastError = 0;
unsigned long lastMicros = 0;

void setup() {
  pinMode(IR_LEFT, INPUT);  pinMode(IR_RIGHT, INPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);

  // ESP32 LEDC: 8-bit resolution @ 5 kHz
  ledcAttach(ENA, 5000, 8);
  ledcAttach(ENB, 5000, 8);
  Serial.begin(115200);
}

void loop() {
  // error: -1 (line left) .. 0 (centered) .. +1 (line right)
  int l = digitalRead(IR_LEFT)  == LOW ? 1 : 0;
  int r = digitalRead(IR_RIGHT) == LOW ? 1 : 0;
  float error = (float)(r - l);

  unsigned long now = micros();
  float dt = (now - lastMicros) / 1e6f;
  if (dt <= 0 || dt > 0.5f) dt = 0.001f;
  lastMicros = now;

  integral += error * dt;
  integral = constrain(integral, -50, 50);      // anti-windup
  float derivative = (error - lastError) / dt;
  lastError = error;

  float correction = Kp * error + Ki * integral + Kd * derivative;

  int leftSpeed  = constrain(BASE_SPEED + (int)correction, -255, 255);
  int rightSpeed = constrain(BASE_SPEED - (int)correction, -255, 255);

  drive(leftSpeed, rightSpeed);
}

void drive(int left, int right) {
  digitalWrite(IN1, left  >= 0 ? HIGH : LOW);
  digitalWrite(IN2, left  >= 0 ? LOW  : HIGH);
  digitalWrite(IN3, right >= 0 ? HIGH : LOW);
  digitalWrite(IN4, right >= 0 ? LOW  : HIGH);
  ledcWrite(ENA, abs(left));
  ledcWrite(ENB, abs(right));
}`;

export const BEGINNER_STEPS: { code: string; plain: string }[] = [
  { code: "read left sensor", plain: "Ask the left eye: do you see black?" },
  { code: "read right sensor", plain: "Ask the right eye: do you see black?" },
  { code: "if both see white → go forward", plain: "Line is between my eyes — I'm on track, keep going!" },
  { code: "if left sees black → turn left", plain: "Line escaped to the left — chase it left!" },
  { code: "if right sees black → turn right", plain: "Line escaped to the right — chase it right!" },
  { code: "if both see black → stop", plain: "A thick black bar — that's the finish line. Stop!" },
  { code: "repeat forever", plain: "Do all of this again, 1000× per second." },
];

// ---------- Bill of materials ----------

export interface BomItem {
  name: string;
  qty: number;
  cost: number;   // INR, typical
  alt: string;
  search: string; // amazon.in search query
}

export const BOM: BomItem[] = [
  { name: "ESP32 DevKit V1", qty: 1, cost: 400, alt: "Arduino Uno R3 (₹500)", search: "ESP32 DevKit V1 development board" },
  { name: "L298N Motor Driver", qty: 1, cost: 150, alt: "TB6612FNG (₹250)", search: "L298N motor driver module" },
  { name: "IR Sensor Module", qty: 2, cost: 50, alt: "TCRT5000 module (₹45)", search: "IR infrared obstacle sensor module LM393" },
  { name: "BO Motor + Wheel set", qty: 2, cost: 140, alt: "N20 gear motor (₹180)", search: "BO motor with wheel robot" },
  { name: "Robot Chassis Kit", qty: 1, cost: 200, alt: "3D-printed / cardboard", search: "2WD robot car chassis kit" },
  { name: "Caster Wheel", qty: 1, cost: 40, alt: "Ball caster (₹60)", search: "caster wheel robot chassis" },
  { name: "18650 Battery ×2 + Holder", qty: 1, cost: 350, alt: "6×AA holder + cells (₹250)", search: "18650 battery holder 2 cell with cells" },
  { name: "Jumper Wires (40 pc)", qty: 1, cost: 80, alt: "Solid hookup wire", search: "jumper wires male female 40 pieces" },
  { name: "Rocker Switch", qty: 1, cost: 15, alt: "Slide switch (₹10)", search: "rocker switch 12v mini" },
  { name: "Black Electrical Tape (track)", qty: 1, cost: 30, alt: "Black chart paper", search: "black electrical insulation tape" },
];

export const BOM_TOTAL = BOM.reduce((s, i) => s + i.cost * i.qty, 0);
