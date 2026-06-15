import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diodes — One-Way Valves",
  description: "Learn how diodes allow current to flow in one direction, forward bias, reverse bias, and common diode applications.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
