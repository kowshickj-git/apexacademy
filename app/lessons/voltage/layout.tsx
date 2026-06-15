import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voltage — Electric Pressure",
  description: "Learn what voltage is, how electric pressure drives current through a circuit, and why it's the foundation of all electronics.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
