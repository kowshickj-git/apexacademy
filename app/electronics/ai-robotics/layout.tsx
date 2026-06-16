import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Robotics — Intelligent Autonomous Systems",
  description: "Master AI robotics: TinyML, neural networks on microcontrollers, SLAM, path planning, reinforcement learning, and building intelligent autonomous robots.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
