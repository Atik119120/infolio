ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS about_headline text,
  ADD COLUMN IF NOT EXISTS about_stats jsonb;