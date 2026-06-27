ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS hero_marquee_words text[],
  ADD COLUMN IF NOT EXISTS theme_software jsonb;