-- ============================================================
-- Lumen — Supabase Schema
-- ============================================================
-- Run this in the Supabase SQL Editor to set up the full schema.
-- All tables use UUID primary keys tied to auth.users.
-- Row Level Security (RLS) is enabled on every table so users
-- can only access their own data.
-- ============================================================


-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── profiles ────────────────────────────────────────────────
-- One row per auth user; created automatically on signup.
create table if not exists profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,                    -- shown in the greeting on /home
  created_at   timestamptz default now() not null
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);


-- ── journeys ────────────────────────────────────────────────
-- A Journey is a multi-step learning or growth path.
create table if not exists journeys (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles (id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'active'
                check (status in ('active', 'paused', 'completed', 'archived')),
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table journeys enable row level security;

create policy "Users can manage their own journeys"
  on journeys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── journey_steps ────────────────────────────────────────────
-- Ordered steps (milestones / tasks) within a journey.
create table if not exists journey_steps (
  id          uuid primary key default uuid_generate_v4(),
  journey_id  uuid not null references journeys (id) on delete cascade,
  user_id     uuid not null references profiles (id) on delete cascade,
  title       text not null,
  description text,
  position    integer not null default 0,
  completed   boolean not null default false,
  completed_at timestamptz,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table journey_steps enable row level security;

create policy "Users can manage their own journey steps"
  on journey_steps for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── notes ────────────────────────────────────────────────────
-- Free-form text notes, optionally linked to a journey.
create table if not exists notes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles (id) on delete cascade,
  journey_id  uuid references journeys (id) on delete set null,
  title       text,
  content     text not null default '',
  tags        text[] default '{}',
  is_favorite boolean not null default false,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Migration: if the table already exists, run these in Supabase SQL Editor:
-- alter table notes add column if not exists tags text[] default '{}';
-- alter table notes add column if not exists is_favorite boolean not null default false;
-- alter table notes drop column if exists pinned;

alter table notes enable row level security;

create policy "Users can manage their own notes"
  on notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── curiosity_items ──────────────────────────────────────────
-- Links, ideas, or topics the user is curious about / wants to explore.
create table if not exists curiosity_items (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles (id) on delete cascade,
  title       text not null,
  url         text,
  description text,
  tags        text[] default '{}',
  explored    boolean not null default false,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table curiosity_items enable row level security;

create policy "Users can manage their own curiosity items"
  on curiosity_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── nudges ───────────────────────────────────────────────────
-- Short motivational prompts or reminders shown to the user.
create table if not exists nudges (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles (id) on delete cascade,
  message     text not null,
  scheduled_at timestamptz,
  dismissed   boolean not null default false,
  created_at  timestamptz default now() not null
);

alter table nudges enable row level security;

create policy "Users can manage their own nudges"
  on nudges for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── focus_sessions ───────────────────────────────────────────
-- Timed focus/work sessions, optionally linked to a journey.
create table if not exists focus_sessions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles (id) on delete cascade,
  journey_id  uuid references journeys (id) on delete set null,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  duration_seconds integer
    generated always as (
      extract(epoch from (ended_at - started_at))::integer
    ) stored,
  notes       text,
  created_at  timestamptz default now() not null
);

alter table focus_sessions enable row level security;

create policy "Users can manage their own focus sessions"
  on focus_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── updated_at trigger ───────────────────────────────────────
-- Automatically keep updated_at current on any table that has it.
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger set_updated_at_profiles
  before update on profiles
  for each row execute procedure update_updated_at();

create or replace trigger set_updated_at_journeys
  before update on journeys
  for each row execute procedure update_updated_at();

create or replace trigger set_updated_at_journey_steps
  before update on journey_steps
  for each row execute procedure update_updated_at();

create or replace trigger set_updated_at_notes
  before update on notes
  for each row execute procedure update_updated_at();

create or replace trigger set_updated_at_curiosity_items
  before update on curiosity_items
  for each row execute procedure update_updated_at();
