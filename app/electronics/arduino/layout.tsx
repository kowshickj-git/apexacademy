import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arduino Fundamentals — Code Meets Hardware",
  description: "Learn Arduino programming: digital I/O, analog signals, PWM, serial communication, and build your first traffic light project.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
