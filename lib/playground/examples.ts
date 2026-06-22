// Example Arduino sketches for the APEX Playground.
// Adapted from the avr8js-electron-playground example set (MIT).
// All target the on-board LED (pin 13 / PB5) and/or Serial, so they run with
// zero external wiring in the simulator.

export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "blink",
    name: "Blink",
    description: "Classic blink on pin 13 every 500 ms",
    code: `// Blink — turns the on-board LED (pin 13) on and off every 500 ms.
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}
`,
  },
  {
    id: "fast-blink",
    name: "Fast Blink",
    description: "Rapid 100 ms blink",
    code: `// Fast Blink — 100 ms on/off.
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(100);
  digitalWrite(LED_PIN, LOW);
  delay(100);
}
`,
  },
  {
    id: "sos",
    name: "SOS Beacon",
    description: "Morse code ··· ––– ··· on pin 13",
    code: `// SOS in Morse code on the on-board LED.
const int LED_PIN = 13;

void dot()  { digitalWrite(LED_PIN, HIGH); delay(150); digitalWrite(LED_PIN, LOW); delay(150); }
void dash() { digitalWrite(LED_PIN, HIGH); delay(450); digitalWrite(LED_PIN, LOW); delay(150); }

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  dot(); dot(); dot();
  dash(); dash(); dash();
  dot(); dot(); dot();
  delay(1000);
}
`,
  },
  {
    id: "serial-hello",
    name: "Serial Hello",
    description: "Prints a counter to the Serial Monitor",
    code: `// Serial Hello — prints to the Serial Monitor and blinks pin 13.
int count = 0;

void setup() {
  Serial.begin(115200);
  pinMode(13, OUTPUT);
  Serial.println("APEX Playground online.");
}

void loop() {
  Serial.print("tick ");
  Serial.println(count++);
  digitalWrite(13, !digitalRead(13));
  delay(1000);
}
`,
  },
];

export const DEFAULT_EXAMPLE = EXAMPLES[0];
