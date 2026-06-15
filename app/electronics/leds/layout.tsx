import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LEDs — Light-Emitting Diodes",
  description: "Discover how LEDs work, calculate current-limiting resistors, and build your first LED circuit with interactive simulations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
