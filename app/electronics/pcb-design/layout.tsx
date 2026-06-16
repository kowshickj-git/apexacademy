import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PCB Design — Printed Circuit Board Layout",
  description: "Learn PCB design: schematic capture, component placement, routing, design rule checks, Gerber files, and manufacturing your own circuit boards.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
