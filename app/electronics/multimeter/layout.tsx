import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multimeter — Measuring Circuits",
  description: "Master the multimeter: measure voltage, current, and resistance. Learn continuity testing and safe measurement practices.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
