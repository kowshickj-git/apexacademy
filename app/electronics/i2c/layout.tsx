import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "I2C Protocol — Two-Wire Serial Communication",
  description: "Learn I2C protocol: SDA/SCL two-wire bus, 7-bit addressing, 400kHz Fast Mode, clock stretching, multi-master arbitration, and interfacing common I2C sensors.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
