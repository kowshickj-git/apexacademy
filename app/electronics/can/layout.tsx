import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAN Protocol — Automotive & Industrial Communication",
  description:
    "Learn CAN bus protocol: message-based communication, arbitration, CAN frames, error detection, and how CAN is used in electric vehicles and industrial automation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
