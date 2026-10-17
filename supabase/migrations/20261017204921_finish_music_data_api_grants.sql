-- Expose only signed-in row operations to the browser Data API.
grant select, insert, update, delete on public.tracks to authenticated;
revoke all on public.tracks from anon;

drop policy if exists "Track owners can read their tracks" on public.tracks;
drop policy if exists "Track owners can create their tracks" on public.tracks;
drop policy if exists "Track owners can update their tracks" on public.tracks;
drop policy if exists "Track owners can delete their tracks" on public.tracks;
create policy "Track owners can read their tracks" on public.tracks for select to authenticated using ((select auth.uid()) = user_id);
create policy "Track owners can create their tracks" on public.tracks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Track owners can update their tracks" on public.tracks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Track owners can delete their tracks" on public.tracks for delete to authenticated using ((select auth.uid()) = user_id);
