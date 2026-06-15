import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capacitors — Storing Energy",
  description: "Understand how capacitors store and release charge, RC time constants, and applications in real circuits.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
