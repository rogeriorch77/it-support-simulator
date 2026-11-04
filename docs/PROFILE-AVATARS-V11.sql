-- IT Support Simulator v1.1 — additive user appearance fields; XP remains untouched.
alter table public.profiles
  add column if not exists display_name text,
  add column if not exists avatar_kind text not null default 'provider',
  add column if not exists avatar_id text,
  add column if not exists custom_avatar_path text,
  add column if not exists profile_setup_completed boolean not null default false;
do $$
begin
  if not exists (select 1 from pg_constraint where conname='profiles_display_name_v11_check' and conrelid='public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_display_name_v11_check
      check (display_name is null or (
        char_length(display_name) between 3 and 24 and
        display_name ~ '^[[:alnum:] _.-]+$'
      ));
  end if;
  if not exists (select 1 from pg_constraint where conname='profiles_avatar_kind_v11_check' and conrelid='public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_avatar_kind_v11_check
      check (avatar_kind in ('provider','mascot','upload'));
  end if;
  if not exists (select 1 from pg_constraint where conname='profiles_avatar_id_v11_check' and conrelid='public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_avatar_id_v11_check
      check (avatar_id is null or avatar_id in (
        'cloudbot','penguindev','cyberhusky','terminalcat','rootbot','shadowbyte',
        'redpanda','astrobot','retrobyte','bluedragon','debugduck','nerdowl'
      ));
  end if;
  if not exists (select 1 from pg_constraint where conname='profiles_avatar_path_v11_check' and conrelid='public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_avatar_path_v11_check
      check (custom_avatar_path is null or custom_avatar_path in (
        id::text || '/avatar.webp', id::text || '/avatar.png'
      ));
  end if;
end $$;
-- Profile photos are public only for leaderboard display. Uploads are owner-scoped.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('profile-avatars','profile-avatars',true,1048576,array['image/webp','image/png'])
on conflict (id) do update set public=true,file_size_limit=1048576,
  allowed_mime_types=array['image/webp','image/png'];
do $$
begin
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='profile_avatars_owner_select_v11') then
    create policy profile_avatars_owner_select_v11 on storage.objects
      for select to authenticated
      using (bucket_id='profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
  end if;
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='profile_avatars_owner_insert_v11') then
    create policy profile_avatars_owner_insert_v11 on storage.objects
      for insert to authenticated
      with check (bucket_id='profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
        and storage.filename(name) in ('avatar.webp','avatar.png'));
  end if;
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='profile_avatars_owner_update_v11') then
    create policy profile_avatars_owner_update_v11 on storage.objects
      for update to authenticated
      using (bucket_id='profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
      with check (bucket_id='profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
        and storage.filename(name) in ('avatar.webp','avatar.png'));
  end if;
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='profile_avatars_owner_delete_v11') then
    create policy profile_avatars_owner_delete_v11 on storage.objects
      for delete to authenticated
      using (bucket_id='profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
  end if;
end $$;
