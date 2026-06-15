import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Series Circuits — One Path, One Current",
  description: "Understand series circuits: how voltage divides, current stays constant, and how to calculate total resistance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
