/* APEX Robotics Academy — Supabase Auth
   Only the anon/public key is used here. Safe for frontend.
*/
const SUPABASE_URL  = 'https://dbtzjbgsrigkivjeaqaq.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRidHpqYmdzcmlna2l2amVhcWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjU5NDgsImV4cCI6MjA5Njc0MTk0OH0.qRwrGNmhymmWDvK_0yWvJLj7ObID17ro3wRD3B415ZA';

/* Lazy-init so pages that don't need auth don't pay the cost */
let _sb = null;
function sb() {
  if (!_sb) _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  return _sb;
}

/* ── Sign Up ──────────────────────────────────────────── */
async function apexSignUp({ firstName, lastName, email, password, phone }) {
  const { data, error } = await sb().auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName, phone: phone || '' },
      emailRedirectTo: window.location.origin + '/login.html',
    },
  });
  if (error) throw error;
  return data;
}

/* ── Sign In ──────────────────────────────────────────── */
async function apexSignIn({ email, password }) {
  const { data, error } = await sb().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/* ── Google OAuth ─────────────────────────────────────── */
async function apexSignInGoogle() {
  const { error } = await sb().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/dashboard.html' },
  });
  if (error) throw error;
}

/* ── Sign Out ─────────────────────────────────────────── */
async function apexSignOut() {
  const { error } = await sb().auth.signOut();
  if (error) throw error;
  window.location.href = 'login.html';
}

/* ── Get current session ──────────────────────────────── */
async function apexGetSession() {
  const { data } = await sb().auth.getSession();
  return data.session;
}

/* ── Password reset ───────────────────────────────────── */
async function apexResetPassword(email) {
  const { error } = await sb().auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password.html',
  });
  if (error) throw error;
}

/* ── Auth state listener ──────────────────────────────── */
function onAuthChange(callback) {
  sb().auth.onAuthStateChange((_event, session) => callback(session));
}
