/*
# Muyarchi Academy — Full Database Schema

## Overview
Creates the complete schema for the Muyarchi Academy coaching-institute website.
The app has two sides: a public website (anon reads content, anon submits forms)
and an admin panel (authenticated admin manages all content).

## New Tables
1. `courses` — Coaching programs (NEET, Engineering, Foundation, etc.) with title, description, duration, fees, eligibility, thumbnail, status, sort order.
2. `blogs` — Blog articles with title, description, content, author, thumbnail, published flag, published_at timestamp.
3. `events` — Events with title, description, event_date, cover image, image gallery URLs, video gallery URLs.
4. `testimonials` — Student testimonials with author name, role, content, rating (1-5), avatar, sort order.
5. `media_library` — Media assets (images, videos, audio, documents) with name, type, URL, thumbnail.
6. `scholarship` — Singleton row (id=1) holding scholarship test page content: hero, how-it-works cards, eligibility, test date, venues, sample paper link.
7. `scholarship_registrations` — Public form submissions for scholarship test registration (student name, class, school, parent name, parent phone, town/village).
8. `enquiries` — Public contact form submissions (name, phone, class/course, message).
9. `demo_registrations` — Public free-demo form submissions (student name, class, phone, preferred time, message).
10. `site_settings` — Singleton row (id=1) holding all site-wide settings: hero title/subtitle, about, vision, mission, contact info, social links, stats, logo, academy name.

## Shared Infrastructure
- `set_updated_at()` trigger function to keep `updated_at` fresh on every UPDATE.
- Triggers on all tables that have `updated_at`.
- Indexes on frequently queried columns (status, sort_order, published, event_date, created_at, type).
- Singleton seed rows for `site_settings` (id=1) and `scholarship` (id=1).

## Security (RLS)
- Content tables (courses, blogs, events, testimonials, media_library, site_settings, scholarship):
  - Public SELECT (anon + authenticated can read).
  - Authenticated admin full write (insert, update, delete).
- Form submission tables (scholarship_registrations, enquiries, demo_registrations):
  - Public INSERT (anon can submit forms without signing in).
  - Authenticated admin SELECT + DELETE (only admins can view and remove submissions).

## Notes
1. All statements are idempotent (IF NOT EXISTS, DROP POLICY IF EXISTS, ON CONFLICT DO NOTHING) — safe to re-run.
2. pgcrypto extension is enabled for gen_random_uuid().
3. Admin users must be created via Supabase Dashboard → Authentication → Users → "Add user" (email + password), then log in at /admin/login.
*/

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Shared trigger: keep updated_at fresh on every UPDATE
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
-- SCHOLARSHIP  (single row, id = 1)
-- ============================================================
create table if not exists public.scholarship (
  id                        integer primary key default 1 check (id = 1),
  hero_title                text not null default '',
  hero_description          text not null default '',
  how_it_works_title        text not null default '',
  how_it_works_description  text not null default '',
  card1_title               text not null default '',
  card1_text                text not null default '',
  card2_title               text not null default '',
  card2_text                text not null default '',
  card3_title               text not null default '',
  card3_text                text not null default '',
  test_details_title        text not null default '',
  eligibility               text not null default '',
  duration                  text not null default '',
  test_date                 text not null default '',
  venues                    text not null default '',
  sample_paper_link         text not null default '',
  updated_at                timestamptz not null default now()
);

drop trigger if exists scholarship_set_updated_at on public.scholarship;
create trigger scholarship_set_updated_at
  before update on public.scholarship
  for each row execute function public.set_updated_at();

insert into public.scholarship (id) values (1)
on conflict (id) do nothing;

-- ============================================================
-- SCHOLARSHIP REGISTRATIONS
-- ============================================================
create table if not exists public.scholarship_registrations (
  id            uuid primary key default gen_random_uuid(),
  student_name  text not null,
  class         text not null,
  school        text not null,
  parent_name   text not null,
  parent_phone  text not null,
  town_village  text not null,
  created_at    timestamptz not null default now()
);

create index if not exists scholarship_registrations_created_at_idx on public.scholarship_registrations (created_at desc);

-- ============================================================
-- ENQUIRIES
-- ============================================================
create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null,
  class_course  text not null,
  message       text not null,
  created_at    timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- ============================================================
-- DEMO REGISTRATIONS
-- ============================================================
create table if not exists public.demo_registrations (
  id            uuid primary key default gen_random_uuid(),
  student_name  text not null,
  class         text not null,
  phone         text not null,
  preferred_time text not null,
  message       text not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists demo_registrations_created_at_idx on public.demo_registrations (created_at desc);

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
  academy_name   text not null default 'Muyarchi Academy',
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

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) users: read-only on content tables, insert-only on form tables.
-- Authenticated admins: full read/write on content tables, read/delete on form tables.
-- ============================================================
alter table public.courses       enable row level security;
alter table public.blogs         enable row level security;
alter table public.events        enable row level security;
alter table public.testimonials  enable row level security;
alter table public.media_library enable row level security;
alter table public.site_settings enable row level security;
alter table public.scholarship   enable row level security;
alter table public.scholarship_registrations enable row level security;
alter table public.enquiries     enable row level security;
alter table public.demo_registrations enable row level security;

