import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ESP32 Fundamentals — WiFi & BLE Microcontroller",
  description: "Master the ESP32: dual-core Xtensa LX6, WiFi 802.11 b/g/n, Bluetooth 4.2/BLE 5.0, 34 GPIO pins, ADC/DAC, touch sensors, deep sleep at 10µA.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
