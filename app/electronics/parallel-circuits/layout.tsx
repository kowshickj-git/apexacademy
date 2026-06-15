import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parallel Circuits — Multiple Paths",
  description: "Explore parallel circuits: how current splits across branches, voltage stays constant, and total resistance decreases.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
