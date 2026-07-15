-- ============================================================
-- Muyirchi Academy - Supabase Schema
-- Run this whole file in the Supabase SQL Editor.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Shared trigger: keep updated_at fresh on every UPDATE
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- COURSES
-- ============================================================
create table if not exists public.courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null default '',
  description   text not null default '',
  duration      text not null default '',
  fees          text not null default '',
  eligibility   text not null default '',
  thumbnail_url text not null default '',
  status        text not null default 'active' check (status in ('active','inactive')),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists courses_status_idx     on public.courses (status);
create index if not exists courses_sort_order_idx on public.courses (sort_order);

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- ============================================================
-- BLOGS
-- ============================================================
create table if not exists public.blogs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null default '',
  description   text not null default '',
  content       text not null default '',
  author        text not null default '',
  thumbnail_url text not null default '',
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists blogs_published_idx    on public.blogs (published);
create index if not exists blogs_published_at_idx on public.blogs (published_at desc);

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

-- ============================================================
-- EVENTS
-- ============================================================
create table if not exists public.events (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null default '',
  description        text not null default '',
  event_date         timestamptz,
  cover_image_url    text not null default '',
  image_gallery_urls text[] not null default '{}',
  video_gallery_urls text[] not null default '{}',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists events_event_date_idx on public.events (event_date desc);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null default '',
  author_role text not null default '',
  content     text not null default '',
  rating      integer not null default 5 check (rating between 1 and 5),
  avatar_url  text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists testimonials_sort_order_idx on public.testimonials (sort_order);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ============================================================
-- MEDIA LIBRARY
-- ============================================================
create table if not exists public.media_library (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default '',
  type          text not null default 'image' check (type in ('image','video','audio','document','folder')),
  url           text not null default '',
  thumbnail_url text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists media_library_type_idx       on public.media_library (type);
create index if not exists media_library_created_at_idx on public.media_library (created_at desc);

drop trigger if exists media_library_set_updated_at on public.media_library;
create trigger media_library_set_updated_at
  before update on public.media_library
  for each row execute function public.set_updated_at();

-- ============================================================
-- SITE SETTINGS  (single row, id = 1)
-- ============================================================
create table if not exists public.site_settings (
  id             integer primary key default 1 check (id = 1),
  hero_title     text not null default '',
  hero_subtitle  text not null default '',
  about          text not null default '',
  vision         text not null default '',
  mission        text not null default '',
  phone          text not null default '',
  email          text not null default '',
  address        text not null default '',
  footer_text    text not null default '',
  google_map_url text not null default '',
  logo_url       text not null default '',
  academy_name   text not null default 'Muyirchi Academy',
  facebook_url   text not null default '',
  twitter_url    text not null default '',
  instagram_url  text not null default '',
  youtube_url    text not null default '',
  linkedin_url   text not null default '',
  stat_students  text not null default '',
  stat_courses   text not null default '',
  stat_years     text not null default '',
  updated_at     timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed the singleton settings row so the admin panel has something to update.
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) users: read-only.
-- Authenticated admins: full read/write.
-- ============================================================
alter table public.courses       enable row level security;
alter table public.blogs         enable row level security;
alter table public.events        enable row level security;
alter table public.testimonials  enable row level security;
alter table public.media_library enable row level security;
alter table public.site_settings enable row level security;

-- COURSES
drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read" on public.courses
  for select using (true);
drop policy if exists "courses_admin_write" on public.courses;
create policy "courses_admin_write" on public.courses
  for all to authenticated using (true) with check (true);

-- BLOGS
drop policy if exists "blogs_public_read" on public.blogs;
create policy "blogs_public_read" on public.blogs
  for select using (true);
drop policy if exists "blogs_admin_write" on public.blogs;
create policy "blogs_admin_write" on public.blogs
  for all to authenticated using (true) with check (true);

-- EVENTS
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (true);
drop policy if exists "events_admin_write" on public.events;
create policy "events_admin_write" on public.events
  for all to authenticated using (true) with check (true);

-- TESTIMONIALS
drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
  for select using (true);
drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write" on public.testimonials
  for all to authenticated using (true) with check (true);

-- MEDIA LIBRARY
drop policy if exists "media_public_read" on public.media_library;
create policy "media_public_read" on public.media_library
  for select using (true);
drop policy if exists "media_admin_write" on public.media_library;
create policy "media_admin_write" on public.media_library
  for all to authenticated using (true) with check (true);

-- SITE SETTINGS
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);
drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated using (true) with check (true);

-- ============================================================
-- DONE
-- Next step: create your admin user under
-- Supabase Dashboard -> Authentication -> Users -> "Add user"
-- (email + password), then log in at /admin/login.
-- ============================================================

-- ============================================================
-- MIGRATION: add stat columns if upgrading an existing DB
-- Safe to run even if columns already exist.
-- ============================================================
alter table public.site_settings add column if not exists stat_students text not null default '';
alter table public.site_settings add column if not exists stat_courses  text not null default '';
alter table public.site_settings add column if not exists stat_years    text not null default '';
