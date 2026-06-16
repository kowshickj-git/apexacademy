import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "UART Fundamentals — Serial Communication",
  description: "Master UART serial communication. Learn TX/RX pins, baud rates, UART frames, start/stop bits, and how to use UART with Arduino and ESP32.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
