ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS hero_headline text,
  ADD COLUMN IF NOT EXISTS hero_subheadline text,
  ADD COLUMN IF NOT EXISTS hero_cta_text text,
  ADD COLUMN IF NOT EXISTS hero_cta_link text,
  ADD COLUMN IF NOT EXISTS about_image_url text,
  ADD COLUMN IF NOT EXISTS about_text text,
  ADD COLUMN IF NOT EXISTS footer_text text,
  ADD COLUMN IF NOT EXISTS browser_title text,
  ADD COLUMN IF NOT EXISTS section_visibility jsonb DEFAULT '{}'::jsonb;