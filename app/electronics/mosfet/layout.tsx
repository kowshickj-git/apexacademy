import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MOSFETs — Voltage-Controlled Switches",
  description: "Master MOSFETs: how gate voltage controls drain current, N-channel vs P-channel, and high-power switching applications.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
