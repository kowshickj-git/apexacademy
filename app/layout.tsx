import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "APEX Academy — Electronics Learning Platform",
    template: "%s | APEX Academy",
  },
  description:
    "Learn electronics from voltage to parallel circuits through interactive simulations, visual lessons, and quizzes. 12 lessons, 0 sign-up required.",
  keywords: ["electronics", "learn electronics", "APEX Academy", "circuits", "beginner", "interactive"],
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050507",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-background text-white antialiased">{children}</body>
    </html>
  );
}
