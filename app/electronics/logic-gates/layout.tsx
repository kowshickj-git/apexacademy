import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logic Gates — Digital Building Blocks",
  description: "Explore AND, OR, NOT, NAND, NOR, XOR, and XNOR gates with interactive simulators, truth tables, and real-world applications.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