-- COURSES
drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read" on public.courses
  for select using (true);
drop policy if exists "courses_admin_insert" on public.courses;
create policy "courses_admin_insert" on public.courses
  for insert to authenticated with check (true);
drop policy if exists "courses_admin_update" on public.courses;
create policy "courses_admin_update" on public.courses
  for update to authenticated using (true) with check (true);
drop policy if exists "courses_admin_delete" on public.courses;
create policy "courses_admin_delete" on public.courses
  for delete to authenticated using (true);

-- BLOGS
drop policy if exists "blogs_public_read" on public.blogs;
create policy "blogs_public_read" on public.blogs
  for select using (true);
drop policy if exists "blogs_admin_insert" on public.blogs;
create policy "blogs_admin_insert" on public.blogs
  for insert to authenticated with check (true);
drop policy if exists "blogs_admin_update" on public.blogs;
create policy "blogs_admin_update" on public.blogs
  for update to authenticated using (true) with check (true);
drop policy if exists "blogs_admin_delete" on public.blogs;
create policy "blogs_admin_delete" on public.blogs
  for delete to authenticated using (true);

-- EVENTS
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (true);
drop policy if exists "events_admin_insert" on public.events;
create policy "events_admin_insert" on public.events
  for insert to authenticated with check (true);
drop policy if exists "events_admin_update" on public.events;
create policy "events_admin_update" on public.events
  for update to authenticated using (true) with check (true);
drop policy if exists "events_admin_delete" on public.events;
create policy "events_admin_delete" on public.events
  for delete to authenticated using (true);

-- TESTIMONIALS
drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
  for select using (true);
drop policy if exists "testimonials_admin_insert" on public.testimonials;
create policy "testimonials_admin_insert" on public.testimonials
  for insert to authenticated with check (true);
drop policy if exists "testimonials_admin_update" on public.testimonials;
create policy "testimonials_admin_update" on public.testimonials
  for update to authenticated using (true) with check (true);
drop policy if exists "testimonials_admin_delete" on public.testimonials;
create policy "testimonials_admin_delete" on public.testimonials
  for delete to authenticated using (true);

-- MEDIA LIBRARY
drop policy if exists "media_public_read" on public.media_library;
create policy "media_public_read" on public.media_library
  for select using (true);
drop policy if exists "media_admin_insert" on public.media_library;
create policy "media_admin_insert" on public.media_library
  for insert to authenticated with check (true);
drop policy if exists "media_admin_update" on public.media_library;
create policy "media_admin_update" on public.media_library
  for update to authenticated using (true) with check (true);
drop policy if exists "media_admin_delete" on public.media_library;
create policy "media_admin_delete" on public.media_library
  for delete to authenticated using (true);

-- SITE SETTINGS
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);
drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update" on public.site_settings
  for update to authenticated using (true) with check (true);

-- SCHOLARSHIP
drop policy if exists "scholarship_public_read" on public.scholarship;
create policy "scholarship_public_read" on public.scholarship
  for select using (true);
drop policy if exists "scholarship_admin_update" on public.scholarship;
create policy "scholarship_admin_update" on public.scholarship
  for update to authenticated using (true) with check (true);

-- SCHOLARSHIP REGISTRATIONS
drop policy if exists "scholarship_registrations_public_insert" on public.scholarship_registrations;
create policy "scholarship_registrations_public_insert" on public.scholarship_registrations
  for insert with check (true);
drop policy if exists "scholarship_registrations_admin_read" on public.scholarship_registrations;
create policy "scholarship_registrations_admin_read" on public.scholarship_registrations
  for select to authenticated using (true);
drop policy if exists "scholarship_registrations_admin_delete" on public.scholarship_registrations;
create policy "scholarship_registrations_admin_delete" on public.scholarship_registrations
  for delete to authenticated using (true);

-- ENQUIRIES
drop policy if exists "enquiries_public_insert" on public.enquiries;
create policy "enquiries_public_insert" on public.enquiries
  for insert with check (true);
drop policy if exists "enquiries_admin_read" on public.enquiries;
create policy "enquiries_admin_read" on public.enquiries
  for select to authenticated using (true);
drop policy if exists "enquiries_admin_delete" on public.enquiries;
create policy "enquiries_admin_delete" on public.enquiries
  for delete to authenticated using (true);

-- DEMO REGISTRATIONS
drop policy if exists "demo_registrations_public_insert" on public.demo_registrations;
create policy "demo_registrations_public_insert" on public.demo_registrations
  for insert with check (true);
drop policy if exists "demo_registrations_admin_read" on public.demo_registrations;
create policy "demo_registrations_admin_read" on public.demo_registrations
  for select to authenticated using (true);
drop policy if exists "demo_registrations_admin_delete" on public.demo_registrations;
create policy "demo_registrations_admin_delete" on public.demo_registrations
  for delete to authenticated using (true);
