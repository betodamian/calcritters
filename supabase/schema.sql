-- CalCritters optional database schema
-- ----------------------------------------------------------------------------
-- The app is fully playable without a database: discovery progress is stored in
-- the browser (see lib/progress.ts) and chat runs through the /api/chat route.
--
-- This schema is here for when you want server-side persistence and analytics,
-- e.g. tracking how many unique players a campus event reached. It is written
-- for Postgres / Supabase. Apply it with the Supabase SQL editor or the CLI.
--
-- Nothing in this file contains secrets. Connection strings and keys belong in
-- environment variables (see .env.example), never in source control.
-- ----------------------------------------------------------------------------

-- A lightweight, anonymous "player" identified by a client-generated UUID.
create table if not exists players (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now()
);

-- One row per (player, critter) the first time a critter is scanned.
-- critter_slug matches the slugs defined in lib/critters.ts.
create table if not exists discoveries (
  id           bigint generated always as identity primary key,
  player_id    uuid not null references players (id) on delete cascade,
  critter_slug text not null,
  found_at     timestamptz not null default now(),
  unique (player_id, critter_slug)
);

-- Optional: persist conversation turns for analytics or moderation review.
create table if not exists chat_messages (
  id           bigint generated always as identity primary key,
  player_id    uuid references players (id) on delete set null,
  critter_slug text not null,
  role         text not null check (role in ('user', 'assistant')),
  content      text not null,
  created_at   timestamptz not null default now()
);

create index if not exists discoveries_critter_idx on discoveries (critter_slug);
create index if not exists chat_messages_critter_idx on chat_messages (critter_slug);

-- A simple leaderboard-style view of how popular each critter is.
create or replace view critter_popularity as
select critter_slug, count(*) as times_found
from discoveries
group by critter_slug
order by times_found desc;

-- Row Level Security: enable and add policies that match your auth model before
-- exposing these tables through the public API. Left disabled here so the schema
-- applies cleanly; do not ship to production without policies.
-- alter table players enable row level security;
-- alter table discoveries enable row level security;
-- alter table chat_messages enable row level security;
