/*
# Add Tamil Translation Support

## Overview
Adds Tamil (`_ta`) text columns to all content tables so the admin can enter
Tamil translations alongside the existing English text. Also creates a new
`ui_translations` table for static UI strings (navigation labels, buttons,
section headings) that are not stored in the content tables.

## Modified Tables
1. `courses` — adds title_ta, description_ta, duration_ta, eligibility_ta
2. `blogs` — adds title_ta, description_ta, content_ta
3. `events` — adds title_ta, description_ta
4. `testimonials` — adds author_name_ta, author_role_ta, content_ta
5. `site_settings` — adds hero_title_ta, hero_subtitle_ta, about_ta, vision_ta, mission_ta, footer_text_ta, academy_name_ta
6. `scholarship` — adds hero_title_ta, hero_description_ta, how_it_works_title_ta, how_it_works_description_ta, card1_title_ta, card1_text_ta, card2_title_ta, card2_text_ta, card3_title_ta, card3_text_ta, test_details_title_ta, eligibility_ta, duration_ta, test_date_ta, venues_ta

## New Tables
1. `ui_translations` — key/value pairs for static UI text with en and ta columns.
   - Public read, admin write (same pattern as other content tables).
   - Seeded with all UI string keys used across the public site.

## Security
- ui_translations: public SELECT, authenticated INSERT/UPDATE/DELETE (same as other content tables).

## Notes
1. All column additions use DO $$ ... IF NOT EXISTS ... END $$ blocks — safe to re-run.
2. Tamil columns default to empty string; the frontend falls back to English when Tamil is empty.
3. No existing columns are dropped or modified — fully backwards-compatible.
*/

-- ============================================================
-- COURSES — add Tamil columns
-- ============================================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='title_ta') then
    alter table public.courses add column title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='description_ta') then
    alter table public.courses add column description_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='duration_ta') then
    alter table public.courses add column duration_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='eligibility_ta') then
    alter table public.courses add column eligibility_ta text not null default '';
  end if;
end $$;

-- ============================================================
-- BLOGS — add Tamil columns
-- ============================================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='blogs' and column_name='title_ta') then
    alter table public.blogs add column title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='blogs' and column_name='description_ta') then
    alter table public.blogs add column description_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='blogs' and column_name='content_ta') then
    alter table public.blogs add column content_ta text not null default '';
  end if;
end $$;

-- ============================================================
-- EVENTS — add Tamil columns
-- ============================================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='title_ta') then
    alter table public.events add column title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='description_ta') then
    alter table public.events add column description_ta text not null default '';
  end if;
end $$;

-- ============================================================
-- TESTIMONIALS — add Tamil columns
-- ============================================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='testimonials' and column_name='author_name_ta') then
    alter table public.testimonials add column author_name_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='testimonials' and column_name='author_role_ta') then
    alter table public.testimonials add column author_role_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='testimonials' and column_name='content_ta') then
    alter table public.testimonials add column content_ta text not null default '';
  end if;
end $$;

-- ============================================================
-- SITE_SETTINGS — add Tamil columns
-- ============================================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='site_settings' and column_name='hero_title_ta') then
    alter table public.site_settings add column hero_title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='site_settings' and column_name='hero_subtitle_ta') then
    alter table public.site_settings add column hero_subtitle_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='site_settings' and column_name='about_ta') then
    alter table public.site_settings add column about_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='site_settings' and column_name='vision_ta') then
    alter table public.site_settings add column vision_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='site_settings' and column_name='mission_ta') then
    alter table public.site_settings add column mission_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='site_settings' and column_name='footer_text_ta') then
    alter table public.site_settings add column footer_text_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='site_settings' and column_name='academy_name_ta') then
    alter table public.site_settings add column academy_name_ta text not null default '';
  end if;
end $$;

