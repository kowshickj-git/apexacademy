import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inductors — Storing Magnetic Energy",
  description: "Learn how inductors oppose changes in current, store energy in magnetic fields, and are used in filters and power supplies.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
