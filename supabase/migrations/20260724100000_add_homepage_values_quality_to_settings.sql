-- Move homepage Values & Quality copy from ui_translations into site_settings
-- so all editable homepage copy lives in one admin page (Settings).

-- 1. Add the new bilingual columns to site_settings.
alter table public.site_settings
  add column if not exists values_title    text not null default '',
  add column if not exists values_title_ta text not null default '',
  add column if not exists values_text     text not null default '',
  add column if not exists values_text_ta  text not null default '',
  add column if not exists quality_title    text not null default '',
  add column if not exists quality_title_ta text not null default '',
  add column if not exists quality_text     text not null default '',
  add column if not exists quality_text_ta  text not null default '';

-- 2. Copy current translation values into site_settings row id = 1.
update public.site_settings
set
  values_title = coalesce((select en from public.ui_translations where key = 'home.valuesTitle'), values_title),
  values_title_ta = coalesce((select ta from public.ui_translations where key = 'home.valuesTitle'), values_title_ta),
  values_text = coalesce((select en from public.ui_translations where key = 'home.valuesText'), values_text),
  values_text_ta = coalesce((select ta from public.ui_translations where key = 'home.valuesText'), values_text_ta),
  quality_title = coalesce((select en from public.ui_translations where key = 'home.qualityTitle'), quality_title),
  quality_title_ta = coalesce((select ta from public.ui_translations where key = 'home.qualityTitle'), quality_title_ta),
  quality_text = coalesce((select en from public.ui_translations where key = 'home.qualityText'), quality_text),
  quality_text_ta = coalesce((select ta from public.ui_translations where key = 'home.qualityText'), quality_text_ta)
where id = 1;

-- 3. Remove the now-unused translation keys so admins do not edit them in two places.
delete from public.ui_translations where key in (
  'home.valuesTitle',
  'home.valuesText',
  'home.qualityTitle',
  'home.qualityText'
);
