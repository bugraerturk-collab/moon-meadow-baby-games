create extension if not exists pgcrypto;

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_code text not null,
  name text not null,
  score integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.game_responses (
  id uuid primary key default gen_random_uuid(),
  room_code text not null,
  player_name text not null,
  game_id text not null,
  question_index integer not null,
  question_prompt text not null,
  answer text not null,
  is_correct boolean,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists room_players_room_idx on public.room_players (room_code);
create index if not exists game_responses_question_idx on public.game_responses (room_code, game_id, question_index);

alter table public.room_players enable row level security;
alter table public.game_responses enable row level security;

drop policy if exists "guests may join a room" on public.room_players;
create policy "guests may join a room" on public.room_players for insert to anon with check (char_length(room_code) = 6 and char_length(name) between 1 and 24);
drop policy if exists "guests may save an answer" on public.game_responses;
create policy "guests may save an answer" on public.game_responses for insert to anon with check (char_length(room_code) = 6 and char_length(player_name) between 1 and 24 and char_length(answer) between 1 and 120);

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'room_players') then
    alter publication supabase_realtime add table public.room_players;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'game_responses') then
    alter publication supabase_realtime add table public.game_responses;
  end if;
end $$;
