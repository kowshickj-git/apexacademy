"use client";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "#050507" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <span style={{ fontSize: 28 }}>⚠</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(240,240,245,0.45)" }}>
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,240,245,0.7)" }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
