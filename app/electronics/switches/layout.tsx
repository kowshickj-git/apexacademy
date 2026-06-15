import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switches — Opening and Closing Circuits",
  description: "Learn how switches work, the difference between SPST, SPDT, and momentary types, and how to wire them in circuits.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
