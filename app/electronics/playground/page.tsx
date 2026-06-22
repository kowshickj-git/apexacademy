import type { Metadata } from "next";
import PlaygroundClient from "@/components/playground/PlaygroundClient";

export const metadata: Metadata = {
  title: "Arduino Playground — Code & Simulate",
  description:
    "Write Arduino code and run it on a cycle-accurate ATmega328p simulator (avr8js) right in your browser. Watch GPIO pins and the on-board LED respond in real time.",
  openGraph: {
    title: "APEX Arduino Playground",
    description: "Code, compile, and simulate Arduino in the browser — powered by avr8js.",
  },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
