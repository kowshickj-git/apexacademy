# APEX Academy — Security Checklist

Living checklist from the security audit. The deployed `main` branch is a static +
client-side site with **no backend**, so most server-side items are N/A until auth ships.

## ✅ Done (verified live)
- [x] HTTPS enforced (HTTP → 308 → HTTPS)
- [x] HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] No `service_role` / server secret in repo or git history
- [x] DOM-XSS in `book-demo.html` fixed (HTML-escape user input before `innerHTML`)
- [x] Contact form: honeypot + client-side sanitize + 30s cooldown
- [x] Removed committed dev screenshots from `public/uploads/`

## ⬜ Action needed
- [ ] **EmailJS abuse (M-2):** In EmailJS dashboard set **Allowed Origins** = your domain only, add **CAPTCHA**. Real fix = server-side proxy (see below).
- [ ] **Supabase RLS (H-1):** Before deploying auth, run `docs/SUPABASE-RLS-HARDENING.sql` and confirm RLS is ON for every table.
- [ ] **Tighten CSP (M-3):** Move to nonce-based CSP and drop `'unsafe-inline'` once inline handlers are removed. Keep `'unsafe-eval'` scoped to `/electronics/playground` only.

## 🧩 When you add a backend (login / dashboard / quizzes)
- [ ] All auth via server (`@supabase/ssr`, httpOnly cookies) — not a client global
- [ ] Server-side input validation with Zod on every endpoint
- [ ] Per-IP rate limiting (e.g. Upstash) on contact, login, signup
- [ ] RBAC checked in middleware AND re-checked in every server query
- [ ] Server-side contact proxy: `app/api/contact/route.ts` validates + rate-limits + verifies CAPTCHA, then sends mail using secrets from Vercel env vars
- [ ] Never log passwords, tokens, or secrets

## Routine
- [ ] `npm audit` before each release; keep Next/React patched
- [ ] Consider SRI hashes on third-party CDN `<script>` tags
