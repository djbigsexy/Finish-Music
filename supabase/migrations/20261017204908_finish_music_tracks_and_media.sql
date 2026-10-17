-- Finish Music: per-user track metadata and private media storage.
create table if not exists public.tracks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 70),
  meta text,
  release_date date,
  stage smallint not null default 0 check (stage between 0 and 8),
  stage_tasks jsonb not null default '[]'::jsonb,
  todos jsonb not null default '[]'::jsonb,
  notes text not null default '',
  timestamp_notes jsonb not null default '[]'::jsonb,
  arrangement_version text not null default '',
  mix_version text not null default '',
  mastered_version text not null default '',
  track_type text check (track_type is null or track_type in ('Original', 'Remix')),
  release_type text check (release_type is null or release_type in ('Album', 'EP', 'LP', 'Single')),
  bpm numeric(6, 2) check (bpm is null or bpm between 1 and 400),
  musical_key text not null default '',
  genre text not null default '',
  audio_path text,
  audio_name text,
  art_path text,
  art_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tracks_user_updated_idx on public.tracks (user_id, updated_at desc);
alter table public.tracks enable row level security;
drop policy if exists "Track owners can read their tracks" on public.tracks;
drop policy if exists "Track owners can create their tracks" on public.tracks;
drop policy if exists "Track owners can update their tracks" on public.tracks;
drop policy if exists "Track owners can delete their tracks" on public.tracks;
create policy "Track owners can read their tracks" on public.tracks for select to authenticated using (auth.uid() = user_id);
create policy "Track owners can create their tracks" on public.tracks for insert to authenticated with check (auth.uid() = user_id);
create policy "Track owners can update their tracks" on public.tracks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Track owners can delete their tracks" on public.tracks for delete to authenticated using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('track-audio', 'track-audio', false, 52428800, array['audio/mpeg']),
  ('track-art', 'track-art', false, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do update set public = false;

drop policy if exists "Owners manage their track audio" on storage.objects;
create policy "Owners manage their track audio" on storage.objects for all to authenticated
using (bucket_id = 'track-audio' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'track-audio' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Owners manage their track art" on storage.objects;
create policy "Owners manage their track art" on storage.objects for all to authenticated
using (bucket_id = 'track-art' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'track-art' and (storage.foldername(name))[1] = auth.uid()::text);
