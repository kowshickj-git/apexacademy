import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build a Line Follower Robot From Scratch — Interactive Engineering Lab",
  description:
    "Learn, design, simulate, wire, code, tune, and certify a complete autonomous line follower robot — all in your browser. Interactive 3D components, live circuit simulator, PID simulation arena, code lab, and a digital engineering certificate.",
  openGraph: {
    title: "Build a Line Follower Robot From Scratch | APEX Academy",
    description:
      "A complete interactive robotics engineering laboratory: assembly, wiring, coding, PID tuning, simulation racing, and certification — no experience required.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
