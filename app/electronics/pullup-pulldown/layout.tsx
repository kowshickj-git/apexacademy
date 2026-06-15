import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pull-Up & Pull-Down Resistors",
  description: "Understand floating inputs, how pull-up and pull-down resistors define a stable logic state, and their use with microcontrollers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
