import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "STM32 Fundamentals — ARM Cortex-M Microcontroller",
  description: "Learn STM32: ARM Cortex-M core, HAL library, clock configuration, GPIO, timers, ADC, UART, SPI, I2C. Professional embedded systems programming.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
