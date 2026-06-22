-- ============================================================================
-- APEX Academy — Supabase Row-Level Security (RLS) Hardening
-- ============================================================================
-- WHY THIS FILE EXISTS
-- The Supabase ANON key shipped in auth.js is public BY DESIGN. Your database
-- is therefore only as secure as your RLS policies. If RLS is OFF on any table,
-- anyone on the internet can read/write it directly via the REST API using that
-- public key. Run this in: Supabase Dashboard -> SQL Editor.
--
-- Adjust table/column names to match your real schema before running.
-- ============================================================================

-- 1) TURN RLS ON FOR EVERY TABLE (default-deny). Repeat for each table you have.
alter table public.profiles     enable row level security;
alter table public.progress     enable row level security;
alter table public.quiz_results enable row level security;
alter table public.enrollments  enable row level security;

-- 2) STUDENTS: read/write ONLY their own rows.
--    This is what prevents IDOR + horizontal privilege escalation.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "progress_rw_own" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quiz_rw_own" on public.quiz_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "enrollments_rw_own" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) ADMINS: define admins in a table, NEVER trust a client-set "is_admin" flag.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
-- (no policies on admins = only the service_role can modify it; that's intended)

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Admin read access across student data (example on profiles; repeat as needed):
create policy "profiles_admin_read" on public.profiles
  for select using (public.is_admin());

-- 4) VERIFY: this query should return zero rows. Any row = a table with RLS OFF.
-- select tablename from pg_tables t
--   where schemaname = 'public'
--   and not exists (
--     select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
--     where c.relname = t.tablename and n.nspname = 'public' and c.relrowsecurity
--   );

-- ============================================================================
-- DASHBOARD SETTINGS (not SQL — set these in Authentication -> Settings):
--   [ ] "Confirm email" = ON  (blocks fake-email signups)
--   [ ] Minimum password length >= 10, require strong passwords
--   [ ] "Leaked password protection" = ON (HaveIBeenPwned check)
--   [ ] Rate limits left at default or tighter (Supabase enforces server-side)
--   [ ] service_role key: NEVER in any frontend file or NEXT_PUBLIC_* env var
-- ============================================================================
