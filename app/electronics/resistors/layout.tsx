import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resistors — Controlling Current",
  description: "Learn to read resistor color codes, understand tolerances, and choose the right resistor for your circuit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
