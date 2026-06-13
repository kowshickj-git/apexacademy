import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voltage Fundamentals | APEX Academy",
  description:
    "Learn what voltage is through interactive simulations, visual explanations, and bite-sized lessons.",
  keywords: ["voltage", "electronics", "learn electronics", "APEX Academy", "beginner"],
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
