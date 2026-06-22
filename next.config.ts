import type { NextConfig } from "next";

// Security headers shared by every route (everything except the CSP, which varies).
const baseSecurityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Strict CSP for the whole site.
const strictCsp = [
  "default-src 'self'",
  // Next.js needs inline scripts for hydration; nonce-based CSP requires middleware
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://api.emailjs.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  // Supabase auth/REST (login, signup, dashboard streak) + EmailJS contact form.
  "connect-src 'self' https://api.emailjs.com https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// Relaxed CSP scoped ONLY to the Arduino Playground route. It additionally allows:
//  - the Wokwi compile service (hexi.wokwi.com) for Arduino → HEX,
//  - the Monaco editor loaded from jsDelivr + its blob web workers.
const playgroundCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://hexi.wokwi.com https://cdn.jsdelivr.net",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Everything except the playground gets the strict policy.
        source: "/((?!electronics/playground).*)",
        headers: [...baseSecurityHeaders, { key: "Content-Security-Policy", value: strictCsp }],
      },
      {
        source: "/electronics/playground",
        headers: [...baseSecurityHeaders, { key: "Content-Security-Policy", value: playgroundCsp }],
      },
    ];
  },
  // Prevent exposing server info
  poweredByHeader: false,
};

export default nextConfig;
