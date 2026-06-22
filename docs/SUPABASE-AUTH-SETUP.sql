-- ============================================================================
-- APEX Academy — Supabase Auth + Streak setup
-- ============================================================================
-- Run this ONCE in your new project: Supabase Dashboard -> SQL Editor -> paste -> Run.
-- It creates the profiles table, locks it with RLS, auto-creates a profile on
-- signup, and adds the server-side touch_streak() function the dashboard calls.
-- ============================================================================

-- 1) PROFILES TABLE -----------------------------------------------------------
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  first_name       text,
  last_name        text,
  phone            text,
  current_streak   int  not null default 0,
  longest_streak   int  not null default 0,
  last_active_date date,
  created_at       timestamptz not null default now()
);

-- 2) ROW-LEVEL SECURITY (each user sees/edits ONLY their own row) -------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- (No INSERT policy: rows are created only by the trigger / RPC below, which
--  run as SECURITY DEFINER. That prevents users from forging arbitrary rows.)

-- 3) AUTO-CREATE A PROFILE WHEN A USER SIGNS UP -------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name',  ''),
    coalesce(new.raw_user_meta_data ->> 'phone',      '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) STREAK LOGIC (runs server-side; called once per dashboard load) ----------
--   today      == last_active  -> no change (already counted today)
--   today - 1  == last_active  -> streak + 1 (consecutive day)
--   otherwise                  -> streak resets to 1
create or replace function public.touch_streak()
returns public.profiles
language plpgsql
security definer set search_path = public
as $$
declare
  prof  public.profiles;
  today date := (now() at time zone 'utc')::date;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into prof from public.profiles where id = auth.uid();

  -- Self-heal if the profile row is somehow missing.
  if not found then
    insert into public.profiles (id, current_streak, longest_streak, last_active_date)
    values (auth.uid(), 1, 1, today)
    returning * into prof;
    return prof;
  end if;

  if prof.last_active_date = today then
    return prof;                              -- already counted today
  elsif prof.last_active_date = today - 1 then
    prof.current_streak := prof.current_streak + 1;
  else
    prof.current_streak := 1;                 -- streak broken (or first ever visit)
  end if;

  prof.longest_streak   := greatest(prof.longest_streak, prof.current_streak);
  prof.last_active_date := today;

  update public.profiles set
    current_streak   = prof.current_streak,
    longest_streak   = prof.longest_streak,
    last_active_date = prof.last_active_date
  where id = auth.uid();

  return prof;
end;
$$;

-- ============================================================================
-- AFTER RUNNING THIS, in the Supabase Dashboard:
--   Authentication -> Providers -> Email:
--     [ ] "Confirm email" = OFF   -> lets users sign in immediately after signup
--         (turn ON later for production security; then users verify via email)
--   Authentication -> URL Configuration:
--     Site URL = https://apex-academy-seven.vercel.app   (your live domain)
--     Redirect URLs: add  https://apex-academy-seven.vercel.app/**
--   Authentication -> Providers -> Google (optional): add OAuth client to enable
--     the "Continue with Google" button.
-- ============================================================================
