import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SPI Protocol — Four-Wire Serial Interface",
  description: "Learn SPI protocol: MOSI/MISO/SCK/CS four-wire bus, full-duplex communication, clock polarity & phase (CPOL/CPHA), and daisy-chain configurations.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
