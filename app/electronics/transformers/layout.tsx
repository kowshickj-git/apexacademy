import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transformers — Stepping Voltage Up and Down",
  description: "Understand how transformers use magnetic coupling to change AC voltage levels, turns ratios, and power transmission.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
