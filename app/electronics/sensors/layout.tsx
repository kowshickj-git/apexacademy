import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sensors Fundamentals — Types, Specs & Simulators",
  description: "Learn how sensors work, the difference between analog and digital sensors, types of sensors, calibration, and interfacing sensors with Arduino and microcontrollers.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
