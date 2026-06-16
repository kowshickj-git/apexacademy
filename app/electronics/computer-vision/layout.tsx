import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Computer Vision — Image Processing & AI",
  description: "Learn computer vision for embedded systems: OpenCV, image filtering, object detection, edge detection, and running vision models on microcontrollers.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
