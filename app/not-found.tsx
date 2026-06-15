import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "#050507" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
      >
        <span style={{ fontSize: 32 }}>404</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(240,240,245,0.45)" }}>
        This lesson or page doesn&apos;t exist yet.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}
      >
        ← Back to home
      </Link>
    </div>
  );
}
