import type { Metadata } from "next";
import CircuitLab from "@/components/simulator/CircuitLab";

export const metadata: Metadata = {
  title: "Circuit Lab — Build & Simulate Electronics",
  description:
    "A browser-based electronics laboratory. Drag components, wire circuits, and watch a real circuit solver light LEDs, measure current, and enforce Ohm's law in real time.",
  openGraph: {
    title: "APEX Circuit Lab",
    description: "Drag, wire, and simulate real circuits in your browser.",
  },
};

export default function LabPage() {
  return <CircuitLab />;
}
