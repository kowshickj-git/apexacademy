import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "RS485 Fundamentals — Industrial Long-Distance Communication",
  description: "Learn RS485 differential signaling, multi-drop networks, Modbus protocol, termination resistors, and industrial applications up to 1200m.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
