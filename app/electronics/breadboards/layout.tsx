import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Breadboards — Prototyping Circuits",
  description: "Learn how breadboards work, how to read their internal connections, and how to build circuits without soldering.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
