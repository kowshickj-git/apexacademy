import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Embedded Projects — Build Real Devices",
  description: "Apply your embedded systems knowledge to build real projects: weather stations, motor controllers, wireless sensors, and IoT dashboards.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
