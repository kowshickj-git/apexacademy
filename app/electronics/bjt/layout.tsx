import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BJT Transistors — Amplify and Switch",
  description: "Learn how Bipolar Junction Transistors work as switches and amplifiers, understand NPN vs PNP, and build driver circuits.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
