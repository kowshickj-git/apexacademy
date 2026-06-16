import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IoT Fundamentals — Internet of Things",
  description: "Learn IoT architecture, connected devices, MQTT protocol, cloud platforms, smart homes, industrial IoT, and how to build connected embedded systems.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
