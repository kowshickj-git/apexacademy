import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ohm's Law — V = I × R",
  description: "Master Ohm's Law with interactive simulations. Calculate voltage, current, and resistance in any circuit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
