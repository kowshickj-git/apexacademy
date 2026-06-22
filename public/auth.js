/* ============================================================================
   APEX Academy — Authentication (Supabase, client-side)
   ----------------------------------------------------------------------------
   >>> CONFIG: paste your NEW Supabase project values below. <<<
   Find them in: Supabase Dashboard -> Project Settings -> API
     - "Project URL"            -> SUPABASE_URL
     - "Project API keys: anon" -> SUPABASE_ANON   (this key is public by design)

   The anon key is SAFE to ship in the browser AS LONG AS Row-Level Security
   (RLS) is enabled on every table. Run docs/SUPABASE-AUTH-SETUP.sql first.
   ============================================================================ */
const SUPABASE_URL  = 'https://oowaubhssrojxoxvharz.supabase.co';
const SUPABASE_ANON = 'sb_publishable_UVswH8wGu5tnwLIjku4qwg_d1dPj-Fg';

/* True once real values are filled in (used by pages to show a friendly notice). */
function apexConfigured() {
  return SUPABASE_URL.indexOf('YOUR-PROJECT-REF') === -1
      && SUPABASE_ANON.indexOf('YOUR-ANON') === -1;
}

/* Lazy-init so pages that don't need auth don't pay the cost. */
let _sb = null;
function sb() {
  if (!_sb) {
    if (typeof supabase === 'undefined') {
      throw new Error('Supabase library failed to load. Check your connection.');
    }
    _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _sb;
}

/* ── Sign Up ─────────────────────────────────────────────────────────────── */
async function apexSignUp({ firstName, lastName, email, password, phone }) {
  const { data, error } = await sb().auth.signUp({
    email,
    password,
    options: {
      // Stored in auth.users.user_metadata; the DB trigger copies these into profiles.
      data: { first_name: firstName, last_name: lastName, phone: phone || '' },
      emailRedirectTo: window.location.origin + '/login.html?confirmed=1',
    },
  });
  if (error) throw error;
  return data;
}

/* ── Sign In ─────────────────────────────────────────────────────────────── */
async function apexSignIn({ email, password }) {
  const { data, error } = await sb().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/* ── Google OAuth ────────────────────────────────────────────────────────── */
async function apexSignInGoogle() {
  const { error } = await sb().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/dashboard.html' },
  });
  if (error) throw error;
}

/* ── Sign Out ────────────────────────────────────────────────────────────── */
async function apexSignOut() {
  const { error } = await sb().auth.signOut();
  if (error) throw error;
  window.location.href = 'login.html';
}

/* ── Current session ─────────────────────────────────────────────────────── */
async function apexGetSession() {
  if (!apexConfigured()) return null;
  try {
    const { data } = await sb().auth.getSession();
    return data.session;
  } catch (e) {
    return null;
  }
}

/* ── Password reset ──────────────────────────────────────────────────────── */
async function apexResetPassword(email) {
  const { error } = await sb().auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/login.html',
  });
  if (error) throw error;
}

/* ── Streak ──────────────────────────────────────────────────────────────────
   Calls the server-side touch_streak() RPC (defined in the setup SQL). It runs
   the streak math in Postgres (tamper-resistant) and returns the profile row:
   { id, first_name, last_name, current_streak, longest_streak, last_active_date }
   ───────────────────────────────────────────────────────────────────────── */
async function apexTouchStreak() {
  const { data, error } = await sb().rpc('touch_streak');
  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

/* Read the current user's profile without updating the streak. */
async function apexGetProfile() {
  const { data, error } = await sb().from('profiles').select('*').single();
  if (error) throw error;
  return data;
}

/* ── Auth state listener ─────────────────────────────────────────────────── */
function onAuthChange(callback) {
  sb().auth.onAuthStateChange((_event, session) => callback(session));
}
