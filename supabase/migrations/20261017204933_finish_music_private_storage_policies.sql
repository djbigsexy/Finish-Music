-- Limit private storage operations to signed-in users and their own folder.
drop policy if exists "Owners manage their track audio" on storage.objects;
create policy "Owners manage their track audio" on storage.objects for all to authenticated
using (bucket_id = 'track-audio' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'track-audio' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Owners manage their track art" on storage.objects;
create policy "Owners manage their track art" on storage.objects for all to authenticated
using (bucket_id = 'track-art' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'track-art' and (storage.foldername(name))[1] = (select auth.uid())::text);
