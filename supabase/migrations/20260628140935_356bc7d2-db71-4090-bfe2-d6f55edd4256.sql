ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS toolbox_heading text,
  ADD COLUMN IF NOT EXISTS education_heading text;