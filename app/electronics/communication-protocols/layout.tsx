import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Communication Protocols — UART, I2C, SPI, CAN, RS485",
  description: "Learn the fundamentals of embedded communication protocols. Understand serial vs parallel, synchronous vs asynchronous, and when to use UART, I2C, SPI, CAN, or RS485.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
