-- Tam So Supabase schema v4.1.3
-- Run this in Supabase Dashboard > SQL Editor after Auth is enabled.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  birth_day smallint check (birth_day between 1 and 31),
  birth_month smallint check (birth_month between 1 and 12),
  birth_year smallint check (birth_year between 1 and 3000),
  gender text not null default 'nam' check (gender in ('nam', 'nu')),
  birth_hour smallint check (birth_hour between 0 and 23),
  topic text not null default 'Tổng quan',
  question text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  category_id uuid references public.cms_categories(id) on delete set null,
  featured_image text,
  seo_title text,
  seo_description text,
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_notes enable row level security;
alter table public.cms_categories enable row level security;
alter table public.cms_posts enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update, delete on public.admin_notes to authenticated;
grant select on public.cms_categories to anon, authenticated;
grant select on public.cms_posts to anon, authenticated;
grant insert, update, delete on public.cms_categories to authenticated;
grant insert, update, delete on public.cms_posts to authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert"
  on public.profiles for insert
  with check (public.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
  on public.profiles for delete
  using (public.is_admin());

drop policy if exists "admin_users_select_self_or_admin" on public.admin_users;
create policy "admin_users_select_self_or_admin"
  on public.admin_users for select
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_admin());

drop policy if exists "admin_users_admin_insert" on public.admin_users;
create policy "admin_users_admin_insert"
  on public.admin_users for insert
  with check (public.is_admin());

drop policy if exists "admin_users_admin_update" on public.admin_users;
create policy "admin_users_admin_update"
  on public.admin_users for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_users_admin_delete" on public.admin_users;
create policy "admin_users_admin_delete"
  on public.admin_users for delete
  using (public.is_admin());

drop policy if exists "site_settings_admin_select" on public.site_settings;
create policy "site_settings_admin_select"
  on public.site_settings for select
  using (public.is_admin());

drop policy if exists "site_settings_admin_insert" on public.site_settings;
create policy "site_settings_admin_insert"
  on public.site_settings for insert
  with check (public.is_admin());

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update"
  on public.site_settings for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site_settings_admin_delete" on public.site_settings;
create policy "site_settings_admin_delete"
  on public.site_settings for delete
  using (public.is_admin());

drop policy if exists "admin_notes_admin_select" on public.admin_notes;
create policy "admin_notes_admin_select"
  on public.admin_notes for select
  using (public.is_admin());

drop policy if exists "admin_notes_admin_insert" on public.admin_notes;
create policy "admin_notes_admin_insert"
  on public.admin_notes for insert
  with check (public.is_admin());

drop policy if exists "admin_notes_admin_update" on public.admin_notes;
create policy "admin_notes_admin_update"
  on public.admin_notes for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_notes_admin_delete" on public.admin_notes;
create policy "admin_notes_admin_delete"
  on public.admin_notes for delete
  using (public.is_admin());

drop policy if exists "cms_categories_public_select" on public.cms_categories;
create policy "cms_categories_public_select"
  on public.cms_categories for select
  using (true);

drop policy if exists "cms_categories_admin_insert" on public.cms_categories;
create policy "cms_categories_admin_insert"
  on public.cms_categories for insert
  with check (public.is_admin());

drop policy if exists "cms_categories_admin_update" on public.cms_categories;
create policy "cms_categories_admin_update"
  on public.cms_categories for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "cms_categories_admin_delete" on public.cms_categories;
create policy "cms_categories_admin_delete"
  on public.cms_categories for delete
  using (public.is_admin());

drop policy if exists "cms_posts_public_select_published" on public.cms_posts;
create policy "cms_posts_public_select_published"
  on public.cms_posts for select
  using (status = 'published' and (published_at is null or published_at <= now()));

drop policy if exists "cms_posts_admin_select" on public.cms_posts;
create policy "cms_posts_admin_select"
  on public.cms_posts for select
  using (public.is_admin());

drop policy if exists "cms_posts_admin_insert" on public.cms_posts;
create policy "cms_posts_admin_insert"
  on public.cms_posts for insert
  with check (public.is_admin());

drop policy if exists "cms_posts_admin_update" on public.cms_posts;
create policy "cms_posts_admin_update"
  on public.cms_posts for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "cms_posts_admin_delete" on public.cms_posts;
create policy "cms_posts_admin_delete"
  on public.cms_posts for delete
  using (public.is_admin());

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

drop trigger if exists admin_notes_set_updated_at on public.admin_notes;
create trigger admin_notes_set_updated_at
  before update on public.admin_notes
  for each row
  execute function public.set_updated_at();

drop trigger if exists cms_categories_set_updated_at on public.cms_categories;
create trigger cms_categories_set_updated_at
  before update on public.cms_categories
  for each row
  execute function public.set_updated_at();

drop trigger if exists cms_posts_set_updated_at on public.cms_posts;
create trigger cms_posts_set_updated_at
  before update on public.cms_posts
  for each row
  execute function public.set_updated_at();
