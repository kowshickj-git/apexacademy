import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Current — Electron Flow",
  description: "Understand electric current, how electrons flow through conductors, and how to measure amperes in a circuit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
