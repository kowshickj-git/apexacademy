import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Robotics — Mechanical & Electronic Systems",
  description: "Learn robotics: kinematics, motor control, encoders, PID control, servo systems, and building autonomous mobile robots with embedded microcontrollers.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
