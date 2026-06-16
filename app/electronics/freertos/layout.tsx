import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "FreeRTOS — Real-Time Operating System",
  description: "Master FreeRTOS: tasks, queues, semaphores, mutexes, timers, and interrupt-safe APIs for embedded real-time systems programming.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
