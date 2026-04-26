-- ============================================================
-- IT Support Simulator N1/N2 — Supabase Schema
-- Colar no SQL Editor do Supabase e clicar Run
-- ============================================================

-- Tabela de perfis públicos
create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  github_username text not null default '',
  github_avatar   text not null default '',
  total_xp        integer not null default 0,
  quizzes_played  integer not null default 0,
  total_correct   integer not null default 0,
  total_answered  integer not null default 0,
  best_score      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Qualquer pessoa pode ler os perfis (ranking público)
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Utilizador só pode inserir o seu próprio perfil
create policy "profiles_own_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Utilizador só pode atualizar o seu próprio perfil
create policy "profiles_own_update"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: cria perfil automaticamente no primeiro login
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, github_username, github_avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