-- ============================================================
-- SCHOLARSHIP — add Tamil columns
-- ============================================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='hero_title_ta') then
    alter table public.scholarship add column hero_title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='hero_description_ta') then
    alter table public.scholarship add column hero_description_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='how_it_works_title_ta') then
    alter table public.scholarship add column how_it_works_title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='how_it_works_description_ta') then
    alter table public.scholarship add column how_it_works_description_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='card1_title_ta') then
    alter table public.scholarship add column card1_title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='card1_text_ta') then
    alter table public.scholarship add column card1_text_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='card2_title_ta') then
    alter table public.scholarship add column card2_title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='card2_text_ta') then
    alter table public.scholarship add column card2_text_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='card3_title_ta') then
    alter table public.scholarship add column card3_title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='card3_text_ta') then
    alter table public.scholarship add column card3_text_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='test_details_title_ta') then
    alter table public.scholarship add column test_details_title_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='eligibility_ta') then
    alter table public.scholarship add column eligibility_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='duration_ta') then
    alter table public.scholarship add column duration_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='test_date_ta') then
    alter table public.scholarship add column test_date_ta text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='scholarship' and column_name='venues_ta') then
    alter table public.scholarship add column venues_ta text not null default '';
  end if;
end $$;

-- ============================================================
-- UI_TRANSLATIONS — static UI string translations
-- ============================================================
create table if not exists public.ui_translations (
  id    uuid primary key default gen_random_uuid(),
  key   text unique not null,
  en    text not null default '',
  ta    text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists ui_translations_key_idx on public.ui_translations (key);

drop trigger if exists ui_translations_set_updated_at on public.ui_translations;
create trigger ui_translations_set_updated_at
  before update on public.ui_translations
  for each row execute function public.set_updated_at();

-- RLS for ui_translations
alter table public.ui_translations enable row level security;

drop policy if exists "ui_translations_public_read" on public.ui_translations;
create policy "ui_translations_public_read" on public.ui_translations
  for select using (true);

drop policy if exists "ui_translations_admin_insert" on public.ui_translations;
create policy "ui_translations_admin_insert" on public.ui_translations
  for insert to authenticated with check (true);

drop policy if exists "ui_translations_admin_update" on public.ui_translations;
create policy "ui_translations_admin_update" on public.ui_translations
  for update to authenticated using (true) with check (true);

drop policy if exists "ui_translations_admin_delete" on public.ui_translations;
create policy "ui_translations_admin_delete" on public.ui_translations
  for delete to authenticated using (true);

-- Seed UI translation keys (English values filled, Tamil left empty for admin to fill)
insert into public.ui_translations (key, en) values
  -- Navigation
  ('nav.home', 'Home'),
  ('nav.courses', 'Courses'),
  ('nav.scholarship', 'Scholarship'),
  ('nav.events', 'Events'),
  ('nav.blog', 'Blog'),
  ('nav.contact', 'Contact'),
  ('nav.freeDemo', 'Free Demo'),
  ('nav.about', 'About'),
  -- Home page
  ('home.ourCourses', 'Our Courses'),
  ('home.viewAllCourses', 'View All Courses'),
  ('home.whyChooseUs', 'Why Choose Us'),
  ('home.upcomingEvents', 'Upcoming Events'),
  ('home.viewAllEvents', 'View All Events'),
  ('home.latestBlog', 'Latest from the Blog'),
  ('home.viewAllBlogs', 'View All Articles'),
  ('home.testimonials', 'Student Testimonials'),
  ('home.aboutTitle', 'About Muyarchi Academy'),
  ('home.aboutCta', 'Learn More About Us'),
  ('home.exploreCourses', 'Explore Courses'),
  ('home.bookDemo', 'Book a Free Demo'),
  ('home.learnMore', 'Learn More'),
  -- Courses page
  ('courses.title', 'Our Courses'),
  ('courses.subtitle', 'Quality coaching programs designed to help students excel'),
  ('courses.viewDetails', 'View Details'),
  ('courses.duration', 'Duration'),
  ('courses.eligibility', 'Eligibility'),
  ('courses.noCourses', 'Courses will be listed here soon. Please check back later.'),
  -- Course detail
  ('courseDetail.duration', 'Duration'),
  ('courseDetail.eligibility', 'Eligibility'),
  ('courseDetail.fees', 'Fees'),
  ('courseDetail.enrollNow', 'Enroll Now'),
  ('courseDetail.backToCourses', 'Back to Courses'),
  ('courseDetail.aboutCourse', 'About this Course'),
  -- Scholarship page
  ('scholarship.registerNow', 'Register Now'),
  ('scholarship.howItWorks', 'How It Works'),
  ('scholarship.testDetails', 'Test Details'),
  ('scholarship.eligibility', 'Eligibility'),
  ('scholarship.duration', 'Duration'),
  ('scholarship.testDate', 'Test Date'),
  ('scholarship.venues', 'Venues'),
  ('scholarship.samplePaper', 'Download Sample Paper'),
  ('scholarship.formTitle', 'Scholarship Test Registration'),
  ('scholarship.studentName', 'Student Name'),
  ('scholarship.class', 'Class'),
  ('scholarship.school', 'School'),
  ('scholarship.parentName', 'Parent Name'),
  ('scholarship.parentPhone', 'Parent Phone'),
  ('scholarship.townVillage', 'Town / Village'),
  ('scholarship.submit', 'Submit Registration'),
  ('scholarship.successMsg', 'Registration submitted successfully! We will contact you soon.'),
  -- Events
  ('events.title', 'Events'),
  ('events.viewDetails', 'View Details'),
  ('events.noEvents', 'No events scheduled at the moment. Please check back later.'),
  ('eventDetail.gallery', 'Gallery'),
  ('eventDetail.back', 'Back to Events'),
  -- Blog
  ('blog.title', 'Blog'),
  ('blog.readMore', 'Read More'),
  ('blog.noArticles', 'No articles published yet. Please check back soon.'),
  ('blogDetail.back', 'Back to Blog'),
  ('blogDetail.by', 'By'),
  ('blogDetail.publishedOn', 'Published on'),
  -- Contact
  ('contact.title', 'Contact Us'),
  ('contact.subtitle', 'We would love to hear from you. Reach out with any questions.'),
  ('contact.formTitle', 'Send Us a Message'),
  ('contact.name', 'Your Name'),
  ('contact.phone', 'Phone Number'),
  ('contact.classCourse', 'Class / Course'),
  ('contact.message', 'Message'),
  ('contact.submit', 'Send Message'),
  ('contact.successMsg', 'Thank you! We will get back to you soon.'),
  ('contact.phoneLabel', 'Call Us'),
  ('contact.emailLabel', 'Email Us'),
  ('contact.addressLabel', 'Visit Us'),
  ('contact.mapLabel', 'Find Us'),
  ('contact.noContactInfo', 'Contact information will be available soon.'),
  -- Free Demo
  ('freeDemo.title', 'Book a Free Demo'),
  ('freeDemo.subtitle', 'Experience our teaching firsthand. Register for a free demo class today.'),
  ('freeDemo.studentName', 'Student Name'),
  ('freeDemo.class', 'Class'),
  ('freeDemo.phone', 'Phone Number'),
  ('freeDemo.preferredTime', 'Preferred Time'),
  ('freeDemo.message', 'Message (optional)'),
  ('freeDemo.submit', 'Register for Demo'),
  ('freeDemo.successMsg', 'Thank you! We will contact you to schedule your demo class.'),
  -- Footer
  ('footer.quickLinks', 'Quick Links'),
  ('footer.contactUs', 'Contact Us'),
  ('footer.followUs', 'Follow Us'),
  ('footer.rights', 'All rights reserved.'),
  -- Common
  ('common.loading', 'Loading...'),
  ('common.error', 'Something went wrong. Please try again.'),
  ('common.readMore', 'Read More'),
  ('common.viewAll', 'View All'),
  ('common.learnMore', 'Learn More')
on conflict (key) do nothing;
