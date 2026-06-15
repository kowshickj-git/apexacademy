import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resistance — Opposition to Flow",
  description: "Explore electrical resistance, how materials resist current flow, and calculate resistance using Ohm's Law.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
