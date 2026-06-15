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
    "Learn electronics from voltage to Arduino through interactive simulations, visual lessons, and quizzes. 20 lessons, 0 sign-up required.",
  keywords: ["electronics", "learn electronics", "APEX Academy", "circuits", "Arduino", "beginner", "interactive"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "APEX Academy",
    title: "APEX Academy — Electronics Learning Platform",
    description: "Learn electronics from voltage to Arduino through interactive simulations, visual lessons, and quizzes. 20 lessons, 0 sign-up required.",
    url: "https://apexacademy.vercel.app",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "APEX Academy — Electronics Learning Platform",
    description: "Learn electronics from voltage to Arduino through interactive simulations, visual lessons, and quizzes. 20 lessons, 0 sign-up required.",
  },
  metadataBase: new URL("https://apexacademy.vercel.app"),
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
